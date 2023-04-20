import { defineStore } from "pinia"
import { getNavigatorLanguage } from "src/i18n"

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    player: {
      autoNext: true,
      enableRemindStop: true,
      volume: 1,
      quality: <null|`s${number}_${number}`>null,
      lowQuality: false
    },
    ui: {
      modeMovie: false,
      newPlayer: true,
      shortcutsQAP: false,
      menuTransparency: true,
      commentAnime: true,
    },
    locale: getNavigatorLanguage(),
    infinityScroll: true,
  }),
  persist: true,
})
