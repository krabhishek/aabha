/**
 * Expectation priority enumeration
 * @module aabha/enums
 */

/**
 * Priority levels for expectations
 * Used to determine test execution order and business criticality
 */
export enum ExpectationPriority {
  /**
   * Critical expectation (must pass)
   */
  Critical = 'critical',

  /**
   * High priority expectation
   */
  High = 'high',

  /**
   * Medium priority expectation
   */
  Medium = 'medium',

  /**
   * Low priority expectation
   */
  Low = 'low',
}
