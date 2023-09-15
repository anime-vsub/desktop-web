<template>
  <q-dialog>
    <q-card
      class="bg-dark-page min-w-[300px] max-h-[647px] max-w-[664px] px-6 rounded-xl !max-h-[80%] flex flex-col flex-nowrap"
    >
      <q-card-section class="py-2 px-0">
        <div class="flex items-center justify-between">
          <div class="text-[16px]">Trình sửa lỗi CSR</div>
          <q-btn round flat icon="close" v-close-popup />
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-300">{{ data?.length }} tabs</span>
          <q-btn unelevated no-caps rounded :loading="fixing" @click="fix"
            >Fix</q-btn
          >
        </div>
      </q-card-section>

      <q-card-section
        class="px-0 pt-0 min-h-0 flex flex-col flex-nowrap overflow-y-auto scrollbar-custom"
      >
        <q-list v-if="!error">
          <q-item v-for="item in data" :key="item.id">
            <q-item-section avatar>
              <q-avatar size="1.5em">
                <q-img :src="item.favIconUrl" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">{{ item.title }}</q-item-label>
              <q-item-label lines="1" caption>{{ item.url }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else class="text-16px text-center px-2 py-3 text-gray-300">
          {{ error }}
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useRequest } from "vue-request"
import * as Client from "client-ext-animevsub-helper"
import { useEventListener } from "@vueuse/core"
import { getMany } from "idb-keyval"
import groupBy from "object.groupby"
import { useI18n } from "vue-i18n"
import { ref } from "vue"

const { t } = useI18n()

const { data, error } = useRequest(() => {
  if (!Client.tabsApi) throw new Error("tabs_api_not_support")
  return Client.execTabs("query", [{ title: "animevsub.eu.org" }])
})

const fixing = ref(false)

async function fix() {
  fixing.value = true

  const keys = data.value
    .map((item) => {
      const realIdSeason = new URL(item.url).pathname.split("/")[2]
      return [`data-${realIdSeason}`, `season_data ${realIdSeason}`]
    })
    .flat(1)

  const ids = data.value.map((item) => item.id)
  const urls = data.value.map((item) => item.url)

  const data: (string | undefined)[] = await getMany(keys)

  const $grouped = groupBy(data, (item, index) => ~~(index / 2))
  Object.assign($grouped, { length: Object.keys($grouped).length })
  const grouped = Array.from($grouped)

  // scan undefined data
  const groupedResolvedUndef = await Promise.all(
    grouped.map(async ([data, season], index) => {
      try {
        if (!data) {
          data = JSON.stringify(await PhimId(urls[index]))
          set(`data-${urls[index]}`, data)
        }
        if (!season) {
          season = JSON.stringify(await PhimIdChap(urls[index]))
          set(`season_data ${urls[indedx]}`, season)
        }

        return [data, season]
      } catch {
        return [data, season]
      }
    })
  ).then((res) => res.filter((item) => item[0]))

  for (let i = 0; i < ids.length; i++) {
    const [$data, $season] = groupedResolvedUndef[i]
    const [data, season] = [
      JSON.parse($data),
      $season ? JSON.parse($season) : undefined,
    ]

    const title = season
      ? t("tap-_chap-_name-_othername", [
          season.name,
          data.name,
          data.othername,
        ])
      : t("_name-_othername", [data.name, data.othername])
    await Client.execTabs("update", [id, { title }])
  }

  fixing.value = false
}
</script>