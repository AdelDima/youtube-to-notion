import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import SupabaseProvider from '@/components/providers/supabase-context'
import SupabaseAuthProvider from '@/components/providers/supabase-auth-provider'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
//Fix DynamicServerError: Dynamic server usage: cookies : https://github.com/vercel/next.js/issues/49373
export const dynamic = 'force-dynamic'

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

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SupabaseProvider>
            <SupabaseAuthProvider serverSession={session}>
              {children}
            </SupabaseAuthProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
