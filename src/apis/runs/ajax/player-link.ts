import { labelToQuality } from "src/constants"
import { post } from "src/logic/http"

const addProtocolUrl = (file: string) =>
  file.startsWith("http") ? file : `https:${file}`

export function PlayerLink(
  config: {
    id: string
    play: string
    href: string
  },
  priote: number
): Promise<{
  link: {
    file: string
    label: string
    preload: string
    quality: `s${number}_${(typeof labelToQuality)[keyof typeof labelToQuality]}`
    qualityRate: number
    type:
      | "aac"
      | "f4a"
      | "mp4"
      | "f4v"
      | "hls"
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
  playTech: "api" | "trailer"
}> {
  const { id, play, href: link } = config
  return post("/ajax/player?v=2019a", {
    id,
    play,
    link,
    backuplinks: "1",
  }).then(({ data }) => {
    const config = JSON.parse(data)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config.link.forEach((item: any) => {
      const qual =
        labelToQuality[
          item.label?.toUpperCase() as keyof typeof labelToQuality
        ] ?? parseInt(item.label)
      item.quality = `s${priote}_${qual}`
      item.qualityRate = parseInt(qual + "" + priote)
      item.file = addProtocolUrl(item.file)
    })

    return config
  })
}
