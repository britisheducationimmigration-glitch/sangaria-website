import { CheckCircle2, Loader2, MessageCircle, Send } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { countries, visaServices } from '@/data/fixtures'
import { cn } from '@/lib/utils'
import { submitEnquiry } from '@/lib/public-functions'

/**
 * The single enquiry form used across the site. Submissions are validated by the
 * managed server function and saved to the project database.
 */
export function EnquiryForm({
  source,
  defaultInterest,
  defaultCountry,
  summary,
  dark = false,
  compact = false,
  onSuccess,
}: {
  source: string
  defaultInterest?: string
  defaultCountry?: string
  /** Extra context attached to the enquiry, e.g. an eligibility result */
  summary?: string
  dark?: boolean
  compact?: boolean
  onSuccess?: () => void
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [showSharePrompt, setShowSharePrompt] = useState(false)

  useEffect(() => {
    if (state !== 'done' || !showSharePrompt) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowSharePrompt(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [state, showSharePrompt])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('sending')
    const data = new FormData(e.currentTarget)

    const name = String(data.get('name') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const city = String(data.get('city') ?? '').trim()
    const interest = String(data.get('interest') ?? '').trim()
    const country = String(data.get('country') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    // 1. Build Pre-filled WhatsApp Message
    const textLines = [
      '🎓 *New Website Enquiry - British Education & Immigration*',
      '',
      `👤 *Name:* ${name || 'N/A'}`,
      `📞 *Phone:* ${phone || 'N/A'}`,
      email ? `📧 *Email:* ${email}` : '',
      city ? `📍 *City:* ${city}` : '',
      interest ? `🎯 *Interest:* ${interest}` : '',
      country ? `🌍 *Preferred Country:* ${country}` : '',
      message ? `💬 *Message:* ${message}` : '',
      summary ? `📋 *Details:* ${summary}` : '',
      '',
      'Please guide me further. Thank you!',
    ].filter(Boolean).join('\n')

    const waUrl = `https://wa.me/919772570478?text=${encodeURIComponent(textLines)}`
    setWhatsappUrl(waUrl)

    try {
      // 2. Save in Database & Admin Panel
      await submitEnquiry({
        data: {
          name,
          phone,
          email,
          city,
          interest,
          country,
          message,
          source,
          summary: summary ?? '',
        },
      })

      setState('done')
      setShowSharePrompt(true)
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <>
        <div className={cn('rounded-3xl p-8 sm:p-10 text-center', dark ? 'bg-white/10 text-white' : 'bg-forest-50 text-forest-900')}>
          <CheckCircle2 className="mx-auto size-14 text-emerald-500" />
          <h3 className="mt-4 text-2xl font-extrabold">Enquiry Submitted!</h3>
          <p className={cn('mt-2 text-sm leading-relaxed max-w-md mx-auto', dark ? 'text-forest-100/80' : 'text-forest-900/70')}>
            Your details are saved. Our team will contact you soon.
          </p>
        </div>

        {showSharePrompt && (
          <div
            className="fixed inset-0 z-[100] grid place-items-center bg-forest-950/70 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${source}-enquiry-confirmation-title`}
            aria-describedby={`${source}-enquiry-confirmation-description`}
            onKeyDown={(event) => {
              if (event.key === 'Escape') setShowSharePrompt(false)
            }}
          >
            <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center text-forest-900 shadow-2xl sm:p-8">
              <CheckCircle2 className="mx-auto size-12 text-emerald-600" />
              <h3 id={`${source}-enquiry-confirmation-title`} className="mt-4 text-2xl font-extrabold">
                Enquiry submitted successfully
              </h3>
              <p id={`${source}-enquiry-confirmation-description`} className="mt-2 text-sm leading-relaxed text-forest-900/70">
                Your details are saved. Would you also like to share this pre-filled enquiry with us on WhatsApp?
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    setShowSharePrompt(false)
                    onSuccess?.()
                  }}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-900 active:scale-[0.98]"
                >
                  <MessageCircle className="size-5" />
                  Share on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setShowSharePrompt(false)
                    onSuccess?.()
                  }}
                  className="min-h-12 rounded-full border border-forest-900/15 bg-forest-50 px-5 py-3 text-sm font-bold text-forest-900 transition hover:bg-forest-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-900 active:scale-[0.98]"
                >
                  No thanks
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  const labelCls = cn('label', dark && '!text-forest-100/70')
  return (
    <form name="enquiry" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={onSubmit} className="grid gap-4">
      <input type="hidden" name="form-name" value="enquiry" />
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="summary" value={summary ?? ''} />
      <p className="hidden">
        <label>
          Don’t fill this out: <input name="bot-field" />
        </label>
      </p>
      <div className={cn('grid gap-4', !compact && 'sm:grid-cols-2')}>
        <div>
          <label className={labelCls} htmlFor={`${source}-name`}>Full name *</label>
          <input id={`${source}-name`} name="name" required className="field" placeholder="Your name" />
        </div>
        <div>
          <label className={labelCls} htmlFor={`${source}-phone`}>Phone / WhatsApp *</label>
          <input id={`${source}-phone`} name="phone" required type="tel" pattern="[0-9+\s-]{10,15}" className="field" placeholder="10-digit mobile" />
        </div>
      </div>
      {!compact && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor={`${source}-email`}>Email</label>
            <input id={`${source}-email`} name="email" type="email" className="field" placeholder="you@example.com" />
          </div>
          <div>
            <label className={labelCls} htmlFor={`${source}-city`}>City</label>
            <input id={`${source}-city`} name="city" className="field" placeholder="e.g. Sangaria" />
          </div>
        </div>
      )}
      <div className={cn('grid gap-4', !compact && 'sm:grid-cols-2')}>
        <div>
          <label className={labelCls} htmlFor={`${source}-interest`}>I’m interested in</label>
          <select id={`${source}-interest`} name="interest" defaultValue={defaultInterest ?? ''} className="field">
            <option value="">Select a service</option>
            {visaServices.map((s) => (
              <option key={s.slug}>{s.title}</option>
            ))}
            <option>IELTS Coaching</option>
            <option>PTE Coaching</option>
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor={`${source}-country`}>Preferred country</label>
          <select id={`${source}-country`} name="country" defaultValue={defaultCountry ?? ''} className="field">
            <option value="">Not decided yet</option>
            {countries.map((c) => (
              <option key={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls} htmlFor={`${source}-message`}>Message</label>
        <textarea id={`${source}-message`} name="message" rows={compact ? 2 : 4} className="field resize-none" placeholder="Tell us about your education, test scores or travel plans" />
      </div>
      {state === 'error' && <p className="text-sm font-semibold text-coral-600">Couldn’t send right now — please call or WhatsApp us.</p>}
      <button
        type="submit"
        disabled={state === 'sending'}
        className="group flex items-center justify-center gap-2 rounded-full bg-coral-500 px-7 py-4 font-bold text-white shadow-[4px_4px_0_0] shadow-forest-950 transition hover:-translate-y-0.5 disabled:opacity-70"
      >
        {state === 'sending' ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-4 transition group-hover:translate-x-1" />}
        {state === 'sending' ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  )
}
