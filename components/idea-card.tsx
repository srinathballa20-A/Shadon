"use client"

import Link from "next/link"
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  User,
  Calendar,
  CheckCircle,
  Award,
} from "lucide-react"
import type { Idea } from "@/lib/types"
import { formatRelativeTime } from "@/lib/utils"

export function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <Link href={`/idea/${idea.id}`} className="block">
      <div className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-base font-bold text-foreground group-hover:text-primary">
            {idea.title}
          </h3>
          {idea.status === "implemented" && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <CheckCircle className="h-3 w-3" />
              Implemented
            </span>
          )}
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {idea.category_name && (
            <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {idea.category_name}
            </span>
          )}
          {idea.sub_category_name && (
            <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {idea.sub_category_name}
            </span>
          )}
        </div>

        <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {idea.description}
        </p>

        <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {idea.author_first_name} {idea.author_last_name}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatRelativeTime(idea.created_at)}
          </span>
        </div>

        {idea.reward_description && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm">
            <Award className="h-4 w-4 text-amber-600" />
            <span className="font-medium text-amber-700">
              Reward: {idea.reward_description}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              <ThumbsUp className="h-3 w-3" />
              {idea.likes_count}
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              <ThumbsDown className="h-3 w-3" />
              {idea.dislikes_count}
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageCircle className="h-3.5 w-3.5" />
            {idea.comments_count}
          </span>
        </div>
      </div>
    </Link>
  )
}
