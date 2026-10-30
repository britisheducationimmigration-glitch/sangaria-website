import { useState } from 'react'
import { Plane, MapPin, X, ArrowRight, MessageCircle, RotateCcw } from 'lucide-react'

export function BoardingPassGenerator() {
  const [name, setName] = useState('')
  const [origin, setOrigin] = useState('Sangaria (SNG)')
  const [customOrigin, setCustomOrigin] = useState('')
  const [dest, setDest] = useState('Toronto, Canada (YYZ)')
  const [customDest, setCustomDest] = useState('')
  const [visa, setVisa] = useState('Study Visa')
  const [customVisa, setCustomVisa] = useState('')
  const [intake, setIntake] = useState('Winter / Jan 2027')
  const [customIntake, setCustomIntake] = useState('')
  const [open, setOpen] = useState(false)

  // Resolve display values & codes
  const displayOrigin = origin === 'CUSTOM' ? (customOrigin.trim() || 'Custom City') : origin
  const orgCode = origin === 'CUSTOM' 
    ? (customOrigin.trim().slice(0, 3).toUpperCase() || 'ORG') 
    : (origin.includes('(') ? origin.split('(')[1].replace(')', '') : 'SNG')

  const displayDest = dest === 'CUSTOM' ? (customDest.trim() || 'Dream Destination') : dest
  const destCode = dest === 'CUSTOM'
    ? (customDest.trim().slice(0, 3).toUpperCase() || 'DST')
    : (dest.includes('(') ? dest.split('(')[1].replace(')', '') : 'YYZ')

  const displayVisa = visa === 'CUSTOM' ? (customVisa.trim() || 'Global Career') : visa
  const displayIntake = intake === 'CUSTOM' ? (customIntake.trim() || '2027 Intake') : intake
  const year = displayIntake.match(/202[6-9]/)?.[0] || '2027'
  const passName = name.trim().toUpperCase() || 'PASSENGER'

  const shareText = `✈️ My Future Flight Boarding Pass:\n👤 Passenger: ${passName}\n📍 Origin: ${displayOrigin}\n🌍 Destination: ${displayDest}\n🎯 Visa Goal: ${displayVisa}\n📅 Intake: ${displayIntake}\n\n🏛️ British Education & Immigration, Sangaria\n👉 Check eligibility: https://britisheducationandimmigration.com`

  const shareWA = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank')
  }
 const scrollToEnquiry = () => {
  setOpen(false)
  setTimeout(() => {
    const target = 
      document.querySelector('#enquiry-m form') || 
      document.querySelector('#enquiry form') || 
      document.getElementById('enquiry-m') || 
      document.getElementById('enquiry')

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const input = target.querySelector('input')
      input?.focus({ preventScroll: true })
    }
  }, 150)
}
  

  return (
    <section id="boarding-pass-section" className="relative overflow-hidden bg-forest-950 py-16 px-4 sm:px-6 border-y border-white/10 text-white">
      <div className="relative mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-900 border border-white/15 px-3.5 py-1 text-xs font-semibold text-coral-400 mb-3 shadow-sm">
            <Plane className="size-3.5" /> Virtual Flight Pass · Sangaria to World
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Design Your <span className="bg-gradient-to-r from-amber-300 via-amber-100 to-coral-400 bg-clip-text text-transparent">2027 Boarding Pass</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-forest-100/75">
            Fill details or type your own city below to generate your personalized international boarding pass.
          </p>
        </div>

        {/* Clean Form */}
        <div className="rounded-3xl bg-forest-900/95 border border-white/15 p-6 sm:p-8 shadow-2xl backdrop-blur">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/85 mb-1.5">Passenger Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter passenger name"
                className="w-full rounded-xl bg-forest-950 border border-white/20 px-3.5 py-2.5 text-sm font-semibold text-white placeholder-white/40 focus:outline-none focus:border-coral-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Origin City */}
              <div>
                <label className="block text-xs font-bold text-white/85 mb-1.5 flex items-center gap-1">
                  <MapPin className="size-3.5 text-coral-400" /> Origin City
                </label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full rounded-xl bg-forest-950 border border-white/20 px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-coral-400"
                >
                  <option value="Sangaria (SNG)">📍 Sangaria (SNG)</option>
                  <option value="Hanumangarh (HNM)">📍 Hanumangarh (HNM)</option>
                  <option value="Sri Ganganagar (SGNR)">📍 Sri Ganganagar (SGNR)</option>
                  <option value="Bathinda (BTI)">📍 Bathinda (BTI)</option>
                  <option value="Delhi NCR (DEL)">📍 Delhi NCR (DEL)</option>
                  <option value="Amritsar (ATQ)">📍 Amritsar (ATQ)</option>
                  <option value="CUSTOM">✏️ Other City (Type your city...)</option>
                </select>
                {origin === 'CUSTOM' && (
                  <input
                    type="text"
                    value={customOrigin}
                    onChange={(e) => setCustomOrigin(e.target.value)}
                    placeholder="Type departure city (e.g. Abohar, Sirsa)..."
                    className="mt-2 w-full rounded-xl bg-forest-950 border border-coral-400/60 px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
                  />
                )}
              </div>

              {/* Dream Destination */}
              <div>
                <label className="block text-xs font-bold text-white/85 mb-1.5 flex items-center gap-1">
                  <Plane className="size-3.5 text-coral-400" /> Dream Destination
                </label>
                <select
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                  className="w-full rounded-xl bg-forest-950 border border-white/20 px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-coral-400"
                >
                  <option value="Toronto, Canada (YYZ)">🇨🇦 Toronto, Canada (YYZ)</option>
                  <option value="Vancouver, Canada (YVR)">🇨🇦 Vancouver, Canada (YVR)</option>
                  <option value="London, UK (LHR)">🇬🇧 London, UK (LHR)</option>
                  <option value="Melbourne, Australia (MEL)">🇦🇺 Melbourne, Australia (MEL)</option>
                  <option value="Sydney, Australia (SYD)">🇦🇺 Sydney, Australia (SYD)</option>
                  <option value="New York, USA (JFK)">🇺🇸 New York, USA (JFK)</option>
                  <option value="Berlin, Germany (BER)">🇩🇪 Berlin, Germany (BER)</option>
                  <option value="Auckland, NZ (AKL)">🇳🇿 Auckland, NZ (AKL)</option>
                  <option value="CUSTOM">✏️ Other Destination (Type city...)</option>
                </select>
                {dest === 'CUSTOM' && (
                  <input
                    type="text"
                    value={customDest}
                    onChange={(e) => setCustomDest(e.target.value)}
                    placeholder="Type destination city (e.g. Calgary, Dublin)..."
                    className="mt-2 w-full rounded-xl bg-forest-950 border border-coral-400/60 px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
                  />
                )}
              </div>

              {/* Visa Category */}
              <div>
                <label className="block text-xs font-bold text-white/85 mb-1.5">Visa Category</label>
                <select
                  value={visa}
                  onChange={(e) => setVisa(e.target.value)}
                  className="w-full rounded-xl bg-forest-950 border border-white/20 px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-coral-400"
                >
                  <option value="Study Visa">🎓 Study Visa</option>
                  <option value="Permanent Residency (PR)">🏛️ Permanent Residency (PR)</option>
                  <option value="Work Permit">💼 Work Permit</option>
                  <option value="Spouse Visa">💍 Spouse Open Work Permit</option>
                  <option value="Tourist Visa">✈️ Tourist Visa</option>
                  <option value="CUSTOM">✏️ Other Visa (Type custom...)</option>
                </select>
                {visa === 'CUSTOM' && (
                  <input
                    type="text"
                    value={customVisa}
                    onChange={(e) => setCustomVisa(e.target.value)}
                    placeholder="Type your visa goal..."
                    className="mt-2 w-full rounded-xl bg-forest-950 border border-coral-400/60 px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
                  />
                )}
              </div>

              {/* Target Intake */}
              <div>
                <label className="block text-xs font-bold text-white/85 mb-1.5">Target Intake</label>
                <select
                  value={intake}
                  onChange={(e) => setIntake(e.target.value)}
                  className="w-full rounded-xl bg-forest-950 border border-white/20 px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-coral-400"
                >
                  <option value="Winter / Jan 2027">❄️ Winter / Jan 2027</option>
                  <option value="Spring / May 2027">🌸 Spring / May 2027</option>
                  <option value="Fall / Sept 2027">🍁 Fall / Sept 2027</option>
                  <option value="Winter / Jan 2028">❄️ Winter / Jan 2028</option>
                  <option value="Immediate 2026">⚡ Immediate 2026</option>
                  <option value="CUSTOM">✏️ Other Intake (Type year...)</option>
                </select>
                {intake === 'CUSTOM' && (
                  <input
                    type="text"
                    value={customIntake}
                    onChange={(e) => setCustomIntake(e.target.value)}
                    placeholder="Type intake (e.g. Fall 2027)..."
                    className="mt-2 w-full rounded-xl bg-forest-950 border border-coral-400/60 px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
                  />
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-coral-500 hover:bg-coral-600 py-3.5 px-6 text-sm font-extrabold text-white shadow-xl transition active:scale-[0.98] cursor-pointer"
              >
                <span>✨ Generate My Boarding Pass ➔</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-forest-900 border border-white/20 p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-sm font-extrabold text-white">✨ Your Boarding Pass is Ready!</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-white/70 hover:text-white transition"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Boarding Pass Ticket */}
            <div className="rounded-2xl bg-cream text-forest-950 shadow-2xl border border-forest-900/15 overflow-hidden">
              <div className="bg-forest-900 px-4 py-2.5 text-white flex items-center justify-between">
                <span className="text-xs font-black">BRITISH EDUCATION & IMMIGRATION</span>
                <span className="rounded-full bg-coral-500 px-2 py-0.5 font-mono text-[9px] font-bold uppercase">
                  OFFICIAL PASS
                </span>
              </div>

              <div className="p-4 sm:p-5 bg-[#fffdf7]">
                <div className="flex items-center justify-between pb-3 border-b border-forest-900/10">
                  <div>
                    <span className="font-mono text-[9px] font-bold text-forest-900/60 uppercase">ORIGIN</span>
                    <p className="text-3xl font-black text-forest-900 leading-none mt-0.5">{orgCode}</p>
                    <p className="text-[11px] font-semibold text-forest-900/75 mt-0.5">{displayOrigin.split('(')[0]}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-mono font-bold text-coral-600 uppercase">NON-STOP</span>
                    <div className="flex items-center gap-1.5 text-coral-500 my-1">
                      <div className="w-6 h-0.5 bg-coral-400 border-dashed" />
                      <Plane className="size-4 transform rotate-90" />
                      <div className="w-6 h-0.5 bg-coral-400 border-dashed" />
                    </div>
                    <span className="text-[9px] text-forest-900/60 font-bold">BEI · {year}</span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-[9px] font-bold text-forest-900/60 uppercase">DESTINATION</span>
                    <p className="text-3xl font-black text-forest-900 leading-none mt-0.5">{destCode}</p>
                    <p className="text-[11px] font-semibold text-forest-900/75 mt-0.5">{displayDest.split(',')[0]}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 py-3 text-xs border-b border-forest-900/10">
                  <div>
                    <span className="block text-[9px] font-mono text-forest-900/60 uppercase">Passenger</span>
                    <span className="font-bold text-forest-900 truncate block text-sm">{passName}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-forest-900/60 uppercase">Visa Goal</span>
                    <span className="font-bold text-forest-900 truncate block">{displayVisa}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-forest-900/60 uppercase">Intake</span>
                    <span className="font-bold text-forest-900 truncate block">{displayIntake}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-forest-900/60 uppercase">Flight / Seat</span>
                    <span className="font-bold text-forest-900 truncate block">BEI-{year} · 01A</span>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-[2px] h-6 opacity-80" aria-hidden>
                      {[12, 24, 8, 16, 26, 6, 20, 14, 26, 10, 22, 16, 12, 26, 8, 18, 22, 10].map((h, i) => (
                        <div key={i} className="bg-forest-950" style={{ width: i % 3 === 0 ? '2.5px' : '1.5px', height: `${h}px` }} />
                      ))}
                    </div>
                    <span className="font-mono text-[8px] text-forest-900/60 tracking-widest mt-0.5">BEI-{orgCode}-{destCode}-{year}</span>
                  </div>

                  <div className="rounded-lg border-2 border-dashed border-coral-500 bg-coral-50 px-2.5 py-1 text-center">
                    <span className="text-[9px] font-black uppercase text-coral-600 block leading-tight">VISA APPROVED</span>
                    <span className="text-[8px] font-bold text-forest-900/70 block">Sangaria Office</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Inside Popup */}
            <div className="mt-4 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={shareWA}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 px-4 text-xs font-bold text-white shadow-lg transition active:scale-[0.98] cursor-pointer"
              >
                <MessageCircle className="size-4" />
                <span>Share Pass on WhatsApp Status</span>
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 py-2.5 px-3 text-xs font-semibold text-white transition active:scale-[0.98] cursor-pointer"
              >
                <RotateCcw className="size-3.5 text-coral-400" />
                <span>Change / Edit Details</span>
              </button>

              <button
                type="button"
                onClick={scrollToEnquiry}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-coral-500 hover:bg-coral-600 py-3 px-4 text-xs font-extrabold text-white shadow-md transition active:scale-[0.98] cursor-pointer"
              >
                <span>Make This Flight Real ➔ Book Free Counselling</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
