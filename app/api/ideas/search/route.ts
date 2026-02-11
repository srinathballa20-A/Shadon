import { neon } from "@neondatabase/serverless"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!)
  const q = request.nextUrl.searchParams.get("q") || ""

  if (!q.trim()) {
    return NextResponse.json([])
  }

  const searchTerm = `%${q}%`
  const ideas = await sql`
    SELECT i.*,
      u.first_name as author_first_name,
      u.last_name as author_last_name,
      c.name as category_name,
      sc.name as sub_category_name
    FROM ideas i
    JOIN users u ON u.id = i.user_id
    JOIN categories c ON c.id = i.category_id
    LEFT JOIN sub_categories sc ON sc.id = i.sub_category_id
    WHERE (i.title ILIKE ${searchTerm} OR i.description ILIKE ${searchTerm})
    ORDER BY i.created_at DESC
    LIMIT 20
  `

  return NextResponse.json(ideas)
}
