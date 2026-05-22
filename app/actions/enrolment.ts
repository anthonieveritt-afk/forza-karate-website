'use server'

import { sql } from '@vercel/postgres'

export interface EnrolmentData {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  email: string
  phone: string
  addressLine1: string
  addressLine2?: string
  town: string
  postcode: string
  parentFirstName?: string
  parentLastName?: string
  parentEmail?: string
  parentPhone?: string
  parentRelationship?: string
  emergencyName: string
  emergencyPhone: string
  emergencyRelationship: string
  medicalConditions?: string
  dojo: string
  classTime: string
  currentBelt: string
  membershipType: string
  heardAboutUs?: string
}

export async function submitEnrolment(data: EnrolmentData): Promise<void> {
  // Ensure table exists
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

  // Forward to Club Honbu
  const honbuUrl = process.env.CLUB_HONBU_URL
  const honbuSecret = process.env.CLUB_HONBU_WEBHOOK_SECRET
  if (honbuUrl && honbuSecret) {
    try {
      await fetch(`${honbuUrl}/api/webhooks/formsmarts/licence?token=${honbuSecret}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'First Name': data.firstName,
          'Last Name': data.lastName,
          'Email': data.email,
          'Phone': data.phone,
          'Date of Birth': data.dateOfBirth || '',
          'Address': data.addressLine1 || '',
          'Post Code': data.postcode || '',
          'Parent Name': data.parentFirstName ? `${data.parentFirstName} ${data.parentLastName ?? ''}`.trim() : '',
          'Emergency Contact': data.emergencyName || '',
          'Emergency Phone': data.emergencyPhone || '',
          'Medical': data.medicalConditions || '',
          'Belt': data.currentBelt || '',
          'Which Club': data.dojo || '',
          'Preferred Class': data.classTime || '',
          'Licence Type': data.membershipType || 'Student',
          'Source': 'Forza website join form',
        }),
      })
    } catch (err) {
      console.error('Club Honbu enrolment forward failed:', err)
    }
  }

  await sql`
    INSERT INTO enrolments (
      first_name, last_name, date_of_birth, gender, email, phone,
      address_line1, address_line2, town, postcode,
      parent_first_name, parent_last_name, parent_email, parent_phone, parent_relationship,
      emergency_name, emergency_phone, emergency_relationship,
      medical_conditions, dojo, class_time, current_belt, membership_type, heard_about_us
    ) VALUES (
      ${data.firstName}, ${data.lastName}, ${data.dateOfBirth}, ${data.gender}, ${data.email}, ${data.phone},
      ${data.addressLine1}, ${data.addressLine2 ?? null}, ${data.town}, ${data.postcode},
      ${data.parentFirstName ?? null}, ${data.parentLastName ?? null}, ${data.parentEmail ?? null},
      ${data.parentPhone ?? null}, ${data.parentRelationship ?? null},
      ${data.emergencyName}, ${data.emergencyPhone}, ${data.emergencyRelationship},
      ${data.medicalConditions ?? null}, ${data.dojo}, ${data.classTime}, ${data.currentBelt},
      ${data.membershipType}, ${data.heardAboutUs ?? null}
    )
  `
}
