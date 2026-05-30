import { BizDaysOptions, BizDaysResult, DateInput, HolidayDate, Locale, RangeEntry } from './types'

export function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function normalize(input: DateInput): string {
  return typeof input === 'string' ? input : toDateString(input)
}

function buildHolidayMap(year: number, locale: Locale): Map<string, string> {
  const map = new Map<string, string>()
  for (const rule of locale.rules) {
    if (rule.type === 'fixed') {
      const date = new Date(year, rule.month - 1, rule.day)
      map.set(toDateString(date), rule.name)
    } else {
      const date = rule.fn(year)
      map.set(toDateString(date), rule.name)
    }
  }
  return map
}

class HolidayCache {
  private cache = new Map<number, Map<string, string>>()

  constructor(private locale: Locale | undefined) {}

  get(year: number): Map<string, string> {
    if (!this.locale) return new Map()
    if (!this.cache.has(year)) {
      this.cache.set(year, buildHolidayMap(year, this.locale))
    }
    return this.cache.get(year)!
  }
}

/**
 * Count business days between two dates (inclusive on both ends).
 * Holidays that fall on weekdays are excluded from the count and returned separately.
 */
export function countBizDays(
  from: DateInput,
  to: DateInput,
  options: BizDaysOptions = {},
): BizDaysResult {
  const weekendSet = new Set(options.weekendDays ?? [0, 6])
  const holidays = new HolidayCache(options.locale)

  const start = parseDate(normalize(from))
  const end = parseDate(normalize(to))

  if (start > end) return { count: 0, holidays: [] }

  let count = 0
  const hitHolidays: HolidayDate[] = []
  const seenDates = new Set<string>()

  const cursor = new Date(start)
  while (cursor <= end) {
    if (!weekendSet.has(cursor.getDay())) {
      const dateStr = toDateString(cursor)
      const holidayName = holidays.get(cursor.getFullYear()).get(dateStr)
      if (holidayName) {
        if (!seenDates.has(dateStr)) {
          hitHolidays.push({ date: dateStr, name: holidayName })
          seenDates.add(dateStr)
        }
      } else {
        count++
      }
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  return { count, holidays: hitHolidays }
}

/**
 * Add (or subtract, if negative) business days to a date.
 * Returns the resulting date as a YYYY-MM-DD string.
 * The starting date itself is never counted — only forward/backward steps.
 */
export function addBizDays(
  from: DateInput,
  days: number,
  options: BizDaysOptions = {},
): string {
  const fromStr = normalize(from)
  if (days === 0) return fromStr

  const weekendSet = new Set(options.weekendDays ?? [0, 6])
  const holidayCache = new HolidayCache(options.locale)
  const direction = days > 0 ? 1 : -1
  let remaining = Math.abs(days)

  const cursor = parseDate(fromStr)
  while (remaining > 0) {
    cursor.setDate(cursor.getDate() + direction)
    if (!weekendSet.has(cursor.getDay())) {
      const dateStr = toDateString(cursor)
      if (!holidayCache.get(cursor.getFullYear()).has(dateStr)) {
        remaining--
      }
    }
  }

  return toDateString(cursor)
}

/**
 * Returns true if the given date falls on a weekend or a holiday in the locale.
 */
export function isBizDay(date: DateInput, options: BizDaysOptions = {}): boolean {
  const dateStr = normalize(date)
  const weekendSet = new Set(options.weekendDays ?? [0, 6])
  const d = parseDate(dateStr)
  if (weekendSet.has(d.getDay())) return false
  const holidayCache = new HolidayCache(options.locale)
  return !holidayCache.get(d.getFullYear()).has(dateStr)
}

/**
 * Returns holiday info if the date is a holiday in the given locale, otherwise null.
 */
export function getHoliday(
  date: DateInput,
  options: BizDaysOptions = {},
): HolidayDate | null {
  if (!options.locale) return null
  const dateStr = normalize(date)
  const d = parseDate(dateStr)
  const holidayCache = new HolidayCache(options.locale)
  const name = holidayCache.get(d.getFullYear()).get(dateStr)
  return name ? { date: dateStr, name } : null
}

/**
 * Returns one entry per calendar day in [from, to] (inclusive), each classified as
 * 'bizday', 'weekend', or 'holiday'. Useful for rendering calendars.
 */
export function rangeBizDays(
  from: DateInput,
  to: DateInput,
  options: BizDaysOptions = {},
): RangeEntry[] {
  const weekendSet = new Set(options.weekendDays ?? [0, 6])
  const holidayCache = new HolidayCache(options.locale)

  const start = parseDate(normalize(from))
  const end = parseDate(normalize(to))
  const entries: RangeEntry[] = []

  const cursor = new Date(start)
  while (cursor <= end) {
    const dateStr = toDateString(cursor)
    if (weekendSet.has(cursor.getDay())) {
      entries.push({ date: dateStr, type: 'weekend' })
    } else {
      const holidayName = holidayCache.get(cursor.getFullYear()).get(dateStr)
      if (holidayName) {
        entries.push({ date: dateStr, type: 'holiday', name: holidayName })
      } else {
        entries.push({ date: dateStr, type: 'bizday' })
      }
    }
    cursor.setDate(cursor.getDate() + 1)
  }

  return entries
}
