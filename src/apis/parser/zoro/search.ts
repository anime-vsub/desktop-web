import { parserDom } from "../__helpers__/parserDom"

export default function Search(html: string) {
  const $ = parserDom(html)

  return $(".flw-item .dynamic-name")
    .toArray()
    .map((item, id) => {
      const $item = $(item)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const url = $item.attr("href")!.replace("?ref=search", "")
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const name = $item.attr("title")!
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const alias = $item.attr("data-jname")!

      return { id, url, name, alias }
    })
}
