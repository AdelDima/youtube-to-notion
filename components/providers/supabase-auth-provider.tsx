
'use client'

import { Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect } from 'react'
import useSWR from 'swr'
import { useSupabase } from '@/components/providers/supabase-context'
import { Profile } from '@/lib/database.types'
interface ContextI {
  user: Profile | null | undefined
  error: any
  isLoading: boolean
  mutate: any
  signOut: () => Promise<void>
  signInWithNotion: () => Promise<void>
}
const Context = createContext<ContextI>({
  user: null,
  error: null,
  isLoading: true,
  mutate: null,
  signOut: async () => { },
  signInWithNotion: async () => { },
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

  // Refresh the Page to Sync Server and Client
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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
