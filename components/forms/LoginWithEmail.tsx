'use client'

import {
  Form,
  FormControl,
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
import { useAuth } from '../providers/supabase-auth-provider'
import { Toaster } from '@/components/ui/toaster'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Progress } from '../ui/progress'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'

export function LoginWithEmail() {
  const { signInWithEmail } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [progress] = useState(0)
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })


  type ValidationSchema = z.infer<typeof formSchema>
  const form = useForm<ValidationSchema>({

    resolver: zodResolver(formSchema as any),
    defaultValues: {
      email: '',
      password: '',
    },
  })


  // 2. Define a submit handler.
  function importPlaylistNow(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const x = signInWithEmail(values.email, values.password)
    console.log(x)
    setIsLoading(false)
  }


  const handleFocus = (event: { target: { select: () => any } }) => event.target.select();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(importPlaylistNow)}
        className="space-y-4"
      >
        {isLoading && <Progress value={progress} />}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  disabled={isLoading}
                  {...field}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <div>
              <div className="flex flex-row items-center justify-between text-muted-foreground" >
                <FormLabel>Password</FormLabel>
              </div>

              <FormItem className="mt-4">
                <FormControl>
                  <Input
                    type="password"
                    disabled={isLoading}
                    onFocus={handleFocus}
                    {...field}
                    required
                  />
                </FormControl>
              </FormItem>
            </div>
          )}
        />
        <div className="flex flex-col space-y-1.5">
          <Button className="w-full" disabled={isLoading}>
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
        </div>
        <Toaster />
      </form>
      <Separator className="my-8" />
    </Form>
  )
}
