/**
 * Expectation complexity enumeration
 * @module aabha/enums
 */

/**
 * Complexity levels for expectations
 * Used to assess implementation effort and coordination requirements
 */
export enum ExpectationComplexity {
  /**
   * Simple expectation requiring minimal effort
   * - Single behavior or straightforward implementation
   * - Limited dependencies
   * - No cross-team coordination
   *
   * Example: Single field validation, basic CRUD operation
   */
  Simple = 'simple',

  /**
   * Moderate expectation requiring medium effort
   * - Multiple behaviors or moderate implementation
   * - Some dependencies
   * - Limited cross-team coordination
   *
   * Example: Form submission with multiple validations, API integration
   */
  Moderate = 'moderate',

  /**
   * Complex expectation requiring significant effort
   * - Many behaviors or complex orchestration
   * - Multiple dependencies
   * - Extensive cross-team coordination
   *
   * Example: Multi-step workflow, distributed transaction, complex business rules
   */
  Complex = 'complex',
}
