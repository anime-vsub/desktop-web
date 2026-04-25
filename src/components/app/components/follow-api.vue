<template>
  <SkeletonCardVertical v-if="loading" v-for="i in 12" :key="i" class="mb-4" />
  <q-infinite-scroll
    v-else-if="data"
    ref="infiniteScrollRef"
    @load="onLoad"
    :offset="250"
    :scrollTarget
  >
    <CardVertical
      v-for="item in data?.items"
      :key="item.path"
      :data="item"
      class="mb-4"
    />
    <template v-slot:loading>
      <div class="row justify-center q-my-md">
        <q-spinner class="c--main" size="40px" />
      </div>
    </template>
  </q-infinite-scroll>
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
import { QInfiniteScroll } from "quasar"
import { TuPhim } from "src/apis/runs/tu-phim"
import { useRequest } from "vue-request"

const { t } = useI18n()
defineProps<{
  scrollTarget?: Element
}>()

let page = 1
const { data, loading, refreshAsync } = useRequest(() => TuPhim(page++), {
  cacheKey: "favorites",
  cacheTime: 5 * 60 * 1000
})

const infiniteScrollRef = ref<QInfiniteScroll>()

async function onLoad(index: number, done: (end: boolean) => void) {
  if (!data.value) return

  const { items } = await TuPhim(page++)
  if (items.length === 0) return done(true)

  data.value.items.push(...items)
  done(false)
}
</script>
