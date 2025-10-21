/**
 * @Test Decorator
 * Marks a class as a Test (verification test)
 * @module blueprint/decorators/test
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import type { Constructor, WithTest } from '../../types/branded-types.js';
import { applyBrand } from '../../internal/brand.utils.js';

/**
 * Test type enumeration
 */
export enum TestType {
  Unit = 'unit',
  Integration = 'integration',
  E2E = 'e2e',
  Acceptance = 'acceptance',
  Performance = 'performance',
  Security = 'security',
}

/**
 * Test decorator options
 */
export interface TestOptions {
  /**
   * Test name (required)
   */
  name: string;

  /**
   * Type of test
   */
  type?: TestType;

  /**
   * Test description
   */
  description?: string;

  /**
   * Test scenario/case
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
   * Is this test skipped?
   */
  skip?: boolean;

  /**
   * Test timeout in milliseconds
   */
  timeout?: number;

  /**
   * Extension point for custom metadata
   */
  extensions?: Record<string, unknown>;
}

/**
 * @Test decorator
 * Marks a class as a Test with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Tests verify that behaviors work correctly.
 * They are the bottom of the hierarchy and know nothing about parents.
 *
 * @param options - Test configuration
 * @returns Class decorator that brands the class with WithTest type
 *
 * @example
 * ```typescript
 * @Test({
 *   name: 'Positive Amount Test',
 *   type: TestType.Unit,
 *   description: 'Verify that positive amounts are validated correctly',
 *   given: ['Amount is a positive number'],
 *   when: ['Validation is executed'],
 *   then: ['Validation returns true', 'No errors are thrown'],
 * })
 * class PositiveAmountTest {
 *   test() {
 *     const behavior = new ValidatePositiveAmountBehavior();
 *     const result = behavior.validate(100);
 *     assert(result === true);
 *   }
 * }
 * ```
 */
export function Test(options: TestOptions) {
  return function <T extends Constructor>(
    target: T,
    _context: ClassDecoratorContext<T>
  ): WithTest<T> {
    applyBrand(target, 'test');
    void options;
    return target as WithTest<T>;
  };
}
