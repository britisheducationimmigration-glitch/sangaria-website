import { CheckCircle2, Loader2, MessageCircle, Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'
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
      onSuccess?.()

      // 3. Automatically open WhatsApp in new tab/app with pre-filled details
      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank')
      }
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div className={cn('rounded-3xl p-8 sm:p-10 text-center', dark ? 'bg-white/10 text-white' : 'bg-forest-50 text-forest-900')}>
        <CheckCircle2 className="mx-auto size-14 text-emerald-500 animate-bounce" />
        <h3 className="mt-4 text-2xl font-extrabold">Enquiry Submitted!</h3>
        <p className={cn('mt-2 text-sm leading-relaxed max-w-md mx-auto', dark ? 'text-forest-100/80' : 'text-forest-900/70')}>
          Your details are saved. WhatsApp has been opened with your pre-filled enquiry. If it didn't open automatically, tap below:
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 text-sm font-bold text-white shadow-xl transition hover:brightness-105 active:scale-95"
        >
          <MessageCircle className="size-5 fill-white text-white" />
          Send Details on WhatsApp Now →
        </a>
      </div>
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
