import { useEffect, useRef, useState, type SyntheticEvent } from 'react'
import { createPortal } from 'react-dom'
import { CountryPageView } from '@/components/CountryPageView'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { Route as RootRoute } from '@/routes/__root'
import type { Country } from '@/data/fixtures'
import type { VisaGuidance } from '@/data/visa-guidance'

const previewDocument = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Country page preview</title></head><body style="margin:0"><div id="country-page-preview-root"></div></body></html>'

type PreviewSize = 'mobile' | 'desktop'

export function CountryPagePreview({ content }: {
  content: { country: Country; guidance: VisaGuidance }
}) {
  const [size, setSize] = useState<PreviewSize>('mobile')
  const [mountTarget, setMountTarget] = useState<HTMLElement | null>(null)
  const [desktopScale, setDesktopScale] = useState(0.5)
  const [wide, setWide] = useState(false)
  const wideRef = useRef(false)
  const naturalTopRef = useRef<number | null>(null)
  const panelRef = useRef<HTMLElement>(null)
  const frameAreaRef = useRef<HTMLDivElement>(null)

  function preparePreview(event: SyntheticEvent<HTMLIFrameElement>) {
    const frameDocument = event.currentTarget.contentDocument
    if (!frameDocument) return

    Array.from(document.head.querySelectorAll('link[rel="stylesheet"], style')).forEach((source) => {
      if (source instanceof HTMLLinkElement) {
        const copy = source.cloneNode(true) as HTMLLinkElement
        copy.href = source.href
        frameDocument.head.appendChild(copy)
      } else {
        frameDocument.head.appendChild(source.cloneNode(true))
      }
    })

    frameDocument.body.style.margin = '0'
    setMountTarget(frameDocument.getElementById('country-page-preview-root'))
  }

  useEffect(() => {
    function updateViewportMode() {
      const nextWide = window.matchMedia('(min-width: 1024px)').matches
      if (nextWide === wideRef.current) return

      if (nextWide) {
        const panel = panelRef.current
        naturalTopRef.current = panel ? panel.getBoundingClientRect().top + window.scrollY : 180
      } else {
        naturalTopRef.current = null
      }

      wideRef.current = nextWide
      setWide(nextWide)
    }

    updateViewportMode()
    window.addEventListener('resize', updateViewportMode)
    return () => window.removeEventListener('resize', updateViewportMode)
  }, [])

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    if (!wide) {
      panel.style.removeProperty('position')
      panel.style.removeProperty('top')
      panel.style.removeProperty('right')
      panel.style.removeProperty('width')
      panel.style.removeProperty('z-index')
      return
    }

    function keepPreviewBesideEditor() {
      const top = Math.max(16, (naturalTopRef.current ?? 180) - window.scrollY)
      const width = Math.min(520, (window.innerWidth - 64) / 2)
      const right = Math.max(16, (window.innerWidth - 1152) / 2)

      panel.style.position = 'fixed'
      panel.style.top = top + 'px'
      panel.style.right = right + 'px'
      panel.style.width = width + 'px'
      panel.style.zIndex = '40'

      const frameArea = frameAreaRef.current
      if (frameArea) {
        const scale = Math.min(1, frameArea.clientWidth / 1024)
        const pageHeight = size === 'mobile' ? 400 : 900 * scale
        const availableHeight = Math.max(180, window.innerHeight - top - 180)
        frameArea.style.height = Math.min(pageHeight, availableHeight) + 'px'
      }
    }

    keepPreviewBesideEditor()
    window.addEventListener('scroll', keepPreviewBesideEditor, { passive: true })
    window.addEventListener('resize', keepPreviewBesideEditor)
    return () => {
      window.removeEventListener('scroll', keepPreviewBesideEditor)
      window.removeEventListener('resize', keepPreviewBesideEditor)
    }
  }, [wide, size, desktopScale])

  useEffect(() => {
    const frameArea = frameAreaRef.current
    if (!frameArea || typeof ResizeObserver === 'undefined') return
    const resizeObserver = new ResizeObserver(() => setDesktopScale(Math.min(1, frameArea.clientWidth / 1024)))
    resizeObserver.observe(frameArea)
    setDesktopScale(Math.min(1, frameArea.clientWidth / 1024))
    return () => resizeObserver.disconnect()
  }, [])

  const mobile = size === 'mobile'
  const previewCard = (
    <section
      ref={panelRef}
      className={'rounded-2xl border border-forest-900/15 bg-white p-4 shadow-sm sm:p-5 ' + (wide ? 'fixed z-40' : '')}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-coral-600">Page preview</p>
          <h4 className="mt-1 font-extrabold text-forest-900">Check the country page before publishing</h4>
        </div>
        <div role="group" aria-label="Preview screen size" className="inline-flex w-fit rounded-xl border border-forest-900/15 bg-forest-50 p-1">
          <button
            type="button"
            aria-pressed={mobile}
            onClick={() => setSize('mobile')}
            className={'min-h-10 rounded-lg px-3 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 ' + (mobile ? 'bg-forest-900 text-white' : 'text-forest-900 hover:bg-white')}
          >
            Mobile
          </button>
          <button
            type="button"
            aria-pressed={!mobile}
            onClick={() => setSize('desktop')}
            className={'min-h-10 rounded-lg px-3 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 ' + (!mobile ? 'bg-forest-900 text-white' : 'text-forest-900 hover:bg-white')}
          >
            Desktop
          </button>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-forest-900/60">
        This uses the same country page layout and updates as you edit. The preview links and enquiry form are inactive.
      </p>
      <div
        ref={frameAreaRef}
        className="mt-4 w-full overflow-hidden rounded-xl border border-forest-900/10 bg-forest-50"
        style={{ height: mobile ? '400px' : String(900 * desktopScale) + 'px' }}
      >
        <iframe
          title={(mobile ? 'Mobile' : 'Desktop') + ' preview of ' + (content.country.name || 'country') + ' page'}
          srcDoc={previewDocument}
          sandbox="allow-same-origin"
          onLoad={preparePreview}
          style={{
            width: mobile ? '390px' : '1024px',
            maxWidth: mobile ? '100%' : undefined,
            height: mobile ? '720px' : '900px',
            transform: mobile ? undefined : `scale(${desktopScale})`,
            transformOrigin: 'top left',
          }}
          className={'block border-0 bg-white ' + (mobile ? 'mx-auto' : '')}
        />
        {mountTarget && createPortal(
          <CountryPreviewShell content={content} />,
          mountTarget,
        )}
      </div>
    </section>
  )

  return wide ? createPortal(previewCard, document.body) : previewCard
}

function CountryPreviewShell({ content }: {
  content: { country: Country; guidance: VisaGuidance }
}) {
  const { settings, countries } = RootRoute.useLoaderData()

  return (
    <div inert>
      <SiteHeader settings={settings} />
      <main className="public-main">
        <CountryPageView country={content.country} guidance={content.guidance} preview />
      </main>
      <SiteFooter settings={settings} countries={countries} />
    </div>
  )
}
