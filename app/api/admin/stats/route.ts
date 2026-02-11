import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!)

  const [totalIdeas] = await sql`SELECT COUNT(*) as count FROM ideas`
  const [implementedIdeas] = await sql`SELECT COUNT(*) as count FROM ideas WHERE status = 'implemented'`
  const [pendingReview] = await sql`SELECT COUNT(*) as count FROM ideas WHERE status = 'pending'`
  const [activeUsers] = await sql`SELECT COUNT(*) as count FROM users WHERE is_active = true`

  const ideasByCategory = await sql`
    SELECT c.name, COUNT(i.id)::int as count
    FROM categories c
    LEFT JOIN ideas i ON i.category_id = c.id
    GROUP BY c.id, c.name
    ORDER BY count DESC
  `

  const ideasByStatus = await sql`
    SELECT status, COUNT(*)::int as count
    FROM ideas
    GROUP BY status
    ORDER BY count DESC
  `

  const recentActivity = await sql`
    SELECT al.*, u.first_name || ' ' || u.last_name as user_name
    FROM audit_logs al
    LEFT JOIN users u ON u.id = al.user_id
    ORDER BY al.created_at DESC
    LIMIT 10
  `

  return NextResponse.json({
    total_ideas: Number(totalIdeas.count),
    implemented_ideas: Number(implementedIdeas.count),
    pending_review: Number(pendingReview.count),
    active_users: Number(activeUsers.count),
    ideas_by_category: ideasByCategory,
    ideas_by_status: ideasByStatus,
    recent_activity: recentActivity,
  })
}
