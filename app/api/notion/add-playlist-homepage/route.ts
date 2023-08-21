
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

    const [status, notion_response] = (await createParentPlayList(
      notion,
      the_db_id,
      res
    )) as [boolean, any]
    if (status) {
      return NextResponse.json({ notion_response }, { status: 200 })
    } else {
      return NextResponse.json({ message: notion_response }, { status: 500 })
    }
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
}

async function createParentPlayList(
  notion: Client,
  the_db_id: string,
  res: any
) {
  try {
    const info = res.info
    const totalItemsString = info.total_items.split(' ')[0]
    let totalItemsNumber = parseInt(totalItemsString, 10) || 0

    const notion_response = await notion.pages.create({
      parent: { database_id: the_db_id },
      properties: {
        Playlist_ID: {
          rich_text: [
            {
              text: {
                content: res.playlistId,
              },
            },
          ],
        },
        Author: {
          rich_text: [
            {
              text: {
                content: info.author.name || '',
              },
            },
          ],
        },
        Source: {
          multi_select: [
            {
              name: 'Youtube',
              color: 'red',
            },
          ],
        },
        URL: {
          url: info.author.url,
        },
        'Total chapters': {
          number: totalItemsNumber,
        },
        'Current chapters': {
          number: 0,
        },
        Description: {
          rich_text: [
            {
              text: {
                content: info.description || '',
              },
            },
          ],
        },
        Name: {
          title: [
            {
              text: {
                content: info.title || '',
              },
            },
          ],
        },
        Cover: {
          files: [
            {
              name: info.title || '',
              type: 'external',
              external: {
                url: info.thumbnails[0].url || '',
              },
            },
          ],
        },
      },
      icon: {
        external: {
          url: info.author.thumbnails[0].url || '',
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
