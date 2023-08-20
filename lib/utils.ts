import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 *  Extracts the notion database id from the given url.
 * @param notion_db_id  - The notion database id.
 * @returns  - The notion database id.
 */
export function extractNotionDbIdFromUrl(notion_db_id: string) {
  if (isHttpOrHttpsUrlValid(notion_db_id)) {
    const regex = /(.*\/)(.*)/gm
    let m = regex.exec(notion_db_id)
    if (m) {
      if (3 === m.length) {
        notion_db_id = m[2].split('?')[0]
      }
    }
    notion_db_id
  }
  return notion_db_id
}

/**
 *  Checks if the given link is a valid http or https URL.
 * @param link  - The link to check.
 * @returns  - True if the link is valid, false otherwise.
 */
function isHttpOrHttpsUrlValid(link: string) {
  let url
  try {
    url = new URL(link)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}
