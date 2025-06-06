/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

import fs from "fs"
import path from "path"

import type { QuasarConf } from "@quasar/app-vite/types/configuration/conf"
import { config } from "dotenv"
import ISO6391 from "iso-639-1"
import { extend } from "quasar"
import { configure } from "quasar/wrappers"
import AutoImport from "unplugin-auto-import/vite"
import IconsResolver from "unplugin-icons/resolver"
import Icons from "unplugin-icons/vite"
import Components from "unplugin-vue-components/vite"
import type { Plugin } from "vite"

config()

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
          await fs.promises.readdir(path.join(__dirname, "src/i18n/messages"))
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

export default configure(function (/* ctx */) {
  const conf: QuasarConf = {
    ["eslint" as unknown as any]: {
      // fix: true,
      // include = [],
      // exclude = [],
      // rawOptions = {},
      warnings: false,
      errors: false
    },

    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: [
      "console",
      "windi",
      "firebase",
      "supabase",
      "head",
      "i18n",
      "task-manager"
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ["app.scss"],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      "roboto-font", // optional, you are not bound to it
      "material-icons" // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16"
      },

      vueRouterMode: "history", // available values: 'hash', 'history'
      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI: false,

      ["rebuildCache" as unknown as any]: false, // rebuilds Vite/linter/etc cache on startup

      // publicPath: '/',
      // analyze: true,
      env: {
        ...Object.fromEntries(
          Object.entries(process.env).filter(
            ([key]) => !key.includes("(") && !key.includes(" ")
          )
        )
      },
      // rawDefine: {}
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir

      extendViteConf(viteConf) {
        extend(true, viteConf, {
          optimizeDeps: {
            exclude: ["@ffmpeg/ffmpeg"]
          },

          resolve: {
            alias: {
              path: "path-browserify"
            }
          },
          server: {
            // configure vite for HMR with Gitpod
            // hmr: process.env.GITPOD_WORKSPACE_URL
            //   ? {
            //       // removes the protocol and replaces it with the port we're connecting to
            //       host: process.env.GITPOD_WORKSPACE_URL.replace(
            //         "https://",
            //         "9000-"
            //       ),
            //       protocol: "wss",
            //       clientPort: 443,
            //     }
            //   : process.env.CODESPACE_NAME
            //   ? {
            //       host: `${process.env.CODESPACE_NAME}-9000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`,
            //       protocol: "wss",
            //       clientPort: 443,
            //     }
            //   : true,
          }
        })
      },
      // viteVuePluginOptions: {},

      vitePlugins: [
        ["vite-plugin-windicss", {}],
        [
          "@intlify/vite-plugin-vue-i18n",
          {
            // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
            // compositionOnly: false,

            // you need to set i18n resource including paths !
            include: path.resolve(__dirname, "./src/i18n/**")
          }
        ],
        [Icons, {}],
        [
          Components,
          {
            resolvers: [
              IconsResolver({
                prefix: "i"
              })
            ]
          }
        ],
        [
          AutoImport,
          {
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
          }
        ],
        // ["vite-plugin-rewrite-all", {}],
        [
          "vite-plugin-remove-console",
          {
            external: ["src/boot/console.ts"]
          }
        ],
        [vitePluginI18nLangs, {}]
      ] as unknown as any
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      open: false // opens browser window automatically
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {
        dark: true,
        loadingBar: {
          color: "main"
        }
      },

      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: ["AppFullscreen", "Notify", "Dialog", "Loading", "LoadingBar"]
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#sourcefiles
    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router/index',
    //   store: 'src/store/index',
    //   registerServiceWorker: 'src-pwa/register-service-worker',
    //   serviceWorker: 'src-pwa/custom-service-worker',
    //   pwaManifestFile: 'src-pwa/manifest.json',
    //   electronMain: 'src-electron/electron-main',
    //   electronPreload: 'src-electron/electron-preload'
    // },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      // ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
      // will mess up SSR

      // extendSSRWebserverConf (esbuildConf) {},
      // extendPackageJson (json) {},

      pwa: false,

      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      prodPort: 3000, // The default port that the production server should use
      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        "render" // keep this as last one
      ]
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      ["workboxMode" as unknown as any]: "InjectManifest", // or 'generateSW'
      injectPwaMetaTags: true,
      swFilename: "sw.js",
      manifestFilename: "manifest.json",
      useCredentialsForManifestTag: false,
      // extendGenerateSWOptions (cfg) {}
      extendInjectManifestOptions(cfg) {
        cfg.globIgnores ??= []
        cfg.globIgnores.push(
          "_redirects",
          "_headers",
          "google7b3e7893e059da35.html"
        )
      }
      // extendManifestJson (json) {}
      // extendPWACustomSWConf (esbuildConf) {}
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    bin: {
      linuxAndroidStudio: "./noop.sh"
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf (esbuildConf)
      // extendElectronPreloadConf (esbuildConf)

      inspectPort: 5858,

      bundler: "packager", // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      ["builder" as unknown as any]: {
        // https://www.electron.build/configuration/configuration

        appId: "git.shin.animevsub"
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      contentScripts: ["my-content-script"]

      // extendBexScriptsConf (esbuildConf) {}
      // extendBexManifestJson (json) {}
    }
  }

  return conf
})
