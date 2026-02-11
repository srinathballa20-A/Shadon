"use client"

import React from "react"

import Link from "next/link"
import useSWR, { mutate } from "swr"
import {
  ArrowLeft,
  Tag,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Loader2,
} from "lucide-react"
import type { Idea, Comment } from "@/lib/types"
import { formatDate, formatRelativeTime } from "@/lib/utils"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function IdeaDetailContent({ ideaId }: { ideaId: string }) {
  const { data: idea, isLoading } = useSWR<Idea>(
    `/api/ideas/${ideaId}`,
    fetcher
  )
  const { data: comments, mutate: mutateComments } = useSWR<Comment[]>(
    `/api/ideas/${ideaId}/comments`,
    fetcher
  )

  const [commentText, setCommentText] = useState("")
  const [postingComment, setPostingComment] = useState(false)
  const [likingState, setLikingState] = useState<"like" | "dislike" | null>(
    null
  )

  async function handleLike(isLike: boolean) {
    setLikingState(isLike ? "like" : "dislike")
    try {
      await fetch(`/api/ideas/${ideaId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_like: isLike }),
      })
      mutate(`/api/ideas/${ideaId}`)
      mutate("/api/ideas/top")
    } finally {
      setLikingState(null)
    }
  }

  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentText.trim()) return

    setPostingComment(true)
    try {
      await fetch(`/api/ideas/${ideaId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      })
      setCommentText("")
      mutateComments()
      mutate(`/api/ideas/${ideaId}`)
    } finally {
      setPostingComment(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!idea) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <p className="text-center text-muted-foreground">Idea not found.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Idea Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h1 className="mb-4 text-2xl font-bold text-foreground">
          {idea.title}
        </h1>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {idea.category_name && (
            <span className="flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              <Tag className="h-3 w-3" />
              {idea.category_name}
            </span>
          )}
          {idea.sub_category_name && (
            <span className="flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
              {idea.sub_category_name}
            </span>
          )}
        </div>

        <div className="mb-5 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {idea.author_first_name} {idea.author_last_name}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(idea.created_at)}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-base font-bold text-foreground">
            Description
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {idea.description}
          </p>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleLike(true)}
                disabled={likingState !== null}
                className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                <ThumbsUp className="h-4 w-4" />
                {idea.likes_count} Likes
              </button>
              <button
                type="button"
                onClick={() => handleLike(false)}
                disabled={likingState !== null}
                className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                <ThumbsDown className="h-4 w-4" />
                {idea.dislikes_count} Dislikes
              </button>
            </div>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              {idea.comments_count} Comments
            </span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-5 text-lg font-bold text-foreground">
          Comments ({comments?.length ?? 0})
        </h2>

        {/* Comment Form */}
        <form onSubmit={handlePostComment} className="mb-6">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts on this idea..."
            rows={3}
            className="mb-3 w-full resize-none rounded-lg border border-input bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!commentText.trim() || postingComment}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {postingComment && <Loader2 className="h-4 w-4 animate-spin" />}
              Post Comment
            </button>
          </div>
        </form>

        {/* Comments List */}
        {comments && comments.length > 0 ? (
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg border border-border bg-muted/30 p-4"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {comment.author_first_name?.[0]}
                    {comment.author_last_name?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {comment.author_first_name} {comment.author_last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(comment.created_at)}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {comment.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <MessageCircle className="mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
