import { createFileRoute } from '@tanstack/react-router'

const robotsContent = `# British Education and Immigration - Robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /attendance/

Sitemap: https://www.britisheducationandimmigration.com/sitemap.xml
`

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(robotsContent, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
          },
        }),
    },
  },
})
