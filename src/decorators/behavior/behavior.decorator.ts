/**
 * @Behavior Decorator
 * Marks a class as a Behavior (executable behavior)
 * @module aabha/decorators/behavior
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 *
 */

import type {
  Constructor,
  WithBehavior,
  WithStakeholder,
  WithMetric,
  BaseDecoratorOptions,
} from '../../types/index.js';
import { applyBrand } from '../../internal/brand.utils.js';

// ============================================================================
// ENUMERATIONS
// ============================================================================

/**
 * Behavior complexity classification
 *
 * Categorizes behaviors by their implementation complexity to guide
 * development effort, testing requirements, and risk assessment.
 *
 * - **Simple**: Straightforward logic, minimal dependencies, quick to implement
 * - **Moderate**: Some business logic complexity, multiple dependencies, standard testing
 * - **Complex**: Intricate logic, many dependencies, extensive testing required
 *
 * @example
 * ```typescript
 * @Behavior({
 *   name: 'Validate Email Format',
 *   complexity: BehaviorComplexity.Simple,  // Simple regex validation
 * })
 * class ValidateEmailBehavior {}
 * ```
 *
 * @example
 * ```typescript
 * @Behavior({
 *   name: 'Process Loan Application',
 *   complexity: BehaviorComplexity.Complex,  // Credit scoring, risk assessment, compliance
 * })
 * class ProcessLoanApplicationBehavior {}
 * ```
 */
export enum BehaviorComplexity {
  /**
   * Simple behavior with straightforward logic
   *
   * - Minimal business rules
   * - Few or no external dependencies
   * - Easy to test and maintain
   * - Low risk of bugs
   *
   * @example Email format validation, simple calculations
   */
  Simple = 'simple',

  /**
   * Moderate complexity with standard business logic
   *
   * - Multiple business rules
   * - Some external dependencies
   * - Standard testing approach
   * - Moderate risk management
   *
   * @example User registration, order processing
   */
  Moderate = 'moderate',

  /**
   * Complex behavior with intricate logic
   *
   * - Complex business rules and workflows
   * - Many external dependencies
   * - Extensive testing required
   * - High risk, needs careful management
   *
   * @example KYC verification, fraud detection, loan approval
   */
  Complex = 'complex',
}

/**
 * Behavior scope classification
 *
 * Defines the execution boundary and composition level of a behavior.
 *
 * - **Atomic**: Single, indivisible operation (cannot be broken down further)
 * - **Composite**: Orchestrates multiple atomic or composite behaviors
 * - **Workflow**: End-to-end process spanning multiple steps/behaviors
 *
 * @example
 * ```typescript
 * @Behavior({
 *   name: 'Validate Email Format',
 *   scope: BehaviorScope.Atomic,  // Single validation operation
 * })
 * class ValidateEmailBehavior {}
 * ```
 *
 * @example
 * ```typescript
 * @Behavior({
 *   name: 'Complete Customer Onboarding',
 *   scope: BehaviorScope.Workflow,  // Multi-step process
 * })
 * class CustomerOnboardingBehavior {}
 * ```
 */
export enum BehaviorScope {
  /**
   * Atomic behavior - single, indivisible operation
   *
   * - Cannot be meaningfully broken down
   * - All-or-nothing execution
   * - Typically transactional
   * - Clear success/failure states
   *
   * @example Send email, validate field, update single record
   */
  Atomic = 'atomic',

  /**
   * Composite behavior - orchestrates multiple behaviors
   *
   * - Combines atomic or other composite behaviors
   * - May have partial success states
   * - Coordinate multiple operations
   * - Transaction boundaries may vary
   *
   * @example User registration (validate + create account + send email)
   */
  Composite = 'composite',

  /**
   * Workflow behavior - end-to-end business process
   *
   * - Multiple steps/stages
   * - May span time or human interaction
   * - Complex state management
   * - Often asynchronous
   *
   * @example Loan approval workflow, customer onboarding journey
   */
  Workflow = 'workflow',
}

