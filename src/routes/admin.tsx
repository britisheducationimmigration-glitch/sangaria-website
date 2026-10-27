import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Eye, EyeOff, RefreshCw } from 'lucide-react'
import { getAdminSnapshot, deleteAdminUser, deleteBatch, deleteEnquiry, deletePost, deleteStory, exportEnquiries, saveAdminUser, saveBatch, savePost, saveStory, updateEnquiry, updateSettings } from '@/lib/admin-functions'
import type { AdminPost, AdminRole, AdminSnapshot, AdminStory, AdminUser, CoachingBatch, Enquiry, EnquiryStatus } from '@/lib/content-types'

export const Route = createFileRoute('/admin')({
  head: () => ({ meta: [{ title: 'Admin · British Education and Immigration' }, { name: 'robots', content: 'noindex,nofollow,noarchive' }] }),
  component: AdminPage,
})

type Tab = 'enquiries' | 'news' | 'stories' | 'batches' | 'settings' | 'users'
const roleLabels: Record<AdminRole, string> = { super_admin: 'Super Admin', content_editor: 'Content Editor', enquiry_manager: 'Enquiry Manager' }

const blankPost: Omit<AdminPost, 'id'> = { slug: '', title: '', category: 'Visa News', date: new Date().toISOString().slice(0, 10), excerpt: '', readMins: 4, body: [], published: true }
const blankStory: Omit<AdminStory, 'id'> = { kind: 'testimonial', name: '', city: '', country: '', visa: '', quote: '', rating: 5, initials: '', flag: '', date: new Date().toISOString().slice(0, 10), note: '', published: true }

