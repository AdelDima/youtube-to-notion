'use client'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import IVideo from '@/interfaces/IVideo'
import { useAuth } from '../providers/supabase-auth-provider'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Progress } from '../ui/progress'
import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { extractNotionDbIdFromUrl } from '@/lib/utils'
import { useSupabase } from '@/components/providers/supabase-context'

export function AfterLoginForm() {
  const { supabase } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchOn, setIsSwitchOn] = useState(true)
  const [isDatabaseIdEmpty, setIsDatabaseIdEmpty] = useState(true)
  const [progress, setProgress] = useState(0)
  const { user } = useAuth()
  const { toast } = useToast()
  const formSchema = z.object({
    playlist: z.string().url({
      message: 'Please enter a valid URL.',
    }),
    database_id: z.string().min(5, {
      message: 'playlist must be at least 5 characters.',
    }),
  })

  useEffect(() => {
    if (user?.database_id) {
      setIsSwitchOn(false)
      setIsDatabaseIdEmpty(false)
    }
  }, [user])
  function handleSwitchChange() {
    setIsSwitchOn(!isSwitchOn)
  }

  type ValidationSchema = z.infer<typeof formSchema>
  const form = useForm<ValidationSchema>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      playlist: '',
      database_id: user?.database_id || '',
    },
  })

  async function addPlaylistHomePage(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: any,
    token: string,
    notion_db_id: string,
    playlistId: string
  ) {
    let response
    const res = await fetch('api/notion/add-playlist-homepage', {
      method: 'POST',
      body: JSON.stringify({
        playlistId: playlistId,
        info: info,
        notion_db_id: notion_db_id,
        token: token,
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
    response = res
    if (!res.ok) {
      done()
    }

    return response
  }

  async function addPlaylistDatabase(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: any,
    token: string,
    notion_db_id: string
  ) {
    let response
    const res = await fetch('api/notion/create-playlist-db', {
      method: 'POST',
      body: JSON.stringify({
        title: info.title,
        author: info.author.name,
        thumbnails: info.thumbnails,
        total_items: info.total_items,
        last_updated: info.last_updated,
        description: info.description,
        notion_db_id: notion_db_id,
        token: token,
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
    response = res
    if (!res.ok) {
      done()
    }

    return response
  }

  /**
   *  Add playlist to Notion database
   * @param vids  Array of videos to add to Notion
   * @param token  User's notion token
   * @param notion_db_id  Notion database id
   * @returns  Response
   */
  async function addPlaylistToNotion(
    vids: IVideo[],
    token: string,
    notion_db_id: string
  ) {
    let response
    const progressStep = 100 / vids.length
    for (const vid of vids.reverse()) {
      const res = await fetch('api/notion/add-videos-to-playlist-db', {
        method: 'POST',
        body: JSON.stringify({
          id: vid.id,
          duration: vid.duration,
          title: vid.title,
          thumbnails: vid.thumbnails,
          notion_db_id: notion_db_id,
          token: token,
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      })
      response = res
      if (!res.ok) {
        done()
        break
      }
      setProgress((prev) => prev + progressStep)
    }
    return response
  }

  // crease done function stop loading and set progress to 0
  function done() {
    setIsLoading(false)
    setProgress(0)
  }

  async function update_database_id(values: z.infer<typeof formSchema>) {
    if (!user?.database_id || user?.database_id !== values.database_id) {
      let { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        database_id: extractNotionDbIdFromUrl(values.database_id),
        updated_at: new Date().toISOString(),
      })
      if (error) {
        done()
        toast({ variant: 'destructive', title: error.message })
        return false
      } else {
        return true
      }
    }
    return true
  }
  // 2. Define a submit handler.
  function importPlaylistNow(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    return new Promise<void>(async (resolve) => {
      const playlist_id: string = values.playlist.split('list=')[1]

      if (!playlist_id) {
        done()
        resolve()
        return
      }

      const updateSuccess = await update_database_id(values)
      if (!updateSuccess) {
        done()
        resolve()
        return
      }

      try {
        const res = await fetch(
          `api/youtube/get-playlist?playlist=${playlist_id}`
        )
        if (!res.ok) {
          handleErrorResponse('Playlist not found')
          resolve()
          return
        }
        const _data = await res.json()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const videos = new Map<string, any>(Object.entries(_data.videos))
        let vids: IVideo[] = []
        let finalRes: Response | undefined
        // setProgress by the number of videos in the playlist
        videos.forEach(async (video) => {
          const vid: IVideo = {
            id: video.id,
            title: video.title.text,
            author: video.author.name,
            duration: video.duration.text,
            thumbnails: video.thumbnails[3].url,
          }
          vids.push(vid)
        })

        // add playlist home page to Notion
        finalRes = await addPlaylistHomePage(
          _data.info,
          user?.provider_token || '',
          values.database_id,
          playlist_id
        )

        if (!finalRes!.ok) {
          const data = await finalRes?.json()
          handleErrorResponse(data.error)
          resolve()
          return
        }

        const _res = await finalRes?.json()
        const homePageId = _res.notion_response.id

        finalRes = await addPlaylistDatabase(
          _data.info,
          user?.provider_token || '',
          homePageId
        )

        if (!finalRes!.ok) {
          const data = await finalRes?.json()
          handleErrorResponse(data.error)
          resolve()
          return
        }

        const __res = await finalRes?.json()
        const playlistId = __res.notion_response.id

        finalRes = await addPlaylistToNotion(
          vids,
          user?.provider_token || '',
          playlistId
        )

        if (finalRes!.ok) {
          toast({
            description: 'Imported successfully! 😊',
          })
          done()
          resolve()
        } else {
          const data = await finalRes?.json()
          handleErrorResponse(data.error)
          resolve()
          return
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any | Error) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: error.message,
        })
        done()
        resolve()
        return
      } finally {
        done()
        return
      }
    })
  }

  function handleErrorResponse(error: string) {
    toast({
      variant: 'destructive',
      title: 'Uh oh! Something went wrong.',
      description: error,
    })
    done()
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(importPlaylistNow)}
        className="space-y-8"
      >
        {isLoading && <Progress value={progress} />}
        <FormField
          control={form.control}
          name="playlist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Youtube Playlist Link</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="https://www.youtube.com/watch?v=bbcm9OLTnsE&list=PLz..."
                  {...field}
                  required
                />
              </FormControl>
              <FormDescription>
                Link to the playlist you want to import.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="database_id"
          render={({ field }) => (
            <div
              className={` ${isDatabaseIdEmpty ? '' : 'rounded-lg border p-3 shadow-sm'
                }`}
            >
              <div
                className={`flex flex-row items-center justify-between text-muted-foreground ${isDatabaseIdEmpty ? 'hidden' : ''
                  }`}
              >
                <FormLabel>Edit notion database</FormLabel>
                <Switch
                  id="connection-type"
                  checked={isSwitchOn}
                  onClick={handleSwitchChange}
                />
              </div>

              <FormItem hidden={!isSwitchOn} className="mt-4">
                <FormLabel>Notion Database URL or ID</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="https://www.notion.so/fc42b..."
                    {...field}
                    required
                  />
                </FormControl>
                <FormDescription>
                  Duplicate the
                  <a
                    href="https://dimalab.notion.site/Youtube-To-Notion-b061f56a9eb746f6a209a4e3fb4c80ea?pvs=4"
                    className="text-foreground"
                  >
                    {' '}
                    template{' '}
                  </a>
                  and copy the Notion URL
                </FormDescription>
              </FormItem>
            </div>
          )}
        />
        <div className="flex flex-col space-y-1.5">
          <Button className="w-full" disabled={isLoading}>
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Import playlist
          </Button>
        </div>
        <Toaster />
      </form>
    </Form>
  )
}
