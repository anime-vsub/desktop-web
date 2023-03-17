<template>
  <div class="py-1 px-4 text-subtitle1 flex items-center justify-between">
    {{ gridModeTabsSeasons ? t("chon-season") : t("chon-tap") }}

    <q-btn dense round @click="gridModeTabsSeasons = !gridModeTabsSeasons">
      <Icon
        :icon="
          gridModeTabsSeasons
            ? 'fluent:grid-kanban-20-regular'
            : 'fluent:apps-list-24-regular'
        "
        width="20"
        height="20"
      />
    </q-btn>
  </div>

  <div v-if="!seasons" class="flex-1 flex items-center justify-center">
    <q-spinner color="main" size="3em" :thickness="3" />
  </div>
  <template v-else>
    <q-tabs
      v-model="seasonActive"
      class="min-w-0 w-full tabs-seasons"
      :class="{
        'grid-mode scrollbar-custom': gridModeTabsSeasons,
      }"
      no-caps
      dense
      inline-label
      active-class="c--main"
      v-if="
        seasons.length > 1 || (seasons.length === 0 && seasons[0].name !== '')
      "
    >
      <q-tab
        v-for="item in seasons"
        :key="item.value"
        :name="item.value"
        :label="item.name"
        :ref="(el: QTab) => void(item.value === seasonActive && (tabsRef = el as QTab))"
      />
    </q-tabs>

    <q-tab-panels
      v-model="seasonActive"
      animated
      keep-alive
      class="flex-1 w-full bg-transparent panels-seasons"
      v-show="!gridModeTabsSeasons"
    >
      <q-tab-panel
        v-for="({ value }, index) in seasons"
        :key="index"
        :name="value"
      >
        <div
          v-if="
            !(_tmp = _cacheDataSeasons.get(value)) || _tmp.status === 'pending'
          "
          class="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"
        >
          <q-spinner style="color: #00be06" size="3em" :thickness="3" />
        </div>
        <div
          v-else-if="_tmp.status === 'error'"
          class="absolute top-[50%] left-[50%] text-center transform -translate-x-1/2 -translate-y-1/2"
        >
          {{ t("loi-khi-lay-du-lieu") }}
          <br />
          <q-btn
            dense
            no-caps
            rounded
            style="color: #00be06"
            @click="fetchSeason(value)"
            >{{ t("thu-lai") }}</q-btn
          >
        </div>

        <template v-else>
          <div
            v-if="_tmp.response.update"
            class="mb-2 text-gray-300"
            @mousedown.stop
            @touchstart.stop
          >
            <MessageScheludeChap :update="_tmp.response.update" />
          </div>

          <ChapsGridQBtn
            class="chaps"
            grid
            :chaps="_tmp.response.chaps"
            :season="value"
            :find="(item) => value === currentSeason && item.id === currentChap"
            :progress-chaps="(progressWatchStore.get(value) as unknown as any)?.response"
            class-item="px-3 !py-[6px] mb-3"
            :disable-no-watching="selectoing"
            :ref="item => void( chapsGridBtnRef = item )"
          />
        </template>
      </q-tab-panel>
    </q-tab-panels>

    <VueSelecto
      :selectableTargets="chapsGridBtnRef?.itemRefs.map(item => item.$el) ?? []"
      :dragContainer="'.panels-seasons'"
      :hitRate="10"
      :selectFromInside="false"
      :selectByClick="false"
      :toggleContinueSelect="'shift'"
      :scrollOptions="{
        container: '.panels-seasons .scroll',
        throttleTime: 30,
        threshold: 0,
      }"
      @keydown="onKeydown"
      @keyup="onKeyup"
      @selectStart="onSelectStart"
      @selectEnd="onSelectEnd"
      @select="onSelect"
      @scroll="onScroll"
    />
  </template>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue"
import ChapsGridQBtn from "components/ChapsGridQBtn.vue"
import MessageScheludeChap from "components/feat/MessageScheludeChap.vue"
import { QBtn, QSpinner, QTab, QTabPanel, QTabPanels, QTabs } from "quasar"
import { scrollXIntoView, scrollYIntoView } from "src/helpers/scrollIntoView"
import type {
  ProgressWatchStore,
  Season,
} from "src/pages/phim/_season.interface"
import { ref, watch, watchEffect } from "vue"
import { useI18n } from "vue-i18n"
import { VueSelecto } from "vue3-selecto"

import type {
  ResponseDataSeasonError,
  ResponseDataSeasonPending,
  ResponseDataSeasonSuccess,
} from "../pages/phim/response-data-season"

const props = defineProps<{
  fetchSeason: (season: string) => Promise<void>
  seasons?: Season[] | undefined
  _cacheDataSeasons: Map<
    string,
    | ResponseDataSeasonPending
    | ResponseDataSeasonSuccess
    | ResponseDataSeasonError
  >
  currentSeason?: undefined | string
  currentChap?: string | undefined
  progressWatchStore: ProgressWatchStore
}>()
const { t } = useI18n()

const seasonActive = ref<string>()
// sync data by active route
watch(
  () => props.currentSeason,
  (val) => (seasonActive.value = val),
  {
    immediate: true,
  }
)

watch(seasonActive, (seasonActive) => {
  if (!seasonActive) return

  // download data season active
  props.fetchSeason(seasonActive)
})

const gridModeTabsSeasons = ref(false)
watch(seasonActive, () => {
  gridModeTabsSeasons.value = false
})

// @scrollIntoView
const tabsRef = ref<QTab>()
watchEffect(() => {
  if (!tabsRef.value) return
  if (!props.currentSeason) return

  // eslint-disable-next-line no-unused-expressions
  gridModeTabsSeasons.value // watch value

  setTimeout(() => {
    console.log("scroll now")
    if (tabsRef.value?.$el) {
      if (gridModeTabsSeasons.value) scrollYIntoView(tabsRef.value.$el)
      else scrollXIntoView(tabsRef.value.$el)
    }
  }, 70)
})

// eslint-disable-next-line functional/no-let
let _tmp:
  | ResponseDataSeasonPending
  | ResponseDataSeasonSuccess
  | ResponseDataSeasonError
  | undefined

// ==================== selecto chap =====================
const chapsGridBtnRef = ref<ChapsGridQBtn>(null)

const selectoing = ref(false)
function onSelectStart() {
  selectoing.value = true
}
function onSelectEnd() {
  selectoing.value = false
}
function onSelect(e) {
  console.log("start", e)

  e.added.forEach((el) => {
    el.classList.add("selecto-item")
  })
  e.removed.forEach((el) => {
    el.classList.remove("selecto-item")
  })
}
// function onSelectEnd(e) {
//   console.log("end", e)
//   e.afterAdded.forEach((el) => {
//     el.classList.add("selecto-item")
//   })
//   e.afterRemoved.forEach((el) => {
//     el.classList.remove("selecto-item")
//   })
// }
function onScroll(e) {
  e.container.scrollBy(e.direction[0] * 10, e.direction[1] * 10)
}
function onKeydown() {
  console.log("down")
  document.querySelector(".button").classList.add("bg-light-green-3")
}
function onKeyup() {
  document.querySelector(".button").classList.remove("bg-light-green-3")
}
</script>

<style lang="scss" scoped>
@import "../pages/phim/tabs-seasons.scss";
</style>
