import { createFileRoute } from '@tanstack/react-router'
import { ApprovalCard, TestimonialCard } from '@/components/Cards'
import { useEffect, useState, type FormEvent, type MouseEvent, type ReactNode } from 'react'
import { getAdminCashflow, getAdminSnapshot, addEnquiryActivity, deleteAdminUser, deleteBatch, deleteEnquiry, deleteEnquiryActivity, deletePost, deleteStory, exportEnquiries, saveAdminUser, saveBatch, saveCashflow, savePost, saveStory, updateEnquiry, updateEnquiryActivity, updateSettings } from '@/lib/admin-functions'
import type { AdminPost, AdminRole, AdminSnapshot, AdminStory, AdminUser, CoachingBatch, Enquiry, EnquiryActivity, EnquiryStatus } from '@/lib/content-types'
import { defaultCashflowData, CountryCashflow } from '@/data/cashflow'
import { formatBatchStartDate, getBatchDateStatus, isValidBatchStartDate } from '@/lib/batch-dates'

export const Route = createFileRoute('/admin')({
  head: () => ({ meta: [{ title: 'Admin · British Education and Immigration' }, { name: 'robots', content: 'noindex,nofollow,noarchive' }] }),
  component: AdminPage,
})

type Tab = 'enquiries' | 'news' | 'stories' | 'batches' | 'budget' | 'settings' | 'users'

const roleLabels: Record<AdminRole, string> = { super_admin: 'Super Admin', content_editor: 'Content Editor', enquiry_manager: 'Enquiry Manager' }

const blankPost: Omit<AdminPost, 'id'> = { slug: '', title: '', category: 'Visa News', date: new Date().toISOString().slice(0, 10), excerpt: '', readMins: 4, body: [], published: false }
const blankStory: Omit<AdminStory, 'id'> = { kind: 'testimonial', name: '', city: '', country: '', visa: '', quote: '', rating: 5, initials: '', flag: '', date: new Date().toISOString().slice(0, 10), note: '', published: false }

