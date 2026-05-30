# Contributing to biz-days

## Adding a new locale

A locale is a single TypeScript file that exports a `Locale` object listing all holiday rules for a country. The engine handles the rest — no changes to core code needed.

### Step 1 — Create the locale file

Create `src/locales/<cc>.ts` where `<cc>` is the [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) country code in lowercase.

```ts
// src/locales/de.ts
import { Locale } from '../types'

export const DE: Locale = {
  name: 'de',
  rules: [
    // fixed holidays: exact month/day every year
    { type: 'fixed', month: 1,  day: 1,  name: 'Neujahr' },
    { type: 'fixed', month: 10, day: 3,  name: 'Tag der Deutschen Einheit' },
    { type: 'fixed', month: 12, day: 25, name: 'Erster Weihnachtstag' },
    { type: 'fixed', month: 12, day: 26, name: 'Zweiter Weihnachtstag' },

    // computed holidays: calculated per year
    { type: 'computed', name: 'Karfreitag',    fn: (year) => addDays(easter(year), -2) },
    { type: 'computed', name: 'Ostermontag',   fn: (year) => addDays(easter(year),  1) },
    { type: 'computed', name: 'Himmelfahrt',   fn: (year) => addDays(easter(year), 39) },
    { type: 'computed', name: 'Pfingstmontag', fn: (year) => addDays(easter(year), 50) },
  ],
}
```

### Holiday rule types

#### Fixed holiday

Occurs on the same date every year.

```ts
{ type: 'fixed', month: 12, day: 25, name: 'Christmas' }
```

#### Computed holiday

Any holiday whose date changes year to year. The `fn` receives the year and returns a `Date`.

```ts
{
  type: 'computed',
  name: 'Holiday name',
  fn: (year: number) => /* return Date */,
}
```

### Helper functions

Import from `biz-days/helpers` (or `../helpers` inside the `src/locales/` directory):

```ts
import { easter, addDays, nthWeekdayOfMonth, lastWeekdayOfMonth, observed } from '../helpers'
```

| Helper | When to use | Example |
|--------|-------------|---------|
| `easter(year)` | Base for any Easter-relative holiday | Good Friday, Corpus Christi |
| `addDays(date, n)` | Offset from a computed base date | `addDays(easter(year), -2)` |
| `nthWeekdayOfMonth(year, month, weekday, n)` | "Nth Monday of month" rules | Canadian Thanksgiving: 2nd Monday of October |
| `lastWeekdayOfMonth(year, month, weekday)` | "Last Monday of month" rules | US Memorial Day: last Monday of May |
| `observed(date)` | Shift Sat → Fri, Sun → Mon | US/UK observed bank holidays |

#### Easter offsets cheat-sheet

| Offset | Holiday |
|--------|---------|
| `-48` | Carnaval Monday (Segunda-feira de Carnaval) |
| `-47` | Carnaval Tuesday (Terça-feira de Carnaval) |
| `-46` | Ash Wednesday (Quarta de Cinzas) |
| `-2`  | Good Friday (Sexta-feira Santa / Karfreitag) |
| `0`   | Easter Sunday |
| `+1`  | Easter Monday (Ostermontag / Pâques) |
| `+39` | Ascension Thursday (Himmelfahrt) |
| `+49` | Pentecost Sunday (Pfingstsonntag) |
| `+50` | Whit Monday (Pfingstmontag) |
| `+60` | Corpus Christi |

### Step 2 — Register the entry point

Add the new locale to `tsup.config.ts`:

```ts
entry: {
  index: 'src/index.ts',
  helpers: 'src/helpers.ts',
  'locales/br': 'src/locales/br.ts',
  'locales/de': 'src/locales/de.ts',  // ← add here
  // ...
},
```

And to the `exports` field in `package.json`:

```json
"./locales/*": {
  "types": "./dist/locales/*.d.ts",
  "import": "./dist/locales/*.mjs",
  "require": "./dist/locales/*.js"
}
```

The glob `*` already covers new locales — no change to `package.json` needed.

### Step 3 — Write tests

Create `tests/locales/<cc>.test.ts`. Every locale **must** cover:

1. **Each fixed holiday** — verify the correct date and name for at least one year.
2. **Each computed holiday** — verify for at least two different years (catches off-by-one errors in Easter offsets).
3. **Full-year count check** — verify `count + holidays.length === total weekdays` for a given year.

```ts
// tests/locales/de.test.ts
import { bizDays } from '../../src/index'
import { DE } from '../../src/locales/de'

describe('DE locale – fixed holidays', () => {
  test.each([
    ['2025-01-01', 'Neujahr'],
    ['2025-10-03', 'Tag der Deutschen Einheit'],
    ['2025-12-25', 'Erster Weihnachtstag'],
  ])('%s is %s', (date, name) => {
    expect(bizDays.getHoliday(date, { locale: DE })?.name).toBe(name)
  })
})

describe('DE locale – Easter-based holidays 2025', () => {
  // Easter 2025 = April 20
  test('Good Friday Apr 18', () => {
    expect(bizDays.getHoliday('2025-04-18', { locale: DE })?.name).toBe('Karfreitag')
  })
  test('Easter Monday Apr 21', () => {
    expect(bizDays.getHoliday('2025-04-21', { locale: DE })?.name).toBe('Ostermontag')
  })
})

describe('DE locale – full year 2025', () => {
  test('count + holidays = total weekdays', () => {
    const { count, holidays } = bizDays('2025-01-01', '2025-12-31', { locale: DE })
    expect(count).toBe(261 - holidays.length)
  })
})
```

Run tests with:

```bash
npm test
# or watch mode during development:
npm run test:watch
```

### Step 4 — Open a PR

- Title: `feat: add XX locale (Country Name)`
- Include a link to the official government source for the holiday list
- If holidays differ by state/region, document this in a comment in the locale file and implement the most common national set by default

---

## Code conventions

- **Locale names** (`Locale.name`) use the lowercase ISO 3166-1 alpha-2 code (`'br'`, `'us'`, `'de'`)
- **Exported constant** uses the uppercase code (`BR`, `US`, `DE`)
- **Holiday names** are in the official language of the country, not English
- **No runtime dependencies** — the helpers in `src/helpers.ts` cover the vast majority of patterns; avoid adding new ones unless strictly necessary
- **Dates are always local time** — never use `Date.UTC()`; `parseDate` and all helpers construct dates with `new Date(year, month-1, day)` to avoid timezone shifts

## Development

```bash
npm install          # install dev dependencies
npm test             # run all tests
npm run test:watch   # watch mode
npm run typecheck    # TypeScript type check
npm run build        # compile to dist/
npm run lint         # ESLint
```
