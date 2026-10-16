// ⚠ PLACEHOLDER PRICES — for Anthoni to confirm before going live.
// All amounts are in pence (GBP).

export const TRIAL_PRICE_PENCE = 1000 // £10 trial class (agreed)
export const GUIDE_PRICE_PENCE = 500 // £5 per belt guide — PLACEHOLDER
export const GUIDE_BUNDLE_PRICE_PENCE = 3000 // £30 all guides — PLACEHOLDER
export const VIDEO_MONTHLY_PENCE = 500 // £5/month video membership — PLACEHOLDER

export const PRICES_ARE_PLACEHOLDERS = true

export function gbp(pence: number): string {
  return `£${(pence / 100).toFixed(pence % 100 === 0 ? 0 : 2)}`
}

// Belt order as shown in the Belt Progression section (components/sections/BeltJourney.tsx).
export type Belt = { slug: string; grade: string; name: string; colour: string }
export const BELTS: Belt[] = [
  { slug: '17-kyu', grade: '17th Kyu', name: 'White Belt / Red Stripe', colour: '#ffffff' },
  { slug: '16-kyu', grade: '16th Kyu', name: 'White Belt / Yellow Stripe', colour: '#ffffff' },
  { slug: '15-kyu', grade: '15th Kyu', name: 'Red Belt', colour: '#ef4444' },
  { slug: '14-kyu', grade: '14th Kyu', name: 'Red Belt / White Stripe', colour: '#ef4444' },
  { slug: '13-kyu', grade: '13th Kyu', name: 'Yellow Belt', colour: '#facc15' },
  { slug: '12-kyu', grade: '12th Kyu', name: 'Yellow Belt / White Stripe', colour: '#facc15' },
  { slug: '11-kyu', grade: '11th Kyu', name: 'Orange Belt', colour: '#f97316' },
  { slug: '10-kyu', grade: '10th Kyu', name: 'Orange Belt / White Stripe', colour: '#f97316' },
  { slug: '9-kyu', grade: '9th Kyu', name: 'Green Belt', colour: '#22c55e' },
  { slug: '8-kyu', grade: '8th Kyu', name: 'Green Belt / White Stripe', colour: '#22c55e' },
  { slug: '7-kyu', grade: '7th Kyu', name: 'Blue Belt', colour: '#3b82f6' },
  { slug: '6-kyu', grade: '6th Kyu', name: 'Blue Belt / White Stripe', colour: '#3b82f6' },
  { slug: '5-kyu', grade: '5th Kyu', name: 'Purple Belt', colour: '#9333ea' },
  { slug: '4-kyu', grade: '4th Kyu', name: 'Purple Belt / White Stripe', colour: '#9333ea' },
  { slug: '3-kyu', grade: '3rd Kyu', name: 'Brown Belt', colour: '#92400e' },
  { slug: '2-kyu', grade: '2nd Kyu', name: 'Brown Belt / White Stripe', colour: '#92400e' },
  { slug: '1-kyu', grade: '1st Kyu', name: 'Brown Belt / Two Stripe', colour: '#92400e' },
  { slug: '1-dan', grade: '1st Dan', name: 'Black Belt', colour: '#111111' },
]

export function getBelt(slug: string): Belt | undefined {
  return BELTS.find((b) => b.slug === slug)
}

// Members-only videos. Anthoni: add unlisted YouTube video IDs here.
// They're embedded via youtube-nocookie.com.
export type Video = { id: string; title: string; belt?: string; youtubeId: string | null; group?: 'syllabus' | 'more' }
// Source: Anthoni's playlist PLtvkLumGLdp6kj8j0EXmlqGSv-2i7bLMn (performed by Sensei Scott Nicholls).
// Checked 13 Oct 2026: adult instructor only, Forza badge, no JHKA in title/description/thumbnail.
export const VIDEOS: Video[] = [
  // Tab 1 — Grading syllabus
  { id: 'pinan-shodan', title: 'Pinan Shodan', youtubeId: '1BR62O-c1aA', group: 'syllabus' },
  { id: 'pinan-nidan', title: 'Pinan Nidan', youtubeId: '4t4F6VO4BYM', group: 'syllabus' },
  { id: 'pinan-sandan', title: 'Pinan Sandan', youtubeId: '9Lo302OBalM', group: 'syllabus' },
  { id: 'pinan-yondan', title: 'Pinan Yondan', youtubeId: '8spjrvwW4RA', group: 'syllabus' },
  { id: 'pinan-godan', title: 'Pinan Godan', youtubeId: 'sMdiq_fAOWc', group: 'syllabus' },
  { id: 'tobikomizuki-jodan', title: 'Tobikomizuki Jodan - Snap punch', youtubeId: null, group: 'syllabus' },
  { id: 'tobikomizuki-gyakuzuki', title: 'Tobikomizuki Jodan + Gyakuzuki Chudan', youtubeId: null, group: 'syllabus' },
  // Tab 2 — More videos (YouTube titles)
  { id: 'ku-shanku', title: 'Ku Shanku', youtubeId: '89A_aUbBXtc', group: 'more' },
  { id: 'jitte', title: 'Jitte', youtubeId: 'N1kUiwL57vY', group: 'more' },
  { id: 'jion', title: 'Jion', youtubeId: '0VS1kN5vAE0', group: 'more' },
  { id: 'bassai', title: 'Bassai', youtubeId: 'hNchY_GzxWM', group: 'more' },
  { id: 'seishan', title: 'Seishan', youtubeId: 'T3jg7hxzS9k', group: 'more' },
  { id: 'nai-hanchi', title: 'Nai Hanchi', youtubeId: 'bg9HU21lYuw', group: 'more' },
]
