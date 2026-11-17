export function dateOnly(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  const text = String(value ?? '')
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10)
  const parsed = new Date(text)
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString().slice(0, 10)
}
