import { noop } from "@vueuse/shared"
import { i18n } from "boot/i18n"
import { defineStore } from "pinia"
import { useQuasar } from "quasar"
import { AjaxNotification } from "src/apis/runs/ajax/notification"
import { supabase } from "src/boot/supabase"
import { post } from "src/logic/http"
import { syncNotifyToDb } from "src/schedule/sync-notify-to-db"
import { shallowRef, watch } from "vue"

import { useAuthStore } from "./auth"
import { useSettingsStore } from "./settings"

const TIMEOUT_AUTO_UPDATE_NOTIFY = 10 * 60_000
export const useNotificationStore = defineStore(
  "notification",
  () => {
    const authStore = useAuthStore()
    const settingsStore = useSettingsStore()

    const lastUpdateNotify = ref(0)
    const items = shallowRef<
      Awaited<ReturnType<typeof AjaxNotification>>["items"]
    >([])
    const max = ref(0)

    const $q = useQuasar()

    const loading = ref(false)

    let timeout: NodeJS.Timeout | Timer | number

    let countFail = 0
    async function updateNotification() {
      if (timeout) clearTimeout(timeout)
      if (Date.now() - lastUpdateNotify.value < TIMEOUT_AUTO_UPDATE_NOTIFY)
        return

      try {
        loading.value = true
        await Promise.all([
          // eslint-disable-next-line promise/always-return
          AjaxNotification().then((result) => {
            items.value = result.items
            max.value = result.max
          }),
          updateCountInDb()
        ])

        if (settingsStore.autoSyncNotify) void startSync()

        lastUpdateNotify.value = Date.now()
      } catch (err) {
        if ((err as Error)?.message === "NOT_LOGIN") {
          // cookie not sync
          $q.dialog({
            title: i18n.global.t("yeu-cau-dang-nhap-lai"),
            message: i18n.global.t(
              "cookie-hien-khong-dong-bo-ban-can-dang-nhap-lai"
            ),
            ok: {
              flat: true,
              rounded: true
            },
            persistent: true // TODO
          }).onOk(() => {
            authStore.logout()
            // updateNotification()
          })

          return
        }
        console.error(err)

        // allow failure 3 pinia
        if (countFail > 3)
          $q.notify({
            position: "bottom-right",
            message: i18n.global.t("nhan-thong-bao-that-bai"),
            caption: (err as Error).message
          })
        else countFail++

        timeout = setTimeout(updateNotification, TIMEOUT_AUTO_UPDATE_NOTIFY)
      } finally {
        loading.value = false
      }
    }

    watch(
      () => authStore.isLogged,
      (isLogged) => {
        if (isLogged) updateNotification()
        else {
          clearTimeout(timeout)
          items.value = []
          max.value = 0
          stopSync()
          maxInDB.value = undefined
        }
      },
      { immediate: true }
    )

    async function remove(id: string): Promise<void>
    async function remove(
      season: string,
      inDb: true,
      chapId?: string
    ): Promise<void>
    async function remove(id: string, inDb: boolean = false, chapId?: string) {
      if (!authStore.uid) return

      if (inDb) {
        const { data } = await supabase
          .rpc("delete_notify", {
            user_uid: authStore.uid,
            p_season: id,
            p_chapid: chapId
          })
          .single()
          .throwOnError()

        maxInDB.value = data ?? maxInDB.value

        return
      }

      const { data } = await post("/ajax/notification", {
        Delete: "true",
        id
      })

      if (JSON.parse(data).status !== 1)
        throw new Error(i18n.global.t("errors.xoa-thong-bao-that-bai"))

      refresh(noop)
    }

    async function refresh(done: () => void) {
      try {
        const result = await AjaxNotification()

        items.value = result.items
        max.value = result.max
      } catch {}

      done()
    }

    let controllerSync: AbortController | null = null

    const syncing$ = shallowRef(false)
    let syncing = syncing$

    const maxInDB$ = shallowRef<{
      notify_count: number
      notify_chap_count: number
    }>()
    let maxInDB = maxInDB$

    if (typeof self.BroadcastChannel !== "undefined") {
      const broadcastSync = new BroadcastChannel("syncing-notify")
      broadcastSync.onmessage = (
        event: MessageEvent<
          | { type: "sync"; value: boolean }
          | { type: "max"; value: typeof maxInDB$.value }
        >
      ) => {
        if (event.data.type === "sync") syncing$.value = event.data.value
        else if (event.data.type === "max") maxInDB$.value = event.data.value
      }

      syncing = computed<boolean>({
        get: () => syncing$.value,
        set: (val) => {
          syncing$.value = val
          broadcastSync.postMessage({ type: "sync", value: val })
        }
      })

      maxInDB = computed<typeof maxInDB$.value>({
        get: () => maxInDB$.value,
        set: (val) => {
          maxInDB$.value = val
          broadcastSync.postMessage({ type: "max", value: val })
        }
      })
    }

    function stopSync() {
      controllerSync?.abort()
      controllerSync = null
      syncing.value = false

      refresh(noop)
    }
    async function startSync() {
      if (controllerSync || syncing.value) return

      syncing.value = true
      controllerSync = new AbortController()

      await syncNotifyToDb(controllerSync.signal, useNotificationStore())

      stopSync()
    }

    async function updateCountInDb() {
      if (!authStore.uid) return

      const { data } = await supabase
        .rpc("get_count_notify", {
          p_user_uid: authStore.uid
        })
        .single()
        .throwOnError()

      maxInDB.value = data ?? undefined
    }

    async function queryDb(page: number) {
      if (!authStore.uid) throw new Error("Not login")

      const { data } = await supabase
        .rpc("query_notify", {
          p_page: page,
          p_page_size: 30,
          p_user_uid: authStore.uid
        })
        .throwOnError()

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return data!
    }

    if (typeof self.BroadcastChannel !== "undefined") {
      const cast = new BroadcastChannel("sync-notify")
      cast.onmessage = (
        event: MessageEvent<{
          items: typeof items.value
          max: number
          maxInDB: typeof maxInDB.value
          lun: number
        }>
      ) => {
        if (event.data.lun <= lastUpdateNotify.value) return

        items.value = event.data.items
        max.value = event.data.max
        maxInDB$.value = event.data.maxInDB
        lastUpdateNotify.value = event.data.lun

        if (timeout) {
          clearTimeout(timeout)
          timeout = setTimeout(updateNotification, TIMEOUT_AUTO_UPDATE_NOTIFY)
        }
      }

      watch([items, max, maxInDB, lastUpdateNotify], () => {
        cast.postMessage({
          items: items.value,
          max: max.value,
          maxInDB: maxInDB.value,
          lun: lastUpdateNotify.value
        })
      })
    }

    return {
      lun: lastUpdateNotify,
      items,
      max,
      remove,
      loading,
      refresh,

      syncing,

      maxInDB,
      updateCountInDb,
      queryDb,

      stopSync,
      startSync
    }
  },
  {
    persist: {
      paths: ["lun", "items", "max", "maxInDB"]
    }
  }
)
