
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

    const [status, notion_response] = (await addVideoToPlaylist(
      notion,
      the_db_id,
      res
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

function truncateFileName(name: string, maxLength: number): string {
  if (name.length > maxLength) {
    return name.substring(0, maxLength)
  }
  return name
}

async function addVideoToPlaylist(notion: Client, the_db_id: string, res: any) {
  try {
    const truncatedName = truncateFileName(res.title, 100)

    const notion_response = await notion.pages.create({
      parent: { database_id: the_db_id },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: res.title,
              },
            },
          ],
        },
        Time: {
          rich_text: [
            {
              text: {
                content: res.duration,
              },
            },
          ],
        },
        Cover: {
          type: 'files',
          files: [
            {
              name: truncatedName,
              type: 'external',
              external: {
                url: res.thumbnails,
              },
            },
          ],
        },
        Status: {
          select: {
            name: 'Not Started',
          },
        },
      },
      icon: {
        external: {
          url: 'https://www.notion.so/icons/playback-play_pink.svg?mode=dark',
        },
      },
      children: [
        {
          object: 'block',
          video: {
            type: 'external',
            external: {
              url: 'https://www.youtube.com/watch?v=' + res.id,
            },
          },
        },
      ],
    })
    return [true, notion_response]
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      return [false, error.message]
    }
  }
}
