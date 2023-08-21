
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
        <h1 className="text-5xl antialiased">Youtube Playlist To Notion</h1>
        <p className="antialiased text-muted-foreground">
          Watch your favorite Youtube playlist without leaving Notion !
        </p>

        <div className="space-x-4 pb-8 pt-4 md:pb-10">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">See How it Work?</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>How it Work</DialogTitle>
                <DialogDescription>
                  <AspectRatio ratio={16 / 9}>
                    <iframe
                      title="How to use it"
                      src="https://www.youtube.com/embed/IWFG7fSCWb4"
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
