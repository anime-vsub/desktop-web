import type PhimIdChap from "src/apis/parser/phim/[id]/[chap]"
import type { VideoOfflineMeta } from "src/stores/vdm"

import type { Season } from "./_season.interface"

export interface ResponseDataSeasonPending {
  status: "pending"
}
export interface ResponseDataSeasonSuccess {
  status: "success"
  response: Awaited<ReturnType<typeof PhimIdChap>> & {
    off?: Record<string, VideoOfflineMeta>
    ssSibs?: Season[]
  }
}
export interface ResponseDataSeasonError {
  status: "error"
  response: {
    status: number
  }
}
