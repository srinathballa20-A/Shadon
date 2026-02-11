import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!)
  const users = await sql`
    SELECT u.*,
      (SELECT COUNT(*) FROM ideas WHERE user_id = u.id)::int as ideas_count
    FROM users u
    ORDER BY u.created_at DESC
  `
  return NextResponse.json(users)
}

export async function PUT(request: Request) {
  const sql = neon(process.env.DATABASE_URL!)
  const body = await request.json()
  const { id, role, is_active, admin_user_id } = body

  await sql`
    UPDATE users
    SET role = ${role}, is_active = ${is_active}
    WHERE id = ${id}
  `

  if (admin_user_id) {
    await sql`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
      VALUES (${admin_user_id}, 'update_user', 'user', ${id}, ${`Updated user role to ${role}, active: ${is_active}`})
    `
  }

  return NextResponse.json({ success: true })
}
