import { CheckCircle2, Loader2, MessageCircle, Send, Check } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useLoaderData } from '@tanstack/react-router'
import { countries as fixtureCountries, visaServices } from '@/data/fixtures'
import { site } from '@/data/site'
import { cn } from '@/lib/utils'
import { submitEnquiry } from '@/lib/public-functions'

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
  summary?: string
  dark?: boolean
  compact?: boolean
  onSuccess?: () => void
}) {
  const rootData = useLoaderData({ from: '__root__' })
  const countryOptions = rootData?.countries ?? fixtureCountries
  const settings = rootData?.settings

  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [showSharePrompt, setShowSharePrompt] = useState(false)

  // Live validation states
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry ?? '')
  const [otherCountry, setOtherCountry] = useState('')

  useEffect(() => {
    setSelectedCountry(defaultCountry ?? '')
    setOtherCountry('')
  }, [defaultCountry])

  const isPhoneValid = /^[6-9]\d{9}$/.test(phone.replace(/\D/g, '')) || phone.replace(/\D/g, '').length === 10
  const isNameValid = name.trim().length >= 2
  const isEmailValid = !email || /^\S+@\S+\.\S+$/.test(email.trim())

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

    const submittedName = String(data.get('name') ?? '').trim()
    const submittedPhone = String(data.get('phone') ?? '').trim()
    const submittedEmail = String(data.get('email') ?? '').trim()
    const city = String(data.get('city') ?? '').trim()
    const interest = String(data.get('interest') ?? '').trim()
    const rawCountry = String(data.get('country') ?? '').trim()
    const country = rawCountry === 'Other' ? (otherCountry.trim() || 'Other') : rawCountry
    const message = String(data.get('message') ?? '').trim()
    const preferredDemoDate = source === 'coaching' ? String(data.get('preferredDemoDate') ?? '').trim() : ''
    const preferredDemoTime = source === 'coaching' ? String(data.get('preferredDemoTime') ?? '').trim() : ''
    const enquirySummary = [
      summary ?? '',
      preferredDemoDate ? 'Preferred demo date: ' + preferredDemoDate : '',
      preferredDemoTime ? 'Preferred demo time: ' + preferredDemoTime : '',
    ].filter(Boolean).join('\n')

    const textLines = [
      '🎓 *New Website Enquiry - British Education & Immigration*',
      '',
      `👤 *Name:* ${submittedName || 'N/A'}`,
      `📞 *Phone:* ${submittedPhone || 'N/A'}`,
      submittedEmail ? `📧 *Email:* ${submittedEmail}` : '',
      city ? `📍 *City:* ${city}` : '',
      interest ? `🎯 *Interest:* ${interest}` : '',
      country ? `🌍 *Preferred Country:* ${country}` : '',
      message ? `💬 *Message:* ${message}` : '',
      enquirySummary ? `📋 *Details:* ${enquirySummary}` : '',
      '',
      'Please guide me further. Thank you!',
    ].filter(Boolean).join('\n')

    const rawDigits = (settings?.phones[1] || settings?.phones[0] || site.whatsapp)
      .replace(/\D/g, '')
      .replace(/^0+/, '')
    const waPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits
    const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(textLines)}`
    setWhatsappUrl(waUrl)

    try {
      await submitEnquiry({
        data: {
          name: submittedName,
          phone: submittedPhone,
          email: submittedEmail,
          city,
          interest,
          country,
          message,
          source,
          summary: enquirySummary,
          botField: String(data.get('bot-field') ?? '').trim(),
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
            Your details are saved. Our expert counsellor will contact you soon.
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
                Enquiry submitted successfully!
              </h3>
              <p id={`${source}-enquiry-confirmation-description`} className="mt-2 text-sm leading-relaxed text-forest-900/70">
                Your details are saved in our portal. Would you also like to share this enquiry on WhatsApp for priority response?
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
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105 active:scale-[0.98]"
                >
                  <MessageCircle className="size-5" />
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setShowSharePrompt(false)
                    onSuccess?.()
                  }}
                  className="min-h-12 rounded-full border border-forest-900/15 bg-forest-50 px-5 py-3 text-sm font-bold text-forest-900 transition hover:bg-forest-100 active:scale-[0.98]"
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
          <div className="flex items-center justify-between">
            <label className={labelCls} htmlFor={`${source}-name`}>Full name *</label>
            {isNameValid && <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-0.5">✓ Ready</span>}
          </div>
          <div className="relative">
            <input
              id={`${source}-name`}
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field pr-9"
              placeholder="Your name"
            />
            {isNameValid && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none">
                <Check className="size-4" strokeWidth={3} />
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className={labelCls} htmlFor={`${source}-phone`}>Phone / WhatsApp *</label>
            {isPhoneValid && <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-0.5">✓ 10 Digits</span>}
          </div>
          <div className="relative">
            <input
              id={`${source}-phone`}
              name="phone"
              required
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              pattern="[0-9+\s-]{10,15}"
              className={cn('field pr-9 transition-colors', isPhoneValid && 'border-emerald-500/60 focus:border-emerald-500')}
              placeholder="10-digit mobile"
            />
            {isPhoneValid && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-emerald-500 text-white p-0.5 pointer-events-none">
                <Check className="size-3" strokeWidth={3} />
              </span>
            )}
          </div>
        </div>
      </div>

      {!compact && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <label className={labelCls} htmlFor={`${source}-email`}>Email</label>
              {email && isEmailValid && <span className="text-[11px] font-bold text-emerald-500">✓ Valid</span>}
            </div>
            <input
              id={`${source}-email`}
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
              placeholder="you@example.com"
            />
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
          <select
            id={`${source}-country`}
            name="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="field"
          >
            <option value="">Not decided yet</option>
            {countryOptions.map((c) => (
              <option key={c.slug} value={c.name}>{c.name}</option>
            ))}
            <option value="Other">Other</option>
          </select>
          {selectedCountry === 'Other' && (
            <input
              type="text"
              maxLength={120}
              value={otherCountry}
              onChange={(e) => setOtherCountry(e.target.value)}
              placeholder="Type country name (e.g. Ireland, Singapore)"
              aria-label="Other preferred country"
              className="field mt-2"
            />
          )}
        </div>
      </div>

      {source === 'coaching' && (
        <fieldset className={cn('rounded-2xl border p-4', dark ? 'border-white/15 bg-white/5' : 'border-forest-900/10 bg-forest-50')}>
          <legend className={cn('px-1 text-sm font-bold', dark ? 'text-white' : 'text-forest-900')}>Preferred free demo slot</legend>
          <p className={cn('mb-3 text-xs', dark ? 'text-forest-100/70' : 'text-forest-900/60')}>Choose a date and time window. Our team will confirm availability.</p>
          <div className={cn('grid gap-3', !compact && 'sm:grid-cols-2')}>
            <div>
              <label className={labelCls} htmlFor={`${source}-demo-date`}>Preferred date (optional)</label>
              <input id={`${source}-demo-date`} name="preferredDemoDate" type="date" min={new Date().toISOString().slice(0, 10)} className="field" />
            </div>
            <div>
              <label className={labelCls} htmlFor={`${source}-demo-time`}>Time window</label>
              <select id={`${source}-demo-time`} name="preferredDemoTime" defaultValue="Flexible" className="field">
                <option>Flexible</option>
                <option>9:30 AM – 12:30 PM</option>
                <option>4:00 PM – 7:30 PM</option>
              </select>
            </div>
          </div>
        </fieldset>
      )}

      <div>
        <label className={labelCls} htmlFor={`${source}-message`}>Message</label>
        <textarea id={`${source}-message`} name="message" rows={compact ? 2 : 4} className="field resize-none" placeholder="Tell us about your education, test scores or travel plans" />
      </div>

      {state === 'error' && <p className="text-sm font-semibold text-coral-600">Couldn’t send right now — please call or WhatsApp us.</p>}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="group flex items-center justify-center gap-2 rounded-full bg-coral-500 px-7 py-4 font-bold text-white shadow-[4px_4px_0_0] shadow-forest-950 transition hover:-translate-y-0.5 disabled:opacity-70 cursor-pointer active:scale-95"
      >
        {state === 'sending' ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-4 transition group-hover:translate-x-1" />}
        {state === 'sending' ? 'Sending…' : source === 'coaching' ? 'Request demo class' : 'Send enquiry'}
      </button>
    </form>
  )
}
