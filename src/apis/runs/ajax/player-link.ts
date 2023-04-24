import { post } from "src/logic/http"

const addProtocolUrl = (file: string) =>
  file.startsWith("http") ? file : `https:${file}`

interface PlayerLinkReturn {
  readonly link: {
    readonly file: string
    readonly label?: "FHD|HD" | "HD" | "FHD" | `${720 | 360 | 340}p`
    readonly preload?: string
    readonly type:
      | "hls"
      | "aac"
      | "f4a"
      | "mp4"
      | "f4v"
      | "m3u"
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
  readonly playTech: "api" | "trailer"
}
export function PlayerLink(config: {
  id: string
  play: string
  href: string
}): Promise<PlayerLinkReturn> {
  const { id, play, href: link } = config
  return post("/ajax/player?v=2019a", {
    id,
    play,
    link,
    backuplinks: "1",
  }).then(({ data }) => {
    // eslint-disable-next-line functional/no-throw-statement
    if (!data) throw new Error("unknown_error")
    type Writeable<T> = {
      -readonly [P in keyof T]: T[P] extends object ? Writeable<T[P]> : T[P]
    }
    const config = JSON.parse(data) as Writeable<PlayerLinkReturn>
    config.link.forEach((item) => {
      item.file = addProtocolUrl(item.file)
      switch (
        item.label?.toUpperCase() as
          | Uppercase<Exclude<typeof item.label, undefined>>
          | undefined
      ) {
        case "HD":
          item.label = "FHD|HD"
          break
        case undefined:
          item.label = "HD"
          break
      }
    })

    return config
  })
}
