import IVideo from "../interfaces/IVideo";

export async function addVideoToDB(
  vids: IVideo[],
  token: string,
  notion_db_id: string
) {
  let _data;
  for (const vid of vids.reverse()) {
    const res = await fetch("api/notion", {
      method: "POST",
      body: JSON.stringify({
        id: vid.id,
        duration: vid.duration,
        title: vid.title,
        thumbnails: vid.thumbnails,
        notion_db_id: notion_db_id,
        token: token,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });

    _data = res;
    if (!res.ok) {
      break;
    }
  }
  return _data;
}
