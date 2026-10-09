import type { NextConfig } from "next";
import { legacyRedirects } from "./redirects";

const nextConfig: NextConfig = {
  async headers() {
    // /admin stays reachable by direct URL for staff but is never indexed or linked.
    return [
      { source: '/admin', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
  async redirects() {
    return [
      // Syllabus hidden for now (temporary 307); code/content kept so it can come back.
      { source: '/members/syllabus', destination: '/gradings', permanent: false },
      { source: '/forza-syllabus-template.html', destination: '/gradings', permanent: false },
      ...legacyRedirects,
    ];
  },
};

export default nextConfig;
