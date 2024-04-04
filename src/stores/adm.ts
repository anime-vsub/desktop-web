import {
  AnimeDownloadManager,
  Utils,
  SeasonInfo,
  Episode
} from "animevsub-download-manager"
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
      async request(
        uri: string,
        method = "GET",
        onprogress
      ): Promise<Response> {
        const response = await fetch(uri + "#animevsub-vsub_extra", { method })

        const reader = response.body.getReader()
        const contentLength = +response.headers.get("Content-Length")
        let receivedLength = 0
        const chunks = []

        return new Promise<Response>((resolve) => {
          reader.read().then(function processResult(result) {
            if (result.done) {
              let data = new Uint8Array(receivedLength)
              let position = 0
              for (let chunk of chunks) {
                data.set(chunk, position)
                position += chunk.length
              }
              resolve(new Response(data.buffer, { headers: response.headers }))
              return
            }

            chunks.push(result.value)
            receivedLength += result.value.length
            onprogress(receivedLength, contentLength)
            const progress = (receivedLength / contentLength) * 100
            console.log(
              `Downloaded ${receivedLength} of ${contentLength} bytes (${progress.toFixed(
                2
              )}%)`
            )

            reader.read().then(processResult)
          })
        })
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
