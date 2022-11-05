import type { NextApiRequest, NextApiResponse } from "next";
import {
  APIErrorCode,
  Client,
  ClientErrorCode,
  isNotionClientError,
  LogLevel,
} from "@notionhq/client";
import { useEffect } from "react";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    try {
      const notion: Client = new Client({
        auth: request.body.token,
        logLevel: LogLevel.DEBUG,
      });

      const notion_response = await notion.search({
        query: request.body.key.toString(),
        sort: {
          direction: "ascending",
          timestamp: "last_edited_time",
        },
      });
      if (notion_response.results.length) {
        // notion_response.results.forEach(async function (value) {
        //   if (value.properties.title) {
        //     console.log(value.properties.title);
        //   }
        // });
      }

      response.status(200).json(notion_response);
    } catch (error) {
      if (isNotionClientError(error)) {
        switch (error.code) {
          case ClientErrorCode.RequestTimeout:
            // ...
            break;
          case APIErrorCode.ObjectNotFound:
            // ...
            break;
          case APIErrorCode.Unauthorized:
            // ...
            break;
          // ...
          default:
          // you could even take advantage of exhaustiveness checking
        }
      }
    }
  }
};
