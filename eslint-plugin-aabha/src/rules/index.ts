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
import { actionDescriptionRequired } from './action/action-description-required.js';
import { actionAutomationLevelRecommended } from './action/action-automation-level-recommended.js';
import { actionCriticalityRecommended } from './action/action-criticality-recommended.js';
import { actionTimeoutDurationRecommended } from './action/action-timeout-duration-recommended.js';
import { actionJourneyScopeEventRecommended } from './action/action-journey-scope-event-recommended.js';
import { actionSystemScopeEventRequired } from './action/action-system-scope-event-required.js';
import { actionTagsRecommended } from './action/action-tags-recommended.js';
import { actionParallelGroupRequired } from './action/action-parallel-group-required.js';
import { behaviorComplexityAlignment } from './behavior/behavior-complexity-alignment.js';
import { behaviorImplementationQuality } from './behavior/behavior-implementation-quality.js';
import { behaviorPerformanceValidation } from './behavior/behavior-performance-validation.js';
import { behaviorPostconditionsQuality } from './behavior/behavior-postconditions-quality.js';
import { behaviorPreconditionsQuality } from './behavior/behavior-preconditions-quality.js';
import { behaviorTracingConfiguration } from './behavior/behavior-tracing-configuration.js';
import { behaviorValidationConsistency } from './behavior/behavior-validation-consistency.js';
import { behaviorWitnessCoverage } from './behavior/behavior-witness-coverage.js';
import { behaviorDescriptionRequired } from './behavior/behavior-description-required.js';
import { behaviorParticipantsRecommended } from './behavior/behavior-participants-recommended.js';
import { behaviorSideEffectsRecommended } from './behavior/behavior-side-effects-recommended.js';
import { behaviorComplexityRecommended } from './behavior/behavior-complexity-recommended.js';
import { behaviorScopeRecommended } from './behavior/behavior-scope-recommended.js';
import { behaviorReusabilityRecommended } from './behavior/behavior-reusability-recommended.js';
import { behaviorPerformanceCompleteness } from './behavior/behavior-performance-completeness.js';
import { behaviorValidationCompleteness } from './behavior/behavior-validation-completeness.js';
import { behaviorTagsRecommended } from './behavior/behavior-tags-recommended.js';
import { initiativeBudgetBreakdown } from './business-initiative/initiative-budget-breakdown.js';
import { initiativeMetricsConsistency } from './business-initiative/initiative-metrics-consistency.js';
import { initiativeNoJourneys } from './business-initiative/initiative-no-journeys.js';
import { initiativeRequiredFields } from './business-initiative/initiative-required-fields.js';
import { initiativeStrategyAlignment } from './business-initiative/initiative-strategy-alignment.js';
import { initiativeTimelineValidation } from './business-initiative/initiative-timeline-validation.js';
import { initiativeObjectivesRequired } from './business-initiative/initiative-objectives-required.js';
import { initiativeOutcomesRequired } from './business-initiative/initiative-outcomes-required.js';
import { initiativeOwnerRequired } from './business-initiative/initiative-owner-required.js';
import { initiativeStrategyRequired } from './business-initiative/initiative-strategy-required.js';
import { initiativeTagsRecommended } from './business-initiative/initiative-tags-recommended.js';
import { initiativeTeamRecommended } from './business-initiative/initiative-team-recommended.js';
import { initiativeSuccessCriteriaRecommended } from './business-initiative/initiative-success-criteria-recommended.js';
import { initiativeRisksRecommended } from './business-initiative/initiative-risks-recommended.js';
import { initiativeJourneysRecommended } from './business-initiative/initiative-journeys-recommended.js';
import { initiativeMetricsRecommended } from './business-initiative/initiative-metrics-recommended.js';
import { initiativeTimelineCompleteness } from './business-initiative/initiative-timeline-completeness.js';
import { initiativeMilestonesCompleteness } from './business-initiative/initiative-milestones-completeness.js';
import { initiativeRisksCompleteness } from './business-initiative/initiative-risks-completeness.js';
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
import { collaborationPurposeRequired } from './collaboration/collaboration-purpose-required.js';
import { collaborationDescriptionRecommended } from './collaboration/collaboration-description-recommended.js';
import { collaborationContextRecommended } from './collaboration/collaboration-context-recommended.js';
import { collaborationTypeRecommended } from './collaboration/collaboration-type-recommended.js';
import { collaborationFrequencyRecommended } from './collaboration/collaboration-frequency-recommended.js';
import { collaborationCommunicationChannelRecommended } from './collaboration/collaboration-communication-channel-recommended.js';
import { collaborationSynchronicityRecommended } from './collaboration/collaboration-synchronicity-recommended.js';
import { collaborationExpectedOutcomesRecommended } from './collaboration/collaboration-expected-outcomes-recommended.js';
import { collaborationTagsRecommended } from './collaboration/collaboration-tags-recommended.js';
import { collaborationOutcomesCompleteness } from './collaboration/collaboration-outcomes-completeness.js';
import { collaborationDocumentationCompleteness } from './collaboration/collaboration-documentation-completeness.js';

