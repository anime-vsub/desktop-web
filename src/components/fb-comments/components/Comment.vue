<template>
  <div class="py-3 text-base flex flex-nowrap items-start">
    <q-avatar size="40px" class="flex-shrink-0">
      <q-img
        no-spinner
        :src="comment.user_avatar || 'https://www.gravatar.com/avatar/?d=mp'"
        :alt="comment.user_name"
      />
    </q-avatar>

    <div class="text-sm w-full min-w-0 ml-4">
      <!-- main comment content -->
      <div v-if="!editing" class="flex flex-nowrap">
        <div class="w-full min-w-0">
          <div class="flex items-center flex-wrap gap-2">
            <span
              class="text-gray-900 dark:text-white font-semibold cursor-pointer hover:underline"
            >
              {{ comment.user_name }}
            </span>

            <!-- Badges -->
            <div v-if="comment.badges?.length" class="flex gap-1">
              <q-badge
                v-for="(badge, i) in comment.badges"
                :key="i"
                :style="{ backgroundColor: badge.color }"
                class="px-2 py-0.5 text-10px"
              >
                <i v-if="badge.icon" :class="[`fa ${badge.icon}`, 'mr-1']"></i>
                {{ badge.name }}
              </q-badge>
            </div>

            <!-- Global Pinned / Pinned -->
            <q-badge
              v-if="comment.is_global_pinned"
              color="orange-9"
              class="px-2"
            >
              <i-bi-bullseye class="mr-1" />
              {{ $t("tin-quan-trong") }}
            </q-badge>
            <q-badge
              v-else-if="comment.is_pinned && !isReply"
              color="blue-9"
              class="px-2"
            >
              <i-bi-pin-angle-fill class="mr-1" />
              {{ $t("da-ghim") }}
            </q-badge>

            <time
              class="text-0.75rem text-gray-500 dark:text-gray-400"
              :title="
                dayjs(comment.created_at * 1000).format('DD/MM/YYYY HH:mm')
              "
            >
              {{ dayjs(comment.created_at * 1000).fromNow() }}
            </time>
          </div>

          <!-- Banned/Hidden Notice -->
          <div
            v-if="comment.is_hidden || comment.user_ban"
            class="mt-2 p-2 bg-red-900 bg-opacity-10 rounded border border-red-900 border-opacity-20 italic text-gray-500 flex items-center gap-2"
          >
            <i-bi-eye-slash-fill />
            <span>{{ comment.hide_reason || $t("binh-luan-da-bi-an") }}</span>
          </div>

          <div
            v-else
            class="mt-1 text-gray-700 dark:text-gray-200 whitespace-pre-wrap break-words leading-relaxed"
          >
            <p
              v-html="
                comment.content.replace(
                  /\[sticker:([^]+)\]/,
                  '<img src=\'$1\' />'
                )
              "
            ></p>
            <span
              v-if="comment.edited_at"
              class="text-0.7rem text-gray-500 italic ml-1"
            >
              ({{ $t("da-chinh-sua") }})
            </span>
          </div>

          <!-- Actions -->
          <div
            v-if="!comment.is_hidden && !comment.user_ban"
            class="flex items-center gap-4 mt-2"
          >
            <div class="flex items-center gap-1 group">
              <q-btn
                round
                unelevated
                padding="4px"
                :color="comment.user_vote === 1 ? 'blue' : 'transparent'"
                class="text-gray-500 dark:text-gray-400 group-hover:text-blue"
                @click="vote(1)"
              >
                <i-bi-hand-thumbs-up-fill v-if="comment.user_vote === 1" />
                <i-bi-hand-thumbs-up v v-else />
              </q-btn>
              <span class="text-xs text-gray-500">{{ comment.votes_up }}</span>
            </div>

            <div class="flex items-center gap-1 group">
              <q-btn
                round
                unelevated
                padding="4px"
                :color="comment.user_vote === -1 ? 'red' : 'transparent'"
                class="text-gray-500 dark:text-gray-400 group-hover:text-red"
                @click="vote(-1)"
              >
                <i-bi-hand-thumbs-down-fill v-if="comment.user_vote === -1" />
                <i-bi-hand-thumbs-down v-else />
              </q-btn>
              <span class="text-xs text-gray-500">{{
                comment.votes_down
              }}</span>
            </div>

            <q-btn
              flat
              rounded
              no-caps
              dense
              class="text-xs text-gray-500 dark:text-gray-400 hover:text-blue px-2"
              @click="repling = !repling"
            >
              {{ $t("phan-hoi") }}
            </q-btn>

            <q-space />

            <!-- More Options -->
            <q-btn flat round dense icon="more_horiz" class="text-gray-500">
              <q-menu
                anchor="bottom right"
                self="top right"
                class="rounded-xl bg-dark-page text-white border border-gray-800"
              >
                <q-list min-width="150px">
                  <q-item
                    v-if="canEdit"
                    clickable
                    v-close-popup
                    @click="editing = true"
                  >
                    <q-item-section avatar class="min-w-0 pr-2">
                      <i-bi-pencil-square />
                    </q-item-section>
                    <q-item-section>{{ $t("chinh-sua") }}</q-item-section>
                  </q-item>

                  <q-item
                    v-if="canEdit"
                    clickable
                    v-close-popup
                    @click="remove"
                    class="text-red"
                  >
                    <q-item-section avatar class="min-w-0 pr-2">
                      <i-bi-trash />
                    </q-item-section>
                    <q-item-section>{{ $t("xoa") }}</q-item-section>
                  </q-item>

                  <q-item
                    v-if="!canEdit"
                    clickable
                    v-close-popup
                    @click="report"
                  >
                    <q-item-section avatar class="min-w-0 pr-2">
                      <i-bi-flag />
                    </q-item-section>
                    <q-item-section>{{ $t("bao-cao") }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>

          <!-- Reply form -->
          <Reply
            v-if="repling"
            v-model="repling"
            :film-id="filmId"
            :parent-id="comment.id"
            :user-avatar="authStore.user?.avatar || ''"
            :user-name="authStore.user?.username || ''"
            :message-error="$t('msg-err-reply')"
            class="mt-3"
            @done="onReplyDone"
          />
        </div>
      </div>

      <!-- Editing state -->
      <Reply
        v-else
        v-model="editing"
        editor
        :film-id="filmId"
        :edit-comment-id="comment.id"
        :initial-text="comment.content"
        :user-avatar="authStore.user?.avatar || ''"
        :user-name="authStore.user?.username || ''"
        :message-error="$t('msg-err-update-cmt')"
        @done="onEditDone"
      />

      <!-- Replies list -->
      <div
        v-if="
          !isReply && (comment.replies_count > 0 || localReplies.length > 0)
        "
        class="mt-2 ml-2 pl-4 border-l-2 border-gray-800"
      >
        <div v-if="localReplies.length > 0">
          <Comment
            v-for="reply in localReplies"
            :key="reply.id"
            :comment="reply"
            :film-id="filmId"
            is-reply
            @update="onChildUpdate"
            @delete="onChildDelete"
          />
        </div>

        <q-btn
          v-if="hasMoreReplies"
          flat
          rounded
          no-caps
          dense
          class="text-blue text-xs mt-1"
          :loading="loadingReplies"
          @click="loadReplies"
        >
          <i-bi-chat-left-dots class="mr-2" />
          {{
            $t("xem-them-tra-loi", [
              Math.max(0, comment.replies_count - localReplies.length)
            ])
          }}
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQuasar } from "quasar"
import dayjs from "src/logic/dayjs"
import { useAuthStore } from "stores/auth"

