import { createFileRoute } from '@tanstack/react-router'
import { countries, posts as fixturePosts } from '@/data/fixtures'
import { queryRows } from '@/lib/db.server'

const siteUrl = 'https://britisheducationandimmigration.com'
const staticPages = [
  ['/', 'weekly', '1.0'],
  ['/countries', 'weekly', '0.9'],
  ['/visas', 'weekly', '0.9'],
  ['/eligibility', 'monthly', '0.85'],
  ['/coaching', 'weekly', '0.85'],
  ['/success-stories', 'weekly', '0.8'],
  ['/certificates', 'monthly', '0.6'],
  ['/updates', 'weekly', '0.8'],
  ['/contact', 'monthly', '0.7'],
] as const

function escapeXml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
}

function validSlug(value: unknown) {
  const slug = String(value ?? '')
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : ''
}

function dateOnly(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  const raw = String(value ?? '')
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10)
  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10)
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        let articleRows: Array<Record<string, unknown>> = []
        try {
          articleRows = await queryRows('SELECT slug, updated_at FROM content_posts WHERE published = 1 ORDER BY publish_date DESC, id DESC')
        } catch {
          articleRows = []
        }

        const articles = articleRows.length
          ? articleRows.map((row) => ({ slug: row.slug, date: row.updated_at }))
          : fixturePosts.map((post) => ({ slug: post.slug, date: post.date }))
        const entries: Array<{ path: string; frequency: string; priority: string; lastmod?: string }> = [
          ...staticPages.map(([path, frequency, priority]) => ({ path, frequency, priority })),
          ...countries.map((country) => ({ path: '/countries/' + country.slug, frequency: 'monthly', priority: '0.8' })),
        ]
        const seen = new Set(entries.map((entry) => entry.path))
        for (const article of articles) {
          const slug = validSlug(article.slug)
          const path = slug ? '/updates/' + slug : ''
          if (!path || seen.has(path)) continue
          seen.add(path)
          const lastmod = dateOnly(article.date)
          entries.push({ path, frequency: 'monthly', priority: '0.6', ...(lastmod ? { lastmod } : {}) })
        }

        const body = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...entries.map((entry) => [
            '  <url>',
            '    <loc>' + escapeXml(siteUrl + entry.path) + '</loc>',
            entry.lastmod ? '    <lastmod>' + escapeXml(entry.lastmod) + '</lastmod>' : '',
            '    <changefreq>' + entry.frequency + '</changefreq>',
            '    <priority>' + entry.priority + '</priority>',
            '  </url>',
          ].filter(Boolean).join('\n')),
          '</urlset>',
        ].join('\n')

        return new Response(body, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=60',
          },
        })
      },
    },
  },
})
