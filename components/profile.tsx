
'use client'

import { motion } from 'framer-motion'
import { SetPasswordCart } from './setPassword'
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

export function Profile() {
  return (
    <div className="px-4 space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <motion.section
        className="container flex w-full items-center flex-col gap-5"
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <SetPasswordCart />
      </motion.section>
    </div>
  )
}
