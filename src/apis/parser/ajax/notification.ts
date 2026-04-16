import { getPathName } from "../__helpers__/getPathName"
import { parserDom } from "../__helpers__/parserDom"

export default function AjaxNotification(html: string) {
  const $ = parserDom(html)

  return $(".notifi-item")
    .map((_i, item) => {
      const $item = $(item)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const image = $item.find("img").attr("src")!
      const [name, chap] = $item
        .find(".notification-text")
        .find("strong")
        .map((_i, item) => $(item).text())
      const time = $item.find(".notification-time").text().trim()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const path = getPathName($item.find("a").attr("href")!)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const id = $item.find(".notification-delete").attr("data-id")!

      const paths$ = path.split("/")

      const season = paths$[2]
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const chapId = path.match(/(\d+)(?:\.html?)?$/)![1]

      return {
        image,
        name,
        chap: chap.replace(/Tập\s+/i, "").trim(),
        time,
        path,
        id,
        season,
        chapId
      }
    })
    .toArray()
}
