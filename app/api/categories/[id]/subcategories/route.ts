import { sql } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const subcategories = await sql`
    SELECT * FROM sub_categories WHERE category_id = ${id} ORDER BY sort_order ASC
  `
  return NextResponse.json(subcategories)
}
