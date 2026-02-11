import { sql, CURRENT_USER_ID } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const result = await sql`
    SELECT COUNT(*) as count FROM notifications 
    WHERE user_id = ${CURRENT_USER_ID} AND is_read = false
  `
  return NextResponse.json({ count: Number(result[0].count) })
}
