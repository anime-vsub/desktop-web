<template>
  <div v-intersection.once="onIntersection" />
  <section v-if="intersecting" class="relative mt-6 q-pa-sm">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <h2 class="text-h6 font-bold text-white m-0">
          {{ $t("binh-luan") }}
          <span class="text-gray-500 font-normal ml-1"
            >({{ totalComments }})</span
          >
        </h2>
      </div>

      <div class="flex items-center gap-2">
        <q-btn
          round
          flat
          dense
          class="text-gray-400 hover:text-white"
          @click="toggleSort"
        >
          <i-bi-sort-down v-if="sort === 'newest'" class="text-xl" />
          <i-bi-sort-up v-else class="text-xl" />
          <q-tooltip class="bg-dark text-xs">{{
            sort === "newest" ? $t("moi-nhat") : $t("cu-nhat")
          }}</q-tooltip>
        </q-btn>

        <q-btn
          round
          flat
          dense
          icon="refresh"
          class="text-gray-400 hover:text-white"
          @click="refresh"
        >
          <q-tooltip class="bg-dark text-xs">{{ $t("tai-lai") }}</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Main Comment Form -->
    <Reply
      model-value
      main
      no-autofocus
      :film-id="filmId"
      :user-avatar="authStore.user?.avatar || ''"
      :user-name="authStore.user?.username || ''"
      :message-error="$t('msg-error-cmt')"
      class="mb-8"
      @done="onPostDone"
    />

    <!-- Comments List -->
    <q-infinite-scroll :offset="250" @load="onLoad">
      <Comments
        :comments="comments"
        :film-id="filmId"
        @update="onCommentUpdate"
        @delete="onCommentDelete"
      />

      <template v-if="comments.length === 0 && !loading" #loading>
        <div class="py-12 text-center text-gray-500 italic">
          {{ $t("chua-co-binh-luan-nao") }}
        </div>
      </template>

      <template v-else #loading>
        <div class="flex justify-center py-8">
          <q-spinner-dots color="blue" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>

    <!-- Overlay Loading -->
    <div
      v-if="loading && comments.length === 0"
      class="absolute top-0 left-0 w-full h-full bg-dark-page bg-opacity-80 flex flex-col justify-center items-center rounded-xl z-20"
    >
      <q-spinner-tail color="blue" size="64px" />
      <span class="mt-4 text-gray-400 animate-pulse"
        >{{ $t("dang-tai-binh-luan") }}...</span
      >
    </div>
  </section>
  <section v-else class="py-16 flex items-center justify-center">
    <q-spinner-tail color="blue" size="48px" />
  </section>
</template>

<script lang="ts" setup>
import { useQuasar } from "quasar"
import { useAuthStore } from "stores/auth"

import { commentApi } from "./api"
import Comments from "./components/Comments.vue"
import Reply from "./components/Reply.vue"
import type { AvsComment } from "./types"

const props = defineProps<{
  href: string
  lang: string
}>()

const $q = useQuasar()
const authStore = useAuthStore()

// Extract filmId from href (e.g., http://animevietsub.tv/phim/-1234/)
const filmId = computed(() => {
  const match = props.href.match(/-(\d+)\//)
  return match ? parseInt(match[1]) : 0
})

const intersecting = ref(false)
const onIntersection = (({ isIntersecting }: any) => {
  intersecting.value ||= isIntersecting
}) as unknown as any

const loading = ref(false)
const sort = ref<"newest" | "time">("newest")
const comments = ref<AvsComment[]>([])
const offset = ref(0)
const hasMore = ref(true)
const totalComments = ref(0)

async function refresh() {
  comments.value = []
  offset.value = 0
  hasMore.value = true
  // Triggers onLoad implicitly or we can call it
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onLoad(1, () => {})
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
watch(intersecting, (v) => v && onLoad(1, () => {}))

async function onLoad(index: number, done: (stop?: boolean) => void) {
  if (!filmId.value || !hasMore.value) {
    done(true)
    return
  }

  loading.value = true
  try {
    const res = await commentApi.getComments({
      filmId: filmId.value,
      sort: sort.value,
      offset: offset.value,
      pageUrl: props.href
    })

    if (res.success) {
      if (offset.value === 0) {
        comments.value = res.comments
      } else {
        // Avoid duplicates
        const existingIds = new Set(comments.value.map((c) => c.id))
        const newComments = res.comments.filter((c) => !existingIds.has(c.id))
        comments.value = [...comments.value, ...newComments]
      }

      offset.value = res.offset
      hasMore.value = res.has_more
      totalComments.value = res.total

      done(!res.has_more)
    } else {
      throw new Error(res.error)
    }
  } catch (err) {
    $q.notify({
      message: String(err),
      color: "negative",
      position: "top"
    })
    done(true)
  } finally {
    loading.value = false
  }
}

function toggleSort() {
  sort.value = sort.value === "newest" ? "time" : "newest"
  refresh()
}

function onPostDone(newComment: AvsComment, total?: number) {
  comments.value = [newComment, ...comments.value]
  if (total !== undefined) totalComments.value = total
  else totalComments.value++
}

function onCommentUpdate(updatedComment: AvsComment) {
  const index = comments.value.findIndex((c) => c.id === updatedComment.id)
  if (index !== -1) {
    comments.value[index] = updatedComment
  }
}

function onCommentDelete(id: number) {
  comments.value = comments.value.filter((c) => c.id !== id)
  totalComments.value = Math.max(0, totalComments.value - 1)
}

// Initial load watch
watch(
  filmId,
  () => {
    if (filmId.value) refresh()
  },
  { immediate: true }
)
</script>

<style scoped>
.comments-container {
  max-width: 100%;
}
</style>
