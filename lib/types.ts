export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: "employee" | "manager" | "admin"
  department: string
  profile_image_url?: string
  is_active: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  sort_order: number
  is_active: boolean
}

export interface SubCategory {
  id: string
  category_id: string
  name: string
  sort_order: number
}

export interface Idea {
  id: string
  user_id: string
  title: string
  description: string
  category_id: string
  sub_category_id: string
  status: "draft" | "pending" | "approved" | "implemented" | "rejected"
  likes_count: number
  dislikes_count: number
  comments_count: number
  created_at: string
  updated_at: string
  implementation_date?: string
  reward_issued: boolean
  // Joined fields
  author_first_name?: string
  author_last_name?: string
  category_name?: string
  sub_category_name?: string
  reward_description?: string
}

export interface Comment {
  id: string
  idea_id: string
  user_id: string
  text: string
  created_at: string
  author_first_name?: string
  author_last_name?: string
}

export interface Notification {
  id: string
  user_id: string
  idea_id: string
  type: "like" | "comment" | "approval" | "rejection" | "implementation" | "reward"
  message: string
  is_read: boolean
  created_at: string
}

export interface Reward {
  id: string
  idea_id: string
  user_id: string
  reward_type: "gift_card" | "bonus" | "recognition"
  amount: number
  description: string
}

export interface AuditLog {
  id: string
  user_id: string
  user_name?: string
  action: string
  entity_type: string
  entity_id: string
  details: string
  created_at: string
}

export interface DashboardStats {
  total_ideas: number
  implemented_ideas: number
  pending_review: number
  active_users: number
  ideas_by_category: { name: string; count: number }[]
  ideas_by_status: { status: string; count: number }[]
  recent_activity: AuditLog[]
}
