import { useState, useId } from 'react'
import { Plane, MapPin, Check, X, RotateCcw, ArrowRight, MessageCircle } from 'lucide-react'

interface CityOption {
  code: string
  name: string
  label: string
}

const origins: CityOption[] = [
  { code: 'SNG', name: 'Sangaria', label: '📍 Sangaria (SNG)' },
  { code: 'HNM', name: 'Hanumangarh', label: '📍 Hanumangarh (HNM)' },
  { code: 'SGNR', name: 'Sri Ganganagar', label: '📍 Sri Ganganagar (SGNR)' },
  { code: 'BTI', name: 'Bathinda', label: '📍 Bathinda (BTI)' },
  { code: 'DEL', name: 'Delhi NCR', label: '📍 Delhi (DEL)' },
  { code: 'ATQ', name: 'Amritsar', label: '📍 Amritsar (ATQ)' },
  { code: 'CUSTOM', name: 'Other', label: '✏️ Other City (Type custom)' },
]

const destinations: CityOption[] = [
  { code: 'YYZ', name: 'Toronto', label: '🇨🇦 Toronto, Canada (YYZ)' },
  { code: 'YVR', name: 'Vancouver', label: '🇨🇦 Vancouver, Canada (YVR)' },
  { code: 'LHR', name: 'London', label: '🇬🇧 London, UK (LHR)' },
  { code: 'MEL', name: 'Melbourne', label: '🇦🇺 Melbourne, Australia (MEL)' },
  { code: 'SYD', name: 'Sydney', label: '🇦🇺 Sydney, Australia (SYD)' },
  { code: 'JFK', name: 'New York', label: '🇺🇸 New York, USA (JFK)' },
  { code: 'BER', name: 'Berlin', label: '🇩🇪 Berlin, Germany (BER)' },
  { code: 'AKL', name: 'Auckland', label: '🇳🇿 Auckland, NZ (AKL)' },
  { code: 'CUSTOM', name: 'Other', label: '✏️ Other Destination (Type custom)' },
]

const goals = [
  '🎓 Study Permit (Diploma / Degree)',
  '💼 Post-Graduation Work Permit',
  '🏛️ Permanent Residency (PR)',
  '💍 Spouse Open Work Permit',
  '✈️ Tourist / Visitor Visa',
  '📚 IELTS / PTE Target Score',
  '✏️ Other Goal (Type custom goal)',
]

const intakes = [
  '❄️ Winter / Jan 2027 (Recommended)',
  '🌸 Spring / May 2027',
  '🍁 Fall / Sept 2027 (Major Intake)',
  '❄️ Winter / Jan 2028',
  '⚡ Immediate 2026 Intake',
  '✏️ Other Intake / Year',
]