/**
 * Behavior reusability classification
 *
 * Indicates whether the behavior is intended for single use or reuse across
 * multiple contexts.
 *
 * - **SingleUse**: Specific to one context, not designed for reuse
 * - **Reusable**: General-purpose, can be used in multiple contexts
 * - **Template**: Abstract pattern that must be customized for each use
 *
 * @example
 * ```typescript
 * @Behavior({
 *   name: 'Validate Email Format',
 *   reusability: BehaviorReusability.Reusable,  // Used across many features
 * })
 * class ValidateEmailBehavior {}
 * ```
 */
export enum BehaviorReusability {
  /**
   * Single-use behavior specific to one context
   *
   * - Tightly coupled to specific use case
   * - Not designed for reuse
   * - May have context-specific logic
   *
   * @example Generate Q4 2025 financial report
   */
  SingleUse = 'single-use',

  /**
   * Reusable behavior applicable across contexts
   *
   * - General-purpose implementation
   * - No context-specific coupling
   * - Designed for wide reuse
   * - Well-tested and stable
   *
   * @example Validate email, send notification, format currency
   */
  Reusable = 'reusable',

  /**
   * Template behavior requiring customization
   *
   * - Abstract pattern or framework
   * - Must be customized per use case
   * - Defines structure, not specifics
   * - Reusable pattern, not implementation
   *
   * @example Generic approval workflow, standard validation pattern
   */
  Template = 'template',
}

// ============================================================================
// SUB-INTERFACES
// ============================================================================

/**
 * Behavior performance and execution configuration
 *
 * Defines performance expectations, timeouts, retry behavior, and caching strategy.
 * Helps teams understand execution characteristics and optimize accordingly.
 *
 * @example
 * ```typescript
 * performance: {
 *   expectedDuration: '< 3 seconds',
 *   timeout: 30000,  // 30 seconds
 *   retries: 2,
 *   cacheable: false
 * }
 * ```
 */
export interface BehaviorPerformance {
  /**
   * Expected execution duration (human-readable)
   *
   * Helps set performance expectations and identify bottlenecks.
   *
   * @example '< 100ms', '< 3 seconds', '< 1 minute'
   * @example 'Real-time', 'Near real-time', 'Batch (overnight)'
   */
  expectedDuration?: string;

  /**
   * Maximum execution time in milliseconds
   *
   * Behavior will fail if execution exceeds this timeout.
   * Prevents runaway processes and ensures system responsiveness.
   *
   * @default undefined (no timeout)
   * @example 5000 (5 seconds)
   * @example 30000 (30 seconds)
   */
  timeout?: number;

  /**
   * Number of retry attempts on failure
   *
   * For idempotent operations, automatic retries can improve reliability.
   * Non-idempotent operations should set retries: 0.
   *
   * @default 0 (no retries)
   * @example 2 (try 3 times total: initial + 2 retries)
   */
  retries?: number;

  /**
   * Whether results can be cached
   *
   * Enables performance optimization for deterministic behaviors.
   * Set to false for behaviors with side effects or time-sensitive data.
   *
   * @default false
   * @example true (pure function, deterministic results)
   * @example false (has side effects, time-sensitive)
   */
  cacheable?: boolean;
}

/**
 * Behavior validation and invariant configuration
 *
 * Defines how strictly pre/postconditions are enforced and what invariants
 * must hold throughout execution. Enables runtime contract validation.
 *
 * @example
 * ```typescript
 * validation: {
 *   strictPreconditions: true,   // Fail fast if preconditions not met
 *   strictPostconditions: true,  // Verify postconditions before returning
 *   invariants: [
 *     'Customer balance must never go negative',
 *     'Audit trail must be immutable'
 *   ]
 * }
 * ```
 */
export interface BehaviorValidation {
  /**
   * Enforce preconditions strictly
   *
   * When true, behavior fails immediately if preconditions are not met.
   * When false, preconditions are advisory/documentation only.
   *
   * @default false (advisory only)
   */
  strictPreconditions?: boolean;

