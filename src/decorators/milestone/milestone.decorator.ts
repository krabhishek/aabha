/**
 * @Milestone Decorator
 * Marks a class as a Milestone (business-significant achievement)
 * @module aabha/decorators/milestone
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import type {
  Constructor,
  WithMilestone,
  WithStakeholder,
  WithStep,
  WithExpectation,
} from '../../types/branded-types.js';
import { applyBrand } from '../../internal/brand.utils.js';

/**
 * Step reference for Milestone decorator
 * Allows referencing standalone step classes with explicit ordering
 */
export interface StepReference {
  /**
   * Step class - COMPILE-TIME TYPE SAFETY: Must have @Step decorator
   */
  step: WithStep<Constructor>;

  /**
   * Order in milestone (required for sequencing)
   */
  order: number;

  /**
   * Is this step optional? (default: false)
   */
  optional?: boolean;
}

/**
 * Milestone decorator options
 */
export interface MilestoneOptions {
  /**
   * Milestone name (required)
   */
  name: string;

  /**
   * Stakeholder who owns/drives this milestone (required)
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Stakeholder
   *
   * @example
   * ```typescript
   * stakeholder: AccountOwnerStakeholder // Must have @Stakeholder decorator
   * ```
   */
  stakeholder: WithStakeholder<Constructor>;

  /**
   * Order in journey (optional for standalone milestones)
   * For standalone milestone classes, order is typically specified in Journey.milestones array
   */
  order?: number;

  /**
   * Step references with explicit ordering
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Step
   *
   * @example
   * ```typescript
   * steps: [
   *   { step: ValidateInputStep, order: 1 },
   *   { step: SanitizeDataStep, order: 2 },
   * ]
   * ```
   */
  steps?: StepReference[];

  /**
   * Expectations validated by this milestone
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Expectation
   */
  expectations?: WithExpectation<Constructor>[];

  /**
   * Prerequisites (other milestones that must complete first)
   */
  prerequisites?: string[];

  /**
   * Domain event emitted when this milestone is reached
   * Example: 'user.authenticated', 'kyc.verified', 'payment.authorized'
   */
  businessEvent?: string;

  /**
   * Is this milestone stateful? (default: true)
   * Stateful milestones represent a state change in the domain
   */
  stateful?: boolean;

  /**
   * Is this milestone reusable across journeys? (default: true)
   * Reusable milestones should be defined as standalone classes
   */
  reusable?: boolean;

  /**
   * Human-readable description
   */
  description?: string;

  /**
   * Tags for categorization
   */
  tags?: string[];

  /**
   * Extension point for custom metadata
   */
  extensions?: Record<string, unknown>;
}

/**
 * @Milestone decorator
 * Marks a class as a Milestone with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Milestones represent stateful, business-significant achievements within a journey.
 * They can be reused across multiple journeys.
 *
 * Enforces one-way hierarchy: Milestone knows about Steps, but Steps
 * don't know about the Milestone (enables step reusability).
 *
 * @param options - Milestone configuration
 * @returns Class decorator that brands the class with WithMilestone type
 *
 * @example
 * ```typescript
 * @Milestone({
 *   name: 'User Authenticated',
 *   stakeholder: AccountOwnerStakeholder,
 *   steps: [
 *     { step: EnterCredentialsStep, order: 1 },
 *     { step: ValidateCredentialsStep, order: 2 },
 *     { step: IssueTokenStep, order: 3 },
 *   ],
 *   expectations: [ValidCredentialsExpectation, SecureConnectionExpectation],
 *   businessEvent: 'user.authenticated',
 *   stateful: true,
 *   reusable: true
 * })
 * class UserAuthenticationMilestone {}
 * ```
 */
export function Milestone(options: MilestoneOptions) {
  return function <T extends Constructor>(
    target: T,
    _context?: ClassDecoratorContext<T>
  ): WithMilestone<T> {
    applyBrand(target, 'milestone');
    void options;
    return target as WithMilestone<T>;
  };
}
