import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
      boot: path.resolve(__dirname, "src/boot"),
      stores: path.resolve(__dirname, "src/stores"),
    },
  },
  test: {
    setupFiles: ["@vitest/web-worker", "./setup.vitest.ts"],
    environment: "jsdom",
    globals: true,
  },
})
