import type { Approval, Post, Testimonial } from '@/data/fixtures'

export type SiteFaq = { q: string; a: string }
export type SiteTrustStat = { value: string; label: string }

export type CertificateCategory = string

export type PublicCertificate = {
  id: number
  title: string
  issuer: string
  category: CertificateCategory
  credentialDate: string
  altText: string
  imageSrc: string
  homepageFeatured: boolean
  published: boolean
  sortOrder: number
}

export type AdminCertificate = PublicCertificate & {
  collection: string
  hasDatabaseImage: boolean
}

export type CertificateSeed = {
  slug: string
  title: string
  issuer: string
  category: CertificateCategory
  credentialDate: string
  altText: string
  imagePath: string
  homepageFeatured: boolean
  published: boolean
  sortOrder: number
}

export type SiteSettings = {
  popupEnabled: boolean
  popupDelaySeconds: number
  whatsappEnabled: boolean
  approvalsMarqueeEnabled: boolean
  phones: string[]
  emails: string[]
  officeHours: string
  faqs: SiteFaq[]
  trustStats: SiteTrustStat[]
}

export type PublicContent = {
  posts: Post[]
  approvals: Approval[]
  testimonials: Testimonial[]
  certificates: PublicCertificate[]
  settings: SiteSettings
}

export type CoachingBatch = {
  id: number
  program: string
  batch: string
  time: string
  seats: number
  starts: string
  published: boolean
}

export type PublicCoachingContent = { batches: CoachingBatch[] }

export type EnquiryStatus = 'New' | 'Contacted' | 'Follow-up' | 'Documents Pending' | 'Applied' | 'Converted' | 'Closed'

export type AdminRole = 'super_admin' | 'content_editor' | 'enquiry_manager'

export type EnquiryActivity = {
  id: number
  enquiryId: number
  authorName: string
  authorEmail: string
  body: string
  createdAt: string
  updatedAt: string
  editedBy: string
}

export type Enquiry = {
  id: number
  name: string
  phone: string
  email: string
  city: string
  interest: string
  country: string
  message: string
  source: string
  summary: string
  status: EnquiryStatus
  notes: string
  activities: EnquiryActivity[]
  assignedTo: string
  nextFollowUpAt: string
  createdAt: string
  updatedAt: string
}

export type AdminPost = Post & { id: number; published: boolean }

export type AdminStory = {
  id: number
  kind: 'approval' | 'testimonial'
  name: string
  city: string
  country: string
  visa: string
  quote: string
  rating: number
  initials: string
  flag: string
  date: string
  note: string
  mediaType: 'none' | 'photo' | 'video'
  photoSrc: string
  videoUrl: string
  mediaAlt: string
  mediaConsent: boolean
  published: boolean
}

export type AdminSnapshot = {
  user: { name: string; email: string; role: AdminRole }
  enquiries: Enquiry[]
  posts: AdminPost[]
  stories: AdminStory[]
  batches: CoachingBatch[]
  certificates: AdminCertificate[]
  settings: SiteSettings
  users: AdminUser[]
  enquiryStats: {
    total: number
    newCount: number
    followUps: number
    dueToday: number
    converted: number
    newLast7Days: number
    demoRequests: number
    byStatus: Record<string, number>
    bySource: Record<string, number>
  }
}

export type AdminUser = {
  openId: string
  email: string
  name: string
  role: AdminRole
}
