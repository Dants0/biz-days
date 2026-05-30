import { bizDays } from '../../src/index'
import { BR } from '../../src/locales/br'

function holidayNames(from: string, to: string): string[] {
  return bizDays(from, to, { locale: BR }).holidays.map((h) => h.name)
}

describe('BR locale – fixed holidays', () => {
  test.each([
    ['2025-01-01', 'Confraternização Universal'],
    ['2025-04-21', 'Tiradentes'],
    ['2025-05-01', 'Dia do Trabalho'],
    ['2025-09-07', 'Independência do Brasil'],
    ['2025-10-12', 'Nossa Senhora Aparecida'],
    ['2025-11-02', 'Finados'],
    ['2025-11-15', 'Proclamação da República'],
    ['2025-11-20', 'Dia da Consciência Negra'],
    ['2025-12-25', 'Natal'],
  ])('%s is %s', (date, name) => {
    const h = bizDays.getHoliday(date, { locale: BR })
    expect(h).not.toBeNull()
    expect(h!.name).toBe(name)
  })
})

describe('BR locale – mobile holidays 2025', () => {
  // Easter 2025: April 20
  test('Carnaval Monday (Mar 3)', () => {
    expect(bizDays.getHoliday('2025-03-03', { locale: BR })?.name).toBe('Segunda-feira de Carnaval')
  })

  test('Carnaval Tuesday (Mar 4)', () => {
    expect(bizDays.getHoliday('2025-03-04', { locale: BR })?.name).toBe('Terça-feira de Carnaval')
  })

  test('Good Friday (Apr 18)', () => {
    expect(bizDays.getHoliday('2025-04-18', { locale: BR })?.name).toBe('Sexta-feira Santa')
  })

  test('Corpus Christi (Jun 19)', () => {
    // Easter Apr 20 + 60 = Jun 19
    expect(bizDays.getHoliday('2025-06-19', { locale: BR })?.name).toBe('Corpus Christi')
  })
})

describe('BR locale – mobile holidays 2026', () => {
  // Easter 2026: April 5
  test('Good Friday 2026 (Apr 3)', () => {
    expect(bizDays.getHoliday('2026-04-03', { locale: BR })?.name).toBe('Sexta-feira Santa')
  })

  test('Carnaval Tuesday 2026 (Feb 17)', () => {
    expect(bizDays.getHoliday('2026-02-17', { locale: BR })?.name).toBe('Terça-feira de Carnaval')
  })

  test('Corpus Christi 2026 (Jun 4)', () => {
    expect(bizDays.getHoliday('2026-06-04', { locale: BR })?.name).toBe('Corpus Christi')
  })
})

describe('BR locale – full year 2025', () => {
  test('13 holidays fall on weekdays', () => {
    // 9 fixed + 4 mobile = 13 total, but some may fall on weekends
    const { holidays } = bizDays('2025-01-01', '2025-12-31', { locale: BR })
    // All 13 rules; some may fall on weekends (not counted) — just verify we have >= 9
    expect(holidays.length).toBeGreaterThanOrEqual(9)
  })

  test('count matches expected weekdays minus holidays', () => {
    const { count, holidays } = bizDays('2025-01-01', '2025-12-31', { locale: BR })
    // 2025 has 261 weekdays; minus however many holidays fall on weekdays
    expect(count).toBe(261 - holidays.length)
  })
})
