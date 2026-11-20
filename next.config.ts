import type { NextConfig } from "next";
import { legacyRedirects, trailingSlashRedirect, withOptionalSlash } from "./redirects";
import { FIKC_URL, INVITATIONAL_PATHS } from "./lib/members/links";

const nextConfig: NextConfig = {
  // Trailing slashes are handled in redirects() so old WordPress URLs (/page/) need one hop, not two.
  skipTrailingSlashRedirect: true,
  images: {
    // Vercel's image optimizer is over its plan limit and answers 402 (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED)
    // for any photo size it has not already cached, so photos vanish. Serve the files as they are instead.
    // Local photos in /public are already compressed webp; R2 photos come straight from R2.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    // Cap the longest edge we ask Vercel to emit; 4K widths are wasted on phones.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      // Forza Club Honbu gallery + news photos on Cloudflare R2
      { protocol: 'https', hostname: 'pub-119c569153c84794919525fc33906a2c.r2.dev', pathname: '/**' },
      { protocol: 'https', hostname: '*.r2.dev', pathname: '/**' },
    ],
  },
  async headers() {
    // /admin stays reachable by direct URL for staff but is never indexed or linked.
    // Dojo Dash game assets: only Forza may iframe them (soft parent gate on /dojo-dash).
    return [
      // News list is a dynamic route (it reads ?category= and ?page=), so by default every visit, crawler hit
      // and bot ping ran a serverless function. Let Vercel's CDN keep each URL for a minute (stale copy allowed
      // for a few more while it refreshes). The page's own data is still refreshed every 5 minutes.
      { source: '/news', headers: [{ key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=240' }] },
      // Awards Evening page lists paid tickets from Stripe. Cache for a minute so it is not a Stripe API call
      // and a function run on every view.
      { source: '/events/awards-christmas-2026', headers: [{ key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=240' }] },
      // Files served from /public (photos, logos, music) were sent with max-age=0, so every page view made the
      // browser ask again for every image. Let browsers keep them for a day. (/_next/ files are already immutable.)
      {
        source: '/:path((?!_next/).*)\\.(webp|jpg|jpeg|png|avif|gif|svg|ico|mp3|mp4|woff2)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
      { source: '/admin', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      {
        source: '/games/dojo-dash/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: '/instructors/jade-honeywood.png', destination: '/instructors/jade-honeywood.webp', permanent: true },
      ...[
      // Syllabus hidden for now (temporary 307); code/content kept so it can come back.
      { source: '/members/syllabus', destination: '/gradings', permanent: false },
      { source: '/forza-syllabus-template.html', destination: '/gradings', permanent: false },
      // The Invitational Cup now lives on the FIKC site.
      ...INVITATIONAL_PATHS.map((source) => ({ source, destination: FIKC_URL, permanent: true })),
      ].map(withOptionalSlash),
      ...legacyRedirects,
      trailingSlashRedirect,
    ];
  },
};

export default nextConfig;
