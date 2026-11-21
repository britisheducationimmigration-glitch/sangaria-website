import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLoaderData, useRouterState } from "@tanstack/react-router";
import { EnquiryForm } from "./EnquiryForm";

const POPUP_DONE_KEY = "bei-enquiry-popup-submitted";
const POPUP_DISMISSED_KEY = "bei-enquiry-popup-dismissed";

function isSuppressedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/attendance") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/eligibility") ||
    pathname.startsWith("/study-plan")
  );
}

function hasInteractedWithPopup(): boolean {
  try {
    return (
      window.sessionStorage.getItem(POPUP_DONE_KEY) === "1" ||
      window.sessionStorage.getItem(POPUP_DISMISSED_KEY) === "1"
    );
  } catch {
    return false;
  }
}

function markPopupSubmitted() {
  try {
    window.sessionStorage.setItem(POPUP_DONE_KEY, "1");
  } catch {
    // ignore
  }
}

function markPopupDismissed() {
  try {
    window.sessionStorage.setItem(POPUP_DISMISSED_KEY, "1");
  } catch {
    // ignore
  }
}

export function EnquiryPopup() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const rootData = useLoaderData({ from: "__root__" });
  const enabled = rootData?.settings.popupEnabled ?? true;
  const delaySeconds = rootData?.settings.popupDelaySeconds ?? 30;
  const suppressed = isSuppressedPath(pathname);
  const [open, setOpen] = useState(false);
  const [interacted, setInteracted] = useState(() => hasInteractedWithPopup());
  const [sharePromptOpen, setSharePromptOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (interacted || !enabled || suppressed || open) return;

    // Minimum 30s safe delay so users can read content and explore tools without being nagged
    const safeDelay = Math.min(90, Math.max(30, Number(delaySeconds) || 30));

    const timer = window.setTimeout(() => {
      // Non-intrusive check: Suppress if user is actively filling another tool or another modal is open
      const activeEl = document.activeElement;
      const isUserTyping =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT");
      const isOtherModalOpen = Boolean(
        document.querySelector('[role="dialog"]:not(#enquiry-popup-root)'),
      );

      if (isUserTyping || isOtherModalOpen) {
        // User is engaged in a task; postpone popup by another 25s
        const retryTimer = window.setTimeout(() => {
          if (
            !hasInteractedWithPopup() &&
            !isSuppressedPath(window.location.pathname)
          ) {
            setOpen(true);
          }
        }, 25_000);
        return () => window.clearTimeout(retryTimer);
      }

      setOpen(true);
    }, safeDelay * 1000);

    return () => window.clearTimeout(timer);
  }, [interacted, enabled, delaySeconds, suppressed, open]);

  const close = useCallback(() => {
    markPopupDismissed();
    setInteracted(true);
    setOpen(false);
  }, []);

  const handleSuccess = useCallback(() => {
    markPopupSubmitted();
    setInteracted(true);
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open || sharePromptOpen || suppressed) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousBodyOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const focusableElements = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => element.getClientRects().length > 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = focusableElements();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        dialog?.focus();
        return;
      }
      if (!dialog?.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [open, close, suppressed, sharePromptOpen]);

  if (!open || suppressed || interacted) return null;

  return (
    <div
      id="enquiry-popup-root"
      ref={dialogRef}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
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
        <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-coral-400">
          Free profile evaluation
        </p>
        <h2
          id="enquiry-popup-title"
          className="mt-3 pr-8 text-2xl font-extrabold sm:text-3xl"
        >
          Planning to study, work or settle abroad?
        </h2>
        <p
          id="enquiry-popup-description"
          className="mt-2 mb-6 text-sm text-forest-100/70"
        >
          Share your details and a counsellor will call within one working day.
        </p>
        <EnquiryForm
          source="popup"
          dark
          compact
          onSuccess={handleSuccess}
          onSharePromptChange={setSharePromptOpen}
        />
      </div>
    </div>
  );
}
