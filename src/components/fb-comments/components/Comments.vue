<template>
  <div class="comments-list">
    <Comment
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      :film-id="filmId"
      @update="emit('update', $event)"
      @delete="emit('delete', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import type { AvsComment } from "../types"

import Comment from "./Comment.vue"

defineProps<{
  comments: AvsComment[]
  filmId: number
}>()

const emit = defineEmits<{
  (name: "update", comment: AvsComment): void
  (name: "delete", id: number): void
}>()
</script>
