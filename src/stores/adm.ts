import {
  AnimeDownloadManager,
  Utils,
  SeasonInfo,
  Episode
} from "animevsub-download-manager/src/main"
import { get, getMany, set, setMany, createStore, UseStore } from "idb-keyval"
import { defineStore } from "pinia"
import { ShallowReactive } from "vue"

let store: UseStore
function getFilesStore() {
  if (store) return store
  return (store = createStore("keyval-store", "files"))
}

export const useADM = defineStore("adm", () => {
  const tasks = shallowReactive(
    new Map<
      string,
      {
        seasonInfo: ShallowReactive<SeasonInfo>
        episodes: ShallowReactive<
          Map<string, { episode: Episode; cur: number; total: number }>
        >
      }
    >()
  )
  const utils: Utils = markRaw({
    get: (key) => get(key, getFilesStore()),
    set: (key) => set(key, getFilesStore()),
    getMany: (key) => getMany(key, getFilesStore()),
    setMany: (key) => setMany(key, getFilesStore())
  })

  const adm = markRaw(
    new AnimeDownloadManager(utils, {
      request(uri: string, method = "GET"): Promise<Response> {
        return fetch(uri + "#animevsub-vsub_extra", { method })
      },
      delay: 300,
      repeat: 5,
      concurrent: 5,
      onstart(seasonInfo, episode) {
        this.onprogress(seasonInfo, episode, 0, 0)
      },
      onprogress(seasonInfo, episode, cur, total) {
        let inTask = tasks.get(seasonInfo.seasonId)

        if (!inTask) {
          tasks.set(
            seasonInfo.seasonId,
            (inTask = {
              seasonInfo: shallowReactive(seasonInfo),
              episodes: shallowReactive(new Map())
            })
          )
        } else {
          Object.assign(inTask.seasonInfo, seasonInfo)
        }

        inTask.episodes.set(episode.id, { episode, cur, total })
        console.log("downloaded segment %i on %i", cur, total)
      }
    })
  )

  return { tasks, adm, utils }
})
