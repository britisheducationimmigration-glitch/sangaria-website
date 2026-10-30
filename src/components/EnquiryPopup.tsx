import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { EnquiryForm } from './EnquiryForm'
import { getPublicContent } from '@/lib/public-functions'

const popupStages = [
  { delay: 8, title: 'Free profile evaluation', message: 'Planning to study, work or settle abroad?' },
  { delay: 32, title: 'Still thinking?', message: 'Let our visa expert guide your next step.' },
  { delay: 58, title: 'Need a quick answer?', message: 'Speak to a counselling expert before you miss this opportunity.' },
  { delay: 89, title: 'Last chance to connect', message: 'Book a free consultation for your study, work or PR plan.' },
]

export function EnquiryPopup() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [open, setOpen] = useState(false)
  const [currentStage, setCurrentStage] = useState(0)
  const [enabled, setEnabled] = useState(true)
  const [hasDismissedSecondTime, setHasDismissedSecondTime] = useState(false)

  useEffect(() => {
    let active = true
    getPublicContent()
      .then((content) => {
        if (!active) return
        setEnabled(content.settings.popupEnabled)
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!enabled || pathname.startsWith('/admin')) return

    const timers = popupStages.map((stage) => {
      const isSecondStage = stage.delay === 58
      const isThirdStage = stage.delay === 89

      return window.setTimeout(() => {
        if (isSecondStage && hasDismissedSecondTime) {
          return
        }

        if (isThirdStage && hasDismissedSecondTime) {
          setCurrentStage(3)
          setOpen(true)
          return
        }

        setCurrentStage(popupStages.findIndex((item) => item.delay === stage.delay))
        setOpen(true)
      }, stage.delay * 1000)
    })

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [enabled, pathname, hasDismissedSecondTime])

  if (!open || pathname.startsWith('/admin')) return null

  function close() {
    const stageIndex = currentStage

    if (stageIndex === 1) {
      setHasDismissedSecondTime(true)
    }

    setOpen(false)
  }

  const stage = popupStages[currentStage] ?? popupStages[0]

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-forest-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={stage.title}>
      <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[1.5rem] bg-forest-900 p-5 text-white shadow-2xl sm:p-8">
        <button type="button" onClick={close} aria-label="Close enquiry form" className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-coral-500/30 transition">
          <X className="size-5" />
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral-400">{stage.title}</p>
        <h2 className="mt-3 pr-8 text-2xl font-extrabold sm:text-3xl">{stage.message}</h2>
        <p className="mt-2 mb-6 text-sm text-forest-100/70">Share your details and a counsellor will call within one working day.</p>
        <EnquiryForm source="popup" dark compact onSuccess={close} />
      </div>
    </div>
  )
}
