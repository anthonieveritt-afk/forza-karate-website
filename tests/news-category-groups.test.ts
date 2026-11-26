import { readFileSync } from 'fs'
import { describe, expect, it } from 'vitest'
import { allPosts, categoriesFromPosts } from '@/lib/news'
import {
  NEWS_CATEGORY_GROUP_DEFS,
  OTHER_GROUP_ID,
  OTHER_GROUP_LABEL,
  groupIdForCategorySlug,
  groupNewsCategories,
  newsCategoryHref,
} from '@/lib/news-category-groups'

describe('news category groups', () => {
  const cats = categoriesFromPosts(allPosts)
  const groups = groupNewsCategories(cats)
  const groupedSlugs = groups.flatMap((g) => g.categories.map((c) => c.slug))

  it('lists every known slug in exactly one group definition', () => {
    const seen = new Set<string>()
    for (const def of NEWS_CATEGORY_GROUP_DEFS) {
      for (const slug of def.slugs) {
        expect(seen.has(slug), `slug "${slug}" listed twice`).toBe(false)
        seen.add(slug)
      }
    }
  })

  it('places every category from the news posts in exactly one group', () => {
    expect(cats.length).toBeGreaterThan(20)
    expect(groupedSlugs.sort()).toEqual(cats.map((c) => c.slug).sort())
    expect(new Set(groupedSlugs).size).toBe(cats.length)
  })

  it('keeps the published category names and slugs unchanged', () => {
    const bySlug = new Map(cats.map((c) => [c.slug, c]))
    for (const g of groups) {
      for (const c of g.categories) {
        expect(c.name).toBe(bySlug.get(c.slug)?.name)
        expect(c.slug).toBe(bySlug.get(c.slug)?.slug)
      }
    }
  })

  it('uses the expected parent groups and does not invent an Other bucket for current posts', () => {
    expect(groups.map((g) => g.id)).toEqual([
      'competitions',
      'gradings',
      'club-news',
      'squads',
      'training',
    ])
    expect(groups.map((g) => g.label)).toEqual([
      'Competitions & Results',
      'Gradings',
      'Club News & Events',
      'Squads & Teams',
      'Training & Courses',
    ])
    expect(groups.some((g) => g.id === OTHER_GROUP_ID)).toBe(false)
  })

  it('puts unknown slugs in Other so a new category is never dropped', () => {
    const extra = groupNewsCategories([
      ...cats.slice(0, 1),
      { name: 'Brand New', slug: 'brand-new-category', count: 1 },
    ])
    const other = extra.find((g) => g.id === OTHER_GROUP_ID)
    expect(other?.label).toBe(OTHER_GROUP_LABEL)
    expect(other?.categories.map((c) => c.slug)).toEqual(['brand-new-category'])
  })

  it('keeps filter URLs as /news?category=<slug>', () => {
    expect(newsCategoryHref()).toBe('/news')
    expect(newsCategoryHref('general-news')).toBe('/news?category=general-news')
    expect(newsCategoryHref('general-news', 1)).toBe('/news?category=general-news')
    expect(newsCategoryHref('general-news', 2)).toBe('/news?category=general-news&page=2')
    expect(newsCategoryHref(undefined, 2)).toBe('/news?page=2')
    expect(groupIdForCategorySlug('grading')).toBe('gradings')
    expect(groupIdForCategorySlug('not-a-real-slug')).toBe(OTHER_GROUP_ID)
  })
})

describe('news page category nav', () => {
  const page = readFileSync('app/news/page.tsx', 'utf8')
  const nav = readFileSync('components/news/NewsCategoryNav.tsx', 'utf8')

  it('renders the grouped drop-down nav and keeps the old category alias redirect', () => {
    expect(page).toContain("from '@/components/news/NewsCategoryNav'")
    expect(page).toContain('groupNewsCategories')
    expect(page).toContain("preparation-training-2")
    expect(page).toContain('NewsCategoryNav')
    expect(page).not.toContain('c.count >= 3')
  })

  it('is a keyboard-accessible click-to-open drop-down that closes on Escape and outside click', () => {
    expect(nav).toContain("'use client'")
    expect(nav).toContain('aria-expanded')
    expect(nav).toContain('aria-controls')
    expect(nav).toContain('aria-current')
    expect(nav).toContain("e.key === 'Escape'")
    expect(nav).toContain('pointerdown')
    expect(nav).toContain('All <span')
    expect(nav).toContain('aria-label="News categories"')
    expect(nav).toContain('newsCategoryHref(c.slug)')
  })
})
