import { useState, useId } from 'react'
import { Plane, Sparkles, Share2, Download, MapPin, Target, Calendar, Check, ArrowRight } from 'lucide-react'

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
  { code: 'CUSTOM', name: 'Other', label: '✏️ Other City (Type your city)' },
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
  { code: 'CUSTOM', name: 'Other', label: '✏️ Other Destination (Type city)' },
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
  const [downloading, setDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

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

  // Scroll to Counselling section smoothly
  const handleScrollToEnquiry = () => {
    const el = document.getElementById('enquiry-m') || document.getElementById('enquiry')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Share on WhatsApp
  const handleShareWhatsApp = () => {
    const msg = `✈️ *My Future Flight Boarding Pass*\n👤 *Passenger:* ${displayName}\n📍 *From:* ${originCity} (${originCode})\n🌍 *To:* ${destCity} (${destCode})\n🎯 *Goal:* ${displayGoal}\n📅 *Intake:* ${displayIntake}\n\n🏛️ Assisted by *British Education & Immigration*, Sangaria (Rajasthan)\n👉 Check your visa eligibility: https://britisheducationandimmigration.com`
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }

  // Download Boarding Pass as Image (Canvas rendering)
  const handleDownloadImage = () => {
    setDownloading(true)
    const canvas = document.createElement('canvas')
    canvas.width = 1000
    canvas.height = 500
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setDownloading(false)
      return
    }

    // Background
    ctx.fillStyle = '#081c15' // dark forest
    ctx.roundRect(0, 0, 1000, 500, 24)
    ctx.fill()

    // Top Header Banner
    ctx.fillStyle = '#c4515d' // coral
    ctx.beginPath()
    ctx.roundRect(0, 0, 1000, 75, [24, 24, 0, 0])
    ctx.fill()

    // Header Text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText('BRITISH EDUCATION & IMMIGRATION · SANGARIA', 40, 48)

    ctx.font = 'bold 16px monospace'
    ctx.fillText('OFFICIAL FLIGHT PASS · ' + ticketYear, 720, 48)

    // Inner Card Body
    ctx.fillStyle = '#fefae0' // cream ticket paper
    ctx.beginPath()
    ctx.roundRect(30, 95, 940, 375, 16)
    ctx.fill()

    // Flight route codes
    ctx.fillStyle = '#081c15'
    ctx.font = '900 58px sans-serif'
    ctx.fillText(originCode, 70, 185)
    ctx.fillText(destCode, 580, 185)

    // City names under codes
    ctx.font = 'bold 18px sans-serif'
    ctx.fillStyle = '#40534c'
    ctx.fillText(originCity, 70, 215)
    ctx.fillText(destCity, 580, 215)

    // Arrow & Flight Icon
    ctx.fillStyle = '#c4515d'
    ctx.font = 'bold 28px sans-serif'
    ctx.fillText('✈  - - - - - ➔', 270, 180)
    ctx.font = 'bold 14px monospace'
    ctx.fillText('NON-STOP · ' + ticketYear, 280, 210)

    // Perforation / divider line
    ctx.strokeStyle = '#c4515d'
    ctx.lineWidth = 2
    ctx.setLineDash([8, 8])
    ctx.beginPath()
    ctx.moveTo(760, 95)
    ctx.lineTo(760, 470)
    ctx.stroke()
    ctx.setLineDash([])

    // Grid Labels and Data (Left Side)
    const renderField = (label: string, value: string, x: number, y: number) => {
      ctx.fillStyle = '#8f9a94'
      ctx.font = 'bold 12px monospace'
      ctx.fillText(label.toUpperCase(), x, y)
      ctx.fillStyle = '#081c15'
      ctx.font = 'bold 20px sans-serif'
      ctx.fillText(value.slice(0, 25), x, y + 26)
    }

    renderField('Passenger', displayName.toUpperCase(), 70, 275)
    renderField('Visa Goal', displayGoal, 420, 275)
    renderField('Target Intake', displayIntake, 70, 360)
    renderField('Flight No', `BEI-${ticketYear}`, 420, 360)

    // Barcode on bottom left
    for (let i = 0; i < 35; i++) {
      ctx.fillStyle = '#081c15'
      const w = i % 4 === 0 ? 4 : (i % 2 === 0 ? 2 : 1)
      const h = 38
      ctx.fillRect(70 + i * 8, 415, w, h)
    }
    ctx.font = '10px monospace'
    ctx.fillStyle = '#6b7280'
    ctx.fillText(`*${originCode}-${destCode}-${ticketYear}-BEI*`, 70, 465)

    // Right Stub (Tear-off portion)
    ctx.fillStyle = '#081c15'
    ctx.font = 'bold 18px sans-serif'
    ctx.fillText('BOARDING PASS', 780, 140)

    ctx.fillStyle = '#8f9a94'
    ctx.font = 'bold 11px monospace'
    ctx.fillText('PASSENGER', 780, 180)
    ctx.fillStyle = '#081c15'
    ctx.font = 'bold 16px sans-serif'
    ctx.fillText(displayName.slice(0, 15).toUpperCase(), 780, 202)

    ctx.fillStyle = '#8f9a94'
    ctx.font = 'bold 11px monospace'
    ctx.fillText('ROUTE', 780, 240)
    ctx.fillStyle = '#c4515d'
    ctx.font = 'bold 16px sans-serif'
    ctx.fillText(`${originCode} ➔ ${destCode}`, 780, 262)

    // Approved Stamp
    ctx.save()
    ctx.translate(860, 370)
    ctx.rotate(-0.15)
    ctx.strokeStyle = '#c4515d'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.roundRect(-70, -35, 140, 70, 12)
    ctx.stroke()
    ctx.fillStyle = '#c4515d'
    ctx.font = '900 16px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('VISA APPROVED', 0, -8)
    ctx.font = 'bold 11px sans-serif'
    ctx.fillText('SANGARIA OFFICE', 0, 14)
    ctx.font = 'bold 10px monospace'
    ctx.fillText(`BEI · ${ticketYear}`, 0, 28)
    ctx.restore()

    // Trigger Download
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `Flight-Pass-${displayName.replace(/\s+/g, '-')}-${destCode}.png`
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setDownloading(false)
    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 3000)
  }

  return (
    <section id="boarding-pass-section" className="relative overflow-hidden bg-forest-950 py-16 px-4 sm:px-6 lg:px-8 border-y border-white/10 text-white">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-coral-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-forest-900 border border-white/15 px-4 py-1.5 text-xs font-semibold text-coral-400 mb-4 shadow-sm">
            <Plane className="size-3.5" />
            <span>Virtual Flight Pass · Sangaria to World</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Design Your <span className="bg-gradient-to-r from-amber-300 via-amber-100 to-coral-400 bg-clip-text text-transparent">2027 Flight Boarding Pass</span>
          </h2>
          <p className="mt-3 text-sm text-forest-100/75 leading-relaxed">
            Choose your home town, target destination and intake. Watch your departure boarding pass generate in real-time.
          </p>
        </div>

        {/* Two Column Grid: Customizer (Left) & Live Pass (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-forest-900/90 border border-white/15 p-5 sm:p-6 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-coral-400 flex items-center gap-2">
                <span>✈️ Passenger Details</span>
              </h3>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
                Live Preview
              </span>
            </div>

            <div className="space-y-4">
              {/* Passenger Name */}
              <div>
                <label htmlFor={nameId} className="block text-xs font-semibold text-white/80 mb-1">
                  Passenger Name
                </label>
                <input
                  id={nameId}
                  type="text"
                  value={passengerName}
                  onChange={(e) = /> setPassengerName(e.target.value)}
                  placeholder="Enter name (e.g. Somveer)"
                  className="w-full rounded-xl bg-forest-950 border border-white/20 px-3.5 py-2.5 text-xs font-semibold text-white placeholder-white/40 focus:outline-none focus:border-coral-400 shadow-inner"
                />
              </div>

              {/* Origin City */}
              <div>
                <label htmlFor={originId} className="block text-xs font-semibold text-white/80 mb-1 flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-coral-400" /> Departure City (Origin)
                </label>
                <select
                  id={originId}
                  value={selectedOrigin}
                  onChange={(e) => setSelectedOrigin(e.target.value)}
                  className="w-full rounded-xl bg-forest-950 border border-white/20 px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-coral-400"
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
                    onChange={(e) = /> setCustomOrigin(e.target.value)}
                    placeholder="Type departure city (e.g. Abohar, Sirsa)..."
                    className="mt-2 w-full rounded-xl bg-forest-950 border border-coral-400/60 px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
                  />
                )}
              </div>

              {/* Destination City */}
              <div>
                <label htmlFor={destId} className="block text-xs font-semibold text-white/80 mb-1 flex items-center gap-1.5">
                  <Plane className="size-3.5 text-coral-400" /> Dream Destination (Arrival)
                </label>
                <select
                  id={destId}
                  value={selectedDest}
                  onChange={(e) => setSelectedDest(e.target.value)}
                  className="w-full rounded-xl bg-forest-950 border border-white/20 px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-coral-400"
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
                    onChange={(e) = /> setCustomDest(e.target.value)}
                    placeholder="Type destination city (e.g. Calgary, Dublin)..."
                    className="mt-2 w-full rounded-xl bg-forest-950 border border-coral-400/60 px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
                  />
                )}
              </div>

              {/* Goal Category */}
              <div>
                <label htmlFor={goalId} className="block text-xs font-semibold text-white/80 mb-1 flex items-center gap-1.5">
                  <Target className="size-3.5 text-coral-400" /> Goal / Visa Category
                </label>
                <select
                  id={goalId}
                  value={selectedGoal}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  className="w-full rounded-xl bg-forest-950 border border-white/20 px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-coral-400"
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
                    onChange={(e) = /> setCustomGoal(e.target.value)}
                    placeholder="Type your goal..."
                    className="mt-2 w-full rounded-xl bg-forest-950 border border-coral-400/60 px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
                  />
                )}
              </div>

              {/* Intake Year */}
              <div>
                <label htmlFor={intakeId} className="block text-xs font-semibold text-white/80 mb-1 flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-coral-400" /> Target Intake / Year
                </label>
                <select
                  id={intakeId}
                  value={selectedIntake}
                  onChange={(e) => setSelectedIntake(e.target.value)}
                  className="w-full rounded-xl bg-forest-950 border border-white/20 px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-coral-400"
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
                    onChange={(e) = /> setCustomIntake(e.target.value)}
                    placeholder="Type target intake (e.g. Fall 2027)..."
                    className="mt-2 w-full rounded-xl bg-forest-950 border border-coral-400/60 px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Ticket Display Card (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center w-full">
            {/* The Ticket Container */}
            <div className="w-full max-w-lg rounded-3xl bg-cream text-forest-950 shadow-2xl border border-forest-900/15 overflow-hidden relative">
              {/* Top Airline Header */}
              <div className="bg-forest-900 px-5 sm:px-6 py-3.5 text-white flex items-center justify-between border-b border-forest-800">
                <div className="flex items-center gap-2">
                  <Plane className="size-4 text-coral-400" />
                  <span className="text-xs sm:text-sm font-extrabold tracking-tight">BRITISH EDUCATION & IMMIGRATION</span>
                </div>
                <span className="rounded-full bg-coral-500 px-2.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white">
                  BOARDING PASS
                </span>
              </div>

              {/* Ticket Body */}
              <div className="p-5 sm:p-6 bg-[#fffdf7]">
                {/* Flight Route Header */}
                <div className="flex items-center justify-between pb-4 border-b border-forest-900/10">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-forest-900/60 uppercase tracking-wider">
                      DEPARTURE
                    </span>
                    <p className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
                      {originCode}
                    </p>
                    <p className="text-xs font-semibold text-forest-900/75 truncate max-w-[120px]">
                      {originCity}
                    </p>
                  </div>

                  <div className="flex flex-col items-center px-2">
                    <span className="text-[9px] font-mono font-bold text-coral-600 uppercase tracking-widest mb-1">
                      NON-STOP FLIGHT
                    </span>
                    <div className="flex items-center gap-2 text-coral-500">
                      <div className="w-8 sm:w-12 h-0.5 bg-coral-400 border-dashed" />
                      <Plane className="size-4 sm:size-5 transform rotate-90" />
                      <div className="w-8 sm:w-12 h-0.5 bg-coral-400 border-dashed" />
                    </div>
                    <span className="text-[10px] text-forest-900/60 font-semibold mt-1">
                      BEI · {ticketYear}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-[10px] font-bold text-forest-900/60 uppercase tracking-wider">
                      ARRIVAL
                    </span>
                    <p className="text-3xl sm:text-4xl font-extrabold text-forest-900 tracking-tight">
                      {destCode}
                    </p>
                    <p className="text-xs font-semibold text-forest-900/75 truncate max-w-[120px]">
                      {destCity}
                    </p>
                  </div>
                </div>

                {/* Passenger Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs border-b border-forest-900/10">
                  <div>
                    <span className="block text-[9px] font-mono text-forest-900/60 uppercase">Passenger</span>
                    <span className="font-bold text-forest-900 truncate block text-sm">{displayName}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-forest-900/60 uppercase">Visa Goal</span>
                    <span className="font-bold text-forest-900 truncate block">{displayGoal}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-forest-900/60 uppercase">Intake</span>
                    <span className="font-bold text-forest-900 truncate block">{displayIntake}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-forest-900/60 uppercase">Status</span>
                    <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-extrabold">
                      Ready to Fly
                    </span>
                  </div>
                </div>

                {/* Bottom Barcode & Approval Stamp */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {/* Decorative Barcode */}
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="flex items-center gap-[2px] h-7 opacity-85" aria-hidden>
                      {[14, 28, 10, 18, 30, 8, 22, 16, 30, 12, 24, 18, 14, 28, 10, 20, 26, 12, 16, 30, 14, 22, 10, 18].map((h, i) => (
                        <div
                          key={i}
                          className="bg-forest-950"
                          style={{
                            width: i % 3 === 0 ? '3px' : '1.5px',
                            height: `${h}px`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[9px] text-forest-900/60 tracking-widest mt-1">
                      BEI-{originCode}-{destCode}-{ticketYear}
                    </span>
                  </div>

                  {/* Stamp */}
                  <div className="rounded-xl border-2 border-dashed border-coral-500 bg-coral-50/80 px-3.5 py-1.5 text-center">
                    <span className="text-[11px] font-black uppercase tracking-wider text-coral-600 block">
                      VISA APPROVED
                    </span>
                    <span className="text-[9px] font-bold text-forest-900/70 block">
                      Sangaria Office · {ticketYear}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Download Image + WhatsApp Share + Free Counselling */}
            <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-lg">
              {/* Download Image Button */}
              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={downloading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-forest-900 hover:bg-forest-800 border border-white/20 px-4 py-3 text-xs font-bold text-white shadow-lg transition active:scale-95"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="size-4 text-emerald-400" />
                    <span>Saved to Photos!</span>
                  </>
                ) : (
                  <>
                    <Download className="size-4 text-coral-400" />
                    <span>{downloading ? 'Creating Ticket...' : 'Download Pass (Image)'}</span>
                  </>
                )}
              </button>

              {/* WhatsApp Share */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-3 text-xs font-bold text-white shadow-lg transition active:scale-95"
              >
                <Share2 className="size-4" />
                <span>WhatsApp Share</span>
              </button>

              {/* Book Counselling (Smooth Scroll, No blank tab) */}
              <button
                type="button"
                onClick={handleScrollToEnquiry}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-coral-500 hover:bg-coral-600 px-4 py-3 text-xs font-bold text-white shadow-lg transition active:scale-95"
              >
                <span>Free Assessment</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}