import { contextBoundaryRequired } from './context/context-boundary-required.js';
import { contextCapabilityStructure } from './context/context-capability-structure.js';
import { contextDescriptionQuality } from './context/context-description-quality.js';
import { contextMetricsRequired } from './context/context-metrics-required.js';
import { contextNamingConvention } from './context/context-naming-convention.js';
import { contextRelationshipConsistency } from './context/context-relationship-consistency.js';
import { contextGoalsRequired } from './context/context-goals-required.js';
import { contextOwnerRequired } from './context/context-owner-required.js';
import { contextTeamRecommended } from './context/context-team-recommended.js';
import { contextAssumptionsRecommended } from './context/context-assumptions-recommended.js';
import { contextConstraintsRecommended } from './context/context-constraints-recommended.js';
import { contextOutOfScopeRecommended } from './context/context-out-of-scope-recommended.js';
import { contextTagsRecommended } from './context/context-tags-recommended.js';
import { contextDomainModelCompleteness } from './context/context-domain-model-completeness.js';
// Expectation required fields
import { expectationRequiredFields } from './expectation/expectation-required-fields.js';

// Expectation recommended fields
import { expectationBehaviorsRecommended } from './expectation/expectation-behaviors-recommended.js';
import { expectationQualityRecommended } from './expectation/expectation-quality-recommended.js';
import { expectationVerificationRecommended } from './expectation/expectation-verification-recommended.js';
import { expectationObservabilityRecommended } from './expectation/expectation-observability-recommended.js';
import { expectationBusinessContextRecommended } from './expectation/expectation-business-context-recommended.js';
import { expectationClassificationRecommended } from './expectation/expectation-classification-recommended.js';
import { expectationTagsRecommended } from './expectation/expectation-tags-recommended.js';

// Existing expectation validation rules
import { expectationAdditionalInteractionsUniqueRoles } from './expectation/expectation-additional-interactions-unique-roles.js';
import { expectationAdditionalStakeholdersUniqueRoles } from './expectation/expectation-additional-stakeholders-unique-roles.js';
import { expectationNoSelfReference } from './expectation/expectation-no-self-reference.js';
import { expectationObservabilityMetricsNonempty } from './expectation/expectation-observability-metrics-nonempty.js';
import { expectationProviderConsumerDistinct } from './expectation/expectation-provider-consumer-distinct.js';
import { expectationSloTargetRealism } from './expectation/expectation-slo-target-realism.js';
import { expectationVerificationLevelCoverage } from './expectation/expectation-verification-level-coverage.js';
// Required fields
import { interactionRequiredFields } from './interaction/interaction-required-fields.js';

// Recommended fields
import { interactionDescriptionRecommended } from './interaction/interaction-description-recommended.js';
import { interactionQualityRecommended } from './interaction/interaction-quality-recommended.js';
import { interactionSecurityRecommended } from './interaction/interaction-security-recommended.js';
import { interactionProtocolRecommended } from './interaction/interaction-protocol-recommended.js';
import { interactionErrorHandlingRecommended } from './interaction/interaction-error-handling-recommended.js';
import { interactionObservabilityRecommended } from './interaction/interaction-observability-recommended.js';
import { interactionTagsRecommended } from './interaction/interaction-tags-recommended.js';

