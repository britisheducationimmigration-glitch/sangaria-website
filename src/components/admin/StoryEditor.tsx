import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { ImagePlus, Star, Video } from 'lucide-react'
import { ApprovalCard, TestimonialCard } from '@/components/Cards'
import { deleteStory, saveStory } from '@/lib/admin-functions'
import type { AdminStory } from '@/lib/content-types'
import { getSupportedVideoEmbedUrl } from '@/lib/video'

type StoryDraft = AdminStory & { photoBase64: string; photoMimeType: string }

const countryPresets: Record<string, { name: string; flag: string; visa: string }> = {
  canada: { name: 'Canada', flag: '🇨🇦', visa: 'Study Permit' },
  uk: { name: 'United Kingdom', flag: '🇬🇧', visa: 'Student Visa' },
  australia: { name: 'Australia', flag: '🇦🇺', visa: 'Subclass 500' },
  usa: { name: 'United States', flag: '🇺🇸', visa: 'F-1 Student' },
  'new zealand': { name: 'New Zealand', flag: '🇳🇿', visa: 'Fee Paying Student' },
  germany: { name: 'Germany', flag: '🇩🇪', visa: 'Student Visa' },
  schengen: { name: 'Europe / Schengen', flag: '🇪🇺', visa: 'Tourist Visa' },
  europe: { name: 'Europe / Schengen', flag: '🇪🇺', visa: 'Tourist Visa' },
  france: { name: 'France', flag: '🇫🇷', visa: 'Student Visa' },
}

async function preparePhoto(file: File) {
  if (!file.type.startsWith('image/')) throw new Error('Choose a JPG, PNG or WebP image.')
  if (file.size > 15 * 1024 * 1024) throw new Error('Choose an image smaller than 15 MB.')
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not prepare this image.')
  context.imageSmoothingQuality = 'high'
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => (value ? resolve(value) : reject(new Error('Could not prepare this image.'))), 'image/webp', 0.8)
  })
  if (blob.size > 1.2 * 1024 * 1024) throw new Error('The prepared image is still too large. Choose a smaller photo.')
  const imageSrc = URL.createObjectURL(blob)
  const imageBase64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? '').split(',')[1] ?? '')
    reader.onerror = () => reject(new Error('Could not read this image.'))
    reader.readAsDataURL(blob)
  })
  return { imageSrc, imageBase64, imageMimeType: 'image/webp' }
}

