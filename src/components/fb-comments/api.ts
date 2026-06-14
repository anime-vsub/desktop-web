// API wrapper for the website's comment system (/ajax/comment)
// Uses src/logic/http.ts helpers which prefix C_URL and add required headers
import { get, post } from "src/logic/http"

import type {
  DeleteCommentResponse,
  EditCommentResponse,
  GetCommentsResponse,
  GetRepliesResponse,
  PostCommentResponse,
  ReportResponse,
  VoteResponse
} from "./types"

const PATH = "/ajax/comment"

// ─── helpers ────────────────────────────────────────────────────────────────

function parseRes<T>(data: string | T): T {
  return typeof data === "string" ? (JSON.parse(data) as T) : data
}

// ─── public API ─────────────────────────────────────────────────────────────

export const commentApi = {
  /** Tải danh sách bình luận */
  async getComments(opts: {
    filmId: number
    sort?: "newest" | "time"
    offset?: number
    pageUrl?: string
  }): Promise<GetCommentsResponse> {
    const qs = new URLSearchParams({
      action: "get",
      film_id: String(opts.filmId),
      sort: opts.sort ?? "newest",
      offset: String(opts.offset ?? 0),
      _: String(Date.now())
    })
    if (opts.pageUrl) qs.set("page_url", opts.pageUrl)
    const res = await get(`${PATH}?${qs}`)
    return parseRes<GetCommentsResponse>(res.data)
  },

  /** Tải trả lời của một bình luận */
  async getReplies(opts: {
    commentId: number
    sort?: string
    offset?: number
  }): Promise<GetRepliesResponse> {
    const qs = new URLSearchParams({
      action: "get_replies",
      comment_id: String(opts.commentId),
      sort: opts.sort ?? "newest",
      offset: String(opts.offset ?? 0),
      _: String(Date.now())
    })
    const res = await get(`${PATH}?${qs}`)
    return parseRes<GetRepliesResponse>(res.data)
  },

  /** Gửi bình luận mới / trả lời */
  async postComment(opts: {
    filmId: number
    episodeId?: number
    content: string
    threadKey?: string
    parentId?: number
  }): Promise<PostCommentResponse> {
    const res = await post(PATH, {
      action: "post",
      film_id: opts.filmId,
      episode_id: opts.episodeId ?? 0,
      content: opts.content,
      is_spoiler: 0,
      thread_key: opts.threadKey ?? "",
      parent_id: opts.parentId ?? 0
    })
    return parseRes<PostCommentResponse>(res.data)
  },

  /** Vote bình luận */
  async vote(opts: {
    commentId: number
    voteType: 1 | -1
  }): Promise<VoteResponse> {
    const res = await post(PATH, {
      action: "vote",
      comment_id: opts.commentId,
      vote_type: opts.voteType
    })
    return parseRes<VoteResponse>(res.data)
  },

  /** Chỉnh sửa bình luận */
  async editComment(opts: {
    commentId: number
    content: string
  }): Promise<EditCommentResponse> {
    const res = await post(PATH, {
      action: "edit",
      comment_id: opts.commentId,
      content: opts.content,
      is_spoiler: 0
    })
    return parseRes<EditCommentResponse>(res.data)
  },

  /** Xóa bình luận */
  async deleteComment(commentId: number): Promise<DeleteCommentResponse> {
    const res = await post(PATH, {
      action: "delete",
      comment_id: commentId
    })
    return parseRes<DeleteCommentResponse>(res.data)
  },

  /** Báo cáo bình luận */
  async reportComment(commentId: number): Promise<ReportResponse> {
    const res = await post(PATH, {
      action: "report",
      comment_id: commentId
    })
    return parseRes<ReportResponse>(res.data)
  }
}
