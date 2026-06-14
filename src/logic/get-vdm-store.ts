const vdmStoreRef = shallowRef<ReturnType<
  typeof import("stores/vdm").useVDMStore
> | null>(null)
export function getVdmStoreCache() {
  return vdmStoreRef.value
}
export async function getVdmStore() {
  const { useVDMStore } = await import("stores/vdm")

  vdmStoreRef.value ??= useVDMStore()

  return vdmStoreRef.value
}
