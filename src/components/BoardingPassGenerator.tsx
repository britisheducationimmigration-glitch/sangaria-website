import { useState } from 'react'
import { Plane, MapPin, X, ArrowRight, MessageCircle, RotateCcw, Download } from 'lucide-react'

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
  const [flipped, setFlipped] = useState(false)

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

  const handleMakeReal = () => {
    setOpen(false)
    window.location.href = '/contact'
  }

  const handleDownloadPassImage = async () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 630
    const context = canvas.getContext('2d')
    if (!context) return

    const palette = getComputedStyle(document.documentElement)
    const color = (token: string, fallback: string) => palette.getPropertyValue(token).trim() || fallback
    const forest = color('--color-forest-900', '#123752')
    const deepForest = color('--color-forest-950', '#0a1b2d')
    const coral = color('--color-coral-500', '#c4515d')
    const cream = color('--color-cream', '#f7f8fa')
    const logoImage = new Image()
    logoImage.src = '/img/logo.png'
    try {
      await logoImage.decode()
    } catch {
      // Keep the pass downloadable if the logo asset cannot be loaded.
    }

    const backgroundGradient = context.createLinearGradient(0, 0, canvas.width, canvas.height)
    backgroundGradient.addColorStop(0, deepForest)
    backgroundGradient.addColorStop(0.48, forest)
    backgroundGradient.addColorStop(0.78, '#1c4e68')
    backgroundGradient.addColorStop(1, deepForest)
    context.fillStyle = backgroundGradient
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.save()
    context.strokeStyle = 'rgba(255, 255, 255, 0.16)'
    context.lineWidth = 1.5
    for (const radius of [90, 145, 200, 255, 310]) {
      context.beginPath()
      context.arc(1100, 600, radius, Math.PI, Math.PI * 1.5)
      context.stroke()
    }
    context.strokeStyle = 'rgba(255, 255, 255, 0.14)'
    context.setLineDash([3, 12])
    context.beginPath()
    context.moveTo(0, 560)
    context.bezierCurveTo(300, 500, 380, 120, 900, 80)
    context.stroke()
    context.restore()

    const roundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
      context.beginPath()
      context.moveTo(x + radius, y)
      context.lineTo(x + width - radius, y)
      context.quadraticCurveTo(x + width, y, x + width, y + radius)
      context.lineTo(x + width, y + height - radius)
      context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      context.lineTo(x + radius, y + height)
      context.quadraticCurveTo(x, y + height, x, y + height - radius)
      context.lineTo(x, y + radius)
      context.quadraticCurveTo(x, y, x + radius, y)
      context.closePath()
    }

    roundedRect(54, 48, 1092, 534, 28)
    context.fillStyle = cream
    context.fill()

    if (logoImage.complete && logoImage.naturalWidth > 0) {
      context.save()
      context.globalAlpha = 0.14
      context.drawImage(logoImage, 920, 178, 170, 170)
      context.restore()
    }

    roundedRect(54, 48, 1092, 92, 28)
    context.save()
    context.clip()
    const headerGradient = context.createLinearGradient(54, 48, 1146, 140)
    headerGradient.addColorStop(0, forest)
    headerGradient.addColorStop(0.72, deepForest)
    headerGradient.addColorStop(1, coral)
    context.fillStyle = headerGradient
    context.fillRect(54, 48, 1092, 92)
    context.restore()

    if (logoImage.complete && logoImage.naturalWidth > 0) {
      context.save()
      roundedRect(76, 66, 52, 52, 11)
      context.clip()
      context.fillStyle = '#ffffff'
      context.fillRect(76, 66, 52, 52)
      context.drawImage(logoImage, 78, 68, 48, 48)
      context.restore()
    }

    context.fillStyle = '#ffffff'
    context.font = '700 25px system-ui, sans-serif'
    context.fillText('BRITISH EDUCATION & IMMIGRATION · SANGARIA', 146, 105, 780)
    context.font = '700 15px ui-monospace, monospace'
    context.fillText(`BEI · ${year}`, 1000, 106)

    context.fillStyle = forest
    context.font = '700 15px ui-monospace, monospace'
    context.fillText('PASSENGER', 92, 192)
    context.font = '800 36px system-ui, sans-serif'
    context.fillText(passName, 92, 238, 430)

    context.font = '700 14px ui-monospace, monospace'
    context.fillText('ORIGIN', 92, 302)
    context.fillText('DESTINATION', 646, 302)
    context.font = '900 52px system-ui, sans-serif'
    context.fillText(orgCode, 92, 366)
    context.fillText(destCode, 646, 366)
    context.font = '600 19px system-ui, sans-serif'
    context.fillText(displayOrigin.split('(')[0].trim(), 92, 398, 420)
    context.fillText(displayDest.split('(')[0].trim(), 646, 398, 410)

    context.strokeStyle = coral
    context.lineWidth = 3
    context.setLineDash([8, 9])
    context.beginPath()
    context.moveTo(92, 430)
    context.lineTo(1054, 430)
    context.stroke()
    context.setLineDash([])

    context.font = '700 15px ui-monospace, monospace'
    context.fillText('VISA GOAL', 92, 474)
    context.fillText('INTAKE', 646, 474)
    context.font = '700 21px system-ui, sans-serif'
    context.fillText(displayVisa, 92, 508, 450)
    context.fillText(displayIntake, 646, 508, 380)

    context.fillStyle = forest
    context.font = '600 12px system-ui, sans-serif'
    context.fillText('Priority Desk: British Education & Immigration · Near Open Book Library, Bhagatpura Road, Sangaria · Helpline: +91 9772570478', 92, 550, 1035)

    const link = document.createElement('a')
    link.download = `BEI-boarding-pass-${passName.replace(/[^A-Z0-9]+/gi, '-') || year}.png`
    link.href = canvas.toDataURL('image/png')
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <section id="boarding-pass-section" className="relative overflow-hidden bg-forest-950 py-16 px-4 sm:px-6 border-y border-white/10 text-white">
      <div className="relative mx-auto max-w-5xl">
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
                onClick={() => {
                  setFlipped(false)
                  setOpen(true)
                }}
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
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10 mb-4">
              <span className="text-sm font-extrabold text-white">✨ Your Boarding Pass is Ready!</span>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  aria-label={flipped ? 'Show the front of the boarding pass' : 'Flip to the back of the boarding pass'}
                  aria-pressed={flipped}
                  onClick={() => setFlipped((current) => !current)}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white/10 px-3 text-xs font-semibold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-400"
                >
                  <RotateCcw className="size-3.5 text-coral-400" />
                  <span>{flipped ? 'Show front' : 'Flip pass'}</span>
                </button>
                <button
                  type="button"
                  aria-label="Close boarding pass"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-1.5 text-white/70 hover:text-white transition"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div style={{ perspective: '1100px' }}>
              <div
                className="grid transition-transform duration-700 motion-reduce:transition-none"
                style={{
                  gridTemplateAreas: '"ticket"',
                  transformStyle: 'preserve-3d',
                  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                <div
                  aria-hidden={flipped}
                  style={{ gridArea: 'ticket', backfaceVisibility: 'hidden' }}
                >
                {/* Front of the pass */}
              <div className="rounded-2xl bg-cream text-forest-950 shadow-2xl border border-forest-900/15 overflow-hidden">
                <div className="ticket-hologram px-4 py-2.5 text-white flex items-center justify-between">
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
                </div>
                <div
                  aria-hidden={!flipped}
                  style={{
                    gridArea: 'ticket',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="rounded-2xl border border-forest-900/15 bg-cream text-forest-900 shadow-2xl overflow-hidden">
                    <div className="ticket-hologram flex flex-col gap-1.5 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-[10px] font-black leading-tight tracking-wide sm:text-xs">PRE-DEPARTURE CLEARANCE CHECKLIST</span>
                      <span className="w-fit rounded-full bg-coral-500 px-2 py-0.5 font-mono text-[9px] font-bold uppercase">BACK SIDE</span>
                    </div>
                    <div className="bg-cream p-4 sm:p-5">
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-b border-forest-900/10 pb-3">
                        <div className="min-w-0">
                          <span className="block font-mono text-[9px] font-bold uppercase text-forest-900/60">Passenger</span>
                          <span className="mt-0.5 block break-words text-sm font-extrabold text-forest-900">{passName}</span>
                        </div>
                        <div className="min-w-0 text-left sm:text-right">
                          <span className="block font-mono text-[9px] font-bold uppercase text-forest-900/60">Destination</span>
                          <span className="mt-0.5 block break-words text-sm font-extrabold text-forest-900">{displayDest}</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 rounded-lg border border-forest-900/10 bg-white/75 px-3 py-2">
                          <span className="font-mono text-xs font-black text-coral-600">1.</span>
                          <span className="text-xs font-bold leading-snug text-forest-900 sm:text-sm">Profile &amp; Country Match</span>
                        </div>
                        <div className="flex items-center gap-2.5 rounded-lg border border-forest-900/10 bg-white/75 px-3 py-2">
                          <span className="font-mono text-xs font-black text-coral-600">2.</span>
                          <span className="text-xs font-bold leading-snug text-forest-900 sm:text-sm">IELTS / PTE Target Score</span>
                        </div>
                        <div className="flex items-center gap-2.5 rounded-lg border border-forest-900/10 bg-white/75 px-3 py-2">
                          <span className="font-mono text-xs font-black text-coral-600">3.</span>
                          <span className="text-xs font-bold leading-snug text-forest-900 sm:text-sm">University Offer Letter</span>
                        </div>
                        <div className="flex items-center gap-2.5 rounded-lg border border-forest-900/10 bg-white/75 px-3 py-2">
                          <span className="font-mono text-xs font-black text-coral-600">4.</span>
                          <span className="text-xs font-bold leading-snug text-forest-900 sm:text-sm">Embassy File &amp; Biometrics</span>
                        </div>
                      </div>
                      <div className="mt-3 rounded-xl border border-coral-500/25 bg-white/80 p-3">
                        <p className="text-xs font-extrabold leading-snug text-forest-900 sm:text-sm">📍 Priority Desk: British Education &amp; Immigration</p>
                        <p className="mt-1 break-words text-[11px] leading-relaxed text-forest-900/75 sm:text-xs">Near Open Book Library, Bhagatpura Road, Sangaria · Helpline: +91 9772570478</p>
                      </div>
                    </div>
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
                onClick={handleDownloadPassImage}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-forest-800 py-3 px-4 text-xs font-bold text-white shadow-lg transition hover:bg-forest-700 active:scale-[0.98] cursor-pointer"
              >
                <Download className="size-4 text-coral-400" />
                <span>Download pass image</span>
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
                onClick={handleMakeReal}
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
