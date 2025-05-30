<template>
  <q-layout view="hHh Lpr lFf">
    <q-header
      class="bg-dark-page py-1 px-2"
      :class="{
        '!bg-transparent': route.meta?.transparentHeader
      }"
    >
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          class="mr-5"
          @click="showDrawer = !showDrawer"
        />

        <router-link to="/" class="flex flex-nowrap items-end">
          <img src="~assets/app_icon.svg" width="35" height="35" />
          <span style="font-family: Caveat" class="text-[25px]">nimeVsub</span>
        </router-link>

        <q-space />

        <search-bar />

        <q-space />

        <button-github />

        <button-follow v-if="authStore.isLogged" />
        <button-history v-if="authStore.isLogged" />
        <button-notify v-if="authStore.isLogged" />

        <button-setting />

        <q-btn
          v-if="!authStore.isLogged"
          flat
          stack
          no-caps
          rounded
          unelevated
          class="font-weight-normal"
          @click="showDialogLogin = true"
        >
          <Icon icon="fluent:person-24-regular" width="20" height="20" />
          {{ t("dang-nhap") }}
        </q-btn>

        <q-btn
          flat
          no-caps
          rounded
          unelevated
          class="font-weight-normal"
          href="https://anime-vsub.github.io"
          target="_blank"
        >
          <Icon icon="fluent:phone-24-regular" width="20" height="20" />
          {{ t("app") }}
        </q-btn>
      </q-toolbar>
    </q-header>

    <root-drawer v-model="showDrawer" />

    <q-page-container>
      <q-page :style-fn="route.meta?.styleFn">
        <router-view
          v-if="Http.version && semverGt(Http.version, '1.0.41')"
          v-slot="{ Component }"
        >
          <component :is="Component" />
        </router-view>
        <NotExistsExtension v-else />
      </q-page>
    </q-page-container>
  </q-layout>

  <dialog-signin v-model="showDialogLogin" />
  <!-- <PanelFixCSR v-model="showPanelFixCSR" /> -->
</template>

<script lang="ts" setup>
// eslint-disable-next-line import/order
import { Icon } from "@iconify/vue"

import "@fontsource/caveat"

// =========== suth

import { Http } from "client-ext-animevsub-helper"
// import PanelFixCSR from "components/PanelFixCSR.vue"
import ButtonNotify from "components/app/button-notify.vue"
import semverGt from "semver/functions/gt"
import { useAuthStore } from "stores/auth"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"

import NotExistsExtension from "./NotExistsExtension.vue"

// key bind
const { t } = useI18n()

const route = useRoute()
const authStore = useAuthStore()

// import QrScanner from "qr-scanner"

const showDialogLogin = ref(false)
const showDrawer = ref(false)

// ============= states ===============
// key bind /

// check for update
// =========== panel fix CSR ===========
// const showPanelFixCSR = ref(false)
// useEventListener(window, "keydown", (event) => {
//   if (event.key === "`" && event.ctrlKey) {
//     showPanelFixCSR.value = !showPanelFixCSR.value
//   }
// })
</script>

<style lang="scss">
@use "sass:math";

.filled {
  display: none;
}

.tab-active {
  color: #fff;

  .regular {
    display: none;
  }

  .filled {
    display: inline-block;
  }
}

.only-router-active {
  display: none;
}
</style>

<style lang="scss">
.card-changelog {
  a {
    color: #58a6ff;
  }
}
</style>
