export type PolicyWatchKind = 'confirmed' | 'monitor' | 'proposal'
export type PolicyWatchItem = {
  id: string
  destination: string
  title: string
  kind: PolicyWatchKind
  effectiveDate?: string
  timeZone?: string
  summary: string
  action: string
  sourceLabel: string
  sourceUrl: string
}

export const policyWatchItems: PolicyWatchItem[] = [
  {
    id: 'nz-student-rules-2026-10-27',
    destination: 'New Zealand',
    title: 'Student visa work rights and post-course visa period',
    kind: 'confirmed',
    effectiveDate: '2026-10-27',
    timeZone: 'Pacific/Auckland',
    summary: 'For new student visa applications from 27 October 2026, new master’s-by-research students no longer receive unlimited in-study work rights; new master’s students have the same 25-hour weekly limit and full-time holiday work conditions. INZ also made English ability an explicit factor in meeting visa conditions, broadened processing suspension grounds, and extended the applicable post-course period from 1 to 2 months (the 31 March expiry date remains).',
    action: 'Public NZ guidance now reflects these changes. Check visa conditions and course-specific exceptions against INZ.',
    sourceLabel: 'Immigration New Zealand: changes to student visas',
    sourceUrl: 'https://www.immigration.govt.nz/about-us/news-centre/changes-to-student-visas/',
  },
  {
    id: 'au-student-rules-2026-10-02',
    destination: 'Australia',
    title: 'Student visa in-country applications and family members',
    kind: 'confirmed',
    effectiveDate: '2026-10-02',
    timeZone: 'Australia/Canberra',
    summary: 'Changes to Student visa subclass 500 and Student Guardian subclass 590 affect who may apply for or be granted a visa while in Australia, and whether family can be included or join later.',
    action: 'Country guidance flags the change. Direct applicants to the current Home Affairs decision tree for their circumstances.',
    sourceLabel: 'Australian Department of Home Affairs: changes to student visa rules',
    sourceUrl: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/changes-to-student-visa-application-rules-500-590',
  },
  {
    id: 'uk-student-funds-2026-11-30',
    destination: 'United Kingdom',
    title: 'Student visa maintenance funds increase',
    kind: 'confirmed',
    effectiveDate: '2026-11-30',
    timeZone: 'Europe/London',
    summary: 'Monthly funds rise from £1,529 to £1,570 in London and from £1,171 to £1,203 outside London, for up to 9 months. The linked rule also raises the maximum accommodation-deposit offset to £1,570. Applications made before 30 November are decided under the rules in force on 29 November.',
    action: 'The website shows the current amounts and scheduled figures before the effective date, then switches the country guide, comparison, visa snapshot and public cashflow planner to the new amounts automatically on the effective date.',
    sourceLabel: 'GOV.UK: Immigration Rules statement HC 584',
    sourceUrl: 'https://www.gov.uk/government/publications/statement-of-changes-to-the-immigration-rules-hc-584-3-september-2026/statement-of-changes-to-the-immigration-rules-hc-584-3-september-2026-accessible',
  },
  {
    id: 'uk-graduate-route-2027-01-01',
    destination: 'United Kingdom',
    title: 'Graduate Route duration changes by application date',
    kind: 'confirmed',
    effectiveDate: '2027-01-01',
    timeZone: 'Europe/London',
    summary: 'The published GOV.UK rule says 18 months for applications made on or after 1 January 2027, 2 years for earlier applications, and 3 years for eligible doctoral graduates.',
    action: 'This cutoff is already included in the country guide. Recheck official rules before the date because the 2026 Budget has separately announced a possible 2-year duration for graduates from qualifying universities, with implementation details still pending.',
    sourceLabel: 'GOV.UK: Graduate visa',
    sourceUrl: 'https://www.gov.uk/graduate-visa',
  },
  {
    id: 'canada-study-target-2027',
    destination: 'Canada',
    title: '2027 international student intake planning',
    kind: 'monitor',
    summary: 'IRCC’s 2026–2028 plan sets a target of 150,000 new international student arrivals for 2027. This is a planning target, not the detailed study-permit application cap or a provincial/DLI allocation.',
    action: 'Wait for IRCC’s 2027 cap and provincial allocation notice before publishing an exact application-cap figure.',
    sourceLabel: 'IRCC 2026–27 Departmental Plan',
    sourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/departmental-plans/2026-27-departmental-plan/departmental-plan-2026-2027-full.html',
  },
  {
    id: 'uk-english-settlement-2027-03-26',
    destination: 'United Kingdom',
    title: 'CEFR B2 English for settlement on specified routes',
    kind: 'confirmed',
    effectiveDate: '2027-03-26',
    timeZone: 'Europe/London',
    summary: 'The Immigration Rules raise the speaking and listening English standard to CEFR B2 for settlement applications on specified routes, including Skilled Worker. This is a settlement-rule change, not a general Student visa admission-English change.',
    action: 'Review work-route and settlement copy separately; do not apply this threshold to the Student route.',
    sourceLabel: 'GOV.UK: Immigration Rules statement HC 1691',
    sourceUrl: 'https://www.gov.uk/government/publications/statement-of-changes-to-the-immigration-rules-hc-1619-5-march-2026/statement-of-changes-to-the-immigration-rules-hc-1691-5-march-2026-accessible-version',
  },
  {
    id: 'nz-green-list-2027-03-08',
    destination: 'New Zealand',
    title: 'Green List occupation changes',
    kind: 'confirmed',
    effectiveDate: '2027-03-08',
    timeZone: 'Pacific/Auckland',
    summary: 'INZ has announced Green List changes for Work to Residence occupations. They affect occupation-based residence pathways, not the general student visa or Post Study Work Visa rules.',
    action: 'Review any occupation-based residence or skilled-migration claims; keep them separate from student visa eligibility.',
    sourceLabel: 'Immigration New Zealand: Green List changes',
    sourceUrl: 'https://www.immigration.govt.nz/about-us/news-centre/changes-to-the-green-list-from-march-2027/',
  },
  {
    id: 'uk-budget-2026-immigration',
    destination: 'United Kingdom',
    title: '2026 Budget announcements awaiting detailed rules',
    kind: 'proposal',
    summary: 'The Budget announced planned Skilled Worker salary-threshold changes from Spring 2027, an expanded High Potential Individual list, and a 2-year Graduate visa duration for graduates of qualifying universities. Detailed route criteria and effective dates are not yet published.',
    action: 'Keep the live guidance on existing rules until Immigration Rules or official route guidance confirms exact eligibility and start dates.',
    sourceLabel: 'GOV.UK: Budget 2026',
    sourceUrl: 'https://www.gov.uk/government/publications/budget-2026-document/budget-2026-html',
  },
  {
    id: 'germany-student-funds-2027',
    destination: 'Germany',
    title: '2027 student proof-of-funds amount',
    kind: 'monitor',
    summary: 'The official study guidance currently lists €11,904 for a 12-month admitted-student visa in 2026 and €1,091/month for the separate university-place-search route. No 2027 study-funds amount was confirmed in the official source reviewed on 3 November 2026.',
    action: 'Do not forecast an increase. Recheck the Federal Foreign Office and Make it in Germany before publishing 2027 figures.',
    sourceLabel: 'Make it in Germany: visa for studying',
    sourceUrl: 'https://www.make-it-in-germany.com/en/visa-recognition/visa-types/studying',
  },
]

function dateInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

export function getPolicyWatchStatus(item: PolicyWatchItem, now = new Date()) {
  if (!item.effectiveDate) return item.kind === 'confirmed' ? 'Confirmed · details to monitor' : item.kind === 'proposal' ? 'Announced · details pending' : 'Monitor official update'
  const today = dateInTimeZone(now, item.timeZone ?? 'Asia/Kolkata')
  return today < item.effectiveDate ? 'Upcoming · confirmed' : 'Effective'
}

export function getUKStudentMaintenance(asOf = new Date()) {
  const effectiveDate = '2026-11-30'
  const isEffective = dateInTimeZone(asOf, 'Europe/London') >= effectiveDate
  return {
    effectiveDate,
    isEffective,
    outsideLondon: isEffective ? 1203 : 1171,
    london: isEffective ? 1570 : 1529,
  }
}


export function applyScheduledCountryPolicy<T extends {
  slug: string
  costs: { label: string; value: string }[]
  studyGuide?: { lastVerified: string; proofOfFunds: string }
}>(country: T, asOf = new Date()): T {
  if (country.slug !== 'uk') return country
  const figures = getUKStudentMaintenance(asOf)
  const newOutside = `£${figures.outsideLondon.toLocaleString('en-GB')} / month`
  const nextNote = figures.isEffective ? '' : ' (up to 29 Nov; £1,203 from 30 Nov)'
  return {
    ...country,
    costs: country.costs.map((item) => item.label === 'Student living funds, outside London (up to 9 months)'
      ? { ...item, value: newOutside + nextNote }
      : item),
    studyGuide: country.studyGuide
      ? {
          ...country.studyGuide,
          proofOfFunds: getUKStudentMaintenanceCopy(asOf),
        }
      : country.studyGuide,
  }
}

