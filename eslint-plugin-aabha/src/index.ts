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

    // Strategy Rules - Critical errors
    'aabha/strategy-metrics-required': 'error',
    'aabha/strategy-p2w-completeness': 'error',
    'aabha/strategy-governance-completeness': 'error',

    // Stakeholder Rules - Critical errors
    'aabha/stakeholder-strategic-alignment': 'error',
    'aabha/stakeholder-role-definition': 'error',
    'aabha/stakeholder-engagement-completeness': 'error',

    // Stakeholder Rules - Warnings for best practices
    'aabha/stakeholder-influence-consistency': 'warn',
    'aabha/stakeholder-metrics-tracking': 'warn',
    'aabha/stakeholder-relationship-reciprocity': 'warn',

    // Metric Rules - Critical errors
    'aabha/metric-baseline-required': 'error',
    'aabha/metric-target-alignment': 'error',
    'aabha/metric-threshold-ordering': 'error',
    'aabha/metric-owner-assignment': 'error',
    'aabha/metric-calculation-method': 'error',
    'aabha/metric-data-source-tracking': 'error',
    'aabha/metric-goal-context': 'error',

    // Metric Rules - Warnings for best practices
    'aabha/metric-hierarchy-consistency': 'warn',

    // Witness Rules - Critical errors
    'aabha/witness-type-required': 'error',
    'aabha/witness-belongs-to-behavior': 'error',
    'aabha/witness-bdd-completeness': 'error',
    'aabha/witness-timeout-reasonable': 'error',
    'aabha/witness-fixture-method-exists': 'error',
    'aabha/witness-fixtures-validation': 'error',
    'aabha/witness-dependency-exists': 'error',
    'aabha/witness-priority-risk-alignment': 'error',
    'aabha/witness-coverage-traceability': 'error',
    'aabha/witness-execution-consistency': 'error',
    'aabha/witness-isolation-parallel-consistency': 'error',
    'aabha/witness-scenario-quality': 'error',
    'aabha/witness-skip-documented': 'error',

    // Witness Rules - Warnings for best practices
    'aabha/witness-mock-consistency': 'warn',

    // Collaboration Rules - Critical errors
    'aabha/collaboration-required-participants': 'error',
    'aabha/collaboration-success-criteria': 'error',
    'aabha/collaboration-artifact-ownership': 'error',

    // Collaboration Rules - Warnings for best practices
    'aabha/collaboration-artifacts-completeness': 'warn',
    'aabha/collaboration-decision-making-approach': 'warn',
    'aabha/collaboration-decision-making-quorum': 'warn',
    'aabha/collaboration-duration-realism': 'warn',
    'aabha/collaboration-frequency-duration-alignment': 'warn',
    'aabha/collaboration-location-type-validation': 'warn',
    'aabha/collaboration-minimum-participants': 'warn',
    'aabha/collaboration-outcome-responsibility': 'warn',
    'aabha/collaboration-participant-role-validation': 'warn',
    'aabha/collaboration-scheduling-lead-time': 'warn',
    'aabha/collaboration-synchronicity-channel-matching': 'warn',

    // Expectation Rules - Critical errors
    'aabha/expectation-provider-consumer-distinct': 'error',
    'aabha/expectation-no-self-reference': 'error',
    'aabha/expectation-verification-level-coverage': 'error',

    // Expectation Rules - Warnings for best practices
    'aabha/expectation-additional-interactions-unique-roles': 'warn',
    'aabha/expectation-additional-stakeholders-unique-roles': 'warn',
    'aabha/expectation-observability-metrics-nonempty': 'warn',
    'aabha/expectation-slo-target-realism': 'warn',

    // Interaction Rules - Critical errors
    'aabha/interaction-participants-validation': 'error',
    'aabha/interaction-backend-resilience-timeouts': 'error',
    'aabha/interaction-error-code-uniqueness': 'error',
    'aabha/interaction-layer-config-matching': 'error',
    'aabha/interaction-protocol-pattern-matching': 'error',

    // Interaction Rules - Warnings for best practices
    'aabha/interaction-interpersonal-duration-realism': 'warn',
    'aabha/interaction-interpersonal-location-validation': 'warn',
    'aabha/interaction-interpersonal-synchronicity-channel': 'warn',
    'aabha/interaction-layer-pattern-alignment': 'warn',
    'aabha/interaction-manual-approval-workflow': 'warn',
    'aabha/interaction-manual-document-storage': 'warn',
    'aabha/interaction-manual-duration-estimation': 'warn',
    'aabha/interaction-organizational-compliance': 'warn',
    'aabha/interaction-organizational-legal-framework': 'warn',
    'aabha/interaction-quality-slo-percentile-ordering': 'warn',

    // Journey Rules - Critical errors
    'aabha/journey-entry-actions-exist': 'error',
    'aabha/journey-outcomes-measurable': 'error',

    // Journey Rules - Warnings for best practices
    'aabha/journey-metrics-relevant': 'warn',

    // Persona Rules - Critical errors
    'aabha/persona-identity-completeness': 'error',
    'aabha/persona-type-consistency': 'error',

    // Persona Rules - Warnings for best practices
    'aabha/persona-metrics-definition': 'warn',
    'aabha/persona-needs-goals-alignment': 'warn',
    'aabha/persona-psychology-depth': 'warn',
    'aabha/persona-quote-validation': 'warn',
    'aabha/persona-system-attributes': 'warn',
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

    // Strategy Rules
    'aabha/strategy-metrics-required': 'error',
    'aabha/strategy-p2w-completeness': 'error',
    'aabha/strategy-governance-completeness': 'error',

    // Stakeholder Rules
    'aabha/stakeholder-strategic-alignment': 'error',
    'aabha/stakeholder-role-definition': 'error',
    'aabha/stakeholder-engagement-completeness': 'error',
    'aabha/stakeholder-influence-consistency': 'error',
    'aabha/stakeholder-metrics-tracking': 'error',
    'aabha/stakeholder-relationship-reciprocity': 'error',

    // Metric Rules
    'aabha/metric-baseline-required': 'error',
    'aabha/metric-target-alignment': 'error',
    'aabha/metric-threshold-ordering': 'error',
    'aabha/metric-owner-assignment': 'error',
    'aabha/metric-calculation-method': 'error',
    'aabha/metric-data-source-tracking': 'error',
    'aabha/metric-goal-context': 'error',
    'aabha/metric-hierarchy-consistency': 'error',

    // Witness Rules
    'aabha/witness-type-required': 'error',
    'aabha/witness-belongs-to-behavior': 'error',
    'aabha/witness-bdd-completeness': 'error',
    'aabha/witness-timeout-reasonable': 'error',
    'aabha/witness-fixture-method-exists': 'error',
    'aabha/witness-fixtures-validation': 'error',
    'aabha/witness-dependency-exists': 'error',
    'aabha/witness-priority-risk-alignment': 'error',
    'aabha/witness-coverage-traceability': 'error',
    'aabha/witness-execution-consistency': 'error',
    'aabha/witness-isolation-parallel-consistency': 'error',
    'aabha/witness-mock-consistency': 'error',
    'aabha/witness-scenario-quality': 'error',
    'aabha/witness-skip-documented': 'error',

    // Collaboration Rules
    'aabha/collaboration-artifact-ownership': 'error',
    'aabha/collaboration-artifacts-completeness': 'error',
    'aabha/collaboration-decision-making-approach': 'error',
    'aabha/collaboration-decision-making-quorum': 'error',
    'aabha/collaboration-duration-realism': 'error',
    'aabha/collaboration-frequency-duration-alignment': 'error',
    'aabha/collaboration-location-type-validation': 'error',
    'aabha/collaboration-minimum-participants': 'error',
    'aabha/collaboration-outcome-responsibility': 'error',
    'aabha/collaboration-participant-role-validation': 'error',
    'aabha/collaboration-required-participants': 'error',
    'aabha/collaboration-scheduling-lead-time': 'error',
    'aabha/collaboration-success-criteria': 'error',
    'aabha/collaboration-synchronicity-channel-matching': 'error',

    // Expectation Rules
    'aabha/expectation-additional-interactions-unique-roles': 'error',
    'aabha/expectation-additional-stakeholders-unique-roles': 'error',
    'aabha/expectation-no-self-reference': 'error',
    'aabha/expectation-observability-metrics-nonempty': 'error',
    'aabha/expectation-provider-consumer-distinct': 'error',
    'aabha/expectation-slo-target-realism': 'error',
    'aabha/expectation-verification-level-coverage': 'error',

    // Interaction Rules
    'aabha/interaction-backend-resilience-timeouts': 'error',
    'aabha/interaction-error-code-uniqueness': 'error',
    'aabha/interaction-interpersonal-duration-realism': 'error',
    'aabha/interaction-interpersonal-location-validation': 'error',
    'aabha/interaction-interpersonal-synchronicity-channel': 'error',
    'aabha/interaction-layer-config-matching': 'error',
    'aabha/interaction-layer-pattern-alignment': 'error',
    'aabha/interaction-manual-approval-workflow': 'error',
    'aabha/interaction-manual-document-storage': 'error',
    'aabha/interaction-manual-duration-estimation': 'error',
    'aabha/interaction-organizational-compliance': 'error',
    'aabha/interaction-organizational-legal-framework': 'error',
    'aabha/interaction-participants-validation': 'error',
    'aabha/interaction-protocol-pattern-matching': 'error',
    'aabha/interaction-quality-slo-percentile-ordering': 'error',

    // Journey Rules
    'aabha/journey-entry-actions-exist': 'error',
    'aabha/journey-metrics-relevant': 'error',
    'aabha/journey-outcomes-measurable': 'error',

    // Persona Rules
    'aabha/persona-identity-completeness': 'error',
    'aabha/persona-metrics-definition': 'error',
    'aabha/persona-needs-goals-alignment': 'error',
    'aabha/persona-psychology-depth': 'error',
    'aabha/persona-quote-validation': 'error',
    'aabha/persona-system-attributes': 'error',
    'aabha/persona-type-consistency': 'error',
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
