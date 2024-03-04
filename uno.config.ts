import transformerDirectives from "@unocss/transformer-directives"
import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetUno,
  presetWind
} from "unocss"

export default defineConfig({
  presets: [
    presetWind(),
    presetUno(),
    presetAttributify({
      prefix: "un-",
      prefixedOnly: true // <--
    }),
    presetTypography()
  ],
  rules: [
    [/^size-\[?([^[\]]+)\]?/, ([, value]) => ({ width: value, height: value })],
    [/^font-family-(.+)/, ([, value]) => ({ "font-family": value })],
    [/^font-size-(.+)/, ([, value]) => ({ "font-size": value })]
  ],
  transformers: [transformerDirectives()],
  safelist: [
    "children:!px-0",
    "!py-[6px]",
    "children:!flex",
    "bg-[rgba(28,28,30,0.9)]",
    "!shadow-8"
  ],
  theme: {
    screens: {
      // xs: { min: "0px", max: "599.99px" },
      sm: "600px", // { min: "600px", max: "1023.99px" },
      md: "1024px", // { min: "1024px", max: "1439.99px" },
      lg: "1440px", // { min: "1440px", max: "1919.99px" },
      xl: "1920px" // { min: "1920px" },
    }
  }
})
