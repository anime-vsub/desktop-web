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
          v-for="[_, task] in admStore.tasks"
          :key="task.seasonInfo.seasonId"
          class="col-6 col-sm-4 col-md-3"
        >
          <CardOffline :data="task.seasonInfo">
            <div
              class="absolute w-full h-full top-0 left-0 bg-dark bg-opacity-20"
            >
              {{ getPerPacento(task.episodes) }}%
            </div>
          </CardOffline>
        </div>
        <div
          v-for="item in seasons"
          :key="item.seasonId"
          class="col-6 col-sm-4 col-md-3"
        >
          <CardOffline :data="item" />
        </div>
      </div>
    </template>
    <ScreenError v-else @click:retry="run" :error="error" />
  </div>
</template>

<script lang="ts" setup>
import { useHead } from "@vueuse/head"
import ScreenError from "components/ScreenError.vue"
import ScreenLoading from "components/ScreenLoading.vue"
import ScreenNotFound from "components/ScreenNotFound.vue"
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRequest } from "vue-request"
import CardOffline from "components/offline/CardOffline.vue"
import { Episode } from "animevsub-download-manager"

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

function getPerPacento(episodes: Map<string, { cur: number; total: number }>) {
  let cur = 0
  let total = 0
  for (const [_, meta] of episodes) {
    cur += meta.cur
    total += meta.total
  }
  return Math.round((cur / total) * 100)
}
</script>
