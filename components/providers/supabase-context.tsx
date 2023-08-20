'use client'

import {
  SupabaseClient,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { ReactNode, createContext, useContext, useEffect } from 'react'
import type { Database } from '@/lib/database.types'

type SupabaseContext = {
  supabase: SupabaseClient
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const { data: { subscription } = {} } = supabase.auth.onAuthStateChange(
      () => {
        router.refresh
      }
    )
    return () => {
      subscription?.unsubscribe()
    }
  }, [router, supabase])

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
