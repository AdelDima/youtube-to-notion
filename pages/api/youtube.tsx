import type { NextApiRequest, NextApiResponse } from "next";
import Innertube from "youtubei.js";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const {
    query: { playlist },
  } = request;
  const youtube = await new Innertube();
  const the_playList = await youtube.getPlaylist(playlist as string);

  response.status(200).json(the_playList.items);
};
