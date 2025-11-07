/**
 * Step Criticality Enumeration
 * @module aabha/enums/step-criticality
 *
 * Defines the importance level of a step in a journey.
 * Used to determine whether a step can be skipped and impact on journey completion.
 */

/**
 * Criticality Level for Steps
 *
 * Specifies how essential a step is to journey completion:
 *
 * - **Optional**: Step can be skipped without affecting journey success
 * - **Recommended**: Step should be completed but journey can proceed if skipped
 * - **Required**: Step must be completed for journey to succeed
 * - **Critical**: Step is absolutely essential; failure blocks entire journey
 *
 * @example
 * // Optional step
 * @Step({
 *   name: 'Order Physical Card',
 *   criticality: StepCriticality.Optional,
 *   optional: true
 * })
 *
 * // Required step
 * @Step({
 *   name: 'Verify Email',
 *   criticality: StepCriticality.Required,
 *   optional: false
 * })
 *
 * // Critical step
 * @Step({
 *   name: 'KYC Central Bank Check',
 *   criticality: StepCriticality.Critical,
 *   optional: false,
 *   fallbackStep: 'ManualReviewStep'
 * })
 */
export enum StepCriticality {
  /**
   * Optional step
   * Can be skipped without any negative impact on journey completion
   *
   * Use when:
   * - Step is a nice-to-have feature
   * - User can opt out
   * - No business logic depends on this step
   *
   * Example: Order physical card (virtual card is sufficient), subscribe to newsletter, enable notifications
   */
  Optional = 'optional',

  /**
   * Recommended step
   * Should be completed for optimal journey experience but can be skipped
   *
   * Use when:
   * - Step enhances user experience
   * - Provides additional value
   * - Journey can continue but with reduced functionality
   *
   * Example: Set up security questions (can be done later), complete profile details, configure preferences
   */
  Recommended = 'recommended',

  /**
   * Required step
   * Must be completed for journey to successfully conclude
   *
   * Use when:
   * - Step is mandatory per business rules
   * - Regulatory requirement
   * - Data dependency for subsequent steps
   *
   * Example: Email verification, identity document upload, accept terms and conditions
   */
  Required = 'required',

  /**
   * Critical step
   * Absolutely essential; failure blocks entire journey and may require escalation
   *
   * Use when:
   * - Regulatory compliance mandate (no workaround)
   * - Security checkpoint
   * - System integrity depends on success
   *
   * Example: KYC check with central bank, anti-fraud verification, account provisioning
   */
  Critical = 'critical',
}
