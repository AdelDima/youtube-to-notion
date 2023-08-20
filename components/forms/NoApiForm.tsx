'use client'

import { Variants, motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
}

export function NoApiForm(props: { isOpen: boolean }) {
  return (
    <form>
      <motion.div
        initial={false}
        animate={props.isOpen ? 'open' : 'closed'}
        style={{ display: !props.isOpen ? 'none' : 'block' }}
      >
        <motion.ul
          variants={{
            open: {
              clipPath: 'inset(0% 0% 0% 0% round 10px)',
              transition: {
                type: 'spring',
                bounce: 0,
                duration: 0.7,
                delayChildren: 0.3,
                staggerChildren: 0.05,
              },
            },
            closed: {
              clipPath: 'inset(10% 50% 90% 50% round 10px)',
              transition: {
                type: 'spring',
                bounce: 0,
                duration: 0.3,
              },
            },
          }}
          className="grid w-full items-center gap-4 mt-4"
        >
          <motion.li variants={itemVariants} className="">
            <Label htmlFor="playlist">Youtube Playlist Link</Label>
            <Input
              id="playlist"
              placeholder="https://www.youtube.com/watch?v=bbcm9OLTnsE&list=PLz..."
            />
          </motion.li>

          <motion.li variants={itemVariants} className="">
            <Label htmlFor="token">Notion Token</Label>
            <Input id="token" placeholder="secret_K2k*********t64crk2FPPp" />
          </motion.li>

          <motion.li variants={itemVariants} className="">
            <Label htmlFor="database_id">Notion Database URL or ID</Label>
            <Input
              id="database_id"
              placeholder="https://www.notion.so/fc42b..."
            />
          </motion.li>
          <motion.li variants={itemVariants} className="">
            <Button className="w-full">Import playlist</Button>
          </motion.li>
        </motion.ul>
      </motion.div>
    </form>
  )
}
