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
    'aabha/action-description-required': 'warn',
    'aabha/action-automation-level-recommended': 'warn',
    'aabha/action-criticality-recommended': 'warn',
    'aabha/action-timeout-duration-recommended': 'warn',
    'aabha/action-journey-scope-event-recommended': 'warn',
    'aabha/action-tags-recommended': 'warn',

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
    'aabha/behavior-description-required': 'warn',
    'aabha/behavior-participants-recommended': 'warn',
    'aabha/behavior-side-effects-recommended': 'warn',
    'aabha/behavior-complexity-recommended': 'warn',
    'aabha/behavior-scope-recommended': 'warn',
    'aabha/behavior-reusability-recommended': 'warn',
    'aabha/behavior-performance-completeness': 'warn',
    'aabha/behavior-validation-completeness': 'warn',
    'aabha/behavior-tags-recommended': 'warn',

    // Business Initiative Rules - Critical errors
    'aabha/initiative-required-fields': 'error',
    'aabha/initiative-strategy-alignment': 'error',
    'aabha/initiative-no-journeys': 'error',
    'aabha/initiative-objectives-required': 'warn',
    'aabha/initiative-outcomes-required': 'warn',
    'aabha/initiative-owner-required': 'warn',
    'aabha/initiative-strategy-required': 'warn',

    // Business Initiative Rules - Warnings for best practices
    'aabha/initiative-budget-breakdown': 'warn',
    'aabha/initiative-timeline-validation': 'warn',
    'aabha/initiative-metrics-consistency': 'warn',
    'aabha/initiative-tags-recommended': 'warn',
    'aabha/initiative-team-recommended': 'warn',
    'aabha/initiative-success-criteria-recommended': 'warn',
    'aabha/initiative-risks-recommended': 'warn',
    'aabha/initiative-journeys-recommended': 'warn',
    'aabha/initiative-metrics-recommended': 'warn',
    'aabha/initiative-timeline-completeness': 'warn',
    'aabha/initiative-milestones-completeness': 'warn',
    'aabha/initiative-risks-completeness': 'warn',

    // Context Rules - Critical errors
    'aabha/context-boundary-required': 'error',
    'aabha/context-capability-structure': 'error',
    'aabha/context-naming-convention': 'error',

    // Context Rules - Warnings for best practices
    'aabha/context-description-quality': 'warn',
    'aabha/context-metrics-required': 'warn',
    'aabha/context-relationship-consistency': 'warn',
    'aabha/context-goals-required': 'warn',
    'aabha/context-owner-required': 'warn',
    'aabha/context-team-recommended': 'warn',
    'aabha/context-assumptions-recommended': 'warn',
    'aabha/context-constraints-recommended': 'warn',
    'aabha/context-out-of-scope-recommended': 'warn',
    'aabha/context-tags-recommended': 'warn',
    'aabha/context-domain-model-completeness': 'warn',

    // Strategy Rules - Critical errors
    'aabha/strategy-metrics-required': 'error',
    'aabha/strategy-p2w-completeness': 'error',
    'aabha/strategy-governance-completeness': 'error',

    // Strategy Rules - Warnings for best practices
    'aabha/strategy-description-required': 'warn',
    'aabha/strategy-strategic-choices-required': 'warn',
    'aabha/strategy-value-proposition-required': 'warn',
    'aabha/strategy-competitive-context-required': 'warn',
    'aabha/strategy-assumptions-required': 'warn',
    'aabha/strategy-time-horizon-required': 'warn',
    'aabha/strategy-objectives-required': 'warn',
    'aabha/strategy-risks-recommended': 'warn',

    // Stakeholder Rules - Critical errors
    'aabha/stakeholder-required-fields': 'error',
    'aabha/stakeholder-strategic-alignment': 'error',
    'aabha/stakeholder-role-definition': 'error',
    'aabha/stakeholder-engagement-completeness': 'error',
    'aabha/stakeholder-type-persona-alignment': 'error',

    // Stakeholder Rules - Warnings for best practices
    'aabha/stakeholder-description-required': 'warn',
    'aabha/stakeholder-influence-consistency': 'warn',
    'aabha/stakeholder-metrics-tracking': 'warn',
    'aabha/stakeholder-relationship-reciprocity': 'warn',
    'aabha/stakeholder-communication-preferences-completeness': 'warn',
    'aabha/stakeholder-decision-rights-completeness': 'warn',
    'aabha/stakeholder-collaboration-patterns-completeness': 'warn',
    'aabha/stakeholder-relationships-completeness': 'warn',
    'aabha/stakeholder-context-attributes-completeness': 'warn',
    'aabha/stakeholder-system-engagement-patterns': 'warn',
    'aabha/stakeholder-human-communication-patterns': 'warn',
    'aabha/stakeholder-team-collaboration-required': 'warn',
    'aabha/stakeholder-organization-formal-agreements': 'warn',

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
    'aabha/metric-category-required': 'warn',
    'aabha/metric-unit-required': 'warn',
    'aabha/metric-target-recommended': 'warn',
    'aabha/metric-description-required': 'warn',
    'aabha/metric-frequency-recommended': 'warn',
    'aabha/metric-goal-completeness': 'warn',
    'aabha/metric-history-completeness': 'warn',
    'aabha/metric-visualization-completeness': 'warn',
    'aabha/metric-dimensions-completeness': 'warn',
    'aabha/metric-tags-recommended': 'warn',
    'aabha/metric-current-value-recommended': 'warn',

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
    'aabha/collaboration-purpose-required': 'warn',

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
    'aabha/collaboration-description-recommended': 'warn',
    'aabha/collaboration-context-recommended': 'warn',
    'aabha/collaboration-type-recommended': 'warn',
    'aabha/collaboration-frequency-recommended': 'warn',
    'aabha/collaboration-communication-channel-recommended': 'warn',
    'aabha/collaboration-synchronicity-recommended': 'warn',
    'aabha/collaboration-expected-outcomes-recommended': 'warn',
    'aabha/collaboration-tags-recommended': 'warn',
    'aabha/collaboration-outcomes-completeness': 'warn',
    'aabha/collaboration-documentation-completeness': 'warn',

    // Expectation Rules - Critical errors
    'aabha/expectation-required-fields': 'error',
    'aabha/expectation-provider-consumer-distinct': 'error',
    'aabha/expectation-no-self-reference': 'error',
    'aabha/expectation-verification-level-coverage': 'error',

    // Expectation Rules - Warnings for best practices
    'aabha/expectation-behaviors-recommended': 'warn',
    'aabha/expectation-quality-recommended': 'warn',
    'aabha/expectation-verification-recommended': 'warn',
    'aabha/expectation-observability-recommended': 'warn',
    'aabha/expectation-business-context-recommended': 'warn',
    'aabha/expectation-classification-recommended': 'warn',
    'aabha/expectation-tags-recommended': 'warn',
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
    'aabha/journey-required-fields': 'error',
    'aabha/journey-entry-actions-exist': 'error',
    'aabha/journey-entry-actions-validation': 'error',
    'aabha/journey-outcomes-measurable': 'error',

    // Journey Rules - Warnings for best practices
    'aabha/journey-description-recommended': 'warn',
    'aabha/journey-actions-recommended': 'warn',
    'aabha/journey-tags-recommended': 'warn',
    'aabha/journey-metrics-relevant': 'warn',
    'aabha/journey-outcomes-completeness': 'warn',

    // Persona Rules - Critical errors
    'aabha/persona-identity-completeness': 'error',
    'aabha/persona-name-type-alignment': 'error',
    'aabha/persona-type-consistency': 'error',
    'aabha/persona-archetype-required': 'error',
    'aabha/persona-demographics-required': 'error',
    'aabha/persona-behavior-required': 'error',
    'aabha/persona-context-required': 'error',
    'aabha/persona-pain-points-required': 'error',
    'aabha/persona-organization-attributes-required': 'error',
    'aabha/persona-team-attributes-required': 'error',

    // Persona Rules - Warnings for best practices
    'aabha/persona-metrics-definition': 'warn',
    'aabha/persona-needs-goals-alignment': 'warn',
    'aabha/persona-psychology-depth': 'warn',
    'aabha/persona-quote-validation': 'warn',
    'aabha/persona-system-attributes': 'warn',
    'aabha/persona-system-attributes-completeness': 'warn',
    'aabha/persona-system-adoption-barriers': 'warn',
    'aabha/persona-organization-attributes-completeness': 'warn',
    'aabha/persona-team-attributes-completeness': 'warn',
    'aabha/persona-motivations-required': 'warn',
    'aabha/persona-goals-required': 'warn',
    'aabha/persona-needs-required': 'warn',
    'aabha/persona-technical-proficiency-required': 'warn',
    'aabha/persona-preferred-channels-required': 'warn',
    'aabha/persona-dependencies-integrations': 'warn',
    'aabha/persona-day-in-the-life-recommended': 'warn',
    'aabha/persona-security-profile-required': 'warn',
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
    'aabha/action-system-scope-event-required': 'error',
    'aabha/action-parallel-group-required': 'error',
    'aabha/action-description-required': 'error',
    'aabha/action-automation-level-recommended': 'error',
    'aabha/action-criticality-recommended': 'error',
    'aabha/action-timeout-duration-recommended': 'error',
    'aabha/action-journey-scope-event-recommended': 'error',
    'aabha/action-tags-recommended': 'error',
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
    'aabha/behavior-description-required': 'error',
    'aabha/behavior-participants-recommended': 'error',
    'aabha/behavior-side-effects-recommended': 'error',
    'aabha/behavior-complexity-recommended': 'error',
    'aabha/behavior-scope-recommended': 'error',
    'aabha/behavior-reusability-recommended': 'error',
    'aabha/behavior-performance-completeness': 'error',
    'aabha/behavior-validation-completeness': 'error',
    'aabha/behavior-tags-recommended': 'error',

    // Business Initiative Rules
    'aabha/initiative-required-fields': 'error',
    'aabha/initiative-budget-breakdown': 'error',
    'aabha/initiative-timeline-validation': 'error',
    'aabha/initiative-strategy-alignment': 'error',
    'aabha/initiative-metrics-consistency': 'error',
    'aabha/initiative-no-journeys': 'error',
    'aabha/initiative-objectives-required': 'error',
    'aabha/initiative-outcomes-required': 'error',
    'aabha/initiative-owner-required': 'error',
    'aabha/initiative-strategy-required': 'error',
    'aabha/initiative-tags-recommended': 'error',
    'aabha/initiative-team-recommended': 'error',
    'aabha/initiative-success-criteria-recommended': 'error',
    'aabha/initiative-risks-recommended': 'error',
    'aabha/initiative-journeys-recommended': 'error',
    'aabha/initiative-metrics-recommended': 'error',
    'aabha/initiative-timeline-completeness': 'error',
    'aabha/initiative-milestones-completeness': 'error',
    'aabha/initiative-risks-completeness': 'error',

    // Context Rules
    'aabha/context-boundary-required': 'error',
    'aabha/context-capability-structure': 'error',
    'aabha/context-description-quality': 'error',
    'aabha/context-metrics-required': 'error',
    'aabha/context-naming-convention': 'error',
    'aabha/context-relationship-consistency': 'error',
    'aabha/context-goals-required': 'error',
    'aabha/context-owner-required': 'error',
    'aabha/context-domain-model-completeness': 'error',
    'aabha/context-team-recommended': 'error',
    'aabha/context-assumptions-recommended': 'error',
    'aabha/context-constraints-recommended': 'error',
    'aabha/context-out-of-scope-recommended': 'error',
    'aabha/context-tags-recommended': 'error',

    // Strategy Rules
    'aabha/strategy-metrics-required': 'error',
    'aabha/strategy-p2w-completeness': 'error',
    'aabha/strategy-governance-completeness': 'error',
    'aabha/strategy-description-required': 'error',
    'aabha/strategy-strategic-choices-required': 'error',
    'aabha/strategy-value-proposition-required': 'error',
    'aabha/strategy-competitive-context-required': 'error',
    'aabha/strategy-assumptions-required': 'error',
    'aabha/strategy-time-horizon-required': 'error',
    'aabha/strategy-objectives-required': 'error',
    'aabha/strategy-risks-recommended': 'error',

    // Stakeholder Rules
    'aabha/stakeholder-required-fields': 'error',
    'aabha/stakeholder-strategic-alignment': 'error',
    'aabha/stakeholder-role-definition': 'error',
    'aabha/stakeholder-engagement-completeness': 'error',
    'aabha/stakeholder-type-persona-alignment': 'error',
    'aabha/stakeholder-description-required': 'error',
    'aabha/stakeholder-influence-consistency': 'error',
    'aabha/stakeholder-metrics-tracking': 'error',
    'aabha/stakeholder-relationship-reciprocity': 'error',
    'aabha/stakeholder-communication-preferences-completeness': 'error',
    'aabha/stakeholder-decision-rights-completeness': 'error',
    'aabha/stakeholder-collaboration-patterns-completeness': 'error',
    'aabha/stakeholder-relationships-completeness': 'error',
    'aabha/stakeholder-context-attributes-completeness': 'error',
    'aabha/stakeholder-system-engagement-patterns': 'error',
    'aabha/stakeholder-human-communication-patterns': 'error',
    'aabha/stakeholder-team-collaboration-required': 'error',
    'aabha/stakeholder-organization-formal-agreements': 'error',

    // Metric Rules
    'aabha/metric-baseline-required': 'error',
    'aabha/metric-target-alignment': 'error',
    'aabha/metric-threshold-ordering': 'error',
    'aabha/metric-owner-assignment': 'error',
    'aabha/metric-calculation-method': 'error',
    'aabha/metric-data-source-tracking': 'error',
    'aabha/metric-goal-context': 'error',
    'aabha/metric-hierarchy-consistency': 'error',
    'aabha/metric-direction-required': 'error',
    'aabha/metric-goal-completeness': 'error',
    'aabha/metric-history-completeness': 'error',
    'aabha/metric-category-required': 'error',
    'aabha/metric-unit-required': 'error',
    'aabha/metric-target-recommended': 'error',
    'aabha/metric-description-required': 'error',
    'aabha/metric-frequency-recommended': 'error',
    'aabha/metric-visualization-completeness': 'error',
    'aabha/metric-dimensions-completeness': 'error',
    'aabha/metric-tags-recommended': 'error',
    'aabha/metric-current-value-recommended': 'error',

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
    'aabha/collaboration-purpose-required': 'error',
    'aabha/collaboration-description-recommended': 'error',
    'aabha/collaboration-context-recommended': 'error',
    'aabha/collaboration-type-recommended': 'error',
    'aabha/collaboration-frequency-recommended': 'error',
    'aabha/collaboration-communication-channel-recommended': 'error',
    'aabha/collaboration-synchronicity-recommended': 'error',
    'aabha/collaboration-expected-outcomes-recommended': 'error',
    'aabha/collaboration-tags-recommended': 'error',
    'aabha/collaboration-outcomes-completeness': 'error',
    'aabha/collaboration-documentation-completeness': 'error',

    // Expectation Rules
    'aabha/expectation-required-fields': 'error',
    'aabha/expectation-behaviors-recommended': 'error',
    'aabha/expectation-quality-recommended': 'error',
    'aabha/expectation-verification-recommended': 'error',
    'aabha/expectation-observability-recommended': 'error',
    'aabha/expectation-business-context-recommended': 'error',
    'aabha/expectation-classification-recommended': 'error',
    'aabha/expectation-tags-recommended': 'error',
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
    'aabha/journey-required-fields': 'error',
    'aabha/journey-description-recommended': 'error',
    'aabha/journey-actions-recommended': 'error',
    'aabha/journey-tags-recommended': 'error',
    'aabha/journey-entry-actions-exist': 'error',
    'aabha/journey-entry-actions-validation': 'error',
    'aabha/journey-metrics-relevant': 'error',
    'aabha/journey-outcomes-measurable': 'error',
    'aabha/journey-outcomes-completeness': 'error',

    // Persona Rules
    'aabha/persona-archetype-required': 'error',
    'aabha/persona-behavior-required': 'error',
    'aabha/persona-context-required': 'error',
    'aabha/persona-demographics-required': 'error',
    'aabha/persona-identity-completeness': 'error',
    'aabha/persona-metrics-definition': 'error',
    'aabha/persona-name-type-alignment': 'error',
    'aabha/persona-needs-goals-alignment': 'error',
    'aabha/persona-organization-attributes-required': 'error',
    'aabha/persona-organization-attributes-completeness': 'error',
    'aabha/persona-pain-points-required': 'error',
    'aabha/persona-psychology-depth': 'error',
    'aabha/persona-quote-validation': 'error',
    'aabha/persona-system-adoption-barriers': 'error',
    'aabha/persona-system-attributes': 'error',
    'aabha/persona-system-attributes-completeness': 'error',
    'aabha/persona-team-attributes-required': 'error',
    'aabha/persona-team-attributes-completeness': 'error',
    'aabha/persona-type-consistency': 'error',
    'aabha/persona-motivations-required': 'error',
    'aabha/persona-goals-required': 'error',
    'aabha/persona-needs-required': 'error',
    'aabha/persona-technical-proficiency-required': 'error',
    'aabha/persona-preferred-channels-required': 'error',
    'aabha/persona-dependencies-integrations': 'error',
    'aabha/persona-day-in-the-life-recommended': 'error',
    'aabha/persona-security-profile-required': 'error',
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
