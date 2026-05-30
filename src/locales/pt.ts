import { easter, addDays } from '../easter'
import { Locale } from '../types'

/**
 * Portuguese national holidays (feriados nacionais).
 * Source: Lei n.º 7/2009 and Lei n.º 23/2012.
 */
export const PT: Locale = {
  name: 'pt',
  rules: [
    { type: 'fixed', month: 1,  day: 1,  name: 'Ano Novo' },
    { type: 'fixed', month: 4,  day: 25, name: 'Dia da Liberdade' },
    { type: 'fixed', month: 5,  day: 1,  name: 'Dia do Trabalhador' },
    { type: 'fixed', month: 6,  day: 10, name: 'Dia de Portugal' },
    { type: 'fixed', month: 8,  day: 15, name: 'Assunção de Nossa Senhora' },
    { type: 'fixed', month: 10, day: 5,  name: 'Implantação da República' },
    { type: 'fixed', month: 11, day: 1,  name: 'Dia de Todos os Santos' },
    { type: 'fixed', month: 12, day: 1,  name: 'Restauração da Independência' },
    { type: 'fixed', month: 12, day: 8,  name: 'Imaculada Conceição' },
    { type: 'fixed', month: 12, day: 25, name: 'Natal' },

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
      name: 'Domingo de Páscoa',
      fn: (year) => easter(year),
    },
    {
      type: 'computed',
      name: 'Corpo de Deus',
      fn: (year) => addDays(easter(year), 60),
    },
  ],
}
