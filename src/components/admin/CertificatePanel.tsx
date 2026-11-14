import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { ImagePlus, Pencil, Plus, Trash2, X } from 'lucide-react'
import { deleteCertificate, saveCertificate } from '@/lib/admin-functions'
import type { AdminCertificate } from '@/lib/content-types'

type Draft = {
  id: number
  title: string
  issuer: string
  category: string
  credentialDate: string
  altText: string
  imageSrc: string
  imageBase64: string
  imageMimeType: string
  homepageFeatured: boolean
  published: boolean
  sortOrder: number
}

const emptyDraft = (): Draft => ({
  id: 0, title: '', issuer: '', category: 'Partner authorisations', credentialDate: '',
  altText: '', imageSrc: '', imageBase64: '', imageMimeType: '',
  homepageFeatured: false, published: false, sortOrder: 0,
})
const inputClass = 'mt-1 min-h-11 w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2 text-sm text-forest-900'
const labelClass = 'block text-xs font-bold text-forest-900/75'

async function compressImage(file: File) {
  if (!file.type.startsWith('image/')) throw new Error('Choose an image file.')
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
    canvas.toBlob((value) => value ? resolve(value) : reject(new Error('Could not compress this image.')), 'image/webp', 0.80)
  })
  if (blob.size > 1.2 * 1024 * 1024) throw new Error('Image is still too large. Choose a smaller photo.')
  const imageSrc = URL.createObjectURL(blob)
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Could not read this image.'))
    reader.readAsDataURL(blob)
  })
  return { imageSrc, imageBase64: dataUrl.split(',')[1] ?? '', imageMimeType: 'image/webp' }
}

