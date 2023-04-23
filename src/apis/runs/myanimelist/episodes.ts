// first in query id anime

import type MyAnimeListEpisodesParser from "src/apis/parser/myanimelist/episodes"
import { get } from "src/logic/http"

import { useCache } from "../../useCache"
import Worker from "../../workers/myanimelist/episodes"
import { PostWorker } from "../../wrap-worker"

export async function getEpisodesMyAnimeList(url: string, offset: number = 0) {
  return await useCache(`${url}/episode`, async () => {
    const html =
      import.meta.env.MODE === "test"
        ? await fetch(`${url}/episode?offset=${offset}`).then((res) => res.text())
        : await (
            await get(`${url}/episode?offset=${offset}`)
          ).data

    if (import.meta.env.MODE === "test") {
      return import("../../parser/myanimelist/episodes").then((res) =>
        res.default(html)
      )
    }

    return PostWorker<typeof MyAnimeListEpisodesParser>(Worker, html)
  })
}
