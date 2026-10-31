/**
 * Stubbed content for the public site.
 * Everything here is intended to move into Netlify Database and be edited
 * from the admin panel (see PLAN.md). Keep the shapes stable.
 */

export type Country = {
  slug: string
  name: string
  flag: string
  code: string
  headline: string
  intro: string
  stats: { label: string; value: string }[]
  intakes: string[]
  visas: string[]
  highlights: string[]
  costs: { label: string; value: string }[]
  english: string
}

export const countries: Country[] = [
  {
    slug: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    code: 'CA',
    headline: 'Study, work and build a path to PR',
    intro:
      'Eligible students may qualify for a post-graduation work permit (PGWP) and permanent-residence pathways, but programme, institution and personal eligibility rules apply. Confirm the current IRCC criteria before planning.',
    stats: [
      { label: 'Post-study work (if eligible)', value: 'PGWP: up to 3 yrs' },
      { label: 'Spouse work permit', value: 'Eligible cases only' },
      { label: 'Tuition', value: 'Varies by DLI and programme' },
    ],
    intakes: ['January', 'May', 'September'],
    visas: ['Study Permit', 'Express Entry PR', 'PNP', 'Visitor Visa', 'Work Permit'],
    highlights: ['PAL/TAL required in most cases; exemptions apply', 'PGWP eligibility depends on the school and programme', 'Spouse open work permits are limited to eligible cases'],
    costs: [
      { label: 'Living funds, 1 person outside Quebec (excl. tuition/travel)', value: 'CAD 23,448 from 1 Sep 2026' },
      { label: 'Visa fee', value: 'CAD 150' },
      { label: 'Biometrics', value: 'CAD 85' },
    ],
    english: 'Set by the school and programme; some PGWP applicants also need language results.',
  },
  {
    slug: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    code: 'UK',
    headline: 'One-year masters, world-famous universities',
    intro:
      'The UK offers shorter degrees and a Graduate Route for eligible graduates: 2 years for applications by 31 December 2026, 18 months from 1 January 2027, and 3 years for doctoral graduates.',
    stats: [
      { label: 'Graduate Route', value: '2 yrs / 18 mos; 3 yrs doctoral' },
      { label: 'Many masters programmes', value: 'Often 1 year' },
      { label: 'Tuition', value: 'Varies by university and course' },
    ],
    intakes: ['January', 'May', 'September'],
    visas: ['Student Visa', 'Graduate Route', 'Skilled Worker', 'Standard Visitor'],
    highlights: ['English evidence depends on the course, sponsor and visa route', 'Student work rights depend on visa conditions and course', 'Graduate Route duration depends on application date'],
    costs: [
      { label: 'Student living funds, outside London (up to 9 months)', value: '£1,171 / month' },
      { label: 'Student visa fee (outside UK)', value: '£558' },
      { label: 'IHS (health surcharge)', value: '£776 / year' },
    ],
    english: 'Usually CEFR B2 at degree level or B1 below; exemptions and provider assessment may apply.',
  },
  {
    slug: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    code: 'AU',
    headline: 'Sunshine, top-100 universities and skilled migration',
    intro:
      'Australia rewards skills. Study in a regional area for extra post-study work years and points towards skilled migration.',
    stats: [
      { label: 'Post-study work', value: '2–4 yrs' },
      { label: 'Work while studying', value: '48 hrs / fortnight' },
      { label: 'Avg. tuition', value: 'AUD 25–45k' },
    ],
    intakes: ['February', 'July', 'November'],
    visas: ['Student (500)', 'Temporary Graduate (485)', 'Skilled (189/190/491)', 'Visitor (600)'],
    highlights: ['Regional study bonus', 'High minimum wages', 'Points-tested PR system'],
    costs: [
      { label: 'Living funds', value: 'AUD 29,710 / yr' },
      { label: 'Visa fee', value: 'AUD 2,500' },
      { label: 'OSHC', value: 'AUD ~600 / yr' },
    ],
    english: 'IELTS 6.0 / PTE 50',
  },
  {
    slug: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    code: 'US',
    headline: 'The world’s biggest education market',
    intro:
      'From Ivy League to affordable state universities, the USA offers flexibility, STEM OPT extensions and unmatched research opportunities.',
    stats: [
      { label: 'STEM OPT', value: 'Up to 3 yrs' },
      { label: 'Universities', value: '4,000+' },
      { label: 'Avg. tuition', value: 'USD 20–45k' },
    ],
    intakes: ['January (Spring)', 'August (Fall)'],
    visas: ['F-1 Student', 'B1/B2 Visitor', 'H-1B (via employer)'],
    highlights: ['Scholarships & assistantships', 'Flexible majors', 'Mock visa interview prep'],
    costs: [
      { label: 'SEVIS fee', value: 'USD 350' },
      { label: 'Visa fee', value: 'USD 185' },
      { label: 'Living', value: 'USD 12–18k / yr' },
    ],
    english: 'IELTS 6.5 / PTE 58 / Duolingo 110',
  },
  {
    slug: 'new-zealand',
    name: 'New Zealand',
    flag: '🇳🇿',
    code: 'NZ',
    headline: 'Safe, welcoming and green',
    intro:
      'New Zealand offers a relaxed lifestyle, high safety and work rights for students and their partners on eligible programs.',
    stats: [
      { label: 'Post-study work', value: 'Up to 3 yrs' },
      { label: 'Work while studying', value: '25 hrs / week' },
      { label: 'Avg. tuition', value: 'NZD 22–35k' },
    ],
    intakes: ['February', 'July'],
    visas: ['Student Visa', 'Post-Study Work', 'Visitor Visa'],
    highlights: ['Green List occupations', 'Partner work rights', 'Small class sizes'],
    costs: [
      { label: 'Living funds', value: 'NZD 20,000 / yr' },
      { label: 'Visa fee', value: 'NZD 850' },
      { label: 'Insurance', value: 'NZD ~700 / yr' },
    ],
    english: 'IELTS 6.0 / PTE 50',
  },
  {
    slug: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    code: 'DE',
    headline: 'Low or zero tuition at public universities',
    intro:
      'Germany is Europe’s engineering powerhouse — public universities charge little or no tuition and graduates get 18 months to find work.',
    stats: [
      { label: 'Job-seeker period', value: '18 months' },
      { label: 'Public tuition', value: '€0 – €3k' },
      { label: 'Blocked account', value: '€11,904 / yr' },
    ],
    intakes: ['April (Summer)', 'October (Winter)'],
    visas: ['Student Visa', 'Opportunity Card', 'EU Blue Card', 'Schengen Visitor'],
    highlights: ['English-taught masters', 'Strong STEM job market', 'Path to EU Blue Card'],
    costs: [
      { label: 'Blocked account', value: '€992 / month' },
      { label: 'Visa fee', value: '€75' },
      { label: 'Health insurance', value: '€120 / month' },
    ],
    english: 'IELTS 6.5 / basic German helps',
  },
  {
    slug: 'europe',
    name: 'Europe / Schengen',
    flag: '🇪🇺',
    code: 'EU',
    headline: 'Visit 29 countries on one visa',
    intro:
      'Tourist, family visit and business trips to France, Italy, Switzerland, Netherlands and more — we prepare complete, embassy-ready files.',
    stats: [
      { label: 'Countries covered', value: '29' },
      { label: 'Stay allowed', value: '90 / 180 days' },
      { label: 'Processing', value: '15–45 days' },
    ],
    intakes: ['Apply 3–6 months before travel'],
    visas: ['Schengen Tourist', 'Family Visit', 'Business Visa'],
    highlights: ['Itinerary & hotel bookings', 'Cover letter drafting', 'Appointment booking'],
    costs: [
      { label: 'Visa fee', value: '€90' },
      { label: 'Travel insurance', value: '€30,000 cover' },
      { label: 'VFS service', value: 'Varies' },
    ],
    english: 'Not required',
  },
]

