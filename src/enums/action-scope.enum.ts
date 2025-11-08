/**
 * Action Scope Enumeration
 * @module aabha/enums/action-scope
 *
 * Defines the impact/granularity level of an action in a journey.
 * Replaces the implicit distinction between Step (atomic) and Milestone (journey-level).
 */

/**
 * Action Scope - Impact/Granularity Level
 *
 * Specifies the scope and business significance of an action:
 *
 * - **Atomic**: Single, indivisible action (granular step)
 * - **Composite**: Groups multiple atomic actions (multi-step process)
 * - **Journey**: Major milestone within a journey (business achievement)
 * - **System**: Cross-journey, system-wide impact (strategic milestone)
 *
 * @example Atomic Action
 * // Granular, single-purpose action
 * @Action({
 *   name: 'User Clicks Submit Button',
 *   actor: CustomerStakeholder,
 *   scope: ActionScope.Atomic
 * })
 *
 * @example Composite Action
 * // Groups related atomic actions
 * @Action({
 *   name: 'Complete Email Verification Flow',
 *   actor: CustomerStakeholder,
 *   scope: ActionScope.Composite
 * })
 *
 * @example Journey Action
 * // Business milestone within journey
 * @Action({
 *   name: 'Email Verified',
 *   actor: CustomerStakeholder,
 *   scope: ActionScope.Journey,
 *   emitsEvent: 'account.email.verified'
 * })
 *
 * @example System Action
 * // Cross-journey, system-wide significance
 * @Action({
 *   name: 'Customer Fully Onboarded',
 *   actor: CustomerStakeholder,
 *   scope: ActionScope.System,
 *   emitsEvent: 'customer.fully.onboarded'
 * })
 */
export enum ActionScope {
  /**
   * Atomic action
   * Single, indivisible action that cannot be meaningfully broken down further
   *
   * Use when:
   * - Action represents a single user interaction or system operation
   * - Action completes a specific, focused task
   * - Action is the smallest unit of work in the journey
   *
   * Characteristics:
   * - Typically does NOT emit business events
   * - Has clear input and output
   * - Usually completes quickly
   * - Can be reused in multiple contexts
   *
   * Example: "User Clicks Submit", "System Validates Email Format",
   *          "Database Saves Record", "API Sends Request"
   */
  Atomic = 'atomic',

  /**
   * Composite action
   * Groups multiple atomic actions into a cohesive multi-step process
   *
   * Use when:
   * - Action represents a sequence of related atomic actions
   * - Action has internal phases or steps
   * - Action needs to coordinate multiple operations
   *
   * Characteristics:
   * - May emit intermediate events
   * - Composes atomic actions via triggers
   * - Has transaction-like semantics (all or nothing)
   * - More complex than atomic, less significant than journey-level
   *
   * Example: "Complete Form Submission Flow", "Process Payment Transaction",
   *          "Verify User Identity"
   */
  Composite = 'composite',

  /**
   * Journey-level action
   * Major milestone or significant achievement within a specific journey
   *
   * Use when:
   * - Action represents a business-meaningful state change
   * - Action marks completion of a major phase
   * - Action has significance to journey stakeholders
   * - Action typically triggers domain events
   *
   * Characteristics:
   * - SHOULD emit business events (emitsEvent property)
   * - Represents progress toward journey goal
   * - Has business reporting significance
   * - May trigger downstream journeys
   *
   * Example: "Email Verified", "KYC Approved", "Account Created",
   *          "Payment Completed", "Order Shipped"
   *
   * Note: This roughly corresponds to the old Milestone component
   */
  Journey = 'journey',

  /**
   * System-level action
   * Cross-journey, system-wide impact with strategic significance
   *
   * Use when:
   * - Action has impact across multiple journeys
   * - Action represents strategic business milestone
   * - Action affects system-wide state or configuration
   * - Action has enterprise-level reporting significance
   *
   * Characteristics:
   * - MUST emit business events (emitsEvent property required)
   * - Cross-journey visibility
   * - Often triggers multiple downstream processes
   * - Has executive dashboard visibility
   * - May represent completion of complex sagas
   *
   * Example: "Customer Fully Onboarded", "Product Successfully Launched",
   *          "Quarterly Goal Achieved", "System Migration Completed"
   */
  System = 'system',
}
