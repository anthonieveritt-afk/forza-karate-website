import type { NextConfig } from "next";
import { legacyRedirects, trailingSlashRedirect, withOptionalSlash } from "./redirects";
import { APPLY_LICENCE_URL, FIKC_URL, INVITATIONAL_PATHS } from "./lib/members/links";

const nextConfig: NextConfig = {
  // Trailing slashes are handled in redirects() so old WordPress URLs (/page/) need one hop, not two.
  skipTrailingSlashRedirect: true,
  async headers() {
    // /admin stays reachable by direct URL for staff but is never indexed or linked.
    return [
      { source: '/admin', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
  async redirects() {
    return [
      ...[
      // Syllabus hidden for now (temporary 307); code/content kept so it can come back.
      { source: '/members/syllabus', destination: '/gradings', permanent: false },
      { source: '/forza-syllabus-template.html', destination: '/gradings', permanent: false },
      // The members renew-licence page was removed; old bookmarks go to the licence application page.
      { source: "/members/licence", destination: APPLY_LICENCE_URL, permanent: true },
      // The Invitational Cup now lives on the FIKC site.
      ...INVITATIONAL_PATHS.map((source) => ({ source, destination: FIKC_URL, permanent: true })),
      ].map(withOptionalSlash),
      ...legacyRedirects,
      trailingSlashRedirect,
    ];
  },
};

export default nextConfig;
