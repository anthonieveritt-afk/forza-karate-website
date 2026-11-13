import { describe, it, expect, afterEach } from 'vitest'
import { allPosts, cardThumbnail, HIDDEN_SLUGS, type NewsPost } from '@/lib/news'
import {
  mergeNewsPosts,
  honbuPayloadToPost,
  fetchHonbuPublishedNews,
  loadMergedNews,
  shouldIncludePreviewDemo,
  previewDemoPost,
  plainBodyToHtml,
} from '@/lib/honbu-news'

const json: NewsPost[] = [
  {
    slug: 'older-json-story',
    title: 'Older JSON story',
    date: '2026-01-01T12:00:00',
    excerpt: 'From posts.json',
    categories: [{ name: 'General News', slug: 'general-news' }],
    tags: [],
    image: '/a.jpg',
    imageAlt: 'A',
    body: '<p>JSON</p>',
    images: [],
  },
  {
    slug: 'same-slug',
    title: 'JSON version',
    date: '2026-02-01T12:00:00',
    excerpt: 'JSON',
    categories: [{ name: 'General News', slug: 'general-news' }],
    tags: [],
    image: '/j.jpg',
    imageAlt: 'J',
    body: '<p>JSON</p>',
    images: [],
  },
]

const honbu = honbuPayloadToPost({
  slug: 'club-fun-day',
  title: 'Club fun day',
  date: '2026-11-13',
  excerpt: 'A great day at the dojo.',
  body: 'Paragraph one.\n\nParagraph two.',
  image: 'https://cdn.example/cover.jpg',
  imageAlt: 'Cover photo',
  cardImage: 'https://cdn.example/cover.jpg',
  cardImageAlt: 'Cover photo',
  photos: [
    { url: 'https://cdn.example/cover.jpg', caption: 'Cover photo', isCover: true },
    { url: 'https://cdn.example/two.jpg', caption: 'Second photo', isCover: false },
  ],
})!

describe('honbuPayloadToPost', () => {
  it('maps a public Honbu post and turns plain body into paragraphs', () => {
    expect(honbu.slug).toBe('club-fun-day')
    expect(honbu.source).toBe('honbu')
    expect(honbu.date).toBe('2026-11-13T12:00:00')
    expect(honbu.body).toBe('<p>Paragraph one.</p><p>Paragraph two.</p>')
    expect(honbu.photos).toHaveLength(2)
    expect(cardThumbnail(honbu)).toEqual({
      src: 'https://cdn.example/cover.jpg',
      alt: 'Cover photo',
      contain: true,
    })
  })

  it('rejects incomplete payloads', () => {
    expect(honbuPayloadToPost({})).toBeNull()
    expect(honbuPayloadToPost({ slug: 'x' })).toBeNull()
    expect(honbuPayloadToPost(null)).toBeNull()
  })

  it('leaves already-html bodies alone', () => {
    const p = honbuPayloadToPost({ slug: 'x', title: 'X', date: '2026-01-01', body: '<p>Hi</p>' })!
    expect(p.body).toBe('<p>Hi</p>')
  })
})

describe('mergeNewsPosts', () => {
  it('keeps every visible JSON post and inserts Honbu posts by date', () => {
    const merged = mergeNewsPosts(json, [honbu])
    expect(merged.map((p) => p.slug)).toEqual(['club-fun-day', 'same-slug', 'older-json-story'])
    expect(merged).toHaveLength(json.length + 1)
  })

  it('lets a Honbu post replace a JSON post with the same slug', () => {
    const replacement = honbuPayloadToPost({
      slug: 'same-slug',
      title: 'Honbu version',
      date: '2026-11-01',
      body: 'From Office',
    })!
    const merged = mergeNewsPosts(json, [replacement])
    expect(merged.filter((p) => p.slug === 'same-slug')).toHaveLength(1)
    expect(merged.find((p) => p.slug === 'same-slug')?.title).toBe('Honbu version')
    expect(merged.find((p) => p.slug === 'older-json-story')).toBeTruthy()
  })

  it('does not resurrect hidden JSON slugs', () => {
    const hiddenSlug = [...HIDDEN_SLUGS][0]
    const hidden: NewsPost = { ...json[0], slug: hiddenSlug, title: 'Hidden' }
    const merged = mergeNewsPosts([hidden, ...json], [honbu])
    expect(merged.some((p) => p.slug === hiddenSlug)).toBe(false)
  })
})

describe('fetchHonbuPublishedNews fallback', () => {
  it('returns no posts and ok=false when the API errors, so JSON can be used alone', async () => {
    const failed = await fetchHonbuPublishedNews(async () => { throw new Error('network down') })
    expect(failed).toEqual({ posts: [], ok: false })
    const badStatus = await fetchHonbuPublishedNews(async () => ({ ok: false, json: async () => [] }))
    expect(badStatus.ok).toBe(false)
    expect(badStatus.posts).toEqual([])
    const merged = await loadMergedNews(json, { fetcher: async () => { throw new Error('network down') }, includeDemo: false })
    expect(merged.map((p) => p.slug)).toEqual(['same-slug', 'older-json-story'])
  })

  it('merges published Honbu posts when the API succeeds', async () => {
    const merged = await loadMergedNews(json, {
      fetcher: async () => ({ ok: true, json: async () => [honbu] }),
      includeDemo: false,
    })
    expect(merged[0].slug).toBe('club-fun-day')
    expect(merged).toHaveLength(3)
  })
})

describe('preview demo guard', () => {
  const prevVercel = process.env.VERCEL_ENV
  const prevDemo = process.env.HONBU_NEWS_DEMO
  afterEach(() => {
    if (prevVercel === undefined) delete process.env.VERCEL_ENV
    else process.env.VERCEL_ENV = prevVercel
    if (prevDemo === undefined) delete process.env.HONBU_NEWS_DEMO
    else process.env.HONBU_NEWS_DEMO = prevDemo
  })

  it('never includes the demo on production', () => {
    process.env.VERCEL_ENV = 'production'
    delete process.env.HONBU_NEWS_DEMO
    expect(shouldIncludePreviewDemo()).toBe(false)
  })

  it('includes the demo on a Vercel preview so the layout can be tried', () => {
    process.env.VERCEL_ENV = 'preview'
    delete process.env.HONBU_NEWS_DEMO
    expect(shouldIncludePreviewDemo()).toBe(true)
    const demo = previewDemoPost()
    expect(demo.slug).toBe('preview-honbu-office-news-demo')
    expect(demo.photos?.length).toBeGreaterThan(1)
    expect(cardThumbnail(demo)?.contain).toBe(true)
  })
})

describe('plainBodyToHtml', () => {
  it('escapes markup', () => {
    expect(plainBodyToHtml('A <script>x</script>')).toBe('<p>A &lt;script&gt;x&lt;/script&gt;</p>')
  })
})

describe('existing JSON news stays available', () => {
  it('still loads the Kobe post from posts.json', () => {
    expect(allPosts.some((p) => p.slug === 'commonwealth-elite-2026-male-u21-60kg-results')).toBe(true)
    expect(allPosts.length).toBeGreaterThan(100)
  })
})
