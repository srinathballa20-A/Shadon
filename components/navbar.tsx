"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import {
  Lightbulb,
  LayoutDashboard,
  PlusCircle,
  Bell,
  ClipboardCheck,
  Shield,
  Search,
  ChevronDown,
  User,
  X,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import useSWR from "swr"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, switchUser, availableUsers } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; title: string; status: string }>
  >([])
  const searchRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const { data: notifData } = useSWR(
    currentUser ? `/api/notifications/count?userId=${currentUser.id}` : null,
    fetcher,
    { refreshInterval: 30000 },
  )
  const unreadCount = notifData?.count || 0

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setShowSearch(false)
        setSearchResults([])
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      const res = await fetch(
        `/api/ideas/search?q=${encodeURIComponent(searchQuery)}`,
      )
      const data = await res.json()
      setSearchResults(data)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const role = currentUser?.role || "employee"

  const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["employee", "manager", "admin"],
    },
    {
      href: "/post-idea",
      label: "Post Idea",
      icon: PlusCircle,
      roles: ["employee", "manager", "admin"],
    },
    {
      href: "/review",
      label: "Review Queue",
      icon: ClipboardCheck,
      roles: ["manager", "admin"],
    },
    { href: "/admin", label: "Admin", icon: Shield, roles: ["admin"] },
  ]

  const visibleItems = navItems.filter((item) => item.roles.includes(role))

  const getRoleBadgeColor = (r: string) => {
    switch (r) {
      case "admin":
        return "bg-destructive text-destructive-foreground"
      case "manager":
        return "bg-amber-600 text-white"
      default:
        return "bg-primary text-primary-foreground"
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Lightbulb className="h-5 w-5 text-accent" />
          </div>
          <span className="text-lg font-bold text-foreground">
            Innovation Hub
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div ref={searchRef} className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Search ideas"
            >
              <Search className="h-4 w-4" />
            </button>
            {showSearch && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-card p-2 shadow-lg">
                <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search ideas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                {searchResults.length > 0 && (
                  <div className="mt-2 max-h-64 overflow-y-auto">
                    {searchResults.map((idea) => (
                      <button
                        key={idea.id}
                        onClick={() => {
                          router.push(`/idea/${idea.id}`)
                          setShowSearch(false)
                          setSearchQuery("")
                          setSearchResults([])
                        }}
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-accent"
                      >
                        <span className="truncate">{idea.title}</span>
                        <span
                          className={cn(
                            "ml-2 flex-shrink-0 rounded-full px-2 py-0.5 text-xs capitalize",
                            idea.status === "implemented"
                              ? "bg-emerald-100 text-emerald-700"
                              : idea.status === "approved"
                                ? "bg-blue-100 text-blue-700"
                                : idea.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700",
                          )}
                        >
                          {idea.status}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery && searchResults.length === 0 && (
                  <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                    No ideas found
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Notifications */}
          <Link
            href="/notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* User Switcher */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="max-w-[120px] truncate font-medium text-foreground">
                {currentUser
                  ? `${currentUser.first_name} ${currentUser.last_name}`
                  : "Loading..."}
              </span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-semibold capitalize",
                  getRoleBadgeColor(role),
                )}
              >
                {role}
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-border bg-card py-1 shadow-lg">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Switch User
                </p>
                {availableUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchUser(user.id)
                      setShowUserMenu(false)
                    }}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-accent",
                      user.id === currentUser?.id && "bg-accent",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {user.first_name} {user.last_name}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-semibold capitalize",
                        getRoleBadgeColor(user.role),
                      )}
                    >
                      {user.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
