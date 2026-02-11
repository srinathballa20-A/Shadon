"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { User } from "./types"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface AuthContextType {
  currentUser: User | null
  isLoading: boolean
  switchUser: (userId: string) => void
  availableUsers: User[]
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  switchUser: () => {},
  availableUsers: [],
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const { data: users = [], isLoading } = useSWR<User[]>("/api/users", fetcher, {
    onSuccess: (data) => {
      if (!currentUserId && data.length > 0) {
        const employee = data.find((u) => u.role === "employee")
        setCurrentUserId(employee?.id || data[0].id)
      }
    },
  })

  const currentUser = users.find((u) => u.id === currentUserId) || null

  const switchUser = useCallback((userId: string) => {
    setCurrentUserId(userId)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        switchUser,
        availableUsers: users,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
