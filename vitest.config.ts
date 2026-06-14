import { join } from "path"

import AutoImport from "unplugin-auto-import/vite"
import IconsResolver from "unplugin-icons/resolver"
import Icons from "unplugin-icons/vite"
import Components from "unplugin-vue-components/vite"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    setupFiles: ["@vitest/web-worker"],
    environment: "jsdom",
    globals: true
  },
  resolve: {
    alias: {
      "src/": join(__dirname, "src/")
    }
  },
  plugins: [
    Icons(),
    Components({
      resolvers: [
        IconsResolver({
          prefix: "i"
        })
      ]
    }),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        {
          quasar: ["useQuasar"],
          "vue-i18n": ["useI18n"]
          // "@vueuse/core": ["computedAsync"]
        }
      ],
      dirs: ["./src/*.ts", "./src/composibles"],
      dts: "./auto-imports.d.ts",
      eslintrc: {
        enabled: true
      }
    })
  ]
})