function AdminPage() {
  const [snapshot, setSnapshot] = useState<AdminSnapshot | null>(null)
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

  async function reload() {
    try {
      setError('')
      setSnapshot(await getAdminSnapshot())
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Admin access is not configured yet.')
    }
  }

  useEffect(() => { void reload() }, [])
  useEffect(() => { if (snapshot?.user.role === 'content_editor' && tab === 'enquiries') setTab('news') }, [snapshot?.user.role, tab])

  if (!snapshot) {
    return (
      <section className="grid min-h-screen place-items-center bg-cream px-6 py-16">
        <AdminAuthCard onLoginSuccess={reload} />
      </section>
    )
  }

  const filtered = snapshot.enquiries.filter((item) => {
    const haystack = `${item.name} ${item.phone} ${item.email} ${item.city} ${item.country} ${item.interest} ${item.status} ${item.assignedTo}`.toLowerCase()
    const created = item.createdAt.slice(0, 10)
    return haystack.includes(query.toLowerCase()) && (statusFilter === 'All' || item.status === statusFilter) && (!dateFrom || created >= dateFrom) && (!dateTo || created <= dateTo)
  })
  const tabs: Array<[Tab, string]> = snapshot.user.role === 'super_admin'
    ? [['enquiries', `Enquiries (${snapshot.enquiryStats.total})`], ['news', 'News & Updates'], ['stories', 'Success Stories'], ['batches', 'Coaching batches'], ['budget', '💰 Cashflow Budget'],['settings', 'Site settings'], ['users', 'Users & roles']]
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
          <div className="text-right text-xs text-forest-900/60"><p>{snapshot.user.name}</p><p>{snapshot.user.email}</p><p className="font-bold text-coral-600">{roleLabels[snapshot.user.role]}</p><button type="button" onClick={() => setShowChangePass(true)} className="mr-3 font-bold text-forest-900 hover:text-coral-600">Change password</button><a href="/admin/oauth/logout" className="font-bold text-coral-600">Log out</a></div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <nav className="mb-8 flex gap-2 overflow-x-auto pb-2" aria-label="Admin sections">
          {tabs.map(([value, label]) => <button key={value} type="button" onClick={() => setTab(value)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${tab === value ? 'bg-forest-900 text-white' : 'bg-white ring-1 ring-forest-900/10'}`}>{label}</button>)}
        </nav>
        {notice && <p className="mb-5 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-bold text-emerald-900">{notice}</p>}
        {tab === 'enquiries' && <EnquiriesPanel enquiries={filtered} stats={snapshot.enquiryStats} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} dateFrom={dateFrom} setDateFrom={setDateFrom} dateTo={dateTo} setDateTo={setDateTo} onReload={reload} onNotice={showNotice} canDelete={snapshot.user.role === 'super_admin'} canManageComments={snapshot.user.role === 'super_admin'} />}
        {tab === 'news' && <ContentPanel type="news" items={snapshot.posts} selected={selectedPost} onSelect={(item) => setSelectedPost(item as AdminPost | null)} onReload={reload} onNotice={showNotice} />}
        {tab === 'stories' && <ContentPanel type="stories" items={snapshot.stories} selected={selectedStory} onSelect={(item) => setSelectedStory(item as AdminStory | null)} onReload={reload} onNotice={showNotice} />}
        {tab === 'batches' && <BatchPanel items={snapshot.batches} selected={selectedBatch} onSelect={setSelectedBatch} onReload={reload} onNotice={showNotice} />}
		{tab === 'budget' && <CashflowAdminPanel onNotice={showNotice} />}
        {tab === 'settings' && <SettingsPanel settings={snapshot.settings} onReload={reload} onNotice={showNotice} />}
        {tab === 'users' && <UsersPanel users={snapshot.users} currentEmail={snapshot.user.email} onReload={reload} onNotice={showNotice} />}
        {showChangePass && <ChangePasswordModal onClose={() => setShowChangePass(false)} onNotice={showNotice} />}
      </main>
    </div>
  )
}
function PasswordInput({ value, onChange, className, placeholder, required, minLength, autoComplete, ariaLabel, toggleClassName }: { value: string; onChange: (value: string) => void; className: string; placeholder: string; required?: boolean; minLength?: number; autoComplete: string; ariaLabel: string; toggleClassName: string }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={className + ' !pr-12'}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-label={ariaLabel}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className={'absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-400 ' + toggleClassName}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z" />
          <circle cx="12" cy="12" r="3" />
          {visible && <path d="m3 3 18 18" />}
        </svg>
      </button>
    </div>
  )
}

function AdminAuthCard({ onLoginSuccess }: { onLoginSuccess: () => Promise<void> }) {
  const [mode, setMode] = useState<'login' | 'forgot' | 'pin'>('login')
  const [identifier, setIdentifier] = useState('admin@britisheducationandimmigration.com')
  const [password, setPassword] = useState('')
  const [otpEmail, setOtpEmail] = useState('')
  const [otpStep, setOtpStep] = useState<'enter_email' | 'enter_otp'>('enter_email')
  const [otpCode, setOtpCode] = useState('')
  const [newOtpPassword, setNewOtpPassword] = useState('')
  const [recoveryEmail, setRecoveryEmail] = useState('admin@britisheducationandimmigration.com')
  const [recoveryKey, setRecoveryKey] = useState('')
  const [newPinPassword, setNewPinPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

  async function handleLogin(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage(null)
    try {
      const response = await fetch('/admin/oauth/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier, password }) })
      const data = (await response.json()) as { ok?: boolean; error?: string }
      if (!response.ok || !data.ok) throw new Error(data.error || 'Invalid username or password')
      await onLoginSuccess()
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : 'Login failed', type: 'error' })
    } finally {
      setBusy(false)
    }
  }

  async function requestOtp() {
    setBusy(true)
    setMessage(null)
    try {
      const response = await fetch('/admin/oauth/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'send-otp', email: otpEmail }) })
      const data = (await response.json()) as { ok?: boolean; message?: string; error?: string }
      if (!response.ok || !data.ok) throw new Error(data.error || 'Failed to send OTP')
      setOtpStep('enter_otp')
      setOtpCode('')
      setMessage({ text: data.message || 'OTP sent. Check your inbox or spam folder.', type: 'success' })
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : 'Failed to send OTP', type: 'error' })
    } finally {
      setBusy(false)
    }
  }

  async function handleSendOtp(event: FormEvent) {
    event.preventDefault()
    await requestOtp()
  }

  async function handleVerifyOtp(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage(null)
    try {
      const response = await fetch('/admin/oauth/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'verify-otp', email: otpEmail, otp: otpCode, newPassword: newOtpPassword }) })
      const data = (await response.json()) as { ok?: boolean; message?: string; error?: string }
      if (!response.ok || !data.ok) throw new Error(data.error || 'Failed to verify OTP')
      setMessage({ text: data.message || 'Password reset successfully. Sign in with your new password.', type: 'success' })
      setMode('login')
      setPassword('')
      setOtpStep('enter_email')
      setOtpCode('')
      setNewOtpPassword('')
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : 'Failed to verify OTP', type: 'error' })
    } finally {
      setBusy(false)
    }
  }

  async function handlePinReset(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage(null)
    try {
      const response = await fetch('/admin/oauth/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'forgot', email: recoveryEmail, recoveryKey, newPassword: newPinPassword }) })
      const data = (await response.json()) as { ok?: boolean; message?: string; error?: string }
      if (!response.ok || !data.ok) throw new Error(data.error || 'Password reset failed')
      setMessage({ text: data.message || 'Password reset successfully with the Master PIN. Sign in now.', type: 'success' })
      setMode('login')
      setPassword('')
      setRecoveryKey('')
      setNewPinPassword('')
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : 'Master PIN reset failed', type: 'error' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2.5rem] bg-forest-900 p-8 text-white shadow-2xl ring-1 ring-white/10">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-coral-400">Owner dashboard</p>
          <h1 className="mt-1 text-2xl font-extrabold">British Education & Immigration</h1>
        </div>
      </div>
      <div className="mt-6 flex rounded-full bg-forest-950 p-1 text-xs font-bold">
        <button type="button" onClick={() => { setMode('login'); setMessage(null) }} className={'flex-1 rounded-full py-2.5 transition ' + (mode === 'login' ? 'bg-coral-500 text-white shadow' : 'text-forest-100/60 hover:text-white')}>Sign in</button>
        <button type="button" onClick={() => { setMode('forgot'); setOtpStep('enter_email'); setMessage(null) }} className={'flex-1 rounded-full py-2.5 transition ' + (mode !== 'login' ? 'bg-coral-500 text-white shadow' : 'text-forest-100/60 hover:text-white')}>Forgot password?</button>
      </div>
      {message && <div className={'mt-5 rounded-2xl p-4 text-xs font-bold leading-relaxed ' + (message.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40' : 'bg-red-500/20 text-red-300 ring-1 ring-red-500/40')}>{message.text}</div>}
      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-forest-100/70">Username or Email</label>
            <input type="text" required value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="username" className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:bg-white/20 focus:outline-none focus:ring-coral-400" placeholder="admin@britisheducationandimmigration.com" />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-bold text-forest-100/70">Password</label>
              <button type="button" onClick={() => { setMode('forgot'); setOtpStep('enter_email'); setMessage(null) }} className="text-[11px] font-bold text-coral-400 hover:underline">Forgot?</button>
            </div>
            <PasswordInput value={password} onChange={setPassword} required autoComplete="current-password" ariaLabel="Admin password" className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:bg-white/20 focus:outline-none focus:ring-coral-400" placeholder="Enter admin password" toggleClassName="text-white/60 hover:text-white" />
          </div>
          <button type="submit" disabled={busy} className="mt-2 w-full rounded-full bg-coral-500 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-coral-600 disabled:opacity-50">{busy ? 'Verifying…' : 'Sign in to Dashboard →'}</button>
        </form>
      ) : mode === 'forgot' ? (
        otpStep === 'enter_email' ? (
          <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
            <p className="text-xs leading-relaxed text-forest-100/70">Enter your registered admin email to receive a 6-digit OTP. It expires after 10 minutes.</p>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-forest-100/70">Registered Email</label>
              <input type="email" required value={otpEmail} onChange={(event) => setOtpEmail(event.target.value)} autoComplete="email" className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-coral-400" placeholder="Enter your admin email" />
            </div>
            <button type="submit" disabled={busy || !otpEmail.trim()} className="mt-2 w-full rounded-full bg-coral-500 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-coral-600 disabled:opacity-50">{busy ? 'Sending OTP…' : 'Send 6-Digit OTP to Email →'}</button>
            <div className="border-t border-white/10 pt-3 text-center">
              <button type="button" onClick={() => { setRecoveryEmail(otpEmail.trim() || 'admin@britisheducationandimmigration.com'); setMode('pin'); setMessage(null) }} className="text-xs font-bold text-coral-400 hover:text-coral-300 hover:underline">Email access nahi hai? Master PIN se reset karein →</button>
            </div>
            <button type="button" onClick={() => { setMode('login'); setMessage(null) }} className="w-full text-center text-xs font-bold text-forest-100/60 hover:text-white">← Back to sign in</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
            <div className="flex items-center justify-between gap-3 text-xs text-forest-100/70">
              <span className="min-w-0 break-all">Sent to: <b>{otpEmail}</b></span>
              <button type="button" onClick={() => { setOtpStep('enter_email'); setMessage(null) }} className="shrink-0 text-coral-400 hover:underline">Change</button>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-forest-100/70">Enter 6-Digit OTP</label>
              <input type="text" required maxLength={6} pattern="[0-9]{6}" inputMode="numeric" autoComplete="one-time-code" value={otpCode} onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, ''))} className="w-full rounded-2xl bg-white/10 px-4 py-3 text-center text-xl font-mono font-bold tracking-widest text-white ring-1 ring-white/10 focus:outline-none focus:ring-coral-400" placeholder="123456" aria-label="6-digit password reset code" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-forest-100/70">New Password (minimum 6 characters)</label>
              <PasswordInput value={newOtpPassword} onChange={setNewOtpPassword} required minLength={6} autoComplete="new-password" ariaLabel="New admin password" className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-coral-400" placeholder="Enter new password" toggleClassName="text-white/60 hover:text-white" />
            </div>
            <button type="submit" disabled={busy || otpCode.length !== 6 || newOtpPassword.length < 6} className="mt-2 w-full rounded-full bg-coral-500 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-coral-600 disabled:opacity-50">{busy ? 'Verifying OTP…' : 'Verify OTP & Reset Password'}</button>
            <div className="flex items-center justify-between pt-1 text-xs">
              <button type="button" onClick={() => void requestOtp()} disabled={busy} className="font-bold text-coral-400 hover:underline disabled:opacity-50">{busy ? 'Sending…' : 'Resend OTP'}</button>
              <button type="button" onClick={() => { setMode('login'); setMessage(null) }} className="font-bold text-forest-100/60 hover:text-white">Cancel</button>
            </div>
          </form>
        )
      ) : (
        <form onSubmit={handlePinReset} className="mt-6 space-y-4">
          <p className="text-xs leading-relaxed text-forest-100/70">Master Security PIN reset. Use this fallback if you cannot access the registered admin email.</p>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-forest-100/70">Admin Email</label>
            <input type="email" required value={recoveryEmail} onChange={(event) => setRecoveryEmail(event.target.value)} autoComplete="email" className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-coral-400" placeholder="Enter admin email" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-forest-100/70">Master Recovery Key (Security PIN)</label>
            <input type="text" required value={recoveryKey} onChange={(event) => setRecoveryKey(event.target.value)} autoComplete="off" className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-coral-400" placeholder="Enter recovery key" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-forest-100/70">New Password (minimum 6 characters)</label>
            <PasswordInput value={newPinPassword} onChange={setNewPinPassword} required minLength={6} autoComplete="new-password" ariaLabel="New password for Master PIN reset" className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-coral-400" placeholder="Enter new password" toggleClassName="text-white/60 hover:text-white" />
          </div>
          <button type="submit" disabled={busy} className="mt-2 w-full rounded-full bg-coral-500 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-coral-600 disabled:opacity-50">{busy ? 'Updating…' : 'Reset & Save Password'}</button>
          <div className="flex justify-between pt-1 text-xs">
            <button type="button" onClick={() => { setMode('forgot'); setOtpStep('enter_email'); setMessage(null) }} className="font-bold text-coral-400 hover:underline">← Use email OTP</button>
            <button type="button" onClick={() => { setMode('login'); setMessage(null) }} className="font-bold text-forest-100/60 hover:text-white">Cancel</button>
          </div>
        </form>
      )}
      <div className="mt-6 border-t border-white/10 pt-4 text-center">
        <a href="/" className="text-xs font-semibold text-forest-100/60 hover:text-white">← Return to public website</a>
      </div>
    </div>
  )
}

function ChangePasswordModal({ onClose, onNotice }: { onClose: () => void; onNotice: (msg: string) => void }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/admin/oauth/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change', oldPassword, newPassword }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to update password')
      onNotice('Password updated successfully!')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-forest-900/10">
        <div className="flex items-center justify-between pb-3 border-b border-forest-900/10">
          <h3 className="text-lg font-extrabold text-forest-900">Change Admin Password</h3>
          <button type="button" onClick={onClose} className="text-sm font-bold text-forest-900/40 hover:text-forest-900">✕</button>
        </div>
        {error && <p className="mt-4 rounded-xl bg-red-100 p-3 text-xs font-bold text-red-800">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-forest-900/70 mb-1">Current Password</label>
            <PasswordInput value={oldPassword} onChange={setOldPassword} required autoComplete="current-password" ariaLabel="Current admin password" className="field" placeholder="Enter current password" toggleClassName="text-forest-900/50 hover:text-forest-900" />
          </div>
          <div>
            <label className="block text-xs font-bold text-forest-900/70 mb-1">New Password (min 6 characters)</label>
            <PasswordInput value={newPassword} onChange={setNewPassword} required minLength={6} autoComplete="new-password" ariaLabel="New admin password" className="field" placeholder="Enter new password" toggleClassName="text-forest-900/50 hover:text-forest-900" />
          </div>
          <div>
            <label className="block text-xs font-bold text-forest-900/70 mb-1">Confirm New Password</label>
            <PasswordInput value={confirmPassword} onChange={setConfirmPassword} required minLength={6} autoComplete="new-password" ariaLabel="Confirm new admin password" className="field" placeholder="Re-type new password" toggleClassName="text-forest-900/50 hover:text-forest-900" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-full border border-forest-900/15 px-5 py-2.5 text-xs font-bold text-forest-900">
              Cancel
            </button>
            <button type="submit" disabled={busy} className="rounded-full bg-forest-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-forest-800 disabled:opacity-50">
              {busy ? 'Updating…' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EnquiriesPanel({ enquiries, stats, query, setQuery, statusFilter, setStatusFilter, dateFrom, setDateFrom, dateTo, setDateTo, onReload, onNotice, canDelete, canManageComments }: { enquiries: Enquiry[]; stats: AdminSnapshot['enquiryStats']; query: string; setQuery: (value: string) => void; statusFilter: EnquiryStatus | 'All'; setStatusFilter: (value: EnquiryStatus | 'All') => void; dateFrom: string; setDateFrom: (value: string) => void; dateTo: string; setDateTo: (value: string) => void; onReload: () => Promise<void>; onNotice: (message: string) => void; canDelete: boolean; canManageComments: boolean }) {
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list')
  const [selectedBoardLeadId, setSelectedBoardLeadId] = useState<number | null>(null)
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
    } catch { onNotice('Could not export leads to Excel.') }
  }
  const cards = [
    ['All leads', stats.total, 'bg-white'],
    ['New today', stats.newCount, 'bg-coral-500 text-white'],
    ['Active pipeline', stats.followUps, 'bg-forest-900 text-white'],
    ['Due today', stats.dueToday, 'bg-amber-100 text-amber-900'],
    ['Converted', stats.converted, 'bg-emerald-100 text-emerald-900'],
  ] as const
  const boardStatuses: EnquiryStatus[] = ['New', 'Contacted', 'Follow-up', 'Documents Pending', 'Applied', 'Converted', 'Closed']
  const selectedBoardLead = enquiries.find((item) => item.id === selectedBoardLeadId)
  return (
    <section>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="font-mono text-xs uppercase tracking-[0.18em] text-coral-600">Lead command centre</p><h2 className="mt-2 text-3xl font-extrabold">Turn enquiries into admissions</h2><p className="mt-1 text-sm text-forest-900/60">Search, move, assign and schedule every lead from one place.</p></div><button type="button" onClick={() => void downloadExcel()} className="w-fit rounded-full bg-forest-900 px-4 py-2 text-sm font-bold text-white">Download Excel</button></div>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{cards.map(([label, value, classes]) => <div key={label} className={`rounded-2xl p-4 ring-1 ring-forest-900/10 ${classes}`}><p className="text-xs font-bold uppercase tracking-wider opacity-65">{label}</p><p className="mt-2 text-3xl font-extrabold">{value}</p></div>)}</div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-bold text-forest-900/65">Choose how to review your filtered leads.</p><div role="group" aria-label="Lead display mode" className="inline-flex rounded-full bg-white p-1 ring-1 ring-forest-900/10"><button type="button" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')} className={'rounded-full px-4 py-2 text-xs font-bold ' + (viewMode === 'list' ? 'bg-forest-900 text-white' : 'text-forest-900/65')}>List</button><button type="button" aria-pressed={viewMode === 'board'} onClick={() => setViewMode('board')} className={'rounded-full px-4 py-2 text-xs font-bold ' + (viewMode === 'board' ? 'bg-forest-900 text-white' : 'text-forest-900/65')}>Pipeline board</button></div></div>
      <div className="mb-6 grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-forest-900/10 md:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="field" placeholder="Search name, phone, city, country…" />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as EnquiryStatus | 'All')} className="field"><option value="All">All stages</option>{['New', 'Contacted', 'Follow-up', 'Documents Pending', 'Applied', 'Converted', 'Closed'].map((status) => <option key={status}>{status}</option>)}</select>
        <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="field" aria-label="From date" />
        <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="field" aria-label="To date" />
      </div>
      <div className="mb-4 flex flex-wrap gap-2 text-xs font-bold text-forest-900/60"><span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-forest-900/10">Showing {enquiries.length} loaded leads</span><span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-forest-900/10">Excel includes Summary + Follow-ups sheets</span></div>
      {viewMode === 'list' ? (
        <div className="grid gap-4">{enquiries.map((item) => <EnquiryCard key={item.id} item={item} onReload={onReload} onNotice={onNotice} canDelete={canDelete} canManageComments={canManageComments} />)}{enquiries.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-forest-900/60">No enquiries match these filters.</p>}</div>
      ) : (
        <div className="space-y-5">
          <div className="overflow-x-auto pb-3">
            <div className="grid min-w-[1260px] grid-cols-7 gap-3">
              {boardStatuses.map((stage) => {
                const stageItems = enquiries.filter((item) => item.status === stage)
                return (
                  <section key={stage} className="min-h-64 rounded-2xl bg-forest-50 p-3 ring-1 ring-forest-900/10">
                    <header className="mb-3 flex items-center justify-between gap-2 border-b border-forest-900/10 pb-3">
                      <h3 className="text-xs font-extrabold text-forest-900">{stage}</h3>
                      <span className="rounded-full bg-white px-2 py-1 font-mono text-[10px] font-bold text-forest-700">{stageItems.length}</span>
                    </header>
                    <div className="grid gap-2">
                      {stageItems.map((item) => (
                        <button key={item.id} type="button" onClick={() => setSelectedBoardLeadId(item.id)} aria-label={'Open ' + item.name + ' lead details'} className="rounded-xl bg-white p-3 text-left shadow-sm ring-1 ring-forest-900/10 transition hover:-translate-y-0.5 hover:ring-coral-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral-500">
                          <span className="block truncate text-sm font-extrabold text-forest-900">{item.name}</span>
                          <span className="mt-1 block truncate text-xs text-forest-900/60">{item.interest || 'General counselling'}{item.country ? ' · ' + item.country : ''}</span>
                          <span className="mt-2 block truncate font-mono text-[10px] text-forest-900/55">{item.phone}</span>
                          {item.nextFollowUpAt && <span className="mt-2 block rounded-lg bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-900">Follow-up {new Date(item.nextFollowUpAt).toLocaleString()}</span>}
                          {item.assignedTo && <span className="mt-2 block truncate text-[10px] text-forest-900/50">Assigned: {item.assignedTo}</span>}
                        </button>
                      ))}
                      {stageItems.length === 0 && <p className="rounded-xl border border-dashed border-forest-900/15 px-2 py-4 text-center text-[10px] text-forest-900/45">No leads here</p>}
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
          {selectedBoardLead ? (
            <section className="rounded-3xl bg-forest-50 p-3 sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div><p className="font-mono text-[10px] font-bold uppercase tracking-widest text-coral-600">Selected lead</p><h3 className="mt-1 text-lg font-extrabold text-forest-900">{selectedBoardLead.name}</h3></div>
                <button type="button" onClick={() => setSelectedBoardLeadId(null)} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-forest-900 ring-1 ring-forest-900/10">Close details</button>
              </div>
              <EnquiryCard key={selectedBoardLead.id} item={selectedBoardLead} onReload={onReload} onNotice={onNotice} canDelete={canDelete} canManageComments={canManageComments} />
            </section>
          ) : <p className="rounded-2xl bg-white p-6 text-center text-sm text-forest-900/55">Choose a lead card to update its stage, owner or follow-up.</p>}
        </div>
      )}
    </section>
  )
}

function EnquiryCard({ item, onReload, onNotice, canDelete, canManageComments }: { item: Enquiry; onReload: () => Promise<void>; onNotice: (message: string) => void; canDelete: boolean; canManageComments: boolean }) {
  const [status, setStatus] = useState<EnquiryStatus>(item.status)
  const [assignedTo, setAssignedTo] = useState(item.assignedTo)
  const [nextFollowUpAt, setNextFollowUpAt] = useState(item.nextFollowUpAt ? item.nextFollowUpAt.slice(0, 16) : '')
  const [newComment, setNewComment] = useState('')
  const [editingActivityId, setEditingActivityId] = useState<number | null>(null)
  const [editingBody, setEditingBody] = useState('')
  const [busy, setBusy] = useState(false)

  async function save() {
    setBusy(true)
    try {
      await updateEnquiry({ data: { id: item.id, status, assignedTo, nextFollowUpAt } })
      await onReload()
      onNotice('Lead updated.')
    } catch {
      onNotice('Could not update lead.')
    } finally {
      setBusy(false)
    }
  }

  async function addComment(event: FormEvent) {
    event.preventDefault()
    const body = newComment.trim()
    if (!body) return
    setBusy(true)
    try {
      await addEnquiryActivity({ data: { enquiryId: item.id, body } })
      setNewComment('')
      await onReload()
      onNotice('Timeline comment added.')
    } catch {
      onNotice('Could not add timeline comment.')
    } finally {
      setBusy(false)
    }
  }

  async function saveComment(activityId: number) {
    const body = editingBody.trim()
    if (!body) return
    setBusy(true)
    try {
      await updateEnquiryActivity({ data: { id: activityId, body } })
      setEditingActivityId(null)
      setEditingBody('')
      await onReload()
      onNotice('Timeline comment updated.')
    } catch {
      onNotice('Could not update timeline comment.')
    } finally {
      setBusy(false)
    }
  }

  async function removeComment(activityId: number) {
    if (!window.confirm('Delete this timeline comment?')) return
    setBusy(true)
    try {
      await deleteEnquiryActivity({ data: { id: activityId } })
      await onReload()
      onNotice('Timeline comment deleted.')
    } catch {
      onNotice('Could not delete timeline comment.')
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!window.confirm('Delete this enquiry permanently?')) return
    setBusy(true)
    try {
      await deleteEnquiry({ data: { id: item.id } })
      await onReload()
      onNotice('Enquiry deleted.')
    } catch {
      onNotice('Could not delete enquiry.')
    } finally {
      setBusy(false)
    }
  }

  const formatActivityTime = (value: string) => new Date(value).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-forest-900/10">
      <div className="flex flex-col justify-between gap-5 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-extrabold">{item.name}</h3>
            <span className="rounded-full bg-coral-50 px-3 py-1 text-xs font-bold text-coral-700">{item.status}</span>
            {item.nextFollowUpAt && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">Follow-up {new Date(item.nextFollowUpAt).toLocaleString()}</span>}
          </div>
          <p className="mt-1 text-sm text-forest-900/60">{new Date(item.createdAt).toLocaleString()} · {item.source || 'website'}{item.assignedTo && <> · Assigned to {item.assignedTo}</>}</p>
          <p className="mt-4 text-sm"><strong>{item.phone}</strong>{item.email && <> · {item.email}</>}{item.city && <> · {item.city}</>}</p>
          <p className="mt-2 text-sm font-semibold">{item.interest || 'General counselling'}{item.country && <> · {item.country}</>}</p>
          {item.message && <p className="mt-3 max-w-3xl text-sm leading-relaxed text-forest-900/75">{item.message}</p>}
          {item.summary && <p className="mt-2 text-xs text-forest-900/50">Context: {item.summary}</p>}
        </div>
        <div className="grid content-start gap-2 lg:w-80">
          <select value={status} onChange={(event) => setStatus(event.target.value as EnquiryStatus)} className="field bg-cream"><option>New</option><option>Contacted</option><option>Follow-up</option><option>Documents Pending</option><option>Applied</option><option>Converted</option><option>Closed</option></select>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <input value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)} className="field bg-cream" placeholder="Assigned counsellor" />
            <input type="datetime-local" value={nextFollowUpAt} onChange={(event) => setNextFollowUpAt(event.target.value)} className="field bg-cream" aria-label="Next follow-up" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => void save()} className="rounded-full bg-forest-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Save lead</button>
            <a href={`https://wa.me/91${item.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white">WhatsApp</a>
            {canDelete && <button type="button" disabled={busy} onClick={() => void remove()} className="rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-700">Delete</button>}
          </div>
        </div>
      </div>

      <section className="mt-6 border-t border-forest-900/10 pt-5" aria-labelledby={`lead-timeline-${item.id}`}>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-coral-600">Lead history</p>
            <h4 id={`lead-timeline-${item.id}`} className="mt-1 text-lg font-extrabold">Follow-up timeline</h4>
          </div>
          <span className="text-xs text-forest-900/50">{item.activities.length} {item.activities.length === 1 ? 'entry' : 'entries'}</span>
        </div>

        <ol className="mt-4 grid gap-3">
          {item.notes && (
            <li className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4">
              <p className="text-xs font-bold text-amber-900">Previous note · original timestamp unavailable</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-forest-900/80">{item.notes}</p>
            </li>
          )}
          {item.activities.map((activity) => (
            <li key={activity.id} className="rounded-xl bg-forest-50 p-4 ring-1 ring-forest-900/5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-forest-900">
                    {activity.authorName || activity.authorEmail || 'Team member'}
                    <span className="font-normal text-forest-900/55"> · {formatActivityTime(activity.createdAt)}</span>
                    {activity.editedBy && <span className="font-normal text-forest-900/55"> · Edited by {activity.editedBy}</span>}
                  </p>
                  {editingActivityId === activity.id ? (
                    <div className="mt-3 grid gap-2">
                      <textarea value={editingBody} onChange={(event) => setEditingBody(event.target.value)} rows={3} maxLength={5000} className="field bg-white" aria-label="Edit timeline comment" />
                      <div className="flex flex-wrap gap-2">
                        <button type="button" disabled={busy || !editingBody.trim()} onClick={() => void saveComment(activity.id)} className="rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">Save edit</button>
                        <button type="button" disabled={busy} onClick={() => { setEditingActivityId(null); setEditingBody('') }} className="rounded-full border border-forest-900/15 px-4 py-2 text-xs font-bold text-forest-900">Cancel</button>
                      </div>
                    </div>
                  ) : <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-forest-900/80">{activity.body}</p>}
                </div>
                {canManageComments && editingActivityId !== activity.id && (
                  <div className="flex shrink-0 gap-2">
                    <button type="button" disabled={busy} onClick={() => { setEditingActivityId(activity.id); setEditingBody(activity.body) }} className="rounded-full border border-forest-900/15 px-3 py-1.5 text-xs font-bold text-forest-900 disabled:opacity-50">Edit</button>
                    <button type="button" disabled={busy} onClick={() => void removeComment(activity.id)} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700 disabled:opacity-50">Delete</button>
                  </div>
                )}
              </div>
            </li>
          ))}
          {!item.notes && item.activities.length === 0 && (
            <li className="rounded-xl border border-dashed border-forest-900/15 px-4 py-5 text-center text-sm text-forest-900/55">No timeline entries yet. Add a note after each call or follow-up to build the lead history.</li>
          )}
        </ol>

        <form onSubmit={addComment} className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <textarea value={newComment} onChange={(event) => setNewComment(event.target.value)} rows={2} maxLength={5000} className="field bg-cream" placeholder="Log a call, message, document update or next follow-up…" aria-label="Add lead timeline comment" />
          <button type="submit" disabled={busy || !newComment.trim()} className="min-h-11 rounded-full bg-coral-500 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Add comment'}</button>
        </form>
        <p className="mt-2 text-[11px] text-forest-900/50">Comments are timestamped and attributed to your admin account. Only a Super Admin can edit or delete them.</p>
      </section>
    </article>
  )
}

function BatchPanel({ items, selected, onSelect, onReload, onNotice }: { items: CoachingBatch[]; selected: CoachingBatch | null; onSelect: (item: CoachingBatch | null) => void; onReload: () => Promise<void>; onNotice: (message: string) => void }) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  function selectBatch(item: CoachingBatch | null) {
    if (item && selected && item.id !== selected.id && hasUnsavedChanges && !window.confirm('You have unsaved changes in this batch. Switch anyway and discard them?')) return
    setHasUnsavedChanges(false)
    onSelect(item)
  }
  function closeBatch(saved = false) {
    if (!saved && hasUnsavedChanges && !window.confirm('You have unsaved changes in this batch. Close and discard them?')) return
    setHasUnsavedChanges(false)
    onSelect(null)
  }
  return <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]"><div><div className="mb-5 flex items-end justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-[0.18em] text-coral-600">IELTS · PTE · Languages</p><h2 className="mt-2 text-3xl font-extrabold">Manage upcoming batches</h2><p className="mt-1 text-sm text-forest-900/60">Add or update any coaching program without touching code.</p></div><button type="button" onClick={() => selectBatch({ id: 0, program: 'IELTS', batch: '', time: '', seats: 0, starts: '', published: true })} className="rounded-full bg-coral-500 px-4 py-2 text-sm font-bold text-white">+ New batch</button></div><div className="grid gap-3">{items.map((item) => {
        const dateStatus = getBatchDateStatus(item.starts)
        return (
          <button type="button" key={item.id} onClick={() => selectBatch(item)} className={`rounded-2xl bg-white p-4 text-left ring-1 ring-forest-900/10 transition hover:ring-forest-900 ${selected?.id === item.id ? 'ring-2 ring-coral-500' : ''}`}>
            <div className="flex items-center justify-between gap-3"><strong>{item.batch}</strong><span className="rounded-full bg-forest-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-forest-700">{item.program}</span></div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-forest-900/50">
              <span>{item.time} · {formatBatchStartDate(item.starts)} · {item.seats} seats · {item.published ? 'Published' : 'Hidden'}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${dateStatus === 'expired' ? 'bg-red-100 text-red-700' : dateStatus === 'needs-date' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {dateStatus === 'expired' ? 'Expired' : dateStatus === 'needs-date' ? 'Set full date' : 'Upcoming'}
              </span>
            </div>
          </button>
        )
      })}</div></div>{selected ? <BatchEditor key={`batch-${selected.id}`} item={selected} onReload={onReload} onNotice={onNotice} onClose={closeBatch} onDirtyChange={setHasUnsavedChanges} /> : <div className="grid min-h-72 place-items-center rounded-3xl border border-dashed border-forest-900/20 p-8 text-center text-forest-900/50">Select a batch or create a new one.</div>}</section>
}

