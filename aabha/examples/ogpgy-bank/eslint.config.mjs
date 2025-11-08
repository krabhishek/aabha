import baseConfig from '../../eslint.config.mjs';
import aabhaPlugin from 'eslint-plugin-aabha';

export default [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      // Disable dependency checks for example project (uses aabha package)
      '@nx/dependency-checks': 'off',
    },
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
      // Disable NX module boundaries for example project (uses aabha package, not relative imports)
      '@nx/enforce-module-boundaries': 'off',
      // Disable NX dependency checks for example project (uses aabha package)
      '@nx/dependency-checks': 'off',
    },
  },
  {
    ignores: ['**/out-tsc'],
  },
  
];
