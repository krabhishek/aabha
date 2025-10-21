/**
 * @Behavior Decorator
 * Marks a class as a Behavior (executable behavior)
 * @module blueprint/decorators/behavior
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 *
 * NOTE: Blueprint only includes @Behavior, NOT Logic/Policy/Rule/Specification
 * (those are DDD concepts that belong in bhasha)
 */

import type {
  Constructor,
  WithBehavior,
  WithTest,
} from '../../types/branded-types.js';
import { applyBrand } from '../../internal/brand.utils.js';

/**
 * Behavior decorator options
 */
export interface BehaviorOptions {
  /**
   * Behavior name (required)
   */
  name: string;

  /**
   * Tests that verify this behavior
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Test
   *
   * @example
   * ```typescript
   * tests: [PositiveAmountTest, ValidFormatTest]
   * ```
   */
  tests?: WithTest<Constructor>[];

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

  /**
   * Extension point for custom metadata
   */
  extensions?: Record<string, unknown>;
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
 * Enforces one-way hierarchy: Behavior knows about Tests, but Tests
 * don't know about the Behavior (enables test reusability).
 *
 * @param options - Behavior configuration
 * @returns Class decorator that brands the class with WithBehavior type
 *
 * @example
 * ```typescript
 * @Behavior({
 *   name: 'ValidatePositiveAmount',
 *   tests: [PositiveNumberTest, NonZeroTest],
 *   implementation: 'Check if amount > 0',
 *   preconditions: ['Amount is provided'],
 *   postconditions: ['Amount is validated as positive'],
 *   description: 'Validates that deposit amount is positive'
 * })
 * class ValidatePositiveAmountBehavior {
 *   validate(amount: number): boolean {
 *     return amount > 0;
 *   }
 * }
 * ```
 */
export function Behavior(options: BehaviorOptions) {
  return function <T extends Constructor>(
    target: T,
    _context: ClassDecoratorContext<T>
  ): WithBehavior<T> {
    applyBrand(target, 'behavior');
    void options;
    return target as WithBehavior<T>;
  };
}
