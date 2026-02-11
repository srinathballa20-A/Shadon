import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const ideas = await sql`
    SELECT 
      i.id, i.title, i.description, i.status, i.likes_count,
      u.first_name as author_first_name,
      u.last_name as author_last_name
    FROM ideas i
    JOIN users u ON i.user_id = u.id
    ORDER BY i.likes_count DESC
    LIMIT 3
  `
  return NextResponse.json(ideas)
}
