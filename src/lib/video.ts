export function getSupportedVideoEmbedUrl(input: string) {
  try {
    const url = new URL(input.trim())
    if (url.protocol !== 'https:' || url.username || url.password) return ''
    const host = url.hostname.toLowerCase().replace(/^www\./, '')
    let id = ''

    if (host === 'youtu.be') {
      id = url.pathname.split('/').filter(Boolean)[0] ?? ''
    } else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (url.pathname === '/watch') id = url.searchParams.get('v') ?? ''
      else id = url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] ?? ''
      if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return ''
      return 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&mute=1&playsinline=1&controls=1&rel=0&loop=1&playlist=' + id
    } else if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const segments = url.pathname.split('/').filter(Boolean)
      id = segments.find((segment) => /^\d{5,12}$/.test(segment)) ?? ''
      const idIndex = segments.indexOf(id)
      const privacyHash = url.searchParams.get('h') ?? (idIndex >= 0 ? segments[idIndex + 1] ?? '' : '')
      if (!/^\d{5,12}$/.test(id) || (privacyHash && !/^[A-Za-z0-9]+$/.test(privacyHash))) return ''
      const params = new URLSearchParams({ autoplay: '1', muted: '1', loop: '1', title: '0', byline: '0', portrait: '0' })
      if (privacyHash) params.set('h', privacyHash)
      return 'https://player.vimeo.com/video/' + id + '?' + params.toString()
    } else {
      return ''
    }

    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return ''
    return 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&mute=1&playsinline=1&controls=1&rel=0&loop=1&playlist=' + id
  } catch {
    return ''
  }
}
