/**
 * @Expectation Decorator
 * Marks a class as an Expectation (stakeholder expectation)
 * @module blueprint/decorators/expectation
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import type {
  Constructor,
  WithExpectation,
  WithStakeholder,
  WithBehavior,
} from '../../types/branded-types.js';
import type { ExpectationPriority } from '../../enums/expectation-priority.enum.js';
import { applyBrand } from '../../internal/brand.utils.js';

/**
 * Expectation decorator options
 */
export interface ExpectationOptions {
  /**
   * Expectation ID (required)
   * Should follow convention: journey-slug-EXP-nnn
   *
   * @example
   * ```typescript
   * expectationId: 'deposit-money-EXP-001'
   * ```
   */
  expectationId: string;

  /**
   * Expectation description (required)
   * Written in Given-When-Then or As-a...I-want...So-that format
   *
   * @example
   * ```typescript
   * description: 'Given a valid account, When depositing money, Then balance should increase'
   * ```
   */
  description: string;

  /**
   * Stakeholder who has this expectation (required)
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Stakeholder
   *
   * @example
   * ```typescript
   * stakeholder: AccountOwnerStakeholder // Must have @Stakeholder decorator
   * ```
   */
  stakeholder: WithStakeholder<Constructor>;

  /**
   * Behaviors that implement this expectation
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Behavior
   *
   * @example
   * ```typescript
   * behaviors: [ValidateAmountBehavior, UpdateBalanceBehavior]
   * ```
   */
  behaviors?: WithBehavior<Constructor>[];

  /**
   * Priority of this expectation
   */
  priority?: ExpectationPriority;

  /**
   * Acceptance criteria (bullet points)
   */
  acceptanceCriteria?: string[];

  /**
   * Business value of this expectation
   */
  businessValue?: string;

  /**
   * Tags for categorization
   */
  tags?: string[];

  /**
   * Human-readable name (defaults to expectationId)
   */
  name?: string;

  /**
   * Extension point for custom metadata
   */
  extensions?: Record<string, unknown>;
}

/**
 * @Expectation decorator
 * Marks a class as an Expectation with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Expectations represent stakeholder expectations that must be met.
 * They are traceable through the hierarchy and linked to behaviors.
 *
 * Enforces one-way hierarchy: Expectation knows about Behaviors, but Behaviors
 * don't know about the Expectation (enables behavior reusability).
 *
 * @param options - Expectation configuration
 * @returns Class decorator that brands the class with WithExpectation type
 *
 * @example
 * ```typescript
 * @Expectation({
 *   expectationId: 'deposit-money-EXP-001',
 *   description: 'Given a valid account, When depositing positive amount, Then balance should increase by deposit amount',
 *   stakeholder: AccountOwnerStakeholder,
 *   behaviors: [ValidateAmountBehavior, UpdateBalanceBehavior],
 *   priority: ExpectationPriority.Critical,
 *   acceptanceCriteria: [
 *     'Amount must be positive',
 *     'Account must be active',
 *     'Balance must increase by exact deposit amount'
 *   ],
 *   businessValue: 'Ensure customer deposits are accurately reflected'
 * })
 * class PositiveDepositExpectation {}
 * ```
 */
export function Expectation(options: ExpectationOptions) {
  return function <T extends Constructor>(
    target: T,
    _context: ClassDecoratorContext<T>
  ): WithExpectation<T> {
    applyBrand(target, 'expectation');
    void options;
    return target as WithExpectation<T>;
  };
}
