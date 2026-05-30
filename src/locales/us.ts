import { nthWeekdayOfMonth, lastWeekdayOfMonth, observed } from '../helpers'
import { Locale } from '../types'

/**
 * US federal holidays.
 * When a holiday falls on Saturday it is observed Friday; Sunday → Monday.
 * This locale applies the observed date (not the calendar date).
 */
function fixed(month: number, day: number, name: string) {
  return {
    type: 'computed' as const,
    name,
    fn: (year: number) => observed(new Date(year, month - 1, day)),
  }
}

export const US: Locale = {
  name: 'us',
  rules: [
    fixed(1, 1, "New Year's Day"),
    {
      type: 'computed',
      name: 'Martin Luther King Jr. Day',
      fn: (year) => nthWeekdayOfMonth(year, 1, 1, 3),
    },
    {
      type: 'computed',
      name: "Presidents' Day",
      fn: (year) => nthWeekdayOfMonth(year, 2, 1, 3),
    },
    {
      type: 'computed',
      name: 'Memorial Day',
      fn: (year) => lastWeekdayOfMonth(year, 5, 1),
    },
    fixed(6, 19, 'Juneteenth'),
    fixed(7, 4, 'Independence Day'),
    {
      type: 'computed',
      name: 'Labor Day',
      fn: (year) => nthWeekdayOfMonth(year, 9, 1, 1),
    },
    {
      type: 'computed',
      name: 'Columbus Day',
      fn: (year) => nthWeekdayOfMonth(year, 10, 1, 2),
    },
    fixed(11, 11, 'Veterans Day'),
    {
      type: 'computed',
      name: 'Thanksgiving Day',
      fn: (year) => nthWeekdayOfMonth(year, 11, 4, 4),
    },
    fixed(12, 25, 'Christmas Day'),
  ],
}
