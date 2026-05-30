import { countBizDays, addBizDays, isBizDay, getHoliday, rangeBizDays } from './engine'
import { BizDaysOptions, BizDaysResult, DateInput, HolidayDate, RangeEntry } from './types'

interface BizDaysFn {
  (from: DateInput, to: DateInput, options?: BizDaysOptions): BizDaysResult
  add(from: DateInput, days: number, options?: BizDaysOptions): string
  isBizDay(date: DateInput, options?: BizDaysOptions): boolean
  getHoliday(date: DateInput, options?: BizDaysOptions): HolidayDate | null
  range(from: DateInput, to: DateInput, options?: BizDaysOptions): RangeEntry[]
}

const bizDays = ((
  from: DateInput,
  to: DateInput,
  options?: BizDaysOptions,
): BizDaysResult => countBizDays(from, to, options)) as BizDaysFn

bizDays.add = addBizDays
bizDays.isBizDay = isBizDay
bizDays.getHoliday = getHoliday
bizDays.range = rangeBizDays

export { bizDays }
export { combineLocales } from './helpers'
export type { BizDaysOptions, BizDaysResult, DateInput, HolidayDate, RangeEntry, Locale, HolidayRule } from './types'
