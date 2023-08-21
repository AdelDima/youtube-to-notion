
'use client'


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Login } from '@/components/Login'
import { AfterLoginForm } from './forms/AfterLoginForm'
import { useAuth } from '@/components/providers/supabase-auth-provider'

export function CardWithForm() {
  const { user } = useAuth()
  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle className="text-2xl">Import your playlist</CardTitle>
      </CardHeader>
      <CardContent>
        {!user && (
          <>
            <Login />
          </>
        )}

        {user && <AfterLoginForm />}
      </CardContent>
    </Card>
  )
}
