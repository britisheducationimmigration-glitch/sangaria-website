export interface CashflowStage {
  stageNumber: number
  title: string
  timeline: string
  inrEstimate: string
  officialCost: string
  paidTo: string
  description: string
  refundableInfo: string
}

export interface CountryCashflow {
  slug: string
  name: string
  flag: string
  currency: string
  headline: string
  totalEstimateINR: string
  officialRuleNote: string
  stages: CashflowStage[]
}

export const defaultCashflowData: CountryCashflow[] = [
  {
    slug: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    headline: 'Mandatory GIC + 1 Year Tuition upfront',
    totalEstimateINR: '₹24 - 30 Lakhs',
    officialRuleNote: 'IRCC mandatory living requirement is CAD $23,448 + 1 year tuition fee paid directly to the designated DLI.',
    stages: [
      {
        stageNumber: 1,
        title: 'Offer Letter & Application',
        timeline: 'Month 0 - 1',
        inrEstimate: '₹0 - ₹25,000',
        officialCost: 'CAD $0- $250',
        paidTo: 'College / University Application Portal',
        description: 'University application fee and credential evaluation directly paid to the institution.',
        refundableInfo: 'Non-refundable application processing fee',
      },
      {
        stageNumber: 2,
        title: '1 Year Tuition Fee',
        timeline: 'Month 1 - 2',
        inrEstimate: '₹11,00,000 - ₹15,00,000',
        officialCost: 'CAD $18,000 - $24,000',
        paidTo: 'Designated Learning Institution (College/University)',
        description: 'Full first-year tuition fee transfer via Flywire / CIBC student pay wire transfer.',
        refundableInfo: '100% Refundable if visa is refused (minus admin charges ~CAD $200-$500)',
      },
      {
        stageNumber: 3,
        title: 'GIC (Cost of Living) & Medical',
        timeline: 'Month 2 - 3',
        inrEstimate: '₹14,50,000 - ₹15,50,000',
        officialCost: 'CAD $23,448 GIC + ₹7,500 Medical',
        paidTo: 'CIBC / Scotiabank / ICICI Canada (Student own account)',
        description: 'Living expense guarantee deposited directly into student’s own Canadian bank account.',
        refundableInfo: '100% Refundable to student’s Indian account on visa refusal',
      },
      {
        stageNumber: 4,
        title: 'Visa Fee & Biometrics',
        timeline: 'Month 3 - 4',
        inrEstimate: '₹15,000 - ₹18,000',
        officialCost: 'CAD $150 Visa + CAD $85 Biometrics',
        paidTo: 'IRCC Official Canadian Government Portal',
        description: 'Official student permit processing charge paid directly on the Canada.ca portal.',
        refundableInfo: 'Non-refundable embassy fee',
      },
    ],
  },
  {
    slug: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    headline: '1st Semester Tuition + Genuine Student (GS) Funds',
    totalEstimateINR: '₹19 - 26 Lakhs',
    officialRuleNote: 'Requires 1 semester fee payment to get CoE, plus health insurance (OSHC) and official living cost proof.',
    stages: [
      {
        stageNumber: 1,
        title: 'Offer & Genuine Student (GS) Assessment',
        timeline: 'Month 0 - 1',
        inrEstimate: '₹0 - ₹35,000',
        officialCost: 'AUD $0 - $150',
        paidTo: 'Australian University Portal',
        description: 'Academic evaluation and Genuine Student financial screening submission.',
        refundableInfo: 'Institutional application fee',
      },
      {
        stageNumber: 2,
        title: '1st Semester Tuition & OSHC',
        timeline: 'Month 1 - 2',
        inrEstimate: '₹9,00,000 - ₹13,00,000',
        officialCost: 'AUD $15,000 - $20,000 + OSHC AUD $600+',
        paidTo: 'University & Medibank/Bupa Insurance',
        description: 'Initial deposit for Confirmation of Enrolment (CoE) release.',
        refundableInfo: 'Protected by Australian Education Services for Overseas Students (ESOS) Act',
      },
      {
        stageNumber: 3,
        title: 'Savings / Loan Fund Proof',
        timeline: 'Month 2',
        inrEstimate: '₹0 Outflow (Account Hold)',
        officialCost: 'AUD $29,710 Living Expense Proof',
        paidTo: 'Stay in Student / Parent Bank Account',
        description: 'Show-money in bank account or approved education loan sanction letter.',
        refundableInfo: 'Paisa aapke hi bank account mein rehta hai',
      },
      {
        stageNumber: 4,
        title: 'Subclass 500 Visa Fee',
        timeline: 'Month 3',
        inrEstimate: '₹1,65,000 - ₹1,70,000',
        officialCost: 'AUD $2,500 (Official Department of Home Affairs)',
        paidTo: 'ImmiAccount Portal (Australian Government)',
        description: 'Official student visa application fee paid on ImmiAccount.',
        refundableInfo: 'Official Australian Government fee',
      },
    ],
  },
  {
    slug: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    headline: 'CAS Deposit + IHS Health Surcharge',
    totalEstimateINR: '₹17 - 25 Lakhs',
    officialRuleNote: 'CAS deposit required for CAS letter. Living expense (28-day bank balance rule) must be maintained.',
    stages: [
      {
        stageNumber: 1,
        title: 'Offer Letter & Credibility',
        timeline: 'Month 0 - 1',
        inrEstimate: '₹0 - ₹25,000',
        officialCost: '£0 - £100',
        paidTo: 'UK University Portal',
        description: 'Direct university admission application and interview round.',
        refundableInfo: 'Standard application fee',
      },
      {
        stageNumber: 2,
        title: 'CAS Deposit',
        timeline: 'Month 1 - 2',
        inrEstimate: '₹3,50,000 - ₹6,00,000',
        officialCost: '£3,000 - £5,000',
        paidTo: 'UK University Bank Account',
        description: 'Initial advance tuition deposit to generate official CAS reference number.',
        refundableInfo: 'Full refund if visa is refused as per university policy',
      },
      {
        stageNumber: 3,
        title: '28-Day Bank Statement Hold',
        timeline: 'Month 2',
        inrEstimate: '₹0 Outflow (Bank Balance)',
        officialCost: '£10,539 - £13,761 Living proof',
        paidTo: 'Held in Family Savings Account',
        description: 'UKVI 28-day consecutive holding rule in bank account.',
        refundableInfo: 'Aapka paisa aapke account me hi rehta hai',
      },
      {
        stageNumber: 4,
        title: 'Visa Fee + IHS Healthcare',
        timeline: 'Month 3',
        inrEstimate: '₹1,85,000 - ₹2,25,000',
        officialCost: '£558 Visa + £776/year IHS',
        paidTo: 'UKVI / Home Office Official Portal',
        description: 'Mandatory NHS healthcare access card and student visa processing.',
        refundableInfo: 'IHS surcharge is refunded if visa is refused',
      },
    ],
  },
  {
    slug: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    currency: 'EUR',
    headline: 'Living Funds (Sperrkonto) + Public University Costs',
    totalEstimateINR: '₹13 - 15 Lakhs (estimated)',
    officialRuleNote: 'For an admitted student visa in 2026, the living-funds baseline is €11,904 for 12 months (€992/month). A blocked account is common, but a scholarship or declaration of commitment may be accepted. The separate visa to seek a university place uses €1,091/month. Many public programmes charge no tuition, though semester contributions and state, university or programme exceptions apply. INR estimates use about ₹105.9/EUR checked 2 Nov 2026; actual exchange and transfer charges vary.',
    stages: [
      {
        stageNumber: 1,
        title: 'APS Certificate & Uni-Assist',
        timeline: 'Month 0 - 2',
        inrEstimate: '₹27,000 - ₹35,000',
        officialCost: '₹18,000 APS + €75 Uni-Assist',
        paidTo: 'German Embassy APS India & Uni-Assist',
        description: 'Mandatory document verification for all Indian students applying to Germany.',
        refundableInfo: 'Verification assessment fee',
      },
      {
        stageNumber: 2,
        title: 'University Tuition Fee',
        timeline: 'Month 2',
        inrEstimate: 'Varies by university / programme',
        officialCost: 'About €70 - €430 semester contribution; tuition may apply',
        paidTo: 'University Student Union',
        description: 'Most public bachelor’s and many master’s programmes have no tuition. Semester contributions are separate; some states, universities and programmes charge tuition.',
        refundableInfo: 'Confirm any tuition or semester-fee refund policy with the university',
      },
      {
        stageNumber: 3,
        title: 'Blocked Account (Sperrkonto)',
        timeline: 'Month 3',
        inrEstimate: 'About ₹12.6 Lakhs (rate checked 2 Nov 2026; transfer costs extra)',
        officialCost: '€992/month = €11,904 for 12 months (2026 student baseline)',
        paidTo: 'Expatrio / Fintiba / Coracle Account',
        description: 'A blocked account is common, but accepted proof can also include a scholarship or other recognised evidence. Confirm the responsible mission’s checklist.',
        refundableInfo: 'Refund timing and charges depend on the blocked-account provider; check its terms before opening',
      },
      {
        stageNumber: 4,
        title: 'National Visa Fee & VFS',
        timeline: 'Month 4',
        inrEstimate: '₹7,500 - ₹9,000',
        officialCost: '€75 Visa Fee',
        paidTo: 'German Embassy / VFS Global',
        description: 'National Student Visa (Type D) appointment and biometrics.',
        refundableInfo: 'Embassy processing charge',
      },
    ],
  },
  {
    slug: 'new-zealand',
    name: 'New Zealand',
    flag: '🇳🇿',
    currency: 'NZD',
    headline: 'First-year Tuition + Living Funds Evidence',
    totalEstimateINR: '₹24 - 32 Lakhs (estimated)',
    officialRuleNote: 'Planning estimate, not an official minimum. For tertiary or other non-compulsory study, INZ requires NZD $20,000 per year for living costs (or NZD $1,667 per month for shorter study), separate from tuition. Fee Paying Student Visa costs from NZD $850. The INR uses roughly ₹56 per NZD; it includes living-funds evidence that is not itself a payment, and actual exchange rates/provider fees vary.',
    officialSources: [
      { label: 'INZ Fee Paying Student Visa', url: 'https://www.immigration.govt.nz/visas/fee-paying-student-visa/' },
      { label: 'INZ student fund requirements', url: 'https://www.immigration.govt.nz/process-to-apply/applying-for-a-visa/providing-evidence-and-documents-to-support-your-visa-application/student-fund-requirements/' },
    ],
    stages: [
      {
        stageNumber: 1,
        title: 'Offer & Application',
        timeline: 'Month 0 - 1',
        inrEstimate: '₹0 - ₹25,000',
        officialCost: 'NZD $0 - $450 (varies by provider)',
        paidTo: 'Education provider / application services',
        description: 'Application and document costs vary by provider; confirm the fee and refund terms before paying.',
        refundableInfo: 'Refund terms depend on the provider; confirm before payment',
      },
      {
        stageNumber: 2,
        title: 'First-year Tuition & Insurance',
        timeline: 'Month 1 - 2',
        inrEstimate: '₹12.7 - 20 Lakhs (approx.)',
        officialCost: 'NZD $22,000 - $35,000 tuition + provider-quoted insurance',
        paidTo: 'Approved education provider / insurer',
        description: 'Tuition range follows this site’s country guidance; exact fees and insurance come from the provider offer.',
        refundableInfo: 'Provider and insurer refund terms vary',
      },
      {
        stageNumber: 3,
        title: 'Living Funds Evidence',
        timeline: 'Month 2',
        inrEstimate: '₹0 transfer; show funds of about ₹11.2 Lakhs',
        officialCost: 'NZD $20,000 per year or $1,667 per month for shorter study',
        paidTo: 'Your own funds or an acceptable sponsor',
        description: 'This is evidence of accessible living funds, not tuition or a payment to an agent. Prepaid accommodation may affect the amount under INZ rules.',
        refundableInfo: 'Funds remain available to you; they are not paid to the agency',
      },
      {
        stageNumber: 4,
        title: 'Fee Paying Student Visa',
        timeline: 'Month 3',
        inrEstimate: 'From about ₹47,600 (approx.)',
        officialCost: 'From NZD $850 (Immigration New Zealand)',
        paidTo: 'Immigration New Zealand online portal',
        description: 'Official Fee Paying Student Visa application charge; confirm the amount shown for your application before payment.',
        refundableInfo: 'Check INZ refund rules for your application before paying',
      },
    ],
  },
  {
    slug: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    headline: 'First-year Tuition + School-specific Financial Evidence',
    totalEstimateINR: '₹31 - 62 Lakhs (estimated)',
    officialRuleNote: 'Planning range, not a federal minimum. A school records its tuition, living and other costs on Form I-20; the amount depends on the school and programme. F-1 visa application fee is US$185 and the separate I-901 SEVIS fee is US$350. INR uses roughly ₹96 per USD; living-fund evidence is not itself a payment, and actual exchange rates/provider fees vary. School insurance and travel are additional.',
    officialSources: [
      { label: 'U.S. Department of State student visa fees', url: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html' },
      { label: 'ICE Form I-901 fee', url: 'https://www.ice.gov/doclib/sevis/pdf/i901.pdf' },
      { label: 'DHS Study in the States: Form I-20 costs', url: 'https://studyinthestates.dhs.gov/assets/pdf/SEVP_SingleSheetTrainingAids_2402425_BW.pdf' },
    ],
    stages: [
      {
        stageNumber: 1,
        title: 'School Applications',
        timeline: 'Month 0 - 1',
        inrEstimate: '₹0 - ₹48,000 (approx.)',
        officialCost: 'US$0 - $500 (school-dependent estimate)',
        paidTo: 'College / university application portals',
        description: 'Application fees vary by school; check each school’s current fee and waiver policy.',
        refundableInfo: 'Refund terms depend on the school',
      },
      {
        stageNumber: 2,
        title: 'First-year Tuition',
        timeline: 'Month 1 - 2',
        inrEstimate: '₹19.2 - 43.2 Lakhs (approx.)',
        officialCost: 'US$20,000 - $45,000 (planning range; school quote controls)',
        paidTo: 'College / university',
        description: 'Indicative range from this site’s country guidance. Health insurance and other school charges may be additional.',
        refundableInfo: 'School refund terms vary; confirm them before paying',
      },
      {
        stageNumber: 3,
        title: 'Living-cost Financial Evidence',
        timeline: 'Month 2',
        inrEstimate: '₹0 transfer; budget about ₹11.5 - 17.3 Lakhs',
        officialCost: 'US$12,000 - $18,000 / year (planning estimate, not a government minimum)',
        paidTo: 'Your own funds or accepted sponsor',
        description: 'Use the cost figures and financial evidence requested by the school for your Form I-20; actual costs vary by location and programme.',
        refundableInfo: 'Funds evidence is not a payment to the agency',
      },
      {
        stageNumber: 4,
        title: 'F-1 Visa + I-901 SEVIS Fees',
        timeline: 'Month 3',
        inrEstimate: 'About ₹51,360 (approx.)',
        officialCost: 'US$185 visa application + US$350 I-901 SEVIS',
        paidTo: 'U.S. visa application and FMJfee.com portals',
        description: 'The visa application fee and SEVIS fee are separate charges. Confirm current fee instructions before payment.',
        refundableInfo: 'U.S. visa application fee is non-refundable; check I-901 rules before paying',
      },
    ],
  },
]

const newlySupportedCashflowSlugs = new Set(['new-zealand', 'usa'])

export function mergeNewCashflowDestinations(savedData: CountryCashflow[]): CountryCashflow[] {
  const savedSlugs = new Set(savedData.map((country) => country.slug))
  const missingDestinations = defaultCashflowData.filter(
    (country) => newlySupportedCashflowSlugs.has(country.slug) && !savedSlugs.has(country.slug),
  )
  return [...savedData, ...missingDestinations]
}
