<template>
  <q-page-sticky position="top" class="children:w-full bg-dark-page z-10">
    <div class="text-[18px] py-2 px-4">Anime đã tải xuống</div>
  </q-page-sticky>

  <div class="pt-[32px]">
    <ScreenLoading v-if="loading" />
    <template v-else-if="seasons">
      <ScreenNotFound v-if="seasons.length === 0" />

      <div v-else class="row">
        <div
          v-for="item in seasons"
          :key="item.seasonId"
          class="col-6 col-sm-4 col-md-3"
        >
          <router-link :to="`/phim/${item.seasonId}`" class="mt-1 mb-4">
            <div class="w-full">
              <q-img-file
                no-spinner
                :src="item.poster"
                referrerpolicy="no-referrer"
                :ratio="1920 / 1080"
                class="!rounded-[4px]"
              >
                <BottomBlur class="px-0 h-[40%]">
                  <div
                    class="absolute bottom-0 left-0 z-10 w-full min-h-0 py-2 px-2 flex items-center"
                  >
                    <Quality>{{ item.quality }}</Quality>
                    <q-separator vertical class="mx-1" />
                    {{ item.seasonOf?.name ?? item.yearOf }}
                  </div>
                </BottomBlur>
              </q-img-file>
            </div>

            <div class="mt-2 px-1">
              <h2 class="text-16px font-weight-medium line-clamp-2 mb-2">
                {{ item.name }}
              </h2>

              <p class="text-gray-300 text-12px">{{ item.currentSeason?.name }}</p>
              <p class="text-gray-300 text-12px flex items-center truncate">
                {{
                  $t("formatview-data-views-luot-xem", [formatView(item.views)])
                }}
                <span class="mx-2">&bull;</span> <Star /> {{ item.rate }}
              </p>

              <span
                v-for="contri in item.contries"
                :key="contri.path"
                class="rounded-md bg-gray-700 bg-opacity-50 px-2 py-0.5 mx-1 leading-normal mt-1 inline-block text-12px text-gray-400"
                >{{ contri.name }}</span
              >
            </div>
          </router-link>
        </div>
      </div>
    </template>
    <ScreenError v-else @click:retry="run" :error="error" />
  </div>
</template>

<script lang="ts" setup>
import { useHead } from "@vueuse/head"
import BottomBlur from "components/BottomBlur.vue"
import QImgCustom from "components/QImgCustom"
import QImgFile from "components/QImgFile.vue"
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
import GridCard from "components/GridCard.vue"
import { computedAsync } from "@vueuse/core"
import { formatView } from "src/logic/formatView"
import Star from "components/Star.vue"
import Quality from "components/Quality.vue"

const { t } = useI18n()
const admStore = useADM()

useHead(
  computed(() => {
    const title = "Anime đã tải xuống"
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
  data: seasons,
  loading,
  error,
  run
} = useRequest(() => {
  return admStore.adm.listSeason("asc")
})
</script>
