import { sql, CURRENT_USER_ID } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { id } = body

  if (id === "all") {
    await sql`
      UPDATE notifications SET is_read = true 
      WHERE user_id = ${CURRENT_USER_ID} AND is_read = false
    `
  } else {
    await sql`
      UPDATE notifications SET is_read = true 
      WHERE id = ${id} AND user_id = ${CURRENT_USER_ID}
    `
  }

  return NextResponse.json({ success: true })
}
