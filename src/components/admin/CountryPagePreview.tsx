import { useState } from 'react'
import { Monitor, Smartphone } from 'lucide-react'
import { CountryPageView } from '@/components/CountryPageView'
import type { Country } from '@/data/fixtures'
import type { VisaGuidance } from '@/data/visa-guidance'

export function CountryPagePreview({ content }: {
  content: { country: Country; guidance: VisaGuidance }
}) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const { country, guidance } = content

  return (
    <section className="rounded-3xl border border-[#E4E7EC] bg-white p-4 shadow-xs space-y-3">
      {/* Top Browser Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E7EC] pb-3">
        <div className="flex items-center gap-2">
          {/* Browser window controls */}
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-400" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="font-mono text-[11px] text-[#667085] bg-[#F2F4F7] px-2.5 py-0.5 rounded-md truncate max-w-[260px] sm:max-w-xs">
            /countries/{country?.slug || 'canada'}
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] p-0.5">
          <button
            type="button"
            onClick={() => setViewMode('desktop')}
            className={'inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition ' + (
              viewMode === 'desktop' ? 'bg-white text-[#465FFF] shadow-2xs font-bold' : 'text-[#667085] hover:text-[#1D2939]'
            )}
          >
            <Monitor className="size-3.5" /> Desktop
          </button>
          <button
            type="button"
            onClick={() => setViewMode('mobile')}
            className={'inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition ' + (
              viewMode === 'mobile' ? 'bg-white text-[#465FFF] shadow-2xs font-bold' : 'text-[#667085] hover:text-[#1D2939]'
            )}
          >
            <Smartphone className="size-3.5" /> Mobile
          </button>
        </div>
      </div>

      {/* Real Public Page View Container */}
      <div className="max-h-[820px] overflow-y-auto overscroll-contain rounded-2xl border border-[#E4E7EC] bg-[#0E1B15]">
        <div className={'mx-auto transition-all duration-200 ' + (
          viewMode === 'mobile' ? 'max-w-[420px] border-x border-white/10 shadow-2xl' : 'w-full'
        )}>
          <CountryPageView country={country} guidance={guidance} preview={true} />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#667085] pt-1">
        <span className="font-semibold text-emerald-700">✓ 100% Real Public Website Component</span>
        <span className="font-mono">{viewMode === 'mobile' ? 'Mobile Viewport (420px)' : 'Full Desktop View'}</span>
      </div>
    </section>
  )
}