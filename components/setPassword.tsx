'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Button } from './ui/button'
import { ReloadIcon } from '@radix-ui/react-icons'
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
import { Toaster } from '@/components/ui/toaster'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { useState } from 'react'
import { useSupabase } from '@/components/providers/supabase-context'
import { useToast } from '@/components/ui/use-toast'

export function SetPasswordCart() {
  const { supabase } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const formSchema = z.object({
    password: z.string().min(8),
    confirm_password: z.string().min(8),
  }).refine(data => {
    return data.password === data.confirm_password;
  }, {
    message: "Passwords must match",
    path: ['confirm_password'] // specify the field that will receive the error
  });

  type ValidationSchema = z.infer<typeof formSchema>
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      password: '',
      confirm_password: '',
    },
  })


  async function setNewPassword(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    if (values.password === '' || values.confirm_password === '') {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: "Password should not be empty",
      })
      setIsLoading(false)
      return
    }
    //check password match
    if (values.password !== values.confirm_password) {
      toast({
        variant: 'destructive',
        title: 'Password not match',
      })

      setIsLoading(false)
      return
    }

    //set new password
    const { error: supabaseError } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (supabaseError) {
      toast({
        variant: 'destructive',
        description: supabaseError.message,
      })
      setIsLoading(false)
      return;
    }

    toast({
      description: "Password updated successfully",
    })

    setIsLoading(false)
  }

  return (
    <Card className="w-[450px]">

      <CardHeader>
        <CardTitle className="text-2xl">Set your password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(setNewPassword)}
            className="space-y-4 rounded-md mb-4 bg-muted/30"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
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
              name="confirm_password"
              render={({ field }) => (
                <div>
                  <div className="flex flex-row items-center justify-between text-muted-foreground" >
                    <FormLabel>Confirm Password</FormLabel>
                  </div>

                  <FormItem className="mt-4">
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isLoading}
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <div className="flex flex-col space-y-1.5">
              <Button className="w-full" disabled={isLoading}>
                {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                Set Password
              </Button>
            </div>
            <Toaster />
          </form>
          <Separator className="my-8" />
        </Form>
      </CardContent>
    </Card>
  )
}
