
import { NextResponse } from 'next/server'
import { Client, isNotionClientError, LogLevel } from '@notionhq/client'
import { extractNotionDbIdFromUrl } from '@/lib/utils'

/**
 *  POST /api/notion
 * @param request  - The request object.
 * @returns  - The response object.
 */
export async function POST(request: Request) {
  const res = await request.json()

  try {
    const notion: Client = new Client({
      auth: res.token,
      logLevel: LogLevel.DEBUG,
    })
    const the_db_id = extractNotionDbIdFromUrl(res.notion_db_id)
    const [status, notion_response] = (await createPlaylistDatabase(
      notion,
      the_db_id
    )) as [boolean, any]
    if (status) {
      return NextResponse.json({ notion_response }, { status: 200 })
    } else {
      return NextResponse.json({ error: notion_response }, { status: 500 })
    }
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
}

async function createPlaylistDatabase(notion: Client, the_db_id: string) {
  try {
    const notion_response = await notion.databases.create({
      parent: { page_id: the_db_id },
      icon: {
        external: {
          url: 'https://www.notion.so/icons/playback-play_pink.svg?mode=dark',
        },
      },
      title: [
        {
          text: {
            content: 'Youtube Playlist',
          },
        },
      ],
      is_inline: true,
      properties: {
        Name: {
          title: {},
        },
        Cover: {
          files: {},
        },
        Time: {
          rich_text: {},
        },
        Status: {
          select: {
            options: [
              {
                name: 'Not Started',
                color: 'default',
              },
              {
                name: 'In Progress',
                color: 'blue',
              },
              {
                name: 'Done',
                color: 'green',
              },
            ],
          },
        },
      },
    })
    return [true, notion_response]
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      return [false, error.message]
    }
  }
}
