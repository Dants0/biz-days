import { bizDays } from '../../src/index'
import { US } from '../../src/locales/us'

describe('US locale – 2025 federal holidays', () => {
  test.each([
    ['2025-01-01', "New Year's Day"],
    ['2025-01-20', 'Martin Luther King Jr. Day'],   // 3rd Monday Jan
    ['2025-02-17', "Presidents' Day"],              // 3rd Monday Feb
    ['2025-05-26', 'Memorial Day'],                 // last Monday May
    ['2025-06-19', 'Juneteenth'],
    ['2025-07-04', 'Independence Day'],
    ['2025-09-01', 'Labor Day'],                    // 1st Monday Sep
    ['2025-10-13', 'Columbus Day'],                 // 2nd Monday Oct
    ['2025-11-11', 'Veterans Day'],
    ['2025-11-27', 'Thanksgiving Day'],             // 4th Thursday Nov
    ['2025-12-25', 'Christmas Day'],
  ])('%s is %s', (date, name) => {
    const h = bizDays.getHoliday(date, { locale: US })
    expect(h).not.toBeNull()
    expect(h!.name).toBe(name)
  })

  test('July 4 2026 falls on Saturday → observed Friday Jul 3', () => {
    // Jul 4 2026 is a Saturday
    expect(bizDays.getHoliday('2026-07-03', { locale: US })?.name).toBe('Independence Day')
    expect(bizDays.getHoliday('2026-07-04', { locale: US })).toBeNull()
  })
})
