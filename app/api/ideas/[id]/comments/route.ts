import { sql, CURRENT_USER_ID } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const comments = await sql`
    SELECT 
      c.*,
      u.first_name as author_first_name,
      u.last_name as author_last_name
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.idea_id = ${id}
    ORDER BY c.created_at ASC
  `

  return NextResponse.json(comments)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { text } = body

  if (!text || text.trim().length === 0) {
    return NextResponse.json(
      { error: "Comment text is required" },
      { status: 400 }
    )
  }

  await sql`
    INSERT INTO comments (idea_id, user_id, text)
    VALUES (${id}, ${CURRENT_USER_ID}, ${text})
  `

  await sql`
    UPDATE ideas SET comments_count = comments_count + 1 WHERE id = ${id}
  `

  return NextResponse.json({ success: true })
}
