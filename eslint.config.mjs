import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

/**
 * De codecontrole. Draait met `npm run lint` en bij elke pull request.
 *
 * eslint-config-next levert in Next 16 al kant-en-klare flat configs, dus die
 * worden hier gewoon uitgespreid.
 */
const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'content-archive/**',
      'assets-original/**',
      'assets-new/**',
      'public/**',
      'next-env.d.ts',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Variabelen die met een liggend streepje beginnen zijn bewust ongebruikt.
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
]

export default config