// Completeness checks
import { interactionInputsCompleteness } from './interaction/interaction-inputs-completeness.js';
import { interactionOutputsCompleteness } from './interaction/interaction-outputs-completeness.js';

// Layer-specific config recommendations
import { interactionFrontendConfigRecommended } from './interaction/interaction-frontend-config-recommended.js';
import { interactionBackendConfigRecommended } from './interaction/interaction-backend-config-recommended.js';
import { interactionDataConfigRecommended } from './interaction/interaction-data-config-recommended.js';
import { interactionDeviceConfigRecommended } from './interaction/interaction-device-config-recommended.js';
import { interactionInterpersonalConfigRecommended } from './interaction/interaction-interpersonal-config-recommended.js';
import { interactionManualConfigRecommended } from './interaction/interaction-manual-config-recommended.js';
import { interactionOrganizationalConfigRecommended } from './interaction/interaction-organizational-config-recommended.js';

// Existing interaction rules
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
// Journey required fields
import { journeyRequiredFields } from './journey/journey-required-fields.js';

// Journey recommended fields
import { journeyDescriptionRecommended } from './journey/journey-description-recommended.js';
import { journeyActionsRecommended } from './journey/journey-actions-recommended.js';
import { journeyTagsRecommended } from './journey/journey-tags-recommended.js';

// Journey validation rules
import { journeyEntryActionsValidation } from './journey/journey-entry-actions-validation.js';
import { journeyOutcomesCompleteness } from './journey/journey-outcomes-completeness.js';

