import { parserDom } from "../__helpers__/parserDom"

interface AnimeItem {
  name_lower: string
  search_name: string
  id: number
  type: string
  name: string
  url: string
  image_url: string
}

export default function AnimeSearch(html: string) {
  const $ = parserDom(html)

  return $(".js-categories-seasonal tr")
    .toArray()
    .map((tr) => {
      const url = $(tr).find(".hoverinfo_trigger").attr("href")
      if (!url) return null

      const indexParamAnime = url.indexOf("/anime/") + 7

      if (indexParamAnime === -1) return null

      const id = parseInt(
        url.slice(indexParamAnime, url.indexOf("/", indexParamAnime))
      )
      const name = $(tr).find("strong").text()
      // eslint-disable-next-line camelcase
      const image_url = $(tr).find("img").attr("src")

      // eslint-disable-next-line camelcase
      return { id, type: "anime", name, url, image_url }
    })
    .filter(Boolean) as AnimeItem[]
}
