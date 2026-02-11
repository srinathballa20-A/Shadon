import { sql, CURRENT_USER_ID } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { is_like } = body

  // Check if user already voted
  const existing = await sql`
    SELECT id, is_like FROM idea_likes 
    WHERE idea_id = ${id} AND user_id = ${CURRENT_USER_ID}
  `

  if (existing.length > 0) {
    if (existing[0].is_like === is_like) {
      // Remove the vote (toggle off)
      await sql`
        DELETE FROM idea_likes WHERE idea_id = ${id} AND user_id = ${CURRENT_USER_ID}
      `
      if (is_like) {
        await sql`UPDATE ideas SET likes_count = likes_count - 1 WHERE id = ${id}`
      } else {
        await sql`UPDATE ideas SET dislikes_count = dislikes_count - 1 WHERE id = ${id}`
      }
    } else {
      // Switch vote
      await sql`
        UPDATE idea_likes SET is_like = ${is_like} 
        WHERE idea_id = ${id} AND user_id = ${CURRENT_USER_ID}
      `
      if (is_like) {
        await sql`UPDATE ideas SET likes_count = likes_count + 1, dislikes_count = dislikes_count - 1 WHERE id = ${id}`
      } else {
        await sql`UPDATE ideas SET likes_count = likes_count - 1, dislikes_count = dislikes_count + 1 WHERE id = ${id}`
      }
    }
  } else {
    // New vote
    await sql`
      INSERT INTO idea_likes (idea_id, user_id, is_like)
      VALUES (${id}, ${CURRENT_USER_ID}, ${is_like})
    `
    if (is_like) {
      await sql`UPDATE ideas SET likes_count = likes_count + 1 WHERE id = ${id}`
    } else {
      await sql`UPDATE ideas SET dislikes_count = dislikes_count + 1 WHERE id = ${id}`
    }
  }

  // Return updated idea
  const updated = await sql`SELECT likes_count, dislikes_count FROM ideas WHERE id = ${id}`
  return NextResponse.json(updated[0])
}
