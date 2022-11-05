import type { NextApiRequest, NextApiResponse } from "next";
import {
  APIErrorCode,
  Client,
  ClientErrorCode,
  isNotionClientError,
  LogLevel,
} from "@notionhq/client";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    try {
      const notion: Client = new Client({
        auth: request.body.token,
        logLevel: LogLevel.DEBUG,
      });
      const the_db_id = getNotionDbId(request.body.notion_db_id);
      const notion_response = await notion.pages.create({
        parent: { database_id: the_db_id },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: request.body.title,
                },
              },
            ],
          },
          Time: {
            rich_text: [
              {
                text: {
                  content: request.body.duration,
                },
              },
            ],
          },
          Cover: {
            type: "files",
            files: [
              {
                name: request.body.title,
                type: "external",
                external: {
                  url: request.body.thumbnails,
                },
              },
            ],
          },
        },
        icon: {
          external: {
            url: "https://www.notion.so/icons/playback-play_pink.svg?mode=dark",
          },
        },
        children: [
          {
            object: "block",
            video: {
              type: "external",
              external: {
                url: "https://www.youtube.com/watch?v=" + request.body.id,
              },
            },
          },
        ],
      });

      response.status(200).json(notion_response);
    } catch (error: unknown) {
      if (isNotionClientError(error)) {
        response.statusMessage = "Notion: "+error.message
        response.status(500).json({
          message: error.message
        });
      }
    }
  }
};
function getNotionDbId(notion_db_id: string) {
  if (isValidHttpUrl(notion_db_id)) {
    // Extract id.
    const regex = /(.*\/)(.*)/gm;
    let m = regex.exec(notion_db_id);
    if (m) {
      if (3 === m.length) {
        notion_db_id = m[2].split("?")[0];
      }
    }
    notion_db_id;
  }
  return notion_db_id;
}

function isValidHttpUrl(link: string) {
  let url;
  try {
    url = new URL(link);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}