function BatchEditor({ item, onReload, onNotice, onClose, onDirtyChange }: { item: CoachingBatch; onReload: () => Promise<void>; onNotice: (message: string) => void; onClose: (saved?: boolean) => void; onDirtyChange: (dirty: boolean) => void }) {
  const [form, setForm] = useState(item)
  const [busy, setBusy] = useState(false)
  function update<K extends keyof CoachingBatch>(key: K, value: CoachingBatch[K]) { setForm((current) => ({ ...current, [key]: value })); onDirtyChange(true) }
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); try { await saveBatch({ data: form }); onDirtyChange(false); await onReload(); onNotice('Coaching batch saved.'); onClose(true) } catch (cause) { onNotice(cause instanceof Error ? cause.message : 'Could not save batch.') } finally { setBusy(false) } }
  async function remove() { if (!form.id || !window.confirm('Delete this coaching batch?')) return; setBusy(true); try { await deleteBatch({ data: { id: form.id } }); onDirtyChange(false); await onReload(); onNotice('Coaching batch deleted.'); onClose(true) } catch { onNotice('Could not delete batch.') } finally { setBusy(false) } }
  return <form onSubmit={submit} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-forest-900/10"><div className="mb-5 flex items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral-600">Public schedule</p><h3 className="text-xl font-extrabold">Batch editor</h3><p className="mt-1 text-xs leading-relaxed text-forest-900/55">These details appear in the Upcoming batches section on the public IELTS & PTE page.</p></div><button type="button" onClick={onClose} className="text-sm font-bold text-forest-900/50">Close</button></div><div className="grid gap-4"><EditorField label="Program / language" hint="Example: IELTS, PTE, German A1, French B2"><input className="field" value={form.program} onChange={(e) => update('program', e.target.value)} placeholder="IELTS / PTE / German…" required /></EditorField><EditorField label="Batch name" hint="Example: German A1 Evening Batch or IELTS Weekend Batch"><input className="field" value={form.batch} onChange={(e) => update('batch', e.target.value)} placeholder="Name visitors will recognise" required /></EditorField><EditorField label="Class timing" hint="Example: Mon–Fri · 6:00–8:00 PM"><input className="field" value={form.time} onChange={(e) => update('time', e.target.value)} placeholder="Days and time" /></EditorField><div className="grid gap-4 sm:grid-cols-2"><EditorField label="Seats left" hint="Use 0 when full"><input className="field" type="number" min="0" value={form.seats} onChange={(e) => update('seats', Number(e.target.value))} /></EditorField><EditorField label="Starts on" hint="Choose the full start date. Expired batches are hidden from the public upcoming list."><input className="field" type="date" required value={isValidBatchStartDate(form.starts) ? form.starts : ''} onChange={(e) => update('starts', e.target.value)} /></EditorField>{form.starts && !isValidBatchStartDate(form.starts) && <p className="text-xs leading-relaxed text-amber-800">Saved start value “{form.starts}” has no full year. Choose its complete date before saving so it can expire automatically.</p>}</div><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} /> Show this batch on the public coaching page</label><div className="flex flex-wrap gap-2"><button disabled={busy} className="rounded-full bg-forest-900 px-5 py-3 text-sm font-bold text-white">Save batch</button>{form.id > 0 && <button type="button" disabled={busy} onClick={() => void remove()} className="rounded-full border border-red-200 px-5 py-3 text-sm font-bold text-red-700">Delete</button>}</div></div></form>
}

