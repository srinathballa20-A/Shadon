import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const sql = neon(process.env.DATABASE_URL!)
  const { id } = await params
  const body = await request.json()
  const { action, reviewer_id, feedback } = body

  const newStatus = action === "approve" ? "approved" : "rejected"

  await sql`
    UPDATE ideas
    SET status = ${newStatus}, updated_at = NOW()
    WHERE id = ${id}
  `

  const [idea] = await sql`SELECT title, user_id FROM ideas WHERE id = ${id}`

  // Create notification for the idea author
  const notifType = action === "approve" ? "approval" : "rejection"
  const message =
    action === "approve"
      ? `Your idea "${idea.title}" has been approved!`
      : `Your idea "${idea.title}" was not approved. ${feedback ? `Feedback: ${feedback}` : ""}`

  await sql`
    INSERT INTO notifications (user_id, idea_id, type, message)
    VALUES (${idea.user_id}, ${id}, ${notifType}, ${message})
  `

  // Audit log
  await sql`
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
    VALUES (${reviewer_id}, ${action + '_idea'}, 'idea', ${id}, ${`${action === "approve" ? "Approved" : "Rejected"} idea: ${idea.title}${feedback ? `. Feedback: ${feedback}` : ""}`})
  `

  return NextResponse.json({ success: true })
}
