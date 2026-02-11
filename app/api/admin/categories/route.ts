import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

export async function GET() {
  const sql = neon(process.env.DATABASE_URL!)
  const categories = await sql`
    SELECT c.*,
      (SELECT COUNT(*) FROM ideas WHERE category_id = c.id)::int as ideas_count,
      json_agg(
        json_build_object('id', sc.id, 'name', sc.name, 'sort_order', sc.sort_order)
        ORDER BY sc.sort_order
      ) FILTER (WHERE sc.id IS NOT NULL) as subcategories
    FROM categories c
    LEFT JOIN sub_categories sc ON sc.category_id = c.id
    GROUP BY c.id
    ORDER BY c.sort_order
  `
  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  const sql = neon(process.env.DATABASE_URL!)
  const body = await request.json()
  const { name, description, admin_user_id } = body

  const [maxOrder] = await sql`SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM categories`

  const [category] = await sql`
    INSERT INTO categories (name, description, sort_order)
    VALUES (${name}, ${description || ""}, ${maxOrder.next_order})
    RETURNING *
  `

  if (admin_user_id) {
    await sql`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
      VALUES (${admin_user_id}, 'create_category', 'category', ${category.id}, ${`Created category: ${name}`})
    `
  }

  return NextResponse.json(category)
}

export async function PUT(request: Request) {
  const sql = neon(process.env.DATABASE_URL!)
  const body = await request.json()
  const { id, name, description, is_active, admin_user_id } = body

  const [category] = await sql`
    UPDATE categories
    SET name = ${name}, description = ${description || ""}, is_active = ${is_active}
    WHERE id = ${id}
    RETURNING *
  `

  if (admin_user_id) {
    await sql`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
      VALUES (${admin_user_id}, 'update_category', 'category', ${id}, ${`Updated category: ${name}`})
    `
  }

  return NextResponse.json(category)
}
