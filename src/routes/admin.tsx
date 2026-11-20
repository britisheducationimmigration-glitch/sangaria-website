import { Logo } from '@/components/Logo'
import { getEnquiriesPage } from '@/lib/admin-functions'
import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import {
  BarChart3,
  BookOpen,
  CalendarCheck2,
  Coins,
  FileText,
  Globe,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Newspaper,
  Phone,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Trophy,
  UserCog,
  Users,
  X,
} from 'lucide-react'
import { getAdminCashflow, getAdminSnapshot, addEnquiryActivity, deleteAdminUser, deleteBatch, deleteEnquiry, deleteEnquiryActivity, deletePost, exportEnquiries, saveAdminUser, saveBatch, saveCashflow, savePost, updateEnquiry, updateEnquiryActivity, updateSettings, saveFaq, saveTrustStat, saveContactDetails } from '@/lib/admin-functions'
import { TailAdminDashboard } from '@/components/admin/TailAdminDashboard'
import type { AdminPost, AdminRole, AdminSnapshot, AdminStory, AdminUser, CoachingBatch, Enquiry, EnquiryStatus } from '@/lib/content-types'
import { defaultCashflowData, CountryCashflow } from '@/data/cashflow'
import { formatBatchStartDate, getBatchDateStatus, isValidBatchStartDate } from '@/lib/batch-dates'
import { applyScheduledCashflowPolicy, getPolicyWatchStatus, policyWatchItems } from '@/data/policy-watch'

const AttendancePanel = lazy(() => import('@/components/admin/AttendancePanel').then((m) => ({ default: m.AttendancePanel })))
const CertificatePanel = lazy(() => import('@/components/admin/CertificatePanel').then((m) => ({ default: m.CertificatePanel })))
const StoryEditor = lazy(() => import('@/components/admin/StoryEditor').then((m) => ({ default: m.StoryEditor })))
const PolicyWatchPanel = lazy(() => import('@/components/admin/PolicyWatchPanel').then((m) => ({ default: m.PolicyWatchPanel })))
const CountryPanel = lazy(() => import('@/components/admin/CountryPanel').then((m) => ({ default: m.CountryPanel })))
const StudyPlanPanel = lazy(() => import('@/components/admin/StudyPlanPanel').then((m) => ({ default: m.StudyPlanPanel })))

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [{ title: 'Admin · British Education and Immigration' }, { name: 'robots', content: 'noindex,nofollow,noarchive' }],
    links: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap' }],
  }),
  component: AdminPage,
})

type Tab = 'dashboard' | 'enquiries' | 'attendance' | 'news' | 'stories' | 'certificates' | 'batches' | 'budget' | 'settings' | 'users' | 'demo' | 'review' | 'reports' | 'policy' | 'countries' | 'studyPlans'

const roleLabels: Record<AdminRole, string> = { super_admin: 'Super Admin', content_editor: 'Content Editor', enquiry_manager: 'Enquiry Manager' }

