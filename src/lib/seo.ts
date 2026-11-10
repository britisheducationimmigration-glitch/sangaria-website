const siteOrigin = 'https://www.britisheducationandimmigration.com'

export type PageSeoOptions = {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
}

export function createPageSeo({ title, description, path, type = 'website' }: PageSeoOptions) {
  const canonicalPath = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`
  const canonicalUrl = `${siteOrigin}${canonicalPath}`
  const uniqueDescription = description.replace(/\s+/g, ' ').trim().slice(0, 160)

  return {
    meta: [
      { title },
      { name: 'description', content: uniqueDescription },
      { name: 'robots', content: 'index,follow' },
      { property: 'og:type', content: type },
      { property: 'og:title', content: title },
      { property: 'og:description', content: uniqueDescription },
      { property: 'og:url', content: canonicalUrl },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: uniqueDescription },
    ],
    links: [{ rel: 'canonical', href: canonicalUrl }],
  }
}
