import { bizDays, combineLocales } from '../src/index'
import { BR } from '../src/locales/br'
import type { Locale } from '../src/types'

// ─── DateInput ────────────────────────────────────────────────────────────────

describe('DateInput – accepts Date objects', () => {
  test('bizDays() with Date inputs', () => {
    const result = bizDays(new Date(2025, 0, 1), new Date(2025, 0, 31), { locale: BR })
    expect(result.count).toBe(22)
  })

  test('bizDays.add() with Date input', () => {
    // 2025-01-10 is Friday → +1 biz = Monday 2025-01-13
    expect(bizDays.add(new Date(2025, 0, 10), 1)).toBe('2025-01-13')
  })

  test('bizDays.isBizDay() with Date input', () => {
    expect(bizDays.isBizDay(new Date(2025, 0, 4))).toBe(false)  // Saturday
    expect(bizDays.isBizDay(new Date(2025, 0, 6))).toBe(true)   // Monday
  })

  test('bizDays.getHoliday() with Date input', () => {
    const h = bizDays.getHoliday(new Date(2025, 0, 1), { locale: BR })
    expect(h?.name).toBe('Confraternização Universal')
  })

  test('string and Date inputs return identical results', () => {
    const fromStr = bizDays('2025-03-01', '2025-03-31', { locale: BR })
    const fromDate = bizDays(new Date(2025, 2, 1), new Date(2025, 2, 31), { locale: BR })
    expect(fromStr).toEqual(fromDate)
  })
})

// ─── combineLocales ───────────────────────────────────────────────────────────

describe('combineLocales()', () => {
  const SP: Locale = {
    name: 'sp',
    rules: [
      { type: 'fixed', month: 1, day: 25, name: 'Aniversário de São Paulo' },
      { type: 'fixed', month: 7, day: 9,  name: 'Revolução Constitucionalista' },
    ],
  }

  const BR_SP = combineLocales(BR, SP)

  test('name is concatenated', () => {
    expect(BR_SP.name).toBe('br+sp')
  })

  test('inherits national holidays from base locale', () => {
    expect(bizDays.getHoliday('2025-01-01', { locale: BR_SP })?.name)
      .toBe('Confraternização Universal')
  })

  test('adds regional holidays', () => {
    expect(bizDays.getHoliday('2025-01-25', { locale: BR_SP })?.name)
      .toBe('Aniversário de São Paulo')
    expect(bizDays.getHoliday('2025-07-09', { locale: BR_SP })?.name)
      .toBe('Revolução Constitucionalista')
  })

  test('regional holiday reduces biz day count', () => {
    const national = bizDays('2025-01-01', '2025-01-31', { locale: BR }).count
    const regional = bizDays('2025-01-01', '2025-01-31', { locale: BR_SP }).count
    // Jan 25 is a Saturday in 2025, so count stays the same
    expect(regional).toBe(national)
  })

  test('regional holiday on weekday reduces count', () => {
    // Jul 9 2025 is a Wednesday
    const national = bizDays('2025-07-01', '2025-07-31', { locale: BR }).count
    const regional = bizDays('2025-07-01', '2025-07-31', { locale: BR_SP }).count
    expect(regional).toBe(national - 1)
  })

  test('three locales combine correctly', () => {
    const extra: Locale = { name: 'extra', rules: [{ type: 'fixed', month: 6, day: 10, name: 'Extra Day' }] }
    const combined = combineLocales(BR, SP, extra)
    expect(combined.name).toBe('br+sp+extra')
    expect(bizDays.getHoliday('2025-06-10', { locale: combined })?.name).toBe('Extra Day')
  })
})

// ─── bizDays.range() ──────────────────────────────────────────────────────────

describe('bizDays.range()', () => {
  test('returns one entry per calendar day', () => {
    // Mon 2025-01-06 → Sun 2025-01-12 = 7 days
    expect(bizDays.range('2025-01-06', '2025-01-12')).toHaveLength(7)
  })

  test('classifies business days correctly', () => {
    const entries = bizDays.range('2025-01-06', '2025-01-12')
    expect(entries[0]).toEqual({ date: '2025-01-06', type: 'bizday' })  // Mon
    expect(entries[4]).toEqual({ date: '2025-01-10', type: 'bizday' })  // Fri
  })

  test('classifies weekend days correctly', () => {
    const entries = bizDays.range('2025-01-06', '2025-01-12')
    expect(entries[5]).toEqual({ date: '2025-01-11', type: 'weekend' }) // Sat
    expect(entries[6]).toEqual({ date: '2025-01-12', type: 'weekend' }) // Sun
  })

  test('classifies holidays correctly', () => {
    const entries = bizDays.range('2025-01-01', '2025-01-03', { locale: BR })
    expect(entries[0]).toEqual({ date: '2025-01-01', type: 'holiday', name: 'Confraternização Universal' })
    expect(entries[1]).toEqual({ date: '2025-01-02', type: 'bizday' })
    expect(entries[2]).toEqual({ date: '2025-01-03', type: 'bizday' })
  })

  test('holiday on weekend has type weekend (not holiday)', () => {
    // Find a holiday that falls on a weekend in 2025
    // Nov 15 2025 (Proclamação da República) is a Saturday
    const entries = bizDays.range('2025-11-15', '2025-11-15', { locale: BR })
    expect(entries[0].type).toBe('weekend')
  })

  test('single day range works', () => {
    expect(bizDays.range('2025-01-06', '2025-01-06')).toHaveLength(1)
  })

  test('accepts Date inputs', () => {
    const entries = bizDays.range(new Date(2025, 0, 6), new Date(2025, 0, 12))
    expect(entries).toHaveLength(7)
  })

  test('bizday count in range matches countBizDays', () => {
    const entries = bizDays.range('2025-04-01', '2025-04-30', { locale: BR })
    const bizCount = entries.filter((e) => e.type === 'bizday').length
    expect(bizCount).toBe(bizDays('2025-04-01', '2025-04-30', { locale: BR }).count)
  })
})
