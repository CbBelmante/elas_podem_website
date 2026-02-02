// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import prettier from '@vue/eslint-config-prettier';

export default withNuxt(
  // 1. GLOBAL IGNORES - Must be in separate object at TOP (ESLint v9+ requirement)
  {
    ignores: [
      'node_modules',
      '.nuxt',
      'dist',
      '.output',
      '.git',
      '*.min.js',
      '*.min.css',
      '.husky',
    ],
  },
  // 2. RULES CONFIGURATION - Separate object after ignores
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Permitir uso de 'any'
      'no-unused-vars': ['error', { varsIgnorePattern: '^_|^ctx$', args: 'none' }],
      'typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  // 3. PRETTIER - Must come last to override conflicting rules
  prettier
);
