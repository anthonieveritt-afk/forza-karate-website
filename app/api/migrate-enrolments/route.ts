import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS enrolments (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        date_of_birth DATE NOT NULL,
        gender VARCHAR(20),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address_line1 VARCHAR(255),
        address_line2 VARCHAR(255),
        town VARCHAR(100),
        postcode VARCHAR(20),
        parent_first_name VARCHAR(255),
        parent_last_name VARCHAR(255),
        parent_email VARCHAR(255),
        parent_phone VARCHAR(50),
        parent_relationship VARCHAR(100),
        emergency_name VARCHAR(255),
        emergency_phone VARCHAR(50),
        emergency_relationship VARCHAR(100),
        medical_conditions TEXT,
        dojo VARCHAR(50) NOT NULL DEFAULT '',
        class_time VARCHAR(100),
        current_belt VARCHAR(50) DEFAULT 'none',
        membership_type VARCHAR(50) DEFAULT 'trial',
        heard_about_us VARCHAR(100),
        status VARCHAR(30) DEFAULT 'new',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
    return NextResponse.json({ ok: true, message: 'enrolments table ready' })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
