import '@tanstack/react-start/server-only'

import { countries, getCurrentCountry, type Country } from '@/data/fixtures'
import { applyScheduledVisaPolicy, type VisaGuidance } from '@/data/policy-watch'
import { visaGuidance } from '@/data/visa-guidance'
import { execute, queryRows } from './db.server'

export type CountryPageContent = {
  country: Country
  guidance: VisaGuidance
}

export type CountryCatalogState = {
  published: Record<string, CountryPageContent>
  drafts: Record<string, CountryPageContent>
}

function currentDeploymentEnvironment() {
  if (process.env.VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'preview') return process.env.VERCEL_ENV
  return 'development'
}

function parseState(value: unknown): CountryCatalogState {
  let parsed = value
  if (typeof parsed === 'string') {
    try { parsed = JSON.parse(parsed) as unknown } catch { parsed = null }
  }
  if (!parsed || typeof parsed !== 'object') return { published: {}, drafts: {} }
  const input = parsed as Record<string, unknown>
  return {
    published: input.published && typeof input.published === 'object' ? input.published as Record<string, CountryPageContent> : {},
    drafts: input.drafts && typeof input.drafts === 'object' ? input.drafts as Record<string, CountryPageContent> : {},
  }
}

function parseEnvironmentStore(value: unknown): Record<string, CountryCatalogState> {
  let parsed = value
  if (typeof parsed === 'string') {
    try { parsed = JSON.parse(parsed) as unknown } catch { parsed = null }
  }
  if (!parsed || typeof parsed !== 'object') return {}
  const input = parsed as Record<string, unknown>
  if (input.version === 1 && input.environments && typeof input.environments === 'object') {
    return input.environments as Record<string, CountryCatalogState>
  }
  if (input.published || input.drafts) return { production: parseState(input) }
  return {}
}

async function readAllEnvironments() {
  const rows = await queryRows('SELECT country_catalog_json FROM site_settings WHERE id = 1 LIMIT 1')
  return parseEnvironmentStore(rows[0]?.country_catalog_json)
}

export async function readCountryCatalogState(): Promise<CountryCatalogState> {
  const environments = await readAllEnvironments()
  return environments[currentDeploymentEnvironment()] ?? { published: {}, drafts: {} }
}

export async function writeCountryCatalogState(state: CountryCatalogState) {
  const environments = await readAllEnvironments()
  environments[currentDeploymentEnvironment()] = state
  await execute('UPDATE site_settings SET country_catalog_json = ? WHERE id = 1', [JSON.stringify({ version: 1, environments })])
}

function withScheduledGuidance(entry: CountryPageContent): CountryPageContent {
  return {
    country: getCurrentCountry(entry.country),
    guidance: applyScheduledVisaPolicy(entry.country.slug, entry.guidance),
  }
}

function defaultCountryContent(): CountryPageContent[] {
  return countries.flatMap((country) => {
    const guidance = visaGuidance[country.slug]
    return guidance ? [withScheduledGuidance({ country, guidance })] : []
  })
}

export async function getPublicCountryCatalog(): Promise<CountryPageContent[]> {
  const state = await readCountryCatalogState()
  const defaults = defaultCountryContent()
  const baseSlugs = new Set(defaults.map((entry) => entry.country.slug))
  const merged = defaults.map((entry) => withScheduledGuidance(state.published[entry.country.slug] ?? entry))
  const added = Object.entries(state.published)
    .filter(([slug]) => !baseSlugs.has(slug))
    .map(([, entry]) => withScheduledGuidance(entry))
    .sort((left, right) => left.country.name.localeCompare(right.country.name))
  return [...merged, ...added]
}

export async function getPublicCountryBySlug(slug: string) {
  const catalogue = await getPublicCountryCatalog()
  return catalogue.find((entry) => entry.country.slug === slug) ?? null
}

export async function getAdminCountryCatalog() {
  const state = await readCountryCatalogState()
  return {
    countries: await getPublicCountryCatalog(),
    drafts: Object.values(state.drafts),
    customSlugs: Object.keys(state.published).filter((slug) => !countries.some((country) => country.slug === slug)),
  }
}

export async function saveCountryDraft(content: CountryPageContent, status: 'draft' | 'published') {
  const state = await readCountryCatalogState()
  const slug = content.country.slug
  if (status === 'draft') {
    state.drafts[slug] = content
  } else {
    state.published[slug] = content
    delete state.drafts[slug]
  }
  await writeCountryCatalogState(state)
}

export async function discardCountryDraft(slug: string) {
  const state = await readCountryCatalogState()
  delete state.drafts[slug]
  await writeCountryCatalogState(state)
}

export async function revertCountryToDefault(slug: string) {
  const state = await readCountryCatalogState()
  delete state.published[slug]
  delete state.drafts[slug]
  await writeCountryCatalogState(state)
}
