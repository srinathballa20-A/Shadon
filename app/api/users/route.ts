import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!)
  const users = await sql`
    SELECT id, email, first_name, last_name, role, department, is_active, created_at
    FROM users
    WHERE is_active = true
    ORDER BY
      CASE role WHEN 'employee' THEN 1 WHEN 'manager' THEN 2 WHEN 'admin' THEN 3 END
  `
  return NextResponse.json(users)
}
