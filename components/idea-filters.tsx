"use client"

import { Calendar, TrendingUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Category } from "@/lib/types"
import { useState, useRef, useEffect } from "react"

interface IdeaFiltersProps {
  sortBy: "recent" | "top_liked"
  category: string
  status: string
  categories: Category[]
  onSortChange: (sort: "recent" | "top_liked") => void
  onCategoryChange: (cat: string) => void
  onStatusChange: (status: string) => void
}

function Dropdown({
  value,
  options,
  onChange,
}: {
  value: string
  options: { value: string; label: string }[]
  onChange: (val: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full min-w-[200px] rounded-lg border border-border bg-card py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={cn(
                "flex w-full items-center px-4 py-2 text-sm transition-colors hover:bg-muted",
                value === opt.value
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {opt.label}
              {value === opt.value && (
                <svg
                  className="ml-auto h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function IdeaFilters({
  sortBy,
  category,
  status,
  categories,
  onSortChange,
  onCategoryChange,
  onStatusChange,
}: IdeaFiltersProps) {
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ]

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "implemented", label: "Implemented" },
    { value: "rejected", label: "Rejected" },
  ]

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex rounded-lg border border-border bg-card p-1">
        <button
          type="button"
          onClick={() => onSortChange("recent")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            sortBy === "recent"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Calendar className="h-3.5 w-3.5" />
          Recent
        </button>
        <button
          type="button"
          onClick={() => onSortChange("top_liked")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            sortBy === "top_liked"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Top Liked
        </button>
      </div>

      <div className="flex flex-1 gap-3">
        <div className="flex-1">
          <Dropdown
            value={category}
            options={categoryOptions}
            onChange={onCategoryChange}
          />
        </div>
        <div className="flex-1">
          <Dropdown
            value={status}
            options={statusOptions}
            onChange={onStatusChange}
          />
        </div>
      </div>
    </div>
  )
}
