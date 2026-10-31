import { useState, useEffect } from 'react'
import { defaultCashflowData, CountryCashflow } from '@/data/cashflow'
import { getPublicCashflow } from '@/lib/public-functions'

export function FamilyCashflowPlanner() {
  const [data, setData] = useState<CountryCashflow[]>(defaultCashflowData)
  const [selectedSlug, setSelectedSlug] = useState('canada')

  useEffect(() => {
    let active = true
    void getPublicCashflow()
      .then((saved) => {
        if (active && Array.isArray(saved) && saved.length > 0) setData(saved)
      })
      .catch(() => {
        // Keep the bundled cashflow.ts defaults when the database is unavailable.
      })
    return () => {
      active = false
    }
  }, [])

  const country = data.find((c) => c.slug === selectedSlug) || data[0]

  // 1. Sirf selected country ka budget print hoga, poori website nahi
  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank', 'width=850,height=900')
    if (!printWindow) {
      alert('Please allow popups to print/download the summary.')
      return
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${country.name} Cashflow Budget - British Education Sangaria</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #081c15; margin: 0; padding: 20px; font-size: 13px; line-height: 1.4; }
            .header { border-bottom: 2px solid #e11d48; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
            .brand-title { font-size: 20px; font-weight: 800; color: #081c15; margin: 0; text-transform: uppercase; }
            .brand-sub { font-size: 11px; color: #555; margin-top: 4px; }
            .country-badge { background: #081c15; color: white; padding: 6px 14px; border-radius: 9999px; font-weight: 800; font-size: 14px; display: inline-block; margin-bottom: 12px; }
            .summary-box { background: #fdf2f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 12px 16px; margin-bottom: 18px; }
            .total-val { font-size: 22px; font-weight: 900; color: #e11d48; margin-top: 2px; }
            .rule-note { font-size: 11px; color: #4b5563; margin-top: 6px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: #081c15; color: white; text-align: left; padding: 8px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
            td { padding: 10px 8px; border-bottom: 1px solid #e5e7eb; font-size: 11.5px; vertical-align: top; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .stage-badge { font-weight: 800; color: #e11d48; font-size: 13px; }
            .amount { font-weight: 800; font-size: 13px; color: #081c15; }
            .refund { color: #047857; font-weight: 700; font-size: 10.5px; }
            .footer { margin-top: 25px; border-top: 1px solid #e5e7eb; padding-top: 12px; font-size: 10.5px; color: #6b7280; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="brand-title">British Education & Immigration</h1>
              <div class="brand-sub">Near Open Book Library, Bhagatpura Road, Sangaria (Rajasthan) · Phone: +91 9772570478</div>
            </div>
            <div style="text-align: right; font-size: 11px; color: #666;">
              Official Session 2026/2027<br>
              Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>

          <div class="country-badge">${country.flag} ${country.name} Study Visa — Family Cashflow Roadmap</div>
          
          <div class="summary-box">
            <span style="font-size: 10px; font-weight: 700; color: #e11d48; text-transform: uppercase; letter-spacing: 0.05em;">Estimated 1st-year planning total</span>
            <div class="total-val">${country.totalEstimateINR}</div>
            <div class="rule-note"><strong>Visa and budget guidance:</strong> ${country.officialRuleNote}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 16%;">Stage & Time</th>
                <th style="width: 32%;">Expense Title & Detail</th>
                <th style="width: 24%;">Approx. Budget Amount (INR / Forex)</th>
                <th style="width: 28%;">Paid Directly To & Refund</th>
              </tr>
            </thead>
            <tbody>
              ${country.stages.map((st) => `
                <tr>
                  <td><span class="stage-badge">Stage 0${st.stageNumber}</span><br><span style="color:#666; font-size:10px;">${st.timeline}</span></td>
                  <td><strong>${st.title}</strong><br><span style="color:#555; font-size:10.5px;">${st.description}</span></td>
                  <td><span class="amount">${st.inrEstimate}</span><br><span style="color:#e11d48; font-size:10px; font-weight:700;">${st.officialCost}</span></td>
                  <td><strong>${st.paidTo}</strong><br><span class="refund">✓ ${st.refundableInfo}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Transparency Notice: Student pays fees directly to college/embassy accounts. Zero hidden charges. For counselling: +91 9772570478.</p>
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `
    printWindow.document.open()
    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  // 2. WhatsApp share - user apne phone se kisi ko bhi share kar sakega aur niche aapka number 9772570478 rahega
  const handleWhatsAppShare = () => {
    let msg = `✈️ *British Education & Immigration, Sangaria*\n`
    msg += `📋 *Family Visa Budget & Cashflow Planner*\n\n`
    msg += `🌍 *Destination Country:* ${country.name} ${country.flag}\n`
    msg += `💰 *Estimated planning total:* ${country.totalEstimateINR}\n`
    msg += `📌 *Visa and budget guidance:* ${country.officialRuleNote}\n\n`
    msg += `--- *STAGE-BY-STAGE EXPENSES* ---\n`
    country.stages.forEach((st) => {
      msg += `\n*Stage 0${st.stageNumber}: ${st.title}*\n`
      msg += `⏱️ When: ${st.timeline}\n`
      msg += `💵 Approx: ${st.inrEstimate} (${st.officialCost})\n`
      msg += `🏛️ Paid to: ${st.paidTo}\n`
      msg += `🛡️ Refund: ${st.refundableInfo}\n`
    })
    msg += `\n📞 *Office Contact / WhatsApp:* +91 9772570478\n`
    msg += `📍 Near Open Book Library, Bhagatpura Road, Sangaria (Raj.)\n`
    msg += `👉 Website: https://britisheducationandimmigration.com`

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <section className="mt-8 rounded-3xl bg-forest-900 p-5 text-white sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-coral-400">
            Transparent Financial Roadmap
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Family Cashflow Planner
          </h2>
          <p className="text-xs sm:text-sm text-forest-100/70 mt-1 max-w-xl">
            Estimated payment stages plus any funds you may need to show. Totals are planning estimates.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white ring-1 ring-white/15 hover:bg-white/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>📄</span>
            <span>Summary</span>
          </button>
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="rounded-full bg-[#25D366] px-4 py-1.5 text-xs font-bold text-white hover:brightness-105 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>💬</span>
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

    {/* Country Select Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
        {data.map((c) => {
          const isActive = c.slug === selectedSlug
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => setSelectedSlug(c.slug)}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                isActive
                  ? 'bg-coral-500 text-white shadow-md'
                  : 'bg-white/10 text-white/80 ring-1 ring-white/10 hover:bg-white/20'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          )
        })}
      </div>

      {/* Country Summary Bar */}
      <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-coral-400 font-bold">Estimated First-year Budget</p>
          <p className="text-xl sm:text-2xl font-black text-white">{country.totalEstimateINR}</p>
        </div>
        <p className="text-xs text-forest-100/80 sm:max-w-md leading-relaxed border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-4 pt-2 sm:pt-0">
          💡 {country.officialRuleNote}
        </p>
      </div>

      {country.officialSources?.length ? (
        <div className="-mt-2 mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
          <span className="font-bold text-coral-300">Official sources:</span>
          {country.officialSources.map((source) => (
            <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="text-white/75 underline decoration-white/30 underline-offset-2 hover:text-white">
              {source.label}
            </a>
          ))}
        </div>
      ) : null}

      {/* 2x2 Grid for Mobile (matching What We Do & Destinations size) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {country.stages.map((st) => (
          <div
            key={st.stageNumber}
            className="rounded-2xl bg-white/10 p-3.5 sm:p-4 ring-1 ring-white/10 flex flex-col justify-between hover:bg-white/15 transition"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="font-mono text-xs font-extrabold text-coral-400">
                  0{st.stageNumber}
                </span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                  {st.timeline}
                </span>
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-white line-clamp-2 leading-tight">
                {st.title}
              </h3>
              <p className="text-[11px] text-forest-100/60 mt-1 line-clamp-2">
                Paid to: {st.paidTo}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-white/10">
              <p className="text-xs sm:text-sm font-black text-coral-300">
                {st.inrEstimate}
              </p>
              <p className="text-[10px] text-white/50 font-mono mt-0.5">
                {st.officialCost}
              </p>
              <p className="text-[9px] text-emerald-400 mt-1 line-clamp-1">
                ✓ {st.refundableInfo}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FamilyCashflowPlanner
