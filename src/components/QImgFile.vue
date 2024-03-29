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
					new Blob([await admStore.fs.readFile(props.src.slice(5))])
				)
		} catch (err) {
			WARN(err)
		}
		return forceHttp2(data.value.image)
	},
	undefined,
	{ onError: WARN }
)
</script>
