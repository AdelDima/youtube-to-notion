import { NextResponse } from 'next/server'
import { Innertube } from 'youtubei.js/web'

export async function POST(request: Request) {
  const res = await request.json()
  const playlist_id = res.playlist
  try {
    const youtube = await Innertube.create(/* options */)
    const the_playList = await youtube.getPlaylist(playlist_id as string)
    const videos = the_playList.videos
    const info = the_playList.info
    return NextResponse.json({ videos, info }, { status: 200 })
  } catch (error: unknown) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
