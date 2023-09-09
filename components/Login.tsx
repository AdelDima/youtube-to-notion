'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import { Icons } from '@/components/icons'



export function Login(props: { login: boolean }) {

  const { signInWithNotion } = useAuth()
  return (
    <Button className="w-full" onClick={signInWithNotion}>
      <Icons.notion className="w-5 h-5 mr-2" />
      {props.login ? 'Login' : 'Register'} with Notion
    </Button>
  )
}