function ContentPanel({ type, items, selected, onSelect, onReload, onNotice }: { type: 'news' | 'stories'; items: AdminPost[] | AdminStory[]; selected: AdminPost | AdminStory | null; onSelect: (item: AdminPost | AdminStory | null) => void; onReload: () => Promise<void>; onNotice: (message: string) => void }) {
  const news = type === 'news'
  return <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]"><div><div className="mb-5 flex items-end justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-[0.18em] text-coral-600">{news ? 'News & updates' : 'Success stories'}</p><h2 className="mt-2 text-3xl font-extrabold">Edit without code</h2></div><button type="button" onClick={() => onSelect(news ? { id: 0, ...blankPost } : { id: 0, ...blankStory })} className="rounded-full bg-coral-500 px-4 py-2 text-sm font-bold text-white">+ New</button></div><div className="grid gap-3">{items.map((item) => <button type="button" key={item.id} onClick={() => onSelect(item)} className={`rounded-2xl bg-white p-4 text-left ring-1 ring-forest-900/10 transition hover:ring-forest-900 ${selected?.id === item.id ? 'ring-2 ring-coral-500' : ''}`}><div className="flex items-center justify-between gap-3"><strong>{news ? (item as AdminPost).title : (item as AdminStory).name}</strong><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${item.published ? 'bg-emerald-100 text-emerald-800' : 'bg-forest-100 text-forest-700'}`}>{item.published ? 'Published' : 'Draft'}</span></div><span className="mt-1 block text-xs text-forest-900/50">{news ? `${(item as AdminPost).category} · ${(item as AdminPost).date}` : `${(item as AdminStory).kind} · ${(item as AdminStory).country}`}</span></button>)}</div></div>{selected ? news ? <PostEditor key={`post-${selected.id}`} item={selected as AdminPost} onReload={onReload} onNotice={onNotice} onClose={() => onSelect(null)} /> : <StoryEditor key={`story-${selected.id}`} item={selected as AdminStory} onReload={onReload} onNotice={onNotice} onClose={() => onSelect(null)} /> : <div className="grid min-h-72 place-items-center rounded-3xl border border-dashed border-forest-900/20 p-8 text-center text-forest-900/50">Select an item or create a new one.</div>}</section>
}