export function StoryEditor({
  item,
  onReload,
  onNotice,
  onClose,
}: {
  item: AdminStory
  onReload: () => Promise<void>
  onNotice: (message: string) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<StoryDraft>(() => ({ ...item, photoBase64: '', photoMimeType: '' }))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const previewUrl = useRef('')

  const matchedPresetKey = Object.keys(countryPresets).find(
    (k) => countryPresets[k].name.toLowerCase() === (form.country || '').trim().toLowerCase() || k === (form.country || '').trim().toLowerCase()
  )
  const [selectedPreset, setSelectedPreset] = useState<string>(matchedPresetKey || (form.country ? 'CUSTOM' : ''))

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

  function handleSelectCountry(presetKey: string) {
    setSelectedPreset(presetKey)
    if (presetKey === 'CUSTOM') {
      if (Object.values(countryPresets).some((preset) => preset.name === form.country)) {
        setForm((current) => ({ ...current, country: '', flag: '', visa: '' }))
      }
      setError('')
      return
    }
    const preset = countryPresets[presetKey]
    if (preset) {
      setForm((current) => ({
        ...current,
        country: preset.name,
        flag: preset.flag,
        visa: preset.visa,
      }))
    }
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
      setForm((current) => ({
        ...current,
        mediaType: 'photo',
        photoSrc: photo.imageSrc,
        photoBase64: photo.imageBase64,
        photoMimeType: photo.imageMimeType,
        videoUrl: '',
        mediaConsent: false,
      }))
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not prepare this image.')
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.country.trim()) {
      setError('Please select or enter a destination country.')
      return
    }
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
      onNotice('Success story saved and live on website.')
      onClose()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save the story. Check the fields.')
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!form.id || !window.confirm('Delete this story permanently?')) return
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

  const videoEmbedUrl = form.videoUrl ? getSupportedVideoEmbedUrl(form.videoUrl) : ''

  return (
    <form onSubmit={submit} className="rounded-3xl border border-[#E4E7EC] bg-white p-6 shadow-xs space-y-6">
      <div className="flex items-start justify-between gap-4 border-b border-[#E4E7EC] pb-4">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#465FFF]">Student Showcase</span>
          <h3 className="mt-0.5 text-xl font-extrabold text-[#1D2939]">
            {form.id ? 'Edit Success Story' : 'Create Success Story'}
          </h3>
          <p className="mt-1 text-xs text-[#667085]">Add visa approvals, testimonial quotes, student photos or YouTube videos.</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-xs font-bold text-[#667085] hover:bg-[#F2F4F7]">
          ✕ Close
        </button>
      </div>

      {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-800 border border-rose-200">{error}</p>}

      {/* Live Public Website Card Preview */}
      <div className="rounded-2xl border border-[#D0E1FD] bg-[#F4F8FF] p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#465FFF]">
            Live Public Website Card Preview
          </p>
          <span className="font-mono text-[10px] text-[#667085]">
            Updates live as you type
          </span>
        </div>
        <div className="mx-auto max-w-md">
          {form.kind === 'approval' ? <ApprovalCard a={form} /> : <TestimonialCard t={form} />}
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <StoryField label="Story Type" hint="Visa result or client review quote">
            <select
              className="field font-semibold"
              value={form.kind}
              onChange={(event) => {
                const kind = event.currentTarget.value as AdminStory['kind']
                if (kind === 'testimonial') {
                  releasePreview()
                  setForm((current) => ({ ...current, kind, mediaType: 'none', photoSrc: '', photoBase64: '', photoMimeType: '', videoUrl: '', mediaAlt: '', mediaConsent: false }))
                } else update('kind', kind)
              }}
            >
              <option value="testimonial">Client Testimonial (Review)</option>
              <option value="approval">Visa Approval (Result Card)</option>
            </select>
          </StoryField>

          <StoryField label="Student / Client Name *" hint="Full name">
            <input className="field" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Navdeep Singh" required />
          </StoryField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <StoryField label="City / Hometown" hint="e.g. Sangaria, Hanumangarh">
            <input className="field" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Sangaria" />
          </StoryField>

          <StoryField label="Destination Country *" hint="Auto-selects flag & visa type">
            <select
              className="field font-bold"
              value={selectedPreset}
              onChange={(e) => handleSelectCountry(e.target.value)}
            >
              <option value="" disabled>-- Select Destination Country --</option>
              <option value="canada">🇨🇦 Canada</option>
              <option value="uk">🇬🇧 United Kingdom</option>
              <option value="australia">🇦🇺 Australia</option>
              <option value="usa">🇺🇸 United States</option>
              <option value="new zealand">🇳🇿 New Zealand</option>
              <option value="germany">🇩🇪 Germany</option>
              <option value="europe">🇪🇺 Europe / Schengen</option>
              <option value="france">🇫🇷 France</option>
              <option value="CUSTOM">✏️ Other / Custom Country</option>
            </select>
          </StoryField>
        </div>

        {selectedPreset === 'CUSTOM' && (
          <div className="grid gap-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 sm:grid-cols-2">
            <StoryField label="Custom Country Name" hint="e.g. Ireland">
              <input className="field" value={form.country} onChange={(e) => update('country', e.target.value)} placeholder="Country Name" required />
            </StoryField>
            <StoryField label="Country Flag Emoji" hint="e.g. 🇮🇪">
              <input className="field font-mono text-center text-lg" value={form.flag} onChange={(e) => update('flag', e.target.value)} placeholder="🇮🇪" />
            </StoryField>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <StoryField label="Visa Category / Program" hint="e.g. Study Permit, Subclass 500">
            <input className="field" value={form.visa} onChange={(e) => update('visa', e.target.value)} placeholder="Visa Category" required />
          </StoryField>

          <StoryField label="Date" hint="Approval or testimonial date">
            <input className="field font-mono" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
          </StoryField>
        </div>

        {form.kind === 'testimonial' ? (
          <div className="space-y-4 rounded-2xl border border-[#E4E7EC] bg-[#F9FAFB] p-4">
            <StoryField label="Student Testimonial Quote *" hint="Student words and feedback">
              <textarea className="field" rows={4} value={form.quote} onChange={(e) => update('quote', e.target.value)} placeholder="Describe their experience with BEI classes or visa process..." required />
            </StoryField>

            <div>
              <span className="text-xs font-bold text-[#1D2939]">Student Rating</span>
              <div className="mt-1.5 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => update('rating', star)}
                    className="p-1 hover:scale-110 transition"
                  >
                    <Star className={'size-6 ' + (star <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300')} />
                  </button>
                ))}
                <span className="ml-2 font-mono text-xs font-bold text-[#1D2939]">{form.rating} / 5 Stars</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 rounded-2xl border border-[#E4E7EC] bg-[#F9FAFB] p-4">
            <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#465FFF]">Approval Media</span>
              <div className="flex items-center gap-1">
                {(['none', 'photo', 'video'] as const).map((mType) => (
                  <button
                    key={mType}
                    type="button"
                    onClick={() => selectMediaType(mType)}
                    className={'rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ' + (form.mediaType === mType ? 'bg-[#465FFF] text-white shadow-xs' : 'bg-white text-[#667085] hover:bg-gray-100')}
                  >
                    {mType === 'none' ? 'No Media' : mType}
                  </button>
                ))}
              </div>
            </div>

            {form.mediaType === 'photo' && (
              <div className="grid gap-4 sm:grid-cols-2 items-center">
                <div className="space-y-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#465FFF] bg-[#ECF3FF] px-4 py-2.5 text-xs font-bold text-[#465FFF] hover:bg-[#DCEBFF]">
                    <ImagePlus className="size-4" />
                    <span>Upload Student Photo</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} className="sr-only" />
                  </label>
                  <p className="text-[11px] text-[#667085]">JPG, PNG or WebP · High clarity & auto-optimized.</p>
                </div>
                {form.photoSrc ? (
                  <div className="relative overflow-hidden rounded-xl border border-[#E4E7EC] bg-white p-1">
                    <img src={form.photoSrc} alt="Student approval preview" className="max-h-40 w-full rounded-lg object-contain" />
                  </div>
                ) : (
                  <div className="grid h-32 place-items-center rounded-xl border border-dashed border-gray-300 bg-white text-xs text-[#98A2B3]">
                    No photo uploaded
                  </div>
                )}
                <div className="sm:col-span-2">
                  <StoryField label="Photo Alt Description (Accessibility)" hint="e.g. Navdeep Singh holding Canada visa approval letter">
                    <input className="field" maxLength={500} value={form.mediaAlt} onChange={(e) => update('mediaAlt', e.target.value)} placeholder="Student with approval letter" required />
                  </StoryField>
                </div>
              </div>
            )}

            {form.mediaType === 'video' && (
              <div className="space-y-3">
                <StoryField label="YouTube or Vimeo Link" hint="Public or unlisted link">
                  <input className="field font-mono text-xs" type="url" maxLength={500} value={form.videoUrl} onChange={(e) => update('videoUrl', e.target.value)} placeholder="https://youtu.be/... or https://vimeo.com/..." required />
                </StoryField>
                {videoEmbedUrl && (
                  <div className="overflow-hidden rounded-2xl border border-black/10 bg-black p-2">
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-white/80">
                      <Video className="size-3.5 text-coral-400" /> Video Live Preview:
                    </p>
                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                      <iframe src={videoEmbedUrl} className="h-full w-full border-0" title="Approval video preview" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {form.mediaType !== 'none' && (
              <label className="flex items-start gap-2.5 rounded-xl border border-[#E4E7EC] bg-white p-3 text-xs text-[#1D2939] cursor-pointer">
                <input type="checkbox" checked={form.mediaConsent} onChange={(e) => update('mediaConsent', e.target.checked)} className="mt-0.5 size-4 rounded text-[#465FFF]" />
                <span className="font-semibold">I confirm the student has given explicit consent to publish their photo / video on our website.</span>
              </label>
            )}
          </div>
        )}

        <StoryField label="Internal Staff Note" hint="Only visible inside admin panel">
          <input className="field" value={form.note} onChange={(e) => update('note', e.target.value)} placeholder="e.g. Verified by Harpreet Sir · intake Sept 2026" />
        </StoryField>

        <div className="space-y-2 rounded-2xl border border-[#E4E7EC] bg-[#F9FAFB] p-3">
          <label className="flex items-center gap-2.5 text-xs font-bold text-[#1D2939] cursor-pointer">
            <input type="checkbox" checked={form.homepageFeatured} onChange={(e) => update('homepageFeatured', e.target.checked)} className="size-4 rounded text-[#465FFF]" />
            <span>Showcase on Homepage hero/featured section</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs font-bold text-[#1D2939] cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} className="size-4 rounded text-[#465FFF]" />
            <span>Publish live on public Success Stories page</span>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E7EC] pt-4">
        {form.id > 0 ? (
          <button type="button" disabled={busy} onClick={() => void remove()} className="rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-50">
            Delete Story
          </button>
        ) : <div />}
        <button type="submit" disabled={busy} className="rounded-xl bg-[#465FFF] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:opacity-95 disabled:opacity-50">
          {busy ? 'Saving…' : 'Save & Publish Story'}
        </button>
      </div>
    </form>
  )
}

function StoryField({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#1D2939]">{label}</span>
        {hint && <span className="text-[11px] text-[#667085]">{hint}</span>}
      </div>
      {children}
    </label>
  )
}