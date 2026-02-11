import { sql, CURRENT_USER_ID } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const result = await sql`
    SELECT COUNT(*) as count FROM ideas 
    WHERE user_id = ${CURRENT_USER_ID} 
    AND created_at >= ${sixMonthsAgo.toISOString()}
  `
  const postsUsed = Number(result[0].count)
  const remaining = Math.max(0, 3 - postsUsed)
  return NextResponse.json({ remaining })
}
