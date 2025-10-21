/**
 * @Step Decorator
 * Marks a class as a Step (granular action within a milestone)
 * @module blueprint/decorators/step
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import { applyBrand } from '../../internal/brand.utils.js';
import type {
  Constructor,
  WithExpectation,
  WithStakeholder,
  WithStep,
} from '../../types/branded-types.js';
import type { BaseDecoratorOptions } from '../../types/decorator-options.types.js';

/**
 * Step decorator options
 */
export interface StepOptions extends BaseDecoratorOptions {
  /**
   * Step name (required)
   */
  name: string;

  /**
   * Order within milestone (optional for standalone steps)
   * Inline steps should specify order, standalone steps get order from StepReference
   */
  order?: number;

  /**
   * Actor performing this step
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Stakeholder
   *
   * @example
   * ```typescript
   * actor: CustomerStakeholder // Must have @Stakeholder decorator
   * ```
   */
  actor?: WithStakeholder<Constructor>;

  /**
   * Expectations validated by this step
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Expectation
   *
   * @example
   * ```typescript
   * expectations: [PositiveAmountExpectation, ValidFormatExpectation]
   * ```
   */
  expectations?: WithExpectation<Constructor>[];

  /**
   * Can this step be skipped? (default: false)
   */
  optional?: boolean;

  /**
   * Alternative steps that achieve the same goal
   */
  alternatives?: string[];

  /**
   * Is this step reusable across milestones? (default: true for standalone)
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
}

/**
 * @Step decorator
 * Marks a class as a Step with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Steps represent stateless, tactical actions within a milestone.
 * They are granular and can be reused across milestones.
 *
 * Enforces one-way hierarchy: Step knows about Expectations, but Expectations
 * don't know about the Step (enables expectation reusability).
 *
 * @param options - Step configuration
 * @returns Class decorator that brands the class with WithStep type
 *
 * @example
 * ```typescript
 * @Step({
 *   name: 'Enter Credentials',
 *   order: 1,
 *   actor: AccountOwnerStakeholder,
 *   expectations: [ValidFormatExpectation, RequiredFieldsExpectation],
 *   optional: false,
 *   reusable: true
 * })
 * class EnterCredentialsStep {}
 * ```
 */
export function Step(options: StepOptions) {
  return function <T extends Constructor>(
    target: T,
    _context?: ClassDecoratorContext<T>
  ): WithStep<T> {
    applyBrand(target, 'step');
    void options;
    return target as WithStep<T>;
  };
}
