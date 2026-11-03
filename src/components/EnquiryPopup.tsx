import { X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { EnquiryForm } from './EnquiryForm'
import type { SiteSettings } from '@/lib/content-types'

const POPUP_DONE_KEY = 'bei-enquiry-popup-submitted'
const POPUP_DISMISSED_KEY = 'bei-enquiry-popup-dismissed'

function hasInteractedWithPopup(): boolean {
  try {
    return (
      window.sessionStorage.getItem(POPUP_DONE_KEY) === '1' ||
      window.sessionStorage.getItem(POPUP_DISMISSED_KEY) === '1'
    )
  } catch {
    return false
  }
}

function markPopupSubmitted() {
  try {
    window.sessionStorage.setItem(POPUP_DONE_KEY, '1')
  } catch {
    // ignore
  }
}

function markPopupDismissed() {
  try {
    window.sessionStorage.setItem(POPUP_DISMISSED_KEY, '1')
  } catch {
    // ignore
  }
}

export function EnquiryPopup({ settings }: { settings: Pick<SiteSettings, 'popupEnabled' | 'popupDelaySeconds'> }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [open, setOpen] = useState(false)
  const [interacted, setInteracted] = useState(() => hasInteractedWithPopup())
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (interacted || !settings.popupEnabled || pathname.startsWith('/admin') || open) return

    const safeDelay = Math.min(60, Math.max(3, Number(settings.popupDelaySeconds) || 8))
    const timer = window.setTimeout(() => setOpen(true), safeDelay * 1000)
    return () => window.clearTimeout(timer)
  }, [interacted, settings.popupEnabled, settings.popupDelaySeconds, pathname, open])

  const close = useCallback(() => {
    markPopupDismissed()
    setInteracted(true)
    setOpen(false)
  }, [])

  const handleSuccess = useCallback(() => {
    markPopupSubmitted()
    setInteracted(true)
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open || pathname.startsWith('/admin')) return

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    const previousBodyOverflow = document.body.style.overflow
    const dialog = dialogRef.current
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const focusableElements = () => Array.from(
      dialog?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    ).filter((element) => element.getClientRects().length > 0)

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = focusableElements()
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) {
        event.preventDefault()
        dialog?.focus()
        return
      }
      if (!dialog?.contains(document.activeElement)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousBodyOverflow
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [open, close, pathname])

  if (!open || pathname.startsWith('/admin') || interacted) return null

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[60] grid place-items-center bg-forest-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-popup-title"
      aria-describedby="enquiry-popup-description"
      tabIndex={-1}
    >
      <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[1.5rem] bg-forest-900 p-5 text-white shadow-2xl sm:p-8">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={close}
          aria-label="Close enquiry form"
          className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-coral-500/30 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X className="size-5" />
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral-400">
          Free profile evaluation
        </p>
        <h2 id="enquiry-popup-title" className="mt-3 pr-8 text-2xl font-extrabold sm:text-3xl">
          Planning to study, work or settle abroad?
        </h2>
        <p id="enquiry-popup-description" className="mt-2 mb-6 text-sm text-forest-100/70">
          Share your details and a counsellor will call within one working day.
        </p>
        <EnquiryForm source="popup" dark compact onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
