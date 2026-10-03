import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['despite-gig-guidelines-explains.trycloudflare.com'],

  // The members-only syllabus lives outside public/ and is served by
  // app/members/syllabus/view/route.ts, so make sure it is bundled with that route.
  outputFileTracingIncludes: {
    '/members/syllabus/view': ['./private/**/*'],
  },

  async headers() {
    return [
      {
        // DEVELOPMENT ONLY: belt-and-braces noindex for every response (pages, images, PDFs).
        // Remove at launch together with app/robots.ts and the robots metadata in app/layout.tsx.
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },

  async redirects() {
    return [
      // The site has no contact page: send old links to the free trial booking instead.
      { source: '/contact', destination: '/trial-class', permanent: false },
      // The syllabus used to be a public file; it now lives behind the members login.
      { source: '/forza-syllabus-template.html', destination: '/members/syllabus', permanent: false },
    ]
  },
};

export default nextConfig;