export type VisaService = {
  slug: string
  title: string
  icon: 'graduation' | 'briefcase' | 'plane' | 'home' | 'users' | 'file'
  summary: string
  points: string[]
}

export const visaServices: VisaService[] = [
  {
    slug: 'study',
    title: 'Study Visa',
    icon: 'graduation',
    summary: 'Course & university shortlisting, offer letters, SOP, financial docs and visa filing.',
    points: ['Free profile evaluation', 'University applications', 'SOP & LOR drafting', 'Education loan guidance'],
  },
  {
    slug: 'tourist',
    title: 'Tourist & Visitor Visa',
    icon: 'plane',
    summary: 'Visit family or travel — Canada, UK, USA, Australia, NZ and Schengen visitor visas.',
    points: ['Invitation & itinerary', 'Bank statement review', 'Interview preparation', 'Appointment booking'],
  },
  {
    slug: 'pr',
    title: 'PR & Immigration',
    icon: 'home',
    summary: 'Permanent residence through Express Entry, PNPs and Australian skilled migration.',
    points: ['Points assessment', 'ECA & skills assessment', 'Profile creation', 'Document checklist'],
  },
  {
    slug: 'work',
    title: 'Work Permit',
    icon: 'briefcase',
    summary: 'Employer-sponsored and open work permits, Germany Opportunity Card and more.',
    points: ['CV & profile building', 'Job-offer verification', 'LMIA / sponsorship guidance', 'Work permit filing'],
  },
  {
    slug: 'spouse',
    title: 'Spouse & Dependent Visa',
    icon: 'users',
    summary: 'Join your partner abroad with a strong relationship and financial file.',
    points: ['Relationship evidence', 'Open work permit for spouse', 'Dependent child visas', 'Sponsorship letters'],
  },
  {
    slug: 'refusal',
    title: 'Refusal Cases & Re-apply',
    icon: 'file',
    summary: 'Visa refused earlier? We analyse the GCMS / refusal reasons and rebuild your file.',
    points: ['GCMS notes request', 'Refusal analysis', 'Gap explanation', 'Stronger re-application'],
  },
]