export function applyScheduledVisaPolicy<T extends { lastVerified: string; requirements: string[] }>(
  destination: string,
  guidance: T,
  asOf = new Date(),
): T {
  if (destination !== 'uk') return guidance
  return {
    ...guidance,
    requirements: guidance.requirements.map((item) => item.startsWith('Student:')
      ? item.replace(
          'GOV.UK lists living funds of £1,171 per month outside London or £1,529 in London, for up to 9 months; exemptions and personal circumstances apply.',
          getUKStudentMaintenanceCopy(asOf),
        )
      : item),
  }
}

export function applyScheduledCashflowPolicy<T extends {
  slug: string
  officialRuleNote: string
  stages: { stageNumber: number; officialCost: string }[]
}>(country: T, asOf = new Date()): T {
  if (country.slug !== 'uk') return country
  const figures = getUKStudentMaintenance(asOf)
  const stageThree = figures.isEffective
    ? `£${(figures.outsideLondon * 9).toLocaleString('en-GB')} - £${(figures.london * 9).toLocaleString('en-GB')} Living proof`
    : `£${(figures.outsideLondon * 9).toLocaleString('en-GB')} - £${(figures.london * 9).toLocaleString('en-GB')} Living proof (from 30 Nov: £10,827 - £14,130)`
  const before = country.officialRuleNote.replace(/\s*Student visa funds snapshot:.*$/, '')
  const current = `£${figures.outsideLondon.toLocaleString('en-GB')}/month outside London and £${figures.london.toLocaleString('en-GB')}/month in London`
  const note = figures.isEffective
    ? `Student visa funds snapshot: ${current} for up to 9 months, plus course fees.`
    : `Student visa funds snapshot: ${current} through 29 November; from 30 November 2026 the figures become £1,203/month outside London and £1,570/month in London, for up to 9 months, plus course fees.`
  return {
    ...country,
    officialRuleNote: `${before.trim()} ${note}`.trim(),
    stages: country.stages.map((stage) => stage.stageNumber === 3
      ? { ...stage, officialCost: stageThree }
      : stage),
  }
}

export function getUKStudentMaintenanceCopy(asOf = new Date()) {
  const figures = getUKStudentMaintenance(asOf)
  if (figures.isEffective) {
    return `£${figures.outsideLondon.toLocaleString('en-GB')}/month outside London or £${figures.london.toLocaleString('en-GB')}/month in London, for up to 9 months, plus course fees. Applications made before 30 November 2026 are assessed under the rules in force on 29 November; exemptions and individual circumstances apply.`
  }
  return `£${figures.outsideLondon.toLocaleString('en-GB')}/month outside London or £${figures.london.toLocaleString('en-GB')}/month in London, for up to 9 months, plus course fees. From 30 November 2026 the amounts become £1,203 outside London and £1,570 in London per month. Applications made before that date are assessed under the rules in force on 29 November; exemptions and individual circumstances apply.`
}
