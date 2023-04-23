import { parserDom } from "../__helpers__/parserDom"

export default function AnimeEpisodes(html: string) {
  const $ = parserDom(html)

  return $(".episode-list-data")
    .toArray()
    .map((ep) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const number = $(ep).find(".episode-number").attr("data-raw")!
      const name = $(ep).find(".episode-title > a").text().trim()
      const japanese = $(ep).find(".di-ib").text().trim()
      const time = $(ep).find(".episode-aired").text().trim()
      const average = $(ep).find(".episode-aired").text()

      return { number, name, japanese, time, average }
    })
}
