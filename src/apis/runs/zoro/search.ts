/* eslint-disable functional/prefer-immutable-types */
// first in query id anime

import MiniSearch from "minisearch"
import { get } from "src/logic/http"

import type ZoroSearchParser from "../../parser/zoro/search"
import { useCache } from "../../useCache"
import Worker from "../../workers/zoro/search?worker"
import { PostWorker } from "../../wrap-worker"

const PREFIX_SEASON = "mùa|season|part|ss"
const BEFORE_SEASON = "ss|\\wd"

async function runRawSearch(query: string) {
  return await useCache(`zoro/search?keyword=${query}`, async () => {
    const { data: html } =
      import.meta.env.MODE === "test"
        ? await fetch(
            `https://zoro.to/search?keyword=${encodeURIComponent(query)}`
          ).then(async (res) => ({ data: await res.text() }))
        : await get(
            `https://zoro.to/search?keyword=${encodeURIComponent(query)}`
          )

    if (import.meta.env.MODE === "test") {
      return import("../../parser/zoro/search").then((res) => res.default(html))
    }

    return PostWorker<typeof ZoroSearchParser>(Worker, html)
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
  // eslint-disable-next-line functional/no-loop-statements
  while (size + off > max) {
    size -= othername[index].length
    off -= 2
    index++
  }

  return othername.slice(index)
}

const rPrefixSeason = new RegExp(`${PREFIX_SEASON} (\\d+)`, "gi")
const rBeforeSeason = new RegExp(`(\\d+)${BEFORE_SEASON}\\s+(?:season)?`, "gi")
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function searchShared<T extends any[]>(
  name: string,
  othername: string,
  seasonName: string,
  fetcher: (keyword: string) => Promise<T>
): Promise<T[0]> {
  const nameRmd = name + " " + seasonName
    // .replace(rPrefixSeason, " $1")
    // .replace(rBeforeSeason, "$1")
  const otherRmd = othername + " " + seasonName
    // .replace(rPrefixSeason, " $1")
    // .replace(rBeforeSeason, "$1")

  // const query =
    // nameRmd.slice(0, 100) +
    // (nameRmd.length > 100
    //   ? ""
    //   : " " +
    //     sliceOthername(
    //       otherRmd.split(",").filter((item) => item.trim()),
    //       otherRmd.length,
    //       100 - nameRmd.length - 1 /** 1 is val of space */
    //     ).join(","))

  const keyword = otherRmd + " " + nameRmd // query
  console.log({ keyword }, keyword.length)

  return fetcher(keyword).then((anime) => {
    // console.log(keyword)
    // console.dir(data, { depth: null })
    // eslint-disable-next-line functional/no-throw-statements
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
    const matchByOthername = anime.find((item) => {
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
      fields: ["name_lower", "alias_lower"], // fields to index for full-text search
      storeFields: Object.keys(anime[0]), // fields to return with search results
    })

    anime.forEach((item) => {
      item.name_lower = item.name.trim().toLowerCase()
      item.alias_lower = item.alias.trim().toLowerCase()
    })
    // Index all documents
    miniSearch.addAll(anime)

    const result = miniSearch.search(
      keyword
    )[0] as unknown as (typeof anime)[0]
    console.log(otherRmd, result)
    // console.log(otherRmd, result.slice(0, 10))
    // .filter((item) => {
    //   return ss
    //     ? !!item.name.match(regexpSeasonSS)
    //     : !item.name.match(regexpSeasonSS)
    // }) as unknown as Awaited<ReturnType<typeof runRawSearch>>[0]
    if (result) return result

    // eslint-disable-next-line functional/no-throw-statements
    throw new Error("not_found")
  })
}

export async function getAnimeZoro(
  name: string,
  othername: string,
  seasonName: string
): Promise<ReturnType<typeof ZoroSearchParser>[0]> {
  try {
    return searchShared(name, othername, seasonName, runRawSearch)
  } catch (err) {
    if ((err as Error | null)?.message?.startsWith("Unexpected token ")) {
      // limit request
      await new Promise((resolve) => setTimeout(resolve, 5000))
      return getAnimeZoro(name, othername, seasonName)
    }

    throw err
  }
}
