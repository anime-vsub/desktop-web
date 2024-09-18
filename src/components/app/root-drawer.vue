<template>
  <q-drawer
    :model-value="hideDrawer ? showDrawer : true"
    @update:model-value="hideDrawer ? (showDrawer = $event) : undefined"
    :mini="hideDrawer ? false : !showDrawer"
    :width="250"
    :breakpoint="500"
    :overlay="hideDrawer"
    :behavior="hideDrawer ? 'mobile' : undefined"
    :key="hideDrawer + ''"
    class="bg-dark-page overflow-visible column flex-nowrap"
  >
    <q-toolbar v-if="hideDrawer">
      <q-btn
        dense
        flat
        round
        icon="menu"
        class="mr-5"
        @click="showDrawer = !showDrawer"
      />

      <router-link to="/" class="flex items-end">
        <img src="~assets/app_icon.svg" width="35" height="35" />
        <span style="font-family: Caveat" class="text-[25px]">nimeVsub</span>
      </router-link>
    </q-toolbar>

    <div class="h-full overflow-y-auto scrollbar-custom">
      <q-list class="mx-2">
        <template
          v-for="{ icon, active, name, path, divider } in drawers"
          :key="name"
        >
          <q-separator
            v-if="divider"
            class="bg-[rgba(255,255,255,0.1)] my-6 mr-2"
          />
          <q-item
            v-else
            clickable
            v-ripple
            class="min-h-0 my-2 rounded-xl"
            :to="path"
            active-class=""
            exact-active-class="bg-[rgba(255,255,255,0.1)] text-main"
          >
            <q-item-section avatar class="pr-0 min-w-0">
              <Icon
                v-if="router.resolve(path!).fullPath !== route.fullPath"
                :icon="icon!"
                width="23"
                height="23"
              />
              <Icon v-else :icon="active!" width="23" height="23" />
            </q-item-section>
            <q-item-section class="ml-5">
              <q-item-label class="text-[16px]">{{ name }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <!-- playlist -->

        <template
          v-if="
            routerReady &&
            (hideDrawer ? showDrawer : true) &&
            playlistStore.playlists &&
            playlistStore.playlists.length > 0
          "
        >
          <q-separator class="bg-[rgba(255,255,255,0.1)] my-6 mr-2" />

          <q-item
            v-for="item in playlistStore.playlists"
            :key="item.name"
            :to="`/playlist/${btoa('animevsub-' + item.id)}`"
            clickable
            v-ripple
            class="min-h-0 my-2 rounded-xl"
            active-class=""
            exact-active-class="bg-[rgba(255,255,255,0.1)] text-main"
          >
            <q-item-section avatar class="pr-0 min-w-0">
              <Icon
                icon="fluent:navigation-play-20-regular"
                width="23"
                height="23"
              />
            </q-item-section>
            <q-item-section class="ml-5">
              <q-item-label class="text-[16px]">{{ item.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>

      <div v-if="hideDrawer ? true : showDrawer" class="text-gray-500">
        <a
          v-for="item in drawersBottom"
          :key="item.name"
          class="py-2 px-4 block"
          :href="item.href"
          target="_blank"
          >{{ item.name }}</a
        >
      </div>
    </div>
  </q-drawer>
</template>

<script lang="ts" setup>
// eslint-disable-next-line import/order
import { Icon } from "@iconify/vue"

// =========== suth

// import PanelFixCSR from "components/PanelFixCSR.vue"
import { usePlaylistStore } from "stores/playlist"
import { useI18n } from "vue-i18n"
import { useRoute, useRouter } from "vue-router"

// key bind
const { t } = useI18n()
const drawers = computed(() => [
  {
    icon: "fluent:home-24-regular",
    active: "fluent:home-24-filled",
    name: t("trang-chu"),
    path: "/"
  },
  {
    icon: "ant-design:fire-outlined",
    active: "ant-design:fire-filled",
    name: t("thinh-hanh"),
    path: "/bang-xep-hang"
  },
  {
    icon: "ic:outline-filter-alt",
    active: "ic:round-filter-alt",
    name: t("muc-luc"),
    path: "/danh-sach/all"
  },
  {
    icon: "fluent:calendar-clock-24-regular",
    active: "fluent:calendar-clock-24-filled",
    name: t("lich-chieu"),
    path: "/lich-chieu-phim"
  },

  { divider: true },

  {
    icon: "material-symbols:favorite-outline-rounded",
    active: "material-symbols:favorite-rounded",
    name: t("theo-doi"),
    path: "/tai-khoan/follow"
  },
  {
    icon: "fluent:history-24-regular",
    active: "fluent:history-24-filled",
    name: t("lich-su"),
    path: "/tai-khoan/history"
  }
])
const drawersBottom = computed(() => [
  {
    name: t("ve-chung-toi"),
    href: "https://anime-vsub.github.io/about"
  },
  {
    name: t("lien-he-chung-toi"),
    href: "mailto:ogmo2r3q@duck.com?subject=Phản hồi ứng dụng web AnimeVsub"
  },
  {
    name: t("tai-ung-dung"),
    href: "https://anime-vsub.github.io"
  },
  {
    name: t("dieu-khoan-su-dung"),
    href: "https://anime-vsub.github.io/about/tems-of-use"
  },
  {
    name: t("chinh-sach-rieng-tu"),
    href: "https://anime-vsub.github.io/about/privacy-police"
  },
  {
    name: t("khieu-nai-vi-pham"),
    href: "https://anime-vsub.github.io/about/disclaimer"
  }
])

const route = useRoute()
const router = useRouter()
const playlistStore = usePlaylistStore()

const showDrawer = defineModel<boolean>("modelValue", { required: true })

const routerReady = ref(false)
void router.isReady().then(() => (routerReady.value = true))

const hideDrawer = computed(() => {
  if (!routerReady.value) return true
  return route.meta?.hideDrawer === true
})
watch(
  hideDrawer,
  (hideDrawer) => {
    if (hideDrawer) showDrawer.value = false
    else showDrawer.value = true
  },
  { immediate: true }
)
// import QrScanner from "qr-scanner"

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

const btoa = (str: string) => self.btoa(str).replace(/={2}$/, "")
</script>
