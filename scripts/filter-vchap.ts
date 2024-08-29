import pLimit from "p-limit"
import { supabase } from "src/boot/supabase"

const REMOVE_ROW_LOSS = confirm("Remove row loss?")

const limit = pLimit(100)

while (true) {
  const { data: rows } = await supabase
    .from("history")
    .select("*")
    .is("v_chap", null)
    .throwOnError()

  if (!rows || rows.length === 0) break

  let allFailure = true

  await Promise.all(
    rows.map((row, i) =>
      limit(async () => {
        const { data: chapWithHistoryId } = await supabase
          .from("chaps")
          .select("id")
          .in("history_id", [row.id, ...(row.for_to ? [row.for_to] : [])])
          .maybeSingle()
          .throwOnError()

        try {
          const vChap =
            chapWithHistoryId?.id ??
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            (await getChapWithHistory(row.user_id!, row.season))

          if (typeof vChap !== "number") throw new Error("Can't find chap")

          await supabase
            .from("history")
            .update({ v_chap: vChap })
            .eq("id", row.id)
            .throwOnError()

          console.log("Done %i / %i (%s)", i, rows?.length, row.season)
          allFailure = false
        } catch (err) {
          if (
            (err as unknown as any)?.message === "Can't find chap" &&
            REMOVE_ROW_LOSS
          ) {
            await supabase
              .from("history")
              .delete()
              .eq("id", row.id)
              .throwOnError()
            console.warn("Delete %i / %i (%s)", i, rows?.length, row.season)
          } else {
            console.warn(err)
          }
        }
      })
    )
  )

  if (allFailure) break
}

async function getChapWithHistory(userId: number, season: string) {
  // Step 1: Fetch history IDs
  const { data: historyIds } = await supabase
    .from("history")
    .select("id")
    .eq("user_id", userId)
    .eq("season", season)
    .throwOnError()

  const historyIdList = historyIds?.map((h) => h.id)
  if (!historyIdList) throw new Error("Can't find history")

  // Step 2: Fetch the chap with the desired conditions
  const { data: chapsData } = await supabase
    .from("chaps")
    .select("*")
    .in("history_id", historyIdList)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()
    .throwOnError()

  if (!chapsData) throw new Error("Can't find chap")

  return chapsData.id
}
