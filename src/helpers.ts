export { easter, addDays } from './easter'
import type { Locale } from './types'

/**
 * Merges two or more locales into one.
 * Use this to layer regional holidays on top of a national base locale.
 *
 * @example
 * // São Paulo state holidays on top of Brazilian nationals
 * const SP = combineLocales(BR, { name: 'sp', rules: [...] })
 */
export function combineLocales(...locales: Locale[]): Locale {
  return {
    name: locales.map((l) => l.name).join('+'),
    rules: locales.flatMap((l) => l.rules),
  }
}

/**
 * Returns the Nth occurrence of a given weekday within a month.
 *
 * @param year    Full year (e.g. 2025)
 * @param month   Month, 1-indexed (1 = January)
 * @param weekday Day of week: 0 = Sunday … 6 = Saturday
 * @param n       Which occurrence (1 = first, 2 = second, …)
 *
 * @example
 * // US Labor Day: 1st Monday of September
 * nthWeekdayOfMonth(2025, 9, 1, 1) // → 2025-09-01
 *
 * // US Thanksgiving: 4th Thursday of November
 * nthWeekdayOfMonth(2025, 11, 4, 4) // → 2025-11-27
 */
export function nthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  n: number,
): Date {
  const date = new Date(year, month - 1, 1)
  let count = 0
  while (true) {
    if (date.getDay() === weekday) {
      count++
      if (count === n) return new Date(date)
    }
    date.setDate(date.getDate() + 1)
  }
}

/**
 * Returns the last occurrence of a given weekday within a month.
 *
 * @param year    Full year (e.g. 2025)
 * @param month   Month, 1-indexed
 * @param weekday Day of week: 0 = Sunday … 6 = Saturday
 *
 * @example
 * // US Memorial Day: last Monday of May
 * lastWeekdayOfMonth(2025, 5, 1) // → 2025-05-26
 */
export function lastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  const date = new Date(year, month, 0) // day 0 = last day of `month`
  while (date.getDay() !== weekday) date.setDate(date.getDate() - 1)
  return date
}

/**
 * Shifts a fixed calendar date to its observed weekday when it falls on a weekend.
 * Saturday → previous Friday. Sunday → next Monday.
 * Use this for locales that follow the "observed holiday" convention (e.g. US federal).
 */
export function observed(date: Date): Date {
  const dow = date.getDay()
  if (dow === 6) return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)
  if (dow === 0) return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  return date
}
