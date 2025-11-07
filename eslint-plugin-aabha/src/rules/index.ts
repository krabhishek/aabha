/**
 * All ESLint Rules
 * Auto-generated - do not edit manually
 */

import type { TSESLint } from '@typescript-eslint/utils';

import { actionAutomationActorAlignment } from './action/action-automation-actor-alignment.js';
import { actionCompensationPattern } from './action/action-compensation-pattern.js';
import { actionConditionalTriggers } from './action/action-conditional-triggers.js';
import { actionCriticalitySkipConflict } from './action/action-criticality-skip-conflict.js';
import { actionDurationRealism } from './action/action-duration-realism.js';
import { actionEventNaming } from './action/action-event-naming.js';
import { actionFallbackExists } from './action/action-fallback-exists.js';
import { actionParallelGroupConsistency } from './action/action-parallel-group-consistency.js';
import { actionRetryTimeoutPairing } from './action/action-retry-timeout-pairing.js';
import { actionScopePropertiesAlignment } from './action/action-scope-properties-alignment.js';
import { actionTriggerCycleDetection } from './action/action-trigger-cycle-detection.js';
import { behaviorComplexityAlignment } from './behavior/behavior-complexity-alignment.js';
import { behaviorImplementationQuality } from './behavior/behavior-implementation-quality.js';
import { behaviorPerformanceValidation } from './behavior/behavior-performance-validation.js';
import { behaviorPostconditionsQuality } from './behavior/behavior-postconditions-quality.js';
import { behaviorPreconditionsQuality } from './behavior/behavior-preconditions-quality.js';
import { behaviorTracingConfiguration } from './behavior/behavior-tracing-configuration.js';
import { behaviorValidationConsistency } from './behavior/behavior-validation-consistency.js';
import { behaviorWitnessCoverage } from './behavior/behavior-witness-coverage.js';
import { initiativeBudgetBreakdown } from './business-initiative/initiative-budget-breakdown.js';
import { initiativeMetricsConsistency } from './business-initiative/initiative-metrics-consistency.js';
import { initiativeNoJourneys } from './business-initiative/initiative-no-journeys.js';
import { initiativeRequiredFields } from './business-initiative/initiative-required-fields.js';
import { initiativeStrategyAlignment } from './business-initiative/initiative-strategy-alignment.js';
import { initiativeTimelineValidation } from './business-initiative/initiative-timeline-validation.js';
import { collaborationArtifactOwnership } from './collaboration/collaboration-artifact-ownership.js';
import { collaborationArtifactsCompleteness } from './collaboration/collaboration-artifacts-completeness.js';
import { collaborationDecisionMakingApproach } from './collaboration/collaboration-decision-making-approach.js';
import { collaborationDecisionMakingQuorum } from './collaboration/collaboration-decision-making-quorum.js';
import { collaborationDurationRealism } from './collaboration/collaboration-duration-realism.js';
import { collaborationFrequencyDurationAlignment } from './collaboration/collaboration-frequency-duration-alignment.js';
import { collaborationLocationTypeValidation } from './collaboration/collaboration-location-type-validation.js';
import { collaborationMinimumParticipants } from './collaboration/collaboration-minimum-participants.js';
import { collaborationOutcomeResponsibility } from './collaboration/collaboration-outcome-responsibility.js';
import { collaborationParticipantRoleValidation } from './collaboration/collaboration-participant-role-validation.js';
import { collaborationRequiredParticipants } from './collaboration/collaboration-required-participants.js';
import { collaborationSchedulingLeadTime } from './collaboration/collaboration-scheduling-lead-time.js';
import { collaborationSuccessCriteria } from './collaboration/collaboration-success-criteria.js';
import { collaborationSynchronicityChannelMatching } from './collaboration/collaboration-synchronicity-channel-matching.js';

