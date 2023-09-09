import '/app/globals.css'
import { Inter } from 'next/font/google'
import SupabaseProvider from '@/components/providers/supabase-context'
import SupabaseAuthProvider from '@/components/providers/supabase-auth-provider'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session === null) {
    redirect('/')
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} h-screen`}>
        <SupabaseProvider>
          <SupabaseAuthProvider serverSession={session}>
            {children}
          </SupabaseAuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
