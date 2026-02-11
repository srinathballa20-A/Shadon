import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL!)

// Current logged-in user ID (John Smith) for demo purposes
export const CURRENT_USER_ID = "a1b2c3d4-0001-4000-8000-000000000001"
