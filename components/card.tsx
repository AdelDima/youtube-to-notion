/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useState } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { SquareDashedBottomCode } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { NoApiForm } from '@/components/forms/NoApiForm'
import { Login } from '@/components/Login'
import { motion } from 'framer-motion'
import { AfterLoginForm } from './forms/AfterLoginForm'
import { useAuth } from '@/components/providers/supabase-auth-provider'

export function CardWithForm() {
  const [isSwitchOn, setIsSwitchOn] = useState(false)
  function handleSwitchChange() {
    setIsSwitchOn(!isSwitchOn)
  }
  const { user } = useAuth()
  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle className="text-2xl">Import your playlist</CardTitle>
        {/* <CardDescription>Watch your favorite Youtube playlist without leaving Notion !</CardDescription> */}
      </CardHeader>
      <CardContent>
        {!user && (
          <>
            {/* <motion.div whileTap={{ scale: 0.97 }} onClick={handleSwitchChange}>
              <div className="flex items-center space-x-4 rounded-md border p-4 mb-4">
                <SquareDashedBottomCode />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Notion Connect{' '}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Connect to Notion using API.
                  </p>
                </div>

                <Switch
                  id="connection-type"
                  checked={isSwitchOn}
                  onClick={handleSwitchChange}
                />
              </div>
            </motion.div> */}

            {/* <NoApiForm isOpen={isSwitchOn} /> */}
            <Login />
            {/* {!isSwitchOn && <Login />} */}
          </>
        )}

        {user && <AfterLoginForm />}
      </CardContent>
    </Card>
  )
}
