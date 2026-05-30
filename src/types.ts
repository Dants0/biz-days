export type DateInput = string | Date

export interface RangeEntry {
  date: string
  type: 'bizday' | 'weekend' | 'holiday'
  name?: string
}

export interface FixedHoliday {
  type: 'fixed'
  month: number
  day: number
  name: string
}

export interface ComputedHoliday {
  type: 'computed'
  name: string
  fn: (year: number) => Date
}

export type HolidayRule = FixedHoliday | ComputedHoliday

export interface Locale {
  name: string
  rules: HolidayRule[]
}

export interface HolidayDate {
  date: string
  name: string
}

export interface BizDaysResult {
  count: number
  holidays: HolidayDate[]
}

export interface BizDaysOptions {
  locale?: Locale
  /** Days of week treated as weekend. 0 = Sunday, 6 = Saturday. Default: [0, 6] */
  weekendDays?: number[]
}
