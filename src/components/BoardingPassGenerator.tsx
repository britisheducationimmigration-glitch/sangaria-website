import { useState } from 'react'
import { ArrowRight, Check, Download, Plane, Share2, Sparkles } from 'lucide-react'

interface CityOption {
  city: string
  code: string
  country?: string
}

const defaultOrigins: CityOption[] = [
  { city: 'Sangaria', code: 'SNG' },
  { city: 'Hanumangarh', code: 'HMH' },
  { city: 'Sri Ganganagar', code: 'SGNR' },
  { city: 'Bathinda', code: 'BTI' },
  { city: 'Amritsar', code: 'ATQ' },
  { city: 'Delhi', code: 'DEL' },
]

const defaultDestinations: CityOption[] = [
  { city: 'Toronto', code: 'YYZ', country: 'Canada' },
  { city: 'Vancouver', code: 'YVR', country: 'Canada' },
  { city: 'London', code: 'LHR', country: 'United Kingdom' },
  { city: 'Melbourne', code: 'MEL', country: 'Australia' },
  { city: 'Sydney', code: 'SYD', country: 'Australia' },
  { city: 'New York', code: 'JFK', country: 'United States' },
  { city: 'Berlin', code: 'BER', country: 'Germany' },
  { city: 'Auckland', code: 'AKL', country: 'New Zealand' },
]

const defaultGoals = [
  '🎓 Study Permit (Diploma / Degree)',
  '🎓 Masters / Post-Graduation',
  '💼 Post-Study Work Permit',
  '🍁 Permanent Residency (PR)',
  '💍 Spouse Open Work Permit',
  '✈️ Tourist / Visitor Visa',
  '📚 IELTS / PTE 7.5+ Coaching',
]

const defaultIntakes = [
  '❄️ Winter / Jan 2027',
  '🌸 Spring / May 2027',
  '🍁 Fall / Sept 2027',
  '✈️ Winter / Jan 2028',
  '⚡ Immediate / 2026',
]

