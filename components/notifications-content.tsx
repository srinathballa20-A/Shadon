"use client"

import useSWR, { mutate } from "swr"
import {
  Bell,
  CheckCircle,
  Award,
  ThumbsUp,
  MessageCircle,
  ExternalLink,
  Loader2,
} from "lucide-react"
import type { Notification } from "@/lib/types"
import { formatRelativeTime, cn } from "@/lib/utils"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function getNotificationIcon(type: string) {
  switch (type) {
    case "implementation":
      return <CheckCircle className="h-5 w-5 text-emerald-500" />
    case "reward":
      return <Award className="h-5 w-5 text-amber-500" />
    case "like":
      return <ThumbsUp className="h-5 w-5 text-blue-500" />
    case "comment":
      return <MessageCircle className="h-5 w-5 text-blue-500" />
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />
  }
}

export function NotificationsContent() {
  const {
    data: notifications,
    isLoading,
    mutate: mutateNotifications,
  } = useSWR<Notification[]>("/api/notifications", fetcher)

  const unreadCount =
    notifications?.filter((n) => !n.is_read).length ?? 0

  async function markAsRead(id: string) {
    await fetch("/api/notifications/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    mutateNotifications()
    mutate("/api/notifications/count")
  }

  async function markAllAsRead() {
    await fetch("/api/notifications/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "all" }),
    })
    mutateNotifications()
    mutate("/api/notifications/count")
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="mt-1 text-muted-foreground">
            Stay updated on your ideas and activities
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-foreground" />
            <h2 className="text-lg font-bold text-foreground">
              Your Notifications
            </h2>
          </div>
          {unreadCount > 0 && (
            <span className="rounded-full bg-destructive px-2.5 py-0.5 text-xs font-bold text-destructive-foreground">
              {unreadCount} Unread
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div className="flex flex-col gap-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  "flex items-center justify-between rounded-lg border p-4 transition-colors",
                  notif.is_read
                    ? "border-border bg-card"
                    : "border-blue-200 bg-blue-50"
                )}
              >
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notif.type)}
                  <div>
                    <p
                      className={cn(
                        "text-sm",
                        notif.is_read
                          ? "text-muted-foreground"
                          : "font-semibold text-foreground"
                      )}
                    >
                      {notif.message}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatRelativeTime(notif.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3 ml-4">
                  {notif.idea_id && (
                    <Link
                      href={`/idea/${notif.idea_id}`}
                      className="flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
                    >
                      View
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                  {!notif.is_read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notif.id)}
                      className="text-sm font-medium text-foreground hover:underline"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <Bell className="mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No notifications yet.
            </p>
          </div>
        )}
      </div>

      {/* Notification Types Info */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-base font-bold text-foreground">
          Notification Types
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ThumbsUp className="h-4 w-4 text-blue-500" />
            When someone likes your idea
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4 text-blue-500" />
            When someone comments on your idea
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            When your idea is implemented
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="h-4 w-4 text-amber-500" />
            When you receive a reward
          </div>
        </div>
      </div>
    </div>
  )
}
