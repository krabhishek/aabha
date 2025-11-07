/**
 * ESLint Plugin for Aabha Decorators
 * Provides validation rules for Aabha component decorators
 * @module eslint-plugin-aabha
 */

import type { TSESLint } from '@typescript-eslint/utils';
import { rules } from './rules/index.js';

/**
 * Plugin configuration type
 * Uses TSESLint types for full type safety with TypeScript ESLint rules
 */
interface AabhaPlugin {
  meta: {
    name: string;
    version: string;
  };
  rules: Record<string, TSESLint.RuleModule<string, readonly unknown[]>>;
  configs: Record<string, TSESLint.FlatConfig.Config>;
}

const plugin: AabhaPlugin = {
  meta: {
    name: 'eslint-plugin-aabha',
    version: '0.1.0',
  },
  rules,
  configs: {},
};

// Recommended configuration - sensible defaults for production use
const recommendedConfig: TSESLint.FlatConfig.Config = {
  plugins: {
    aabha: plugin,
  },
  rules: {
    // Naming Rules
    'aabha/component-naming-convention': 'error',
    'aabha/required-description': 'warn',
    'aabha/stakeholder-naming-clarity': 'warn',

    // Action Rules - Critical errors only
    'aabha/action-event-naming': 'error',
    'aabha/action-scope-properties-alignment': 'error',
    'aabha/action-automation-actor-alignment': 'error',
    'aabha/action-criticality-skip-conflict': 'error',
    'aabha/action-trigger-cycle-detection': 'error',

    // Action Rules - Warnings for best practices
    'aabha/action-fallback-exists': 'warn',
    'aabha/action-retry-timeout-pairing': 'warn',
    'aabha/action-parallel-group-consistency': 'warn',
    'aabha/action-conditional-triggers': 'warn',
    'aabha/action-compensation-pattern': 'warn',
    'aabha/action-duration-realism': 'warn',

    // Behavior Rules - Critical errors
    'aabha/behavior-complexity-alignment': 'error',
    'aabha/behavior-validation-consistency': 'error',
    'aabha/behavior-witness-coverage': 'error',

    // Behavior Rules - Warnings for best practices
    'aabha/behavior-preconditions-quality': 'warn',
    'aabha/behavior-postconditions-quality': 'warn',
    'aabha/behavior-implementation-quality': 'warn',
    'aabha/behavior-performance-validation': 'warn',
    'aabha/behavior-tracing-configuration': 'warn',

    // Business Initiative Rules - Critical errors
    'aabha/initiative-required-fields': 'error',
    'aabha/initiative-strategy-alignment': 'error',
    'aabha/initiative-no-journeys': 'error',

    // Business Initiative Rules - Warnings for best practices
    'aabha/initiative-budget-breakdown': 'warn',
    'aabha/initiative-timeline-validation': 'warn',
    'aabha/initiative-metrics-consistency': 'warn',

    // Context Rules - Critical errors
    'aabha/context-boundary-required': 'error',
    'aabha/context-capability-structure': 'error',
    'aabha/context-naming-convention': 'error',

    // Context Rules - Warnings for best practices
    'aabha/context-description-quality': 'warn',
    'aabha/context-metrics-required': 'warn',
    'aabha/context-relationship-consistency': 'warn',
  },
};

// All rules enabled configuration - maximum strictness
const allConfig: TSESLint.FlatConfig.Config = {
  plugins: {
    aabha: plugin,
  },
  rules: {
    // Naming Rules
    'aabha/component-naming-convention': 'error',
    'aabha/required-description': 'error',
    'aabha/stakeholder-naming-clarity': 'error',

    // Action Rules
    'aabha/action-event-naming': 'error',
    'aabha/action-scope-properties-alignment': 'error',
    'aabha/action-automation-actor-alignment': 'error',
    'aabha/action-criticality-skip-conflict': 'error',
    'aabha/action-fallback-exists': 'error',
    'aabha/action-retry-timeout-pairing': 'error',
    'aabha/action-parallel-group-consistency': 'error',
    'aabha/action-conditional-triggers': 'error',
    'aabha/action-compensation-pattern': 'error',
    'aabha/action-duration-realism': 'error',
    'aabha/action-trigger-cycle-detection': 'error',

    // Behavior Rules
    'aabha/behavior-complexity-alignment': 'error',
    'aabha/behavior-preconditions-quality': 'error',
    'aabha/behavior-postconditions-quality': 'error',
    'aabha/behavior-implementation-quality': 'error',
    'aabha/behavior-performance-validation': 'error',
    'aabha/behavior-validation-consistency': 'error',
    'aabha/behavior-witness-coverage': 'error',
    'aabha/behavior-tracing-configuration': 'error',

    // Business Initiative Rules
    'aabha/initiative-required-fields': 'error',
    'aabha/initiative-budget-breakdown': 'error',
    'aabha/initiative-timeline-validation': 'error',
    'aabha/initiative-strategy-alignment': 'error',
    'aabha/initiative-metrics-consistency': 'error',
    'aabha/initiative-no-journeys': 'error',

    // Context Rules
    'aabha/context-boundary-required': 'error',
    'aabha/context-capability-structure': 'error',
    'aabha/context-description-quality': 'error',
    'aabha/context-metrics-required': 'error',
    'aabha/context-naming-convention': 'error',
    'aabha/context-relationship-consistency': 'error',
  },
};

// Add configs to plugin
plugin.configs = {
  recommended: recommendedConfig,
  all: allConfig,
};

export default plugin;

// Named exports
export { rules };
export { recommendedConfig, allConfig };

// Re-export types
export type * from './types/aabha-decorator.types.js';
