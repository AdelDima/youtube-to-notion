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
import axios from 'axios';

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

    resolver: zodResolver(formSchema as any),
    defaultValues: {
      playlist: '',
      database_id: user?.database_id || '',
    },
  })

  async function addPlaylistHomePage(

    info: any,
    token: string,
    notion_db_id: string,
    playlistId: string
  ) {
    const url = 'api/notion/add-playlist-homepage';
    const data = {
      playlistId: playlistId,
      info: info,
      notion_db_id: notion_db_id,
      token: token,
    };
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };
    try {
      const response = await axios.post(url, data, { headers });
      return response.data.notion_response.id;
    } catch (error) {
      if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
        handleErrorResponse(error.response?.data.message || error.message)
      }
      return ''
    }
  }

  interface ValidationError {
    message: string;
    errors: Record<string, string[]>
  }

  async function addPlaylistDatabase(

    info: any,
    token: string,
    notion_db_id: string
  ): Promise<string> {
    const url = 'api/notion/create-playlist-db';
    const data = {
      title: info.title,
      author: info.author.name,
      thumbnails: info.thumbnails,
      total_items: info.total_items,
      last_updated: info.last_updated,
      description: info.description,
      notion_db_id: notion_db_id,
      token: token,
    };
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(url, data, { headers });
      return response.data.notion_response.id
    } catch (error) {
      if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
        handleErrorResponse(error.message)
      }
      return ''
    }
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
    const progressStep = 100 / vids.length
    for (const vid of vids.reverse()) {
      const url = 'api/notion/add-videos-to-playlist-db';
      const data = {
        id: vid.id,
        duration: vid.duration,
        title: vid.title,
        thumbnails: vid.thumbnails,
        notion_db_id: notion_db_id,
        token: token,
      };
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      };

      await axios.post(url, data, { headers }).then(() => {
        setProgress((prev) => prev + progressStep)
      }).catch((error) => {
        handleErrorResponse(error)
        return false
      });
    }
    return true
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

      const url = new URL(values.playlist);
      const params = new URLSearchParams(url.search);
      const playlist_id = params.get('list');

      console.log(playlist_id)
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
        const data = {
          playlist: playlist_id
        };
        const headers = {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        };
        const response = await axios.post(`api/youtube/get-playlist`, data, { headers });

        if (response.status !== 200) {
          handleErrorResponse('Playlist not found');
          resolve();
          return; // Return early after handling error
        }

        const _data = response.data;

        const videos = new Map<string, any>(Object.entries(_data.videos))
        let vids: IVideo[] = []

        // let finalRes: Promise<AxiosResponse<any, any>>
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
        const homePageId = await addPlaylistHomePage(
          _data.info,
          user?.provider_token || '',
          values.database_id,
          playlist_id
        )

        if (!homePageId) {
          return
        }

        const playlistId = await addPlaylistDatabase(
          _data.info,
          user?.provider_token || '',
          homePageId
        )

        if (!playlistId) {
          resolve()
          return
        }

        const finalNotionRes = await addPlaylistToNotion(
          vids,
          user?.provider_token || '',
          playlistId
        )
        if (finalNotionRes) {
          toast({
            description: 'Imported successfully! 😊',
          })
        } {
          return
        }

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

  const handleFocus = (event: { target: { select: () => any } }) => event.target.select();

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
                    onFocus={handleFocus}
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
