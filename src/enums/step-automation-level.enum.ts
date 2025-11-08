/**
 * Step Automation Level Enumeration
 * @module aabha/enums/step-automation-level
 *
 * Defines the degree of automation for a step's execution.
 * Used to classify steps by human involvement and indicate actor requirements.
 */

/**
 * Automation Level for Steps
 *
 * Specifies how much human involvement is required:
 *
 * - **Manual**: Requires full human action, no automation
 * - **SemiAutomated**: Partial automation with human oversight or intervention
 * - **FullyAutomated**: No human action required, system-driven
 * - **AIAssisted**: AI augments human action with suggestions or automation
 *
 * @example
 * // Manual step
 * @Step({
 *   name: 'Upload ID Document',
 *   automationLevel: StepAutomationLevel.Manual,
 *   actor: CustomerStakeholder
 * })
 *
 * // Fully automated step
 * @Step({
 *   name: 'AI Document Verification',
 *   automationLevel: StepAutomationLevel.FullyAutomated,
 *   actor: SystemStakeholder
 * })
 *
 * // AI-assisted step
 * @Step({
 *   name: 'Risk Assessment',
 *   automationLevel: StepAutomationLevel.AIAssisted,
 *   actor: ComplianceOfficerStakeholder
 * })
 */
export enum StepAutomationLevel {
  /**
   * Manual execution
   * Requires complete human action with no automation
   *
   * Use when:
   * - Human judgment is essential
   * - No automation is possible
   * - Regulatory requirements mandate human action
   *
   * Example: Customer entering personal information, uploading documents
   */
  Manual = 'manual',

  /**
   * Semi-automated execution
   * Partial automation with human oversight or intervention required
   *
   * Use when:
   * - System performs initial processing
   * - Human approval or override needed
   * - Hybrid human-system workflow
   *
   * Example: System flags suspicious transactions, human reviews and approves/rejects
   */
  SemiAutomated = 'semi-automated',

  /**
   * Fully automated execution
   * No human action required, entirely system-driven
   *
   * Use when:
   * - Process can be fully automated
   * - No human judgment needed
   * - System can handle all edge cases
   *
   * Example: Account number generation, automatic email verification, system provisioning
   */
  FullyAutomated = 'fully-automated',

  /**
   * AI-assisted execution
   * AI augments human action with suggestions, predictions, or partial automation
   *
   * Use when:
   * - AI provides recommendations
   * - Human makes final decision with AI support
   * - Intelligent automation enhances manual work
   *
   * Example: AI suggests risk score, human reviews with AI insights; AI pre-fills form, human validates
   */
  AIAssisted = 'ai-assisted',
}
