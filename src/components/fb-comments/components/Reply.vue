<template>
  <div v-if="modelValue" class="flex items-start gap-3">
    <q-avatar v-if="!noAvatar" :size="smallAvatar ? '28px' : '36px'">
      <q-img no-spinner :src="userAvatar" :alt="userName" />
    </q-avatar>

    <div class="flex-1 min-w-0">
      <q-input
        v-model="text"
        :placeholder="editor ? $t('chinh-sua-binh-luan') : parentId ? $t('viet-tra-loi') : $t('viet-binh-luan')"
        autogrow
        :autofocus="!noAutofocus"
        color="blue"
        class="all:!min-h-0"
        :input-style="{
          fontSize: '14px',
          boxShadow: 'none',
          minHeight: '0px',
          paddingTop: '8px'
        }"
        @keydown.ctrl.enter="send"
      />

      <div v-if="!main || text || editor" class="flex items-center justify-end gap-2 mt-2">
        <q-btn
          rounded unelevated no-caps
          class="text-gray-400"
          @click="cancel"
        >
          {{ $t('huy') }}
        </q-btn>
        <q-btn
          rounded unelevated no-caps
          :color="text ? 'blue-6' : 'grey-9'"
          :disable="!text"
          :loading="sending"
          @click="send"
        >
          {{ editor ? $t('luu') : $t('binh-luan') }}
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useQuasar } from "quasar"

import { commentApi } from "../api"
import type { AvsComment } from "../types"

const props = defineProps<{
  modelValue: boolean

  filmId: number
  /** ID của comment cha khi đang reply */
  parentId?: number
  /** ID của comment đang chỉnh sửa */
  editCommentId?: number
  /** Nội dung ban đầu khi edit */
  initialText?: string

  /** Là form chính trên đầu trang (không tự ẩn khi chưa focus) */
  main?: boolean
  /** Không focus khi mount */
  noAutofocus?: boolean
  /** Ẩn avatar */
  noAvatar?: boolean
  /** Avatar nhỏ hơn (28px) */
  smallAvatar?: boolean

  userAvatar: string
  userName: string

  /** Chế độ chỉnh sửa */
  editor?: boolean

  messageError: string
}>()

const emit = defineEmits<{
  (name: "update:modelValue", value: boolean): void
  (name: "done", comment: AvsComment, total?: number): void
}>()

const $q = useQuasar()

const text = ref<string>(props.initialText ?? "")
watch(
  () => props.initialText,
  (val) => (text.value = val ?? text.value)
)

const sending = ref(false)

async function send() {
  if (!text.value.trim()) return
  sending.value = true

  try {
    if (props.editor && props.editCommentId) {
      // Chỉnh sửa bình luận
      const res = await commentApi.editComment({
        commentId: props.editCommentId,
        content: text.value.trim()
      })
      if (!res.success) throw new Error(res.error ?? props.messageError)

      // Tạo comment object giả để trả về
      const edited: AvsComment = {
        id: props.editCommentId,
        content: res.content,
        is_spoiler: res.is_spoiler,
        edited_at: res.edited_at
      } as AvsComment
      emit("done", edited)
    } else {
      // Đăng bình luận / trả lời
      const res = await commentApi.postComment({
        filmId: props.filmId,
        content: text.value.trim(),
        parentId: props.parentId
      })
      if (!res.success) throw new Error(res.error ?? props.messageError)
      emit("done", res.comment, res.total)
    }

    text.value = ""
    if (props.main) {
      // giữ form hiển thị nhưng xoá text
    } else {
      emit("update:modelValue", false)
    }
  } catch (err) {
    $q.notify({
      message: props.messageError,
      caption: String(err)
    })
  } finally {
    sending.value = false
  }
}

function cancel() {
  text.value = props.initialText ?? ""
  emit("update:modelValue", false)
}
</script>