// Existing journey rules
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
import { metricCategoryRequired } from './metric/metric-category-required.js';
import { metricUnitRequired } from './metric/metric-unit-required.js';
import { metricTargetRecommended } from './metric/metric-target-recommended.js';
import { metricDirectionRequired } from './metric/metric-direction-required.js';
import { metricDescriptionRequired } from './metric/metric-description-required.js';
import { metricFrequencyRecommended } from './metric/metric-frequency-recommended.js';
import { metricGoalCompleteness } from './metric/metric-goal-completeness.js';
import { metricHistoryCompleteness } from './metric/metric-history-completeness.js';
import { metricVisualizationCompleteness } from './metric/metric-visualization-completeness.js';
import { metricDimensionsCompleteness } from './metric/metric-dimensions-completeness.js';
import { metricTagsRecommended } from './metric/metric-tags-recommended.js';
import { metricCurrentValueRecommended } from './metric/metric-current-value-recommended.js';
import { componentNamingConvention } from './naming/component-naming-convention.js';
import { requiredDescription } from './naming/required-description.js';
import { stakeholderNamingClarity } from './naming/stakeholder-naming-clarity.js';
import { personaArchetypeRequired } from './persona/persona-archetype-required.js';
import { personaBehaviorRequired } from './persona/persona-behavior-required.js';
import { personaContextRequired } from './persona/persona-context-required.js';
import { personaDemographicsRequired } from './persona/persona-demographics-required.js';
import { personaIdentityCompleteness } from './persona/persona-identity-completeness.js';
import { personaMetricsDefinition } from './persona/persona-metrics-definition.js';
import { personaNameTypeAlignment } from './persona/persona-name-type-alignment.js';
import { personaNeedsGoalsAlignment } from './persona/persona-needs-goals-alignment.js';
import { personaOrganizationAttributesRequired } from './persona/persona-organization-attributes-required.js';
import { personaOrganizationAttributesCompleteness } from './persona/persona-organization-attributes-completeness.js';
import { personaPainPointsRequired } from './persona/persona-pain-points-required.js';
import { personaPsychologyDepth } from './persona/persona-psychology-depth.js';
import { personaQuoteValidation } from './persona/persona-quote-validation.js';
import { personaSystemAdoptionBarriers } from './persona/persona-system-adoption-barriers.js';
import { personaSystemAttributes } from './persona/persona-system-attributes.js';
import { personaSystemAttributesCompleteness } from './persona/persona-system-attributes-completeness.js';
import { personaTeamAttributesRequired } from './persona/persona-team-attributes-required.js';
import { personaTeamAttributesCompleteness } from './persona/persona-team-attributes-completeness.js';
import { personaTypeConsistency } from './persona/persona-type-consistency.js';
import { personaMotivationsRequired } from './persona/persona-motivations-required.js';
import { personaGoalsRequired } from './persona/persona-goals-required.js';
import { personaNeedsRequired } from './persona/persona-needs-required.js';
import { personaTechnicalProficiencyRequired } from './persona/persona-technical-proficiency-required.js';
import { personaPreferredChannelsRequired } from './persona/persona-preferred-channels-required.js';
import { personaDependenciesIntegrations } from './persona/persona-dependencies-integrations.js';
import { personaDayInTheLifeRecommended } from './persona/persona-day-in-the-life-recommended.js';
import { personaSecurityProfileRequired } from './persona/persona-security-profile-required.js';
import { stakeholderCollaborationPatternsCompleteness } from './stakeholder/stakeholder-collaboration-patterns-completeness.js';
import { stakeholderCommunicationPreferencesCompleteness } from './stakeholder/stakeholder-communication-preferences-completeness.js';
import { stakeholderContextAttributesCompleteness } from './stakeholder/stakeholder-context-attributes-completeness.js';
import { stakeholderDecisionRightsCompleteness } from './stakeholder/stakeholder-decision-rights-completeness.js';
import { stakeholderDescriptionRequired } from './stakeholder/stakeholder-description-required.js';
import { stakeholderEngagementCompleteness } from './stakeholder/stakeholder-engagement-completeness.js';
import { stakeholderHumanCommunicationPatterns } from './stakeholder/stakeholder-human-communication-patterns.js';
import { stakeholderInfluenceConsistency } from './stakeholder/stakeholder-influence-consistency.js';
import { stakeholderMetricsTracking } from './stakeholder/stakeholder-metrics-tracking.js';
import { stakeholderOrganizationFormalAgreements } from './stakeholder/stakeholder-organization-formal-agreements.js';
import { stakeholderRelationshipReciprocity } from './stakeholder/stakeholder-relationship-reciprocity.js';
import { stakeholderRelationshipsCompleteness } from './stakeholder/stakeholder-relationships-completeness.js';
import { stakeholderRequiredFields } from './stakeholder/stakeholder-required-fields.js';
import { stakeholderRoleDefinition } from './stakeholder/stakeholder-role-definition.js';
import { stakeholderStrategicAlignment } from './stakeholder/stakeholder-strategic-alignment.js';
import { stakeholderSystemEngagementPatterns } from './stakeholder/stakeholder-system-engagement-patterns.js';
import { stakeholderTeamCollaborationRequired } from './stakeholder/stakeholder-team-collaboration-required.js';
import { stakeholderTypePersonaAlignment } from './stakeholder/stakeholder-type-persona-alignment.js';
import { strategyGovernanceCompleteness } from './strategy/strategy-governance-completeness.js';
import { strategyMetricsRequired } from './strategy/strategy-metrics-required.js';
import { strategyP2wCompleteness } from './strategy/strategy-p2w-completeness.js';
import { strategyDescriptionRequired } from './strategy/strategy-description-required.js';
import { strategyStrategicChoicesRequired } from './strategy/strategy-strategic-choices-required.js';
import { strategyValuePropositionRequired } from './strategy/strategy-value-proposition-required.js';
import { strategyCompetitiveContextRequired } from './strategy/strategy-competitive-context-required.js';
import { strategyAssumptionsRequired } from './strategy/strategy-assumptions-required.js';
import { strategyTimeHorizonRequired } from './strategy/strategy-time-horizon-required.js';
import { strategyObjectivesRequired } from './strategy/strategy-objectives-required.js';
import { strategyRisksRecommended } from './strategy/strategy-risks-recommended.js';
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
  'action-description-required': actionDescriptionRequired,
  'action-automation-level-recommended': actionAutomationLevelRecommended,
  'action-criticality-recommended': actionCriticalityRecommended,
  'action-timeout-duration-recommended': actionTimeoutDurationRecommended,
  'action-journey-scope-event-recommended': actionJourneyScopeEventRecommended,
  'action-system-scope-event-required': actionSystemScopeEventRequired,
  'action-tags-recommended': actionTagsRecommended,
  'action-parallel-group-required': actionParallelGroupRequired,
  'behavior-complexity-alignment': behaviorComplexityAlignment,
  'behavior-implementation-quality': behaviorImplementationQuality,
  'behavior-performance-validation': behaviorPerformanceValidation,
  'behavior-postconditions-quality': behaviorPostconditionsQuality,
  'behavior-preconditions-quality': behaviorPreconditionsQuality,
  'behavior-tracing-configuration': behaviorTracingConfiguration,
  'behavior-validation-consistency': behaviorValidationConsistency,
  'behavior-witness-coverage': behaviorWitnessCoverage,
  'behavior-description-required': behaviorDescriptionRequired,
  'behavior-participants-recommended': behaviorParticipantsRecommended,
  'behavior-side-effects-recommended': behaviorSideEffectsRecommended,
  'behavior-complexity-recommended': behaviorComplexityRecommended,
  'behavior-scope-recommended': behaviorScopeRecommended,
  'behavior-reusability-recommended': behaviorReusabilityRecommended,
  'behavior-performance-completeness': behaviorPerformanceCompleteness,
  'behavior-validation-completeness': behaviorValidationCompleteness,
  'behavior-tags-recommended': behaviorTagsRecommended,
  'initiative-budget-breakdown': initiativeBudgetBreakdown,
  'initiative-metrics-consistency': initiativeMetricsConsistency,
  'initiative-no-journeys': initiativeNoJourneys,
  'initiative-required-fields': initiativeRequiredFields,
  'initiative-strategy-alignment': initiativeStrategyAlignment,
  'initiative-timeline-validation': initiativeTimelineValidation,
  'initiative-objectives-required': initiativeObjectivesRequired,
  'initiative-outcomes-required': initiativeOutcomesRequired,
  'initiative-owner-required': initiativeOwnerRequired,
  'initiative-strategy-required': initiativeStrategyRequired,
  'initiative-tags-recommended': initiativeTagsRecommended,
  'initiative-team-recommended': initiativeTeamRecommended,
  'initiative-success-criteria-recommended': initiativeSuccessCriteriaRecommended,
  'initiative-risks-recommended': initiativeRisksRecommended,
  'initiative-journeys-recommended': initiativeJourneysRecommended,
  'initiative-metrics-recommended': initiativeMetricsRecommended,
  'initiative-timeline-completeness': initiativeTimelineCompleteness,
  'initiative-milestones-completeness': initiativeMilestonesCompleteness,
  'initiative-risks-completeness': initiativeRisksCompleteness,
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
  'collaboration-purpose-required': collaborationPurposeRequired,
  'collaboration-description-recommended': collaborationDescriptionRecommended,
  'collaboration-context-recommended': collaborationContextRecommended,
  'collaboration-type-recommended': collaborationTypeRecommended,
  'collaboration-frequency-recommended': collaborationFrequencyRecommended,
  'collaboration-communication-channel-recommended': collaborationCommunicationChannelRecommended,
  'collaboration-synchronicity-recommended': collaborationSynchronicityRecommended,
  'collaboration-expected-outcomes-recommended': collaborationExpectedOutcomesRecommended,
  'collaboration-tags-recommended': collaborationTagsRecommended,
  'collaboration-outcomes-completeness': collaborationOutcomesCompleteness,
  'collaboration-documentation-completeness': collaborationDocumentationCompleteness,

  'context-boundary-required': contextBoundaryRequired,
  'context-capability-structure': contextCapabilityStructure,
  'context-description-quality': contextDescriptionQuality,
  'context-metrics-required': contextMetricsRequired,
  'context-naming-convention': contextNamingConvention,
  'context-relationship-consistency': contextRelationshipConsistency,
  'context-goals-required': contextGoalsRequired,
  'context-owner-required': contextOwnerRequired,
  'context-team-recommended': contextTeamRecommended,
  'context-assumptions-recommended': contextAssumptionsRecommended,
  'context-constraints-recommended': contextConstraintsRecommended,
  'context-out-of-scope-recommended': contextOutOfScopeRecommended,
  'context-tags-recommended': contextTagsRecommended,
  'context-domain-model-completeness': contextDomainModelCompleteness,
  // Expectation required fields
  'expectation-required-fields': expectationRequiredFields,
  // Expectation recommended fields
  'expectation-behaviors-recommended': expectationBehaviorsRecommended,
  'expectation-quality-recommended': expectationQualityRecommended,
  'expectation-verification-recommended': expectationVerificationRecommended,
  'expectation-observability-recommended': expectationObservabilityRecommended,
  'expectation-business-context-recommended': expectationBusinessContextRecommended,
  'expectation-classification-recommended': expectationClassificationRecommended,
  'expectation-tags-recommended': expectationTagsRecommended,
  // Existing expectation validation rules
  'expectation-additional-interactions-unique-roles': expectationAdditionalInteractionsUniqueRoles,
  'expectation-additional-stakeholders-unique-roles': expectationAdditionalStakeholdersUniqueRoles,
  'expectation-no-self-reference': expectationNoSelfReference,
  'expectation-observability-metrics-nonempty': expectationObservabilityMetricsNonempty,
  'expectation-provider-consumer-distinct': expectationProviderConsumerDistinct,
  'expectation-slo-target-realism': expectationSloTargetRealism,
  'expectation-verification-level-coverage': expectationVerificationLevelCoverage,
  // Interaction required fields
  'interaction-required-fields': interactionRequiredFields,
  // Interaction recommended fields
  'interaction-description-recommended': interactionDescriptionRecommended,
  'interaction-quality-recommended': interactionQualityRecommended,
  'interaction-security-recommended': interactionSecurityRecommended,
  'interaction-protocol-recommended': interactionProtocolRecommended,
  'interaction-error-handling-recommended': interactionErrorHandlingRecommended,
  'interaction-observability-recommended': interactionObservabilityRecommended,
  'interaction-tags-recommended': interactionTagsRecommended,
  // Interaction completeness checks
  'interaction-inputs-completeness': interactionInputsCompleteness,
  'interaction-outputs-completeness': interactionOutputsCompleteness,
  // Interaction layer-specific config recommendations
  'interaction-frontend-config-recommended': interactionFrontendConfigRecommended,
  'interaction-backend-config-recommended': interactionBackendConfigRecommended,
  'interaction-data-config-recommended': interactionDataConfigRecommended,
  'interaction-device-config-recommended': interactionDeviceConfigRecommended,
  'interaction-interpersonal-config-recommended': interactionInterpersonalConfigRecommended,
  'interaction-manual-config-recommended': interactionManualConfigRecommended,
  'interaction-organizational-config-recommended': interactionOrganizationalConfigRecommended,
  // Existing interaction rules
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
  // Journey required fields
  'journey-required-fields': journeyRequiredFields,
  // Journey recommended fields
  'journey-description-recommended': journeyDescriptionRecommended,
  'journey-actions-recommended': journeyActionsRecommended,
  'journey-tags-recommended': journeyTagsRecommended,
  // Journey validation rules
  'journey-entry-actions-validation': journeyEntryActionsValidation,
  'journey-outcomes-completeness': journeyOutcomesCompleteness,
  // Existing journey rules
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
  'metric-category-required': metricCategoryRequired,
  'metric-unit-required': metricUnitRequired,
  'metric-target-recommended': metricTargetRecommended,
  'metric-direction-required': metricDirectionRequired,
  'metric-description-required': metricDescriptionRequired,
  'metric-frequency-recommended': metricFrequencyRecommended,
  'metric-goal-completeness': metricGoalCompleteness,
  'metric-history-completeness': metricHistoryCompleteness,
  'metric-visualization-completeness': metricVisualizationCompleteness,
  'metric-dimensions-completeness': metricDimensionsCompleteness,
  'metric-tags-recommended': metricTagsRecommended,
  'metric-current-value-recommended': metricCurrentValueRecommended,
  'component-naming-convention': componentNamingConvention,
  'required-description': requiredDescription,
  'stakeholder-naming-clarity': stakeholderNamingClarity,
  'persona-archetype-required': personaArchetypeRequired,
  'persona-behavior-required': personaBehaviorRequired,
  'persona-context-required': personaContextRequired,
  'persona-demographics-required': personaDemographicsRequired,
  'persona-identity-completeness': personaIdentityCompleteness,
  'persona-metrics-definition': personaMetricsDefinition,
  'persona-name-type-alignment': personaNameTypeAlignment,
  'persona-needs-goals-alignment': personaNeedsGoalsAlignment,
  'persona-organization-attributes-required': personaOrganizationAttributesRequired,
  'persona-organization-attributes-completeness': personaOrganizationAttributesCompleteness,
  'persona-pain-points-required': personaPainPointsRequired,
  'persona-psychology-depth': personaPsychologyDepth,
  'persona-quote-validation': personaQuoteValidation,
  'persona-system-adoption-barriers': personaSystemAdoptionBarriers,
  'persona-system-attributes': personaSystemAttributes,
  'persona-system-attributes-completeness': personaSystemAttributesCompleteness,
  'persona-team-attributes-required': personaTeamAttributesRequired,
  'persona-team-attributes-completeness': personaTeamAttributesCompleteness,
  'persona-type-consistency': personaTypeConsistency,
  'persona-motivations-required': personaMotivationsRequired,
  'persona-goals-required': personaGoalsRequired,
  'persona-needs-required': personaNeedsRequired,
  'persona-technical-proficiency-required': personaTechnicalProficiencyRequired,
  'persona-preferred-channels-required': personaPreferredChannelsRequired,
  'persona-dependencies-integrations': personaDependenciesIntegrations,
  'persona-day-in-the-life-recommended': personaDayInTheLifeRecommended,
  'persona-security-profile-required': personaSecurityProfileRequired,
  'stakeholder-collaboration-patterns-completeness': stakeholderCollaborationPatternsCompleteness,
  'stakeholder-communication-preferences-completeness': stakeholderCommunicationPreferencesCompleteness,
  'stakeholder-context-attributes-completeness': stakeholderContextAttributesCompleteness,
  'stakeholder-decision-rights-completeness': stakeholderDecisionRightsCompleteness,
  'stakeholder-description-required': stakeholderDescriptionRequired,
  'stakeholder-engagement-completeness': stakeholderEngagementCompleteness,
  'stakeholder-human-communication-patterns': stakeholderHumanCommunicationPatterns,
  'stakeholder-influence-consistency': stakeholderInfluenceConsistency,
  'stakeholder-metrics-tracking': stakeholderMetricsTracking,
  'stakeholder-organization-formal-agreements': stakeholderOrganizationFormalAgreements,
  'stakeholder-relationship-reciprocity': stakeholderRelationshipReciprocity,
  'stakeholder-relationships-completeness': stakeholderRelationshipsCompleteness,
  'stakeholder-required-fields': stakeholderRequiredFields,
  'stakeholder-role-definition': stakeholderRoleDefinition,
  'stakeholder-strategic-alignment': stakeholderStrategicAlignment,
  'stakeholder-system-engagement-patterns': stakeholderSystemEngagementPatterns,
  'stakeholder-team-collaboration-required': stakeholderTeamCollaborationRequired,
  'stakeholder-type-persona-alignment': stakeholderTypePersonaAlignment,
  'strategy-governance-completeness': strategyGovernanceCompleteness,
  'strategy-metrics-required': strategyMetricsRequired,
  'strategy-p2w-completeness': strategyP2wCompleteness,
  'strategy-description-required': strategyDescriptionRequired,
  'strategy-strategic-choices-required': strategyStrategicChoicesRequired,
  'strategy-value-proposition-required': strategyValuePropositionRequired,
  'strategy-competitive-context-required': strategyCompetitiveContextRequired,
  'strategy-assumptions-required': strategyAssumptionsRequired,
  'strategy-time-horizon-required': strategyTimeHorizonRequired,
  'strategy-objectives-required': strategyObjectivesRequired,
  'strategy-risks-recommended': strategyRisksRecommended,
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
