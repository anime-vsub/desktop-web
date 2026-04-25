// Comment system types — website's own API (/ajax/comment)

export interface CommentBadge {
  color: string
  icon: string
  name: string
}

export interface AvsComment {
  id: number
  parent_id?: number | null
  user_id: number
  user_name: string
  user_avatar: string
  content: string
  is_spoiler: 0 | 1
  is_pending: 0 | 1
  is_hidden: 0 | 1
  is_pinned: 0 | 1
  is_global_pinned: 0 | 1
  user_ban: 0 | 1
  hidden_by_ban: 0 | 1
  created_at: number // unix timestamp
  edited_at?: number | null
  votes_up: number
  votes_down: number
  user_vote: 1 | -1 | 0
  replies_count: number
  badges: CommentBadge[]
  hide_reason?: string
  thread_key?: string
  film_id?: number
}

export interface GetCommentsResponse {
  success: boolean
  total: number
  comments: AvsComment[]
  offset: number
  has_more: boolean
  is_muted?: boolean
  error?: string
}

export interface GetRepliesResponse {
  success: boolean
  replies: AvsComment[]
  has_more: boolean
  offset: number
  error?: string
}

export interface PostCommentResponse {
  success: boolean
  comment: AvsComment
  pending?: boolean
  total?: number
  error?: string
}

export interface VoteResponse {
  success: boolean
  votes_up: number
  votes_down: number
  error?: string
}

export interface EditCommentResponse {
  success: boolean
  content: string
  is_spoiler: 0 | 1
  edited_at: number
  pending?: boolean
  error?: string
}

export interface DeleteCommentResponse {
  success: boolean
  total: number
  error?: string
}

export interface ReportResponse {
  success: boolean
  message?: string
  error?: string
}
