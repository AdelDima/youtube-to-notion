
'use client'

import React from 'react'

export function Footer() {
  return (
    <footer>
      <div className="container flex flex-col items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">
          Made with ❤️ by{' '}
          <a
            href="https://twitter.com/TahriAdel"
            target="_blank"
            className="text-foreground"
          >
            Adel Tahri
          </a>{' '}
          &{' '}
          <a
            href="https://twitter.com/Ahmed_phi"
            target="_blank"
            className="text-foreground"
          >
            Ahmed Bensalah
          </a>
        </p>
        <p className="text-sm text-muted-foreground">
          The source code is available on{' '}
          <a
            href="https://github.com/AdelDima/youtube-to-notion"
            target="_blank"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
