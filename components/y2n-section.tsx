
'use client'

import { Button } from './ui/button'
import { motion } from 'framer-motion'
import { CardWithForm } from './card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AspectRatio } from './ui/aspect-ratio'
import { Youtube } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

const formVariants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: {
      ease: 'easeOut',
    },
  },
}

export function Y2NSection() {
  return (
    <div className="px-4 space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <motion.section
        className="container flex w-full items-center flex-col gap-5"
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Link
          href="https://www.producthunt.com/posts/notion-finance-tracker-goal-planner?utm_source=badge-featured&utm_medium=badge&utm_source=badge-notion-finance-tracker-goal-planner"
          target="_blank"
          className="inline-flex items-center  px-3 py-1 text-sm font-medium"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=416877&theme=light"
            alt="Notion Finance Tracker Goal Planner - Streamline your finances, streamline your life | Product Hunt"
            style={{ width: "250px", height: "54px" }}
            width="250"
            height="54"
          />
        </Link>
        <h1 className="text-5xl antialiased text-center">Youtube Playlist To Notion <Badge variant="outline" className='absolute'>2.0</Badge></h1>
        <p className="antialiased text-muted-foreground">
          Watch your favorite Youtube playlist without leaving Notion !
        </p>

        <div className="space-x-4 pb-8 pt-4 md:pb-10">
          <Dialog>
            <DialogTrigger asChild className='place-content-center'>
              <div className='flex flex-col gap-2'>
                <Button variant="outline">
                  <Youtube className="w-5 h-5 mr-2" />
                  See How it Work?</Button>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How it Work</DialogTitle>
                <DialogDescription>
                  <AspectRatio ratio={16 / 9}>
                    <iframe
                      title="How to use it"
                      src="https://www.youtube.com/embed/-u2IF5FV5ww"
                      width="100%"
                      height="100%"
                    />
                  </AspectRatio>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <CardWithForm />
      </motion.section>
    </div>
  )
}
