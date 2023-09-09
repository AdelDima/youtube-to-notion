
'use client'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Login } from '@/components/Login'
import { useAuth } from '@/components/providers/supabase-auth-provider'
import React from 'react'
import { cn } from '@/lib/utils'
import { DropdownMenuDemo } from '@/components/UserDropdown'
import { ExternalLink, Github, Home, Twitter } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const { user } = useAuth()

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between space-x-2">
          <NavigationMenu className="mr-4 hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <a className="mr-6 flex items-center space-x-2" href="/">

                  <svg width="32" height="156" viewBox="0 0 150 156" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_1_104)">
                      <path d="M25.7796 27.35C30.6271 31.2918 32.4455 30.9911 41.5475 30.3831L127.36 25.2254C129.179 25.2254 127.665 23.408 127.059 23.1059L112.807 12.7931C110.077 10.671 106.438 8.2407 99.4659 8.84866L16.3744 14.9151C13.3443 15.2158 12.7388 16.7325 13.9458 17.9482L25.7796 27.35ZM30.9316 47.368V137.746C30.9316 142.603 33.3565 144.421 38.8143 144.12L133.121 138.658C138.582 138.358 139.19 135.016 139.19 131.071V41.2992C139.19 37.3597 137.676 35.2353 134.333 35.5385L35.7816 41.2992C32.1448 41.6049 30.9316 43.426 30.9316 47.368ZM9.3979 6.72663L95.8264 0.355784C106.44 -0.555514 109.171 0.0550517 115.842 4.90555L143.43 24.3156C147.983 27.6533 149.5 28.562 149.5 32.2007V138.658C149.5 145.329 147.072 149.275 138.583 149.879L38.2141 155.946C31.8416 156.25 28.8089 155.341 25.4716 151.092L5.15437 124.706C1.51386 119.849 0 116.215 0 111.964V17.3381C0 11.882 2.42859 7.33091 9.3979 6.72663Z" fill="currentColor" />
                      <path d="M97.5687 63.2825C97.871 63.7031 98.3215 63.4431 98.694 63.4392C102.986 63.3939 107.28 63.3074 111.551 63.6054C117.316 64.0073 120.241 66.637 121.104 72.4018C122.231 79.9212 122.271 87.5444 121.871 95.2048C121.713 98.2329 121.467 101.255 120.916 104.263C120.018 109.168 117.022 112.195 112.166 113.051C104.172 114.459 96.1342 114.981 88.1011 115.524C79.8765 116.079 71.6572 116.314 63.4491 116.225C61.5861 116.205 59.7273 116.112 57.8872 115.872C53.8893 115.35 51.1198 112.811 50.2478 108.842C49.5566 105.695 49.3726 102.459 49.1192 99.2348C49.0926 98.8953 49.3062 98.4589 48.8852 98.2247C48.8852 93.9895 48.8852 89.7541 48.8852 85.519C49.3081 85.239 49.0919 84.8269 49.1187 84.4853C49.3449 81.6142 49.541 78.7432 50.0172 75.884C50.9075 70.5382 53.882 67.5149 59.1532 66.5414C63.3437 65.7675 67.5585 65.4017 71.7696 64.9524C72.1412 64.9127 72.5932 65.1255 72.8903 64.6633C81.1166 64.2031 89.3426 63.7429 97.5687 63.2825ZM78.3038 79.2068C78.3038 86.6147 78.3038 93.8387 78.3038 101.247C84.6558 97.1981 90.8885 93.2251 97.2626 89.1622C90.8539 85.797 84.6359 82.532 78.3038 79.2068Z" fill="currentColor" />
                    </g>
                    <defs>
                      <clipPath id="clip0_1_104">
                        <rect width="149.5" height="156" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <div className='flex flex-col gap-0 '>
                    <span className="hidden font-bold sm:inline-block">Y2N</span>
                    <span className="hidden text-xs sm:inline-block text-muted-foreground">NotionZone</span>
                  </div>
                </a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            href='/'
          >
            <Home className='w-4 h-4 mr-2' />
            Home
          </Link>

          <a
            href="https://www.notionzone.net/templates"
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            target="_blank"
          >
            <ExternalLink className='w-4 h-4 mr-2' />
            Notion Templates
          </a>
          <a
            href="https://dimalab.notion.site/Documentation-68db4e30a3634a48833d2037d0299985?pvs=4"
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            target="_blank"
          >
            <ExternalLink className='w-4 h-4 mr-2' />
            Documentation
          </a>
        </nav>
        <nav className="flex items-center mx-6">
          <a
            href="https://twitter.com/notionzone"
            target="_blank"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0"
          >
            <Twitter />
          </a>
          <a
            href="https://github.com/AdelDima/youtube-to-notion"
            target="_blank"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 w-9 px-0"
          >
            <Github />
          </a>
        </nav>

        <NavigationMenu className="mr-4 hidden md:flex">
          <NavigationMenuList>
            {user && <DropdownMenuDemo />}

            {!user && (
              <NavigationMenuItem>
                <Login login={true} />
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
