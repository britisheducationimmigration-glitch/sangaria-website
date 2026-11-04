import { useState, type SyntheticEvent } from 'react'
import { createPortal } from 'react-dom'
import { CountryPageView } from '@/components/CountryPageView'
import type { Country } from '@/data/fixtures'
import type { VisaGuidance } from '@/data/visa-guidance'

const previewDocument = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Country page preview</title></head><body style="margin:0"><div id="country-page-preview-root"></div></body></html>'

type PreviewSize = 'mobile' | 'desktop'

export function CountryPagePreview({ content }: {
  content: { country: Country; guidance: VisaGuidance }
}) {
  const [size, setSize] = useState<PreviewSize>('mobile')
  const [mountTarget, setMountTarget] = useState<HTMLElement | null>(null)

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

  const mobile = size === 'mobile'

  return (
    <section className="rounded-2xl border border-forest-900/15 bg-white p-4 shadow-sm sm:p-5">
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
      <div className="mt-4 overflow-x-auto rounded-xl border border-forest-900/10 bg-forest-50 p-2 sm:p-3">
        <iframe
          title={(mobile ? 'Mobile' : 'Desktop') + ' preview of ' + (content.country.name || 'country') + ' page'}
          srcDoc={previewDocument}
          sandbox="allow-same-origin"
          onLoad={preparePreview}
          style={{ width: mobile ? '390px' : '1024px', maxWidth: mobile ? '100%' : undefined, height: '720px' }}
          className={'block border-0 bg-white ' + (mobile ? 'mx-auto' : '')}
        />
        {mountTarget && createPortal(
          <main className="public-main">
            <CountryPageView country={content.country} guidance={content.guidance} preview />
          </main>,
          mountTarget,
        )}
      </div>
    </section>
  )
}
