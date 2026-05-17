import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  date,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core'

// Trial class bookings
export const trialBookings = pgTable('trial_bookings', {
  id: serial('id').primaryKey(),
  parentName: varchar('parent_name', { length: 255 }).notNull(),
  childName: varchar('child_name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  ageGroup: varchar('age_group', { length: 50 }).notNull(), // ninjas | juniors | seniors
  preferredDojo: varchar('preferred_dojo', { length: 50 }).notNull(), // rayleigh | upminster
  message: text('message'),
  status: varchar('status', { length: 30 }).default('pending'), // pending | contacted | converted | declined
  createdAt: timestamp('created_at').defaultNow(),
})

// Grading registrations
export const gradingRegistrations = pgTable('grading_registrations', {
  id: serial('id').primaryKey(),
  memberName: varchar('member_name', { length: 255 }).notNull(),
  parentName: varchar('parent_name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  currentBelt: varchar('current_belt', { length: 50 }).notNull(),
  dojo: varchar('dojo', { length: 50 }).notNull(),
  gradingDate: varchar('grading_date', { length: 100 }).notNull(),
  notes: text('notes'),
  status: varchar('status', { length: 30 }).default('registered'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Members (for GoCardless enrolment — Phase 2)
export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 50 }),
  dateOfBirth: date('date_of_birth'),
  dojo: varchar('dojo', { length: 50 }),
  ageGroup: varchar('age_group', { length: 50 }),
  currentBelt: varchar('current_belt', { length: 50 }).default('white'),
  goCardlessCustomerId: varchar('gocardless_customer_id', { length: 100 }),
  goCardlessMandateId: varchar('gocardless_mandate_id', { length: 100 }),
  membershipStatus: varchar('membership_status', { length: 30 }).default('pending'), // pending | active | paused | cancelled
  membershipStartDate: date('membership_start_date'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Shop orders (Stripe — Phase 2)
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  stripeSessionId: varchar('stripe_session_id', { length: 255 }),
  items: jsonb('items').notNull(),
  totalPence: integer('total_pence').notNull(),
  status: varchar('status', { length: 30 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
})
