/**
 * Eligibility checker rules.
 *
 * This is the single source of truth for how the checker scores a profile.
 * Every number here (points, thresholds, minimums) is meant to be editable by
 * the business owner — a later milestone moves this object into the database
 * and exposes it in the admin panel. The scoring engine in
 * `src/lib/eligibility.ts` only reads this shape, so changing values here (or
 * in the admin later) changes results without touching code.
 */

export type Goal = 'study' | 'pr' | 'work' | 'visit'

export type FactorOption = { value: string; label: string; points: number }

export type Factor = {
  id: string
  label: string
  help?: string
  /** Goals this factor counts towards. */
  goals: Goal[]
  options: FactorOption[]
}

export type CountryRule = {
  slug: string
  name: string
  flag: string
  /** Internal screening threshold for this site's checklist score; it is not a government or visa threshold. */
  minScore: Partial<Record<Goal, number>>
  /** Internal checklist threshold on a selected factor, not a government visa requirement. */
  minFactor?: Partial<Record<string, number>>
  note?: string
}

export type ScoreBand = { min: number; label: string; tone: 'great' | 'good' | 'fair' | 'low'; message: string }

export type EligibilityRules = {
  updatedAt: string
  goals: { id: Goal; label: string; description: string }[]
  factors: Factor[]
  countries: CountryRule[]
  bands: ScoreBand[]
}

export const eligibilityRules: EligibilityRules = {
  updatedAt: '2026-10-31',
  goals: [
    { id: 'study', label: 'Study abroad', description: 'Diploma, bachelors or masters' },
    { id: 'pr', label: 'PR / Settle', description: 'Permanent residence' },
    { id: 'work', label: 'Work permit', description: 'Job-based visas' },
    { id: 'visit', label: 'Tourist / Visit', description: 'Travel or family visit' },
  ],
  factors: [
    {
      id: 'age',
      label: 'Your age',
      goals: ['study', 'pr', 'work', 'visit'],
      options: [
        { value: '17-24', label: '17 – 24', points: 20 },
        { value: '25-29', label: '25 – 29', points: 18 },
        { value: '30-34', label: '30 – 34', points: 14 },
        { value: '35-39', label: '35 – 39', points: 9 },
        { value: '40+', label: '40 +', points: 5 },
      ],
    },
    {
      id: 'education',
      label: 'Highest education',
      goals: ['study', 'pr', 'work'],
      options: [
        { value: '12th', label: 'Class 12th', points: 10 },
        { value: 'diploma', label: 'Diploma', points: 13 },
        { value: 'bachelors', label: 'Bachelors degree', points: 18 },
        { value: 'masters', label: 'Masters / PhD', points: 22 },
      ],
    },
    {
      id: 'marks',
      label: 'Marks in last qualification',
      goals: ['study'],
      options: [
        { value: '75+', label: '75% and above', points: 12 },
        { value: '60-74', label: '60 – 74%', points: 9 },
        { value: '50-59', label: '50 – 59%', points: 6 },
        { value: '<50', label: 'Below 50%', points: 2 },
      ],
    },
    {
      id: 'english',
      label: 'English test score',
      help: 'IELTS overall or PTE equivalent',
      goals: ['study', 'pr', 'work'],
      options: [
        { value: 'none', label: 'Not taken yet', points: 0 },
        { value: '5.5', label: 'IELTS 5.5 / PTE 42–49', points: 8 },
        { value: '6.0', label: 'IELTS 6.0 / PTE 50–57', points: 14 },
        { value: '6.5', label: 'IELTS 6.5 / PTE 58–64', points: 18 },
        { value: '7.0+', label: 'IELTS 7.0+ / PTE 65+', points: 24 },
      ],
    },
    {
      id: 'experience',
      label: 'Work experience',
      goals: ['pr', 'work', 'visit'],
      options: [
        { value: '0', label: 'None', points: 0 },
        { value: '1-2', label: '1 – 2 years', points: 8 },
        { value: '3-5', label: '3 – 5 years', points: 14 },
        { value: '5+', label: '5 + years', points: 18 },
      ],
    },
    {
      id: 'gap',
      label: 'Study gap',
      goals: ['study'],
      options: [
        { value: '0-1', label: '0 – 1 year', points: 10 },
        { value: '2-3', label: '2 – 3 years', points: 7 },
        { value: '4-5', label: '4 – 5 years', points: 4 },
        { value: '5+', label: 'More than 5 years', points: 1 },
      ],
    },
    {
      id: 'funds',
      label: 'Funds available (incl. loan / sponsor)',
      goals: ['study', 'pr', 'work', 'visit'],
      options: [
        { value: '<10', label: 'Below ₹10 lakh', points: 3 },
        { value: '10-20', label: '₹10 – 20 lakh', points: 9 },
        { value: '20-35', label: '₹20 – 35 lakh', points: 14 },
        { value: '35+', label: '₹35 lakh +', points: 18 },
      ],
    },
    {
      id: 'travel',
      label: 'Previous travel history',
      goals: ['visit', 'pr', 'study'],
      options: [
        { value: 'none', label: 'No international travel', points: 2 },
        { value: 'asia', label: 'Asia / Dubai / Thailand', points: 6 },
        { value: 'developed', label: 'USA / UK / Canada / Europe / Australia', points: 12 },
      ],
    },
    {
      id: 'refusal',
      label: 'Any previous visa refusal?',
      goals: ['study', 'pr', 'work', 'visit'],
      options: [
        { value: 'no', label: 'No', points: 8 },
        { value: 'one', label: 'Yes, one', points: 3 },
        { value: 'multiple', label: 'Yes, more than one', points: 0 },
      ],
    },
  ],
  countries: [
    { slug: 'canada', name: 'Canada', flag: '🇨🇦', minScore: { study: 60, pr: 72, work: 65, visit: 55 }, minFactor: { english: 14 } },
    { slug: 'uk', name: 'United Kingdom', flag: '🇬🇧', minScore: { study: 50, work: 60, visit: 50 }, note: 'English evidence depends on the course, education provider and visa route; confirm each requirement separately.' },
    { slug: 'australia', name: 'Australia', flag: '🇦🇺', minScore: { study: 58, pr: 75, work: 65, visit: 52 }, minFactor: { english: 14 } },
    { slug: 'usa', name: 'United States', flag: '🇺🇸', minScore: { study: 62, visit: 60 }, minFactor: { english: 18 } },
    { slug: 'new-zealand', name: 'New Zealand', flag: '🇳🇿', minScore: { study: 55, pr: 72, work: 62, visit: 50 }, minFactor: { english: 14 } },
    { slug: 'germany', name: 'Germany', flag: '🇩🇪', minScore: { study: 58, work: 60 }, minFactor: { education: 18 }, note: 'Academic entry requirements vary by programme; check the selected university’s official admissions rules.' },
    { slug: 'europe', name: 'Europe / Schengen', flag: '🇪🇺', minScore: { visit: 55 } },
  ],
  bands: [
    { min: 75, label: 'Many checklist factors align', tone: 'great', message: 'Your answers align with more of the selected factors in this preliminary checklist. Review the official rules for the specific route.' },
    { min: 60, label: 'Several checklist factors align', tone: 'good', message: 'Your answers align with several selected checklist factors. A full route-specific review is still needed.' },
    { min: 45, label: 'Some factors need review', tone: 'fair', message: 'Some answers fall below this site's preliminary checklist targets. Review the destination and visa-route requirements before deciding next steps.' },
    { min: 0, label: 'Review profile details', tone: 'low', message: 'This checklist found gaps in some selected profile factors. A case review may identify other information or routes to consider.' },
  ],
}
