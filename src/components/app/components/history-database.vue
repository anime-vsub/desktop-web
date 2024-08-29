<template>
  <div
    v-if="loading"
    v-for="i in 12"
    :key="i"
    class="flex mt-1 mb-4 flex-nowrap"
  >
    <q-responsive :ratio="1920 / 1080" class="w-[149px]">
      <q-skeleton class="!rounded-[4px] absolute w-full h-full" />
    </q-responsive>

    <div class="pl-2 flex-1">
      <q-skeleton type="text" class="mt-1" width="60%" />
      <q-skeleton type="text" class="mt-1" width="40px" height="15px" />

      <div class="text-grey mt-1">
        <q-skeleton type="text" class="mt-1" width="60px" height="15px" />
      </div>
      <div class="text-grey mt-2">
        <q-skeleton type="text" class="mt-1" width="120px" height="15px" />
      </div>
    </div>
  </div>

  <template v-else-if="data">
    <div v-if="data.length === 0" class="text-center">
      <div class="text-gray-400 text-subtitle1 py-2">
        {{ t("chua-co-lich-su-xem") }}
      </div>
    </div>

    <q-infinite-scroll
      v-else
      ref="infiniteScrollRef"
      :scroll-target
      @load="onLoad"
      :offset="250"
    >
      <template
        v-for="(item, index) in data.map((item) => {
          return {
            ...item,
            timestamp: dayjs(item.timestamp.toDate())
          }
        })"
        :key="item.season"
      >
        <div
          v-if="
            !data[index - 1] ||
            !dayjs(data[index - 1].timestamp.toDate()).isSame(
              item.timestamp,
              'day'
            )
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
          class="bg-transparent flex mt-1 mb-4 flex-nowrap"
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

          <div class="pl-2 flex-1">
            <span class="line-clamp-3 mt-1">{{ item.name }}</span>
            <div class="text-grey mt-1">
              <template v-if="item.season_name"
                >{{ t("_season-tap", [item.season_name]) }}
              </template>
              <template v-else>{{ t("Tap") }}</template>
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

  <div v-else class="text-center">
    <div class="text-subtitle1 font-weight-medium">
      {{ t("loi-khong-xac-dinh") }}
    </div>
    <q-btn outline rounded color="main" @click="refreshAsync">{{
      t("thu-lai")
    }}</q-btn>
  </div>
</template>

<script setup lang="ts">
import BottomBlur from "components/BottomBlur.vue"
import QImgCustom from "components/QImgCustom"
import { QInfiniteScroll } from "quasar"
import dayjs from "src/logic/dayjs"
import { forceHttp2 } from "src/logic/forceHttp2"
import { parseChapName } from "src/logic/parseChapName"
import { parseTime } from "src/logic/parseTime"
import { useHistoryStore } from "src/stores/history"
import { useRequest } from "vue-request"

const { t } = useI18n()
defineProps<{
  scrollTarget?: Element
}>()

const historyStore = useHistoryStore()

let page = 1
// history
const { data, loading, refreshAsync } = useRequest(
  () => historyStore.loadMoreAfter(page++),
  {
    cacheKey: "history",
    cacheTime: 5 * 60 * 1000 //
  }
)

const infiniteScrollRef = ref<QInfiniteScroll>()

async function onLoad(index: number, done: (end: boolean) => void) {
  if (!data.value) return

  const items = await historyStore.loadMoreAfter(page++)
  if (items.length === 0) return done(true)

  data.value.push(...items)
  done(false)
}
</script>
