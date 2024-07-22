/* eslint-disable camelcase */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { asyncMap } from "modern-async"
import { supabase } from "src/boot/supabase"

import data from "./output.json"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const users = (data as any).__collections__.users

await asyncMap(
  Object.keys(users) as string[],
  async (user_uid, i) => {
    console.log("start %i of %i", i++, Object.keys(users).length)

    console.log(user_uid)
    const {
      data: [{ id: user_id }]
    } = await supabase
      .from("users")
      .upsert(
        {
          uuid: user_uid
        },
        {
          onConflict: "uuid"
        }
      )
      .select()
      .throwOnError()
    // uuid is user_id
    const { history, playlist } = users[user_uid].__collections__

    // run history
    if (history) {
      await asyncMap(
        Object.keys(history) as string[],

        async (slug) => {
          const data = history[slug]

          if (slug.includes("#")) {
            // this is clone
            // const {
            //   data: [raw]
            // } = await supabase
            //   .from("history")
            //   .select("id")
            //   .eq("season", slug.split("#")[1])
            //   .throwOnError()

            await supabase.from("history").insert({
              // for_to: raw.id,
              created_at: new Date(
                (data.timestamp?.value._seconds ??
                  new Date("1/1/2023").getTime() / 1e3) * 1e3
              ),
              user_id,
              season: removeSplit(data.season ?? slug),
              name: data.name ?? "",
              poster: data.poster ?? "",
              seasonName: data.seasonName ?? ""
            })

            // continue
            return
          }

          const {
            data: [row]
          } = await supabase
            .from("history")
            .insert({
              created_at: new Date(
                (data.timestamp?.value._seconds ??
                  new Date("1/1/2023").getTime() / 1e3) * 1e3
              ),
              user_id,
              season: removeSplit(data.season ?? slug),
              name: data.name ?? "",
              poster: data.poster ?? "",
              seasonName: data.seasonName ?? ""
            })
            .select()
            .throwOnError()

          const chaps = data.__collections__.chaps

          if (chaps) {
            // console.log("detect chaps")
            await supabase
              .from("chaps")
              .insert(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Object.entries(chaps).map(([id, chap]: [string, any]) => {
                  return {
                    created_at:
                      id === data.last?.chap
                        ? new Date(
                            (data.timestamp?.value._seconds ??
                              new Date("1/1/2023").getTime() / 1e3) * 1e3
                          )
                        : new Date("01/01/2022"),
                    updated_at:
                      id === data.last?.chap
                        ? new Date(
                            (data.timestamp?.value._seconds ??
                              new Date("1/1/2023").getTime() / 1e3) * 1e3
                          )
                        : new Date("01/01/2022"),
                    history_id: row.id,
                    cur: chap.cur ?? 0,
                    dur: chap.dur ?? 0,
                    name: chap.name ?? "",
                    chap_id: id
                  }
                })
              )
              .throwOnError()
          }
        },
        20
      )
    }

    if (playlist) {
      await asyncMap(
        Object.keys(playlist) as string[],
        async (key) => {
          const data = playlist[key]

          const {
            data: [row]
          } = await supabase
            .from("playlist")
            .insert({
              created_at: new Date(
                (data.created?.value._seconds ??
                  new Date("1/1/2023").getTime() / 1e3) * 1e3
              ),
              public: data.public,
              name: data.name ?? "",
              description: data.description,
              user_id,
              updated_at: new Date(
                (data.updated?.value._seconds ??
                  new Date("1/1/2023").getTime() / 1e3) * 1e3
              )
            })
            .select()
            .throwOnError()

          const movies = data.__collections__.movies
          if (movies) {
            await supabase
              .from("movies")
              .insert(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Object.entries(movies).map(([id, movie]: [string, any]) => {
                  return {
                    add_at: new Date(
                      (data.add_at?.value._seconds ??
                        new Date("1/1/2023").getTime() / 1e3) * 1e3
                    ),
                    name_chap: movie.nameChap,
                    name: movie.name ?? "",
                    chap: movie.chap ?? "",
                    poster: movie.poster ?? "",
                    name_season: movie.nameSeason ?? "",
                    playlist_id: row.id,
                    season: removeSplit(id)
                  }
                })
              )
              .throwOnError()
          }
        },
        10
      )
    }
  },
  10
)

console.log("done")

function removeSplit(season: string): string {
  const index$ = season.lastIndexOf("$")

  if (index$ !== -1) return season.slice(0, index$)

  return season
}
