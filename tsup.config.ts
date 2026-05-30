import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    helpers: 'src/helpers.ts',
    'locales/br': 'src/locales/br.ts',
    'locales/us': 'src/locales/us.ts',
    'locales/pt': 'src/locales/pt.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
})
