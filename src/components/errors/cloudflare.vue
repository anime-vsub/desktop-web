<template>
  <div>
    <img
      v-if="!noImage"
      src="~assets/img_tips_error_not_loin.png"
      width="240"
      class="mx-auto"
    />
    <div class="text-h4 mt-4">{{ t("ban-la-robot") }}</div>

    <div
      class="text-h6 text-[16px] px-2 leading-normal text-gray-200 text-weight-regular mt-4"
    >
      {{
        t(
          "yeu-cau-gui-toi-may-chu-bi-nghi-ngo-la-robot-vui-long-xac-thuc-ban-la-con-nguoi-va-thu-lai"
        )
      }}
      <div class="mt-2">
        <q-btn rounded outline no-caps color="blue" @click="openAnimeVietsub">{{
          t("mo-animevietsub-de-xac-thuc")
        }}</q-btn>

        <span class="px-2 inline-block">or</span>

        <q-btn
          rounded
          outline
          no-caps
          color="yellow"
          :href="`${C_URL}?patch=true`"
          target="_blank"
          >Patch AnimeVietsub</q-btn
        >
      </div>
      <small
        class="block mt-4 mb-1 text-[18px] text-weight-medium text-green-400"
        >{{ t("sau-khi-xac-thuc-hay-nhan-vao-nut-ben-duoi") }}</small
      >
    </div>

    <q-btn
      class="q-mt-md"
      no-caps
      outline
      rounded
      @click="reload"
      style="color: #00be06"
      >{{ t("thu-lai") }}</q-btn
    >
  </div>
</template>

<script lang="ts" setup>
import { C_URL } from "src/constants"
import { useI18n } from "vue-i18n"

defineProps<{
  noImage?: boolean
  retry: () => void
}>()

const { t } = useI18n()

function openAnimeVietsub() {
  window.open(C_URL)
}
const reload = () => location.reload()
</script>

<style></style>
