import { bizDays } from '../src/index'
import { BR } from '../src/locales/br'

describe('bizDays() – count', () => {
  test('same day (business day) → 1', () => {
    expect(bizDays('2025-01-02', '2025-01-02').count).toBe(1)
  })

  test('same day (Saturday) → 0', () => {
    expect(bizDays('2025-01-04', '2025-01-04').count).toBe(0)
  })

  test('from > to → 0', () => {
    expect(bizDays('2025-01-10', '2025-01-01').count).toBe(0)
  })

  test('full week Mon-Fri → 5', () => {
    // 2025-01-06 Monday → 2025-01-10 Friday
    expect(bizDays('2025-01-06', '2025-01-10').count).toBe(5)
  })

  test('Mon-Sun includes weekend → 5', () => {
    expect(bizDays('2025-01-06', '2025-01-12').count).toBe(5)
  })

  test('custom weekendDays (Mon-Fri work week, Sat+Sun off)', () => {
    expect(bizDays('2025-01-06', '2025-01-10', { weekendDays: [0, 6] }).count).toBe(5)
  })

  test('custom weekendDays: only Sunday off', () => {
    // Mon–Sat = 6 business days in a Mon-Sun range
    expect(bizDays('2025-01-06', '2025-01-12', { weekendDays: [0] }).count).toBe(6)
  })

  test('holiday on weekday is excluded from count', () => {
    // 2025-01-01 (New Year) is a Wednesday
    const result = bizDays('2025-01-01', '2025-01-01', { locale: BR })
    expect(result.count).toBe(0)
    expect(result.holidays).toHaveLength(1)
    expect(result.holidays[0].name).toBe('Confraternização Universal')
  })

  test('january 2025 with BR locale', () => {
    // Jan 2025: 23 weekdays, minus 1 (Jan 1 holiday) = 22
    const result = bizDays('2025-01-01', '2025-01-31', { locale: BR })
    expect(result.count).toBe(22)
    expect(result.holidays).toHaveLength(1)
  })

  test('no locale → holidays ignored', () => {
    // Jan 2025 plain weekdays = 23
    expect(bizDays('2025-01-01', '2025-01-31').count).toBe(23)
  })
})

describe('bizDays() – holidays list', () => {
  test('returns holidays sorted by date', () => {
    const result = bizDays('2025-04-01', '2025-04-30', { locale: BR })
    const dates = result.holidays.map((h) => h.date)
    expect(dates).toEqual([...dates].sort())
  })

  test('Apr 2025: Tiradentes (21) + Good Friday (18)', () => {
    const result = bizDays('2025-04-01', '2025-04-30', { locale: BR })
    const names = result.holidays.map((h) => h.name)
    expect(names).toContain('Tiradentes')
    expect(names).toContain('Sexta-feira Santa')
  })
})

describe('bizDays.add()', () => {
  test('add 0 → same date', () => {
    expect(bizDays.add('2025-01-06', 0)).toBe('2025-01-06')
  })

  test('add 1 from Monday → Tuesday', () => {
    expect(bizDays.add('2025-01-06', 1)).toBe('2025-01-07')
  })

  test('add 1 from Friday → Monday (skip weekend)', () => {
    expect(bizDays.add('2025-01-10', 1)).toBe('2025-01-13')
  })

  test('add 5 from Monday → next Monday', () => {
    expect(bizDays.add('2025-01-06', 5)).toBe('2025-01-13')
  })

  test('add negative (subtract)', () => {
    expect(bizDays.add('2025-01-13', -5)).toBe('2025-01-06')
  })

  test('add 1 from Thursday before Good Friday (BR) → Monday', () => {
    // 2025 Good Friday = Apr 18 (Fri). Apr 17 Thu + 1 biz = Apr 22 Tue
    // Apr 18 is holiday, Apr 19-20 weekend → next is Apr 22 Tue?
    // Wait: Apr 17 Thu → next biz day skipping Apr 18 (holiday) and Apr 19-20 (weekend) = Apr 21 Mon
    // But Apr 21 = Tiradentes (holiday) → Apr 22 Tue
    expect(bizDays.add('2025-04-17', 1, { locale: BR })).toBe('2025-04-22')
  })

  test('add 1 skips holidays', () => {
    // 2025-01-01 Wed (New Year) → next biz day = 2025-01-02 Thu
    expect(bizDays.add('2024-12-31', 1, { locale: BR })).toBe('2025-01-02')
  })
})

describe('bizDays.isBizDay()', () => {
  test('Monday is a biz day', () => {
    expect(bizDays.isBizDay('2025-01-06')).toBe(true)
  })

  test('Saturday is not a biz day', () => {
    expect(bizDays.isBizDay('2025-01-04')).toBe(false)
  })

  test('holiday is not a biz day', () => {
    expect(bizDays.isBizDay('2025-01-01', { locale: BR })).toBe(false)
  })

  test('regular weekday (no locale) is always biz day', () => {
    expect(bizDays.isBizDay('2025-01-01')).toBe(true)
  })
})

describe('bizDays.getHoliday()', () => {
  test('holiday returns info', () => {
    const h = bizDays.getHoliday('2025-01-01', { locale: BR })
    expect(h).not.toBeNull()
    expect(h!.name).toBe('Confraternização Universal')
  })

  test('regular day returns null', () => {
    expect(bizDays.getHoliday('2025-01-02', { locale: BR })).toBeNull()
  })

  test('no locale always returns null', () => {
    expect(bizDays.getHoliday('2025-01-01')).toBeNull()
  })
})
