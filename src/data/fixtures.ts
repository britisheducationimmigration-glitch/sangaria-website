/**
 * Stubbed content for the public site.
 * Everything here is intended to move into Netlify Database and be edited
 * from the admin panel (see PLAN.md). Keep the shapes stable.
 */

export type StudyGuide = {
  tuitionEstimate: string
  studentVisaFee: string
  proofOfFunds: string
  admissionAndEnglish: string
  workWhileStudying: string
  postStudyOption: string
  intakesNote: string
  lastVerified: string
  sources: { label: string; url: string }[]
}

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
  studyGuide?: StudyGuide
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
    studyGuide: {
      tuitionEstimate: "2026 averages: CAD 41,746/year undergraduate and CAD 24,028/year graduate. College diploma programmes are often about CAD 16,000–25,000/year; your offer sets the actual tuition.",
      studentVisaFee: "Study permit CAD 150; biometrics CAD 85 when required.",
      proofOfFunds: "CAD 23,448 for one person outside Quebec from 1 September 2026. Tuition and travel are additional; family size and Quebec rules change the amount.",
      admissionAndEnglish: "Admission from a Designated Learning Institution and a PAL/TAL in most cases (exceptions apply). The school/programme sets admission English; some PGWP applicants have separate IRCC language and field-of-study rules.",
      workWhileStudying: "Eligible students may work off campus up to 24 hours/week while classes are in session and full-time during scheduled breaks.",
      postStudyOption: "An eligible graduate may qualify for a PGWP of up to 3 years. School, programme, application-date, field-of-study and language rules can affect eligibility and duration.",
      intakesNote: "Common starts shown; dates and availability vary by institution and programme. Confirm the selected course calendar.",
      lastVerified: "2 November 2026",
      sources: [
        { label: "EduCanada tuition and study costs", url: "https://www.educanada.ca/programs-programmes/education_cost-cout_education.aspx?lang=eng" },
        { label: "IRCC proof of funds", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html" },
        { label: "IRCC student work conditions", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/work-off-campus.html" },
        { label: "IRCC PGWP eligibility", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html" },
      ],
    },
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
    studyGuide: {
      tuitionEstimate: "Study UK’s published guide range: undergraduate £11,400–£38,000/year; postgraduate £9,000–£30,000/year. This is indicative; the current course quote from the university controls.",
      studentVisaFee: "Student visa £558 from outside the UK; student Immigration Health Surcharge is £776/year. Total IHS depends on visa length.",
      proofOfFunds: "£1,171/month outside London or £1,529/month in London, for up to 9 months, plus course fees. Exemptions and individual circumstances apply.",
      admissionAndEnglish: "A Confirmation of Acceptance for Studies (CAS) from a licensed Student sponsor is required. English evidence depends on course level, sponsor and visa rules; exemptions may apply.",
      workWhileStudying: "Usually up to 20 hours/week in term for eligible degree-level students at qualifying sponsors; some below-degree courses allow 10 hours, while other courses allow no work. Follow the visa conditions.",
      postStudyOption: "Eligible graduates may get 2 years if they apply by 31 December 2026, 18 months from 1 January 2027, or 3 years for a doctorate. The course must be eligible and the provider must report completion.",
      intakesNote: "Common starts shown; course starts and application deadlines vary by university and programme.",
      lastVerified: "2 November 2026",
      sources: [
        { label: "Study UK tuition guidance", url: "https://study-uk.britishcouncil.org/moving-uk/cost-studying" },
        { label: "GOV.UK student visa funds", url: "https://www.gov.uk/student-visa/money" },
        { label: "GOV.UK student work conditions", url: "https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-student" },
        { label: "GOV.UK Graduate visa", url: "https://www.gov.uk/graduate-visa" },
      ],
    },
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
    studyGuide: {
      tuitionEstimate: "The site’s AUD 25,000–45,000/year band is a planning estimate, not a national fee rule. Provider, course and city affect tuition; use the official course search for an exact course quote.",
      studentVisaFee: "Subclass 500 starts at AUD 2,500 from 1 July 2026; concessions and extra applicants can change the total.",
      proofOfFunds: "AUD 29,710 for 12 months of the primary student’s living costs, plus first-year tuition and travel. Higher evidence can be needed for accompanying family.",
      admissionAndEnglish: "A Confirmation of Enrolment (CoE) from a CRICOS-registered provider and the Genuine Student assessment are key requirements. English test evidence is required only where applicable; course admission requirements can be higher.",
      workWhileStudying: "Student visa holders may work up to 48 hours per fortnight while their course is in session; check the conditions on the visa. Different rules apply during scheduled breaks.",
      postStudyOption: "Subclass 485 usually allows 2 years after a bachelor’s or coursework master’s, and 3 years after a research master’s or doctorate. Indian nationals may have treaty-specific periods. Age, recent eligible study and other requirements apply. A regional second visa needs qualifying regional study and residence.",
      intakesNote: "Common starts shown; course calendars, trimester options and deadlines vary by provider.",
      lastVerified: "2 November 2026",
      sources: [
        { label: "Study Australia course search and costs", url: "https://www.studyaustralia.gov.au/en_in/life-in-australia/living-and-education-costs" },
        { label: "Subclass 500 and financial capacity", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500" },
        { label: "Student visa charges", url: "https://www.studyaustralia.gov.au/en/tools-and-resources/news/student-visa-application-charge-increase" },
        { label: "Subclass 485 post-higher-education work", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485/post-higher-education-work" },
        { label: "Regional graduate visa options", url: "https://immi.homeaffairs.gov.au/visas/working-in-australia/regional-migration" },
      ],
    },
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
    studyGuide: {
      tuitionEstimate: "The site’s USD 20,000–45,000/year band is a planning estimate only. Tuition and living costs vary widely by school, programme and location; use the school’s current cost estimate on Form I-20.",
      studentVisaFee: "F/M visa application US$185 plus separate I-901 SEVIS fee US$350; reciprocity or other costs may apply.",
      proofOfFunds: "There is no single national living-funds figure. The SEVP-certified school records estimated tuition and living expenses on Form I-20; applicants must show funding for the school’s required amount.",
      admissionAndEnglish: "Acceptance from an SEVP-certified school and Form I-20 are needed. Each school sets its admission and English evidence; there is no single federal IELTS/PTE score.",
      workWhileStudying: "F-1 on-campus work is generally limited to 20 hours/week while school is in session. Off-campus CPT/OPT requires the correct school/USCIS authorization and must meet its rules.",
      postStudyOption: "Eligible students may get up to 12 months of OPT per higher education level. A qualifying STEM degree may support a further 24-month STEM OPT extension with an eligible E-Verify employer.",
      intakesNote: "Spring and fall are common starts; some programmes have summer or rolling entry. Confirm each school’s calendar and deadline.",
      lastVerified: "2 November 2026",
      sources: [
        { label: "EducationUSA study costs", url: "https://educationusa.state.gov/your-5-steps-us-study/finance-your-studies" },
        { label: "U.S. Department of State student visas", url: "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html" },
        { label: "DHS F-1 practical training overview", url: "https://studyinthestates.dhs.gov/assets/SEVP_PracticalTrainingOverview_1-pager.pdf" },
        { label: "DHS SEVIS fee guidance", url: "https://studyinthestates.dhs.gov/students/prepare/paying-the-i-901-sevis-fee" },
      ],
    },
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
    studyGuide: {
      tuitionEstimate: "Published Study with New Zealand estimates: bachelor’s NZD 35,000–55,000/year; postgraduate NZD 20,000–45,000/year (tuition figures last updated March 2025). Confirm current fees with the provider.",
      studentVisaFee: "Fee Paying Student Visa from NZD 850; the final fee can vary by citizenship, application location and levies.",
      proofOfFunds: "Tertiary students generally show NZD 20,000/year, or NZD 1,667/month for shorter study; tuition is separate. Check current INZ rules for your course and family.",
      admissionAndEnglish: "An offer of place from an approved education provider is required. The provider sets academic and English admission evidence; acceptable insurance and other visa criteria also apply.",
      workWhileStudying: "Eligible visa conditions may allow up to 25 hours/week and full-time work in specified holidays. Rights depend on the visa and course conditions.",
      postStudyOption: "A Post Study Work Visa may last up to 3 years depending on the completed qualification. Eligible master’s/doctoral study of at least 30 weeks can qualify for 3 years; other qualifications have separate rules.",
      intakesNote: "Common starts shown; provider and programme calendars vary.",
      lastVerified: "2 November 2026",
      sources: [
        { label: "Study with New Zealand costs", url: "https://www.studywithnewzealand.govt.nz/en/plan-your-studies/cost-of-living" },
        { label: "INZ Fee Paying Student Visa", url: "https://www.immigration.govt.nz/visas/fee-paying-student-visa/" },
        { label: "INZ student work conditions", url: "https://www.immigration.govt.nz/study/once-you-have-a-student-visa/working-on-a-student-visa/" },
        { label: "INZ Post Study Work Visa", url: "https://www.immigration.govt.nz/visas/post-study-work-visa/" },
      ],
    },
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
      { label: 'Living funds (2026 baseline)', value: '€1,091 / month · €13,092 / yr' },
    ],
    intakes: ['April (Summer)', 'October (Winter)'],
    visas: ['Student Visa', 'Opportunity Card', 'EU Blue Card', 'Schengen Visitor'],
    highlights: ['English-taught masters', 'Strong STEM job market', 'Path to EU Blue Card'],
    costs: [
      { label: 'Living funds (2026 baseline)', value: '€1,091 / month' },
      { label: 'Visa fee', value: '€75' },
      { label: 'Health insurance', value: '€120 / month' },
    ],
    english: 'IELTS 6.5 / basic German helps',
    studyGuide: {
      tuitionEstimate: "Most public universities charge no tuition for bachelor’s and many master’s programmes. A semester contribution is usually €70–€430; exceptions, private universities and special programmes can charge tuition.",
      studentVisaFee: "German national long-stay study visa: €75; service-centre and residence-permit costs may be separate.",
      proofOfFunds: "2026 living-funds baseline: €1,091/month (€13,092 for 12 months). A blocked account is common; scholarship, declaration of commitment or another accepted proof may be possible. Follow the responsible mission’s checklist.",
      admissionAndEnglish: "Admission from a German university and a recognised prior qualification are required. German/English language proof depends on the programme and teaching language; check the university and embassy requirements.",
      workWhileStudying: "Third-country students may work up to 140 full days or 280 half days/year, or alternatively up to 20 hours/week during the lecture period; conditions and student status apply.",
      postStudyOption: "After successfully completing a German degree, graduates may apply for a residence permit of up to 18 months to seek qualified employment; the permit and next work route have eligibility requirements.",
      intakesNote: "Common starts are April (summer) and October (winter); exact dates, deadlines and available programmes vary by university.",
      lastVerified: "2 November 2026",
      sources: [
        { label: "Make it in Germany study and visa guidance", url: "https://www.make-it-in-germany.com/en/visa-recognition/visa-types/studying" },
        { label: "DAAD tuition and semester contributions", url: "https://www.daad.de/en/studying-in-germany/living-in-germany/finances/" },
        { label: "Make it in Germany student work rules", url: "https://www.make-it-in-germany.com/en/study-vocational-training/studying-in-germany/work" },
        { label: "German Federal Foreign Office visa service", url: "https://www.auswaertiges-amt.de/en/visa-service/215870-215870" },
      ],
    },
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
      'Most German public universities charge little or no tuition, though semester contributions and programme exceptions apply. A blocked account is one common way to show living funds; check the current official amount and any accepted alternatives before applying.',
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
  { batch: 'IELTS Morning', time: '8:00 – 10:00 AM', seats: 6, starts: '2026-11-03' },
  { batch: 'PTE Morning', time: '10:00 AM – 12:00 PM', seats: 4, starts: 'Nov 3' },
  { batch: 'IELTS Afternoon', time: '1:00 – 3:00 PM', seats: 9, starts: '2026-11-10' },
  { batch: 'PTE Evening', time: '4:00 – 6:00 PM', seats: 3, starts: 'Nov 10' },
  { batch: 'Weekend PTE Crash', time: 'Sat–Sun · 10 AM – 2 PM', seats: 8, starts: '2026-11-08' },
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
