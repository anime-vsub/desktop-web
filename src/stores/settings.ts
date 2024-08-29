import { defineStore } from "pinia"
import type { servers } from "src/constants"
import { getNavigatorLanguage } from "src/i18n"

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    player: {
      autoNext: true,
      enableRemindStop: true,
      volume: 1,
      server: <keyof typeof servers>"DU",
      autoSkipIEnd: false,
      preResolve: 30,
      checkEndPreList: 5
    },
    ui: {
      modeMovie: false,
      newPlayer: true,
      shortcutsQAP: true,
      menuTransparency: true,
      commentAnime: true,
      currentTime: true
    },
    locale: getNavigatorLanguage(),
    infinityScroll: true,
    restoreLastEp: true,
    enablePersistent: true,

    autoSyncNotify: false,
    showCountNotify: false
  }),
  persist: true
})