  /**
   * Enforce postconditions strictly
   *
   * When true, verify all postconditions before returning success.
   * When false, postconditions are advisory/documentation only.
   *
   * @default false (advisory only)
   */
  strictPostconditions?: boolean;

  /**
   * Invariants that must hold throughout execution
   *
   * Conditions that must remain true before, during, and after execution.
   * Useful for ensuring data integrity and business rules.
   *
   * @example
   * ```typescript
   * invariants: [
   *   'Account balance >= 0',
   *   'Transaction log is append-only',
   *   'User email remains unique'
   * ]
   * ```
   */
  invariants?: string[];
}

/**
 * Behavior observability and tracing configuration
 *
 * Defines monitoring, metrics collection, and logging for the behavior.
 * Enables production observability and debugging.
 *
 * @example
 * ```typescript
 * tracing: {
 *   enabled: true,
 *   metrics: [KYCVerificationDuration, KYCAPISuccessRate],  // @Metric class references
 *   logLevel: 'info'
 * }
 * ```
 */
export interface BehaviorTracing {
  /**
   * Enable observability tracing for this behavior
   *
   * When true, execution is instrumented with tracing, metrics, and logs.
   * When false, minimal logging only.
   *
   * @default true (for production behaviors)
   */
  enabled?: boolean;

  /**
   * Metrics to track for this behavior
   *
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Metric
   *
   * Reference actual metric classes (not strings) for type safety and
   * refactoring support. Metrics track performance, success rates, errors, etc.
   *
   * @example
   * ```typescript
   * metrics: [
   *   PaymentProcessingDuration,   // @Metric class
   *   PaymentSuccessRate,           // @Metric class
   *   PaymentErrorRate              // @Metric class
   * ]
   * ```
   */
  metrics?: WithMetric<Constructor>[];

  /**
   * Logging level for this behavior
   *
   * Controls verbosity of logging output. Higher levels provide more detail
   * but may impact performance and storage.
   *
   * - **error**: Only log errors (production default)
   * - **warn**: Log warnings and errors
   * - **info**: Log important events, warnings, and errors
   * - **debug**: Verbose logging for troubleshooting
   *
   * @default 'error'
   */
  logLevel?: 'error' | 'warn' | 'info' | 'debug';
}

/**
 * Behavior decorator options
 */
export interface BehaviorOptions extends BaseDecoratorOptions {
  /**
   * Behavior name (required)
   */
  name: string;

  /**
   * Stakeholders who participate in this behavior
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Stakeholder
   *
   * Behaviors can involve multiple stakeholders. For example, email validation
   * might involve the EmailValidationSystem and AuditLogSystem stakeholders.
   *
   * @example
   * ```typescript
   * participants: [EmailValidationServiceStakeholder, AuditLogSystemStakeholder]
   * ```
   */
  participants?: WithStakeholder<Constructor>[];

  /**
   * Behavior implementation description
   */
  implementation?: string;

  /**
   * Pre-conditions that must be met
   */
  preconditions?: string[];

  /**
   * Post-conditions that will be true after execution
   */
  postconditions?: string[];

  /**
   * Side effects of this behavior
   */
  sideEffects?: string[];

  /**
   * Human-readable description
   */
  description?: string;

  /**
   * Tags for categorization
   */
  tags?: string[];

  // ----------------------------------------
  // Section: Behavior Classification
  // ----------------------------------------

  /**
   * Behavior complexity level
   *
   * Categorizes the implementation complexity to guide development effort,
   * testing requirements, and risk assessment.
   *
   * @see BehaviorComplexity
   * @default undefined (unspecified)
   *
   * @example
   * ```typescript
   * complexity: BehaviorComplexity.Simple  // For straightforward validation
   * complexity: BehaviorComplexity.Complex // For KYC verification
   * ```
   */
  complexity?: BehaviorComplexity;

