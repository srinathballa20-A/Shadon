"use client"

import useSWR from "swr"
import { TopLikedIdeas } from "@/components/top-liked-ideas"
import { IdeaCard } from "@/components/idea-card"
import { IdeaFilters } from "@/components/idea-filters"
import { useState } from "react"
import type { Idea, Category } from "@/lib/types"
import { Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function DashboardContent() {
  const [sortBy, setSortBy] = useState<"recent" | "top_liked">("recent")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("all")

  const { data: topIdeas } = useSWR<Idea[]>("/api/ideas/top", fetcher)
  const { data: categories } = useSWR<Category[]>("/api/categories", fetcher)

  const queryParams = new URLSearchParams({
    sort: sortBy,
    category,
    status,
  })

  const { data: ideas, isLoading } = useSWR<Idea[]>(
    `/api/ideas?${queryParams.toString()}`,
    fetcher
  )

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Innovation Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Explore, vote, and discuss innovative ideas from your colleagues
        </p>
      </div>

      {topIdeas && topIdeas.length > 0 && (
        <div className="mb-8">
          <TopLikedIdeas ideas={topIdeas} />
        </div>
      )}

      <div className="mb-6">
        <IdeaFilters
          sortBy={sortBy}
          category={category}
          status={status}
          categories={categories || []}
          onSortChange={setSortBy}
          onCategoryChange={setCategory}
          onStatusChange={setStatus}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : ideas && ideas.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20">
          <p className="text-lg font-medium text-muted-foreground">
            No ideas found
          </p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  )
}