function EditorField({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="grid gap-1"><span className="text-xs font-bold uppercase tracking-[0.1em] text-forest-900/70">{label}</span>{children}{hint && <small className="text-xs leading-relaxed text-forest-900/50">{hint}</small>}</label>
}

function PostEditor({ item, onReload, onNotice, onClose }: { item: AdminPost; onReload: () => Promise<void>; onNotice: (message: string) => void; onClose: () => void }) {
  const [form, setForm] = useState(item)
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState(false)
  function update<K extends keyof AdminPost>(key: K, value: AdminPost[K]) { setForm((current) => ({ ...current, [key]: value })) }
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); try { await savePost({ data: form }); await onReload(); onNotice('News article saved.'); onClose() } catch { onNotice('Could not save article. Check the fields.') } finally { setBusy(false) } }
  async function remove() { if (!form.id || !window.confirm('Delete this article?')) return; setBusy(true); try { await deletePost({ data: { id: form.id } }); await onReload(); onNotice('Article deleted.'); onClose() } catch { onNotice('Could not delete article.') } finally { setBusy(false) } }
  return (
    <form onSubmit={submit} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-forest-900/10">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral-600">News & updates</p><h3 className="text-xl font-extrabold">Article editor</h3><p className="mt-1 text-xs leading-relaxed text-forest-900/55">Fill the fields below. The title, summary and article paragraphs appear on the public News & Blog page.</p></div>
        <div className="flex shrink-0 items-center gap-2"><button type="button" aria-pressed={preview} onClick={() => setPreview((value) => !value)} className={'rounded-full px-4 py-2 text-xs font-bold ring-1 ring-forest-900/15 ' + (preview ? 'bg-coral-500 text-white ring-coral-500' : 'bg-white text-forest-900')}>{preview ? 'Back to edit' : 'Preview'}</button><button type="button" onClick={onClose} className="text-sm font-bold text-forest-900/50">Close</button></div>
      </div>
      {preview ? (
        <div className="rounded-2xl bg-forest-50 p-4 sm:p-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-coral-600">Public preview · unsaved changes</p>
          <article className="mt-3 max-w-3xl overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-forest-900/10">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-forest-900/55"><span className="rounded-full bg-forest-50 px-3 py-1 font-bold text-forest-700">{form.category}</span><span>{form.readMins} min read · {form.date || 'Date not set'}</span></div>
            <h4 className="mt-4 break-words font-display text-2xl font-extrabold text-forest-900">{form.title || 'Article headline'}</h4>
            <p className="mt-2 text-sm leading-relaxed text-forest-900/70">{form.excerpt || 'Your article summary will appear here.'}</p>
            <div className="mt-5 border-t border-forest-900/10 pt-4">{form.body.filter((paragraph) => paragraph.trim()).length ? form.body.filter((paragraph) => paragraph.trim()).map((paragraph, index) => <p key={index} className="mb-4 text-sm leading-relaxed text-forest-900/75 last:mb-0">{paragraph}</p>) : <p className="text-sm text-forest-900/50">Article paragraphs will appear here.</p>}</div>
          </article>
          <p className="mt-3 text-xs text-forest-900/55">Preview changes only; they reach the website after you return to edit and save.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <EditorField label="Headline / title" hint="Example: UK Graduate Route: the latest on post-study work duration"><input className="field" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Write the public article headline" required /></EditorField>
          <div className="grid gap-4 sm:grid-cols-2"><EditorField label="URL slug" hint="Lowercase words with hyphens only; example: uk-graduate-route-update"><input className="field" value={form.slug} onChange={(e) => update('slug', e.target.value)} placeholder="uk-graduate-route-update" required /></EditorField><EditorField label="Category" hint="Used to group the article"><select className="field" value={form.category} onChange={(e) => update('category', e.target.value as AdminPost['category'])}><option>Visa News</option><option>Study Abroad</option><option>IELTS & PTE</option><option>Immigration</option></select></EditorField></div>
          <div className="grid gap-4 sm:grid-cols-2"><EditorField label="Publish date" hint="Date shown on the article card"><input className="field" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} /></EditorField><EditorField label="Reading time (minutes)" hint="Example: 5"><input className="field" type="number" min="1" value={form.readMins} onChange={(e) => update('readMins', Number(e.target.value))} /></EditorField></div>
          <EditorField label="Short summary / excerpt" hint="One or two lines used on cards and SEO previews"><textarea className="field" rows={3} value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} placeholder="Summarise the main point for a visitor" /></EditorField>
          <EditorField label="Article content" hint="Write one paragraph per blank line. Do not add headings or HTML tags."><textarea className="field" rows={10} value={form.body.join('\n\n')} onChange={(e) => update('body', e.target.value.split(/\n\s*\n/))} placeholder="First paragraph...\n\nSecond paragraph..." /></EditorField>
        </div>
      )}
      <div className="mt-5 grid gap-4 border-t border-forest-900/10 pt-4">
        <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} /> Publish on website</label>
        <div className="flex flex-wrap gap-2"><button disabled={busy || preview} className="rounded-full bg-forest-900 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Saving…' : 'Save article'}</button>{form.id > 0 && <button type="button" disabled={busy} onClick={() => void remove()} className="rounded-full border border-red-200 px-5 py-3 text-sm font-bold text-red-700 disabled:opacity-50">Delete</button>}</div>
      </div>
    </form>
  )
}
function StoryEditor({ item, onReload, onNotice, onClose }: { item: AdminStory; onReload: () => Promise<void>; onNotice: (message: string) => void; onClose: () => void }) {
  const [form, setForm] = useState(item)
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState(false)
  function update<K extends keyof AdminStory>(key: K, value: AdminStory[K]) { setForm((current) => ({ ...current, [key]: value })) }
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); try { await saveStory({ data: form }); await onReload(); onNotice('Success story saved.'); onClose() } catch { onNotice('Could not save story. Check the fields.') } finally { setBusy(false) } }
  async function remove() { if (!form.id || !window.confirm('Delete this story?')) return; setBusy(true); try { await deleteStory({ data: { id: form.id } }); await onReload(); onNotice('Story deleted.'); onClose() } catch { onNotice('Could not delete story.') } finally { setBusy(false) } }
  return (
    <form onSubmit={submit} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-forest-900/10">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-coral-600">Success stories</p><h3 className="text-xl font-extrabold">Story editor</h3><p className="mt-1 text-xs leading-relaxed text-forest-900/55">Use this for a visa approval or a client testimonial. Published entries appear on the Success Stories page and home page.</p></div>
        <div className="flex shrink-0 items-center gap-2"><button type="button" aria-pressed={preview} onClick={() => setPreview((value) => !value)} className={'rounded-full px-4 py-2 text-xs font-bold ring-1 ring-forest-900/15 ' + (preview ? 'bg-coral-500 text-white ring-coral-500' : 'bg-white text-forest-900')}>{preview ? 'Back to edit' : 'Preview'}</button><button type="button" onClick={onClose} className="text-sm font-bold text-forest-900/50">Close</button></div>
      </div>
      {preview ? (
        <div className="rounded-2xl bg-forest-50 p-4 sm:p-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-coral-600">Public card preview · unsaved changes</p>
          <div className="mx-auto mt-3 max-w-md">{form.kind === 'approval' ? <ApprovalCard a={form} /> : <TestimonialCard t={form} />}</div>
          <p className="mt-3 text-xs text-forest-900/55">Preview changes only; they reach the website after you return to edit and save.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2"><EditorField label="Story type" hint="Choose approval for a result card or testimonial for a client quote"><select className="field" value={form.kind} onChange={(e) => update('kind', e.target.value as AdminStory['kind'])}><option value="testimonial">Client testimonial</option><option value="approval">Visa approval</option></select></EditorField><EditorField label="Person / family name" hint="Example: Harpreet Kaur or Pooja & Family"><input className="field" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Client name" required /></EditorField></div>
          <div className="grid gap-4 sm:grid-cols-2"><EditorField label="City" hint="Example: Sangaria"><input className="field" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Client city" /></EditorField><EditorField label="Destination country" hint="Example: Canada, United Kingdom or Australia"><input className="field" value={form.country} onChange={(e) => update('country', e.target.value)} placeholder="Country reached / applied to" /></EditorField></div>
          <div className="grid gap-4 sm:grid-cols-2"><EditorField label="Visa / course"><input className="field" value={form.visa} onChange={(e) => update('visa', e.target.value)} placeholder="Study Permit, Student Visa, IELTS…" /></EditorField><EditorField label="Flag code / emoji (optional)" hint="Optional; use CA, UK, AU or an emoji. The footer uses reliable code badges."><input className="field" value={form.flag} onChange={(e) => update('flag', e.target.value)} placeholder="CA or 🇨🇦" /></EditorField></div>
          <div className="grid gap-4 sm:grid-cols-2"><EditorField label="Initials" hint="Two letters shown on the story card; example: HK"><input className="field" value={form.initials} onChange={(e) => update('initials', e.target.value)} placeholder="HK" /></EditorField><EditorField label="Approval / story date"><input className="field" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} /></EditorField></div>
          <EditorField label="Rating (1 to 5 stars)"><input className="field" type="number" min="1" max="5" value={form.rating} onChange={(e) => update('rating', Number(e.target.value))} /></EditorField>
          <EditorField label="Client quote" hint="Write the exact short testimonial. For an approval, describe the result in one or two sentences."><textarea className="field" rows={6} value={form.quote} onChange={(e) => update('quote', e.target.value)} placeholder="My visa was approved..." /></EditorField>
          <EditorField label="Short result note" hint="Example: Sept intake · Conestoga or MSc Data Science"><input className="field" value={form.note} onChange={(e) => update('note', e.target.value)} placeholder="Extra result detail shown on the card" /></EditorField>
        </div>
      )}
      <div className="mt-5 grid gap-4 border-t border-forest-900/10 pt-4">
        <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} /> Publish on website</label>
        <div className="flex flex-wrap gap-2"><button disabled={busy || preview} className="rounded-full bg-forest-900 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Saving…' : 'Save story'}</button>{form.id > 0 && <button type="button" disabled={busy} onClick={() => void remove()} className="rounded-full border border-red-200 px-5 py-3 text-sm font-bold text-red-700 disabled:opacity-50">Delete</button>}</div>
      </div>
    </form>
  )
}
function CashflowAdminPanel({ onNotice }: { onNotice: (msg: string) => void }) {
  const [data, setData] = useState<CountryCashflow[]>(defaultCashflowData)
  const [selectedSlug, setSelectedSlug] = useState('canada')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void getAdminCashflow()
      .then((saved) => setData(saved))
      .catch(() => onNotice('Could not load cashflow from database. Showing defaults.'))
  }, [onNotice])

  const country = data.find((c) => c.slug === selectedSlug) || data[0]

  const updateCountryField = (field: keyof CountryCashflow, value: any) => {
    setData((prev) => prev.map((c) => c.slug === selectedSlug ? { ...c, [field]: value } : c))
  }

  const updateStageField = (stageNum: number, field: string, value: string) => {
    setData((prev) => prev.map((c) => {
      if (c.slug !== selectedSlug) return c
      return {
        ...c,
        stages: c.stages.map((st) => st.stageNumber === stageNum ? { ...st, [field]: value } : st),
      }
    }))
  }

  const save = async () => {
    try {
      setBusy(true)
      await saveCashflow({ data: { cashflowData: data } })
      onNotice('Budget & Cashflow saved to database and is live on the website.')
    } catch (error) {
      onNotice(error instanceof Error ? error.message : 'Could not save budget data.')
    } finally {
      setBusy(false)
    }
  }

  const resetToOfficial = async () => {
    setData(defaultCashflowData)
    try {
      setBusy(true)
      await saveCashflow({ data: { cashflowData: defaultCashflowData } })
      onNotice('Reset to official 2026/2027 embassy defaults and saved to database.')
    } catch {
      onNotice('Reset locally, but database sync failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-coral-600 font-bold">Financial Configuration</p>
          <h2 className="text-3xl font-extrabold mt-1">Country Budget & Cashflow Stages</h2>
          <p className="text-xs text-forest-900/60 mt-1">Edit embassy fees, GIC living costs, and stage-by-stage expenses. Updates reflect instantly on the public website.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" disabled={busy} onClick={resetToOfficial} className="rounded-xl border border-forest-900/20 px-4 py-2 text-xs font-bold text-forest-900 hover:bg-forest-50 disabled:opacity-50">Reset Defaults</button>
          <button type="button" disabled={busy} onClick={save} className="rounded-xl bg-forest-900 px-5 py-2 text-xs font-bold text-white hover:bg-forest-800 shadow-md disabled:opacity-50">{busy ? 'Saving to DB…' : 'Save Changes'}</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {data.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setSelectedSlug(c.slug)}
            className={'rounded-xl px-4 py-2 text-xs font-bold transition ' + (selectedSlug === c.slug ? 'bg-coral-500 text-white shadow-sm' : 'bg-white ring-1 ring-forest-900/10 text-forest-900 hover:bg-sand/30')}
          >
            {c.flag} {c.name}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-6 ring-1 ring-forest-900/10 shadow-sm space-y-5 mb-8">
        <h3 className="text-base font-extrabold text-forest-900 border-b border-forest-900/10 pb-3">{country.flag} {country.name} Overview Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-xs font-bold text-forest-900/80 mb-1">Total Estimated Outflow (INR)</span>
            <input className="w-full rounded-xl border border-forest-900/15 p-2.5 text-xs font-semibold" value={country.totalEstimateINR} onChange={(e) => updateCountryField('totalEstimateINR', e.target.value)} />
          </label>
          <label className="block">
            <span className="block text-xs font-bold text-forest-900/80 mb-1">Headline Badge</span>
            <input className="w-full rounded-xl border border-forest-900/15 p-2.5 text-xs font-semibold" value={country.headline} onChange={(e) => updateCountryField('headline', e.target.value)} />
          </label>
        </div>
        <label className="block">
          <span className="block text-xs font-bold text-forest-900/80 mb-1">Official Embassy Rule Note</span>
          <textarea rows={2} className="w-full rounded-xl border border-forest-900/15 p-2.5 text-xs" value={country.officialRuleNote} onChange={(e) => updateCountryField('officialRuleNote', e.target.value)} />
        </label>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="text-base font-extrabold text-forest-900">Stage-by-Stage Expense Details (4 Stages)</h3>
        {country.stages.map((st) => (
          <div key={st.stageNumber} className="rounded-2xl bg-white p-5 ring-1 ring-forest-900/10 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-forest-900/10">
              <span className="font-bold text-sm text-coral-600">Stage 0{st.stageNumber}: {st.title}</span>
              <span className="text-xs text-forest-900/60 font-mono">Stage ID: {st.stageNumber}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label>
                <span className="block text-[11px] font-bold text-forest-900/70 mb-1">Stage Title</span>
                <input className="w-full rounded-lg border border-forest-900/15 p-2 text-xs" value={st.title} onChange={(e) => updateStageField(st.stageNumber, 'title', e.target.value)} />
              </label>
              <label>
                <span className="block text-[11px] font-bold text-forest-900/70 mb-1">Timeline / When to Pay</span>
                <input className="w-full rounded-lg border border-forest-900/15 p-2 text-xs" value={st.timeline} onChange={(e) => updateStageField(st.stageNumber, 'timeline', e.target.value)} />
              </label>
              <label>
                <span className="block text-[11px] font-bold text-forest-900/70 mb-1">Approx INR Outflow</span>
                <input className="w-full rounded-lg border border-forest-900/15 p-2 text-xs font-bold" value={st.inrEstimate} onChange={(e) => updateStageField(st.stageNumber, 'inrEstimate', e.target.value)} />
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label>
                <span className="block text-[11px] font-bold text-forest-900/70 mb-1">Official Currency Cost</span>
                <input className="w-full rounded-lg border border-forest-900/15 p-2 text-xs" value={st.officialCost} onChange={(e) => updateStageField(st.stageNumber, 'officialCost', e.target.value)} />
              </label>
              <label>
                <span className="block text-[11px] font-bold text-forest-900/70 mb-1">Paid Directly To</span>
                <input className="w-full rounded-lg border border-forest-900/15 p-2 text-xs" value={st.paidTo} onChange={(e) => updateStageField(st.stageNumber, 'paidTo', e.target.value)} />
              </label>
            </div>
            <label className="block">
              <span className="block text-[11px] font-bold text-forest-900/70 mb-1">Description</span>
              <input className="w-full rounded-lg border border-forest-900/15 p-2 text-xs" value={st.description} onChange={(e) => updateStageField(st.stageNumber, 'description', e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-[11px] font-bold text-emerald-800 mb-1">Refund / Protection Guarantee</span>
              <input className="w-full rounded-lg border border-emerald-600/30 bg-emerald-50/40 p-2 text-xs text-emerald-900" value={st.refundableInfo} onChange={(e) => updateStageField(st.stageNumber, 'refundableInfo', e.target.value)} />
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" disabled={busy} onClick={save} className="rounded-2xl bg-forest-900 px-8 py-3 text-sm font-bold text-white hover:bg-forest-800 shadow-md disabled:opacity-50">
          {busy ? 'Saving…' : 'Save All Budget Changes'}
        </button>
      </div>
    </section>
  )
}

function SettingsPanel({ settings, onReload, onNotice }: { settings: AdminSnapshot['settings']; onReload: () => Promise<void>; onNotice: (message: string) => void }) {
  const [form, setForm] = useState(settings)
  const [busy, setBusy] = useState(false)
  async function save() { setBusy(true); try { await updateSettings({ data: form }); await onReload(); onNotice('Site settings saved.') } catch { onNotice('Could not save settings.') } finally { setBusy(false) } }
  return <section className="max-w-2xl"><p className="font-mono text-xs uppercase tracking-[0.18em] text-coral-600">Controls</p><h2 className="mt-2 text-3xl font-extrabold">Switch features on or off</h2><div className="mt-6 grid gap-4 rounded-3xl bg-white p-6 ring-1 ring-forest-900/10"><label className="flex items-center justify-between gap-4 border-b border-forest-900/10 pb-4"><span><strong className="block">Enquiry popup</strong><small className="text-forest-900/60">Show the enquiry form after visitors stay on the site.</small></span><input type="checkbox" checked={form.popupEnabled} onChange={(e) => setForm({ ...form, popupEnabled: e.target.checked })} /></label><label className="flex items-center justify-between gap-4 border-b border-forest-900/10 pb-4"><span><strong className="block">WhatsApp button</strong><small className="text-forest-900/60">Keep the floating WhatsApp contact action visible.</small></span><input type="checkbox" checked={form.whatsappEnabled} onChange={(e) => setForm({ ...form, whatsappEnabled: e.target.checked })} /></label><label className="flex items-center justify-between gap-4 border-b border-forest-900/10 pb-4"><span><strong className="block">Approvals marquee</strong><small className="text-forest-900/60">Show the moving recent-approval strip on the home page.</small></span><input type="checkbox" checked={form.approvalsMarqueeEnabled} onChange={(e) => setForm({ ...form, approvalsMarqueeEnabled: e.target.checked })} /></label><label><span className="mb-2 block font-bold">Popup delay (seconds)</span><input className="field max-w-40" type="number" min="3" max="60" value={form.popupDelaySeconds} onChange={(e) => setForm({ ...form, popupDelaySeconds: Number(e.target.value) })} /></label><button type="button" disabled={busy} onClick={() => void save()} className="w-fit rounded-full bg-forest-900 px-5 py-3 text-sm font-bold text-white">Save settings</button></div></section>
}

function UsersPanel({ users, currentEmail, onReload, onNotice }: { users: AdminUser[]; currentEmail: string; onReload: () => Promise<void>; onNotice: (message: string) => void }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<AdminRole>('content_editor')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [resetModalUser, setResetModalUser] = useState<AdminUser | null>(null)
  const [newStaffPassword, setNewStaffPassword] = useState('')

  async function save() {
    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()
    if (!cleanEmail || !cleanPassword) { onNotice('Email and initial password are required'); return }
    if (cleanPassword.length < 6) { onNotice('Password must be at least 6 characters'); return }
    setBusy(true)
    try {
      await saveAdminUser({ data: { email: cleanEmail, name: name.trim() || cleanEmail, role, password: cleanPassword } })
      setEmail('')
      setName('')
      setPassword('')
      await onReload()
      onNotice('New staff user created. They can sign in with this email and password.')
    } catch (cause) {
      onNotice(cause instanceof Error ? cause.message : 'Could not save user.')
    } finally {
      setBusy(false)
    }
  }

  async function handleResetStaffPassword(event: FormEvent) {
    event.preventDefault()
    const cleanPassword = newStaffPassword.trim()
    if (!resetModalUser || cleanPassword.length < 6) return
    setBusy(true)
    try {
      await saveAdminUser({ data: { email: resetModalUser.email, name: resetModalUser.name, role: resetModalUser.role, password: cleanPassword } })
      onNotice('Password for ' + resetModalUser.email + ' has been updated.')
      setResetModalUser(null)
      setNewStaffPassword('')
      await onReload()
    } catch (cause) {
      onNotice(cause instanceof Error ? cause.message : 'Could not update staff password.')
    } finally {
      setBusy(false)
    }
  }

  async function remove(openId: string) {
    if (!window.confirm('Remove this dashboard user? They will no longer be able to log in.')) return
    setBusy(true)
    try {
      await deleteAdminUser({ data: { openId } })
      await onReload()
      onNotice('Dashboard user removed.')
    } catch (cause) {
      onNotice(cause instanceof Error ? cause.message : 'Could not remove user.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-coral-600">Access control</p>
        <h2 className="mt-2 text-3xl font-extrabold">Add New Staff / User</h2>
        <p className="mt-2 text-sm leading-relaxed text-forest-900/65">Create an account for counsellors or editors. They sign in with this email and password, and only see the sections allowed by their role.</p>
        <div className="mt-6 grid gap-4 rounded-3xl bg-white p-6 ring-1 ring-forest-900/10">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-forest-900/70">Staff Email (Login ID) *</label>
            <input className="field" type="email" autoComplete="off" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="staff@example.com" required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-forest-900/70">Staff Full Name</label>
            <input className="field" type="text" autoComplete="off" value={name} onChange={(event) => setName(event.target.value)} placeholder="Staff member's name" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-forest-900/70">Initial Password (minimum 6 characters) *</label>
            <PasswordInput value={password} onChange={setPassword} required minLength={6} autoComplete="new-password" ariaLabel="Initial password for new staff user" className="field" placeholder="Set an initial password" toggleClassName="text-forest-900/50 hover:text-forest-900" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-forest-900/70">Role & Permissions</label>
            <select className="field" value={role} onChange={(event) => setRole(event.target.value as AdminRole)}>
              <option value="content_editor">Content Editor (News, Stories & Batches)</option>
              <option value="enquiry_manager">Enquiry Manager (Leads & Inquiries)</option>
              <option value="super_admin">Super Admin (Everything)</option>
            </select>
          </div>
          <div className="rounded-2xl bg-cream p-4 text-xs text-forest-900/70">
            <strong className="text-forest-900">{roleLabels[role]}</strong>
            <p className="mt-1">{role === 'super_admin' ? 'Full control over leads, content, settings and users.' : role === 'content_editor' ? 'Can manage News, coaching batches and Success Stories.' : 'Can manage enquiries and follow-ups.'}</p>
          </div>
          <button type="button" disabled={busy || !email.trim() || password.trim().length < 6} onClick={() => void save()} className="w-fit rounded-full bg-forest-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Create staff user'}</button>
        </div>
      </div>

      <div className="grid gap-3">
        {users.map((user) => (
          <article key={user.openId} className="flex flex-col justify-between gap-3 rounded-2xl bg-white p-5 ring-1 ring-forest-900/10 sm:flex-row sm:items-center">
            <div>
              <strong>{user.name || user.email}</strong>
              <p className="text-sm text-forest-900/60">{user.email}</p>
              <span className="mt-2 inline-flex rounded-full bg-coral-50 px-3 py-1 text-xs font-bold text-coral-700">{roleLabels[user.role]}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => { setResetModalUser(user); setNewStaffPassword('') }} className="rounded-full border border-forest-900/20 px-3.5 py-1.5 text-xs font-bold text-forest-900 hover:bg-forest-50">Reset password</button>
              <button type="button" disabled={busy || user.email.toLowerCase() === currentEmail.toLowerCase()} onClick={() => void remove(user.openId)} className="w-fit rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-700 disabled:cursor-not-allowed disabled:opacity-40">{user.email.toLowerCase() === currentEmail.toLowerCase() ? 'Current account' : 'Remove'}</button>
            </div>
          </article>
        ))}
        {users.length === 0 && <p className="rounded-2xl bg-white p-6 text-center text-sm text-forest-900/60">No provisioned users yet.</p>}
      </div>

      {resetModalUser && (
        <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setResetModalUser(null) }} className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="reset-staff-password-title" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-forest-900/10">
            <div className="flex items-center justify-between border-b border-forest-900/10 pb-3">
              <div>
                <h3 id="reset-staff-password-title" className="text-lg font-extrabold text-forest-900">Reset staff password</h3>
                <p className="mt-1 text-xs text-forest-900/60">{resetModalUser.email}</p>
              </div>
              <button type="button" onClick={() => setResetModalUser(null)} aria-label="Close password reset dialog" className="text-sm font-bold text-forest-900/40 hover:text-forest-900">✕</button>
            </div>
            <form onSubmit={handleResetStaffPassword} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-forest-900/70">New Password</label>
                <PasswordInput value={newStaffPassword} onChange={setNewStaffPassword} required minLength={6} autoComplete="new-password" ariaLabel="New password for staff user" className="field" placeholder="Enter new password" toggleClassName="text-forest-900/50 hover:text-forest-900" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setResetModalUser(null)} className="rounded-full border border-forest-900/15 px-5 py-2.5 text-xs font-bold text-forest-900">Cancel</button>
                <button type="submit" disabled={busy || newStaffPassword.trim().length < 6} className="rounded-full bg-forest-900 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Save Password'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  )
}
