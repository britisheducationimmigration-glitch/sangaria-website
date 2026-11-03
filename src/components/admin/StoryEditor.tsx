import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { ImagePlus } from 'lucide-react'
import { ApprovalCard, TestimonialCard } from '@/components/Cards'
import { deleteStory, saveStory } from '@/lib/admin-functions'
import type { AdminStory } from '@/lib/content-types'

type StoryDraft = AdminStory & { photoBase64: string; photoMimeType: string }

async function preparePhoto(file: File) {
  if (!file.type.startsWith('image/')) throw new Error('Choose a JPG, PNG or WebP image.')
  if (file.size > 15 * 1024 * 1024) throw new Error('Choose an image smaller than 15 MB.')
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not prepare this image.')
  context.imageSmoothingQuality = 'high'
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => value ? resolve(value) : reject(new Error('Could not prepare this image.')), 'image/webp', 0.82)
  })
  if (blob.size > 1.5 * 1024 * 1024) throw new Error('The prepared image is still too large. Choose a smaller photo.')
  const imageSrc = URL.createObjectURL(blob)
  const imageBase64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? '').split(',')[1] ?? '')
    reader.onerror = () => reject(new Error('Could not read this image.'))
    reader.readAsDataURL(blob)
  })
  return { imageSrc, imageBase64, imageMimeType: 'image/webp' }
}

