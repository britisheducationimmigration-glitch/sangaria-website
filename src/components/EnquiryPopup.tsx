import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { EnquiryForm } from './EnquiryForm'
import { getPublicContent } from '@/lib/public-functions'

const popupStages = [
  { delay: 8, title: 'Free profile evaluation', message: 'Planning to study, work or settle abroad?' },
  { delay: 32, title: 'Still thinking?', message: 'Let our visa expert guide your next step.' },
  { delay: 58, title: 'Need a quick answer?', message: 'Speak to a counselling expert before you miss this opportunity.' },
  { delay: 89, title: 'Last chance to connect', message: 'Book a free consultation for your study, work or PR plan.' },
]

const POPUP_STATE_KEY = 'bei-enquiry-popup-state'

type PopupState = {
  skip58AfterSecondDismiss: boolean
}

function readPopupState(): PopupState {
  try {
    const raw = window.sessionStorage.getItem(POPUP_STATE_KEY)
    if (!raw) return { skip58AfterSecondDismiss: false }
    const parsed = JSON.parse(raw) as Partial<PopupState>
    return {
      skip58AfterSecondDismiss: Boolean(parsed.skip58AfterSecondDismiss),
    }
  } catch {
    return { skip58AfterSecondDismiss: false }
  }
}

function writePopupState(state: PopupState) {
  try {
    window.sessionStorage.setItem(POPUP_STATE_KEY, JSON.stringify(state))
  } catch {
    // ignore session storage issues
  }
}

export function EnquiryPopup() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const [open, setOpen] = useState(false)
  const [currentStage, setCurrentStage] = useState(0)
  const [enabled, setEnabled] = useState(true)
  const [skip58AfterSecondDismiss, setSkip58AfterSecondDismiss] = useState(() => readPopupState().skip58AfterSecondDismiss)
  const timerRefs = useRef<number[]>([])

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
    writePopupState({ skip58AfterSecondDismiss })
  }, [skip58AfterSecondDismiss])

  useEffect(() => {
    if (!enabled || pathname.startsWith('/admin') || open) return

    const pendingStages = popupStages.filter((_, index) => {
      if (index === 2 && skip58AfterSecondDismiss) return false
      return true
    })

    const timers = pendingStages.map((stage) => {
      const stageIndex = popupStages.findIndex((item) => item.delay === stage.delay)
      return window.setTimeout(() => {
        setCurrentStage(stageIndex)
        setOpen(true)
      }, stage.delay * 1000)
    })

    timerRefs.current = timers

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [enabled, open, pathname, skip58AfterSecondDismiss])

  if (!open || pathname.startsWith('/admin')) return null

  function close() {
    if (currentStage === 1) {
      setSkip58AfterSecondDismiss(true)
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
