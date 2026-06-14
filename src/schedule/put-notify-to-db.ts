import type AjaxNotification from "src/apis/parser/ajax/notification"
import { supabase } from "src/boot/supabase"
import { unAgo } from "src/logic/un-ago"
import { removeHostUrlImage } from "src/logic/urlImage"
import { useAuthStore } from "src/stores/auth"

export async function putNotifyToDb(
  data: Awaited<ReturnType<typeof AjaxNotification>>[0],
  signal: AbortSignal
) {
  const { uid } = useAuthStore()
  if (!uid) return

  const image = removeHostUrlImage(data.image)

  const { data: count } = await supabase
    .rpc("upsert_notify", {
      p_image: image,
      p_name: data.name,
      p_chap: data.chap,
      p_time: unAgo(data.time).toISOString(),
      p_season: data.season,
      p_chapid: data.chapId,
      user_uid: uid
    })
    .abortSignal(signal)
    .single()
    .throwOnError()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return count!
}
