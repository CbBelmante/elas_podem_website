// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import stylistic from '@stylistic/eslint-plugin';

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
  // 2. RULES CONFIGURATION
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      // Estilo — @stylistic/semi cobre JS + TS (type aliases, interfaces, etc.)
      'semi': 'off',
      '@stylistic/semi': ['error', 'always'],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': ['error', { varsIgnorePattern: '^_|^ctx$|^props$', args: 'none' }],
      'typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      'max-len': ['warn', { code: 150, comments: 150, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreRegExpLiterals: true }],
      'linebreak-style': ['error', 'unix'],
      'vue/max-attributes-per-line': ['error', {
        singleline: {
          max: 4
        },
        multiline: {
          max: 2
        }
      }],
      'vue/html-indent': ['error', 2, {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
      }],
      'vue/html-self-closing': 'off',
    },
  },
);
