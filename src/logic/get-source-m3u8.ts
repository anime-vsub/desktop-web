import { get } from "src/logic/http"

export async function getSourceM3u8(
  link: string
): Promise<{ m3u8: string; headers: Record<string, string> }> {
  const htmlRes = await get({
    url: `${link}#animevsub-vsubo`,
    responseType: "text"
  })
  const html = htmlRes.data as string

  const idRegex = /const\s+id\s*=\s*["']([^"']+)["']/i
  const tokenRegex = /const\s+avsToken\s*=\s*["']([^"']+)["']/i

  const idMatch = html.match(idRegex)
  const tokenMatch = html.match(tokenRegex)

  const id = idMatch ? idMatch[1] : null
  const avsToken = tokenMatch ? tokenMatch[1] : null

  const m3u8Response = await get({
    url: `${cdn_google}/playlist/${id}/playlist.m3u8?token=${avsToken}#animevsub-vsubo`,
    responseType: "text"
  })

  const m3u8 = m3u8Response.data as string
  return {
    m3u8,
    headers: m3u8Response.headers
  }
}
