import { useEffect, useRef, useState } from 'react'
import { ExternalLink, Wallet } from 'lucide-react'

const loanEligibilityUrl = 'https://www.gyandhan.com/loaneligs?campaign_partner=British+Education+Immigration'
const scholarshipUrl = 'https://www.gyandhan.com/scholarships/apply/new?scholarship_id=gd-scholarship&campaign_partner=British+Education+Immigration'
const widgetScriptUrl = 'https://www.gyandhan.com/loan-eligibility-widget.js'

export function GyanDhanLoanSection({ countryName }: { countryName: string }) {
  const [widgetRequested, setWidgetRequested] = useState(false)
  const [widgetStatus, setWidgetStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const widgetMountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!widgetRequested || !widgetMountRef.current) return

    setWidgetStatus('loading')
    const script = document.createElement('script')
    script.async = true
    script.src = widgetScriptUrl
    script.onload = () => setWidgetStatus('ready')
    script.onerror = () => setWidgetStatus('error')
    document.body.appendChild(script)

    return () => {
      script.onload = null
      script.onerror = null
    }
  }, [widgetRequested])

  return (
    <section id="loan-eligibility" aria-labelledby="loan-eligibility-title" className="scroll-mt-28 mt-10 rounded-[2rem] bg-white p-5 ring-1 ring-forest-900/10 sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-coral-600">Optional funding resource · {countryName}</p>
          <h2 id="loan-eligibility-title" className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-forest-900 sm:text-3xl">
            <Wallet aria-hidden="true" className="size-6 shrink-0 text-coral-600" /> Education loan options
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-forest-900/70">Check possible education-loan eligibility through GyanDhan, or explore its scholarship application separately.</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <a href={loanEligibilityUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-coral-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-coral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500">
              Open loan page <ExternalLink aria-hidden="true" className="size-4" />
            </a>
            <a href={scholarshipUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-forest-900/15 bg-white px-4 py-3 text-sm font-bold text-forest-900 transition hover:bg-forest-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-900">
              Explore scholarships <ExternalLink aria-hidden="true" className="size-4" />
            </a>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-forest-900/55">GyanDhan is an external partner. If you submit its form, the information you provide is handled under GyanDhan’s privacy policy and may be shared with lending partners. Eligibility is indicative; it does not guarantee a loan or final terms. <a href="https://www.gyandhan.com/Privacy-Policy.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2 hover:text-coral-700">Read its privacy policy</a>.</p>
        </div>

        <div className="min-w-0 rounded-2xl bg-cream p-4 sm:p-5">
          <h3 className="text-base font-extrabold text-forest-900">Loan eligibility form</h3>
          <p className="mt-1 text-sm leading-relaxed text-forest-900/65">The partner form loads only when you choose to open it.</p>
          {!widgetRequested ? (
            <button type="button" onClick={() => setWidgetRequested(true)} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-forest-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-forest-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-900">
              Load GyanDhan form <ExternalLink aria-hidden="true" className="size-4" />
            </button>
          ) : (
            <>
              {widgetStatus === 'loading' && <p role="status" className="mt-3 text-sm font-semibold text-forest-800">Loading the partner form…</p>}
              {widgetStatus === 'error' && <p role="status" className="mt-3 text-sm font-semibold text-coral-700">The embedded form could not load. Use “Open loan page” to continue on GyanDhan.</p>}
              <div ref={widgetMountRef} id="gyandhan-loan-eligibility" data-gyandhan-le-widget data-campaign-partner="British Education Immigration" className="mt-3 min-h-12 w-full" />
            </>
          )}
        </div>
      </div>
    </section>
  )
}