export type Testimonial = {
  name: string
  city: string
  country: string
  visa: string
  quote: string
  rating: number
  initials: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Harpreet Kaur',
    city: 'Sangaria',
    country: 'Canada',
    visa: 'Study Permit',
    quote:
      'My file was refused once from another agent. British Education studied the refusal, fixed my SOP and funds — approved in 4 weeks!',
    rating: 5,
    initials: 'HK',
  },
  {
    name: 'Rohit Godara',
    city: 'Hanumangarh',
    country: 'United Kingdom',
    visa: 'Student Visa',
    quote: 'Got an offer from a top UK university with an IELTS waiver. The team handled everything, even my CAS interview practice.',
    rating: 5,
    initials: 'RG',
  },
  {
    name: 'Simranjeet Singh',
    city: 'Abohar',
    country: 'Australia',
    visa: 'Student (500)',
    quote: 'Scored PTE 72 in my first attempt after their 30-day batch. Then they processed my Australian visa smoothly.',
    rating: 5,
    initials: 'SS',
  },
  {
    name: 'Manju Beniwal',
    city: 'Sri Ganganagar',
    country: 'Europe',
    visa: 'Schengen Tourist',
    quote: 'Our family trip to Switzerland and Italy — all four visas approved. The documentation was very professional.',
    rating: 5,
    initials: 'MB',
  },
  {
    name: 'Gurpreet Brar',
    city: 'Sangaria',
    country: 'Canada',
    visa: 'Spouse Open Work Permit',
    quote: 'I joined my wife in Toronto within 2 months. Honest guidance and no hidden charges.',
    rating: 5,
    initials: 'GB',
  },
  {
    name: 'Ankit Saharan',
    city: 'Rawatsar',
    country: 'Germany',
    visa: 'Student Visa',
    quote: 'Admission to a public university with almost zero tuition. Blocked account and APS — they guided every step.',
    rating: 4,
    initials: 'AS',
  },
]

export type Approval = {
  name: string
  country: string
  flag: string
  visa: string
  date: string
  note?: string
}

export const approvals: Approval[] = [
  { name: 'Jaspreet K.', country: 'Canada', flag: '🇨🇦', visa: 'Study Permit', date: '2026-10-21', note: 'Sept intake · Conestoga' },
  { name: 'Ravinder S.', country: 'UK', flag: '🇬🇧', visa: 'Student Visa', date: '2026-10-18', note: 'MSc Data Science' },
  { name: 'Pooja & Family', country: 'Schengen', flag: '🇪🇺', visa: 'Tourist Visa', date: '2026-10-15', note: 'France · 4 applicants' },
  { name: 'Karan M.', country: 'Australia', flag: '🇦🇺', visa: 'Subclass 500', date: '2026-10-11', note: 'Regional Victoria' },
  { name: 'Navdeep G.', country: 'Canada', flag: '🇨🇦', visa: 'Visitor Visa', date: '2026-10-08', note: 'Parents · 10-year multiple' },
  { name: 'Mandeep B.', country: 'USA', flag: '🇺🇸', visa: 'F-1 Student', date: '2026-10-02', note: 'Spring intake' },
  { name: 'Sukhpreet K.', country: 'New Zealand', flag: '🇳🇿', visa: 'Student Visa', date: '2026-09-27', note: 'Auckland' },
  { name: 'Vikas J.', country: 'Germany', flag: '🇩🇪', visa: 'Student Visa', date: '2026-09-22', note: 'MS Mechanical' },
  { name: 'Amandeep S.', country: 'Canada', flag: '🇨🇦', visa: 'Spouse OWP', date: '2026-09-17' },
  { name: 'Neha R.', country: 'UK', flag: '🇬🇧', visa: 'Standard Visitor', date: '2026-09-12', note: 'Convocation visit' },
]

