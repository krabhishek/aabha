/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @Witness Decorator
 * Marks a method as a Witness (verification witness for a behavior)
 * @module aabha/decorators/witness
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import type { WithWitness, BaseDecoratorOptions } from '../../types/index.js';
import { applyBrand } from '../../internal/brand.utils.js';


/**
 * Witness type enumeration
 */
export enum WitnessType {
  Unit = 'unit',
  Integration = 'integration',
  E2E = 'e2e',
  Acceptance = 'acceptance',
  Performance = 'performance',
  Security = 'security',
}

/**
 * Witness decorator options
 */
export interface WitnessOptions extends BaseDecoratorOptions {
  /**
   * Witness name (required)
   */
  name: string;

  /**
   * Type of witness
   */
  type?: WitnessType;

  /**
   * Witness description
   */
  description?: string;

  /**
   * Witness scenario/case
   */
  scenario?: string;

  /**
   * Given conditions
   */
  given?: string[];

  /**
   * When actions
   */
  when?: string[];

  /**
   * Then assertions
   */
  then?: string[];

  /**
   * Tags for categorization
   */
  tags?: string[];

  /**
   * Is this witness skipped?
   */
  skip?: boolean;

  /**
   * Witness timeout in milliseconds
   */
  timeout?: number;
}

/**
 * @Witness decorator
 * Marks a method as a Witness with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Witnesses prove that behaviors work correctly. They must exist within
 * a @Behavior decorated class. A witness without a behavior is meaningless.
 *
 * @param options - Witness configuration
 * @returns Method decorator
 *
 * @example
 * ```typescript
 * @Behavior({
 *   name: 'ValidatePositiveAmount',
 *   participants: [CustomerStakeholder, BankingSystemStakeholder]
 * })
 * class ValidatePositiveAmountBehavior {
 *   @Witness({
 *     name: 'Positive Amount Witness',
 *     type: WitnessType.Unit,
 *     given: ['Amount is a positive number'],
 *     when: ['Validation is executed'],
 *     then: ['Validation returns true', 'No errors are thrown'],
 *   })
 *   witnessPositiveAmount() {
 *     const result = this.validate(100);
 *     assert(result === true);
 *   }
 *
 *   validate(amount: number): boolean {
 *     return amount > 0;
 *   }
 * }
 * ```
 */
export function Witness(options: WitnessOptions) {
  return function <This, Return>(
    target: (this: This, ...args: any[]) => Return,
    _context?: ClassMethodDecoratorContext<This, (this: This, ...args: any[]) => Return>
  ): ((this: This, ...args: any[]) => Return) & WithWitness {
    // Apply brand for compile-time tracking
    applyBrand(target as any, 'witness');
    void options;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return target as any;
  };
}
