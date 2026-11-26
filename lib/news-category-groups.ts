import type { NewsCategory } from '@/lib/news'

export type NewsCategoryWithCount = NewsCategory & { count: number }

export type NewsCategoryGroup = {
  id: string
  label: string
  categories: NewsCategoryWithCount[]
}

/** Parent groups for the /news category filter. Every known slug is listed once. */
export const NEWS_CATEGORY_GROUP_DEFS: { id: string; label: string; slugs: readonly string[] }[] = [
  {
    id: 'competitions',
    label: 'Competitions & Results',
    slugs: [
      'competitions',
      'club-competitions',
      'forza-inter-club-karate-cup',
      'forza-karate-championships',
      'central-england-karate-championships',
      'central-england-karate-international',
      'france-competitions',
      'orleans',
      'bkf',
      'bkf-international',
      '2024-bkf-international',
      'wkf',
      'wkf-youth-league',
      'wkf-youth-league-wkf',
      'wkf-youth-cup',
      'english-senior-karate-championships',
      'dutch-open',
      'ekf',
      'ekf-international-open',
      'e1-karate-series',
      'jhka-invitational-karate-open',
      'super-champs',
      'super-champs-2',
      'division-1',
      'division-2',
    ],
  },
  {
    id: 'gradings',
    label: 'Gradings',
    slugs: ['grading', 'kyu-grading', 'dan-grading', 'ekf-kyu-grades'],
  },
  {
    id: 'club-news',
    label: 'Club News & Events',
    slugs: [
      'club-news',
      'general-news',
      'rayleigh-news',
      'upminster-news',
      'basildon-news',
      'shoeburyness-news',
      'frontier-karate-association',
      'tukka-awards',
      'pcka',
      'sign-up-for-a-trial-class',
    ],
  },
  {
    id: 'squads',
    label: 'Squads & Teams',
    slugs: [
      'kumite-team',
      'kata-team',
      'england-karate-team',
      'cadet-team',
      'senior-team',
      'und-21',
      'forza-karate-squad',
      'association-squad-training',
    ],
  },
  {
    id: 'training',
    label: 'Training & Courses',
    slugs: [
      'preparation-training',
      'kata-preparation-training',
      'kumite-preparation-training',
      'kumite-training',
      'kumite-course',
      'kata-training',
      'kata',
      'kumite',
      'sport-karate-coaching',
      'masterclass-events',
      'molly-samuel-leport-m-b-e',
      'para-karate',
    ],
  },
]

export const OTHER_GROUP_ID = 'other'
export const OTHER_GROUP_LABEL = 'Other'

const SLUG_TO_GROUP = new Map<string, string>()
for (const def of NEWS_CATEGORY_GROUP_DEFS) {
  for (const slug of def.slugs) {
    if (SLUG_TO_GROUP.has(slug)) {
      throw new Error(`News category slug "${slug}" is listed in more than one group`)
    }
    SLUG_TO_GROUP.set(slug, def.id)
  }
}

export function groupIdForCategorySlug(slug: string) {
  return SLUG_TO_GROUP.get(slug) ?? OTHER_GROUP_ID
}

/** Place every category in exactly one group. Unknown slugs go in Other so nothing is dropped. */
export function groupNewsCategories(cats: NewsCategoryWithCount[]): NewsCategoryGroup[] {
  const buckets = new Map<string, NewsCategoryWithCount[]>()
  for (const def of NEWS_CATEGORY_GROUP_DEFS) buckets.set(def.id, [])
  buckets.set(OTHER_GROUP_ID, [])

  for (const cat of cats) {
    buckets.get(groupIdForCategorySlug(cat.slug))!.push(cat)
  }

  const groups: NewsCategoryGroup[] = NEWS_CATEGORY_GROUP_DEFS.map((def) => ({
    id: def.id,
    label: def.label,
    categories: buckets.get(def.id)!,
  }))

  const other = buckets.get(OTHER_GROUP_ID)!
  if (other.length) {
    groups.push({ id: OTHER_GROUP_ID, label: OTHER_GROUP_LABEL, categories: other })
  }

  return groups.filter((g) => g.categories.length > 0)
}

export function newsCategoryHref(slug?: string, page?: number) {
  const q = new URLSearchParams()
  if (slug) q.set('category', slug)
  if (page && page > 1) q.set('page', String(page))
  const s = q.toString()
  return s ? `/news?${s}` : '/news'
}
