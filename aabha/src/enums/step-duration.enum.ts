/**
 * Step Duration Enumeration
 * @module aabha/enums/step-duration
 *
 * Defines the estimated time to complete a step.
 * Used for journey planning, timeout configuration, and user experience design.
 */

/**
 * Duration Estimate for Steps
 *
 * Classifies steps by expected completion time:
 *
 * - **Instant**: < 1 second (system operations)
 * - **Quick**: < 1 minute (simple user actions)
 * - **Short**: 1-5 minutes (moderate user actions)
 * - **Medium**: 5-15 minutes (complex user actions or multi-step processes)
 * - **Long**: > 15 minutes (extensive processes or asynchronous operations)
 *
 * @example
 * // Instant step
 * @Step({
 *   name: 'Generate Account Number',
 *   estimatedDuration: StepDuration.Instant,
 *   automationLevel: StepAutomationLevel.FullyAutomated
 * })
 *
 * // Quick step
 * @Step({
 *   name: 'Enter Email',
 *   estimatedDuration: StepDuration.Quick,
 *   automationLevel: StepAutomationLevel.Manual
 * })
 *
 * // Long step
 * @Step({
 *   name: 'Manual Compliance Review',
 *   estimatedDuration: StepDuration.Long,
 *   timeoutDuration: 'PT1H',
 *   automationLevel: StepAutomationLevel.Manual
 * })
 */
export enum StepDuration {
  /**
   * Instant duration (< 1 second)
   * Near-instantaneous completion, typically system operations
   *
   * Use when:
   * - System performs computation
   * - No user interaction required
   * - Synchronous operation completes immediately
   *
   * Example: Generate UUID, hash password, create database record, send event
   */
  Instant = 'instant',

  /**
   * Quick duration (< 1 minute)
   * Fast completion, typically simple user actions or quick API calls
   *
   * Use when:
   * - Single field input
   * - Simple button click
   * - Fast API call with immediate response
   *
   * Example: Enter email, click checkbox, select dropdown option, verify OTP
   */
  Quick = 'quick',

  /**
   * Short duration (1-5 minutes)
   * Moderate completion time, typically multi-field forms or moderate processing
   *
   * Use when:
   * - Multi-field form entry
   * - Document upload with validation
   * - Moderate API processing
   *
   * Example: Fill personal information form, upload and validate ID document, email verification flow
   */
  Short = 'short',

  /**
   * Medium duration (5-15 minutes)
   * Extended completion time, typically complex forms or multi-step processes
   *
   * Use when:
   * - Complex form with multiple sections
   * - Multi-step wizard
   * - Background job with moderate duration
   *
   * Example: Complete full account application, perform comprehensive KYC check, process batch operation
   */
  Medium = 'medium',

  /**
   * Long duration (> 15 minutes)
   * Extensive completion time, typically async operations or manual reviews
   *
   * Use when:
   * - Manual human review required
   * - Long-running background job
   * - External system integration with delays
   *
   * Example: Manual compliance review, batch processing overnight, external bank verification
   */
  Long = 'long',
}
