import Pages from "@tachibana-shin/vite-plugin-pages"
import { unheadVueComposablesImports } from "@unhead/vue"
import { join, resolve } from "path"
import UnoCSS from "unocss/vite"
import AutoImport from "unplugin-auto-import/vite"
import IconsResolver from "unplugin-icons/resolver"
import Icons from "unplugin-icons/vite"
import Components from "unplugin-vue-components/vite"
import DefineOptions from "unplugin-vue-define-options/vite"
// import { VueRouterAutoImports } from "unplugin-vue-router"
// import VueRouter from "unplugin-vue-router/vite"
import type { Plugin } from "vite"
import RemoveConsole from "vite-plugin-remove-console"
import ReWriteAll from "vite-plugin-rewrite-all"
import Layouts from "vite-plugin-vue-layouts"
import ViteI18n from "@intlify/vite-plugin-vue-i18n"
import fs from "fs"
import ISO6391 from "iso-639-1"

const reg = /[\w-]+(?=\.json$)/
function vitePluginI18nLangs(): Plugin {
  const virtualModuleId = "virtual:i18n-langs"
  const resolvedVirtualModuleId = "\0" + "virtual:i18n-langs"

  return {
    name: "vite-plugin-i18n-langs",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const langs = (
          await fs.promises.readdir(join(__dirname, "src/i18n/messages"))
        ).map((name) => reg.exec(name)?.[0])
        const languages = langs.map((code) => {
          return {
            code,
            name: ISO6391.getNativeName(code?.slice(0, 2) ?? "en")
          }
        })

        return {
          code: `export default ${JSON.stringify(languages)}`,
          map: null
        }
      }
    }
  }
}

export const vitePlugins: [
  (conf: object | undefined) => Plugin | Plugin[],
  object | undefined
][] = [
  [
    ViteI18n,
    {
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      // compositionOnly: false,

      // you need to set i18n resource including paths !
      include: resolve(__dirname, "./src/i18n/**")
    }
  ],
  [ReWriteAll, {}],
  [RemoveConsole as unknown as () => Plugin, {}],
  [vitePluginI18nLangs, {}],

  [
    Pages,
    {
      routeStyle: "nuxt3",
      importMode: () => "async",
      exclude: ["\\!*/**"]
    }
  ],
  [ReWriteAll, {}],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [RemoveConsole as unknown as any, {}],
  [
    Layouts,
    {
      defaultLayout: "MainLayout"
    }
  ],
  [
    UnoCSS,
    {
      configFile: "./uno.config.ts"
    }
  ],
  [
    AutoImport,
    {
      include: [/\.tsx?$/, /\.vue$/, /\.vue\?vue/],
      imports: [
        "vue",
        "vue-router",
        // VueRouterAutoImports,
        {
          "@iconify/vue": ["Icon"],
          "@vueuse/core": ["computedAsync", "watchImmediate", "useStorage"],
          "@vueuse/router": ["useRouteParams"],
          quasar: ["useQuasar"],
          "vue-request": ["useRequest"],
          "vue-i18n": ["useI18n"]
        },
        unheadVueComposablesImports
      ],
      dirs: [
        "src/logic/**/*.ts",
        "src/logic/**/*.tsx",
        "src/stores/**/*.ts",
        "src/composibles/*.ts",
        "src/boot/*.ts",
        "src/*.ts"
      ],
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true
      }
    }
  ],
  [
    Components,
    {
      resolvers: [
        IconsResolver(),
        (componentName: string) => {
          if (componentName.toLowerCase() === "icon")
            return {
              name: componentName,
              from: "@iconify/vue"
            }
        }
      ]
    }
  ],
  [DefineOptions, {}],
  [Icons, {}]
]
