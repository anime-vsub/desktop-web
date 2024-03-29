import FS from "@isomorphic-git/lightning-fs"
import { AnimeDownloadManager } from "animevsub-download-manager/src/main"
import { get, getMany, set, setMany } from "idb-keyval"
import { defineStore } from "pinia"

export const useADM = defineStore("adm", () => {
  const fs = new FS("adm").promises

  const tasks = shallowReactive(new Map())

  const adm = markRaw(
    new AnimeDownloadManager(
      {
        get,
        set,
        getMany,
        setMany
      },
      {
        request(uri: string, method = "GET"): Promise<Response> {
          return fetch(uri + "#animevsub-vsub_extra", { method })
        },
        delay: 300,
        repeat: 5,
        concurrent: 5,
        onstart(seasonInfo, episode) {
          this.onprogress(seasonInfo, episode, 0, 0)
        },
        onprogress(seasonInfo, episode, current, total) {
          let inTask = tasks.get(seasonInfo.seasonId)

          if (!inTask) {
            tasks.set(
              seasonInfo.seasonId,
              (inTask = {
                seasonInfo,
                episodes: shallowReactive(new Map())
              })
            )
          }

          inTask.episodes.set(episode.id, { episode, current, total })
          console.log("downloaded segment %i on %i", current, total)
        }
      }
    )
  )

  return { tasks, adm, fs: markRaw(fs) }
})
