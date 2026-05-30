# biz-days

Business days calculator with pluggable locale/holiday support.

[![npm version](https://img.shields.io/npm/v/biz-days.svg)](https://www.npmjs.com/package/biz-days)
[![license](https://img.shields.io/npm/l/biz-days.svg)](./LICENSE)
[![tests](https://img.shields.io/badge/tests-65%20passing-brightgreen.svg)](#)

Zero-dependency TypeScript library. Supports ESM and CJS. Works in Node.js, Deno, and browsers.

---

## Install

```bash
npm install biz-days
```

---

## Quick start

```ts
import { bizDays } from 'biz-days'
import { BR } from 'biz-days/locales/br'

// Count business days between two dates (inclusive)
bizDays('2025-01-01', '2025-01-31', { locale: BR })
// → { count: 22, holidays: [{ date: '2025-01-01', name: 'Confraternização Universal' }] }

// Add business days to a date
bizDays.add('2025-01-10', 5, { locale: BR })
// → '2025-01-17'

// Subtract business days
bizDays.add('2025-01-17', -5, { locale: BR })
// → '2025-01-10'

// Check if a date is a business day
bizDays.isBizDay('2025-04-18', { locale: BR })  // → false (Good Friday)
bizDays.isBizDay('2025-04-22', { locale: BR })  // → true

// Get holiday info for a date
bizDays.getHoliday('2025-04-18', { locale: BR })
// → { date: '2025-04-18', name: 'Sexta-feira Santa' }
```

---

## API

### `bizDays(from, to, options?)`

Counts business days between `from` and `to` (both inclusive, format `YYYY-MM-DD`).

Returns `{ count: number, holidays: HolidayDate[] }`.

- `count` — weekdays that are not holidays
- `holidays` — holidays that fell on weekdays within the range

### `bizDays.add(from, days, options?)`

Adds `days` business days to `from`. Negative values subtract. Returns a `YYYY-MM-DD` string.

The starting date itself is never counted — only the steps forward/backward.

### `bizDays.isBizDay(date, options?)`

Returns `true` if the date is not a weekend and not a holiday in the locale.

### `bizDays.getHoliday(date, options?)`

Returns `{ date, name }` if the date is a holiday, otherwise `null`.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `locale` | `Locale` | `undefined` | Holiday rules to apply |
| `weekendDays` | `number[]` | `[0, 6]` | Days treated as weekend (0 = Sunday) |

---

## Locales

### Built-in

| Import | Country | Coverage |
|--------|---------|----------|
| `biz-days/locales/br` | 🇧🇷 Brazil | 9 fixed + 4 mobile (Carnaval, Good Friday, Corpus Christi) |
| `biz-days/locales/us` | 🇺🇸 United States | 11 federal holidays with Saturday/Sunday observance rules |
| `biz-days/locales/pt` | 🇵🇹 Portugal | 10 fixed + 4 mobile (Carnaval, Good Friday, Easter, Corpus Christi) |

### Custom locale

```ts
import type { Locale } from 'biz-days'

const MY_LOCALE: Locale = {
  name: 'custom',
  rules: [
    { type: 'fixed', month: 12, day: 25, name: 'Christmas' },
    {
      type: 'computed',
      name: 'Easter',
      fn: (year) => /* return Date */ new Date(year, 3, 20),
    },
  ],
}
```

### Contributing a locale

1. Create `src/locales/<cc>.ts` (cc = ISO 3166-1 alpha-2)
2. Export a `const <CC>: Locale`
3. Add an entry to `tsup.config.ts`
4. Add tests in `tests/locales/<cc>.test.ts`
5. Open a PR

---

## Mobile holidays and Easter

Easter is computed using the **Meeus/Jones/Butcher** algorithm, accurate for any Gregorian year. All holidays derived from Easter (Good Friday, Corpus Christi, Carnaval) use the same engine.

---

## License

MIT
# biz-days
