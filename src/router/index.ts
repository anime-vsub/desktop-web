import { LoadingBar } from "quasar"
import { route } from "quasar/wrappers"
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from "vue-router"
import { setupLayouts } from "virtual:generated-layouts"
import generatedRoutes from "virtual:generated-pages"

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const routes = setupLayouts(generatedRoutes)

routes.unshift(
  {
    path: "/:mainPath(.*)*/trang-:page(\\d+)",
    redirect(to) {
      return `/${(to.params.mainPath as string[]).join("/")}?page=${
        to.params.page
      }`
    }
  },
  {
    path: "/:type_normal(anime-bo|anime-le|hoat-hinh-trung-quoc|anime-sap-chieu|anime-moi)",
    redirect(to) {
      return `/danh-sach/${to.params.type_normal}`
    }
  },
  {
    path: "/:type_normal(danh-sach|the-loai|quoc-gia|tag)/:value",
    alias: [":type_normal(season)/:value(.+/.+)"],
    component: () => import("pages/![type-normal]/[[value]].vue"),
    meta: {
      footer: false
    }
  },
  {
    path: "/muc-luc",
    redirect: "/danh-sach/all"
  }
)
routes.push(
  {
    name: "watch-anime",
    path: "/phim/:season/:chapName(.+)?-:chap(\\d+)", // [feature or defect]
    alias: ["/phim/:season/:chapName(\\0)?:chap(\\d+)", "/phim/:season"],
    component: () => import("pages/!phim/[season].vue"),
    meta: {
      hideDrawer: true
    }
  },

  // try remove .html after url
  {
    path: "/:catchAll(.*)*.html",
    redirect(to) {
      console.log(to)
      return `/${(to.params.catchAll as string[]).join("/")}`
    }
  }
)

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: (to, from, saved) => saved ?? { left: 0, top: 0 },
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(() => LoadingBar.start())
  Router.afterEach(() => LoadingBar.stop())

  return Router
})