export function CertificatePanel({ items, onReload, onNotice }: {
  items: AdminCertificate[]
  onReload: () => Promise<void>
  onNotice: (message: string) => void
}) {
  const [draft, setDraft] = useState<Draft | null>(null)
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState(false)
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

  function mayDiscard() {
    return !dirty || window.confirm('Discard the unsaved certificate changes?')
  }
  function startNew() {
    if (!mayDiscard()) return
    releasePreview()
    setDraft(emptyDraft())
    setDirty(false)
    setError('')
  }
  function startEdit(item: AdminCertificate) {
    if (!mayDiscard()) return
    releasePreview()
    setDraft({
      id: item.id, title: item.title, issuer: item.issuer, category: item.category,
      credentialDate: item.credentialDate, altText: item.altText, imageSrc: item.imageSrc,
      imageBase64: '', imageMimeType: '', homepageFeatured: item.homepageFeatured,
      published: item.published, sortOrder: item.sortOrder === 0 ? 1 : item.sortOrder,
    })
    setDirty(false)
    setError('')
  }
  function cancelEdit() {
    if (!mayDiscard()) return
    releasePreview()
    setDraft(null)
    setDirty(false)
    setError('')
  }
  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => current ? { ...current, [key]: value } : current)
    setDirty(true)
  }
  async function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return
    try {
      const image = await compressImage(file)
      releasePreview()
      previewUrl.current = image.imageSrc
      setDraft((current) => current ? { ...current, ...image } : current)
      setDirty(true)
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not prepare the image.')
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft) return
    setBusy(true)
    setError('')
    try {
      await saveCertificate({ data: {
        id: draft.id, title: draft.title, issuer: draft.issuer, category: draft.category,
        credentialDate: draft.credentialDate, altText: draft.altText,
        imageBase64: draft.imageBase64, imageMimeType: draft.imageMimeType,
        homepageFeatured: draft.homepageFeatured, published: draft.published, sortOrder: draft.sortOrder,
      } })
      releasePreview()
      setDraft(null)
      setDirty(false)
      onNotice(draft.published ? 'Certificate saved.' : 'Certificate saved as a draft.')
      await onReload()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save the certificate.')
    } finally {
      setBusy(false)
    }
  }
  async function remove(item: AdminCertificate) {
    if (!window.confirm('Remove "' + item.title + '" from the certificate library? Its uploaded photo will also be removed.')) return
    setBusy(true)
    try {
      await deleteCertificate({ data: { id: item.id } })
      onNotice('Certificate removed.')
      await onReload()
      if (draft?.id === item.id) {
        releasePreview()
        setDraft(null)
        setDirty(false)
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not remove the certificate.')
    } finally {
      setBusy(false)
    }
  }

  const sortedItems = [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
  return (
    <section aria-labelledby="admin-certificates-title">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral-600">Public credentials page</p>
          <h2 id="admin-certificates-title" className="mt-1 font-display text-2xl font-extrabold text-forest-900">Certificates</h2>
          <p className="mt-2 max-w-2xl text-sm text-forest-900/65">Choose a photo, enter its details, then press Save. Nothing is published while you edit.</p>
        </div>
        <button type="button" onClick={startNew} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest-900 px-4 py-2 text-sm font-bold text-white hover:bg-forest-800">
          <Plus aria-hidden="true" className="size-4" /> Add certificate
        </button>
      </div>
      {error && <p role="alert" className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">{error}</p>}

      {draft && (
        <form onSubmit={submit} className="mb-8 grid gap-5 rounded-2xl border border-coral-500/25 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div><h3 className="font-display text-lg font-extrabold">{draft.id ? 'Edit certificate' : 'Add certificate'}</h3><p className="mt-1 text-xs text-forest-900/60">Changes save only when you press the button below.</p></div>
            <button type="button" onClick={cancelEdit} aria-label="Close editor" className="grid size-10 shrink-0 place-items-center rounded-full border border-forest-900/15 hover:bg-forest-50"><X aria-hidden="true" className="size-4" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>Title<input required maxLength={220} value={draft.title} onChange={(e) => update('title', e.currentTarget.value)} className={inputClass} /></label>
            <label className={labelClass}>Issuer / institution<input maxLength={180} value={draft.issuer} onChange={(e) => update('issuer', e.currentTarget.value)} className={inputClass} /></label>
            <label className={labelClass}>Category<input required list="certificate-category-suggestions" maxLength={100} value={draft.category} onChange={(e) => update('category', e.currentTarget.value)} className={inputClass} />
              <datalist id="certificate-category-suggestions">
                <option value="Partner authorisations" /><option value="Training & qualifications" /><option value="Recognition & events" />
                <option value="Student visa results" /><option value="IELTS & PTE results" />
              </datalist>
            </label>
            <label className={labelClass}>Certificate date (optional)<input maxLength={80} value={draft.credentialDate} onChange={(e) => update('credentialDate', e.currentTarget.value)} placeholder="e.g. 2026" className={inputClass} /></label>
            <label className={labelClass + ' sm:col-span-2'}>Image description for accessibility<input required maxLength={500} value={draft.altText} onChange={(e) => update('altText', e.currentTarget.value)} className={inputClass} placeholder="Describe the certificate photo" /></label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:items-center">
            <div>
              <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-forest-900/15 bg-cream px-4 py-2 text-sm font-bold hover:bg-forest-50">
                <ImagePlus aria-hidden="true" className="size-4" /> Choose photo
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} className="sr-only" />
              </label>
              <p className="mt-2 text-xs text-forest-900/60">JPG, PNG or WebP. Auto-optimized for crisp clarity & fast loading.</p>
            </div>
            {draft.imageSrc
              ? <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-cream p-3"><img src={draft.imageSrc} alt="Selected certificate preview" className="certificate-image-enhanced max-h-full max-w-full object-contain" /></div>
              : <div className="grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-forest-900/20 bg-cream text-xs text-forest-900/55">Choose a certificate photo</div>}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex min-h-11 items-center gap-2 rounded-xl bg-cream px-3 py-2 text-xs font-semibold"><input type="checkbox" checked={draft.published} onChange={(e) => update('published', e.currentTarget.checked)} className="size-4 accent-forest-900" /> Publish on certificates page</label>
            <label className="flex min-h-11 items-center gap-2 rounded-xl bg-cream px-3 py-2 text-xs font-semibold"><input type="checkbox" checked={draft.homepageFeatured} onChange={(e) => update('homepageFeatured', e.currentTarget.checked)} className="size-4 accent-forest-900" /> Include in homepage rotation</label>
            <label className={labelClass}>Display order<input type="number" min={1} max={9999} value={draft.id ? draft.sortOrder : 1} disabled={!draft.id} onChange={(e) => update('sortOrder', Number(e.currentTarget.value))} className={inputClass + ' disabled:cursor-not-allowed disabled:bg-forest-50 disabled:text-forest-900/55'} />{!draft.id && <span className="mt-1 block font-normal text-forest-900/55">New certificates are automatically added first.</span>}</label>
          </div>
          <div className="flex flex-wrap justify-end gap-3 border-t border-forest-900/10 pt-4">
            <button type="button" onClick={cancelEdit} className="min-h-11 rounded-full border border-forest-900/20 px-5 py-2 text-sm font-bold">Cancel</button>
            <button type="submit" disabled={busy || !draft.title.trim() || !draft.category.trim() || !draft.altText.trim() || (!draft.id && !draft.imageBase64)} className="min-h-11 rounded-full bg-coral-500 px-5 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Saving…' : draft.published ? 'Save & publish' : 'Save draft'}</button>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedItems.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-forest-900/10">
            <div className="flex aspect-[4/3] items-center justify-center bg-cream p-3"><img src={item.imageSrc} alt={item.altText} loading="lazy" className="certificate-image-enhanced max-h-full max-w-full object-contain" /></div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-forest-50 px-2.5 py-1 text-[10px] font-bold text-forest-700">{item.category}</span>
                <span className={'rounded-full px-2.5 py-1 text-[10px] font-bold ' + (item.published ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800')}>{item.published ? 'Published' : 'Draft'}</span>
                {item.homepageFeatured && <span className="rounded-full bg-coral-50 px-2.5 py-1 text-[10px] font-bold text-coral-700">Homepage rotation</span>}
              </div>
              <h3 className="mt-3 font-display text-base font-extrabold text-forest-900">{item.title}</h3><p className="mt-1 text-xs text-forest-900/60">{item.issuer}</p>
              <div className="mt-4 flex gap-2 border-t border-forest-900/10 pt-3">
                <button type="button" onClick={() => startEdit(item)} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-forest-900/15 px-3 py-2 text-xs font-bold hover:bg-forest-50"><Pencil aria-hidden="true" className="size-3.5" /> Edit</button>
                <button type="button" disabled={busy} onClick={() => void remove(item)} aria-label={'Remove ' + item.title} className="grid size-11 place-items-center rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50 disabled:opacity-50"><Trash2 aria-hidden="true" className="size-4" /></button>
              </div>
            </div>
          </article>
        ))}
        {items.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-sm text-forest-900/60 sm:col-span-2 lg:col-span-3">No certificates have been added yet.</p>}
      </div>
    </section>
  )
}
