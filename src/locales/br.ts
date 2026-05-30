import { easter, addDays } from '../easter'
import { Locale } from '../types'

/**
 * Brazilian national holidays (feriados nacionais).
 *
 * Fixed: as per Lei 9.093/1995 and subsequent amendments.
 * Mobile: based on Gregorian Easter (Meeus/Jones/Butcher algorithm).
 *
 * Note: Carnaval (Mon/Tue before Ash Wednesday) is a traditional holiday
 * widely observed but NOT an official federal holiday. It is included here
 * as it is treated as a non-business day by virtually all Brazilian institutions.
 * Remove the Carnaval entries if your domain requires strict federal-only holidays.
 */
export const BR: Locale = {
  name: 'br',
  rules: [
    { type: 'fixed', month: 1,  day: 1,  name: 'Confraternização Universal' },
    { type: 'fixed', month: 4,  day: 21, name: 'Tiradentes' },
    { type: 'fixed', month: 5,  day: 1,  name: 'Dia do Trabalho' },
    { type: 'fixed', month: 9,  day: 7,  name: 'Independência do Brasil' },
    { type: 'fixed', month: 10, day: 12, name: 'Nossa Senhora Aparecida' },
    { type: 'fixed', month: 11, day: 2,  name: 'Finados' },
    { type: 'fixed', month: 11, day: 15, name: 'Proclamação da República' },
    { type: 'fixed', month: 11, day: 20, name: 'Dia da Consciência Negra' },
    { type: 'fixed', month: 12, day: 25, name: 'Natal' },

    {
      type: 'computed',
      name: 'Segunda-feira de Carnaval',
      fn: (year) => addDays(easter(year), -48),
    },
    {
      type: 'computed',
      name: 'Terça-feira de Carnaval',
      fn: (year) => addDays(easter(year), -47),
    },
    {
      type: 'computed',
      name: 'Sexta-feira Santa',
      fn: (year) => addDays(easter(year), -2),
    },
    {
      type: 'computed',
      name: 'Corpus Christi',
      fn: (year) => addDays(easter(year), 60),
    },
  ],
}
