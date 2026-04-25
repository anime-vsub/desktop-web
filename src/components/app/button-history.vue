<template>
  <q-btn v-if="authStore.isLogged" round unelevated class="mr-2">
    <Icon
      :icon="
        showMenuHistory ? 'fluent:clock-24-filled' : 'fluent:clock-24-regular'
      "
      width="24"
      height="24"
    />

    <q-menu
      v-model="showMenuHistory"
      class="flex flex-nowrap column bg-dark-page shadow-xl"
      ref="menuRef"
    >
      <q-card
        class="transparent shadow-none w-[415px] scrollbar-custom overflow-y-auto"
        ref="cardRef"
      >
        <q-card-section>
          <history-database :scroll-target="cardRef?.$el" />
        </q-card-section>
      </q-card>

      <router-link to="/tai-khoan/history" class="block py-2 text-center">{{
        t("xem-tat-ca")
      }}</router-link>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"
import { QCard } from "quasar"
import { useAuthStore } from "src/stores/auth"

const { t } = useI18n()

const authStore = useAuthStore()

const cardRef = ref<QCard>()

const showMenuHistory = ref(false)
</script>