import { contextBoundaryRequired } from './context/context-boundary-required.js';
import { contextCapabilityStructure } from './context/context-capability-structure.js';
import { contextDescriptionQuality } from './context/context-description-quality.js';
import { contextMetricsRequired } from './context/context-metrics-required.js';
import { contextNamingConvention } from './context/context-naming-convention.js';
import { contextRelationshipConsistency } from './context/context-relationship-consistency.js';
import { expectationAdditionalInteractionsUniqueRoles } from './expectation/expectation-additional-interactions-unique-roles.js';
import { expectationAdditionalStakeholdersUniqueRoles } from './expectation/expectation-additional-stakeholders-unique-roles.js';
import { expectationNoSelfReference } from './expectation/expectation-no-self-reference.js';
import { expectationObservabilityMetricsNonempty } from './expectation/expectation-observability-metrics-nonempty.js';
import { expectationProviderConsumerDistinct } from './expectation/expectation-provider-consumer-distinct.js';
import { expectationSloTargetRealism } from './expectation/expectation-slo-target-realism.js';
import { expectationVerificationLevelCoverage } from './expectation/expectation-verification-level-coverage.js';
import { interactionBackendResilienceTimeouts } from './interaction/interaction-backend-resilience-timeouts.js';
import { interactionErrorCodeUniqueness } from './interaction/interaction-error-code-uniqueness.js';
import { interactionInterpersonalDurationRealism } from './interaction/interaction-interpersonal-duration-realism.js';
import { interactionInterpersonalLocationValidation } from './interaction/interaction-interpersonal-location-validation.js';
import { interactionInterpersonalSynchronicityChannel } from './interaction/interaction-interpersonal-synchronicity-channel.js';
import { interactionLayerConfigMatching } from './interaction/interaction-layer-config-matching.js';
import { interactionLayerPatternAlignment } from './interaction/interaction-layer-pattern-alignment.js';
import { interactionManualApprovalWorkflow } from './interaction/interaction-manual-approval-workflow.js';
import { interactionManualDocumentStorage } from './interaction/interaction-manual-document-storage.js';
import { interactionManualDurationEstimation } from './interaction/interaction-manual-duration-estimation.js';
import { interactionOrganizationalCompliance } from './interaction/interaction-organizational-compliance.js';
import { interactionOrganizationalLegalFramework } from './interaction/interaction-organizational-legal-framework.js';
import { interactionParticipantsValidation } from './interaction/interaction-participants-validation.js';
import { interactionProtocolPatternMatching } from './interaction/interaction-protocol-pattern-matching.js';
import { interactionQualitySloPercentileOrdering } from './interaction/interaction-quality-slo-percentile-ordering.js';
import { journeyEntryActionsExist } from './journey/journey-entry-actions-exist.js';
import { journeyMetricsRelevant } from './journey/journey-metrics-relevant.js';
import { journeyOutcomesMeasurable } from './journey/journey-outcomes-measurable.js';
import { metricBaselineRequired } from './metric/metric-baseline-required.js';
import { metricCalculationMethod } from './metric/metric-calculation-method.js';
import { metricDataSourceTracking } from './metric/metric-data-source-tracking.js';
import { metricGoalContext } from './metric/metric-goal-context.js';
import { metricHierarchyConsistency } from './metric/metric-hierarchy-consistency.js';
import { metricOwnerAssignment } from './metric/metric-owner-assignment.js';
import { metricTargetAlignment } from './metric/metric-target-alignment.js';
import { metricThresholdOrdering } from './metric/metric-threshold-ordering.js';
import { componentNamingConvention } from './naming/component-naming-convention.js';
import { requiredDescription } from './naming/required-description.js';
import { stakeholderNamingClarity } from './naming/stakeholder-naming-clarity.js';
import { personaIdentityCompleteness } from './persona/persona-identity-completeness.js';
import { personaMetricsDefinition } from './persona/persona-metrics-definition.js';
import { personaNeedsGoalsAlignment } from './persona/persona-needs-goals-alignment.js';
import { personaPsychologyDepth } from './persona/persona-psychology-depth.js';
import { personaQuoteValidation } from './persona/persona-quote-validation.js';
import { personaSystemAttributes } from './persona/persona-system-attributes.js';
import { personaTypeConsistency } from './persona/persona-type-consistency.js';
import { stakeholderEngagementCompleteness } from './stakeholder/stakeholder-engagement-completeness.js';
import { stakeholderInfluenceConsistency } from './stakeholder/stakeholder-influence-consistency.js';
import { stakeholderMetricsTracking } from './stakeholder/stakeholder-metrics-tracking.js';
import { stakeholderRelationshipReciprocity } from './stakeholder/stakeholder-relationship-reciprocity.js';
import { stakeholderRoleDefinition } from './stakeholder/stakeholder-role-definition.js';
import { stakeholderStrategicAlignment } from './stakeholder/stakeholder-strategic-alignment.js';
import { strategyGovernanceCompleteness } from './strategy/strategy-governance-completeness.js';
import { strategyMetricsRequired } from './strategy/strategy-metrics-required.js';
import { strategyP2wCompleteness } from './strategy/strategy-p2w-completeness.js';
import { witnessBddCompleteness } from './witness/witness-bdd-completeness.js';
import { witnessBelongsToBehavior } from './witness/witness-belongs-to-behavior.js';
import { witnessCoverageTraceability } from './witness/witness-coverage-traceability.js';
import { witnessDependencyExists } from './witness/witness-dependency-exists.js';
import { witnessExecutionConsistency } from './witness/witness-execution-consistency.js';
import { witnessFixtureMethodExists } from './witness/witness-fixture-method-exists.js';
import { witnessFixturesValidation } from './witness/witness-fixtures-validation.js';
import { witnessIsolationParallelConsistency } from './witness/witness-isolation-parallel-consistency.js';
import { witnessMockConsistency } from './witness/witness-mock-consistency.js';
import { witnessPriorityRiskAlignment } from './witness/witness-priority-risk-alignment.js';
import { witnessScenarioQuality } from './witness/witness-scenario-quality.js';
import { witnessSkipDocumented } from './witness/witness-skip-documented.js';
import { witnessTimeoutReasonable } from './witness/witness-timeout-reasonable.js';
import { witnessTypeRequired } from './witness/witness-type-required.js';

