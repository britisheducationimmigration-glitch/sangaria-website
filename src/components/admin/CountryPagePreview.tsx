import { useState } from 'react'
import { CheckCircle2, Clock, DollarSign, ShieldCheck } from 'lucide-react'
import type { Country } from '@/data/fixtures'
import type { VisaGuidance } from '@/data/visa-guidance'

export function CountryPagePreview({ content }: {
  content: { country: Country; guidance: VisaGuidance }
}) {
  const [activeTab, setActiveTab] = useState<'hero' | 'guide' | 'visa'>('hero')
  const { country, guidance } = content

  return (
    <section className="sticky top-6 rounded-3xl border border-[#E4E7EC] bg-white p-5 shadow-xs space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#465FFF]">
            Live Website Preview
          </span>
          <h4 className="mt-0.5 text-base font-extrabold text-[#1D2939]">
            {country.flag || '🌐'} {country.name || 'Country Preview'}
          </h4>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] p-1 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('hero')}
            className={'rounded px-2.5 py-1 transition ' + (activeTab === 'hero' ? 'bg-white text-[#465FFF] shadow-2xs font-bold' : 'text-[#667085] hover:text-[#1D2939]')}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={'rounded px-2.5 py-1 transition ' + (activeTab === 'guide' ? 'bg-white text-[#465FFF] shadow-2xs font-bold' : 'text-[#667085] hover:text-[#1D2939]')}
          >
            Study
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('visa')}
            className={'rounded px-2.5 py-1 transition ' + (activeTab === 'visa' ? 'bg-white text-[#465FFF] shadow-2xs font-bold' : 'text-[#667085] hover:text-[#1D2939]')}
          >
            Visa
          </button>
        </div>
      </div>

      {/* Tab 1: Hero & Overview Preview */}
      {activeTab === 'hero' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#D0E1FD] bg-[#F4F8FF] p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{country.flag || '🌐'}</span>
              <span className="rounded-md bg-white px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#465FFF] border border-[#D0E1FD]">
                {country.code || 'ISO'} · Study Destination
              </span>
            </div>
            <h5 className="text-base font-extrabold text-[#1D2939] leading-snug">
              {country.headline || 'Headline will appear here…'}
            </h5>
            <p className="text-xs text-[#475467] leading-relaxed line-clamp-3">
              {country.intro || 'Country introduction summary will appear here…'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-2.5">
              <p className="text-[10px] font-semibold text-[#667085]">English Requirement</p>
              <p className="mt-0.5 font-bold text-[#1D2939] line-clamp-2">
                {country.english || 'IELTS / PTE indicative score'}
              </p>
            </div>
            <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-2.5">
              <p className="text-[10px] font-semibold text-[#667085]">Main Intakes</p>
              <p className="mt-0.5 font-bold text-[#1D2939] line-clamp-2">
                {country.intakes.length ? country.intakes.join(', ') : 'Fall / Winter'}
              </p>
            </div>
          </div>

          {country.highlights.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">Key Highlights</p>
              <div className="flex flex-wrap gap-1.5">
                {country.highlights.map((h, i) => (
                  <span key={i} className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="size-3 text-emerald-600" /> {h}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Study Guide Preview */}
      {activeTab === 'guide' && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-[#E4E7EC] bg-[#F9FAFB] p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1D2939]">
              <DollarSign className="size-3.5 text-[#465FFF]" />
              <span>Tuition &amp; Living Costs</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-white p-2 border border-[#E4E7EC]">
                <span className="block text-[10px] text-[#667085]">Annual Tuition</span>
                <strong className="text-xs text-[#1D2939]">{country.studyGuide.annualTuition || 'Not specified'}</strong>
              </div>
              <div className="rounded-lg bg-white p-2 border border-[#E4E7EC]">
                <span className="block text-[10px] text-[#667085]">Living Funds / GIC</span>
                <strong className="text-xs text-[#1D2939]">{country.studyGuide.livingCost || 'Not specified'}</strong>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E4E7EC] bg-[#F9FAFB] p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1D2939]">
              <Clock className="size-3.5 text-[#465FFF]" />
              <span>Work Rights &amp; Post-Study</span>
            </div>
            <div className="text-xs space-y-1 text-[#475467]">
              <p><strong className="text-[#1D2939]">Part-time Work:</strong> {country.studyGuide.workWhileStudying || 'Standard on-campus/off-campus'}</p>
              <p><strong className="text-[#1D2939]">Post-Study Visa:</strong> {country.studyGuide.postStudyOption || 'Post-graduate work permit'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Visa Guidance Preview */}
      {activeTab === 'visa' && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-[#E4E7EC] bg-[#F9FAFB] p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#1D2939]">
                <ShieldCheck className="size-3.5 text-[#465FFF]" /> Official Visa Rules
              </span>
              {guidance.lastVerified && (
                <span className="font-mono text-[10px] text-[#667085]">
                  Verified {guidance.lastVerified}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-[#1D2939]">{guidance.feeSummary || 'Visa application fee guidelines'}</p>
            {guidance.caveat && (
              <p className="rounded-lg bg-amber-50 p-2 text-[11px] leading-relaxed text-amber-800 border border-amber-200">
                ⚠️ {guidance.caveat}
              </p>
            )}
          </div>

          {guidance.requirements.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">Embassy Requirements ({guidance.requirements.length})</p>
              <ul className="space-y-1 text-xs text-[#475467]">
                {guidance.requirements.slice(0, 3).map((req, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#465FFF]">•</span>
                    <span>{req}</span>
                  </li>
                ))}
                {guidance.requirements.length > 3 && (
                  <li className="text-[11px] text-[#667085] pl-3">+ {guidance.requirements.length - 3} more requirements</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-[#E4E7EC] pt-3 text-[11px] text-[#667085]">
        <span>Public URL: <strong className="text-[#1D2939]">/countries/{country.slug || 'slug'}</strong></span>
        <span>Updates live as you type</span>
      </div>
    </section>
  )
}