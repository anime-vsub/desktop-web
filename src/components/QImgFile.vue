<template>
	<QImgCustom :src="srcResolved">
		<slot />
	</QImgCustom>
</template>

<script lang="ts" setup>
import QImgCustom from "./QImgCustom"
import { forceHttp2 } from "src/logic/forceHttp2"
import { computedAsync } from "@vueuse/core"

const props = defineProps<{
	src?: string
}>()
const admStore = useADM()

const srcResolved = computedAsync(
async	() => {
		if (!props.src) return
		try {
			if (props.src.startsWith("file:"))
				return URL.createObjectURL(
					new Blob([await admStore.utils.get(props.src.slice(5)) as Uint8Array])
				)
		} catch (err) {
			WARN(err)
		}
		return forceHttp2(props.src)
	},
	undefined,
	{ onError: WARN }
)
</script>
