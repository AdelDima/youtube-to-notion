'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, RefreshCcw } from 'lucide-react'

export function DropdownMenuDemo() {
  const { user, signOut, refreshToken } = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          {user?.avatar_url && <AvatarImage src={user?.avatar_url} />}
          <AvatarFallback>AT</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem onClick={signOut} className='cursor-pointer'><LogOut className='w-4 h-4 mr-2' />Log out</DropdownMenuItem>
        <DropdownMenuItem onClick={refreshToken} className='cursor-pointer '><span className='inline-flex items-center text-red-400 hover:text-red-600'><RefreshCcw className='w-4 h-4 mr-2' />Update Notion Token</span></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
