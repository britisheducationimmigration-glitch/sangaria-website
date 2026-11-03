import { getPolicyWatchStatus, policyWatchItems } from '@/data/policy-watch'

function formattedDate(date: string, timeZone = 'Asia/Kolkata') {
  const noonUtc = new Date(`${date}T12:00:00Z`)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(noonUtc)
}

function statusStyle(status: string) {
  if (status.startsWith('Upcoming')) return 'bg-amber-100 text-amber-900'
  if (status === 'Effective') return 'bg-emerald-100 text-emerald-900'
  if (status.startsWith('Announced')) return 'bg-violet-100 text-violet-900'
  return 'bg-slate-100 text-slate-700'
}

export function PolicyWatchPanel() {
  const sorted = [...policyWatchItems].sort((left, right) =>
    (left.effectiveDate ?? '9999-12-31').localeCompare(right.effectiveDate ?? '9999-12-31'),
  )

  return (
    <section className="max-w-5xl">
      <div className="mb-6">
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-coral-600">Official source tracker</p>
        <h2 className="mt-1 text-3xl font-extrabold">Visa policy watch</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-forest-900/65">
          Confirmed changes, effective dates and items awaiting official detail. Scheduled figures switch automatically only when the authority has published an exact value and effective date. Check each linked source before advising a client.
        </p>
      </div>

      <div className="mb-5 rounded-2xl border border-forest-900/10 bg-white p-4 text-sm leading-relaxed text-forest-900/75">
        <strong className="text-forest-900">Review routine:</strong> check this list and the official sources monthly, then update the matching destination guide, fee snapshot and cashflow copy together. Proposals and planning targets stay labelled as pending; they do not replace current requirements.
      </div>

      <div className="space-y-4">
        {sorted.map((item) => {
          const status = getPolicyWatchStatus(item)
          return (
            <article key={item.id} className="rounded-2xl bg-white p-5 ring-1 ring-forest-900/10 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-coral-600">{item.destination}</p>
                  <h3 className="mt-1 text-lg font-extrabold text-forest-900">{item.title}</h3>
                </div>
                <span className={`inline-flex min-h-8 shrink-0 items-center rounded-full px-3 py-1 text-xs font-bold ${statusStyle(status)}`}>
                  {status}
                </span>
              </div>
              {item.effectiveDate && (
                <p className="mt-3 text-xs font-semibold text-forest-900/65">
                  Effective date: {formattedDate(item.effectiveDate, item.timeZone)}
                </p>
              )}
              <p className="mt-3 text-sm leading-relaxed text-forest-900/75">{item.summary}</p>
              <p className="mt-3 rounded-xl bg-cream p-3 text-sm leading-relaxed text-forest-900/75">
                <strong>Action:</strong> {item.action}
              </p>
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-coral-600 underline underline-offset-2 hover:text-coral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500"
              >
                {item.sourceLabel}<span aria-hidden="true">↗</span>
              </a>
            </article>
          )
        })}
      </div>
    </section>
  )
}