import { commentApi } from "../api"
import type { AvsComment } from "../types"

import Reply from "./Reply.vue"

const props = defineProps<{
  comment: AvsComment
  filmId: number
  isReply?: boolean
}>()

const emit = defineEmits<{
  (name: "update", comment: AvsComment): void
  (name: "delete", id: number): void
}>()

const $q = useQuasar()
const i18n = useI18n()
const authStore = useAuthStore()

const editing = ref(false)
const repling = ref(false)
const loadingReplies = ref(false)
const localReplies = ref<AvsComment[]>([])
const repliesOffset = ref(0)
const hasMoreReplies = computed(() => {
  return props.comment.replies_count > localReplies.value.length
})

const canEdit = computed(() => {
  return (
    authStore.isLogged &&
    (props.comment.user_id === Number(authStore.uid) ||
      authStore.user?.username === props.comment.user_name)
  )
})

async function vote(type: 1 | -1) {
  if (!authStore.isLogged) {
    $q.notify({ message: i18n.t("vui-long-dang-nhap"), color: "warning" })
    return
  }

  // Toggle vote
  const newVote = props.comment.user_vote === type ? 0 : type

  try {
    const res = await commentApi.vote({
      commentId: props.comment.id,
      voteType: type
    })
    if (res.success) {
      const updated = {
        ...props.comment,
        votes_up: res.votes_up,
        votes_down: res.votes_down,
        user_vote: newVote as 1 | -1 | 0
      }
      emit("update", updated)
    }
  } catch (err) {
    console.error(err)
  }
}

