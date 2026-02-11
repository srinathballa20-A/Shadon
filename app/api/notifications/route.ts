import { sql, CURRENT_USER_ID } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const notifications = await sql`
    SELECT * FROM notifications 
    WHERE user_id = ${CURRENT_USER_ID}
    ORDER BY created_at DESC
  `
  return NextResponse.json(notifications)
}
