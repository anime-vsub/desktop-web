// first in query id anime

import MiniSearch from "minisearch"
import type MyAnimeListSearchParser from "src/apis/parser/myanimelist/search"
import { get } from "src/logic/http"

import { useCache } from "../../useCache"
import Worker from "../../workers/myanimelist/search?worker"
import { PostWorker } from "../../wrap-worker"

const PREFIX_SEASON = "mùa|season|part|ss"
const BEFORE_SEASON = "ss|\\wd"

async function runRawSearch(query: string) {
  return await useCache(`myanimelist/search/${query}`, async () => {
    const { data: html } = await get(
      `https://myanimelist.net/anime.php?cat=anime&q=${encodeURIComponent(
        query
      )}&type=0&score=0&status=0&p=0&r=0&sm=0&sd=0&sy=0&em=0&ed=0&ey=0&c%5B%5D=a&c%5B%5D=b&c%5B%5D=c&c%5B%5D=f`
    )

    if (import.meta.env.MODE === "test") {
      return import("../../parser/myanimelist/search").then((res) =>
        res.default(html)
      )
    }

    return PostWorker<typeof MyAnimeListSearchParser>(Worker, "123")
  })
}

const createRegExpGetSeason = (num: string | "\\d+") =>
  new RegExp(
    "(?:" +
      `(?:(?:${PREFIX_SEASON})\\s*(${num}))` +
      "|" +
      `(?:(${num})(?:${BEFORE_SEASON}))(?:\\s+(?:season))` +
      ")$",
    "i"
  )
const defRegExpGetSeason = createRegExpGetSeason("\\d+")

const basicExactOthername = (name: string, othername: string): boolean => {
  // console.log({ name, othername, e: name === othername })

  // check in only
  if (othername === name) return true

  // check in first other name
  if (othername.startsWith(name + ",")) return true

  // check inside other name
  if (othername.includes("," + name + ",")) return true
  if (othername.includes(", " + name + ",")) return true

  // check in last other name
  if (othername.endsWith(", " + name)) return true
  if (othername.endsWith("," + name)) return true

  return false
}

function sliceOthername(othername: string[], size: number, max: number) {
  // eslint-disable-next-line functional/no-let
  let index = 0
  // eslint-disable-next-line functional/no-let
  let off = (othername.length - 1) * 2 // is space for ", "
  while (size + off > max) {
    size -= othername[index].length
    off -= 2
    index++
  }

  return othername.slice(index)
}

const rPrefixSeason = new RegExp(`${PREFIX_SEASON} (\\d+)`, "gi")
const rBeforeSeason = new RegExp(`(\\d+)${BEFORE_SEASON}\\s+(?:season)?`, "gi")
export async function getAmimeMyAnimeList(
  name: string,
  othername: string
): Promise<ReturnType<typeof MyAnimeListSearchParser>[0]> {
  const nameRmd = name
    .replace(rPrefixSeason, " $1")
    .replace(rBeforeSeason, "$1")
  const otherRmd = othername
    .replace(rPrefixSeason, " $1")
    .replace(rBeforeSeason, "$1")

  const query =
    nameRmd.slice(0, 100) +
    (nameRmd.length > 100
      ? ""
      : " " +
        sliceOthername(
          otherRmd.split(",").filter((item) => item.trim()),
          otherRmd.length,
          100 - nameRmd.length - 1 /** 1 is val of space */
        ).join(","))

  const keyword = query
  console.log({ keyword }, keyword.length)
  try {
    return runRawSearch(keyword).then((anime) => {
      // console.log(keyword)
      // console.dir(data, { depth: null })
      // eslint-disable-next-line functional/no-throw-statement
      if (anime.length === 0) throw new Error("not_found")

      const ss = name.match(defRegExpGetSeason)?.slice(1).filter(Boolean).at(-1)
      const regexpSeasonSS = createRegExpGetSeason(ss ?? "\\d+")

      name = name.toLowerCase().trim()
      const nameRmdSeason = ss
        ? name.replace(defRegExpGetSeason, "").trim()
        : name
      const matchByName = anime.find((item) => {
        const itemName = ss
          ? item.name.replace(defRegExpGetSeason, "").toLowerCase().trim()
          : item.name.toLowerCase()

        if (name === itemName || nameRmdSeason === itemName) {
          return ss
            ? !!item.name.match(regexpSeasonSS)
            : !item.name.match(regexpSeasonSS)
        }

        return false
      })
      if (matchByName) return matchByName

      const othernameRmdSeason = ss
        ? othername
            .split(",")
            .map((name) => {
              return name
                .trim()
                .replace(defRegExpGetSeason, "")
                .toLowerCase()
                .trim()
            })
            .join(",")
        : othername.toLowerCase().trim()
      const matchByOthername = anime.find((item, id) => {
        const itemName = ss
          ? item.name.replace(defRegExpGetSeason, "").toLowerCase().trim()
          : item.name.toLowerCase()
        // console.log(item.name, defRegExpGetSeason, itemName)

        if (basicExactOthername(itemName, othernameRmdSeason)) {
          return ss
            ? !!item.name.match(regexpSeasonSS)
            : !item.name.match(regexpSeasonSS)
        }

        return false
      })

      if (matchByOthername) return matchByOthername

      const miniSearch = new MiniSearch({
        fields: ["name_lower"], // fields to index for full-text search
        storeFields: Object.keys(anime[0]), // fields to return with search results
      })

      anime.forEach((item) => {
        item.name_lower = item.name.trim().toLowerCase()
      })
      // Index all documents
      miniSearch.addAll(anime)

      const result = miniSearch.search(otherRmd)[0] as unknown as Awaited<
        ReturnType<typeof runRawSearch>
      >[0]
      console.log(otherRmd, result)
      // console.log(otherRmd, result.slice(0, 10))
      // .filter((item) => {
      //   return ss
      //     ? !!item.name.match(regexpSeasonSS)
      //     : !item.name.match(regexpSeasonSS)
      // }) as unknown as Awaited<ReturnType<typeof runRawSearch>>[0]
      if (result) return result

      // eslint-disable-next-line functional/no-throw-statement
      throw new Error("not_found")
    })
  } catch (err) {
    if ((err as Error | null)?.message?.startsWith("Unexpected token ")) {
      // limit request
      await new Promise((resolve) => setTimeout(resolve, 5000))
      return getAmimeMyAnimeList(name, othername)
    }

    // eslint-disable-next-line functional/no-throw-statement
    throw err
  }
}
