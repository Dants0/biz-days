import { easter } from '../src/easter'

// Known Easter dates for validation
const knownEasters: [number, string][] = [
  [2020, '2020-04-12'],
  [2021, '2021-04-04'],
  [2022, '2022-04-17'],
  [2023, '2023-04-09'],
  [2024, '2024-03-31'],
  [2025, '2025-04-20'],
  [2026, '2026-04-05'],
  [2030, '2030-04-21'],
  [2100, '2100-03-28'],
]

describe('easter()', () => {
  test.each(knownEasters)('year %d → %s', (year, expected) => {
    const result = easter(year)
    const y = result.getFullYear()
    const m = String(result.getMonth() + 1).padStart(2, '0')
    const d = String(result.getDate()).padStart(2, '0')
    expect(`${y}-${m}-${d}`).toBe(expected)
  })
})
