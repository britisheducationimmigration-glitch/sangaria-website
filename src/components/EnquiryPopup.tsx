import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { EnquiryForm } from './EnquiryForm'
import { getPublicContent } from '@/lib/public-functions'

export function EnquiryPopup() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [open, setOpen] = useState(false)
  const [delay, setDelay] = useState(8)
  const [enabled, setEnabled] = useState(true)
  const [hasSeen, setHasSeen] = useState(false)

  useEffect(() => {
    let active = true
    getPublicContent().then((content) => {
      if (!active) return
      setEnabled(content.settings.popupEnabled)
      setDelay(content.settings.popupDelaySeconds)
    }).catch(() => undefined)
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (window.sessionStorage.getItem('bei-enquiry-seen')) {
      setHasSeen(true)
      return
    }
    if (!enabled || pathname.startsWith('/admin')) return
    const timer = window.setTimeout(() => setOpen(true), delay * 1000)
    return () => window.clearTimeout(timer)
  }, [delay, enabled, pathname])

  if (!open || pathname.startsWith('/admin') || hasSeen) return null
  function close() {
    sessionStorage.setItem('bei-enquiry-seen', '1')
    setOpen(false)
  }
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-forest-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Free profile evaluation">
      <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[1.5rem] bg-forest-900 p-5 text-white shadow-2xl sm:p-8">
        <button type="button" onClick={close} aria-label="Close enquiry form" className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-coral-500">
          <X className="size-5" />
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral-400">Free profile evaluation</p>
        <h2 className="mt-3 pr-8 text-2xl font-extrabold sm:text-3xl">Planning to study, work or settle abroad?</h2>
        <p className="mt-2 mb-6 text-sm text-forest-100/70">Share your details and a counsellor will call within one working day.</p>
        <EnquiryForm source="popup" dark compact onSuccess={close} />
      </div>
    </div>
  )
}
