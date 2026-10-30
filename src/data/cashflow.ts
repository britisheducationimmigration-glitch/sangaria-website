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
    headline: 'Blocked Account (Sperrkonto) + Public University (Free Tuition)',
    totalEstimateINR: '₹13 - 15 Lakhs',
    officialRuleNote: 'Public universities have 0 tuition fee! Only blocked account living cost is required.',
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
        inrEstimate: '₹0 (Zero Tuition in Public Unis)',
        officialCost: '€150 - €350 Semester Contribution',
        paidTo: 'University Student Union',
        description: 'Public German universities charge zero tuition. Only semester ticket fee is paid.',
        refundableInfo: 'Direct public subsidy benefit',
      },
      {
        stageNumber: 3,
        title: 'Blocked Account (Sperrkonto)',
        timeline: 'Month 3',
        inrEstimate: '₹11,50,000 - ₹12,20,000',
        officialCost: '€11,904 (Annual living guarantee)',
        paidTo: 'Expatrio / Fintiba / Coracle Account',
        description: 'Deposited into student’s own German blocked account, withdrawn monthly in Germany.',
        refundableInfo: '100% Refundable to Indian bank account on visa refusal',
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
]