export function StoryEditor({ item, onReload, onNotice, onClose }: {
  item: AdminStory
  onReload: () => Promise<void>
  onNotice: (message: string) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<StoryDraft>(() => ({ ...item, photoBase64: '', photoMimeType: '' }))
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState(false)
  const [error, setError] = useState('')
  const previewUrl = useRef('')

  useEffect(() => () => {
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current)
  }, [])

  function releasePreview() {
    if (previewUrl.current) {
      URL.revokeObjectURL(previewUrl.current)
      previewUrl.current = ''
    }
  }
  function update<K extends keyof StoryDraft>(key: K, value: StoryDraft[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setError('')
  }
  function selectMediaType(mediaType: AdminStory['mediaType']) {
    if (mediaType !== 'photo') releasePreview()
    setForm((current) => ({
      ...current,
      mediaType,
      photoSrc: mediaType === 'photo' ? current.photoSrc : '',
      photoBase64: mediaType === 'photo' ? current.photoBase64 : '',
      photoMimeType: mediaType === 'photo' ? current.photoMimeType : '',
      videoUrl: mediaType === 'video' ? current.videoUrl : '',
      mediaAlt: mediaType === 'none' ? '' : current.mediaAlt,
      mediaConsent: mediaType === current.mediaType ? current.mediaConsent : false,
    }))
    setError('')
  }
  async function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return
    try {
      const photo = await preparePhoto(file)
      releasePreview()
      previewUrl.current = photo.imageSrc
      setForm((current) => ({ ...current, mediaType: 'photo', photoSrc: photo.imageSrc, photoBase64: photo.imageBase64, photoMimeType: photo.imageMimeType, videoUrl: '', mediaConsent: false }))
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not prepare this image.')
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (form.kind === 'approval' && form.mediaType !== 'none' && form.published && !form.mediaConsent) {
      setError('Confirm that the student has agreed to public use of this photo or video before publishing.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await saveStory({ data: form })
      releasePreview()
      await onReload()
      onNotice('Success story saved.')
      onClose()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save the story. Check the fields.')
    } finally {
      setBusy(false)
    }
  }
  async function remove() {
    if (!form.id || !window.confirm('Delete this story?')) return
    setBusy(true)
    try {
      await deleteStory({ data: { id: form.id } })
      releasePreview()
      await onReload()
      onNotice('Story deleted.')
      onClose()
    } catch {
      setError('Could not delete this story.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-forest-900/10">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral-600">Success stories</p>
          <h3 className="text-xl font-extrabold">Story editor</h3>
          <p className="mt-1 text-xs leading-relaxed text-forest-900/55">Add approval details and, when available, a student photo or hosted video. Published entries appear on Success Stories; choose separately whether each story is highlighted on the home page.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" aria-pressed={preview} onClick={() => setPreview((value) => !value)} className={'rounded-full px-4 py-2 text-xs font-bold ring-1 ring-forest-900/15 ' + (preview ? 'bg-coral-500 text-white ring-coral-500' : 'bg-white text-forest-900')}>{preview ? 'Back to edit' : 'Preview'}</button>
          <button type="button" onClick={onClose} className="text-sm font-bold text-forest-900/50">Close</button>
        </div>
      </div>
      {error && <p role="alert" className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">{error}</p>}
      {preview ? (
        <div className="rounded-2xl bg-forest-50 p-4 sm:p-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-coral-600">Public card preview · unsaved changes</p>
          <div className="mx-auto mt-3 max-w-md">{form.kind === 'approval' ? <ApprovalCard a={form} /> : <TestimonialCard t={form} />}</div>
          <p className="mt-3 text-xs text-forest-900/55">Preview changes only; they reach the website after you save.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <StoryField label="Story type" hint="Use approval for a visa result or testimonial for a client quote.">
              <select className="field" value={form.kind} onChange={(event) => {
                const kind = event.currentTarget.value as AdminStory['kind']
                if (kind === 'testimonial') {
                  releasePreview()
                  setForm((current) => ({ ...current, kind, mediaType: 'none', photoSrc: '', photoBase64: '', photoMimeType: '', videoUrl: '', mediaAlt: '', mediaConsent: false }))
                } else update('kind', kind)
              }}>
                <option value="testimonial">Client testimonial</option><option value="approval">Visa approval</option>
              </select>
            </StoryField>
            <StoryField label="Person / family name"><input className="field" value={form.name} onChange={(event) => update('name', event.currentTarget.value)} placeholder="Client name" required /></StoryField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <StoryField label="City"><input className="field" value={form.city} onChange={(event) => update('city', event.currentTarget.value)} placeholder="Sangaria" /></StoryField>
            <StoryField label="Destination country"><input className="field" value={form.country} onChange={(event) => update('country', event.currentTarget.value)} placeholder="Canada, United Kingdom or Australia" /></StoryField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <StoryField label="Visa / course"><input className="field" value={form.visa} onChange={(event) => update('visa', event.currentTarget.value)} placeholder="Study Permit, Student Visa, IELTS…" /></StoryField>
            <StoryField label="Flag code / emoji (optional)" hint="Example: CA, UK, AU or a flag emoji."><input className="field" value={form.flag} onChange={(event) => update('flag', event.currentTarget.value)} placeholder="CA or 🇨🇦" /></StoryField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <StoryField label="Initials"><input className="field" value={form.initials} onChange={(event) => update('initials', event.currentTarget.value)} placeholder="HK" /></StoryField>
            <StoryField label="Approval / story date"><input className="field" type="date" value={form.date} onChange={(event) => update('date', event.currentTarget.value)} /></StoryField>
          </div>
          <StoryField label="Rating (1 to 5 stars)"><input className="field" type="number" min="1" max="5" value={form.rating} onChange={(event) => update('rating', Number(event.currentTarget.value))} /></StoryField>
          <StoryField label="Client quote" hint="For an approval, add a short result description.">
            <textarea className="field" rows={5} value={form.quote} onChange={(event) => update('quote', event.currentTarget.value)} placeholder="My visa was approved…" />
          </StoryField>
          <StoryField label="Short result note" hint="Example: September intake · MSc Data Science">
            <input className="field" value={form.note} onChange={(event) => update('note', event.currentTarget.value)} placeholder="Extra result detail shown on the card" />
          </StoryField>
          {form.kind === 'approval' && (
            <section className="grid gap-4 rounded-2xl border border-forest-900/10 bg-cream/70 p-4 sm:p-5" aria-label="Approval photo or video">
              <div>
                <h4 className="font-bold text-forest-900">Student photo or video <span className="font-normal text-forest-900/50">(optional)</span></h4>
                <p className="mt-1 text-xs leading-relaxed text-forest-900/60">Photos are resized to a light WebP image. Hosted YouTube or Vimeo videos autoplay muted when they appear on screen; visitors can use the player controls to pause or unmute.</p>
              </div>
              <StoryField label="Media type">
                <select className="field" value={form.mediaType} onChange={(event) => selectMediaType(event.currentTarget.value as AdminStory['mediaType'])}>
                  <option value="none">No media</option><option value="photo">Student photo</option><option value="video">Hosted video link</option>
                </select>
              </StoryField>
              {form.mediaType === 'photo' && (
                <div className="grid gap-4 sm:grid-cols-2 sm:items-center">
                  <div>
                    <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-forest-900/15 bg-white px-4 py-2 text-sm font-bold hover:bg-forest-50">
                      <ImagePlus aria-hidden="true" className="size-4" /> Choose student photo
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} className="sr-only" />
                    </label>
                    <p className="mt-2 text-xs text-forest-900/60">JPG, PNG or WebP · prepared image limit 1.5 MB.</p>
                  </div>
                  {form.photoSrc ? <img src={form.photoSrc} alt="Selected student approval preview" className="max-h-80 w-full rounded-xl bg-white object-contain" /> : <div className="grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-forest-900/20 bg-white text-xs text-forest-900/50">Choose a student photo</div>}
                  <StoryField label="Photo description for accessibility">
                    <input className="field" maxLength={500} value={form.mediaAlt} onChange={(event) => update('mediaAlt', event.currentTarget.value)} placeholder="Student receiving a study visa approval" required />
                  </StoryField>
                </div>
              )}
              {form.mediaType === 'video' && (
                <StoryField label="YouTube or Vimeo link" hint="Use an unlisted YouTube link when the video should not appear in YouTube search.">
                  <input className="field" type="url" maxLength={500} value={form.videoUrl} onChange={(event) => { const videoUrl = event.currentTarget.value; setForm((current) => ({ ...current, videoUrl, mediaConsent: false })) }} placeholder="https://youtu.be/… or https://vimeo.com/…" required />
                </StoryField>
              )}
              {form.mediaType !== 'none' && (
                <label className="flex items-start gap-3 rounded-xl border border-forest-900/10 bg-white p-3 text-xs leading-relaxed text-forest-900/75">
                  <input type="checkbox" checked={form.mediaConsent} onChange={(event) => update('mediaConsent', event.currentTarget.checked)} className="mt-0.5 size-4 shrink-0 accent-forest-900" />
                  <span>I confirm the student has agreed to publish this photo or video on our website.</span>
                </label>
              )}
            </section>
          )}
        </div>
      )}
      <div className="mt-5 grid gap-4 border-t border-forest-900/10 pt-4">
        <label className="flex items-start gap-3 rounded-xl border border-forest-900/10 bg-forest-50 p-3 text-sm font-bold"><input type="checkbox" checked={form.homepageFeatured} onChange={(event) => update('homepageFeatured', event.currentTarget.checked)} className="mt-0.5 size-4 shrink-0 accent-forest-900" /><span>Show on homepage<span className="mt-1 block text-xs font-normal leading-relaxed text-forest-900/60">Turn off to keep this published story on the Success Stories page only.</span></span></label>
        <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.published} onChange={(event) => update('published', event.currentTarget.checked)} /> Publish on website</label>
        <div className="flex flex-wrap gap-2">
          <button disabled={busy || preview} className="rounded-full bg-forest-900 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Saving…' : 'Save story'}</button>
          {form.id > 0 && <button type="button" disabled={busy} onClick={() => void remove()} className="rounded-full border border-red-200 px-5 py-3 text-sm font-bold text-red-700 disabled:opacity-50">Delete</button>}
        </div>
      </div>
    </form>
  )
}

function StoryField({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="block text-xs font-bold text-forest-900/75">{label}{hint && <span className="mt-1 block font-normal leading-relaxed text-forest-900/50">{hint}</span>}<div className="mt-1">{children}</div></label>
}
