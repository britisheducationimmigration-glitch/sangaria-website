import { useId } from 'react'
import { ArrowUpRight, Star } from 'lucide-react'
import { googleReviewUrl } from '@/data/google-review'

export function GoogleReviewCta() {
  const headingId = useId()

  return (
    <section
      aria-labelledby={headingId}
      className="mx-5 my-8 max-w-7xl rounded-3xl border border-forest-900/10 bg-white p-5 shadow-sm sm:p-6 lg:mx-auto lg:my-10"
    >
      <div className="flex min-w-0 flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-coral-600">
            <Star aria-hidden="true" className="size-3.5 fill-current" />
            Share your experience
          </p>
          <h2 id={headingId} className="mt-2 text-xl font-extrabold text-forest-900 sm:text-2xl">
            Had a good experience with us?
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-forest-900/65">
            Your Google review helps students and families choose their next step.
          </p>
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-coral-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-coral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-600 sm:w-fit"
          >
            Write a Google review
            <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
          </a>
        </div>

        <div className="hidden shrink-0 items-center gap-3 rounded-2xl border border-forest-900/10 bg-forest-50 p-3 lg:flex">
          <img
            src="/img/google-review-qr.svg"
            alt="Google review QR code"
            width={700}
            height={700}
            loading="lazy"
            decoding="async"
            className="size-40 rounded-xl bg-white object-contain p-1"
          />
          <p className="max-w-24 text-xs font-semibold leading-relaxed text-forest-900/70">
            Scan with your phone to leave a review.
          </p>
        </div>
      </div>
    </section>
  )
}
