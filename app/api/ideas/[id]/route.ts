import { sql } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const ideas = await sql`
    SELECT 
      i.*,
      u.first_name as author_first_name,
      u.last_name as author_last_name,
      c.name as category_name,
      sc.name as sub_category_name,
      r.description as reward_description
    FROM ideas i
    JOIN users u ON i.user_id = u.id
    LEFT JOIN categories c ON i.category_id = c.id
    LEFT JOIN sub_categories sc ON i.sub_category_id = sc.id
    LEFT JOIN rewards r ON r.idea_id = i.id
    WHERE i.id = ${id}
  `

  if (ideas.length === 0) {
    return NextResponse.json({ error: "Idea not found" }, { status: 404 })
  }

  return NextResponse.json(ideas[0])
}
