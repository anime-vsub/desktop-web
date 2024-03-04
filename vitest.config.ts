import { defineConfig } from "vitest/config"

import { quasar, transformAssetUrls } from "@quasar/vite-plugin"
import vue from "@vitejs/plugin-vue"
import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

import { vitePlugins } from "./vite-plugins"

export default defineConfig({
  test: {
    setupFiles: ["@vitest/web-worker"],
    environment: "jsdom",
    globals: true
  },

  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: "src/quasar-variables.scss"
    }),
    tsconfigPaths(),
    ...vitePlugins.map(([fn, conf]) => fn(conf))
  ]
})
