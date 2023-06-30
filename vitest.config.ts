import path from "path"

import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
      stores: path.resolve(__dirname, "./src/stores")
    },
  },
  test: {
    setupFiles: ["@vitest/web-worker"],
    environment: "jsdom",
    globals: true,
  },
})