export type Post = {
  slug: string
  title: string
  category: 'Visa News' | 'Study Abroad' | 'IELTS & PTE' | 'Immigration'
  date: string
  excerpt: string
  readMins: number
  body: string[]
  lastReviewed?: string
  sources?: { label: string; url: string }[]
}

export const posts: Post[] = [
  {
    slug: 'canada-study-permit-cap-2027',
    title: 'Canada study permit cap for 2027: what’s confirmed so far',
    category: 'Visa News',
    date: '2026-10-20',
    excerpt: 'IRCC has published 2026 allocation figures; its 2026 planning binder puts work on the 2027 cap in fall 2026. Check the current PAL/TAL rules before applying.',
    readMins: 2,
    lastReviewed: '2026-10-31',
    sources: [
      { label: 'IRCC 2026 allocation notice', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/2026-provincial-territorial-allocations-under-international-student-cap.html' },
      { label: 'IRCC 2026 planning binder', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/transparency/transition-binders/deputy-minister-2026/international-student-program.html' },
      { label: 'PAL/TAL exceptions', url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/provincial-attestation-letter.html' },
    ],
    body: [
      'As of 31 October 2026, IRCC’s public allocation notice lists 2026 figures. Its 2026 planning binder says work to set the 2027 study-permit cap and seek provincial and territorial allocation approvals is scheduled for fall 2026. Check IRCC for a newer notice before making a 2027 plan.',
      'A PAL or TAL is required in most cases. Exemptions include eligible master’s and doctoral students at public designated learning institutions starting 1 January 2026, along with other groups listed by IRCC. Check the exact programme and application rules; Quebec applicants may also need a CAQ.',
      'An allocation or PAL/TAL does not guarantee a study permit. IRCC assesses each application against its full requirements. Confirm current instructions with your designated learning institution and IRCC before applying.',
    ],
  },
  {
    slug: 'uk-graduate-route-update',
    title: 'UK Graduate Route: duration by application date',
    category: 'Visa News',
    date: '2026-10-12',
    excerpt: 'Eligible graduates get 2 years if they apply by 31 December 2026, 18 months from 1 January 2027, or 3 years for doctoral qualifications.',
    readMins: 2,
    lastReviewed: '2026-10-31',
    sources: [
      { label: 'GOV.UK Graduate visa', url: 'https://www.gov.uk/graduate-visa' },
      { label: 'Immigration Rules: Graduate route', url: 'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-graduate' },
    ],
    body: [
      'Under current GOV.UK rules, eligible graduates receive 2 years when they apply on or before 31 December 2026. Applications made on or after 1 January 2027 receive 18 months. Graduates with a PhD or other doctoral qualification receive 3 years.',
      'The application date sets the duration, not the course intake month. You must apply before your Student permission expires and after your education provider has told the Home Office that you completed your course.',
      'Check the current GOV.UK guidance before planning. The Graduate visa cannot be extended, though some graduates may be able to switch to another route.',
    ],
  },
  {
    slug: 'pte-vs-ielts-which-one',
    title: 'PTE or IELTS — which test should you take in 2026?',
    category: 'IELTS & PTE',
    date: '2026-10-05',
    excerpt: 'Computer-based PTE gives faster results; IELTS is accepted everywhere. Here is a simple way to decide.',
    readMins: 6,
    body: [
      'Both tests are widely accepted for study and migration. PTE is fully computer-based with results usually in 48 hours, while IELTS is available on paper and on computer.',
      'If you are comfortable with typing and speaking into a microphone, PTE often feels faster. If you prefer human examiners for speaking, IELTS can be the better fit.',
      'Take a free mock test at our Sangaria centre and we will recommend the right test for you.',
    ],
  },
  {
    slug: 'schengen-visa-checklist',
    title: 'Schengen tourist visa checklist for Indian families',
    category: 'Immigration',
    date: '2026-09-28',
    excerpt: 'Planning a Europe holiday? These are the documents embassies look for — and the mistakes to avoid.',
    readMins: 4,
    body: [
      'A strong Schengen application has a clear itinerary, confirmed hotel bookings, travel insurance with €30,000 cover and bank statements that show stable income.',
      'Apply to the embassy of the country where you will spend the most nights. Book appointments 6–8 weeks before peak summer travel.',
    ],
  },
  {
    slug: 'germany-public-universities',
    title: 'Studying in Germany for (almost) free: public universities explained',
    category: 'Study Abroad',
    date: '2026-09-18',
    excerpt: 'Blocked account, APS certificate and English-taught masters — your step-by-step guide to Germany.',
    readMins: 7,
    body: [
      'German public universities charge little or no tuition, even for international students. You will need a blocked account to show living funds.',
      'Indian students need an APS certificate before applying for the student visa. Start the process at least 3 months in advance.',
    ],
  },
  {
    slug: 'australia-regional-study-benefits',
    title: 'Why regional Australia can add years to your post-study work visa',
    category: 'Study Abroad',
    date: '2026-09-09',
    excerpt: 'Studying outside Sydney and Melbourne brings extra work rights and migration points.',
    readMins: 5,
    body: [
      'Graduates from regional campuses may receive additional years on the Temporary Graduate (485) visa and extra points for skilled migration.',
      'Cities like Adelaide, Perth, Hobart and Gold Coast offer lower living costs too.',
    ],
  },
]

export const coachingCourses = [
  {
    test: 'IELTS',
    tagline: 'Academic & General Training',
    duration: '6 weeks',
    batch: 'Morning · Afternoon · Evening',
    features: [
      'All 4 modules: Listening, Reading, Writing, Speaking',
      'Weekly full-length mock tests',
      'One-on-one speaking sessions',
      'Writing task band-score feedback',
      'Cambridge practice material',
    ],
    target: 'Avg. student band 7.0',
  },
  {
    test: 'PTE',
    tagline: 'PTE Academic & PTE Core',
    duration: '4 weeks',
    batch: 'Morning · Evening · Weekend',
    features: [
      'AI-scored practice portal access',
      'Templates for Describe Image & Retell Lecture',
      'Computer lab with real-exam headsets',
      'Sectional & full mock tests',
      'Exam booking assistance',
    ],
    target: 'Avg. student score 65+',
  },
]

export const coachingSchedule = [
  { batch: 'IELTS Morning', time: '8:00 – 10:00 AM', seats: 6, starts: 'Nov 3' },
  { batch: 'PTE Morning', time: '10:00 AM – 12:00 PM', seats: 4, starts: 'Nov 3' },
  { batch: 'IELTS Afternoon', time: '1:00 – 3:00 PM', seats: 9, starts: 'Nov 10' },
  { batch: 'PTE Evening', time: '4:00 – 6:00 PM', seats: 3, starts: 'Nov 10' },
  { batch: 'Weekend PTE Crash', time: 'Sat–Sun · 10 AM – 2 PM', seats: 8, starts: 'Nov 8' },
]

export const bandScoreTable = [
  { ielts: '8.0+', pte: '79+', clb: 'CLB 10' },
  { ielts: '7.5', pte: '73–78', clb: 'CLB 9' },
  { ielts: '7.0', pte: '65–72', clb: 'CLB 8' },
  { ielts: '6.5', pte: '58–64', clb: 'CLB 7' },
  { ielts: '6.0', pte: '50–57', clb: 'CLB 6' },
  { ielts: '5.5', pte: '42–49', clb: 'CLB 5' },
]

export const faqs = [
  { q: 'Is the first counselling session free?', a: 'Yes. Your first profile evaluation — in person in Sangaria or over phone/WhatsApp — is completely free.' },
  { q: 'Can I apply with a study gap?', a: 'Yes. Gaps of several years can be explained with work experience or other evidence. We help you write a clear gap explanation.' },
  { q: 'My visa was refused earlier. Can I apply again?', a: 'Absolutely. We first request your refusal notes (GCMS for Canada) and then fix the weak points before re-applying.' },
  { q: 'Do you help with education loans?', a: 'We guide you through loan options with banks and NBFCs and help prepare the financial documentation.' },
  { q: 'Do I need IELTS for the UK?', a: 'Many UK universities accept Class 12 English marks or PTE/Duolingo. We will shortlist options for your profile.' },
]
