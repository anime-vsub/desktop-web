import { noop } from "@vueuse/shared"
import { post } from "src/logic/http"
import { sleep } from "src/logic/sleep"
import type { useNotificationStore } from "stores/notification"

import { putNotifyToDb } from "./put-notify-to-db"

export async function syncNotifyToDb(
  signal: AbortSignal,
  notifyStore: ReturnType<typeof useNotificationStore>
) {
  if (signal.aborted) signal.throwIfAborted()

  if (notifyStore.max === 0) return

  if (signal.aborted) signal.throwIfAborted()

  for (let i = 0; i < notifyStore.items.length; i++) {
    const item = notifyStore.items[i]

    const maxInDB = await putNotifyToDb(item, signal)

    await post("/ajax/notification", {
      Delete: "true",
      id: item.id
    })

    notifyStore.max--
    notifyStore.maxInDB = maxInDB ?? notifyStore.maxInDB
    // notifyStore.items.splice(i, 1)

    await sleep(200)
  }

  await notifyStore.refresh(noop)

  await syncNotifyToDb(signal, notifyStore)
}
