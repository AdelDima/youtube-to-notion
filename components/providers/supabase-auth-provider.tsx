
'use client'

import { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect } from 'react'
import useSWR from 'swr'
import { useSupabase } from '@/components/providers/supabase-context'
import { Profile } from '@/lib/database.types'
import { toast } from '@/components/ui/use-toast'
interface ContextI {
  user: Profile | null | undefined
  error: any
  isLoading: boolean
  mutate: any
  signOut: () => Promise<void>
  signInWithNotion: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  reconnectToNotion: () => Promise<void>
  refreshToken: () => Promise<void>
}
const Context = createContext<ContextI>({
  user: null,
  error: null,
  isLoading: true,
  mutate: null,
  signOut: async () => { },
  signInWithNotion: async () => { },
  signInWithEmail: async () => { },
  reconnectToNotion: async () => { },
  refreshToken: async () => { },
})

export default function SupabaseAuthProvider({
  serverSession,
  children,
}: {
  serverSession?: Session | null
  children: React.ReactNode
}) {
  const { supabase } = useSupabase()
  const router = useRouter()

  // Get USER
  const getUser = async () => {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', serverSession?.user?.id)
      .single()
    if (error) {
      console.log(error)
      return null
    } else {
      return user
    }
  }

  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR(serverSession ? 'profile-context' : null, getUser)

  // Sign Out
  const signOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  // Sign-In with Github
  const signInWithNotion = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'notion' })
  }


  /**
   * Description: Sign in with email and password.
   * @param email
   * @param password 
   */
  const signInWithEmail = async (email: string, password: string) => {
    await supabase.auth.signInWithPassword({
      email,
      password,
    })
  }

  const reconnectToNotion = async () => {
    try {
      // Remove local token if it exists
      await localStorage.removeItem('provider_token');
      // Attempt to reconnect to Notion after removing token
      await signInWithNotion();
    } catch (error) {
      console.error('Error during reconnection:', error);
    }
  }


  async function refreshToken() {
    try {
      const local_provider_token = localStorage.getItem('provider_token') as string;
      const db_provider_token = user?.provider_token as string;
      if (local_provider_token === db_provider_token) {
        await localStorage.removeItem('provider_token');
        toast({ title: '👌 Token already up to date. If you wish to authenticate, please reconnect to Notion' })
        return;
      }
      if (!local_provider_token) {
        toast({ variant: 'destructive', title: 'Please sign in again' })
        return;
      }
      let { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        provider_token: local_provider_token,
        updated_at: new Date().toISOString(),
      })
      if (error) {
        toast({ variant: 'destructive', title: error.message })
        throw new Error('Error refreshing session');
      } else {
        toast({ title: '✅ Notion Token updated' })
        return;
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  }

  // Refresh the Page to Sync Server and Client
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        localStorage.setItem('provider_token', session?.provider_token as string)
      }
      if (session?.access_token !== serverSession?.access_token) {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase, serverSession?.access_token])

  const exposed: ContextI = {
    user,
    error,
    isLoading,
    mutate,
    signOut,
    signInWithNotion,
    signInWithEmail,
    reconnectToNotion,
    refreshToken
  }

  return <Context.Provider value={exposed}>{children}</Context.Provider>
}

export const useAuth = () => {
  let context = useContext(Context)
  if (context === undefined) {
    throw new Error('useAuth must be used inside SupabaseAuthProvider')
  } else {
    return context
  }
}
