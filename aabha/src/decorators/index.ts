/**
 * Decorator exports
 * @module aabha/decorators
 */

// Strategic Level
export { Strategy } from './strategy/index.js';
export type { StrategyOptions } from './strategy/index.js';

export { BusinessInitiative } from './business-initiative/index.js';
export type {
  BusinessInitiativeOptions,
  InitiativeMilestone,
} from './business-initiative/index.js';

export { Metric, MetricCategory } from './metric/index.js';
export type {
  MetricOptions,
  MetricThreshold,
  MetricDataSource,
  MetricGoal,
  MetricHistory,
  MetricVisualization,
  MetricDimensions,
  MetricRelationships,
} from './metric/index.js';

export { Context } from './context/index.js';
export type {
  ContextOptions,
  ContextRelationshipDefinition,
} from './context/index.js';

// Journey Level
export { Journey } from './journey/index.js';
export type { JourneyOptions } from './journey/index.js';

export { Action } from './action/index.js';
export type { ActionOptions, ActionTrigger } from './action/index.js';

// Expectation Level
export { Expectation } from './expectation/index.js';
export type { ExpectationOptions } from './expectation/index.js';

export { Interaction } from './interaction/index.js';
export type {
  InteractionOptions,
  InteractionData,
  InteractionQuality,
  InteractionSecurity,
  InteractionProtocol,
  InteractionErrorHandling,
  InteractionVersioning,
  InteractionObservability,
  FrontendInteractionConfig,
  BackendInteractionConfig,
  DataInteractionConfig,
  DeviceInteractionConfig,
  InterpersonalInteractionConfig,
  ManualInteractionConfig,
  OrganizationalInteractionConfig,
} from './interaction/index.js';

export { Collaboration } from './collaboration/index.js';
export type {
  CollaborationOptions,
  CollaborationParticipant,
  CollaborationArtifact,
  CollaborationOutcome,
} from './collaboration/index.js';

export { Stakeholder } from './stakeholder/index.js';
export type { StakeholderOptions } from './stakeholder/index.js';

export { Persona, PersonaType } from './persona/index.js';
export type { PersonaOptions } from './persona/index.js';

// Behavioral Level
export { Behavior, BehaviorComplexity, BehaviorScope, BehaviorReusability } from './behavior/index.js';
export type { BehaviorOptions, BehaviorPerformance, BehaviorValidation, BehaviorTracing } from './behavior/index.js';

export {
  Witness,
  WitnessType,
  WitnessPriority,
  WitnessIsolationLevel,
  WitnessRiskLevel,
  WitnessCoverageScope,
} from './witness/index.js';
export type {
  WitnessOptions,
  WitnessExecution,
  WitnessFixtures,
  WitnessCoverage,
} from './witness/index.js';

export { Attribute } from './attribute/index.js';
export type { AttributeOptions } from './attribute/index.js';
