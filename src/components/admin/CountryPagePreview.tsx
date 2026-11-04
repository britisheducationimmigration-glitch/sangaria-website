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
  const [previewScale, setPreviewScale] = useState(1)
  const [wide, setWide] = useState(false)
  const wideRef = useRef(false)
  const anchorRef = useRef<HTMLDivElement>(null)
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
      panel.style.removeProperty('max-height')
      panel.style.removeProperty('overflow-y')
      return
    }

    function keepPreviewBesideEditor() {
      const anchorTop = anchorRef.current?.getBoundingClientRect().top ?? 180
      const top = Math.min(Math.max(16, anchorTop), Math.max(16, window.innerHeight - 320))
      const width = Math.min(520, (window.innerWidth - 64) / 2)
      const right = Math.max(16, (window.innerWidth - 1152) / 2)

      panel.style.position = 'fixed'
      panel.style.top = top + 'px'
      panel.style.right = right + 'px'
      panel.style.width = width + 'px'
      panel.style.zIndex = '40'
      panel.style.maxHeight = Math.max(260, window.innerHeight - top - 16) + 'px'
      panel.style.overflowY = 'auto'

      const frameArea = frameAreaRef.current
      if (frameArea) {
        const viewportWidth = size === 'mobile' ? 390 : 1024
        const viewportHeight = size === 'mobile' ? 844 : 900
        const scale = Math.min(1, frameArea.clientWidth / viewportWidth)
        const pageHeight = viewportHeight * scale
        const availableHeight = Math.max(220, window.innerHeight - top - 220)
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
  }, [wide, size, previewScale])

  useEffect(() => {
    const frameArea = frameAreaRef.current
    if (!frameArea || typeof ResizeObserver === 'undefined') return
    const viewportWidth = size === 'mobile' ? 390 : 1024
    const updateScale = () => setPreviewScale(Math.min(1, frameArea.clientWidth / viewportWidth))
    const resizeObserver = new ResizeObserver(updateScale)
    resizeObserver.observe(frameArea)
    updateScale()
    return () => resizeObserver.disconnect()
  }, [size])

  const mobile = size === 'mobile'
  const viewportWidth = mobile ? 390 : 1024
  const viewportHeight = mobile ? 844 : 900
  const renderedWidth = Math.round(viewportWidth * previewScale)
  const renderedHeight = Math.round(viewportHeight * previewScale)
  const previewCard = (
    <section
      ref={panelRef}
      className={'w-full min-w-0 max-w-full rounded-2xl border border-forest-900/15 bg-white p-4 shadow-sm sm:p-5 ' + (wide ? 'fixed z-40' : '')}
    >
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-coral-600">Page preview</p>
          <h4 className="mt-1 font-extrabold text-forest-900">Check the country page before publishing</h4>
        </div>
        <div role="group" aria-label="Preview screen size" className="inline-flex w-fit shrink-0 rounded-xl border border-forest-900/15 bg-forest-50 p-1">
          <button
            type="button"
            aria-pressed={mobile}
            onClick={() => setSize('mobile')}
            className={'min-h-10 rounded-lg whitespace-nowrap px-3 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 ' + (mobile ? 'bg-forest-900 text-white' : 'text-forest-900 hover:bg-white')}
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
        className="mt-4 w-full min-w-0 overflow-auto overscroll-contain rounded-xl border border-forest-900/10 bg-forest-50"
        style={{ height: mobile ? `min(${renderedHeight}px, 70vh)` : String(renderedHeight) + 'px' }}
      >
        <div className="relative mx-auto" style={{ width: renderedWidth + 'px', height: renderedHeight + 'px' }}>
          <iframe
            title={(mobile ? 'Mobile' : 'Desktop') + ' preview of ' + (content.country.name || 'country') + ' page'}
            srcDoc={previewDocument}
            sandbox="allow-same-origin"
            onLoad={preparePreview}
            style={{
              width: viewportWidth + 'px',
              height: viewportHeight + 'px',
              transform: `scale(${previewScale})`,
              transformOrigin: 'top left',
            }}
            className="absolute left-0 top-0 block border-0 bg-white"
          />
        </div>
        {mountTarget && createPortal(
          <CountryPreviewShell content={content} />,
          mountTarget,
        )}
      </div>
    </section>
  )

  return wide ? (
    <>
      <div ref={anchorRef} aria-hidden="true" className="hidden lg:block" />
      {createPortal(previewCard, document.body)}
    </>
  ) : previewCard
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
