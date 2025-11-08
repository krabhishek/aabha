import aabhaPlugin from 'eslint-plugin-aabha';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['**/out-tsc', '**/dist', '**/node_modules'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.json'],
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
  {
    // Aabha ESLint Plugin for decorator validation
    // Using the recommended configuration from the plugin
    files: ['**/*.ts'],
    ...aabhaPlugin.configs.recommended,
    rules: {
      // Merge with recommended rules and override specific ones
      ...aabhaPlugin.configs.recommended.rules,
      // Suppress no-empty-function for witness methods (test stubs)
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
];