export function BoardingPassGenerator() {
  const [name, setName] = useState('Your Name')
  
  // Origin State
  const [originIndex, setOriginIndex] = useState('0')
  const [customOrigin, setCustomOrigin] = useState('')

  // Destination State
  const [destinationIndex, setDestinationIndex] = useState('0')
  const [customDestination, setCustomDestination] = useState('')

  // Goal State
  const [goalIndex, setGoalIndex] = useState('0')
  const [customGoal, setCustomGoal] = useState('')

  // Intake State
  const [intakeIndex, setIntakeIndex] = useState('0')
  const [customIntake, setCustomIntake] = useState('')

  // Resolve Origin
  const originCity = originIndex === 'custom' ? (customOrigin.trim() || 'Sangaria') : defaultOrigins[Number(originIndex)].city
  const originCode = originIndex === 'custom' ? (customOrigin.trim().slice(0, 3).toUpperCase() || 'SNG') : defaultOrigins[Number(originIndex)].code

  // Resolve Destination
  const destCity = destinationIndex === 'custom' ? (customDestination.trim() || 'Toronto') : defaultDestinations[Number(destinationIndex)].city
  const destCode = destinationIndex === 'custom' ? (customDestination.trim().slice(0, 3).toUpperCase() || 'YYZ') : defaultDestinations[Number(destinationIndex)].code
  const destCountry = destinationIndex === 'custom' ? 'Abroad' : defaultDestinations[Number(destinationIndex)].country

  // Resolve Goal & Intake
  const resolvedGoal = goalIndex === 'custom' ? (customGoal.trim() || 'Study Permit 🎓') : defaultGoals[Number(goalIndex)]
  const resolvedIntake = intakeIndex === 'custom' ? (customIntake.trim() || 'Jan 2027') : defaultIntakes[Number(intakeIndex)]

  // Dynamic Ticket Year (e.g. 2027)
  const ticketYear = resolvedIntake.includes('2028') ? '2028' : resolvedIntake.includes('2027') ? '2027' : '2026'

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `✈️ *My Dream Boarding Pass to ${destCity}!* \n\n` +
      `👤 *Passenger:* ${name === 'Your Name' ? 'Me' : name}\n` +
      `🛫 *Route:* ${originCity} (${originCode}) ➔ ${destCity} (${destCode})\n` +
      `🎯 *Goal:* ${resolvedGoal}\n` +
      `📅 *Target Intake:* ${resolvedIntake}\n` +
      `🏛️ *Consultancy:* British Education & Immigration, Sangaria\n\n` +
      `Make your dream flight real: https://britisheducationandimmigration.com`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <section id="boarding-pass-tool" className="bg-sand/60 bg-dots py-20 px-5 border-y border-forest-900/10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-100 border border-coral-200 px-3.5 py-1 text-xs font-bold text-coral-700 shadow-xs">
            <Sparkles className="size-3.5 text-coral-600" /> Interactive Feature 01
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-forest-900 sm:text-4xl lg:text-5xl tracking-tight">
            Generate Your Dream Boarding Pass
          </h2>
          <p className="mt-2 text-sm text-forest-900/70 sm:text-base">
            Customize your departure city, target country, visa goal, and 2027 intake — get your personalized international flight pass in seconds!
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr] items-start">
          {/* Controls Box */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-forest-900/10 space-y-4">
            <h3 className="text-lg font-extrabold text-forest-900 border-b border-forest-900/10 pb-3 flex items-center justify-between">
              <span>Customize Pass</span>
              <span className="text-xs font-mono font-normal text-forest-900/50">Free & Live</span>
            </h3>

            {/* Passenger Name */}
            <div>
              <label htmlFor="bp-name" className="block text-xs font-bold text-forest-900 mb-1">
                Passenger Name
              </label>
              <input
                id="bp-name"
                type="text"
                value={name === 'Your Name' ? '' : name}
                onChange={(e) => setName(e.target.value || 'Your Name')}
                placeholder="Enter your name (e.g. Simran Kaur)"
                className="w-full rounded-xl border border-forest-900/15 bg-cream px-3.5 py-2.5 text-sm font-semibold text-forest-900 outline-none focus:border-coral-500 focus:bg-white transition"
              />
            </div>

            {/* Origin Selection */}
            <div>
              <label htmlFor="bp-origin" className="block text-xs font-bold text-forest-900 mb-1">
                Departure City (Origin)
              </label>
              <select
                id="bp-origin"
                value={originIndex}
                onChange={(e) => setOriginIndex(e.target.value)}
                className="w-full rounded-xl border border-forest-900/15 bg-cream px-3.5 py-2.5 text-sm font-semibold text-forest-900 outline-none focus:border-coral-500 focus:bg-white transition"
              >
                {defaultOrigins.map((o, idx) => (
                  <option key={o.city} value={idx}>
                    📍 {o.city} ({o.code})
                  </option>
                ))}
                <option value="custom">✏️ Type custom departure city...</option>
              </select>
              {originIndex === 'custom' && (
                <input
                  type="text"
                  value={customOrigin}
                  onChange={(e) => setCustomOrigin(e.target.value)}
                  placeholder="Type your city (e.g. Abohar, Malout)"
                  className="mt-2 w-full rounded-xl border border-forest-900/15 bg-white px-3.5 py-2 text-xs font-medium text-forest-900 outline-none"
                />
              )}
            </div>

            {/* Destination Selection */}
            <div>
              <label htmlFor="bp-dest" className="block text-xs font-bold text-forest-900 mb-1">
                Dream Destination (Arrival)
              </label>
              <select
                id="bp-dest"
                value={destinationIndex}
                onChange={(e) => setDestinationIndex(e.target.value)}
                className="w-full rounded-xl border border-forest-900/15 bg-cream px-3.5 py-2.5 text-sm font-semibold text-forest-900 outline-none focus:border-coral-500 focus:bg-white transition"
              >
                {defaultDestinations.map((d, idx) => (
                  <option key={d.city} value={idx}>
                    ✈️ {d.city}, {d.country} ({d.code})
                  </option>
                ))}
                <option value="custom">✏️ Type custom destination...</option>
              </select>
              {destinationIndex === 'custom' && (
                <input
                  type="text"
                  value={customDestination}
                  onChange={(e) => setCustomDestination(e.target.value)}
                  placeholder="Type dream city (e.g. Calgary, Manchester)"
                  className="mt-2 w-full rounded-xl border border-forest-900/15 bg-white px-3.5 py-2 text-xs font-medium text-forest-900 outline-none"
                />
              )}
            </div>

            {/* Goal / Visa Selection */}
            <div>
              <label htmlFor="bp-goal" className="block text-xs font-bold text-forest-900 mb-1">
                Goal / Visa Category
              </label>
              <select
                id="bp-goal"
                value={goalIndex}
                onChange={(e) => setGoalIndex(e.target.value)}
                className="w-full rounded-xl border border-forest-900/15 bg-cream px-3.5 py-2.5 text-xs font-semibold text-forest-900 outline-none"
              >
                {defaultGoals.map((g, idx) => (
                  <option key={g} value={idx}>
                    {g}
                  </option>
                ))}
                <option value="custom">✏️ Type custom goal...</option>
              </select>
              {goalIndex === 'custom' && (
                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="Type your goal (e.g. Nursing Course, Job Seeker)"
                  className="mt-2 w-full rounded-xl border border-forest-900/15 bg-white px-3.5 py-2 text-xs font-medium text-forest-900 outline-none"
                />
              )}
            </div>

            {/* Intake Selection */}
            <div>
              <label htmlFor="bp-intake" className="block text-xs font-bold text-forest-900 mb-1">
                Target Intake / Year
              </label>
              <select
                id="bp-intake"
                value={intakeIndex}
                onChange={(e) => setIntakeIndex(e.target.value)}
                className="w-full rounded-xl border border-forest-900/15 bg-cream px-3.5 py-2.5 text-xs font-semibold text-forest-900 outline-none"
              >
                {defaultIntakes.map((it, idx) => (
                  <option key={it} value={idx}>
                    {it}
                  </option>
                ))}
                <option value="custom">✏️ Type other intake / year...</option>
              </select>
              {intakeIndex === 'custom' && (
                <input
                  type="text"
                  value={customIntake}
                  onChange={(e) => setCustomIntake(e.target.value)}
                  placeholder="Type your intake (e.g. Winter 2027, Summer 2028)"
                  className="mt-2 w-full rounded-xl border border-forest-900/15 bg-white px-3.5 py-2 text-xs font-medium text-forest-900 outline-none"
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-3 px-4 text-xs font-bold text-white shadow-md active:scale-98 transition"
              >
                <Share2 className="size-4" /> Share on WhatsApp Status
              </button>
              <a
                href="#enquiry"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-forest-900 hover:bg-forest-800 py-3 px-4 text-xs font-bold text-white shadow-sm transition text-center"
              >
                Make This Flight Real → Book Free Counselling
              </a>
            </div>
          </div>

          {/* Live Visual Boarding Pass Card */}
          <div className="relative">
            <div className="rounded-3xl bg-forest-900 bg-grain text-white p-6 sm:p-8 shadow-2xl border border-white/20 overflow-hidden relative">
              {/* Airline Header Bar */}
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-9 place-items-center rounded-xl bg-coral-500 text-white font-extrabold text-sm shadow-md">
                    BEI
                  </span>
                  <div>
                    <p className="font-display text-sm font-extrabold uppercase tracking-wide">British Education</p>
                    <p className="text-[10px] text-forest-100/70 font-mono">OFFICIAL FLIGHT PASS · {ticketYear}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 font-mono text-[10px] font-bold uppercase text-emerald-300">
                    VISA APPROVED ✓
                  </span>
                </div>
              </div>

              {/* Route Display (SNG -> YYZ) */}
              <div className="my-6 grid grid-cols-3 items-center text-center">
                <div className="text-left">
                  <p className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">{originCode}</p>
                  <p className="text-xs font-bold text-coral-400 mt-0.5 truncate">{originCity}</p>
                  <p className="text-[10px] text-forest-100/60 font-mono mt-0.5">ORIGIN</p>
                </div>

                <div className="flex flex-col items-center">
                  <Plane className="size-6 sm:size-7 text-coral-400 animate-pulse" />
                  <div className="w-full border-t border-dashed border-white/30 my-2 relative">
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 size-3 rounded-full bg-coral-500" />
                  </div>
                  <span className="font-mono text-[10px] text-forest-100/70 uppercase tracking-widest">NON-STOP</span>
                </div>

                <div className="text-right">
                  <p className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">{destCode}</p>
                  <p className="text-xs font-bold text-coral-400 mt-0.5 truncate">{destCity}</p>
                  <p className="text-[10px] text-forest-100/60 font-mono mt-0.5">{destCountry}</p>
                </div>
              </div>

              {/* Passenger & Flight Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-dashed border-white/20 bg-white/5 rounded-2xl px-4">
                <div>
                  <p className="text-[10px] font-mono uppercase text-forest-100/60 tracking-wider">PASSENGER</p>
                  <p className="font-display text-sm font-extrabold text-white truncate mt-0.5">{name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase text-forest-100/60 tracking-wider">GOAL / VISA</p>
                  <p className="font-display text-xs font-extrabold text-coral-400 truncate mt-0.5">{resolvedGoal}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase text-forest-100/60 tracking-wider">SEAT</p>
                  <p className="font-display text-sm font-extrabold text-white mt-0.5">01A (Window)</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase text-forest-100/60 tracking-wider">INTAKE</p>
                  <p className="font-display text-xs font-extrabold text-emerald-400 mt-0.5 truncate">{resolvedIntake}</p>
                </div>
              </div>

              {/* Barcode & Departure Footer */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                {/* Visual Barcode */}
                <div className="flex items-center gap-1 opacity-70">
                  <div className="w-1.5 h-10 bg-white" />
                  <div className="w-0.5 h-10 bg-white" />
                  <div className="w-1 h-10 bg-white" />
                  <div className="w-2 h-10 bg-white" />
                  <div className="w-0.5 h-10 bg-white" />
                  <div className="w-1.5 h-10 bg-white" />
                  <div className="w-1 h-10 bg-white" />
                  <div className="w-2.5 h-10 bg-white" />
                  <div className="w-0.5 h-10 bg-white" />
                  <div className="w-1.5 h-10 bg-white" />
                  <div className="w-1 h-10 bg-white" />
                  <div className="w-2 h-10 bg-white" />
                  <div className="w-0.5 h-10 bg-white" />
                  <div className="w-1.5 h-10 bg-white" />
                  <div className="w-2 h-10 bg-white" />
                  <div className="w-0.5 h-10 bg-white" />
                  <div className="w-1 h-10 bg-white" />
                </div>

                <div className="text-center sm:text-right">
                  <p className="text-[11px] font-bold text-white/90">British Education & Immigration</p>
                  <p className="text-[10px] text-forest-100/60">Bhagatpura Road, Sangaria · +91 97725 70478</p>
                </div>
              </div>
            </div>

            <p className="mt-3 text-center text-xs text-forest-900/60">
              💡 Share this ticket on WhatsApp Status to claim a free IELTS/PTE demo class!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