  /**
   * Behavior scope classification
   *
   * Defines whether this is an atomic operation, composite behavior,
   * or full workflow.
   *
   * @see BehaviorScope
   * @default undefined (unspecified)
   *
   * @example
   * ```typescript
   * scope: BehaviorScope.Atomic      // Single operation
   * scope: BehaviorScope.Composite   // Orchestrates multiple behaviors
   * scope: BehaviorScope.Workflow    // End-to-end process
   * ```
   */
  scope?: BehaviorScope;

  /**
   * Behavior reusability classification
   *
   * Indicates whether this behavior is designed for reuse or is
   * specific to a single context.
   *
   * @see BehaviorReusability
   * @default undefined (unspecified)
   *
   * @example
   * ```typescript
   * reusability: BehaviorReusability.Reusable   // General-purpose
   * reusability: BehaviorReusability.SingleUse  // Context-specific
   * ```
   */
  reusability?: BehaviorReusability;

  // ----------------------------------------
  // Section: Performance & Execution
  // ----------------------------------------

  /**
   * Performance configuration
   *
   * Defines performance expectations, timeouts, retry behavior,
   * and caching strategy.
   *
   * @see BehaviorPerformance
   *
   * @example
   * ```typescript
   * performance: {
   *   expectedDuration: '< 3 seconds',
   *   timeout: 30000,
   *   retries: 2,
   *   cacheable: false
   * }
   * ```
   */
  performance?: BehaviorPerformance;

  // ----------------------------------------
  // Section: Validation & Invariants
  // ----------------------------------------

  /**
   * Validation configuration
   *
   * Defines how strictly pre/postconditions are enforced and what
   * invariants must hold throughout execution.
   *
   * @see BehaviorValidation
   *
   * @example
   * ```typescript
   * validation: {
   *   strictPreconditions: true,
   *   strictPostconditions: true,
   *   invariants: ['Balance >= 0', 'Audit trail immutable']
   * }
   * ```
   */
  validation?: BehaviorValidation;

  // ----------------------------------------
  // Section: Observability & Tracing
  // ----------------------------------------

  /**
   * Observability and tracing configuration
   *
   * Defines monitoring, metrics collection, and logging for production
   * observability and debugging.
   *
   * COMPILE-TIME TYPE SAFETY: Metrics must be @Metric decorated classes
   *
   * @see BehaviorTracing
   *
   * @example
   * ```typescript
   * tracing: {
   *   enabled: true,
   *   metrics: [KYCVerificationDuration, KYCAPISuccessRate],
   *   logLevel: 'info'
   * }
   * ```
   */
  tracing?: BehaviorTracing;
}

/**
 * @Behavior decorator
 * Marks a class as a Behavior with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Behaviors represent executable actions that implement expectations.
 * They can be reused across multiple expectations.
 *
 * Behaviors contain @Witness methods that prove the behavior works correctly.
 * A witness without a behavior is meaningless.
 *
 * @param options - Behavior configuration
 * @returns Class decorator that brands the class with WithBehavior type
 *
 * @example
 * ```typescript
 * @Behavior({
 *   name: 'Validate Email Format',
 *   participants: [EmailValidationServiceStakeholder, AuditLogSystemStakeholder],
 *   implementation: 'RFC 5322 regex validation + DNS MX record check',
 *   preconditions: ['Email address is provided'],
 *   postconditions: ['Validation result returned', 'Audit log created'],
 *   description: 'Validates email format and DNS records'
 * })
 * class ValidateEmailFormatBehavior {
 *   @Witness({
 *     name: 'Valid Email Format Witness',
 *     type: WitnessType.Unit,
 *     given: ['Email with valid format'],
 *     when: ['Validation executes'],
 *     then: ['Returns true', 'No errors']
 *   })
 *   witnessValidFormat() {
 *     const result = this.validate('test@example.com');
 *     assert(result === true);
 *   }
 *
 *   validate(email: string): boolean {
 *     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
 *   }
 * }
 * ```
 */
export function Behavior(options: BehaviorOptions) {
  return function <T extends Constructor>(
    target: T,
    _context?: ClassDecoratorContext<T>
  ): WithBehavior<T> {
    applyBrand(target, 'behavior');
    void options;
    return target as WithBehavior<T>;
  };
}