function AdminPage() {
  const [snapshot, setSnapshot] = useState<AdminSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('enquiries')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | 'All'>('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedPost, setSelectedPost] = useState<AdminPost | null>(null)
  const [selectedStory, setSelectedStory] = useState<AdminStory | null>(null)
  const [selectedBatch, setSelectedBatch] = useState<CoachingBatch | null>(null)
  const [notice, setNotice] = useState('')
  const [showChangePass, setShowChangePass] = useState(false)

  async function reload(silent = false) {
    if (!silent) setRefreshing(true)
    try {
      setError('')
      const data = await getAdminSnapshot()
      setSnapshot(data)
    } catch (cause) {
      if (!snapshot) {
        setError(cause instanceof Error ? cause.message : 'Admin access is not configured yet.')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Initial load + Auto-refresh every 15 seconds
  useEffect(() => {
    void reload()
    const timer = setInterval(() => {
      void reload(true)
    }, 15000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => { if (snapshot?.user.role === 'content_editor' && tab === 'enquiries') setTab('news') }, [snapshot?.user.role, tab])

  // Loading spinner instead of flashing login card
  if (loading && !snapshot) {
    return (
      <section className="grid min-h-screen place-items-center bg-cream px-6 py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 animate-spin rounded-full border-4 border-forest-900 border-t-transparent" />
          <p className="font-mono text-xs uppercase tracking-widest text-forest-900/60">Loading Admin Dashboard...</p>
        </div>
      </section>
    )
  }

  if (!snapshot) {
    return (
      <section className="grid min-h-screen place-items-center bg-cream px-6 py-16">
        <AdminAuthCard onLoginSuccess={() => reload()} />
      </section>
    )
  }

  const filtered = snapshot.enquiries.filter((item) => {
    const haystack = `${item.name} ${item.phone} ${item.email} ${item.city} ${item.country} ${item.interest} ${item.status} ${item.assignedTo}`.toLowerCase()
    const created = item.createdAt.slice(0, 10)
    return haystack.includes(query.toLowerCase()) && (statusFilter === 'All' || item.status === statusFilter) && (!dateFrom || created >= dateFrom) && (!dateTo || created <= dateTo)
  })
  const tabs: Array<[Tab, string]> = snapshot.user.role === 'super_admin'
    ? [['enquiries', `Enquiries (${snapshot.enquiryStats.total})`], ['news', 'News & Updates'], ['stories', 'Success Stories'], ['batches', 'Coaching batches'], ['settings', 'Site settings'], ['users', 'Users & roles']]
    : snapshot.user.role === 'content_editor'
      ? [['news', 'News & Updates'], ['stories', 'Success Stories'], ['batches', 'Coaching batches']]
      : [['enquiries', `Enquiries (${snapshot.enquiries.length})`]]

  function showNotice(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  return (
    <div className="min-h-screen bg-cream text-forest-900">
      <header className="border-b border-forest-900/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-coral-600">Owner dashboard</p><h1 className="text-2xl font-extrabold">British Education & Immigration</h1></div>
          <div className="text-right text-xs text-forest-900/60">
            <p>{snapshot.user.name}</p><p>{snapshot.user.email}</p><p className="font-bold text-coral-600">{roleLabels[snapshot.user.role]}</p>
            <div className="mt-2 flex items-center justify-end gap-3">
              <button type="button" onClick={() => void reload()} disabled={refreshing} className="flex items-center gap-1.5 font-bold text-forest-900 hover:text-coral-600 disabled:opacity-50">
                <RefreshCw className={`size-3.5 ${refreshing ? 'animate-spin text-coral-600' : ''}`} />
                {refreshing ? 'Syncing…' : 'Live Sync'}
              </button>
              <span>·</span>
              <button type="button" onClick={() => setShowChangePass(true)} className="font-bold text-forest-900 hover:text-coral-600">Change password</button>
              <span>·</span>
              <a href="/admin/oauth/logout" className="font-bold text-coral-600">Log out</a>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <nav className="mb-8 flex gap-2 overflow-x-auto pb-2" aria-label="Admin sections">
          {tabs.map(([value, label]) => <button key={value} type="button" onClick={() => setTab(value)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${tab === value ? 'bg-forest-900 text-white' : 'bg-white ring-1 ring-forest-900/10'}`}>{label}</button>)}
        </nav>
        {notice && <p className="mb-5 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-900">{notice}</p>}
        {tab === 'enquiries' && <EnquiriesPanel enquiries={filtered} stats={snapshot.enquiryStats} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} dateFrom={dateFrom} setDateFrom={setDateFrom} dateTo={dateTo} setDateTo={setDateTo} onReload={reload} onNotice={showNotice} canDelete={snapshot.user.role === 'super_admin'} />}
        {tab === 'news' && <ContentPanel type="news" items={snapshot.posts} selected={selectedPost} onSelect={(item) => setSelectedPost(item as AdminPost | null)} onReload={reload} onNotice={showNotice} />}
        {tab === 'stories' && <ContentPanel type="stories" items={snapshot.stories} selected={selectedStory} onSelect={(item) => setSelectedStory(item as AdminStory | null)} onReload={reload} onNotice={showNotice} />}
        {tab === 'batches' && <BatchPanel items={snapshot.batches} selected={selectedBatch} onSelect={setSelectedBatch} onReload={reload} onNotice={showNotice} />}
        {tab === 'settings' && <SettingsPanel settings={snapshot.settings} onReload={reload} onNotice={showNotice} />}
        {tab === 'users' && <UsersPanel users={snapshot.users} currentEmail={snapshot.user.email} onReload={reload} onNotice={showNotice} />}
        {showChangePass && <ChangePasswordModal onClose={() => setShowChangePass(false)} onNotice={showNotice} />}
      </main>
    </div>
  )
}

function AdminAuthCard({ onLoginSuccess }: { onLoginSuccess: () => Promise<void> }) {
  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showLoginPass, setShowLoginPass] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoveryKey, setRecoveryKey] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showResetPass, setShowResetPass] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    try {
      const res = await fetch('/admin/oauth/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier, password }) })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error || 'Invalid credentials')
      await onLoginSuccess()
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Login failed', type: 'error' })
    } finally { setBusy(false) }
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMessage(null)
    try {
      const res = await fetch('/admin/oauth/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'forgot', email: recoveryEmail, recoveryKey, newPassword }) })
      const data = (await res.json()) as { ok?: boolean; message?: string; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error || 'Password reset failed')
      setMessage({ text: data.message || 'Password reset successful! Sign in with your new password.', type: 'success' })
      setMode('login'); setPassword('')
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Reset failed', type: 'error' })
    } finally { setBusy(false) }
  }

  return (
    <div className="w-full max-w-md rounded-[2.5rem] bg-forest-900 p-8 text-white shadow-2xl ring-1 ring-white/10">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-coral-400">Owner dashboard</p><h1 className="mt-1 text-2xl font-extrabold">British Education & Immigration</h1></div>
      </div>
      <div className="mt-6 flex rounded-full bg-forest-950 p-1 text-xs font-bold">
        <button type="button" onClick={() => { setMode('login'); setMessage(null) }} className={`flex-1 rounded-full py-2.5 transition ${mode === 'login' ? 'bg-coral-500 text-white shadow' : 'text-forest-100/60 hover:text-white'}`}>Sign in</button>
        <button type="button" onClick={() => { setMode('forgot'); setMessage(null) }} className={`flex-1 rounded-full py-2.5 transition ${mode === 'forgot' ? 'bg-coral-500 text-white shadow' : 'text-forest-100/60 hover:text-white'}`}>Forgot password?</button>
      </div>
      {message && <div className={`mt-5 rounded-2xl p-4 text-xs font-bold leading-relaxed ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40' : 'bg-red-500/20 text-red-300 ring-1 ring-red-500/40'}`}>{message.text}</div>}
      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div><label className="block text-xs font-bold text-forest-100/70 mb-1.5">Username or Email</label><input type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:bg-white/20 focus:outline-none focus:ring-coral-400" placeholder="Enter username or email" /></div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-forest-100/70">Password</label>
              <button type="button" onClick={() => { setMode('forgot'); setMessage(null) }} className="text-[11px] font-bold text-coral-400 hover:underline">Forgot?</button>
            </div>
            <div className="relative">
              <input type={showLoginPass ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl bg-white/10 px-4 py-3 pr-11 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:bg-white/20 focus:outline-none focus:ring-coral-400" placeholder="Enter password" />
              <button type="button" onClick={() => setShowLoginPass(!showLoginPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1">
                {showLoginPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={busy} className="w-full mt-2 rounded-full bg-coral-500 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-coral-600 disabled:opacity-50">{busy ? 'Verifying…' : 'Sign in to Dashboard →'}</button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="mt-6 space-y-4">
          <p className="text-xs leading-relaxed text-forest-100/70">Enter your registered admin email, master Recovery Key, and new password.</p>
          <div><label className="block text-xs font-bold text-forest-100/70 mb-1.5">Admin Email</label><input type="email" required value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-coral-400" placeholder="Enter your email" /></div>
          <div><label className="block text-xs font-bold text-forest-100/70 mb-1.5">Master Recovery Key (Security PIN)</label><input type="password" required value={recoveryKey} onChange={(e) => setRecoveryKey(e.target.value)} className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-coral-400" placeholder="Enter secret recovery PIN" /></div>
          <div>
            <label className="block text-xs font-bold text-forest-100/70 mb-1.5">New Password (minimum 6 characters)</label>
            <div className="relative">
              <input type={showResetPass ? 'text' : 'password'} required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-2xl bg-white/10 px-4 py-3 pr-11 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-coral-400" placeholder="Enter new password" />
              <button type="button" onClick={() => setShowResetPass(!showResetPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1">
                {showResetPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={busy} className="w-full mt-2 rounded-full bg-coral-500 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-coral-600 disabled:opacity-50">{busy ? 'Updating…' : 'Reset & Save Password'}</button>
          <button type="button" onClick={() => { setMode('login'); setMessage(null) }} className="w-full text-center text-xs font-bold text-forest-100/60 hover:text-white">← Back to sign in</button>
        </form>
      )}
      <div className="mt-6 border-t border-white/10 pt-4 text-center"><a href="/" className="text-xs font-semibold text-forest-100/60 hover:text-white">← Return to public website</a></div>
    </div>
  )
}

function ChangePasswordModal({ onClose, onNotice }: { onClose: () => void; onNotice: (msg: string) => void }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOldPass, setShowOldPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) { setError('New passwords do not match'); return }
    setBusy(true); setError('')
    try {
      const res = await fetch('/admin/oauth/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'change', oldPassword, newPassword }) })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to update password')
      onNotice('Password updated successfully!')
      onClose()
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to update password') }
    finally { setBusy(false) }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-forest-900/10">
        <div className="flex items-center justify-between pb-3 border-b border-forest-900/10"><h3 className="text-lg font-extrabold text-forest-900">Change Password</h3><button type="button" onClick={onClose} className="text-sm font-bold text-forest-900/40 hover:text-forest-900">✕</button></div>
        {error && <p className="mt-4 rounded-xl bg-red-100 p-3 text-xs font-bold text-red-800">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-forest-900/70 mb-1">Current Password</label>
            <div className="relative">
              <input type={showOldPass ? 'text' : 'password'} required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="field !pr-11" placeholder="Enter current password" />
              <button type="button" onClick={() => setShowOldPass(!showOldPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-900/50 hover:text-forest-900 p-1">
                {showOldPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-forest-900/70 mb-1">New Password (min 6 chars)</label>
            <div className="relative">
              <input type={showNewPass ? 'text' : 'password'} required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="field !pr-11" placeholder="Enter new password" />
              <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-900/50 hover:text-forest-900 p-1">
                {showNewPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-forest-900/70 mb-1">Confirm New Password</label>
            <input type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="field" placeholder="Re-type new password" />
          </div>
          <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onClose} className="rounded-full border border-forest-900/15 px-5 py-2.5 text-xs font-bold text-forest-900">Cancel</button><button type="submit" disabled={busy} className="rounded-full bg-forest-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-forest-800 disabled:opacity-50">{busy ? 'Updating…' : 'Update Password'}</button></div>
        </form>
      </div>
    </div>
  )
}

function BatchPanel({ items, selected, onSelect, onReload, onNotice }: { items: CoachingBatch[]; selected: CoachingBatch | null; onSelect: (item: CoachingBatch | null) => void; onReload: () => Promise<void>; onNotice: (message: string) => void }) {
  function handleSelect(item: CoachingBatch | null) {
    onSelect(item)
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]">
      <div>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-coral-600">IELTS · PTE · Batches</p><h2 className="mt-2 text-3xl font-extrabold">Coaching Schedule</h2><p className="mt-1 text-sm text-forest-900/60">Click any batch on the left to edit it immediately.</p></div>
          <button type="button" onClick={() => handleSelect({ id: 0, program: 'IELTS', batch: '', time: '', seats: 0, starts: '', published: true })} className="rounded-full bg-coral-500 px-4 py-2 text-sm font-bold text-white">+ New batch</button>
        </div>
        <div className="grid gap-3">
          {items.map((item) => (
            <button type="button" key={item.id} onClick={() => handleSelect(item)} className={`rounded-2xl bg-white p-4 text-left ring-1 ring-forest-900/10 transition hover:ring-forest-900 ${selected?.id === item.id ? 'ring-2 ring-coral-500 bg-coral-50/20' : ''}`}>
              <div className="flex items-center justify-between gap-3"><strong>{item.batch}</strong><span className="rounded-full bg-forest-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-forest-700">{item.program}</span></div>
              <span className="mt-1 block text-xs text-forest-900/50">{item.time} · {item.starts} · {item.seats} seats · <b className={item.published ? 'text-emerald-700' : 'text-amber-700'}>{item.published ? 'Published Live' : 'Draft / Hidden'}</b></span>
            </button>
          ))}
        </div>
      </div>
      {selected ? (
        <BatchEditor key={selected.id || 'new'} item={selected} onReload={onReload} onNotice={onNotice} onClose={() => onSelect(null)} />
      ) : (
        <div className="grid min-h-72 place-items-center rounded-3xl border border-dashed border-forest-900/20 p-8 text-center text-forest-900/50">Click any batch on the left to edit it or click "+ New batch".</div>
      )}
    </section>
  )
}

function BatchEditor({ item, onReload, onNotice, onClose }: { item: CoachingBatch; onReload: () => Promise<void>; onNotice: (message: string) => void; onClose: () => void }) {
  const [form, setForm] = useState(item)
  const [busy, setBusy] = useState(false)
  const isDirty = JSON.stringify(form) !== JSON.stringify(item)

  function update<K extends keyof CoachingBatch>(key: K, value: CoachingBatch[K]) { setForm((current) => ({ ...current, [key]: value })) }
  
  function handleClose() {
    if (isDirty && !window.confirm('Aapke paas unsaved changes hain. Kya aap bina save kiye band karna chahte hain?')) return
    onClose()
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    try {
      await saveBatch({ data: form })
      await onReload()
      onNotice(form.published ? 'Coaching batch published live!' : 'Coaching batch saved as draft.')
      onClose()
    } catch (cause) { onNotice(cause instanceof Error ? cause.message : 'Could not save batch.') }
    finally { setBusy(false) }
  }

  async function remove() {
    if (!form.id || !window.confirm('Are you sure you want to delete this coaching batch?')) return
    setBusy(true)
    try { await deleteBatch({ data: { id: form.id } }); await onReload(); onNotice('Batch deleted.'); onClose() }
    catch { onNotice('Could not delete batch.') }
    finally { setBusy(false) }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-forest-900/10">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral-600">Batch editor</p><h3 className="text-xl font-extrabold">{form.id ? `Editing: ${item.batch}` : 'New Coaching Batch'}</h3></div>
        <button type="button" onClick={handleClose} className="text-sm font-bold text-forest-900/50 hover:text-forest-900">Close ✕</button>
      </div>
      <div className="grid gap-4">
        <EditorField label="Program / Subject" hint="Example: IELTS, PTE, Spoken English"><input className="field" value={form.program} onChange={(e) => update('program', e.target.value)} placeholder="IELTS / PTE…" required /></EditorField>
        <EditorField label="Batch Name" hint="Example: IELTS Morning Super Batch"><input className="field" value={form.batch} onChange={(e) => update('batch', e.target.value)} placeholder="Batch title" required /></EditorField>
        <EditorField label="Class Timing" hint="Example: Mon–Fri · 8:00 AM – 10:00 AM"><input className="field" value={form.time} onChange={(e) => update('time', e.target.value)} placeholder="Days and time" /></EditorField>
        <div className="grid gap-4 sm:grid-cols-2">
          <EditorField label="Seats Available"><input className="field" type="number" min="0" value={form.seats} onChange={(e) => update('seats', Number(e.target.value))} /></EditorField>
          <EditorField label="Start Date"><input className="field" value={form.starts} onChange={(e) => update('starts', e.target.value)} placeholder="e.g. 5 Nov or Immediate" /></EditorField>
        </div>
        <label className="flex items-center gap-2.5 rounded-xl bg-forest-50 p-3 text-sm font-bold text-forest-900 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} className="size-4" />
          <span>Publish on Live Website</span>
        </label>
        <div className="flex flex-wrap gap-2 pt-2">
          <button disabled={busy} className="rounded-full bg-forest-900 px-6 py-3 text-sm font-bold text-white hover:bg-forest-800 disabled:opacity-50">{busy ? 'Saving…' : form.published ? 'Publish & Save' : 'Save as Draft'}</button>
          {form.id > 0 && <button type="button" disabled={busy} onClick={() => void remove()} className="rounded-full border border-red-200 px-5 py-3 text-sm font-bold text-red-700 hover:bg-red-50">Delete</button>}
        </div>
      </div>
    </form>
  )
}

function ContentPanel({ type, items, selected, onSelect, onReload, onNotice }: { type: 'news' | 'stories'; items: AdminPost[] | AdminStory[]; selected: AdminPost | AdminStory | null; onSelect: (item: AdminPost | AdminStory | null) => void; onReload: () => Promise<void>; onNotice: (message: string) => void }) {
  const news = type === 'news'
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]">
      <div>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-coral-600">{news ? 'News & updates' : 'Success stories'}</p><h2 className="mt-2 text-3xl font-extrabold">{news ? 'Articles & Updates' : 'Approvals & Reviews'}</h2></div>
          <button type="button" onClick={() => onSelect(news ? { id: 0, ...blankPost } : { id: 0, ...blankStory })} className="rounded-full bg-coral-500 px-4 py-2 text-sm font-bold text-white">+ New</button>
        </div>
        <div className="grid gap-3">
          {items.map((item) => (
            <button type="button" key={item.id} onClick={() => onSelect(item)} className={`rounded-2xl bg-white p-4 text-left ring-1 ring-forest-900/10 transition hover:ring-forest-900 ${selected?.id === item.id ? 'ring-2 ring-coral-500 bg-coral-50/20' : ''}`}>
              <div className="flex items-center justify-between gap-3"><strong>{news ? (item as AdminPost).title : (item as AdminStory).name}</strong><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${item.published ? 'bg-emerald-100 text-emerald-800' : 'bg-forest-100 text-forest-700'}`}>{item.published ? 'Live' : 'Draft'}</span></div>
              <span className="mt-1 block text-xs text-forest-900/50">{news ? `${(item as AdminPost).category} · ${(item as AdminPost).date}` : `${(item as AdminStory).kind} · ${(item as AdminStory).country} · ${item.published ? 'Published' : 'Hidden'}`}</span>
            </button>
          ))}
        </div>
      </div>
      {selected ? (
        news ? (
          <PostEditor key={selected.id || 'new'} item={selected as AdminPost} onReload={onReload} onNotice={onNotice} onClose={() => onSelect(null)} />
        ) : (
          <StoryEditor key={selected.id || 'new'} item={selected as AdminStory} onReload={onReload} onNotice={onNotice} onClose={() => onSelect(null)} />
        )
      ) : (
        <div className="grid min-h-72 place-items-center rounded-3xl border border-dashed border-forest-900/20 p-8 text-center text-forest-900/50">Click any item on the left to edit it or click "+ New".</div>
      )}
    </section>
  )
}

function EditorField({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="grid gap-1"><span className="text-xs font-bold uppercase tracking-[0.1em] text-forest-900/70">{label}</span>{children}{hint && <small className="text-xs leading-relaxed text-forest-900/50">{hint}</small>}</label>
}

function PostEditor({ item, onReload, onNotice, onClose }: { item: AdminPost; onReload: () => Promise<void>; onNotice: (message: string) => void; onClose: () => void }) {
  const [form, setForm] = useState(item)
  const [busy, setBusy] = useState(false)
  const isDirty = JSON.stringify(form) !== JSON.stringify(item)

  function update<K extends keyof AdminPost>(key: K, value: AdminPost[K]) { setForm((current) => ({ ...current, [key]: value })) }
  
  function handleClose() {
    if (isDirty && !window.confirm('Aapke paas unsaved changes hain. Kya aap bina save kiye band karna chahte hain?')) return
    onClose()
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true)
    try {
      await savePost({ data: form })
      await onReload()
      onNotice(form.published ? 'Article published live!' : 'Article saved as draft.')
      onClose()
    } catch { onNotice('Could not save article. Check the fields.') }
    finally { setBusy(false) }
  }

  async function remove() {
    if (!form.id || !window.confirm('Delete this article?')) return
    setBusy(true)
    try { await deletePost({ data: { id: form.id } }); await onReload(); onNotice('Article deleted.'); onClose() }
    catch { onNotice('Could not delete article.') }
    finally { setBusy(false) }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-forest-900/10">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral-600">News & updates</p><h3 className="text-xl font-extrabold">{form.id ? 'Edit Article' : 'New Article'}</h3></div>
        <button type="button" onClick={handleClose} className="text-sm font-bold text-forest-900/50 hover:text-forest-900">Close ✕</button>
      </div>
      <div className="grid gap-4">
        <EditorField label="Headline / Title"><input className="field" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Article headline" required /></EditorField>
        <div className="grid gap-4 sm:grid-cols-2">
          <EditorField label="URL Slug"><input className="field" value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="e.g. canada-visa-rules-update" required /></EditorField>
          <EditorField label="Category"><select className="field" value={form.category} onChange={(e) => update('category', e.target.value as AdminPost['category'])}><option>Visa News</option><option>Study Abroad</option><option>IELTS & PTE</option><option>Immigration</option></select></EditorField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <EditorField label="Publish Date"><input className="field" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} /></EditorField>
          <EditorField label="Reading Time (Mins)"><input className="field" type="number" min="1" value={form.readMins} onChange={(e) => update('readMins', Number(e.target.value))} /></EditorField>
        </div>
        <EditorField label="Summary / Excerpt"><textarea className="field" rows={3} value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} placeholder="Short summary" /></EditorField>
        <EditorField label="Article Content (paragraphs separated by blank lines)"><textarea className="field" rows={10} value={form.body.join('\n\n')} onChange={(e) => update('body', e.target.value.split(/\n\s*\n/))} placeholder="Write paragraphs here..." /></EditorField>
        <label className="flex items-center gap-2.5 rounded-xl bg-forest-50 p-3 text-sm font-bold text-forest-900 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} className="size-4" />
          <span>Publish on Live Website</span>
        </label>
        <div className="flex flex-wrap gap-2 pt-2">
          <button disabled={busy} className="rounded-full bg-forest-900 px-6 py-3 text-sm font-bold text-white hover:bg-forest-800 disabled:opacity-50">{busy ? 'Saving…' : form.published ? 'Publish & Save' : 'Save as Draft'}</button>
          {form.id > 0 && <button type="button" disabled={busy} onClick={() => void remove()} className="rounded-full border border-red-200 px-5 py-3 text-sm font-bold text-red-700 hover:bg-red-50">Delete</button>}
        </div>
      </div>
    </form>
  )
}

function StoryEditor({ item, onReload, onNotice, onClose }: { item: AdminStory; onReload: () => Promise<void>; onNotice: (message: string) => void; onClose: () => void }) {
  const [form, setForm] = useState(item)
  const [busy, setBusy] = useState(false)
  const isDirty = JSON.stringify(form) !== JSON.stringify(item)

  function update<K extends keyof AdminStory>(key: K, value: AdminStory[K]) { setForm((current) => ({ ...current, [key]: value })) }
  
  function handleClose() {
    if (isDirty && !window.confirm('Aapke paas unsaved changes hain. Kya aap bina save kiye band karna chahte hain?')) return
    onClose()
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true)
    try {
      await saveStory({ data: form })
      await onReload()
      onNotice(form.published ? 'Story published live!' : 'Story saved as draft.')
      onClose()
    } catch { onNotice('Could not save story. Check the fields.') }
    finally { setBusy(false) }
  }

  async function remove() {
    if (!form.id || !window.confirm('Delete this story?')) return
    setBusy(true)
    try { await deleteStory({ data: { id: form.id } }); await onReload(); onNotice('Story deleted.'); onClose() }
    catch { onNotice('Could not delete story.') }
    finally { setBusy(false) }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-forest-900/10">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral-600">Success stories</p><h3 className="text-xl font-extrabold">{form.id ? 'Edit Story' : 'New Story'}</h3></div>
        <button type="button" onClick={handleClose} className="text-sm font-bold text-forest-900/50 hover:text-forest-900">Close ✕</button>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <EditorField label="Story Type"><select className="field" value={form.kind} onChange={(e) => update('kind', e.target.value as AdminStory['kind'])}><option value="testimonial">Client testimonial</option><option value="approval">Visa approval</option></select></EditorField>
          <EditorField label="Person / Family Name"><input className="field" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Client name" required /></EditorField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <EditorField label="City"><input className="field" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="e.g. Sangaria" /></EditorField>
          <EditorField label="Destination Country"><input className="field" value={form.country} onChange={(e) => update('country', e.target.value)} placeholder="Canada, UK, etc." /></EditorField>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <EditorField label="Visa / Course"><input className="field" value={form.visa} onChange={(e) => update('visa', e.target.value)} placeholder="Study Permit, PR…" /></EditorField>
          <EditorField label="Flag Code (optional)"><input className="field" value={form.flag} onChange={(e) => update('flag', e.target.value)} placeholder="CA, UK, AU…" /></EditorField>
        </div>
        <EditorField label="Client Quote / Feedback"><textarea className="field" rows={4} value={form.quote} onChange={(e) => update('quote', e.target.value)} placeholder="Feedback or testimonial..." /></EditorField>
        <EditorField label="Short Result Note"><input className="field" value={form.note} onChange={(e) => update('note', e.target.value)} placeholder="e.g. Sept intake · Conestoga" /></EditorField>
        <label className="flex items-center gap-2.5 rounded-xl bg-forest-50 p-3 text-sm font-bold text-forest-900 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} className="size-4" />
          <span>Publish on Live Website</span>
        </label>
        <div className="flex flex-wrap gap-2 pt-2">
          <button disabled={busy} className="rounded-full bg-forest-900 px-6 py-3 text-sm font-bold text-white hover:bg-forest-800 disabled:opacity-50">{busy ? 'Saving…' : form.published ? 'Publish & Save' : 'Save as Draft'}</button>
          {form.id > 0 && <button type="button" disabled={busy} onClick={() => void remove()} className="rounded-full border border-red-200 px-5 py-3 text-sm font-bold text-red-700 hover:bg-red-50">Delete</button>}
        </div>
      </div>
    </form>
  )
}

function SettingsPanel({ settings, onReload, onNotice }: { settings: AdminSnapshot['settings']; onReload: () => Promise<void>; onNotice: (message: string) => void }) {
  const [form, setForm] = useState(settings)
  const [busy, setBusy] = useState(false)
  async function save() { setBusy(true); try { await updateSettings({ data: form }); await onReload(); onNotice('Site settings saved.') } catch { onNotice('Could not save settings.') } finally { setBusy(false) } }
  return (
    <section className="max-w-2xl"><p className="font-mono text-xs uppercase tracking-[0.18em] text-coral-600">Controls</p><h2 className="mt-2 text-3xl font-extrabold">Switch features on or off</h2>
      <div className="mt-6 grid gap-4 rounded-3xl bg-white p-6 ring-1 ring-forest-900/10">
        <label className="flex items-center justify-between gap-4 border-b border-forest-900/10 pb-4"><span><strong className="block">Enquiry popup</strong><small className="text-forest-900/60">Show enquiry popup to visitors.</small></span><input type="checkbox" checked={form.popupEnabled} onChange={(e) => setForm({ ...form, popupEnabled: e.target.checked })} /></label>
        <label className="flex items-center justify-between gap-4 border-b border-forest-900/10 pb-4"><span><strong className="block">WhatsApp button</strong><small className="text-forest-900/60">Floating WhatsApp chat button.</small></span><input type="checkbox" checked={form.whatsappEnabled} onChange={(e) => setForm({ ...form, whatsappEnabled: e.target.checked })} /></label>
        <label className="flex items-center justify-between gap-4 border-b border-forest-900/10 pb-4"><span><strong className="block">Approvals marquee</strong><small className="text-forest-900/60">Moving strip on home page.</small></span><input type="checkbox" checked={form.approvalsMarqueeEnabled} onChange={(e) => setForm({ ...form, approvalsMarqueeEnabled: e.target.checked })} /></label>
        <label><span className="mb-2 block font-bold">Popup delay (seconds)</span><input className="field max-w-40" type="number" min="3" max="60" value={form.popupDelaySeconds} onChange={(e) => setForm({ ...form, popupDelaySeconds: Number(e.target.value) })} /></label>
        <button type="button" disabled={busy} onClick={() => void save()} className="w-fit rounded-full bg-forest-900 px-6 py-3 text-sm font-bold text-white">{busy ? 'Saving…' : 'Save settings'}</button>
      </div>
    </section>
  )
}

function UsersPanel({ users, currentEmail, onReload, onNotice }: { users: AdminUser[]; currentEmail: string; onReload: () => Promise<void>; onNotice: (message: string) => void }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<AdminRole>('content_editor')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [busy, setBusy] = useState(false)
  const [resetModalUser, setResetModalUser] = useState<AdminUser | null>(null)
  const [newStaffPassword, setNewStaffPassword] = useState('')
  const [showResetPass, setShowResetPass] = useState(false)

  async function save() {
    if (!email || !password) { onNotice('Email and initial password are required'); return }
    if (password.length < 6) { onNotice('Password must be at least 6 characters'); return }
    setBusy(true)
    try {
      await saveAdminUser({ data: { email: email.trim().toLowerCase(), name: name.trim() || email.trim(), role, password: password.trim() } })
      setEmail(''); setName(''); setPassword(''); setShowPass(false)
      await onReload()
      onNotice('New staff user created! They can now sign in with this email and password.')
    } catch (cause) { onNotice(cause instanceof Error ? cause.message : 'Could not save user.') }
    finally { setBusy(false) }
  }

  async function handleResetStaffPass(e: FormEvent) {
    e.preventDefault()
    if (!resetModalUser || newStaffPassword.length < 6) return
    setBusy(true)
    try {
      await saveAdminUser({ data: { email: resetModalUser.email, name: resetModalUser.name, role: resetModalUser.role, password: newStaffPassword.trim() } })
      onNotice(`Password for ${resetModalUser.email} has been updated!`)
      setResetModalUser(null); setNewStaffPassword(''); setShowResetPass(false)
      await onReload()
    } catch (err) { onNotice('Failed to update password') }
    finally { setBusy(false) }
  }

  async function remove(openId: string) {
    if (!window.confirm('Remove this user? They will no longer be able to log in.')) return
    setBusy(true)
    try { await deleteAdminUser({ data: { openId } }); await onReload(); onNotice('User removed.') }
    catch (cause) { onNotice(cause instanceof Error ? cause.message : 'Could not remove user.') }
    finally { setBusy(false) }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-coral-600">Access control</p>
        <h2 className="mt-2 text-3xl font-extrabold">Add New Staff / User</h2>
        <p className="mt-2 text-sm leading-relaxed text-forest-900/65">Create an account for your counsellors or editors. They sign in using this email and password, and only see the sections allowed by their role.</p>
        <div className="mt-6 grid gap-4 rounded-3xl bg-white p-6 ring-1 ring-forest-900/10">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-900/70 mb-1.5">Staff Email (Login ID) *</label>
            <input className="field" type="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. rahul@gmail.com" required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-900/70 mb-1.5">Staff Full Name</label>
            <input className="field" type="text" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahul Sharma" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-900/70 mb-1.5">Initial Password (min 6 chars) *</label>
            <div className="relative">
              <input className="field !pr-11" type={showPass ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="e.g. Rahul@2026" required minLength={6} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-900/50 hover:text-forest-900 p-1" title={showPass ? 'Hide password' : 'Show password'}>
                {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-900/70 mb-1.5">Role & Permissions</label>
            <select className="field" value={role} onChange={(e) => setRole(e.target.value as AdminRole)}>
              <option value="content_editor">Content Editor (Only News, Stories & Batches)</option>
              <option value="enquiry_manager">Enquiry Manager (Only Leads & Inquiries)</option>
              <option value="super_admin">Super Admin (Everything)</option>
            </select>
          </div>
          <div className="rounded-2xl bg-cream p-4 text-xs text-forest-900/70">
            <strong className="text-forest-900">{roleLabels[role]}</strong>
            <p className="mt-1">{role === 'super_admin' ? 'Full control over leads, content, settings and staff users.' : role === 'content_editor' ? 'Can manage News, IELTS/PTE Batches and Success Stories. Cannot see student enquiries.' : 'Can view leads, update follow-up status, add counsellor notes and export to Excel.'}</p>
          </div>
          <button type="button" disabled={busy || !email || !password} onClick={() => void save()} className="w-fit rounded-full bg-forest-900 px-6 py-3 text-sm font-bold text-white hover:bg-forest-800 disabled:opacity-50">{busy ? 'Creating…' : 'Create Staff Account'}</button>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">Active Staff Accounts</h3>
        <div className="grid gap-3">
          {users.map((user) => (
            <article key={user.openId} className="flex flex-col justify-between gap-3 rounded-2xl bg-white p-5 ring-1 ring-forest-900/10 sm:flex-row sm:items-center">
              <div>
                <strong>{user.name || user.email}</strong>
                <p className="text-xs text-forest-900/60">{user.email}</p>
                <span className="mt-1.5 inline-flex rounded-full bg-coral-50 px-3 py-0.5 text-xs font-bold text-coral-700">{roleLabels[user.role]}</span>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => { setResetModalUser(user); setNewStaffPassword(''); setShowResetPass(false) }} className="rounded-full border border-forest-900/20 px-3.5 py-1.5 text-xs font-bold text-forest-900 hover:bg-forest-50">Reset Password</button>
                <button type="button" disabled={busy || user.email.toLowerCase() === currentEmail.toLowerCase()} onClick={() => void remove(user.openId)} className="rounded-full border border-red-200 px-3.5 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-30">{user.email.toLowerCase() === currentEmail.toLowerCase() ? 'You' : 'Remove'}</button>
              </div>
            </article>
          ))}
          {users.length === 0 && <p className="rounded-2xl bg-white p-6 text-center text-sm text-forest-900/60">No additional staff users yet.</p>}
        </div>
      </div>

      {resetModalUser && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <h4 className="text-lg font-bold">Reset Password for Staff</h4>
            <p className="text-xs text-forest-900/60 mt-1">{resetModalUser.email}</p>
            <form onSubmit={handleResetStaffPass} className="mt-4 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-900/70 mb-1">New Password (min 6 chars)</label>
              <div className="relative">
                <input type={showResetPass ? 'text' : 'password'} required minLength={6} value={newStaffPassword} onChange={(e) => setNewStaffPassword(e.target.value)} className="field !pr-11" placeholder="Enter new password (min 6 chars)" autoComplete="new-password" />
                <button type="button" onClick={() => setShowResetPass(!showResetPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-900/50 hover:text-forest-900 p-1" title={showResetPass ? 'Hide password' : 'Show password'}>
                  {showResetPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setResetModalUser(null)} className="rounded-full border px-4 py-2 text-xs font-bold">Cancel</button>
                <button type="submit" disabled={busy || newStaffPassword.length < 6} className="rounded-full bg-forest-900 text-white px-4 py-2 text-xs font-bold disabled:opacity-50">{busy ? 'Saving…' : 'Save Password'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

function EnquiriesPanel({ enquiries, stats, query, setQuery, statusFilter, setStatusFilter, dateFrom, setDateFrom, dateTo, setDateTo, onReload, onNotice, canDelete }: { enquiries: Enquiry[]; stats: AdminSnapshot['enquiryStats']; query: string; setQuery: (value: string) => void; statusFilter: EnquiryStatus | 'All'; setStatusFilter: (value: EnquiryStatus | 'All') => void; dateFrom: string; setDateFrom: (value: string) => void; dateTo: string; setDateTo: (value: string) => void; onReload: () => Promise<void>; onNotice: (message: string) => void; canDelete: boolean }) {
  async function downloadExcel() {
    try {
      const result = await exportEnquiries({ data: { query, status: statusFilter === 'All' ? '' : statusFilter, from: dateFrom, to: dateTo } })
      const bytes = Uint8Array.from(atob(result.base64), (char) => char.charCodeAt(0))
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
      const link = document.createElement('a')
      link.href = url
      link.download = result.filename
      link.click()
      URL.revokeObjectURL(url)
      onNotice(`${enquiries.length} leads exported to Excel.`)
    } catch {
      onNotice('Could not export enquiries.')
    }
  }

  return (
    <section>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total leads" value={stats.total} />
        <StatCard label="New enquiries" value={stats.newCount} highlight />
        <StatCard label="Active follow-ups" value={stats.followUps} />
        <StatCard label="Follow-up due today" value={stats.dueToday} alert={stats.dueToday > 0} />
        <StatCard label="Converted clients" value={stats.converted} />
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-forest-900/10">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <input className="field max-w-xs !py-2 !text-xs" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, phone, city, notes…" />
          <select className="field max-w-44 !py-2 !text-xs" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as EnquiryStatus | 'All')}>
            <option value="All">All statuses</option>
            <option>New</option><option>Contacted</option><option>Follow-up</option><option>Documents Pending</option><option>Applied</option><option>Converted</option><option>Closed</option>
          </select>
          <input className="field max-w-36 !py-2 !text-xs" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} title="From date" />
          <input className="field max-w-36 !py-2 !text-xs" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} title="To date" />
        </div>
        <button type="button" onClick={() => void downloadExcel()} className="rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-forest-800">Export to Excel</button>
      </div>
      <div className="grid gap-3">
        {enquiries.map((e) => <EnquiryRow key={e.id} enquiry={e} onReload={onReload} onNotice={onNotice} canDelete={canDelete} />)}
        {enquiries.length === 0 && <div className="rounded-3xl bg-white p-12 text-center text-sm text-forest-900/50">No enquiries match the selected filters.</div>}
      </div>
    </section>
  )
}

function StatCard({ label, value, highlight, alert }: { label: string; value: number; highlight?: boolean; alert?: boolean }) {
  return (
    <div className={`rounded-3xl p-5 ring-1 ${alert ? 'bg-red-50 text-red-900 ring-red-200' : highlight ? 'bg-coral-500 text-white ring-coral-600' : 'bg-white text-forest-900 ring-forest-900/10'}`}>
      <p className="font-mono text-[10px] uppercase tracking-wider opacity-70">{label}</p>
      <p className="mt-2 text-3xl font-extrabold">{value}</p>
    </div>
  )
}

function EnquiryRow({ enquiry: e, onReload, onNotice, canDelete }: { enquiry: Enquiry; onReload: () => Promise<void>; onNotice: (message: string) => void; canDelete: boolean }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(e.status)
  const [notes, setNotes] = useState(e.notes)
  const [assignedTo, setAssignedTo] = useState(e.assignedTo)
  const [nextFollowUpAt, setNextFollowUpAt] = useState(e.nextFollowUpAt ? e.nextFollowUpAt.slice(0, 16) : '')
  const [busy, setBusy] = useState(false)

  async function save() {
    setBusy(true)
    try {
      await updateEnquiry({ data: { id: e.id, status, notes, assignedTo, nextFollowUpAt: nextFollowUpAt ? `${nextFollowUpAt}:00` : '' } })
      await onReload()
      onNotice('Enquiry updated.')
      setOpen(false)
    } catch { onNotice('Could not update enquiry.') }
    finally { setBusy(false) }
  }

  async function remove() {
    if (!window.confirm('Permanently delete this enquiry?')) return
    setBusy(true)
    try { await deleteEnquiry({ data: { id: e.id } }); await onReload(); onNotice('Enquiry deleted.') }
    catch { onNotice('Could not delete enquiry.') }
    finally { setBusy(false) }
  }

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-forest-900/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2"><strong>{e.name}</strong><span className="text-xs text-forest-900/50">· {e.phone}</span></div>
          <p className="text-xs text-forest-900/60 mt-0.5">{e.interest || 'General Enquiry'} · {e.country || 'Any country'} {e.city ? `· ${e.city}` : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${e.status === 'New' ? 'bg-coral-100 text-coral-800' : e.status === 'Converted' ? 'bg-emerald-100 text-emerald-800' : 'bg-forest-100 text-forest-800'}`}>{e.status}</span>
          <button type="button" onClick={() => setOpen((prev) => !prev)} className="rounded-full border border-forest-900/15 px-3 py-1 text-xs font-bold text-forest-900 hover:bg-forest-50">{open ? 'Close' : 'Manage'}</button>
        </div>
      </div>
      {open && (
        <div className="mt-4 border-t border-forest-900/10 pt-4 grid gap-3 text-xs">
          {e.message && <div className="rounded-xl bg-cream p-3 text-forest-900/80"><strong>Message:</strong> {e.message}</div>}
          <div className="grid gap-3 sm:grid-cols-3">
            <div><label className="font-bold block mb-1">Status</label><select className="field !py-2 !text-xs" value={status} onChange={(event) => setStatus(event.target.value as EnquiryStatus)}><option>New</option><option>Contacted</option><option>Follow-up</option><option>Documents Pending</option><option>Applied</option><option>Converted</option><option>Closed</option></select></div>
            <div><label className="font-bold block mb-1">Assigned Counsellor</label><input className="field !py-2 !text-xs" value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)} placeholder="Counsellor name" /></div>
            <div><label className="font-bold block mb-1">Next Follow-up</label><input className="field !py-2 !text-xs" type="datetime-local" value={nextFollowUpAt} onChange={(event) => setNextFollowUpAt(event.target.value)} /></div>
          </div>
          <div><label className="font-bold block mb-1">Counsellor Notes</label><textarea className="field !py-2 !text-xs" rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Write call notes, document status, etc." /></div>
          <div className="flex justify-between items-center pt-2">
            {canDelete ? <button type="button" disabled={busy} onClick={() => void remove()} className="text-red-600 font-bold hover:underline">Delete Lead</button> : <span />}
            <button type="button" disabled={busy} onClick={() => void save()} className="rounded-full bg-forest-900 px-5 py-2 text-xs font-bold text-white hover:bg-forest-800">{busy ? 'Saving…' : 'Save Changes'}</button>
          </div>
        </div>
      )}
    </article>
  )
}
