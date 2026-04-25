<template>
  <q-btn v-if="authStore.isLogged" round unelevated class="mr-2">
    <Icon
      :icon="
        showMenuFollow
          ? 'majesticons:bookmark-plus'
          : 'majesticons:bookmark-plus-line'
      "
      width="24"
      height="24"
    />

    <q-menu
      v-model="showMenuFollow"
      class="flex flex-nowrap column bg-dark-page shadow-xl"
    >
      <q-card
        class="transparent shadow-none w-[415px] scrollbar-custom overflow-y-auto"
        ref="cardRef"
      >
        <q-card-section>
          <follow-api :scroll-target="cardRef?.$el" />
        </q-card-section>
      </q-card>

      <router-link to="/tai-khoan/follow" class="block py-2 text-center">{{
        t("xem-tat-ca")
      }}</router-link>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { QCard } from "quasar"
import { useAuthStore } from "stores/auth"

const { t } = useI18n()

const authStore = useAuthStore()

const showMenuFollow = ref(false)

const cardRef = ref<QCard>()
</script>
