import { timingSafeEqual } from 'node:crypto'
import { Buffer } from 'node:buffer'

export function validCronAuthorization(value: string | null, secret: string) {
  if (!secret || !value) return false
  const actual = Buffer.from(value), expected = Buffer.from('Bearer ' + secret)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
