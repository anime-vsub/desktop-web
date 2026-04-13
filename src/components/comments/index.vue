<template>
  <div class="comments-wrapper mt-8 text-gray-200 font-sans">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-[18px] font-medium text-white m-0">
        {{ t("binh-luan") }}
        <span class="text-gray-400 text-sm font-normal ml-1"
          >({{ totalComments }})</span
        >
      </h3>
    </div>

    <div class="flex gap-3 mb-8">
      <img
        src="https://ui-avatars.com/api/?name=Me&background=2d3748&color=fff"
        alt="Your Avatar"
        class="w-10 h-10 rounded-full object-cover shrink-0 bg-dark-800"
      />
      <div class="flex-1">
        <textarea
          rows="2"
          :placeholder="t('viet-binh-luan')"
          class="w-full bg-[rgba(28,28,30,0.9)] border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-main resize-none transition-colors"
        ></textarea>
        <div class="flex justify-end mt-2">
          <q-btn
            no-caps
            unelevated
            color="main"
            text-color="white"
            class="rounded-md font-medium px-4"
            :label="t('gui-binh-luan')"
          />
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div
        v-for="comment in commentsList"
        :key="comment.id"
        class="flex gap-3 group"
      >
        <div class="shrink-0">
          <img
            :src="getAvatar(comment.user_avatar)"
            :alt="comment.user_name"
            class="w-10 h-10 rounded-full object-cover bg-dark-800"
            @error="handleAvatarError"
          />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span
              class="font-bold text-[15px]"
              :class="comment.badges?.length ? 'text-red-500' : 'text-gray-200'"
            >
              {{ comment.user_name }}
            </span>

            <span
              v-if="comment.badges && comment.badges.length > 0"
              class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded flex items-center gap-1"
              :style="{
                backgroundColor: comment.badges[0].color + '33',
                color: comment.badges[0].color
              }"
            >
              <Icon
                icon="fluent:shield-task-16-filled"
                width="12"
                height="12"
              />
              {{ comment.badges[0].name }}
            </span>

            <span
              v-if="comment.thread_key && comment.thread_key !== '/'"
              class="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 bg-gray-700 text-gray-300"
            >
              <Icon
                icon="fluent:video-clip-16-regular"
                width="12"
                height="12"
              />
              {{ t("tap-_chap", [comment.thread_key]) }}
            </span>

            <span
              v-if="comment.is_global_pinned || comment.is_pinned"
              class="text-[11px] text-gray-400 flex items-center gap-1"
            >
              <Icon icon="fluent:pin-16-filled" /> {{ t("da-ghim") }}
            </span>

            <span class="text-xs text-gray-500 ml-auto flex items-center gap-1">
              {{ formatTime(comment.created_at) }}
              <span v-if="comment.edited_at > 0" class="text-[10px] italic">
                ({{ t("da-chinh-sua") }})
              </span>
            </span>
          </div>

          <div class="relative">
            <div
              class="text-sm text-gray-300 leading-relaxed mb-2 whitespace-pre-wrap break-words transition-all duration-300"
              :class="{
                'filter blur-md select-none pointer-events-none opacity-50':
                  comment.is_spoiler == 1 && !comment.isRevealed
              }"
              v-html="renderContent(comment.content)"
            ></div>

            <div
              v-if="comment.is_spoiler == 1 && !comment.isRevealed"
              class="absolute inset-0 flex items-center justify-center"
            >
              <button
                @click="comment.isRevealed = true"
                class="bg-dark-800 border border-gray-600 hover:border-gray-500 hover:bg-dark-700 text-gray-200 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-colors shadow-lg"
              >
                <Icon
                  icon="fluent:eye-show-16-regular"
                  width="14"
                  height="14"
                />
                {{ t("binh-luan-chua-spoiler-nhan-de-xem") }}
              </button>
            </div>
          </div>

          <div
            class="flex items-center gap-4 text-xs font-medium text-gray-400"
          >
            <button
              class="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Icon
                icon="fluent:thumb-like-20-regular"
                width="16"
                height="16"
              />
              <span v-if="comment.votes_up > 0">{{ comment.votes_up }}</span>
              <span v-else>{{ t("thich") }}</span>
            </button>
            <button
              class="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Icon
                icon="fluent:thumb-dislike-20-regular"
                width="16"
                height="16"
              />
              <span v-if="comment.votes_down > 0">{{
                comment.votes_down
              }}</span>
            </button>
            <button class="hover:text-white transition-colors">
              {{ t("phan-hoi") }}
            </button>

            <button
              class="ml-auto opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
            >
              <Icon
                icon="carbon:overflow-menu-vertical"
                width="16"
                height="16"
              />
            </button>
          </div>

          <div
            v-if="comment.replies && comment.replies.length > 0"
            class="mt-4 ml-1 pl-4 border-l-2 border-[rgba(255,255,255,0.05)] space-y-4"
          >
            <div
              v-for="reply in comment.replies"
              :key="reply.id"
              class="flex gap-2.5 group/reply"
            >
              <div class="shrink-0">
                <img
                  :src="getAvatar(reply.user_avatar)"
                  :alt="reply.user_name"
                  class="w-7 h-7 rounded-full object-cover bg-dark-800"
                  @error="handleAvatarError"
                />
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span
                    class="font-bold text-[13px]"
                    :class="
                      reply.badges?.length ? 'text-red-500' : 'text-gray-200'
                    "
                  >
                    {{ reply.user_name }}
                  </span>

                  <span
                    v-if="reply.badges && reply.badges.length > 0"
                    class="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded flex items-center gap-1"
                    :style="{
                      backgroundColor: reply.badges[0].color + '33',
                      color: reply.badges[0].color
                    }"
                  >
                    <Icon
                      icon="fluent:shield-task-16-filled"
                      width="10"
                      height="10"
                    />
                    {{ reply.badges[0].name }}
                  </span>

                  <span
                    v-if="reply.thread_key && reply.thread_key !== '/'"
                    class="text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 bg-gray-700 text-gray-300"
                  >
                    {{ t("tap-_chap", [reply.thread_key]) }}
                  </span>

                  <span
                    class="text-[11px] text-gray-500 ml-auto flex items-center gap-1"
                  >
                    {{ formatTime(reply.created_at) }}
                    <span v-if="reply.edited_at > 0" class="text-[9px] italic">
                      ({{ t("da-chinh-sua") }})
                    </span>
                  </span>
                </div>

                <div class="relative">
                  <div
                    class="text-[13px] text-gray-300 leading-relaxed mb-1.5 whitespace-pre-wrap break-words transition-all duration-300"
                    :class="{
                      'filter blur-md select-none pointer-events-none opacity-50':
                        reply.is_spoiler == 1 && !reply.isRevealed
                    }"
                    v-html="renderContent(reply.content)"
                  ></div>

                  <div
                    v-if="reply.is_spoiler == 1 && !reply.isRevealed"
                    class="absolute inset-0 flex items-center justify-start"
                  >
                    <button
                      @click="reply.isRevealed = true"
                      class="bg-dark-800 border border-gray-600 hover:bg-dark-700 text-gray-200 px-2 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 transition-colors"
                    >
                      <Icon
                        icon="fluent:eye-show-16-regular"
                        width="12"
                        height="12"
                      />
                      {{ t("xem-spoiler") }}
                    </button>
                  </div>
                </div>

                <div
                  class="flex items-center gap-3 text-[11px] font-medium text-gray-400"
                >
                  <button
                    class="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Icon
                      icon="fluent:thumb-like-20-regular"
                      width="14"
                      height="14"
                    />
                    <span v-if="reply.votes_up > 0">{{ reply.votes_up }}</span>
                  </button>
                  <button
                    class="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <Icon
                      icon="fluent:thumb-dislike-20-regular"
                      width="14"
                      height="14"
                    />
                    <span v-if="reply.votes_down > 0">{{
                      reply.votes_down
                    }}</span>
                  </button>
                  <button class="hover:text-white transition-colors">
                    {{ t("phan-hoi") }}
                  </button>

                  <button
                    class="ml-auto opacity-0 group-hover/reply:opacity-100 hover:text-white transition-opacity"
                  >
                    <Icon
                      icon="carbon:overflow-menu-vertical"
                      width="14"
                      height="14"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="comment.replies_count > (comment.replies?.length || 0)"
            class="mt-3 ml-2"
          >
            <button
              @click="loadReplies(comment)"
              :disabled="comment.isLoadingReplies"
              class="text-blue-400 hover:text-blue-300 text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon
                v-if="!comment.isLoadingReplies"
                icon="fluent:arrow-reply-down-16-regular"
                width="16"
                height="16"
                class="scale-x-[-1]"
              />
              <Icon
                v-else
                icon="fluent:spinner-ios-16-regular"
                class="animate-spin"
                width="16"
                height="16"
              />
              {{
                t("xem-them-count-phan-hoi", [
                  comment.replies_count - (comment.replies?.length || 0)
                ])
              }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isLoadingComments && commentsList.length === 0"
      class="flex justify-center mt-10"
    >
      <q-spinner-dots color="main" size="40px" />
    </div>

    <div
      v-if="hasMoreComments && commentsList.length > 0"
      class="mt-8 text-center"
    >
      <q-btn
        @click="loadMoreComments"
        :loading="isLoadingComments"
        no-caps
        outline
        rounded
        color="grey-7"
        class="text-gray-300 font-medium px-6"
        :label="t('tai-them-binh-luan')"
      >
        <template v-slot:loading>
          <q-spinner-dots class="on-left" /> {{ t("dang-tai") }}
        </template>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { Icon } from "@iconify/vue"
import { get } from "src/logic/http"
import { C_URL } from "src/constants"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const props = defineProps<{
  filmId: number | string
}>()

const commentsList = ref<any[]>([])
const totalComments = ref(0)
const hasMoreComments = ref(true)
const currentOffset = ref(0)
const isLoadingComments = ref(false)

onMounted(() => {
  if (props.filmId) {
    loadMoreComments()
  }
})

watch(
  () => props.filmId,
  () => {
    commentsList.value = []
    currentOffset.value = 0
    hasMoreComments.value = true
    totalComments.value = 0
    loadMoreComments()
  }
)

const loadMoreComments = async () => {
  if (isLoadingComments.value || !hasMoreComments.value) return
  isLoadingComments.value = true

  try {
    const response = await get({
      url: `${C_URL}/ajax/comment?action=get&film_id=${props.filmId}&sort=newest&offset=${currentOffset.value}`,
      responseType: "json"
    })

    const data = response.data as any
    if (data.success) {
      const newComments = data.comments.map((c: any) => ({
        ...c,
        replies: c.replies || [],
        replies_offset: 0,
        isLoadingReplies: false,
        isRevealed: false
      }))

      commentsList.value.push(...newComments)
      currentOffset.value = data.offset
      hasMoreComments.value = data.has_more
      totalComments.value = data.total
    }
  } catch (error) {
    console.error("Lỗi khi tải bình luận:", error)
  } finally {
    isLoadingComments.value = false
  }
}

const loadReplies = async (comment: any) => {
  if (comment.isLoadingReplies) return
  comment.isLoadingReplies = true

  try {
    const offset = comment.replies_offset || 0
    const response = await get({
      url: `${C_URL}/ajax/comment?action=get_replies&comment_id=${comment.id}&sort=newest&offset=${offset}`,
      responseType: "json"
    })

    const data = response.data as any
    if (data.success) {
      if (!comment.replies) comment.replies = []

      const newReplies = data.replies.map((r: any) => ({
        ...r,
        isRevealed: false
      }))

      comment.replies.push(...newReplies)
      comment.replies_offset = data.offset

      if (!data.has_more) {
        comment.replies_count = comment.replies.length
      }
    }
  } catch (error) {
    console.error("Lỗi khi tải phản hồi:", error)
  } finally {
    comment.isLoadingReplies = false
  }
}

const getAvatar = (url: string) => {
  if (!url || url.includes("googleusercontent.com/profile/picture/")) {
    return `https://ui-avatars.com/api/?name=User&background=2d3748&color=fff`
  }
  return url
}

const handleAvatarError = (e: Event) => {
  ;(e.target as HTMLImageElement).src =
    "https://ui-avatars.com/api/?name=Err&background=2d3748&color=fff"
}

const formatTime = (timestamp: number) => {
  if (!timestamp) return ""
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
}

const renderContent = (content: string) => {
  if (!content) return ""

  let html = content

  const stickers: string[] = []
  html = html.replace(/\[sticker:(.*?)\]/g, (match, url) => {
    stickers.push(url)
    return `__STICKER_${stickers.length - 1}__`
  })

  html = html.replace(/@\[?(.*?)\]?(?=\s|$)/g, (match, username) => {
    return `<span class="text-blue-400 font-medium hover:underline cursor-pointer">@${username}</span>`
  })

  const urlRegex = /(https?:\/\/[^\s]+)/g
  html = html.replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline break-all">$1</a>'
  )

  html = html.replace(/__STICKER_(\d+)__/g, (match, indexStr) => {
    const url = stickers[parseInt(indexStr)]
    if (url.includes("googleusercontent.com/profile/picture/")) {
      return ` <span class="text-yellow-400">🌟(${t("sticker-loi")})</span> `
    }
    return `<img src="${url}" alt="sticker" class="inline-block h-12 w-12 ml-1 align-middle rounded" />`
  })

  return html
}
</script>
