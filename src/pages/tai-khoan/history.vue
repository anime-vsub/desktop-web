<template>
  <q-page-sticky position="top" class="children:w-full bg-dark-page z-10">
    <div class="text-[18px] py-2 px-4">{{ t("anime-da-xem") }}</div>
  </q-page-sticky>

  <div class="pt-[32px]">
    <ScreenLoading v-if="loading" />
    <template v-else-if="histories">
      <ScreenNotFound v-if="histories.length === 0" />

      <q-infinite-scroll v-else @load="onLoad" :offset="250">
        <template v-for="(item, index) in histories" :key="index">
          <div
            v-if="
              !histories[index - 1] ||
              !histories[index - 1].timestamp.isSame(item.timestamp, 'day')
            "
            class="text-subtitle2 text-weight-normal"
          >
            {{
              item.timestamp.isToday()
                ? "Hôm nay"
                : item.timestamp.isYesterday()
                  ? "Hôm qua"
                  : item.timestamp.get("date") +
                    " thg " +
                    (item.timestamp.get("month") + 1)
            }}
          </div>
          <router-link
            class="bg-transparent flex mt-1 mb-4"
            style="white-space: initial"
            :to="`/phim/${item.season}/${parseChapName(
              item.watch_name
            )}-${item.watch_id}`"
          >
            <div class="w-[149px]">
              <q-img-custom
                no-spinner
                :src="forceHttp2(item.poster)"
                referrerpolicy="no-referrer"
                :ratio="1920 / 1080"
                class="!rounded-[4px]"
              >
                <BottomBlur class="px-0 h-[40%]">
                  <div
                    class="absolute bottom-0 left-0 z-10 w-full min-h-0 !py-0 !px-0"
                  >
                    <q-linear-progress
                      :value="item.watch_cur / item.watch_dur"
                      rounded
                      color="main"
                      class="!h-[3px]"
                    />
                  </div>
                </BottomBlur>
                <span
                  class="absolute text-white z-10 text-[12px] bottom-2 right-2"
                  >{{ parseTime(item.watch_cur) }}</span
                >
              </q-img-custom>
            </div>

            <div class="flex-1 pl-2 min-w-0">
              <span class="line-clamp-3">{{ item.name }}</span>
              <div class="text-grey mt-1">
                <template v-if="item.season_name"
                  >{{ item.season_name }} tập
                </template>
                <template v-else>Tập</template>
                {{ item.watch_name }}
              </div>
              <div class="text-grey mt-2">
                {{
                  t("xem-luc-_value", [
                    item.timestamp.format(
                      item.timestamp.isToday() ? "HH:mm" : "DD/MM/YYYY"
                    )
                  ])
                }}
              </div>
            </div>
          </router-link>
        </template>

        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner class="c--main" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </template>
    <ScreenError v-else @click:retry="run()" :error="error" />
  </div>
</template>

<script lang="ts" setup>
import { useHead } from "@vueuse/head"
import BottomBlur from "components/BottomBlur.vue"
import QImgCustom from "components/QImgCustom"
import ScreenError from "components/ScreenError.vue"
import ScreenLoading from "components/ScreenLoading.vue"
import ScreenNotFound from "components/ScreenNotFound.vue"
import { QInfiniteScroll } from "quasar"
import { forceHttp2 } from "src/logic/forceHttp2"
import { parseChapName } from "src/logic/parseChapName"
import { parseTime } from "src/logic/parseTime"
import { useHistoryStore } from "stores/history"
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRequest } from "vue-request"

const { t } = useI18n()
const historyStore = useHistoryStore()

useHead(
  computed(() => {
    const title = t("lich-su-xem-anime")
    const description = title

    return {
      title,
      description,
      meta: [
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url" }
      ],
      link: [
        {
          rel: "canonical"
        }
      ]
    }
  })
)

const {
  loading,
  data: histories,
  run,
  error
} = useRequest(() => {
  return historyStore.loadMoreAfter(1)
})

let page = 1
async function onLoad(_: number, done: (end: boolean) => void) {
  const items = await historyStore.loadMoreAfter(++page)

  histories.value = [...(histories.value ?? []), ...items]
  done(items.length === 0)
}
</script>
