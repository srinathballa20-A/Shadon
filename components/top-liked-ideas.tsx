import { ThumbsUp, TrendingUp, CheckCircle } from "lucide-react"
import type { Idea } from "@/lib/types"
import Link from "next/link"

export function TopLikedIdeas({ ideas }: { ideas: Idea[] }) {
  return (
    <div className="rounded-xl border border-border bg-primary p-5">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-bold text-primary-foreground">
          Top Liked Ideas
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {ideas.map((idea, index) => (
          <Link
            key={idea.id}
            href={`/idea/${idea.id}`}
            className="flex items-center justify-between rounded-lg bg-card/10 px-4 py-3 transition-colors hover:bg-card/20"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm font-medium text-primary-foreground/60">
                #{index + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-primary-foreground">
                  {idea.title}
                </p>
                <p className="truncate text-xs text-primary-foreground/60">
                  {idea.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-4">
              {idea.status === "implemented" && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                  <CheckCircle className="h-3 w-3" />
                  Implemented
                </span>
              )}
              <span className="flex items-center gap-1 text-sm text-primary-foreground/80">
                <ThumbsUp className="h-3.5 w-3.5" />
                {idea.likes_count}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