async function remove() {
  $q.dialog({
    title: i18n.t("xac-nhan"),
    message: i18n.t("msg-confirn-delete-cmt"),
    cancel: true,
    persistent: true,
    class: "bg-dark-page text-white rounded-xl"
  }).onOk(async () => {
    try {
      const res = await commentApi.deleteComment(props.comment.id)
      if (res.success) {
        $q.notify({ message: i18n.t("da-xoa-binh-luan") })
        emit("delete", props.comment.id)
      }
    } catch (err) {
      $q.notify({ message: i18n.t("msg-err-delete-cmt"), caption: String(err) })
    }
  })
}

async function report() {
  try {
    const res = await commentApi.reportComment(props.comment.id)
    if (res.success) {
      $q.notify({
        message: res.message || i18n.t("da-bao-cao-binh-luan"),
        color: "success"
      })
    }
  } catch (err) {
    $q.notify({ message: i18n.t("msg-err-report-cmt"), color: "negative" })
  }
}

async function loadReplies() {
  if (loadingReplies.value) return
  loadingReplies.value = true

  try {
    const res = await commentApi.getReplies({
      commentId: props.comment.id,
      offset: repliesOffset.value
    })

    if (res.success) {
      localReplies.value = [...localReplies.value, ...res.replies]
      repliesOffset.value = res.offset
    }
  } catch (err) {
    console.error(err)
  } finally {
    loadingReplies.value = false
  }
}

function onReplyDone(newReply: AvsComment) {
  localReplies.value = [newReply, ...localReplies.value]
  repling.value = false
  // Update parent replies count if needed
  const updated = {
    ...props.comment,
    replies_count: props.comment.replies_count + 1
  }
  emit("update", updated)
}

function onEditDone(editedComment: AvsComment) {
  const updated = {
    ...props.comment,
    content: editedComment.content,
    edited_at: editedComment.edited_at
  }
  emit("update", updated)
  editing.value = false
}

function onChildUpdate(updatedReply: AvsComment) {
  const index = localReplies.value.findIndex((r) => r.id === updatedReply.id)
  if (index !== -1) {
    localReplies.value[index] = updatedReply
  }
}

function onChildDelete(id: number) {
  localReplies.value = localReplies.value.filter((r) => r.id !== id)
  const updated = {
    ...props.comment,
    replies_count: Math.max(0, props.comment.replies_count - 1)
  }
  emit("update", updated)
}
</script>
