# Phase 1 Summary — Forza Karate Club Website

## What was built

### Pages (25 routes)
All pages export proper `metadata` and use the light, minimal design system.

| Route | Status |
|-------|--------|
| `/` | ✅ Full home page — Hero, StatsBand, ClassCards, BeltJourney, Why Karate teaser, Instructor teaser, Final CTA |
| `/why-karate` | ✅ Benefits, Wado Ryu / WKF style notes, CTA |
| `/classes` | ✅ Overview of all 3 classes with cards |
| `/classes/ninjas` | ✅ Forza Ninjas detail — ages 4–7 |
| `/classes/juniors` | ✅ Forza Juniors detail — ages 8–10 |
| `/classes/seniors` | ✅ Forza Club detail — ages 11+ and adults |
| `/dojos` | ✅ Overview of both dojos |
| `/dojos/rayleigh` | ✅ Rayleigh dojo detail with map placeholder |
| `/dojos/upminster` | ✅ Upminster dojo detail with map placeholder |
| `/instructors` | ✅ Credentials, placeholder instructor cards |
| `/gradings` | ✅ Criteria, belt order, live grading registration form |
| `/team` | ✅ Kata and Kumite team sections |
| `/hall-of-fame` | ✅ Black belts grid + honorary black belts |
| `/calendar` | ✅ Term dates, key dates, calendar embed placeholder |
| `/gallery` | ✅ Grid layout with category filter, placeholder images |
| `/safeguarding` | ✅ Policy, DBS info, contact |
| `/news` | ✅ Stub — content coming |
| `/contact` | ✅ Contact info + simple contact form |
| `/trial-class` | ✅ **FULLY WORKING** booking form — saves to DB |
| `/join` | ✅ Membership info, GoCardless stub |
| `/shop` | ✅ Stub with email capture, Stripe note |
| `/privacy-policy` | ✅ Full GDPR-compliant UK policy |

### Components

**Layout:**
- `components/layout/Navbar.tsx` — sticky, responsive, mobile hamburger
- `components/layout/Footer.tsx` — dark footer with links, social icons, FKA note

**UI:**
- `components/ui/Button.tsx` — pill-shaped, 4 variants (default/red, outline, ghost, dark)
- `components/ui/Card.tsx` — rounded-2xl, white, subtle border
- `components/ui/Badge.tsx` — rounded pill badges

**Sections:**
- `components/sections/Hero.tsx` — full home hero
- `components/sections/StatsBand.tsx` — dark stats strip
- `components/sections/ClassCard.tsx` — reusable class card
- `components/sections/BeltJourney.tsx` — belt progression visualiser

**Forms (fully working):**
- `components/forms/TrialClassForm.tsx` — trial class booking
- `components/forms/GradingRegForm.tsx` — grading registration

### Database Schema (`lib/db/schema.ts`)
- `trial_bookings` — trial class enquiries (Phase 1 active)
- `grading_registrations` — grading sign-ups (Phase 1 active)
- `members` — membership records (Phase 2: GoCardless)
- `orders` — shop orders (Phase 2: Stripe)

### Server Actions
- `app/actions/trial-booking.ts` — inserts to `trial_bookings`
- `app/actions/grading-registration.ts` — inserts to `grading_registrations`

---

## What's stubbed for Phase 2

| Feature | File | Notes |
|---------|------|-------|
| GoCardless enrolment | `/join` | Stub with explanation. Online signup flow needed. |
| Stripe shop | `/shop` | Email capture stub. Need product catalogue + Stripe Checkout. |
| Map embeds | `/dojos/rayleigh`, `/dojos/upminster` | Placeholder divs — add Google Maps iframe or Mapbox. |
| Timetables | All class + dojo pages | Placeholder table — update with real times. |
| Instructor photos + bios | `/instructors` | Placeholder cards — add real data. |
| Hall of Fame listing | `/hall-of-fame` | Placeholder — add real members. |
| Gallery photos | `/gallery` | Placeholder grid — add real images. |
| Contact form action | `/contact` | Form renders but has no server action — needs implementing. |
| Calendar embed | `/calendar` | Placeholder — integrate Google Calendar or similar. |
| News posts | `/news` | Static stub — could be a CMS or markdown-based. |

---

## Vercel Deploy Instructions

### 1. Push to GitHub (if not done)
```bash
cd ~/Documents/forza-karate-website
git init && git add . && git commit -m "Initial commit — Phase 1"
gh repo create anthonieveritt-afk/forza-karate-website --public --source=. --remote=origin --push
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import `anthonieveritt-afk/forza-karate-website` from GitHub
3. Framework: **Next.js** (auto-detected)
4. Add environment variables (see below)
5. Deploy

### 3. Environment Variables required

| Variable | Required for | Phase |
|----------|-------------|-------|
| `DATABASE_URL` | Trial bookings + grading forms | Phase 1 |
| `GOCARDLESS_ACCESS_TOKEN` | Member enrolment | Phase 2 |
| `GOCARDLESS_WEBHOOK_SECRET` | GoCardless webhooks | Phase 2 |
| `STRIPE_SECRET_KEY` | Shop checkout | Phase 2 |
| `STRIPE_PUBLISHABLE_KEY` | Shop checkout | Phase 2 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side Stripe | Phase 2 |

### 4. Database setup (Railway)
```bash
# After setting DATABASE_URL, run migrations
pnpm drizzle-kit push
```

---

## Design System Notes

- Background: `#ffffff` / `#fafaf9` (off-white sections)
- Text: `#111111`
- Accent: `#dc2626` (red) — used sparingly on CTAs, icons, eyebrows
- Footer: `#0a0a0a` (near-black)
- Borders: `border-black/8` or `border-black/12`
- Buttons: `rounded-full` pill shape
- Cards: `rounded-2xl`, white, `border border-black/8`
- Font: Inter (Google Fonts)

---

## Build
```
pnpm build
```
✅ Passes clean. 25 static routes generated. 0 TypeScript errors.