export function BoardingPassGenerator() {
  const [passengerName, setPassengerName] = useState('Somveer')
  const [selectedOrigin, setSelectedOrigin] = useState('SNG')
  const [customOrigin, setCustomOrigin] = useState('')
  const [selectedDest, setSelectedDest] = useState('YYZ')
  const [customDest, setCustomDest] = useState('')
  const [selectedGoal, setSelectedGoal] = useState(goals[0])
  const [customGoal, setCustomGoal] = useState('')
  const [selectedIntake, setSelectedIntake] = useState(intakes[0])
  const [customIntake, setCustomIntake] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const nameId = useId()
  const originId = useId()
  const destId = useId()
  const goalId = useId()
  const intakeId = useId()

  const originObj = origins.find((o) => o.code === selectedOrigin)
  const originCity = selectedOrigin === 'CUSTOM' ? (customOrigin || 'Your City') : (originObj?.name || 'Sangaria')
  const originCode = selectedOrigin === 'CUSTOM' ? (customOrigin.slice(0, 3).toUpperCase() || 'ORG') : selectedOrigin

  const destObj = destinations.find((d) => d.code === selectedDest)
  const destCity = selectedDest === 'CUSTOM' ? (customDest || 'Dream Destination') : (destObj?.name || 'Toronto')
  const destCode = selectedDest === 'CUSTOM' ? (customDest.slice(0, 3).toUpperCase() || 'DST') : selectedDest

  const displayGoal = selectedGoal.startsWith('✏️') ? (customGoal || 'Global Career') : selectedGoal.replace(/^[^a-zA-Z0-9]+/, '').trim()
  const displayIntake = selectedIntake.startsWith('✏️') ? (customIntake || '2027 Intake') : selectedIntake.replace(/^[^a-zA-Z0-9]+/, '').trim()

  const intakeYearMatch = displayIntake.match(/202[6-9]/)
  const ticketYear = intakeYearMatch ? intakeYearMatch[0] : '2027'

  const displayName = passengerName.trim() || 'PASSENGER'

  const shareText = `✈️ My Future Flight Boarding Pass:\n👤 Passenger: ${displayName}\n📍 Departure: ${originCity} (${originCode})\n🌍 Destination: ${destCity} (${destCode})\n🎯 Visa Goal: ${displayGoal}\n📅 Intake: ${displayIntake}\n\n🏛️ Assisted by British Education & Immigration, Sangaria (Rajasthan)\n👉 Check your visa eligibility: https://britisheducationandimmigration.com`

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
  }

  const handleCopyDetails = () => {
    navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleScrollToEnquiry = () => {
    setShowModal(false)
    setTimeout(() => {
      const el = document.getElementById('enquiry-m') || document.getElementById('enquiry')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }, 150)
  }

  return (
    <section id="boarding-pass-section" className="relative overflow-hidden bg-forest-950 py-16 px-4 sm:px-6 lg:px-8 border-y border-white/10 text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-coral-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-3xl">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-forest-900 border border-white/15 px-4 py-1.5 text-xs font-semibold text-coral-400 mb-3 shadow-sm">
            <Plane className="size-3.5" />
            <span>Virtual Flight Pass · Sangaria to World</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Design Your <span className="bg-gradient-to-r from-amber-300 via-amber-100 to-coral-400 bg-clip-text text-transparent">2027 Flight Boarding Pass</span>
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-forest-100/75 leading-relaxed">
            Fill in your dream destination and intake year. Click below to generate and view your personalized flight ticket!
          </p>
        </div>

        <div className="rounded-3xl bg-forest-900/95 border border-white/15 p-6 sm:p-8 shadow-2xl backdrop-blur">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor={nameId} className="block text-xs font-bold text-white/85 mb-1.5">
                Passenger Name
              </label>
              <input
                id={nameId}
                type="text"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                placeholder="Enter name (e.g. Somveer)"
                className="w-full rounded-xl bg-forest-950 border border-white/20 px-4 py-3 text-sm font-semibold text-white placeholder-white/40 focus:outline-none focus:border-coral-400 shadow-inner"
              />
            </div>

            <div>
              <label htmlFor={originId} className="block text-xs font-bold text-white/85 mb-1.5 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-coral-400" /> Departure City (Origin)
              </label>
              <select
                id={originId}
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="w-full rounded-xl bg-forest-950 border border-white/20 px-3.5 py-3 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-coral-400"
              >
                {origins.map((o) => (
                  <option key={o.code} value={o.code} className="bg-forest-950 text-white">
                    {o.label}
                  </option>
                ))}
              </select>
              {selectedOrigin === 'CUSTOM' && (
                <input
                  type="text"
                  value={customOrigin}
                  onChange={(e) => setCustomOrigin(e.target.value)}
                  placeholder="Type departure city..."
                  className="mt-2 w-full rounded-xl bg-forest-950 border border-coral-400/60 px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
                />
              )}
            </div>

            <div>
              <label htmlFor={destId} className="block text-xs font-bold text-white/85 mb-1.5 flex items-center gap-1.5">
                <Plane className="size-3.5 text-coral-400" /> Dream Destination (Arrival)
              </label>
              <select
                id={destId}
                value={selectedDest}
                onChange={(e) => setSelectedDest(e.target.value)}
                className="w-full rounded-xl bg-forest-950 border border-white/20 px-3.5 py-3 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-coral-400"
              >
                {destinations.map((d) => (
                  <option key={d.code} value={d.code} className="bg-forest-950 text-white">
                    {d.label}
                  </option>
                ))}
              </select>
              {selectedDest === 'CUSTOM' && (
                <input
                  type="text"
                  value={customDest}
                  onChange={(e) => setCustomDest(e.target.value)}
                  placeholder="Type destination city..."
                  className="mt-2 w-full rounded-xl bg-forest-950 border border-coral-400/60 px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
                />
              )}
            </div>

            <div>
              <label htmlFor={goalId} className="block text-xs font-bold text-white/85 mb-1.5 flex items-center gap-1.5">
                <span className="text-coral-400">🎯</span> Visa Category / Goal
              </label>
              <select
                id={goalId}
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                className="w-full rounded-xl bg-forest-950 border border-white/20 px-3.5 py-3 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-coral-400"
              >
                {goals.map((g) => (
                  <option key={g} value={g} className="bg-forest-950 text-white">
                    {g}
                  </option>
                ))}
              </select>
              {selectedGoal.startsWith('✏️') && (
                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="Type your goal..."
                  className="mt-2 w-full rounded-xl bg-forest-950 border border-coral-400/60 px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
                />
              )}
            </div>

            <div>
              <label htmlFor={intakeId} className="block text-xs font-bold text-white/85 mb-1.5 flex items-center gap-1.5">
                <span className="text-coral-400">📅</span> Target Intake (2027 Planning)
              </label>
              <select
                id={intakeId}
                value={selectedIntake}
                onChange={(e) => setSelectedIntake(e.target.value)}
                className="w-full rounded-xl bg-forest-950 border border-white/20 px-3.5 py-3 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-coral-400"
              >
                {intakes.map((intk) => (
                  <option key={intk} value={intk} className="bg-forest-950 text-white">
                    {intk}
                  </option>
                ))}
              </select>
              {selectedIntake.startsWith('✏️') && (
                <input
                  type="text"
                  value={customIntake}
                  onChange={(e) => setCustomIntake(e.target.value)}
                  placeholder="Type target intake (e.g. Fall 2027)..."
                  className="mt-2 w-full rounded-xl bg-forest-950 border border-coral-400/60 px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
                />
              )}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-coral-500 hover:bg-coral-600 py-4 px-6 text-sm sm:text-base font-extrabold text-white shadow-xl transition active:scale-[0.98] cursor-pointer"
            >
              <span>✨</span>
              <span>Generate My Boarding Pass ➔</span>
            </button>
            <p className="text-center text-[11px] text-forest-100/60 mt-2.5">
              Free instant pass generation · 1-click WhatsApp Status sharing
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-forest-900 border border-white/20 p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-coral-400 text-base">✨</span>
                <span className="text-sm font-extrabold text-white">Your Boarding Pass is Ready!</span>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="rounded-2xl bg-cream text-forest-950 shadow-2xl border border-forest-900/15 overflow-hidden">
              <div className="bg-forest-900 px-4 py-3 text-white flex items-center justify-between border-b border-forest-800">
                <div className="flex items-center gap-1.5">
                  <Plane className="size-3.5 text-coral-400" />
                  <span className="text-xs font-black tracking-tight">BRITISH EDUCATION & IMMIGRATION</span>
                </div>
                <span className="rounded-full bg-coral-500 px-2 py-0.5 font-mono text-[9px] font-bold uppercase text-white">
                  OFFICIAL PASS
                </span>
              </div>

              <div className="p-4 sm:p-5 bg-[#fffdf7]">
                <div className="flex items-center justify-between pb-3.5 border-b border-forest-900/10">
                  <div>
                    <span className="font-mono text-[9px] font-bold text-forest-900/60 uppercase tracking-wider">
                      ORIGIN
                    </span>
                    <p className="text-3xl font-black text-forest-900 tracking-tight leading-none mt-0.5">
                      {originCode}
                    </p>
                    <p className="text-[11px] font-semibold text-forest-900/75 truncate max-w-[100px] mt-0.5">
                      {originCity}
                    </p>
                  </div>

                  <div className="flex flex-col items-center px-2">
                    <span className="text-[8px] font-mono font-bold text-coral-600 uppercase tracking-widest">
                      NON-STOP
                    </span>
                    <div className="flex items-center gap-1.5 text-coral-500 my-1">
                      <div className="w-6 h-0.5 bg-coral-400 border-dashed" />
                      <Plane className="size-4 transform rotate-90" />
                      <div className="w-6 h-0.5 bg-coral-400 border-dashed" />
                    </div>
                    <span className="text-[9px] text-forest-900/60 font-bold">
                      BEI · {ticketYear}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-[9px] font-bold text-forest-900/60 uppercase tracking-wider">
                      DESTINATION
                    </span>
                    <p className="text-3xl font-black text-forest-900 tracking-tight leading-none mt-0.5">
                      {destCode}
                    </p>
                    <p className="text-[11px] font-semibold text-forest-900/75 truncate max-w-[100px] mt-0.5">
                      {destCity}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 py-3 text-xs border-b border-forest-900/10">
                  <div>
                    <span className="block text-[9px] font-mono text-forest-900/60 uppercase">Passenger</span>
                    <span className="font-bold text-forest-900 truncate block text-sm">{displayName}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-forest-900/60 uppercase">Visa Category</span>
                    <span className="font-bold text-forest-900 truncate block">{displayGoal}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-forest-900/60 uppercase">Intake</span>
                    <span className="font-bold text-forest-900 truncate block">{displayIntake}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-forest-900/60 uppercase">Flight / Seat</span>
                    <span className="font-bold text-forest-900 truncate block">BEI-{ticketYear} · 01A</span>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-[2px] h-6 opacity-80" aria-hidden>
                      {[12, 24, 8, 16, 26, 6, 20, 14, 26, 10, 22, 16, 12, 26, 8, 18, 22, 10].map((h, i) => (
                        <div
                          key={i}
                          className="bg-forest-950"
                          style={{
                            width: i % 3 === 0 ? '2.5px' : '1.5px',
                            height: `${h}px`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[8px] text-forest-900/60 tracking-widest mt-0.5">
                      BEI-{originCode}-{destCode}-{ticketYear}
                    </span>
                  </div>

                  <div className="rounded-lg border-2 border-dashed border-coral-500 bg-coral-50 px-2.5 py-1 text-center">
                    <span className="text-[9px] font-black uppercase tracking-wider text-coral-600 block leading-tight">
                      VISA APPROVED
                    </span>
                    <span className="text-[8px] font-bold text-forest-900/70 block">
                      Sangaria Office
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3.5 px-4 text-xs font-bold text-white shadow-lg transition active:scale-[0.98] cursor-pointer"
              >
                <MessageCircle className="size-4" />
                <span>Share Pass on WhatsApp Status</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 py-2.5 px-3 text-xs font-semibold text-white transition active:scale-[0.98] cursor-pointer"
                >
                  <RotateCcw className="size-3.5 text-coral-400" />
                  <span>Edit Details</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyDetails}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 py-2.5 px-3 text-xs font-semibold text-white transition active:scale-[0.98] cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <span>📋 Copy Details</span>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleScrollToEnquiry}
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

