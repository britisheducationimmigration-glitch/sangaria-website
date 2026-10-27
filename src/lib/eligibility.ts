import type { EligibilityRules, Goal } from '@/data/eligibility-rules'

export type Answers = Record<string, string>

export function factorsFor(rules: EligibilityRules, goal: Goal) {
  return rules.factors.filter((f) => f.goals.includes(goal))
}

export function evaluate(rules: EligibilityRules, goal: Goal, answers: Answers) {
  const factors = factorsFor(rules, goal)
  let earned = 0
  let max = 0
  const pointsById: Record<string, number> = {}

  for (const f of factors) {
    const top = Math.max(...f.options.map((o) => o.points))
    max += top
    const picked = f.options.find((o) => o.value === answers[f.id])
    const pts = picked?.points ?? 0
    pointsById[f.id] = pts
    earned += pts
  }

  const score = max === 0 ? 0 : Math.round((earned / max) * 100)
  const band = rules.bands.find((b) => score >= b.min) ?? rules.bands[rules.bands.length - 1]

  const countries = rules.countries
    .filter((c) => c.minScore[goal] !== undefined)
    .map((c) => {
      const min = c.minScore[goal]!
      const unmet = Object.entries(c.minFactor ?? {})
        .filter(([id]) => factors.some((f) => f.id === id))
        .filter(([id, need]) => (pointsById[id] ?? 0) < (need ?? 0))
        .map(([id]) => factors.find((f) => f.id === id)!.label)
      const eligible = score >= min && unmet.length === 0
      return { ...c, min, eligible, unmet, gap: Math.max(0, min - score) }
    })
    .sort((a, b) => Number(b.eligible) - Number(a.eligible) || a.gap - b.gap)

  return { score, earned, max, band, countries }
}
