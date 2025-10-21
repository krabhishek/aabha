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
  WithStakeholder,
  BaseDecoratorOptions,
} from '../../types/index.js';
import { applyBrand } from '../../internal/brand.utils.js';

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
