import { useState } from 'react'
import { GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  const [imgError, setImgError] = useState(false)

  return (
    <span className={cn('flex min-w-0 items-center gap-2 sm:gap-2.5', className)}>
      {!imgError ? (
        <img
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310519664045228795/VqtFGwaGtbWyvcCS"
          onError={() => setImgError(true)}
          alt="British Education & Immigration"
          className="size-10 shrink-0 rounded-xl bg-white object-contain p-0.5 shadow-[3px_3px_0_0] shadow-forest-950/50 sm:size-11"
        />
      ) : (
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-forest-800 to-forest-950 text-coral-400 shadow-[3px_3px_0_0] shadow-forest-950/50 sm:size-11 ring-1 ring-white/10">
          <GraduationCap className="size-6 text-coral-400" />
        </span>
      )}
      <span className="leading-none">
        <span className={cn('block truncate font-display text-[14px] font-extrabold tracking-tight sm:text-[17px]', light ? 'text-white' : 'text-forest-900')}>
          British Education
        </span>
        <span className={cn('block truncate text-[9px] font-semibold uppercase tracking-[0.18em] sm:text-[10.5px] sm:tracking-[0.22em]', light ? 'text-coral-400' : 'text-coral-600')}>
          & Immigration
        </span>
      </span>
    </span>
  )
}