const todayIstDate = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())
const makeBlankPost = (): Omit<AdminPost, 'id'> => ({ slug: '', title: '', category: 'Visa News', date: todayIstDate(), excerpt: '', readMins: 4, body: [], published: false })
const makeBlankStory = (): Omit<AdminStory, 'id'> => ({ kind: 'testimonial', name: '', city: '', country: '', visa: '', quote: '', rating: 5, initials: '', flag: '', date: todayIstDate(), note: '', mediaType: 'none', photoSrc: '', videoUrl: '', mediaAlt: '', mediaConsent: false, homepageFeatured: true, published: false })
function AdminPage() {
  const [snapshot, setSnapshot] = useState<AdminSnapshot | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | 'All'>('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedPost, setSelectedPost] = useState<AdminPost | null>(null)
  const [selectedStory, setSelectedStory] = useState<AdminStory | null>(null)
  const [selectedBatch, setSelectedBatch] = useState<CoachingBatch | null>(null)
  const [notice, setNotice] = useState('')
  const [showChangePass, setShowChangePass] = useState(false)
  const [batchDirty, setBatchDirty] = useState(false)
  const [cashflowDirty, setCashflowDirty] = useState(false)
  const [settingsDirty, setSettingsDirty] = useState(false)
  const [studyPlanDirty, setStudyPlanDirty] = useState(false)

  async function reload() {
    try {
      setError('')
      setSnapshot(await getAdminSnapshot())
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Admin access is not configured yet.')
    } finally {
      setCheckingSession(false)
    }
  }

  useEffect(() => { void reload() }, [])
  useEffect(() => {
    const role = snapshot?.user.role
    if (!role) return
    const allowed: Tab[] = role === 'super_admin'
      ? ['dashboard', 'enquiries', 'attendance', 'news', 'stories', 'certificates', 'batches', 'budget', 'settings', 'users', 'demo', 'review', 'reports', 'policy', 'countries', 'studyPlans']
      : role === 'content_editor'
        ? ['review', 'news', 'stories', 'certificates', 'batches']
        : ['dashboard', 'enquiries', 'demo', 'review', 'reports']
    let selected: Tab = role === 'content_editor' ? 'news' : 'dashboard'
    try {
      const saved = window.sessionStorage.getItem('bei-admin-tab:' + role) as Tab | null
      if (saved && allowed.includes(saved)) selected = saved
    } catch { /* Storage can be disabled; navigation still works. */ }
    setTab(selected)
  }, [snapshot?.user.role])

  useEffect(() => {
    if (!sidebarOpen) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setSidebarOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sidebarOpen])

  if (!snapshot && checkingSession) {
    return <section className="grid min-h-screen place-items-center bg-cream px-6 py-16"><p role="status" className="text-sm font-semibold">Checking admin session…</p></section>
  }

  if (!snapshot) {
    return (
      <section className="grid min-h-screen place-items-center bg-cream px-6 py-16">
        <div className="w-full max-w-md space-y-4">
          {error && error !== 'Unauthorized' && (
            <p role="alert" className="rounded-2xl bg-red-100 px-4 py-3 text-center text-xs font-bold text-red-900">
              {error}
            </p>
          )}
          <AdminAuthCard onLoginSuccess={reload} />
        </div>
      </section>
    )
  }

 
  const draftQueue = snapshot.posts.filter((item) => !item.published)
  const policyWatchCount = policyWatchItems.filter((item) => getPolicyWatchStatus(item) !== 'Effective').length

  type NavItem = { id: Tab; label: string; icon: typeof LayoutDashboard; count?: number; badge?: string }
  type NavGroup = { group: string; items: NavItem[] }

   const navGroups: NavGroup[] = snapshot.user.role === 'super_admin'
    ? [
        {
          group: 'CRM & LEADS',
          items: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'enquiries', label: 'Enquiries', icon: Inbox, count: snapshot.enquiryStats.total },
            { id: 'demo', label: 'Demo Requests', icon: GraduationCap, count: snapshot.enquiryStats.demoRequests },
            { id: 'review', label: 'Review Queue', icon: Sparkles, count: snapshot.enquiryStats.newCount + draftQueue.length },
            { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
          ],
        },
        {
          group: 'STAFF & OPERATIONS',
          items: [
            { id: 'attendance', label: 'Staff Attendance', icon: CalendarCheck2, badge: 'GPS / LIVE' },
          ],
        },
        {
          group: 'WEBSITE STUDIO',
          items: [
            { id: 'stories', label: 'Success Stories', icon: Trophy },
            { id: 'batches', label: 'Coaching Batches', icon: Users },
            { id: 'certificates', label: 'Certificates & Partners', icon: FileText },
            { id: 'news', label: 'News & Updates', icon: Newspaper },
            { id: 'countries', label: 'Country Guides', icon: Globe },
            { id: 'studyPlans', label: 'Study Plans', icon: BookOpen },
            { id: 'budget', label: 'Cashflow Budget', icon: Coins },
          ],
        },
        {
          group: 'SYSTEM & COMPLIANCE',
          items: [
            { id: 'policy', label: 'Policy Watch', icon: ShieldAlert, count: policyWatchCount },
            { id: 'settings', label: 'Site Settings', icon: Settings },
            { id: 'users', label: 'Users & Roles', icon: UserCog },
          ],
        },
      ]
    : snapshot.user.role === 'content_editor'
      ? [
          {
            group: 'WEBSITE STUDIO',
            items: [
              { id: 'review', label: 'Review Queue', icon: Sparkles, count: draftQueue.length },
              { id: 'stories', label: 'Success Stories', icon: Trophy },
              { id: 'batches', label: 'Coaching Batches', icon: Users },
              { id: 'certificates', label: 'Certificates & Partners', icon: FileText },
              { id: 'news', label: 'News & Updates', icon: Newspaper },
            ],
          },
        ]
      : [
          {
            group: 'CRM & LEADS',
            items: [
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'enquiries', label: 'Enquiries', icon: Inbox, count: snapshot.enquiryStats.total },
              { id: 'demo', label: 'Demo Requests', icon: GraduationCap, count: snapshot.enquiryStats.demoRequests },
              { id: 'review', label: 'Review Queue', icon: Sparkles, count: snapshot.enquiryStats.newCount },
              { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
            ],
          },
        ]

  function showNotice(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  function selectTab(value: Tab) {
    if ((batchDirty || cashflowDirty) && !window.confirm('You have unsaved changes. Leave this section and discard them?')) return
    setBatchDirty(false); setCashflowDirty(false)
    if (settingsDirty && value !== 'settings' && !window.confirm('You have unsaved changes in Site settings. Leave this section and discard them?')) return
    if (studyPlanDirty && value !== 'studyPlans' && !window.confirm('You have unsaved Study Plan changes. Leave this section and discard them?')) return
    if (value !== 'settings') setSettingsDirty(false)
    if (value !== 'studyPlans') setStudyPlanDirty(false)
    setTab(value)
    try { window.sessionStorage.setItem('bei-admin-tab:' + snapshot!.user.role, value) } catch { /* Optional browser state only. */ }
    setSidebarOpen(false)
  }

  return (
    <div className="tailadmin-shell flex min-h-screen bg-[#F9FAFB] text-[#1D2939]">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Left Sidebar (TailAdmin 290px) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[290px] flex-col border-r border-[#E4E7EC] bg-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#E4E7EC] px-6">
          <div className="flex items-center gap-3">
            <div><Logo /><p className="mt-1 text-[11px] font-medium text-[#667085]">Admin Workspace</p></div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 text-[#667085] hover:bg-[#F9FAFB] lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5" aria-label="Admin sidebar">
          {navGroups.map((grp) => (
            <div key={grp.group}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#98A2B3]">
                {grp.group}
              </p>
              <ul className="space-y-1">
                {grp.items.map((item) => {
                  const Icon = item.icon
                  const active = tab === item.id
                  return (
                      <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => selectTab(item.id)}
                        className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 active:scale-[0.99] ${
                          active
                            ? 'bg-[#ECF3FF] font-semibold text-[#465FFF] shadow-2xs'
                            : 'text-[#667085] hover:bg-[#F9FAFB] hover:text-[#1D2939]'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <Icon className={`size-[18px] shrink-0 ${active ? 'text-[#465FFF]' : 'text-[#667085]'}`} />
                          <span className="truncate">{item.label}</span>
                        </span>
                        {item.badge ? (
                          <span className="rounded-md bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                            {item.badge}
                          </span>
                        ) : item.count !== undefined ? (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-mono font-bold tabular-nums ${
                              active ? 'bg-white text-[#465FFF] shadow-2xs' : 'bg-[#F2F4F7] text-[#667085]'
                            }`}
                          >
                            {item.count}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-[#E4E7EC] p-4">
          <div className="rounded-xl bg-[#F9FAFB] p-3 text-xs">
            <p className="font-semibold text-[#1D2939]">{snapshot.user.name}</p>
            <p className="truncate text-[#667085]">{snapshot.user.email}</p>
            <p className="mt-1 font-semibold text-[#465FFF]">{roleLabels[snapshot.user.role]}</p>
          </div>
        </div>
      </aside>

      {/* Main Content Region */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-[290px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between gap-3 border-b border-[#E4E7EC] bg-white px-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#E4E7EC] text-[#1D2939] hover:bg-[#F9FAFB] lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            {snapshot.user.role !== 'content_editor' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  selectTab('enquiries')
                }}
                className="relative hidden max-w-sm flex-1 sm:block"
              >
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search leads by name, phone, country…"
                  className="h-10 w-full rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] pl-9 pr-3 text-sm text-[#1D2939] outline-none focus:border-[#465FFF] focus:bg-white"
                />
              </form>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setShowChangePass(true)}
              className="min-h-10 rounded-xl border border-[#E4E7EC] bg-white px-3 text-xs font-semibold text-[#1D2939] hover:bg-[#F9FAFB] sm:px-4"
            >
              Change password
            </button>
            <a
              href="/admin/oauth/logout"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-[#465FFF] px-3.5 text-xs font-semibold text-white shadow-xs hover:opacity-95 sm:px-4"
            >
              <LogOut className="size-3.5" />
              <span>Log out</span>
            </a>
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">
          {notice && (
            <p role="status" className="mb-5 rounded-xl border border-[#12B76A]/25 bg-[#ECFDF3] px-4 py-3 text-sm font-semibold text-[#12B76A]">
              {notice}
            </p>
          )}
                   <Suspense fallback={<p className="rounded-2xl border border-[#E4E7EC] bg-white p-6 text-sm text-[#667085]">Loading section…</p>}>
            {tab === 'dashboard' && snapshot.user.role !== 'content_editor' && (
              <TailAdminDashboard
                snapshot={snapshot}
                onOpenEnquiries={() => selectTab('enquiries')}
                onOpenAttendance={() => selectTab('attendance')}
                canOpenAttendance={snapshot.user.role === 'super_admin'}
              />
            )}
            {tab === 'enquiries' && <EnquiriesPanel stats={snapshot.enquiryStats} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} dateFrom={dateFrom} setDateFrom={setDateFrom} dateTo={dateTo} setDateTo={setDateTo} onReload={reload} onNotice={showNotice} canDelete={snapshot.user.role === 'super_admin'} canManageComments={snapshot.user.role === 'super_admin'} />}
            {tab === 'attendance' && snapshot.user.role === 'super_admin' && <AttendancePanel onNotice={showNotice} />}
            {tab === 'demo' && <DemoRequestsPanel totalCount={snapshot.enquiryStats.demoRequests} onReload={reload} onNotice={showNotice} canDelete={snapshot.user.role === 'super_admin'} canManageComments={snapshot.user.role === 'super_admin'} />}
            {tab === 'review' && <ReviewQueuePanel drafts={draftQueue} onOpenEnquiries={() => { setQuery(''); setStatusFilter('New'); selectTab('enquiries') }} onOpenDraft={(post) => { setSelectedPost(post); selectTab('news') }} />}
            {tab === 'reports' && <ReportsPanel stats={snapshot.enquiryStats} />}
            {tab === 'policy' && <PolicyWatchPanel />}
            {tab === 'countries' && <CountryPanel />}
            {tab === 'studyPlans' && <StudyPlanPanel onDirtyChange={setStudyPlanDirty} />}
            {tab === 'news' && <ContentPanel type="news" items={snapshot.posts} selected={selectedPost} onSelect={(item) => setSelectedPost(item as AdminPost | null)} onReload={reload} onNotice={showNotice} />}
            {tab === 'stories' && <ContentPanel type="stories" items={snapshot.stories} selected={selectedStory} onSelect={(item) => setSelectedStory(item as AdminStory | null)} onReload={reload} onNotice={showNotice} />}
            {tab === 'certificates' && <CertificatePanel items={snapshot.certificates} onReload={reload} onNotice={showNotice} />}
            {tab === 'batches' && <BatchPanel onDirtyChange={setBatchDirty} items={snapshot.batches} selected={selectedBatch} onSelect={setSelectedBatch} onReload={reload} onNotice={showNotice} />}
            {tab === 'budget' && <CashflowAdminPanel onDirtyChange={setCashflowDirty} onNotice={showNotice} />}
            {tab === 'settings' && <SettingsPanel settings={snapshot.settings} onReload={reload} onNotice={showNotice} onDirtyChange={setSettingsDirty} />}
            {tab === 'users' && <UsersPanel users={snapshot.users} currentEmail={snapshot.user.email} onReload={reload} onNotice={showNotice} />}
          </Suspense>
          {showChangePass && <ChangePasswordModal onClose={() => setShowChangePass(false)} onNotice={showNotice} />}
        </div>
      </div>
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
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
function formatIstDateTime(value: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function currentIstDateTimeMinute() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '00'
  const hour = get('hour') === '24' ? '00' : get('hour')
  return `${get('year')}-${get('month')}-${get('day')}T${hour}:${get('minute')}`
}
function formatFollowUpLabel(value: string) {
  if (!value) return ''
  const [datePart, timePart] = value.slice(0, 16).split('T')
  if (!datePart || !timePart) return new Date(value).toLocaleString('en-IN')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = timePart.split(':').map(Number)
  const dt = new Date(Date.UTC(year, (month || 1) - 1, day || 1, hour || 0, minute || 0))
  return dt.toLocaleString('en-IN', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function EnquiriesPanel({ stats, query, setQuery, statusFilter, setStatusFilter, dateFrom, setDateFrom, dateTo, setDateTo, onReload, onNotice, canDelete, canManageComments }: { stats: AdminSnapshot['enquiryStats']; query: string; setQuery: (value: string) => void; statusFilter: EnquiryStatus | 'All'; setStatusFilter: (value: EnquiryStatus | 'All') => void; dateFrom: string; setDateFrom: (value: string) => void; dateTo: string; setDateTo: (value: string) => void; onReload: () => Promise<void>; onNotice: (message: string) => void; canDelete: boolean; canManageComments: boolean }) {
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'board'>('table')
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null)
  const [dueTodayOnly, setDueTodayOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [pageResult, setPageResult] = useState<{ items: Enquiry[]; total: number; page: number }>({ items: [], total: 0, page: 1 })
  const [pageError, setPageError] = useState('')
  const [pageLoading, setPageLoading] = useState(true)
  const [revision, setRevision] = useState(0)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => { setPage(1) }, [query, statusFilter, dateFrom, dateTo, dueTodayOnly])
  useEffect(() => {
    let cancelled = false
    setPageLoading(true); setPageError('')
    const timer = window.setTimeout(() => {
      getEnquiriesPage({ data: { query, status: statusFilter === 'All' ? '' : statusFilter, from: dateFrom, to: dateTo, dueTodayOnly, page } })
        .then(result => { if (!cancelled) setPageResult(result) })
        .catch(cause => { if (!cancelled) setPageError(cause instanceof Error ? cause.message : 'Could not load leads') })
        .finally(() => { if (!cancelled) setPageLoading(false) })
    }, 200)
    return () => { cancelled = true; window.clearTimeout(timer) }
  }, [query, statusFilter, dateFrom, dateTo, dueTodayOnly, page, revision])

  const visibleEnquiries = pageLoading || pageError ? [] : pageResult.items
  const refreshPage = async () => { await onReload(); setRevision(n => n + 1) }

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
      onNotice('Filtered leads exported to Excel (up to 5,000 rows).')
    } catch { onNotice('Could not export leads to Excel.') }
  }

  async function handleQuickStatusChange(lead: Enquiry, newStatus: EnquiryStatus) {
    setUpdatingId(lead.id)
    try {
      await updateEnquiry({ data: { id: lead.id, status: newStatus, assignedTo: lead.assignedTo, nextFollowUpAt: lead.nextFollowUpAt } })
      await refreshPage()
      onNotice('Stage updated to ' + newStatus)
    } catch {
      onNotice('Could not update stage')
    } finally {
      setUpdatingId(null)
    }
  }

  const kpis = [
    { label: 'Total Enquiries', value: stats.total, badge: 'All Time', bg: 'bg-white', active: !dueTodayOnly && statusFilter === 'All' },
    { label: 'New Uncontacted', value: stats.newCount, badge: 'Requires Call', bg: 'bg-[#ECF3FF] text-[#465FFF]', active: statusFilter === 'New', onClick: () => setStatusFilter('New') },
    { label: 'Active Pipeline', value: stats.followUps, badge: 'In Progress', bg: 'bg-white text-forest-900', active: statusFilter === 'Follow-up', onClick: () => setStatusFilter('Follow-up') },
    { label: 'Due Today', value: stats.dueToday, badge: stats.dueToday > 0 ? 'Urgent Action' : 'Cleared', bg: stats.dueToday > 0 ? 'bg-amber-50 text-amber-900 ring-1 ring-amber-300' : 'bg-white', active: dueTodayOnly, onClick: () => setDueTodayOnly(!dueTodayOnly) },
    { label: 'Converted', value: stats.converted, badge: 'Visas / Admissions', bg: 'bg-emerald-50 text-emerald-900', active: statusFilter === 'Converted', onClick: () => setStatusFilter('Converted') },
  ]

  const boardStatuses: EnquiryStatus[] = ['New', 'Contacted', 'Follow-up', 'Documents Pending', 'Applied', 'Converted', 'Closed']
  const selectedLead = visibleEnquiries.find((item) => item.id === selectedLeadId)

  return (
    <section className="space-y-6">
      {/* Top Header & Export */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#465FFF]">CRM & Lead Pipeline</p>
          </div>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#1D2939]">Student Enquiries & Admissions</h2>
          <p className="mt-1 text-xs sm:text-sm text-[#667085]">Instant 1-click status updates, automated WhatsApp follow-ups, and student timelines.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => void downloadExcel()}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-[#E4E7EC] bg-white px-4 py-2 text-xs font-semibold text-[#344054] shadow-2xs hover:bg-[#F9FAFB] active:scale-[0.99]"
          >
            Download Excel
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <button
            key={kpi.label}
            type="button"
            onClick={kpi.onClick}
            className={'group relative rounded-2xl p-4 text-left border transition-all duration-150 ' + (kpi.active ? 'border-[#465FFF] bg-white ring-2 ring-[#465FFF]/20 shadow-xs' : 'border-[#E4E7EC] bg-white hover:border-[#D0D5DD] shadow-2xs')}
          >
            <p className="text-[11px] font-semibold text-[#667085] truncate">{kpi.label}</p>
            <p className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-[#1D2939]">{kpi.value}</p>
            <span className={'mt-2 inline-block rounded-md px-1.5 py-0.5 text-[10px] font-mono font-medium ' + (kpi.bg)}>
              {kpi.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Controls & Filter Bar */}
      <div className="rounded-2xl border border-[#E4E7EC] bg-white p-4 shadow-2xs space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search box with Icon */}
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, phone, city, program, country…"
              className="h-10 w-full rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] pl-10 pr-9 text-xs text-[#1D2939] placeholder-[#98A2B3] outline-none transition focus:border-[#465FFF] focus:bg-white focus:ring-2 focus:ring-[#465FFF]/15"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#98A2B3] hover:text-[#1D2939]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Date Range & View Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-[#667085]">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-10 rounded-xl border border-[#E4E7EC] bg-white px-2.5 text-xs text-[#1D2939] outline-none focus:border-[#465FFF]"
                aria-label="Filter from date"
              />
              <span>to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-10 rounded-xl border border-[#E4E7EC] bg-white px-2.5 text-xs text-[#1D2939] outline-none focus:border-[#465FFF]"
                aria-label="Filter to date"
              />
              {(dateFrom || dateTo) && (
                <button
                  type="button"
                  onClick={() => { setDateFrom(''); setDateTo('') }}
                  className="rounded-lg p-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                >
                  Clear dates
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div role="group" aria-label="Lead display mode" className="inline-flex rounded-xl bg-[#F2F4F7] p-1">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={'rounded-lg px-3 py-1.5 text-xs font-semibold transition ' + (viewMode === 'table' ? 'bg-white text-[#1D2939] shadow-2xs' : 'text-[#667085] hover:text-[#1D2939]')}
              >
                Table View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={'rounded-lg px-3 py-1.5 text-xs font-semibold transition ' + (viewMode === 'cards' ? 'bg-white text-[#1D2939] shadow-2xs' : 'text-[#667085] hover:text-[#1D2939]')}
              >
                Cards View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('board')}
                className={'rounded-lg px-3 py-1.5 text-xs font-semibold transition ' + (viewMode === 'board' ? 'bg-white text-[#1D2939] shadow-2xs' : 'text-[#667085] hover:text-[#1D2939]')}
              >
                Pipeline Board
              </button>
            </div>
          </div>
        </div>

        {/* 1-Tap Status Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-[#F2F4F7] pt-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3] mr-1">Status:</span>
          {(['All', 'New', 'Contacted', 'Follow-up', 'Documents Pending', 'Applied', 'Converted', 'Closed'] as const).map((st) => {
            const isActive = statusFilter === st
            const count = st === 'All' ? stats.total : (stats.byStatus[st] ?? 0)
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={'inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ' + (isActive ? 'bg-[#ECF3FF] font-semibold text-[#465FFF] ring-1 ring-[#465FFF]/30' : 'text-[#667085] hover:bg-[#F9FAFB] hover:text-[#1D2939]')}
              >
                <span>{st}</span>
                <span className={'font-mono text-[11px] tabular-nums ' + (isActive ? 'text-[#465FFF]' : 'text-[#98A2B3]')}>({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {pageError && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          {pageError}
        </p>
      )}

      {/* Pagination Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#667085]">
        <p>
          Showing <span className="font-semibold text-[#1D2939]">{visibleEnquiries.length}</span> of <span className="font-semibold text-[#1D2939]">{pageResult.total}</span> leads
          {dueTodayOnly && <span className="ml-1 text-amber-700 font-bold">(Due Today)</span>}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={pageLoading || pageResult.page <= 1}
            onClick={() => setPage(pageResult.page - 1)}
            className="rounded-lg border border-[#E4E7EC] bg-white px-3 py-1.5 font-semibold text-[#344054] shadow-2xs disabled:opacity-40 hover:bg-[#F9FAFB]"
          >
            Previous
          </button>
          <span className="font-mono">Page {pageResult.page} of {Math.max(1, Math.ceil(pageResult.total / 50))}</span>
          <button
            type="button"
            disabled={pageLoading || pageResult.page * 50 >= pageResult.total}
            onClick={() => setPage(pageResult.page + 1)}
            className="rounded-lg border border-[#E4E7EC] bg-white px-3 py-1.5 font-semibold text-[#344054] shadow-2xs disabled:opacity-40 hover:bg-[#F9FAFB]"
          >
            Next
          </button>
        </div>
      </div>

      {/* VIEW 1: DENSE SAAS TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E4E7EC] bg-[#F9FAFB] text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Direct Contact</th>
                  <th className="py-3 px-4">Interest & Country</th>
                  <th className="py-3 px-4">Stage / Pipeline</th>
                  <th className="py-3 px-4">Next Follow-Up</th>
                  <th className="py-3 px-4">Counsellor</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC]">
                {visibleEnquiries.map((item) => {
                  const raw = item.phone.replace(/\D/g, '').replace(/^0+/, '')
                  const wa = raw.length === 10 ? '91' + raw : raw
                  const isOverdue = item.nextFollowUpAt && item.nextFollowUpAt.slice(0, 16) < currentIstDateTimeMinute() && !['Converted', 'Closed'].includes(item.status)
                  const isDueToday = item.nextFollowUpAt && item.nextFollowUpAt.slice(0, 10) === todayIstDate()
                  const isBusy = updatingId === item.id

                  return (
                    <tr key={item.id} className="transition hover:bg-[#F9FAFB]/75">
                      {/* Student info */}
                      <td className="py-3.5 px-4 font-medium text-[#1D2939]">
                        <div className="flex items-center gap-2.5">
                          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-[#ECF3FF] font-mono text-[11px] font-bold text-[#465FFF]">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#1D2939] leading-tight">{item.name}</p>
                            <p className="mt-0.5 text-[11px] text-[#667085]">{item.city || 'Sangaria'} · {formatIstDateTime(item.createdAt)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact & 1-tap call/whatsapp */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-medium text-[#344054] tabular-nums">{item.phone}</span>
                          <a
                            href={'tel:' + item.phone}
                            aria-label={'Call ' + item.name}
                            className="grid size-7 place-items-center rounded-lg border border-[#E4E7EC] bg-white text-[#344054] shadow-2xs hover:bg-[#F2F4F7] active:scale-95"
                          >
                            <Phone className="size-3 text-[#344054]" />
                          </a>
                          <a
                            href={'https://wa.me/' + wa + '?text=' + encodeURIComponent('Hello ' + item.name + ', this is British Education & Immigration Sangaria following up on your ' + (item.interest || 'study visa') + (item.country ? ' (' + item.country + ')' : '') + ' enquiry. How can we assist you today?')}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={'WhatsApp ' + item.name}
                            className="grid size-7 place-items-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-2xs hover:bg-emerald-100 active:scale-95"
                          >
                            <MessageCircle className="size-3 text-emerald-600" />
                          </a>
                        </div>
                      </td>

                      {/* Interest & Country */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block rounded-md bg-[#F2F4F7] px-2 py-0.5 font-semibold text-[#344054]">
                          {item.interest || 'General Visa'}
                        </span>
                        {item.country && (
                          <span className="ml-1 text-[11px] text-[#667085]">
                            · {item.country}
                          </span>
                        )}
                      </td>

                      {/* 1-Click Inline Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          disabled={isBusy}
                          value={item.status}
                          onChange={(e) => void handleQuickStatusChange(item, e.target.value as EnquiryStatus)}
                          className={'h-7 rounded-lg border px-2 text-[11px] font-bold outline-none transition cursor-pointer ' + (
                            item.status === 'Converted' ? 'border-emerald-300 bg-emerald-50 text-emerald-800' :
                            item.status === 'New' ? 'border-blue-300 bg-blue-50 text-blue-800' :
                            item.status === 'Follow-up' ? 'border-amber-300 bg-amber-50 text-amber-900' :
                            item.status === 'Closed' ? 'border-gray-200 bg-gray-50 text-gray-600' :
                            'border-[#E4E7EC] bg-white text-[#344054]'
                          )}
                        >
                          {boardStatuses.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>

                      {/* Next Follow-up with urgency badge */}
                      <td className="py-3.5 px-4 font-mono text-[11px] tabular-nums">
                        {isOverdue ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 font-bold text-rose-700">
                            Overdue
                          </span>
                        ) : isDueToday ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 font-bold text-amber-800">
                            Due Today
                          </span>
                        ) : item.nextFollowUpAt ? (
                          <span className="text-[#667085]">
                            {formatFollowUpLabel(item.nextFollowUpAt)}
                          </span>
                        ) : (
                          <span className="text-[#98A2B3] italic">None set</span>
                        )}
                      </td>

                      {/* Counsellor */}
                      <td className="py-3.5 px-4 text-[11px]">
                        {item.assignedTo ? (
                          <span className="font-semibold text-[#344054]">{item.assignedTo}</span>
                        ) : (
                          <span className="text-[#98A2B3] italic">Unassigned</span>
                        )}
                      </td>

                      {/* Action: Open Timeline Drawer */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedLeadId(item.id)}
                          className="inline-flex items-center rounded-lg border border-[#E4E7EC] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#344054] shadow-2xs hover:bg-[#F2F4F7] active:scale-95"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {visibleEnquiries.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-sm font-semibold text-[#667085]">No enquiries match these search filters.</p>
              <button
                type="button"
                onClick={() => { setQuery(''); setStatusFilter('All'); setDateFrom(''); setDateTo('') }}
                className="mt-2 text-xs font-bold text-[#465FFF] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: DETAILED CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="grid gap-4">
          {visibleEnquiries.map((item) => (
            <EnquiryCard
              key={item.id}
              item={item}
              onReload={refreshPage}
              onNotice={onNotice}
              canDelete={canDelete}
              canManageComments={canManageComments}
            />
          ))}
          {visibleEnquiries.length === 0 && (
            <p className="rounded-2xl border border-[#E4E7EC] bg-white p-8 text-center text-sm text-[#667085]">
              No enquiries match these filters.
            </p>
          )}
        </div>
      )}

      {/* VIEW 3: PIPELINE BOARD VIEW */}
      {viewMode === 'board' && (
        <div className="space-y-5">
          <div className="overflow-x-auto pb-3">
            <div className="grid min-w-[1260px] grid-cols-7 gap-3">
              {boardStatuses.map((stage) => {
                const stageItems = visibleEnquiries.filter((item) => item.status === stage)
                return (
                  <section key={stage} className="min-h-72 rounded-2xl border border-[#E4E7EC] bg-[#F9FAFB] p-3">
                    <header className="mb-3 flex items-center justify-between gap-2 border-b border-[#E4E7EC] pb-2.5">
                      <h3 className="text-xs font-bold text-[#1D2939]">{stage}</h3>
                      <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[11px] font-bold text-[#667085] shadow-2xs">
                        {stageItems.length}
                      </span>
                    </header>
                    <div className="grid gap-2">
                      {stageItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedLeadId(item.id)}
                          className="rounded-xl border border-[#E4E7EC] bg-white p-3 text-left shadow-2xs transition hover:border-[#465FFF] hover:shadow-xs active:scale-[0.99]"
                        >
                          <span className="block truncate text-sm font-bold text-[#1D2939]">{item.name}</span>
                          <span className="mt-0.5 block truncate text-[11px] text-[#667085]">
                            {item.interest || 'General counselling'}{item.country ? ' · ' + item.country : ''}
                          </span>
                          <span className="mt-2 block truncate font-mono text-[10px] text-[#98A2B3]">{item.phone}</span>
                          {item.nextFollowUpAt && item.nextFollowUpAt.slice(0, 16) < currentIstDateTimeMinute() && !['Converted', 'Closed'].includes(item.status) && (
                            <span className="mt-1.5 inline-block rounded-md bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">
                              Overdue
                            </span>
                          )}
                        </button>
                      ))}
                      {stageItems.length === 0 && (
                        <p className="rounded-xl border border-dashed border-[#E4E7EC] py-6 text-center text-[10px] text-[#98A2B3]">
                          No leads
                        </p>
                      )}
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Slide-over / Modal Lead Details */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs" role="dialog" aria-modal="true">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-[#E4E7EC]">
            <div className="mb-4 flex items-center justify-between border-b border-[#E4E7EC] pb-3">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#465FFF]">Lead Details & Activity History</p>
                <h3 className="mt-0.5 text-xl font-extrabold text-[#1D2939]">{selectedLead.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeadId(null)}
                className="rounded-lg p-2 text-sm font-bold text-[#667085] hover:bg-[#F2F4F7]"
              >
                ✕ Close
              </button>
            </div>
            <EnquiryCard
              key={selectedLead.id}
              item={selectedLead}
              onReload={refreshPage}
              onNotice={onNotice}
              canDelete={canDelete}
              canManageComments={canManageComments}
            />
          </div>
        </div>
      )}
    </section>
  )
}

function DemoRequestsPanel({ totalCount, onReload, onNotice, canDelete, canManageComments }: { totalCount: number; onReload: () => Promise<void>; onNotice: (message: string) => void; canDelete: boolean; canManageComments: boolean }) {
  const [dueOnly, setDueOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<{ items: Enquiry[]; total: number; page: number }>({ items: [], total: 0, page: 1 })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    let cancelled = false
    setLoading(true); setError('')
    getEnquiriesPage({ data: { source: 'coaching', overdueOnly: dueOnly, page } })
      .then(value => { if (!cancelled) setResult(value) })
      .catch(cause => { if (!cancelled) setError(cause instanceof Error ? cause.message : 'Could not load demo requests') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [dueOnly, page, revision])
  const refreshPage = async () => { await onReload(); setRevision(n => n + 1) }
  const visible = loading || error ? [] : result.items
  return (
    <section>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="font-mono text-xs uppercase tracking-[0.18em] text-coral-600">IELTS & PTE</p><h2 className="mt-2 text-3xl font-extrabold">Free demo requests</h2><p className="mt-1 text-sm text-forest-900/60">Preferred dates are requests. Confirm the available slot with the student and schedule the next follow-up on the lead.</p></div>
        <button type="button" aria-pressed={dueOnly} onClick={() => { setDueOnly((value) => !value); setPage(1) }} className="w-fit rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900">{dueOnly ? 'Show all requests' : 'Follow-ups overdue'}</button>
      </div>
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-forest-900/10"><p className="text-xs font-bold uppercase tracking-wider text-forest-900/55">Total demo requests</p><p className="mt-2 text-3xl font-extrabold">{totalCount}</p></div>
        <div className="rounded-2xl bg-amber-100 p-4 text-amber-900"><p className="text-xs font-bold uppercase tracking-wider opacity-70">{dueOnly ? 'Overdue demo requests' : 'Showing'}</p><p className="mt-2 text-3xl font-extrabold">{result.total}</p></div>
      </div>
      {error && <p role="alert" className="mb-4 text-sm font-semibold text-red-700">{error}</p>}
      <div className="mb-4 flex items-center gap-3 text-xs font-semibold">
        <button type="button" disabled={loading || result.page <= 1} onClick={() => setPage(result.page - 1)} className="rounded-lg border border-[#E4E7EC] bg-white px-3 py-1.5 disabled:opacity-40">Previous</button>
        <span>{loading ? 'Loading...' : `Page ${result.page} of ${Math.max(1, Math.ceil(result.total / 50))}`}</span>
        <button type="button" disabled={loading || result.page * 50 >= result.total} onClick={() => setPage(result.page + 1)} className="rounded-lg border border-[#E4E7EC] bg-white px-3 py-1.5 disabled:opacity-40">Next</button>
      </div>
      <div className="grid gap-4">{visible.map((item) => <EnquiryCard key={item.id} item={item} onReload={refreshPage} onNotice={onNotice} canDelete={canDelete} canManageComments={canManageComments} />)}{!loading && visible.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-forest-900/60">{dueOnly ? 'No overdue demo follow-ups right now.' : 'No demo requests have been received yet.'}</p>}</div>
    </section>
  )
}

function ReviewQueuePanel({ drafts, onOpenEnquiries, onOpenDraft }: { drafts: AdminPost[]; onOpenEnquiries: () => void; onOpenDraft: (post: AdminPost) => void }) {
  const [queue, setQueue] = useState<'new' | 'overdue'>('new')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<{items: Enquiry[]; total: number; page: number}>({items: [], total: 0, page: 1})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let cancelled = false
    setLoading(true); setError('')
    getEnquiriesPage({data:{status:queue === 'new' ? 'New' : '', overdueOnly:queue === 'overdue', page}})
      .then(value => { if (!cancelled) setResult(value) })
      .catch(cause => { if (!cancelled) setError(cause instanceof Error ? cause.message : 'Could not load queue') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [queue, page])
  return (
    <section>
      <div className="mb-6"><p className="font-mono text-xs uppercase tracking-[0.18em] text-coral-600">Needs attention</p><h2 className="mt-2 text-3xl font-extrabold">Review queue</h2><p className="mt-1 text-sm text-forest-900/60">A read-only overview of new enquiries and unpublished content, with links to the existing editing screens.</p></div>
<div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold"><button type="button" onClick={() => { setQueue('new'); setPage(1) }} className={`rounded-full px-4 py-2 ${queue === 'new' ? 'bg-forest-900 text-white' : 'bg-white text-forest-900 ring-1 ring-forest-900/10'}`}>New leads</button><button type="button" onClick={() => { setQueue('overdue'); setPage(1) }} className={`rounded-full px-4 py-2 ${queue === 'overdue' ? 'bg-amber-600 text-white' : 'bg-white text-forest-900 ring-1 ring-forest-900/10'}`}>Overdue follow-ups</button><div className="ml-auto flex items-center gap-2"><button type="button" disabled={loading || result.page <= 1} onClick={() => setPage(result.page - 1)} className="rounded-lg border border-[#E4E7EC] bg-white px-3 py-1.5 disabled:opacity-40">Previous</button><span className="text-[#667085]">{loading ? 'Loading...' : `Page ${result.page} / ${Math.max(1, Math.ceil(result.total / 50))}`}</span><button type="button" disabled={loading || result.page * 50 >= result.total} onClick={() => setPage(result.page + 1)} className="rounded-lg border border-[#E4E7EC] bg-white px-3 py-1.5 disabled:opacity-40">Next</button></div></div>{error && <p role="alert" className="mb-3 text-sm font-semibold text-red-700">{error}</p>}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-5 ring-1 ring-forest-900/10">
          <div className="mb-4 flex items-center justify-between gap-3"><h3 className="text-lg font-extrabold">{queue === 'new' ? 'New enquiries' : 'Overdue follow-ups'}</h3><span className="rounded-full bg-coral-50 px-3 py-1 text-xs font-bold text-coral-700">{result.total}</span></div>
   <div className="grid gap-3">{(loading || error ? [] : result.items).map((item) => <div key={item.id} className="rounded-2xl bg-cream p-4"><p className="font-bold">{item.name}</p><p className="mt-1 text-sm text-forest-900/60">{item.interest || 'General counselling'}{item.country ? ' · ' + item.country : ''}</p><p className="mt-1 text-xs text-forest-900/50">{formatIstDateTime(item.createdAt)}</p></div>)}{!loading && !error && result.total === 0 && <p className="text-sm text-forest-900/55">No new enquiries are waiting.</p>}</div>
          {result.total > 0 && <button type="button" onClick={onOpenEnquiries} className="mt-4 rounded-full bg-forest-900 px-4 py-2 text-sm font-bold text-white">Review new enquiries</button>}
        </section>
        <section className="rounded-3xl bg-white p-5 ring-1 ring-forest-900/10">
          <div className="mb-4 flex items-center justify-between gap-3"><h3 className="text-lg font-extrabold">Unpublished content</h3><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">{drafts.length}</span></div>
          <div className="grid gap-3">{drafts.slice(0, 10).map((post) => <button key={post.id} type="button" onClick={() => onOpenDraft(post)} className="rounded-2xl bg-cream p-4 text-left transition hover:ring-1 hover:ring-coral-500"><span className="block font-bold">{post.title || 'Untitled draft'}</span><span className="mt-1 block text-xs text-forest-900/55">{post.category} · {post.date}</span></button>)}{drafts.length === 0 && <p className="text-sm text-forest-900/55">No unpublished articles are waiting.</p>}</div>
          {drafts.length > 10 && <p className="mt-3 text-xs text-forest-900/55">Showing the latest 10 drafts.</p>}
        </section>
      </div>
    </section>
  )
}

function ReportsPanel({ stats }: { stats: AdminSnapshot['enquiryStats'] }) {
  const conversion = stats.total ? Math.round((stats.converted / stats.total) * 100) : 0
  const statuses = Object.entries(stats.byStatus).sort((a, b) => b[1] - a[1])
  const sources = Object.entries(stats.bySource).sort((a, b) => b[1] - a[1])
  return (
    <section>
      <div className="mb-6"><p className="font-mono text-xs uppercase tracking-[0.18em] text-coral-600">Live lead summary</p><h2 className="mt-2 text-3xl font-extrabold">Reports</h2><p className="mt-1 text-sm text-forest-900/60">Counts are calculated from saved enquiries. Conversion is converted leads divided by all saved leads.</p></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[['New in last 7 days', stats.newLast7Days], ['Follow-ups due today', stats.dueToday], ['Demo requests', stats.demoRequests], ['Conversion rate', conversion + '%']].map(([label, value]) => <div key={String(label)} className="rounded-2xl bg-white p-5 ring-1 ring-forest-900/10"><p className="text-xs font-bold uppercase tracking-wider text-forest-900/55">{label}</p><p className="mt-2 text-3xl font-extrabold">{value}</p></div>)}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 ring-1 ring-forest-900/10"><h3 className="text-lg font-extrabold">By stage</h3><div className="mt-4 divide-y divide-forest-900/10">{statuses.map(([label, value]) => <div key={label} className="flex justify-between gap-3 py-3 text-sm"><span>{label}</span><strong>{value}</strong></div>)}{statuses.length === 0 && <p className="py-3 text-sm text-forest-900/55">No enquiry data yet.</p>}</div></div>
        <div className="rounded-3xl bg-white p-5 ring-1 ring-forest-900/10"><h3 className="text-lg font-extrabold">By source</h3><div className="mt-4 divide-y divide-forest-900/10">{sources.map(([label, value]) => <div key={label} className="flex justify-between gap-3 py-3 text-sm"><span>{label}</span><strong>{value}</strong></div>)}{sources.length === 0 && <p className="py-3 text-sm text-forest-900/55">No enquiry data yet.</p>}</div></div>
      </div>
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
  useEffect(() => {
    setStatus(item.status)
    setAssignedTo(item.assignedTo)
    setNextFollowUpAt(item.nextFollowUpAt ? item.nextFollowUpAt.slice(0, 16) : '')
  }, [item.id, item.status, item.assignedTo, item.nextFollowUpAt])

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

  // Quick 1-tap note adder
  async function addQuickPreset(presetText: string) {
    setBusy(true)
    try {
      await addEnquiryActivity({ data: { enquiryId: item.id, body: presetText } })
      await onReload()
      onNotice(`Note added: "${presetText}"`)
    } catch {
      onNotice('Could not add preset note.')
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

 const rawPhone = item.phone.replace(/\D/g, '').replace(/^0+/, '')
  const waPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone

  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-forest-900/10">
      <div className="flex flex-col justify-between gap-5 lg:flex-row">
        <div className="min-w-0 flex-1">
                   <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-extrabold text-forest-900">{item.name}</h3>
            <span className="rounded-full bg-coral-50 border border-coral-200/60 px-3 py-0.5 text-xs font-bold text-coral-700">{item.status}</span>
            {item.nextFollowUpAt && item.nextFollowUpAt.slice(0, 16) < currentIstDateTimeMinute() && !['Converted', 'Closed'].includes(item.status) && <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-xs font-bold text-rose-700 animate-pulse">Overdue</span>}
            {item.nextFollowUpAt && <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-800">Follow-up {formatFollowUpLabel(item.nextFollowUpAt)}</span>}
          </div>
          <p className="mt-1 text-xs text-forest-900/60">{formatIstDateTime(item.createdAt)} · Source: {item.source || 'website'}{item.assignedTo && <> · Assigned to: <b>{item.assignedTo}</b></>}</p>
          
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-bold tracking-tight text-forest-900">{item.phone}</span>
            {/* Quick 1-tap call & Smart Dynamic WhatsApp */}
            <a href={`tel:${item.phone}`} aria-label={`Call ${item.name}`} className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 border border-forest-900/15 px-3 py-1 text-xs font-bold text-forest-900 shadow-2xs transition hover:bg-forest-100 active:scale-95">
              <Phone className="size-3 text-forest-800" /> Call
            </a>
            <a href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`Hello ${item.name}, this is British Education & Immigration Sangaria following up on your ${item.interest || 'study visa'}${item.country ? ` (${item.country})` : ''} enquiry. How can we assist you today?`)}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${item.name}`} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-500/25 px-3 py-1 text-xs font-bold text-emerald-800 shadow-2xs transition hover:bg-emerald-100 active:scale-95">
              <MessageCircle className="size-3 text-emerald-600" /> WhatsApp Pitch
            </a>
            {item.email && <span className="text-xs text-forest-900/60 ml-1">· {item.email}</span>}
            {item.city && <span className="text-xs text-forest-900/60">· {item.city}</span>}
          </div>

          <p className="mt-2 text-sm font-semibold">{item.interest || 'General counselling'}{item.country && <> · {item.country}</>}</p>
          {item.message && <p className="mt-3 max-w-3xl text-sm leading-relaxed text-forest-900/75 bg-cream/70 p-3 rounded-xl border border-forest-900/5">{item.message}</p>}
          {item.summary && <p className="mt-2 text-xs text-forest-900/50">Context: {item.summary}</p>}
        </div>

        <div className="grid content-start gap-2 lg:w-80">
          <select value={status} onChange={(event) => setStatus(event.target.value as EnquiryStatus)} className="field bg-cream">
            <option>New</option><option>Contacted</option><option>Follow-up</option><option>Documents Pending</option><option>Applied</option><option>Converted</option><option>Closed</option>
          </select>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <input value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)} className="field bg-cream" placeholder="Assigned counsellor" />
            <input type="datetime-local" value={nextFollowUpAt} onChange={(event) => setNextFollowUpAt(event.target.value)} className="field bg-cream" aria-label="Next follow-up" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => void save()} className="rounded-full bg-forest-900 px-4 py-2 text-sm font-bold text-white shadow-xs disabled:opacity-50 hover:bg-forest-800">Save lead</button>
            {canDelete && <button type="button" disabled={busy} onClick={() => void remove()} className="rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-50">Delete</button>}
          </div>
        </div>
      </div>

      <section className="mt-6 border-t border-forest-900/10 pt-5" aria-labelledby={`lead-timeline-${item.id}`}>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-coral-600">Lead history</p>
            <h4 id={`lead-timeline-${item.id}`} className="mt-1 text-base font-extrabold">Follow-up timeline</h4>
          </div>
          <span className="text-xs text-forest-900/50">{item.activities.length} entries</span>
        </div>

        {/* 1-TAP QUICK PRESET NOTES */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-forest-900/50 mr-1">Quick Note:</span>
          {[
            'Called - No response',
            'Called - Discussed options',
            'Requested 12th / Degree marksheet',
            'Interested in Jan 2027 intake',
            'Sent fee structure on WhatsApp',
          ].map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={busy}
              onClick={() => void addQuickPreset(preset)}
              className="rounded-lg bg-forest-50 border border-forest-900/15 px-2.5 py-1 text-[11px] font-semibold text-forest-900 hover:bg-forest-100 disabled:opacity-50"
            >
              + {preset}
            </button>
          ))}
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
                    {activity.editedBy && <span className="font-normal text-forest-900/55"> · Edited by {activity.editedBy} on {formatActivityTime(activity.updatedAt)}</span>}
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
            <li className="rounded-xl border border-dashed border-forest-900/15 px-4 py-5 text-center text-sm text-forest-900/55">No timeline entries yet. Add a note or tap a preset above after calling the student.</li>
          )}
        </ol>

        <form onSubmit={addComment} className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
          <textarea value={newComment} onChange={(event) => setNewComment(event.target.value)} rows={2} maxLength={5000} className="field bg-cream" placeholder="Log a custom call, message, document update or next step…" aria-label="Add lead timeline comment" />
          <button type="submit" disabled={busy || !newComment.trim()} className="min-h-11 rounded-full bg-coral-500 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? 'Saving…' : 'Add comment'}</button>
        </form>
      </section>
    </article>
  )
}

function BatchPanel({ items, selected, onSelect, onReload, onNotice, onDirtyChange }: { onDirtyChange: (dirty: boolean) => void; items: CoachingBatch[]; selected: CoachingBatch | null; onSelect: (item: CoachingBatch | null) => void; onReload: () => Promise<void>; onNotice: (message: string) => void }) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [filterProgram, setFilterProgram] = useState<string>('All')
  useEffect(() => { onDirtyChange(hasUnsavedChanges) }, [hasUnsavedChanges, onDirtyChange])

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

  const programs = ['All', 'IELTS', 'PTE', 'German', 'French', 'Spoken English']
  const filtered = filterProgram === 'All' ? items : items.filter((b) => b.program.toLowerCase() === filterProgram.toLowerCase())

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#465FFF]">Coaching Academy</p>
          </div>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#1D2939]">Live Coaching Batches</h2>
          <p className="mt-1 text-xs sm:text-sm text-[#667085]">Add, schedule, or update IELTS, PTE & language batches with instant live website card preview.</p>
        </div>
        <button
          type="button"
          onClick={() => selectBatch({ id: 0, program: 'IELTS', batch: '', time: '', seats: 15, starts: '', published: true })}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#465FFF] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:opacity-95 active:scale-[0.99]"
        >
          + New Coaching Batch
        </button>
      </div>

      {/* Program Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E4E7EC] pb-3">
        {programs.map((prog) => {
          const count = prog === 'All' ? items.length : items.filter((b) => b.program.toLowerCase() === prog.toLowerCase()).length
          return (
            <button
              key={prog}
              type="button"
              onClick={() => setFilterProgram(prog)}
              className={'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition ' + (filterProgram === prog ? 'bg-[#465FFF] text-white shadow-xs' : 'bg-white text-[#667085] hover:bg-[#F2F4F7] border border-[#E4E7EC]')}
            >
              <span>{prog}</span>
              <span className={'rounded-full px-1.5 py-0.2 text-[10px] font-mono ' + (filterProgram === prog ? 'bg-white/20 text-white' : 'bg-[#F2F4F7] text-[#667085]')}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,1.1fr)]">
        {/* Batches List */}
        <div className="space-y-3">
          {filtered.map((item) => {
            const dateStatus = getBatchDateStatus(item.starts)
            const isSelected = selected?.id === item.id
            const isFull = item.seats === 0
            const isFastFilling = item.seats > 0 && item.seats <= 5

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => selectBatch(item)}
                className={'w-full rounded-2xl p-4 text-left border transition-all duration-150 ' + (
                  isSelected
                    ? 'border-[#465FFF] bg-white ring-2 ring-[#465FFF]/20 shadow-xs'
                    : 'border-[#E4E7EC] bg-white hover:border-[#D0D5DD] shadow-2xs'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-forest-50 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wide text-forest-700">
                        {item.program}
                      </span>
                      <strong className="text-sm font-bold text-[#1D2939]">{item.batch}</strong>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#667085]">
                      <span>🕒 {item.time || 'Time not set'}</span>
                      <span>·</span>
                      <span>📅 Starts {formatBatchStartDate(item.starts)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ' + (
                      isFull ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      isFastFilling ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    )}>
                      {isFull ? 'Batch Full' : isFastFilling ? `${item.seats} Seats Left` : `${item.seats} Seats`}
                    </span>
                    <span className={'rounded-md px-1.5 py-0.5 font-mono text-[9px] uppercase ' + (
                      dateStatus === 'expired' ? 'bg-red-50 text-red-600' :
                      dateStatus === 'needs-date' ? 'bg-amber-50 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    )}>
                      {dateStatus === 'expired' ? 'Expired' : dateStatus === 'needs-date' ? 'Date Pending' : 'Upcoming'}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#E4E7EC] bg-white p-8 text-center text-xs text-[#667085]">
              No batches found for program "{filterProgram}".
            </div>
          )}
        </div>

        {/* Live Interactive Batch Editor */}
        <div>
          {selected ? (
            <BatchEditor
              key={`batch-${selected.id}`}
              item={selected}
              onReload={onReload}
              onNotice={onNotice}
              onClose={closeBatch}
              onDirtyChange={setHasUnsavedChanges}
            />
          ) : (
            <div className="grid min-h-[360px] place-items-center rounded-3xl border border-dashed border-[#E4E7EC] bg-white p-8 text-center text-[#667085]">
              <div>
                <p className="text-sm font-bold text-[#1D2939]">No Batch Selected</p>
                <p className="mt-1 text-xs text-[#667085]">Click any batch from the list or click "+ New Coaching Batch" to edit.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function BatchEditor({ item, onReload, onNotice, onClose, onDirtyChange }: { item: CoachingBatch; onReload: () => Promise<void>; onNotice: (message: string) => void; onClose: (saved?: boolean) => void; onDirtyChange: (dirty: boolean) => void }) {
  const [form, setForm] = useState(item)
  const [busy, setBusy] = useState(false)
  function update<K extends keyof CoachingBatch>(key: K, value: CoachingBatch[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    onDirtyChange(true)
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    try {
      await saveBatch({ data: form })
      onDirtyChange(false)
      await onReload()
      onNotice('Coaching batch saved and live on website.')
      onClose(true)
    } catch (cause) {
      onNotice(cause instanceof Error ? cause.message : 'Could not save batch.')
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!form.id || !window.confirm('Delete this coaching batch permanently?')) return
    setBusy(true)
    try {
      await deleteBatch({ data: { id: form.id } })
      onDirtyChange(false)
      await onReload()
      onNotice('Coaching batch deleted.')
      onClose(true)
    } catch {
      onNotice('Could not delete batch.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-[#E4E7EC] bg-white p-6 shadow-xs space-y-5">
      <div className="flex items-start justify-between gap-4 border-b border-[#E4E7EC] pb-4">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#465FFF]">Live Batch Studio</span>
          <h3 className="mt-0.5 text-lg font-extrabold text-[#1D2939]">
            {form.id ? 'Edit Coaching Batch' : 'Create New Coaching Batch'}
          </h3>
          <p className="mt-1 text-xs text-[#667085]">Changes instantly update the public Upcoming Batches timetable.</p>
        </div>
        <button type="button" onClick={() => onClose()} className="rounded-lg p-1.5 text-xs font-bold text-[#667085] hover:bg-[#F2F4F7]">
          ✕ Close
        </button>
      </div>

      {/* Live Preview Card */}
      <div className="rounded-2xl border border-[#D0E1FD] bg-[#F4F8FF] p-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#465FFF] mb-2">Live Public Website Card Preview</p>
        <div className="rounded-xl border border-[#E4E7EC] bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-forest-50 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wide text-forest-700">
              {form.program || 'IELTS'}
            </span>
            <span className="font-mono text-xs font-bold text-[#465FFF]">
              {form.seats ? form.seats + ' Seats Left' : 'Batch Full'}
            </span>
          </div>
          <p className="mt-2 text-base font-extrabold text-[#1D2939]">{form.batch || 'Batch Name Preview'}</p>
          <div className="mt-1 flex items-center gap-3 text-xs text-[#667085]">
            <span>🕒 {form.time || 'Schedule'}</span>
            <span>📅 Starts {formatBatchStartDate(form.starts)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <EditorField label="Program / Language" hint="e.g. IELTS, PTE, German, French">
            <input className="field" value={form.program} onChange={(e) => update('program', e.target.value)} placeholder="IELTS / PTE / German…" required />
          </EditorField>
          <EditorField label="Batch Name" hint="e.g. Super Intensive Morning Batch">
            <input className="field" value={form.batch} onChange={(e) => update('batch', e.target.value)} placeholder="Batch display title" required />
          </EditorField>
        </div>

        <EditorField label="Class Timing" hint="e.g. Mon–Fri · 7:30 AM – 9:30 AM">
          <input className="field" value={form.time} onChange={(e) => update('time', e.target.value)} placeholder="Days and time slot" />
        </EditorField>

        <div className="grid gap-4 sm:grid-cols-2">
          <EditorField label="Seats Available" hint="Use 0 when fully booked">
            <input className="field font-mono font-bold" type="number" min="0" value={form.seats} onChange={(e) => update('seats', Number(e.target.value))} />
          </EditorField>
          <EditorField label="Start Date" hint="Full year date (auto-expires when passed)">
            <input className="field font-mono" type="date" required value={isValidBatchStartDate(form.starts) ? form.starts : ''} onChange={(e) => update('starts', e.target.value)} />
          </EditorField>
        </div>

        <label className="flex items-center gap-2.5 rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-3 text-xs font-bold text-[#1D2939] cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} className="size-4 rounded text-[#465FFF]" />
          <span>Show this batch publicly on IELTS & PTE coaching pages</span>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E7EC] pt-4">
        {form.id > 0 ? (
          <button type="button" disabled={busy} onClick={() => void remove()} className="rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-50">
            Delete Batch
          </button>
        ) : <div />}
        <button type="submit" disabled={busy} className="rounded-xl bg-[#465FFF] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:opacity-95 disabled:opacity-50">
          {busy ? 'Saving…' : 'Save & Publish Batch'}
        </button>
      </div>
    </form>
  )
}

function ContentPanel({ type, items, selected, onSelect, onReload, onNotice }: { type: 'news' | 'stories'; items: AdminPost[] | AdminStory[]; selected: AdminPost | AdminStory | null; onSelect: (item: AdminPost | AdminStory | null) => void; onReload: () => Promise<void>; onNotice: (message: string) => void }) {
  const news = type === 'news'
  const [filter, setFilter] = useState<'All' | 'Published' | 'Draft'>('All')
  const [search, setSearch] = useState('')

  const filtered = items.filter((item) => {
    const matchesFilter = filter === 'All' ? true : filter === 'Published' ? item.published : !item.published
    const title = news ? (item as AdminPost).title : (item as AdminStory).name
    const matchesSearch = !search || title.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#465FFF]">{news ? 'Website Blog' : 'Student Showcase'}</p>
          </div>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#1D2939]">{news ? 'News, Articles & Visa Updates' : 'Success Stories & Visa Approvals'}</h2>
          <p className="mt-1 text-xs sm:text-sm text-[#667085]">{news ? 'Publish student visa news with auto-reading time and SEO links.' : 'Showcase student approvals and testimonial quotes with instant card preview.'}</p>
        </div>
        <button
          type="button"
          onClick={() => onSelect(news ? { id: 0, ...makeBlankPost() } : { id: 0, ...makeBlankStory() })}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#465FFF] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:opacity-95 active:scale-[0.99]"
        >
          + Create {news ? 'Article' : 'Story'}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E4E7EC] bg-white p-3 shadow-2xs">
        <div className="flex items-center gap-1.5">
          {(['All', 'Published', 'Draft'] as const).map((st) => {
            const count = st === 'All' ? items.length : st === 'Published' ? items.filter(i => i.published).length : items.filter(i => !i.published).length
            return (
              <button
                key={st}
                type="button"
                onClick={() => setFilter(st)}
                className={'inline-flex items-center gap-1 rounded-xl px-3 py-1 text-xs font-medium transition ' + (filter === st ? 'bg-[#ECF3FF] font-semibold text-[#465FFF] ring-1 ring-[#465FFF]/30' : 'text-[#667085] hover:bg-[#F9FAFB] hover:text-[#1D2939]')}
              >
                <span>{st}</span>
                <span className={'font-mono text-[11px] tabular-nums ' + (filter === st ? 'text-[#465FFF]' : 'text-[#98A2B3]')}>({count})</span>
              </button>
            )
          })}
        </div>
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={'Search ' + (news ? 'articles…' : 'stories…')}
            className="h-8 w-56 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] px-2.5 text-xs text-[#1D2939] placeholder-[#98A2B3] outline-none focus:border-[#465FFF] focus:bg-white"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,1.2fr)]">
        {/* Items List */}
        <div className="space-y-3">
          {filtered.map((item) => {
            const isSelected = selected?.id === item.id
            const title = news ? (item as AdminPost).title || 'Untitled Article' : (item as AdminStory).name || 'Unnamed Client'
            const subtitle = news ? ((item as AdminPost).category + ' · ' + (item as AdminPost).date) : ((item as AdminStory).kind + ' · ' + (item as AdminStory).country)

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => onSelect(item)}
                className={'w-full rounded-2xl p-4 text-left border transition-all duration-150 ' + (
                  isSelected
                    ? 'border-[#465FFF] bg-white ring-2 ring-[#465FFF]/20 shadow-xs'
                    : 'border-[#E4E7EC] bg-white hover:border-[#D0D5DD] shadow-2xs'
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-sm font-bold text-[#1D2939] truncate">{title}</strong>
                  <span className={'rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 ' + (item.published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600')}>
                    {item.published ? 'Live' : 'Draft'}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-[#667085]">
                  <span>{subtitle}</span>
                  {news && <span className="font-mono text-[11px]">{(item as AdminPost).readMins} min read</span>}
                </div>
              </button>
            )
          })}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#E4E7EC] bg-white p-8 text-center text-xs text-[#667085]">
              No {news ? 'articles' : 'stories'} match your filter.
            </div>
          )}
        </div>

        {/* Live Interactive Editor */}
        <div>
          {selected ? (
            news ? (
              <PostEditor
                key={'post-' + selected.id}
                item={selected as AdminPost}
                onReload={onReload}
                onNotice={onNotice}
                onClose={() => onSelect(null)}
              />
            ) : (
              <StoryEditor
                key={'story-' + selected.id}
                item={selected as AdminStory}
                onReload={onReload}
                onNotice={onNotice}
                onClose={() => onSelect(null)}
              />
            )
          ) : (
            <div className="grid min-h-[360px] place-items-center rounded-3xl border border-dashed border-[#E4E7EC] bg-white p-8 text-center text-[#667085]">
              <div>
                <p className="text-sm font-bold text-[#1D2939]">No Item Selected</p>
                <p className="mt-1 text-xs text-[#667085]">Select an item from the left to edit or click "+ Create".</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function EditorField({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
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

function PostEditor({ item, onReload, onNotice, onClose }: { item: AdminPost; onReload: () => Promise<void>; onNotice: (message: string) => void; onClose: () => void }) {
  const [form, setForm] = useState(item)
  const [busy, setBusy] = useState(false)
  const [slugCustomized, setSlugCustomized] = useState(Boolean(item.slug))

  function update<K extends keyof AdminPost>(key: K, value: AdminPost[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleTitleChange(newTitle: string) {
    if (!slugCustomized) {
      const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setForm((current) => ({ ...current, title: newTitle, slug: autoSlug }))
    } else {
      update('title', newTitle)
    }
  }

  function handleBodyChange(text: string) {
    const paragraphs = text.split(/\n\s*\n/)
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const estMins = Math.max(1, Math.ceil(words / 180))
    setForm((current) => ({ ...current, body: paragraphs, readMins: estMins }))
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    try {
      await savePost({ data: form })
      await onReload()
      onNotice('Article saved and live on website.')
      onClose()
    } catch {
      onNotice('Could not save article. Check required fields.')
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!form.id || !window.confirm('Delete this article permanently?')) return
    setBusy(true)
    try {
      await deletePost({ data: { id: form.id } })
      await onReload()
      onNotice('Article deleted.')
      onClose()
    } catch {
      onNotice('Could not delete article.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-[#E4E7EC] bg-white p-6 shadow-xs space-y-6">
      <div className="flex items-start justify-between gap-4 border-b border-[#E4E7EC] pb-4">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#465FFF]">Article Studio</span>
          <h3 className="mt-0.5 text-xl font-extrabold text-[#1D2939]">
            {form.id ? 'Edit Article' : 'Write New Article'}
          </h3>
          <p className="mt-1 text-xs text-[#667085]">Auto-slug, auto-reading time estimation, and live public preview.</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-xs font-bold text-[#667085] hover:bg-[#F2F4F7]">
          ✕ Close
        </button>
      </div>

      {/* Side-by-Side Live Preview Card */}
      <div className="rounded-2xl border border-[#D0E1FD] bg-[#F4F8FF] p-4">
        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#465FFF] mb-2">Live Public Blog Card Preview</p>
        <article className="overflow-hidden rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#667085]">
            <span className="rounded-md bg-forest-50 px-2.5 py-0.5 font-bold text-forest-700">
              {form.category}
            </span>
            <span>{form.readMins} min read · {form.date || todayIstDate()}</span>
          </div>
          <h4 className="mt-3 break-words text-lg font-extrabold text-[#1D2939]">
            {form.title || 'Your Article Headline Will Appear Here'}
          </h4>
          <p className="mt-1.5 text-xs leading-relaxed text-[#667085]">
            {form.excerpt || 'Write a short excerpt below to see it rendered live here...'}
          </p>
        </article>
      </div>

      <div className="grid gap-4">
        <EditorField label="Headline / Title *" hint="Catchy, informative title">
          <input className="field" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. UK Graduate Route 2026: Official Embassy Guidelines" required />
        </EditorField>

        <div className="grid gap-4 sm:grid-cols-2">
          <EditorField label="URL Slug (Auto-generated)" hint="SEO-friendly link address">
            <input
              className="field font-mono text-xs"
              value={form.slug}
              onChange={(e) => { setSlugCustomized(true); update('slug', e.target.value) }}
              placeholder="uk-graduate-route-update"
              required
            />
          </EditorField>
          <EditorField label="Category" hint="Section grouping">
            <select className="field font-semibold" value={form.category} onChange={(e) => update('category', e.target.value as AdminPost['category'])}>
              <option>Visa News</option>
              <option>Study Abroad</option>
              <option>IELTS & PTE</option>
              <option>Immigration</option>
            </select>
          </EditorField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <EditorField label="Publish Date" hint="Date shown on public card">
            <input className="field font-mono" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
          </EditorField>
          <EditorField label="Reading Time" hint="Auto-calculated from word count">
            <div className="flex items-center gap-2">
              <input className="field font-mono font-bold max-w-28 text-center" type="number" min="1" value={form.readMins} onChange={(e) => update('readMins', Number(e.target.value))} />
              <span className="text-xs font-semibold text-[#667085]">Minutes Read</span>
            </div>
          </EditorField>
        </div>

        <EditorField label="Short Excerpt (SEO Summary)" hint="1-2 lines shown on Google and social previews">
          <textarea className="field" rows={3} value={form.excerpt} onChange={(e) => update('excerpt', e.target.value)} placeholder="Summarise the key takeaway for students..." />
        </EditorField>

        <EditorField label="Article Body Paragraphs" hint="Write one paragraph per blank line (Shift+Enter or double Enter)">
          <textarea className="field font-mono text-xs leading-relaxed" rows={10} value={form.body.join('\n\n')} onChange={(e) => handleBodyChange(e.target.value)} placeholder="First paragraph...\n\nSecond paragraph..." />
        </EditorField>

        <label className="flex items-center gap-2.5 rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-3 text-xs font-bold text-[#1D2939] cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} className="size-4 rounded text-[#465FFF]" />
          <span>Publish immediately on public News & Blog page</span>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E7EC] pt-4">
        {form.id > 0 ? (
          <button type="button" disabled={busy} onClick={() => void remove()} className="rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-50">
            Delete Article
          </button>
        ) : <div />}
        <button type="submit" disabled={busy} className="rounded-xl bg-[#465FFF] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:opacity-95 disabled:opacity-50">
          {busy ? 'Saving…' : 'Save & Publish Article'}
        </button>
      </div>
    </form>
  )
}

function CashflowAdminPanel({ onNotice, onDirtyChange }: { onDirtyChange: (dirty: boolean) => void; onNotice: (msg: string) => void }) {
  const [data, setData] = useState<CountryCashflow[]>(() => defaultCashflowData.map((country) => applyScheduledCashflowPolicy(country)))
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(data))
  const dirty = JSON.stringify(data) !== savedJson
  useEffect(() => { onDirtyChange(dirty) }, [dirty, onDirtyChange])
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  const [selectedSlug, setSelectedSlug] = useState('canada')
  const [busy, setBusy] = useState(false)

  const onNoticeRef = useRef(onNotice)
  onNoticeRef.current = onNotice

  useEffect(() => {
    void getAdminCashflow()
      .then((saved) => { setData(saved); setSavedJson(JSON.stringify(saved)) })
      .catch(() => onNoticeRef.current('Could not load cashflow from database. Showing defaults.'))
  }, [])

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
      setSavedJson(JSON.stringify(data))
      onNotice('Budget & Cashflow saved to database and is live on the website.')
    } catch (error) {
      onNotice(error instanceof Error ? error.message : 'Could not save budget data.')
    } finally {
      setBusy(false)
    }
  }

  const resetToOfficial = async () => {
    const currentDefaults = defaultCashflowData.map((country) => applyScheduledCashflowPolicy(country))
    setData(currentDefaults)
    try {
      setBusy(true)
      await saveCashflow({ data: { cashflowData: currentDefaults } })
      setSavedJson(JSON.stringify(currentDefaults))
      onNotice('Reset to official 2026/2027 embassy defaults and saved to database.')
    } catch {
      onNotice('Reset locally, but database sync failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
       <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#465FFF]">Financial Configuration</p>
          </div>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#1D2939]">Country Budget &amp; Cashflow Stages</h2>
          <p className="mt-1 text-xs sm:text-sm text-[#667085]">Edit embassy fees, GIC living costs, and stage-by-stage expenses. Updates reflect instantly on public calculators.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {dirty && (
            <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 font-mono text-xs font-semibold text-amber-800 animate-pulse">
              ● Unsaved Changes
            </span>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={resetToOfficial}
            className="rounded-xl border border-[#E4E7EC] bg-white px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-[#F9FAFB] disabled:opacity-50"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={save}
            className="rounded-xl bg-[#465FFF] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:opacity-95 disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Country Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E4E7EC] pb-3">
        {data.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setSelectedSlug(c.slug)}
            className={'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition ' + (
              selectedSlug === c.slug
                ? 'bg-[#465FFF] text-white shadow-xs'
                : 'border border-[#E4E7EC] bg-white text-[#667085] hover:bg-[#F9FAFB]'
            )}
          >
            <span>{c.flag}</span>
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* Country Overview Card */}
      <div className="rounded-3xl border border-[#E4E7EC] bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-3">
          <h3 className="text-base font-extrabold text-[#1D2939]">{country.flag} {country.name} Overview Settings</h3>
          <span className="font-mono text-xs font-bold text-[#465FFF] bg-[#ECF3FF] px-2.5 py-1 rounded-lg">
            {country.headline || 'Active Policy'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-[#1D2939]">Total Estimated Outflow (INR)</span>
            <input
              className="field font-mono font-bold"
              value={country.totalEstimateINR}
              onChange={(e) => updateCountryField('totalEstimateINR', e.target.value)}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-[#1D2939]">Headline Badge</span>
            <input
              className="field"
              value={country.headline}
              onChange={(e) => updateCountryField('headline', e.target.value)}
            />
          </label>
        </div>
        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-[#1D2939]">Official Embassy Rule Note</span>
          <textarea
            rows={2}
            className="field text-xs"
            value={country.officialRuleNote}
            onChange={(e) => updateCountryField('officialRuleNote', e.target.value)}
          />
        </label>
      </div>

      {/* Stage-by-Stage Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#1D2939]">Stage-by-Stage Expense Details (4 Stages)</h3>
          <span className="text-xs text-[#667085]">Sequential Student Journey</span>
        </div>
        {country.stages.map((st) => (
          <div key={st.stageNumber} className="rounded-2xl border border-[#E4E7EC] bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E7EC]">
              <span className="font-bold text-sm text-[#465FFF]">Stage 0{st.stageNumber}: {st.title}</span>
              <span className="text-xs text-[#667085] font-mono">Stage ID: {st.stageNumber}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="block space-y-1">
                <span className="text-[11px] font-bold text-[#667085]">Stage Title</span>
                <input className="field text-xs" value={st.title} onChange={(e) => updateStageField(st.stageNumber, 'title', e.target.value)} />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-bold text-[#667085]">Timeline / When to Pay</span>
                <input className="field text-xs" value={st.timeline} onChange={(e) => updateStageField(st.stageNumber, 'timeline', e.target.value)} />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-bold text-[#667085]">Approx INR Outflow</span>
                <input className="field font-mono text-xs font-bold" value={st.inrEstimate} onChange={(e) => updateStageField(st.stageNumber, 'inrEstimate', e.target.value)} />
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block space-y-1">
                <span className="text-[11px] font-bold text-[#667085]">Official Currency Cost</span>
                <input className="field text-xs font-mono" value={st.officialCost} onChange={(e) => updateStageField(st.stageNumber, 'officialCost', e.target.value)} />
              </label>
              <label className="block space-y-1">
                <span className="text-[11px] font-bold text-[#667085]">Paid Directly To</span>
                <input className="field text-xs" value={st.paidTo} onChange={(e) => updateStageField(st.stageNumber, 'paidTo', e.target.value)} />
              </label>
            </div>
            <label className="block space-y-1">
              <span className="text-[11px] font-bold text-[#667085]">Description</span>
              <input className="field text-xs" value={st.description} onChange={(e) => updateStageField(st.stageNumber, 'description', e.target.value)} />
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] font-bold text-emerald-800">Refund / Protection Guarantee</span>
              <input className="field text-xs border-emerald-200 bg-emerald-50/50 text-emerald-900" value={st.refundableInfo} onChange={(e) => updateStageField(st.stageNumber, 'refundableInfo', e.target.value)} />
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 border-t border-[#E4E7EC] pt-4">
        <button
          type="button"
          disabled={busy}
          onClick={save}
          className="rounded-xl bg-[#465FFF] px-8 py-2.5 text-xs font-bold text-white shadow-xs hover:opacity-95 disabled:opacity-50"
        >
          {busy ? 'Saving…' : 'Save All Budget Changes'}
        </button>
      </div>
    </section>
  )
}

function SettingsPanel({ settings, onReload, onNotice, onDirtyChange }: { settings: AdminSnapshot['settings']; onReload: () => Promise<void>; onNotice: (message: string) => void; onDirtyChange: (dirty: boolean) => void }) {
  const [form, setForm] = useState(settings)
  const [busy, setBusy] = useState(false)
  const [faqBusy, setFaqBusy] = useState(false)
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null)
  const [faqDraft, setFaqDraft] = useState({ q: '', a: '' })
  const [editingStatIndex, setEditingStatIndex] = useState<number | null>(null)
  const [statDraft, setStatDraft] = useState({ value: '', label: '' })
  const [statBusy, setStatBusy] = useState(false)
  const [isEditingContactDetails, setIsEditingContactDetails] = useState(false)
  const [contactDraft, setContactDraft] = useState({ phones: [...settings.phones], emails: [...settings.emails], officeHours: settings.officeHours })
  const [contactBusy, setContactBusy] = useState(false)
  const isDirty = JSON.stringify(form) !== JSON.stringify(settings)
  const faqOriginal = editingFaqIndex === null ? null : form.faqs[editingFaqIndex] ?? { q: '', a: '' }
  const faqDraftDirty = editingFaqIndex !== null && JSON.stringify(faqDraft) !== JSON.stringify(faqOriginal)
  const statOriginal = editingStatIndex === null ? null : form.trustStats[editingStatIndex] ?? { value: '', label: '' }
  const statDraftDirty = editingStatIndex !== null && JSON.stringify(statDraft) !== JSON.stringify(statOriginal)
  const contactOriginal = { phones: form.phones, emails: form.emails, officeHours: form.officeHours }
  const contactDraftDirty = isEditingContactDetails && JSON.stringify(contactDraft) !== JSON.stringify(contactOriginal)
  const hasUnsavedChanges = isDirty || faqDraftDirty || statDraftDirty || contactDraftDirty

  useEffect(() => { onDirtyChange(hasUnsavedChanges) }, [hasUnsavedChanges, onDirtyChange])
  useEffect(() => {
    if (!hasUnsavedChanges) return
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warnBeforeLeaving)
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving)
  }, [hasUnsavedChanges])

  function beginTrustStatEdit(index: number) {
    setStatDraft({ ...form.trustStats[index] })
    setEditingStatIndex(index)
  }
  function beginNewTrustStat() {
    setStatDraft({ value: '', label: '' })
    setEditingStatIndex(form.trustStats.length)
  }
  function cancelTrustStatEdit() {
    if (statDraftDirty && !window.confirm('Discard your unsaved homepage trust number changes?')) return
    setStatDraft({ value: '', label: '' })
    setEditingStatIndex(null)
  }
  async function saveTrustStatDraft() {
    if (editingStatIndex === null) return
    const trustStat = { value: statDraft.value.trim(), label: statDraft.label.trim() }
    if (!trustStat.value || !trustStat.label) { onNotice('Enter both a trust number and its label before saving.'); return }
    setStatBusy(true)
    try {
      const result = await saveTrustStat({ data: { action: 'save', index: editingStatIndex, trustStat } })
      setForm((current) => ({ ...current, trustStats: result.trustStats }))
      setStatDraft({ value: '', label: '' })
      setEditingStatIndex(null)
      await onReload()
      onNotice('Homepage trust number saved.')
    } catch (cause) {
      onNotice(cause instanceof Error ? cause.message : 'Could not save this trust number.')
    } finally {
      setStatBusy(false)
    }
  }
  async function removeTrustStat(index: number) {
    if (!window.confirm('Remove this trust number from the homepage?')) return
    setStatBusy(true)
    try {
      const result = await saveTrustStat({ data: { action: 'remove', index } })
      setForm((current) => ({ ...current, trustStats: result.trustStats }))
      await onReload()
      onNotice('Homepage trust number removed.')
    } catch (cause) {
      onNotice(cause instanceof Error ? cause.message : 'Could not remove this trust number.')
    } finally {
      setStatBusy(false)
    }
  }
  function beginContactEdit() {
    setContactDraft({ phones: [...form.phones], emails: [...form.emails], officeHours: form.officeHours })
    setIsEditingContactDetails(true)
  }
  function cancelContactEdit() {
    if (contactDraftDirty && !window.confirm('Discard your unsaved contact detail changes?')) return
    setIsEditingContactDetails(false)
  }
  async function saveContactEdit() {
    setContactBusy(true)
    try {
      const result = await saveContactDetails({ data: contactDraft })
      setForm((current) => ({ ...current, ...result }))
      setContactDraft({ phones: result.phones, emails: result.emails, officeHours: result.officeHours })
      setIsEditingContactDetails(false)
      await onReload()
      onNotice('Contact details updated on the public site.')
    } catch (cause) {
      onNotice(cause instanceof Error ? cause.message : 'Could not save contact details.')
    } finally {
      setContactBusy(false)
    }
  }
  function beginFaqEdit(index: number) {
    setFaqDraft({ ...form.faqs[index] })
    setEditingFaqIndex(index)
  }
  function beginNewFaq() {
    setFaqDraft({ q: '', a: '' })
    setEditingFaqIndex(form.faqs.length)
  }
  function cancelFaqEdit() {
    setFaqDraft({ q: '', a: '' })
    setEditingFaqIndex(null)
  }
  async function saveFaqDraft() {
    if (editingFaqIndex === null) return
    const faq = { q: faqDraft.q.trim(), a: faqDraft.a.trim() }
    if (!faq.q || !faq.a) { onNotice('Enter both a question and an answer, or cancel this FAQ draft.'); return }
    setFaqBusy(true)
    try {
      const result = await saveFaq({ data: { action: 'save', index: editingFaqIndex, faq } })
      setForm((current) => ({ ...current, faqs: result.faqs }))
      cancelFaqEdit()
      await onReload()
      onNotice('FAQ saved and published.')
    } catch (cause) {
      onNotice(cause instanceof Error ? cause.message : 'Could not save this FAQ.')
    } finally {
      setFaqBusy(false)
    }
  }
  async function removeFaq(index: number) {
    if (!window.confirm('Remove this FAQ from the homepage? This takes effect after you confirm.')) return
    setFaqBusy(true)
    try {
      const result = await saveFaq({ data: { action: 'remove', index } })
      setForm((current) => ({ ...current, faqs: result.faqs }))
      await onReload()
      onNotice('FAQ removed from the homepage.')
    } catch (cause) {
      onNotice(cause instanceof Error ? cause.message : 'Could not remove this FAQ.')
    } finally {
      setFaqBusy(false)
    }
  }
  async function save() {
    if (editingFaqIndex !== null || editingStatIndex !== null || isEditingContactDetails) { onNotice('Save or cancel the open settings editor before saving the other site settings.'); return }
    if (form.trustStats.some((item) => !item.value.trim() || !item.label.trim())) { onNotice('Complete or remove each homepage trust number before saving.'); return }
    setBusy(true)
    try {
      await updateSettings({ data: form })
      await onReload()
      onDirtyChange(false)
      onNotice('Site settings saved.')
    } catch (cause) {
      onNotice(cause instanceof Error ? cause.message : 'Could not save settings.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-coral-600">Controls</p>
      <h2 className="mt-2 text-3xl font-extrabold">Website settings</h2>
      <p className="mt-2 text-sm text-forest-900/60">These values update the public pages only after you choose a save action. Existing popup and WhatsApp controls remain here too.</p>
      {hasUnsavedChanges && <p role="status" className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">You have unsaved changes. Save the FAQ draft or site settings before leaving; otherwise you’ll be asked to discard them.</p>}
      <div className="mt-6 grid gap-5 rounded-3xl bg-white p-6 ring-1 ring-forest-900/10">
        <section className="grid gap-4 border-b border-forest-900/10 pb-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold">Contact details</h3>
              <p className="mt-1 text-xs text-forest-900/55">Choose Edit, make your changes, then save them to update the public site.</p>
            </div>
            {!isEditingContactDetails && <button type="button" disabled={contactBusy || editingFaqIndex !== null || editingStatIndex !== null} onClick={beginContactEdit} className="min-h-11 rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">Edit contact details</button>}
          </div>
          {isEditingContactDetails ? (
            <>
              <label><span className="mb-2 block text-sm font-bold">Phone numbers (one per line)</span><textarea className="field min-h-20" value={contactDraft.phones.join('\n')} onChange={(event) => setContactDraft((current) => ({ ...current, phones: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean) }))} /></label>
              <label><span className="mb-2 block text-sm font-bold">Email addresses (one per line)</span><textarea className="field min-h-20" value={contactDraft.emails.join('\n')} onChange={(event) => setContactDraft((current) => ({ ...current, emails: event.target.value.split('\n').map((item) => item.trim()).filter(Boolean) }))} /></label>
              <label><span className="mb-2 block text-sm font-bold">Office hours</span><input className="field" maxLength={120} value={contactDraft.officeHours} onChange={(event) => setContactDraft((current) => ({ ...current, officeHours: event.target.value }))} placeholder="Mon – Sat · 9:30 AM – 7:30 PM" /></label>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={contactBusy} onClick={() => void saveContactEdit()} className="min-h-11 rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{contactBusy ? 'Saving…' : 'Save contact details'}</button>
                <button type="button" disabled={contactBusy} onClick={cancelContactEdit} className="min-h-11 rounded-full border border-forest-900/15 px-4 py-2 text-xs font-bold disabled:opacity-50">Cancel</button>
              </div>
            </>
          ) : (
            <dl className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-cream p-4"><dt className="text-xs font-bold uppercase tracking-wide text-forest-900/55">Phone numbers</dt><dd className="mt-1 break-words text-sm font-semibold">{form.phones.join(' · ')}</dd></div>
              <div className="rounded-2xl bg-cream p-4"><dt className="text-xs font-bold uppercase tracking-wide text-forest-900/55">Email addresses</dt><dd className="mt-1 break-words text-sm font-semibold">{form.emails.join(' · ')}</dd></div>
              <div className="rounded-2xl bg-cream p-4"><dt className="text-xs font-bold uppercase tracking-wide text-forest-900/55">Office hours</dt><dd className="mt-1 break-words text-sm font-semibold">{form.officeHours}</dd></div>
            </dl>
          )}
        </section>

        <section className="grid gap-3 border-b border-forest-900/10 pb-5">
          <div>
            <h3 className="text-lg font-extrabold">Homepage trust numbers</h3>
            <p className="text-xs text-forest-900/55">Edit or add a number, then choose Save trust number. Removing a number asks you to confirm first.</p>
          </div>
          {form.trustStats.map((item, index) => {
            const editing = editingStatIndex === index
            return (
              <div key={index} className="grid gap-3 rounded-2xl bg-cream p-4">
                {editing ? (
                  <>
                    <label><span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-forest-900/60">Trust number</span><input className="field" maxLength={40} aria-label={"Homepage trust number " + (index + 1)} value={statDraft.value} onChange={(event) => setStatDraft((current) => ({ ...current, value: event.target.value }))} placeholder="2,500+" /></label>
                    <label><span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-forest-900/60">Label</span><input className="field" maxLength={80} aria-label={"Homepage trust number label " + (index + 1)} value={statDraft.label} onChange={(event) => setStatDraft((current) => ({ ...current, label: event.target.value }))} placeholder="Visas approved" /></label>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" disabled={statBusy || !statDraft.value.trim() || !statDraft.label.trim()} onClick={() => void saveTrustStatDraft()} className="min-h-11 rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{statBusy ? 'Saving…' : 'Save trust number'}</button>
                      <button type="button" disabled={statBusy} onClick={cancelTrustStatEdit} className="min-h-11 rounded-full border border-forest-900/15 px-4 py-2 text-xs font-bold disabled:opacity-50">Cancel</button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div><p className="text-lg font-extrabold text-forest-900">{item.value}</p><p className="text-sm text-forest-900/65">{item.label}</p></div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" disabled={statBusy || editingStatIndex !== null || editingFaqIndex !== null || isEditingContactDetails} onClick={() => beginTrustStatEdit(index)} aria-label={"Edit homepage trust number " + (index + 1)} className="min-h-11 rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">Edit</button>
                      <button type="button" disabled={form.trustStats.length <= 1 || statBusy || editingStatIndex !== null || editingFaqIndex !== null || isEditingContactDetails} onClick={() => void removeTrustStat(index)} className="min-h-11 rounded-full border border-forest-900/15 px-4 py-2 text-xs font-bold disabled:opacity-40">Remove</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          {editingStatIndex === form.trustStats.length && (
            <div className="grid gap-3 rounded-2xl border border-coral-300 bg-coral-50/40 p-4">
              <p className="text-sm font-bold text-forest-900">New trust number draft — it appears on the homepage after you save it.</p>
              <label><span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-forest-900/60">Trust number</span><input className="field" maxLength={40} aria-label="New homepage trust number" value={statDraft.value} onChange={(event) => setStatDraft((current) => ({ ...current, value: event.target.value }))} placeholder="2,500+" /></label>
              <label><span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-forest-900/60">Label</span><input className="field" maxLength={80} aria-label="New homepage trust number label" value={statDraft.label} onChange={(event) => setStatDraft((current) => ({ ...current, label: event.target.value }))} placeholder="Visas approved" /></label>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={statBusy || !statDraft.value.trim() || !statDraft.label.trim()} onClick={() => void saveTrustStatDraft()} className="min-h-11 rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{statBusy ? 'Saving…' : 'Save trust number'}</button>
                <button type="button" disabled={statBusy} onClick={cancelTrustStatEdit} className="min-h-11 rounded-full border border-forest-900/15 px-4 py-2 text-xs font-bold disabled:opacity-50">Cancel</button>
              </div>
            </div>
          )}
          <button type="button" disabled={form.trustStats.length >= 6 || statBusy || editingStatIndex !== null || editingFaqIndex !== null || isEditingContactDetails} onClick={beginNewTrustStat} className="w-fit min-h-11 rounded-full bg-forest-50 px-4 py-2 text-xs font-bold text-forest-900 disabled:opacity-40">Add trust number</button>
        </section>

        <section className="grid gap-3 border-b border-forest-900/10 pb-5">
          <div>
            <h3 className="text-lg font-extrabold">Homepage FAQs</h3>
            <p className="text-xs text-forest-900/55">Click “Edit FAQ” to open an entry. Use its “Save FAQ” button to publish that change. “Add FAQ” opens a draft and does not publish it until you press “Save FAQ”.</p>
          </div>
          {form.faqs.map((item, index) => {
            const editing = editingFaqIndex === index
            return <div key={index} className="grid gap-3 rounded-2xl bg-cream p-4">
              {editing ? (
                <>
                  <input className="field" aria-label={`FAQ question ${index + 1}`} value={faqDraft.q} onChange={(event) => setFaqDraft({ ...faqDraft, q: event.target.value })} placeholder="Question" />
                  <textarea className="field min-h-20" aria-label={`FAQ answer ${index + 1}`} value={faqDraft.a} onChange={(event) => setFaqDraft({ ...faqDraft, a: event.target.value })} placeholder="Answer" />
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={faqBusy} onClick={() => void saveFaqDraft()} className="rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{faqBusy ? 'Saving…' : 'Save FAQ'}</button>
                    <button type="button" disabled={faqBusy} onClick={cancelFaqEdit} className="rounded-full border border-forest-900/15 px-4 py-2 text-xs font-bold disabled:opacity-50">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div><p className="font-bold">{item.q}</p><p className="mt-1 text-sm text-forest-900/65">{item.a}</p></div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={faqBusy || editingFaqIndex !== null || editingStatIndex !== null || isEditingContactDetails} onClick={() => beginFaqEdit(index)} className="rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">Edit FAQ</button>
                    <button type="button" disabled={faqBusy || editingFaqIndex !== null || editingStatIndex !== null || isEditingContactDetails || form.faqs.length <= 1} onClick={() => void removeFaq(index)} className="rounded-full border border-forest-900/15 px-4 py-2 text-xs font-bold disabled:opacity-40">Remove</button>
                  </div>
                </>
              )}
            </div>
          })}
          {editingFaqIndex === form.faqs.length && (
            <div className="grid gap-3 rounded-2xl border border-coral-300 bg-coral-50/40 p-4">
              <p className="text-sm font-bold text-forest-900">New FAQ draft — it will not appear publicly until saved.</p>
              <input className="field" aria-label="New FAQ question" value={faqDraft.q} onChange={(event) => setFaqDraft({ ...faqDraft, q: event.target.value })} placeholder="Question" />
              <textarea className="field min-h-20" aria-label="New FAQ answer" value={faqDraft.a} onChange={(event) => setFaqDraft({ ...faqDraft, a: event.target.value })} placeholder="Answer" />
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={faqBusy} onClick={() => void saveFaqDraft()} className="rounded-full bg-forest-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{faqBusy ? 'Saving…' : 'Save FAQ'}</button>
                <button type="button" disabled={faqBusy} onClick={cancelFaqEdit} className="rounded-full border border-forest-900/15 px-4 py-2 text-xs font-bold disabled:opacity-50">Cancel</button>
              </div>
            </div>
          )}
          <button type="button" disabled={form.faqs.length >= 20 || faqBusy || editingFaqIndex !== null || editingStatIndex !== null || isEditingContactDetails} onClick={beginNewFaq} className="w-fit rounded-full bg-forest-50 px-4 py-2 text-xs font-bold text-forest-900 disabled:opacity-40">Add FAQ</button>
        </section>

                <section className="grid gap-4">
          <h3 className="text-lg font-extrabold text-forest-900">Website Features & Toggles</h3>
          
          <div
            onClick={() => setForm({ ...form, popupEnabled: !form.popupEnabled })}
            className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-forest-900/10 bg-cream/50 p-4 transition hover:bg-cream active:scale-[0.99]"
          >
            <div>
              <strong className="block text-sm font-extrabold text-forest-900">Enquiry Lead Popup</strong>
              <small className="text-xs text-forest-900/60">Automatically displays the counselling form to visitors after delay.</small>
            </div>
            <div className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out ${form.popupEnabled ? 'bg-coral-500' : 'bg-gray-300'}`}>
              <span className={`inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-0.5 ${form.popupEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </div>

          <div
            onClick={() => setForm({ ...form, whatsappEnabled: !form.whatsappEnabled })}
            className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-forest-900/10 bg-cream/50 p-4 transition hover:bg-cream active:scale-[0.99]"
          >
            <div>
              <strong className="block text-sm font-extrabold text-forest-900">Floating WhatsApp Action</strong>
              <small className="text-xs text-forest-900/60">Keeps the floating WhatsApp chat button visible on public pages.</small>
            </div>
            <div className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out ${form.whatsappEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}>
              <span className={`inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-0.5 ${form.whatsappEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </div>

          <div
            onClick={() => setForm({ ...form, approvalsMarqueeEnabled: !form.approvalsMarqueeEnabled })}
            className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-forest-900/10 bg-cream/50 p-4 transition hover:bg-cream active:scale-[0.99]"
          >
            <div>
              <strong className="block text-sm font-extrabold text-forest-900">Approvals Ticker Marquee</strong>
              <small className="text-xs text-forest-900/60">Shows the moving recent-visa-approval strip on the homepage.</small>
            </div>
            <div className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ease-in-out ${form.approvalsMarqueeEnabled ? 'bg-forest-900' : 'bg-gray-300'}`}>
              <span className={`inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out mt-0.5 ${form.approvalsMarqueeEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </div>

          <div className="rounded-2xl border border-forest-900/10 bg-cream/50 p-4">
            <label className="block">
              <span className="block text-sm font-extrabold text-forest-900">Popup Timer Delay</span>
              <small className="mb-2 block text-xs text-forest-900/60">Number of seconds visitors browse before enquiry popup appears (3–60s).</small>
              <div className="flex items-center gap-2">
                <input
                  className="field max-w-32 font-mono font-bold text-center"
                  type="number"
                  min="3"
                  max="60"
                  value={form.popupDelaySeconds}
                  onChange={(event) => setForm({ ...form, popupDelaySeconds: Number(event.target.value) })}
                />
                             <span className="text-xs font-semibold text-forest-900/60">Seconds</span>
              </div>
            </label>
          </div>
        </section>
        <button type="button" disabled={busy || !isDirty || editingFaqIndex !== null || editingStatIndex !== null || isEditingContactDetails} onClick={() => void save()} className="w-fit rounded-full bg-forest-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{busy ? 'Saving…' : 'Save site settings'}</button>
      </div>
    </section>
  )
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
