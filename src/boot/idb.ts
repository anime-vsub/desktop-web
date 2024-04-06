import { UseStore, createStore, DEFAULT_STORE } from "idb-keyval"

let defaultGetStoreFunc: UseStore | undefined

export function customGetStore() {
  if (!defaultGetStoreFunc) {
    defaultGetStoreFunc = createStore("keyval-store", [DEFAULT_STORE, "files"])
  }
  return defaultGetStoreFunc
}
