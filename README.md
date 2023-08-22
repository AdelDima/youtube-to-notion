# WatchList Next.js Project

Welcome to the **Y2N** Next.js project repository! This project empowers you to transform YouTube playlists into a personalized knowledge hub using the Next.js framework.

## Features

- **Effortless Playlist Integration:** Seamlessly import YouTube playlists into your Notion workspace.
- **Customizable Learning Paths:** Rearrange videos to suit your learning goals.
- **Engagement and Retention:** Add notes and tags to enhance knowledge retention.
- **Progress Tracking:** Mark videos as watched to visualize your learning journey.
- **Cross-Device Synchronization:** Access your WatchList from anywhere.
- **Collaborative Learning:** Share curated WatchLists with others.

### Installation

1. Clone this repository to your local machine:

```bash
git clone git@github.com:AdelDima/youtube-to-notion.git
```

2. Install project dependencies:

```bash
npm install
# or
yarn
# or
pnpm i
```

3. Rename the `.env.example` file to `.env.local` and update the environment variables with your Supabase information:

```bash
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAdelDima%2Fyoutube-to-notion)
