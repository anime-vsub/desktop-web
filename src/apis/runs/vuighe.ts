// data test

import { decodeVuigheM3U8, encodeString } from "src/logic/decode-vuighe-m3u8"

import type PhimId from "../parser/phim/[id]"

// 1. Gate: Thus the JSDF Fought There
const gate = {
  path: "cong-chien-tranh",
  title: "Cổng chiến tranh",
  other:
    "GATE, Gate: Thus the JSDF Fought There!, Gate: Jieitai Kanochi nite, Kaku Tatakaeri",
}
const tonikawaii = {
  path: "tonikaku-kawaii-2nd-season",
  title: "Tonikaku Kawaii 2nd Season",
  other:
    "Tonikawa: Over the Moon for You 2nd Season, Tonikawa: Over The Moon For You Season 2",
}
const saitou = {
  path: "benriya-saitou-san-isekai-ni-iku",
  title: "Anh Thợ Saitou Đa Năng Ở Dị Giới",
  other: "Benriya Saitou-san, Isekai ni Iku, Handyman Saitou in Another World",
}

// vuighe
const gatev = {
  other: [
    "Gate: Jieitai Kanochi nite, Kaku Tatakaeri",
    "Gate: Jieitai Kanochi nite, Kaku Tatakaeri Vietsub ",
    "Gate: Jieitai Kanochi nite, Kaku Tatakaeri HD",
    "Gate: Jieitai Kanochi nite, Kaku Tatakaeri tập mới nhất",
  ],
}
const kawaii = {
  other: [
    "Tonikawa / Dù Sao Cũng Dễ Thương",
    "Tonikaku Kawaii",
    "Tonikaku Kawaii Vietsub",
    "Tonikaku Kawaii HD",
    "Tonikaku Kawaii tập mới nhất",
  ],
}
const saitouv = {
  other: [
    "Handyman Saitou in Another World",
    "Benriya Saitou-san, Isekai ni Iku",
    "Benriya Saitou-san, Isekai ni Iku Vietsub",
    "Benriya Saitou-san, Isekai ni Iku HD",
    "tập 1",
    "Benriya Saitou-san, Isekai ni Iku tập mới nhất",
  ],
}

interface V2SearchResult {
  data: {
    id: number
    name: string
    slug: string
    thumbnail: string
    views: number
    time: string
    is_movie: boolean
    meta: {
      max_episode_name: number
    }
  }[]
}
export async function vuigheSearchByQuery(
  query: Pick<ReturnType<typeof PhimId>, "name" | "othername">
) {
  // https://vuighe.net/api/v2/search?q=t&limit=1
  const { data } = await fetch(
    `https://vuighe.net/api/v2/search?q=${encodeURIComponent(
      query.name + " " + query.othername
    )}&limit=1#vuighe`,
    {
      headers: { "x-requested-with": "XMLHttpRequest" },
    }
  ).then((res) => res.json() as Promise<V2SearchResult>)

  if (data.length < 1) throw new Error("No search results found")

  return data
}

interface V2JsonManga {
  id: number
  anime_id: number
  title: string
  slug: string
  poster: string
  thumbnail: string
  chapter_name: string
  chapter_slug: string
}
export async function vuigheGetMangaByAnimeId(id: number) {
  return fetch(`https://vuighe.net/json/manga/${id}.json`, {
    headers: {
      "x-requested-with": "XMLHttpRequest",
    },
  }).then((res) => res.json() as Promise<V2JsonManga>)
}


// export async function vuighe
interface V2JsonEpisodes {
  data: {
    id: number
    name: number
    special_name: number
    detail_name: string
    full_name: string
    film_name: string
    slug: string
    link: string
    views: number
    is_copyrighted: null
    has_preview: null
    thumbnail_small: string
    thumbnail_medium: string
    upcoming: null
  }[]
}
/** @param season - season id not is anime id */
export function vuigheGetEpisodesBySeasonId(
  season: string
): Promise<V2JsonEpisodes> {
  return fetch(
    `https://vuighe.net/api/v2/seasons/${season}/episodes?sort=name`,
    {
      headers: {
        "x-requested-with": "XMLHttpRequest",
      },
    }
  ).then((res) => res.json())
}

interface Source {
  src: string
  type: string
  quality: string
}
interface V2JsonEpisode {
  id: number
  name: number
  special_name: number
  detail_name: string
  full_name: string
  film_name: string
  slug: string
  link: string
  views: number
  is_copyrighted: number
  has_preview: number
  thumbnail_small: string
  thumbnail_medium: string
  upcoming: null
  midroll: number
  midroll2: number
  is_cluster: number
  server: number
  sources: {
    vip: Source[]
    gd: Source[]
    pt: Source[]
    yt: Source[]
    fb: Source[]
    embed: null
    mp4: null | string
    m3u8: Record<number, string>
  }
}
export async function vuigheGetEpByEpId(season: number, ep: number) {
  const data = await fetch(
    `https://vuighe.net/api/v2/films/${season}/episodes/${ep}`,
    {
      headers: {
        "x-requested-with": "XMLHttpRequest",
      },
    }
  ).then((res) => res.json() as Promise<V2JsonEpisode>)

  const hls = decodeVuigheM3U8(data.sources.m3u8, ep).map((item) => {
    const url = new URL(item.url)
    if (url.hostname === "imacdn.com") url.hostname = "s869.imacdn.com"

    item.url = url.toString()

    return item
  })

  const sources: Source[] = []

  if (data.sources.fb.length > 0) {
    data.sources.fb.forEach((source) => {
      source.src = encodeString(source.src, ep % 100)

      if (source.quality === "720p") {
        if (
          source.src.indexOf("/v/t66.") < 0 &&
          source.src.indexOf("/v/t39.") < 0
        ) {
          source.quality = "240p"
        }
      }
    })

    sources.push(...data.sources.fb)
  }

  if (data.sources.mp4) {
    data.sources.mp4.split("|").forEach((url) => {
      if (url.indexOf(".mp4_") !== -1) {
        url = url.slice(0, -1)
      }

      sources.push({
        src: url,
        type: "video/mp4",
        quality: "auto",
      })
    })
  }

  if (data.sources.vip.length > 0) {
    data.sources.fb.forEach((source) => {
      if (source.quality === "720p") {
        if (
          source.src.indexOf("/v/t66.") < 0 &&
          source.src.indexOf("/v/t39.") < 0
        ) {
          source.quality = "240p"
        }
      }
    })

    sources.push(...data.sources.fb)
  }

  return {
    detail_name: data.detail_name,
    thumbnail_small: data.thumbnail_small,
    thumbnail_medium: data.thumbnail_medium,
    hls,
    sources,
  }
}
