import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const categories = await sql`
    SELECT * FROM categories WHERE is_active = true ORDER BY sort_order ASC
  `
  return NextResponse.json(categories)
}
