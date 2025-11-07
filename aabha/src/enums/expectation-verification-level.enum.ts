/**
 * Expectation verification level enumeration
 * @module aabha/enums
 */

/**
 * Verification levels for expectations
 * Used to determine enforcement strictness and testing requirements
 */
export enum ExpectationVerificationLevel {
  /**
   * Advisory verification
   * Expectation is documented but not actively verified
   * - No automated testing required
   * - Manual review only
   * - Failures do not block deployment
   *
   * Example: Design guidelines, Best practice recommendations
   */
  Advisory = 'advisory',

  /**
   * Monitored verification
   * Expectation is measured but failures are not blocking
   * - Automated monitoring enabled
   * - Alerts on failure but doesn't block
   * - Used for gradual rollout or soft requirements
   *
   * Example: Performance targets during beta, New feature adoption rates
   */
  Monitored = 'monitored',

  /**
   * Enforced verification
   * Expectation must pass for deployment to proceed
   * - Automated testing required
   * - Failures block deployment
   * - Standard production requirement
   *
   * Example: Critical business logic, Security requirements, Core functionality
   */
  Enforced = 'enforced',

  /**
   * Audited verification
   * Expectation is enforced AND compliance is tracked
   * - All enforced checks
   * - Plus: Audit trail maintained
   * - Plus: Compliance reports generated
   * - Required for regulated industries
   *
   * Example: Financial compliance, Healthcare data handling, Legal requirements
   */
  Audited = 'audited',
}
