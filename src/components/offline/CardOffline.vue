<template>
  <router-link :to="`/phim/${data.seasonId}`" class="mt-1 mb-4">
    <div class="w-full">
      <q-img-file
        no-spinner
        :src="data.poster"
        referrerpolicy="no-referrer"
        :ratio="1920 / 1080"
        class="!rounded-[4px]"
      >
        <BottomBlur class="px-0 h-[40%]">
          <div
            class="absolute bottom-0 left-0 z-10 w-full min-h-0 py-2 px-2 flex items-center"
          >
            <Quality>{{ data.quality }}</Quality>
            <q-separator vertical class="mx-1" />
            {{ data.seasonOf?.name ?? data.yearOf }}
          </div>
        </BottomBlur>
      </q-img-file>
    </div>

    <div class="mt-2 px-1">
      <h2 class="text-16px font-weight-medium line-clamp-2 mb-2">
        {{ data.name }}
      </h2>

      <p class="text-gray-300 text-12px">{{ data.currentSeason?.name }}</p>
      <p class="text-gray-300 text-12px flex items-center truncate">
        {{ $t("formatview-data-views-luot-xem", [formatView(data.views)]) }}
        <span class="mx-2">&bull;</span> <Star /> {{ data.rate }}
      </p>

      <span
        v-for="contri in data.contries"
        :key="contri.path"
        class="rounded-md bg-gray-700 bg-opacity-50 px-2 py-0.5 mx-1 leading-normal mt-1 inline-block text-12px text-gray-400"
        >{{ contri.name }}</span
      >
    </div>
  </router-link>
</template>

<script lang="ts" setup>
import type { SeasonInfo } from "animevsub-download-manager";
import { formatView } from "src/logic/formatView"

defineProps<{
  data: SeasonInfo
}>()
</script>
