import { sql, CURRENT_USER_ID } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sortBy = searchParams.get("sort") || "recent"
  const category = searchParams.get("category") || "all"
  const status = searchParams.get("status") || "all"

  let query = `
    SELECT 
      i.*,
      u.first_name as author_first_name,
      u.last_name as author_last_name,
      c.name as category_name,
      sc.name as sub_category_name,
      r.description as reward_description
    FROM ideas i
    JOIN users u ON i.user_id = u.id
    LEFT JOIN categories c ON i.category_id = c.id
    LEFT JOIN sub_categories sc ON i.sub_category_id = sc.id
    LEFT JOIN rewards r ON r.idea_id = i.id
    WHERE 1=1
  `

  const params: (string | number)[] = []
  let paramIndex = 1

  if (category !== "all") {
    query += ` AND i.category_id = $${paramIndex}`
    params.push(category)
    paramIndex++
  }

  if (status !== "all") {
    query += ` AND i.status = $${paramIndex}`
    params.push(status)
    paramIndex++
  }

  if (sortBy === "top_liked") {
    query += " ORDER BY i.likes_count DESC, i.created_at DESC"
  } else {
    query += " ORDER BY i.created_at DESC"
  }

  const ideas = await sql(query, params)
  return NextResponse.json(ideas)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { title, description, category_id, sub_category_id } = body

  if (!title || !description || !category_id || !sub_category_id) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    )
  }

  if (title.length > 100) {
    return NextResponse.json(
      { error: "Title must be 100 characters or less" },
      { status: 400 }
    )
  }

  if (description.length > 1000) {
    return NextResponse.json(
      { error: "Description must be 1000 characters or less" },
      { status: 400 }
    )
  }

  // Check posting limit (3 per 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const countResult = await sql`
    SELECT COUNT(*) as count FROM ideas 
    WHERE user_id = ${CURRENT_USER_ID} 
    AND created_at >= ${sixMonthsAgo.toISOString()}
  `

  if (Number(countResult[0].count) >= 3) {
    return NextResponse.json(
      { error: "You have reached the maximum of 3 posts per 6-month period" },
      { status: 400 }
    )
  }

  const result = await sql`
    INSERT INTO ideas (user_id, title, description, category_id, sub_category_id, status)
    VALUES (${CURRENT_USER_ID}, ${title}, ${description}, ${category_id}, ${sub_category_id}, 'pending')
    RETURNING id
  `

  return NextResponse.json({ id: result[0].id, success: true })
}
