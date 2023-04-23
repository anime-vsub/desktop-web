import path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      boot: path.resolve(__dirname, "src/boot"),
      stores: path.resolve(__dirname, "src/stores"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./setup.vitest.ts"],
  },
})
