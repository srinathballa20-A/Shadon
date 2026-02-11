"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import {
  Clock,
  Lightbulb,
  ChevronDown,
  Loader2,
} from "lucide-react"
import type { Category, SubCategory } from "@/lib/types"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function PostIdeaForm() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [subCategoryId, setSubCategoryId] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const { data: remaining } = useSWR<{ remaining: number }>(
    "/api/ideas/remaining",
    fetcher
  )
  const { data: categories } = useSWR<Category[]>("/api/categories", fetcher)
  const { data: subCategories } = useSWR<SubCategory[]>(
    categoryId ? `/api/categories/${categoryId}/subcategories` : null,
    fetcher
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!title || !description || !categoryId || !subCategoryId) {
      setError("All fields are required")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category_id: categoryId,
          sub_category_id: subCategoryId,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to post idea")
        return
      }

      router.push(`/idea/${data.id}`)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Post New Idea</h1>
        <p className="mt-1 text-muted-foreground">
          Share your innovative ideas with the organization
        </p>
      </div>

      {/* Remaining Posts */}
      <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm text-blue-700">You have</p>
            <p className="text-2xl font-bold text-blue-900">
              {remaining?.remaining ?? "..."}
            </p>
            <p className="text-sm text-blue-700">
              posts remaining for this 6-month period
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold text-foreground">Idea Details</h2>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">
            Provide detailed information about your idea. All fields are
            required.
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="mb-5">
            <label
              htmlFor="title"
              className="mb-1.5 block text-sm font-semibold text-foreground"
            >
              Idea Title <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              type="text"
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a clear and concise title"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {title.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div className="mb-5">
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-semibold text-foreground"
            >
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              id="description"
              maxLength={1000}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your idea in detail. Include the problem it solves, benefits, and how it could be implemented."
              className="w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {description.length}/1000 characters
            </p>
          </div>

          {/* Category */}
          <div className="mb-5">
            <label
              htmlFor="category"
              className="mb-1.5 block text-sm font-semibold text-foreground"
            >
              Category <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <select
                id="category"
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value)
                  setSubCategoryId("")
                }}
                className={cn(
                  "w-full appearance-none rounded-lg border border-input bg-background px-4 py-2.5 pr-10 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20",
                  categoryId ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <option value="">Select a category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* SubCategory */}
          <div className="mb-6">
            <label
              htmlFor="subcategory"
              className="mb-1.5 block text-sm font-semibold text-foreground"
            >
              Sub-Category <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <select
                id="subcategory"
                value={subCategoryId}
                disabled={!categoryId}
                onChange={(e) => setSubCategoryId(e.target.value)}
                className={cn(
                  "w-full appearance-none rounded-lg border border-input bg-background px-4 py-2.5 pr-10 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
                  subCategoryId ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <option value="">
                  {categoryId
                    ? "Select a sub-category"
                    : "Select a category first"}
                </option>
                {subCategories?.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || (remaining?.remaining ?? 0) === 0}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Post Idea
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>

      {/* Posting Guidelines */}
      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-base font-bold text-foreground">
          Posting Guidelines
        </h3>
        <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
          <li>{"Be clear and specific about your idea"}</li>
          <li>{"Explain the problem your idea solves"}</li>
          <li>{"Consider feasibility and potential impact"}</li>
          <li>{"Be respectful and constructive"}</li>
          <li>{"You can post up to 3 ideas every 6 months"}</li>
        </ul>
      </div>
    </div>
  )
}
