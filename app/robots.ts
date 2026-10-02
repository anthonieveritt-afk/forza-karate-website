import type { MetadataRoute } from 'next'

// DEVELOPMENT ONLY: the whole site is blocked from search engines while it is being built.
// At launch, replace this with rules that allow crawling (and add a sitemap), and remove the
// site-wide `robots` metadata in app/layout.tsx and the X-Robots-Tag header in next.config.ts.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', disallow: '/' }],
  }
}
