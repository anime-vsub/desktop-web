// import { C_URL } from "src/constants"
import { getQualityByLabel } from "src/logic/get-quality-by-label"
import { post } from "src/logic/http"
import { getSourceM3u8 } from "src/logic/get-source-m3u8"
import { decryptM3u8 } from "src/logic/decrypt-hls-animevsub"

// const addProtocolUrl = (file: string) =>
//   file.startsWith("http") ? file : `https:${file}`

interface PlayerLinkReturn {
  readonly link: {
    readonly file: string
    readonly label: "FHD|HD" | "HD" | "FHD" | `${720 | 360 | 340}p`
    readonly qualityCode: ReturnType<typeof getQualityByLabel>
    readonly preload?: string
    readonly type:
      | "hls"
      | "aac"
      | "f4a"
      | "mp4"
      | "f4v"
      | "m3u"
      | "m3u8"
      | "m4v"
      | "mov"
      | "mp3"
      | "mpeg"
      | "oga"
      | "ogg"
      | "ogv"
      | "vorbis"
      | "webm"
      | "youtube"
  }[]
  readonly playTech: "api" | "trailer" | "iframe"
}

type Writeable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? Writeable<T[P]> : T[P]
}

export function PlayerLink(config: {
  id: string
  play: string
  hash: string
}): Promise<PlayerLinkReturn> {
  const { id, play, hash: link } = config
  //  "#animevsub-vsub" + "_extra"
  return post("/ajax/player", {
    id,
    play,
    link,
    backuplinks: "1"
  }).then(async ({ data }) => {
    // return fetch(`${C_URL}/ajax/player?v=2019a#animevsub-vsub_extra`, {
    //   method: "post",
    //   body: new URLSearchParams({ id, play, link, backuplinks: "1" })
    // })
    //   .then((res) => res.json() as Promise<Writeable<PlayerLinkReturn>>)
    //   .then(async (config) => {
    const config = JSON.parse(data)
    if (!config.link)
      throw Object.assign(new Error("This server not found."), {
        not_found: true
      })

    if (config.playTech === "iframe") {
      const { m3u8: encryptedM3u8, headers } = await getSourceM3u8(config.link)

      const isEncrypted = encryptedM3u8.match(/[?&]_c=[0-9]+/)
      let finalM3u8 = ""

      if (isEncrypted) {
        finalM3u8 = await decryptM3u8(encryptedM3u8, headers)
      }
      config.link = [
        {
          file: `data:application/vnd.apple.mpegurl;base64,${btoa(unescape(encodeURIComponent(finalM3u8)))}`,
          label: "FHD|HD",
          preload: "auto",
          type: "hls"
        }
      ]
    }

    return config
  })
}
