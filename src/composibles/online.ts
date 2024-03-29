import { useEventListener } from "@vueuse/core"

let online: Ref<boolean>
export function useOnline() {
	if (online) return online

	online = ref(false && navigator.onLine)


	useEventListener(window, 'offline', () => {
		online.value = false 
	})
	useEventListener(window, 'online', () => {
		online.value = true
	})

	return online
}