export const rules: Record<string, TSESLint.RuleModule<string, readonly unknown[]>> = {
  'action-automation-actor-alignment': actionAutomationActorAlignment,
  'action-compensation-pattern': actionCompensationPattern,
  'action-conditional-triggers': actionConditionalTriggers,
  'action-criticality-skip-conflict': actionCriticalitySkipConflict,
  'action-duration-realism': actionDurationRealism,
  'action-event-naming': actionEventNaming,
  'action-fallback-exists': actionFallbackExists,
  'action-parallel-group-consistency': actionParallelGroupConsistency,
  'action-retry-timeout-pairing': actionRetryTimeoutPairing,
  'action-scope-properties-alignment': actionScopePropertiesAlignment,
  'action-trigger-cycle-detection': actionTriggerCycleDetection,
  'behavior-complexity-alignment': behaviorComplexityAlignment,
  'behavior-implementation-quality': behaviorImplementationQuality,
  'behavior-performance-validation': behaviorPerformanceValidation,
  'behavior-postconditions-quality': behaviorPostconditionsQuality,
  'behavior-preconditions-quality': behaviorPreconditionsQuality,
  'behavior-tracing-configuration': behaviorTracingConfiguration,
  'behavior-validation-consistency': behaviorValidationConsistency,
  'behavior-witness-coverage': behaviorWitnessCoverage,
  'initiative-budget-breakdown': initiativeBudgetBreakdown,
  'initiative-metrics-consistency': initiativeMetricsConsistency,
  'initiative-no-journeys': initiativeNoJourneys,
  'initiative-required-fields': initiativeRequiredFields,
  'initiative-strategy-alignment': initiativeStrategyAlignment,
  'initiative-timeline-validation': initiativeTimelineValidation,
  'collaboration-artifact-ownership': collaborationArtifactOwnership,
  'collaboration-artifacts-completeness': collaborationArtifactsCompleteness,
  'collaboration-decision-making-approach': collaborationDecisionMakingApproach,
  'collaboration-decision-making-quorum': collaborationDecisionMakingQuorum,
  'collaboration-duration-realism': collaborationDurationRealism,
  'collaboration-frequency-duration-alignment': collaborationFrequencyDurationAlignment,
  'collaboration-location-type-validation': collaborationLocationTypeValidation,
  'collaboration-minimum-participants': collaborationMinimumParticipants,
  'collaboration-outcome-responsibility': collaborationOutcomeResponsibility,
  'collaboration-participant-role-validation': collaborationParticipantRoleValidation,
  'collaboration-required-participants': collaborationRequiredParticipants,
  'collaboration-scheduling-lead-time': collaborationSchedulingLeadTime,
  'collaboration-success-criteria': collaborationSuccessCriteria,
  'collaboration-synchronicity-channel-matching': collaborationSynchronicityChannelMatching,

  'context-boundary-required': contextBoundaryRequired,
  'context-capability-structure': contextCapabilityStructure,
  'context-description-quality': contextDescriptionQuality,
  'context-metrics-required': contextMetricsRequired,
  'context-naming-convention': contextNamingConvention,
  'context-relationship-consistency': contextRelationshipConsistency,
  'expectation-additional-interactions-unique-roles': expectationAdditionalInteractionsUniqueRoles,
  'expectation-additional-stakeholders-unique-roles': expectationAdditionalStakeholdersUniqueRoles,
  'expectation-no-self-reference': expectationNoSelfReference,
  'expectation-observability-metrics-nonempty': expectationObservabilityMetricsNonempty,
  'expectation-provider-consumer-distinct': expectationProviderConsumerDistinct,
  'expectation-slo-target-realism': expectationSloTargetRealism,
  'expectation-verification-level-coverage': expectationVerificationLevelCoverage,
  'interaction-backend-resilience-timeouts': interactionBackendResilienceTimeouts,
  'interaction-error-code-uniqueness': interactionErrorCodeUniqueness,
  'interaction-interpersonal-duration-realism': interactionInterpersonalDurationRealism,
  'interaction-interpersonal-location-validation': interactionInterpersonalLocationValidation,
  'interaction-interpersonal-synchronicity-channel': interactionInterpersonalSynchronicityChannel,
  'interaction-layer-config-matching': interactionLayerConfigMatching,
  'interaction-layer-pattern-alignment': interactionLayerPatternAlignment,
  'interaction-manual-approval-workflow': interactionManualApprovalWorkflow,
  'interaction-manual-document-storage': interactionManualDocumentStorage,
  'interaction-manual-duration-estimation': interactionManualDurationEstimation,
  'interaction-organizational-compliance': interactionOrganizationalCompliance,
  'interaction-organizational-legal-framework': interactionOrganizationalLegalFramework,
  'interaction-participants-validation': interactionParticipantsValidation,
  'interaction-protocol-pattern-matching': interactionProtocolPatternMatching,
  'interaction-quality-slo-percentile-ordering': interactionQualitySloPercentileOrdering,
  'journey-entry-actions-exist': journeyEntryActionsExist,
  'journey-metrics-relevant': journeyMetricsRelevant,
  'journey-outcomes-measurable': journeyOutcomesMeasurable,
  'metric-baseline-required': metricBaselineRequired,
  'metric-calculation-method': metricCalculationMethod,
  'metric-data-source-tracking': metricDataSourceTracking,
  'metric-goal-context': metricGoalContext,
  'metric-hierarchy-consistency': metricHierarchyConsistency,
  'metric-owner-assignment': metricOwnerAssignment,
  'metric-target-alignment': metricTargetAlignment,
  'metric-threshold-ordering': metricThresholdOrdering,
  'component-naming-convention': componentNamingConvention,
  'required-description': requiredDescription,
  'stakeholder-naming-clarity': stakeholderNamingClarity,
  'persona-identity-completeness': personaIdentityCompleteness,
  'persona-metrics-definition': personaMetricsDefinition,
  'persona-needs-goals-alignment': personaNeedsGoalsAlignment,
  'persona-psychology-depth': personaPsychologyDepth,
  'persona-quote-validation': personaQuoteValidation,
  'persona-system-attributes': personaSystemAttributes,
  'persona-type-consistency': personaTypeConsistency,
  'stakeholder-engagement-completeness': stakeholderEngagementCompleteness,
  'stakeholder-influence-consistency': stakeholderInfluenceConsistency,
  'stakeholder-metrics-tracking': stakeholderMetricsTracking,
  'stakeholder-relationship-reciprocity': stakeholderRelationshipReciprocity,
  'stakeholder-role-definition': stakeholderRoleDefinition,
  'stakeholder-strategic-alignment': stakeholderStrategicAlignment,
  'strategy-governance-completeness': strategyGovernanceCompleteness,
  'strategy-metrics-required': strategyMetricsRequired,
  'strategy-p2w-completeness': strategyP2wCompleteness,
  'witness-bdd-completeness': witnessBddCompleteness,
  'witness-belongs-to-behavior': witnessBelongsToBehavior,
  'witness-coverage-traceability': witnessCoverageTraceability,
  'witness-dependency-exists': witnessDependencyExists,
  'witness-execution-consistency': witnessExecutionConsistency,
  'witness-fixture-method-exists': witnessFixtureMethodExists,
  'witness-fixtures-validation': witnessFixturesValidation,
  'witness-isolation-parallel-consistency': witnessIsolationParallelConsistency,
  'witness-mock-consistency': witnessMockConsistency,
  'witness-priority-risk-alignment': witnessPriorityRiskAlignment,
  'witness-scenario-quality': witnessScenarioQuality,
  'witness-skip-documented': witnessSkipDocumented,
  'witness-timeout-reasonable': witnessTimeoutReasonable,
  'witness-type-required': witnessTypeRequired,
};
