import type { NextConfig } from "next";
import { legacyRedirects, trailingSlashRedirect, withOptionalSlash } from "./redirects";
import { FIKC_URL, INVITATIONAL_PATHS } from "./lib/members/links";

const nextConfig: NextConfig = {
  // Trailing slashes are handled in redirects() so old WordPress URLs (/page/) need one hop, not two.
  skipTrailingSlashRedirect: true,
  images: {
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
