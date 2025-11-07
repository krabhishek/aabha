/**
 * Action Decorator
 * @module aabha/decorators/action
 *
 * Unified component that replaces Step and Milestone with a single, event-driven abstraction.
 *
 * ## Design Philosophy
 *
 * Actions represent imperative commands in a journey that cause events and drive progress.
 * They form a forward-looking DAG (Directed Acyclic Graph) where each action declares
 * what comes next via triggers, rather than declaring backward prerequisites.
 *
 * ## Key Concepts
 *
 * - **Journey** = collection of Actions (what should happen)
 * - **Action** = imperative command that causes Events (the "do this" that produces outcomes)
 * - **Event** = business outcome emitted by Action (property `emitsEvent`, not separate component)
 * - **Flow** = emerges from Action → triggers → Action graph
 *
 * ## Scope Levels
 *
 * - **Atomic**: Granular, single-purpose action (e.g., "User Clicks Submit")
 * - **Composite**: Groups multiple atomic actions (e.g., "Complete Email Verification")
 * - **Journey**: Major business milestone (e.g., "Email Verified", "KYC Approved")
 * - **System**: Cross-journey strategic milestone (e.g., "Customer Fully Onboarded")
 *
 * ## Context Injection
 *
 * Context flows into Actions through two paths:
 * 1. **actor** (Stakeholder) - who performs the action
 * 2. **expectations** → provider/consumer (Stakeholders) - who expects what from the action
 *
 * @example Atomic Action
 * ```typescript
 * @Action({
 *   name: 'User Clicks Submit Button',
 *   actor: CustomerStakeholder,
 *   scope: ActionScope.Atomic,
 *   automationLevel: StepAutomationLevel.Manual,
 *   estimatedDuration: StepDuration.Instant,
 *   triggers: [{ action: ValidateFormAction }]
 * })
 * export class ClickSubmitAction {}
 * ```
 *
 * @example Journey-Level Action (like Milestone)
 * ```typescript
 * @Action({
 *   name: 'Email Verified',
 *   actor: CustomerStakeholder,
 *   scope: ActionScope.Journey,
 *   emitsEvent: 'account.email.verified',
 *   automationLevel: StepAutomationLevel.SemiAutomated,
 *   criticality: StepCriticality.Critical,
 *   expectations: [FastEmailResponseExpectation],
 *   triggers: [{ action: StartKYCAction }]
 * })
 * export class EmailVerifiedAction {}
 * ```
 *
 * @example Conditional Branching
 * ```typescript
 * @Action({
 *   name: 'AI Verifies Document',
 *   actor: SystemStakeholder,
 *   scope: ActionScope.Atomic,
 *   triggers: [
 *     { action: ApproveAction, condition: 'aiConfidence >= 95' },
 *     { action: ManualReviewAction, condition: 'aiConfidence < 95' }
 *   ]
 * })
 * export class AIVerifyDocumentAction {}
 * ```
 */

import type {
  Constructor,
  WithAction,
  WithExpectation,
  WithStakeholder,
  WithCollaboration,
} from '../../types/index.js';
import type { ActionScope } from '../../enums/action-scope.enum.js';
import type {
  StepAutomationLevel,
  StepCriticality,
  StepDuration,
  StepExecutionMode,
} from '../../enums/index.js';
import type { BaseDecoratorOptions } from '../../types/decorator-options.types.js';
import { applyBrand } from '../../internal/brand.utils.js';

/**
 * Action Trigger Configuration
 *
 * Defines an action that should be triggered after the current action completes,
 * with an optional condition for conditional branching.
 *
 * This creates a forward-looking DAG where actions declare what comes next,
 * rather than declaring prerequisites (backward-looking).
 *
 * @example Unconditional Trigger
 * ```typescript
 * @Action({
 *   name: 'User Clicks Submit',
 *   triggers: [
 *     { action: ValidateFormAction }  // Always triggered
 *   ]
 * })
 * ```
 *
 * @example Conditional Branching
 * ```typescript
 * @Action({
 *   name: 'AI Verifies Document',
 *   triggers: [
 *     { action: ApproveAutomaticallyAction, condition: 'aiConfidence >= 95' },
 *     { action: ManualReviewAction, condition: 'aiConfidence < 95' }
 *   ]
 * })
 * ```
 *
 * @example Parallel Triggers
 * ```typescript
 * @Action({
 *   name: 'Account Created',
 *   triggers: [
 *     { action: IssueVirtualCardAction },   // Both triggered
 *     { action: OrderPhysicalCardAction }    // in parallel
 *   ]
 * })
 * ```
 */
export interface ActionTrigger {
  /**
   * The action to trigger
   *
   * Type-safe reference to another Action class.
   * The referenced action will be triggered when this action completes successfully.
   *
   * @example
   * action: SendVerificationEmailAction
   */
  action: WithAction<Constructor>;

  /**
   * Optional condition expression
   *
   * Simple boolean expression that determines whether this trigger fires.
   * If condition is present and evaluates to false, this trigger is skipped.
   *
   * Use for:
   * - Conditional branching (if-then-else logic)
   * - Dynamic routing based on action outcomes
   * - Feature flags or A/B testing paths
   *
   * Format:
   * - Simple comparisons: 'aiConfidence < 95', 'accountType === "premium"'
   * - Boolean checks: 'isVerified', 'hasPermission'
   * - Compound expressions: 'age >= 18 && hasConsent'
   *
   * Note: This is design-time specification. Runtime evaluation is implementation-specific.
   *
   * @example
   * condition: 'aiConfidence < 95'
   * condition: 'accountType === "premium"'
   * condition: 'isFirstTimeUser && needsOnboarding'
   */
  condition?: string;
}

/**
 * Action Options Interface
 *
 * Unified component that replaces Step and Milestone.
 * Merges properties from both plus new event-driven capabilities.
 *
 * ## Property Groups
 *
 * 1. **Core Identity** (Required): name, actor, scope
 * 2. **Event Emission** (Optional): emitsEvent
 * 3. **Flow Control - DAG** (Optional): triggers, order
 * 4. **Flow Classification** (Optional): executionMode, automationLevel, criticality, estimatedDuration, parallelGroup
 * 5. **Error Handling** (Optional): fallbackAction, compensatingAction, maxRetries, timeoutDuration, skipOnError
 * 6. **Expectations** (Optional): expectations
 * 7. **Metadata** (Inherited): description, tags, extensions
 */
export interface ActionOptions extends BaseDecoratorOptions {
  // ============================================================================
  // CORE IDENTITY (Required)
  // ============================================================================

  /**
   * Action name - imperative, future-tense
   *
   * Naming conventions by scope:
   * - Atomic: "User Clicks Submit", "System Validates Email", "API Sends Request"
   * - Composite: "Complete Email Verification", "Process Payment"
   * - Journey: "Email Verified", "KYC Approved", "Account Created" (outcome-focused)
   * - System: "Customer Fully Onboarded", "Product Launched" (strategic outcomes)
   *
   * @example
   * name: 'User Clicks Submit Button'
   * name: 'Email Verified'
   * name: 'System Sends Verification Email'
   */
  name: string;

  /**
   * Actor - who performs this action (REQUIRED)
   *
   * The stakeholder who executes this action. Provides primary context injection.
   *
   * For manual actions: Human stakeholder (Customer, Employee, Partner)
   * For automated actions: System stakeholder
   *
   * @example
   * actor: DigitalFirstCustomerStakeholder
   * actor: FinanceOperationsManagerStakeholder
   * actor: SystemStakeholder
   */
  actor: WithStakeholder<Constructor>;

  /**
   * Scope - impact/granularity level (REQUIRED)
   *
   * Defines the business significance and impact level of this action.
   *
   * - **Atomic**: Single, indivisible action (granular step)
   * - **Composite**: Groups multiple atomic actions
   * - **Journey**: Major milestone within a journey
   * - **System**: Cross-journey, system-wide impact
   *
   * See ActionScope enum for detailed guidance.
   *
   * @example
   * scope: ActionScope.Atomic
   * scope: ActionScope.Journey
   */
  scope: ActionScope;

  // ============================================================================
  // EVENT EMISSION (Optional)
  // ============================================================================

  /**
   * Business event emitted when action completes successfully
   *
   * Format: domain.entity.action (e.g., 'account.email.verified')
   *
   * Recommended for:
   * - Journey scope: SHOULD have emitsEvent
   * - System scope: MUST have emitsEvent
   * - Atomic/Composite: typically should NOT have emitsEvent
   *
   * Events enable:
   * - Event-driven architecture
   * - Downstream journey triggering
   * - Business reporting and analytics
   * - Audit trail and compliance
   *
   * @example
   * emitsEvent: 'account.email.verified'
   * emitsEvent: 'kyc.check.approved'
   * emitsEvent: 'customer.fully.onboarded'
   */
  emitsEvent?: string;

  // ============================================================================
  // FLOW CONTROL - DAG STRUCTURE (Optional)
  // ============================================================================

  /**
   * Actions triggered by this action (forward-looking DAG)
   *
   * Defines what actions should execute after this action completes successfully.
   * Can include optional conditions for branching logic.
   *
   * This creates a forward-looking DAG where actions declare what comes next,
   * rather than declaring prerequisites (backward-looking).
   *
   * Use cases:
   * - Sequential flow: triggers: [{ action: NextAction }]
   * - Parallel flow: triggers: [{ action: ActionA }, { action: ActionB }]
   * - Conditional branching: triggers: [{ action: A, condition: 'x' }, { action: B, condition: 'y' }]
   *
   * @example Sequential
   * triggers: [{ action: SendVerificationEmailAction }]
   *
   * @example Conditional Branching
   * triggers: [
   *   { action: AutoApproveAction, condition: 'aiConfidence >= 95' },
   *   { action: ManualReviewAction, condition: 'aiConfidence < 95' }
   * ]
   *
   * @example Parallel
   * triggers: [
   *   { action: IssueVirtualCardAction },
   *   { action: OrderPhysicalCardAction }
   * ]
   */
  triggers?: ActionTrigger[];

  /**
   * Order hint for sequencing (optional)
   *
   * Provides a numerical hint for action ordering within a journey.
   * Journey may use this for display/reporting, but DAG topology (triggers) takes precedence for execution.
   *
   * Use when:
   * - Journey needs display ordering separate from execution flow
   * - Multiple entry points exist and order clarifies intended sequence
   * - Reporting and visualization benefit from explicit ordering
   *
   * @default undefined (no ordering constraint)
   *
   * @example
   * order: 1  // First action in journey
   * order: 5  // Fifth action in sequence
   */
  order?: number;

  // ============================================================================
  // FLOW CLASSIFICATION (Optional)
  // ============================================================================

  /**
   * Execution mode - how this action executes relative to others
   *
   * - **Sequential**: Runs in order, one after another (default)
   * - **Parallel**: Can run simultaneously with actions in same parallelGroup
   * - **Conditional**: Only runs if trigger conditions are met
   *
   * @default Sequential
   *
   * @example
   * executionMode: StepExecutionMode.Parallel
   * executionMode: StepExecutionMode.Conditional
   */
  executionMode?: StepExecutionMode;

  /**
   * Automation level - who/what performs this action
   *
   * - **Manual**: Human performs action manually
   * - **SemiAutomated**: System assists, human approves/reviews
   * - **FullyAutomated**: System performs entirely without human intervention
   * - **AIAssisted**: AI augments human action with suggestions
   *
   * Alignment with actor:
   * - Manual/AIAssisted → Human stakeholder actor
   * - FullyAutomated → System stakeholder actor
   * - SemiAutomated → Can be either
   *
   * @example
   * automationLevel: StepAutomationLevel.Manual
   * automationLevel: StepAutomationLevel.FullyAutomated
   */
  automationLevel?: StepAutomationLevel;

  /**
   * Criticality - importance to journey success
   *
   * - **Optional**: Can be skipped without impact
   * - **Recommended**: Should complete but not required
   * - **Required**: Must complete for journey success
   * - **Critical**: Failure blocks entire journey
   *
   * Constraints:
   * - Critical actions CANNOT have skipOnError: true
   * - Optional criticality conflicts with required business logic
   *
   * @example
   * criticality: StepCriticality.Required
   * criticality: StepCriticality.Critical
   */
  criticality?: StepCriticality;

  /**
   * Estimated duration for completion
   *
   * - **Instant**: < 1 second (system operations)
   * - **Quick**: < 1 minute (simple user actions)
   * - **Short**: 1-5 minutes (moderate user actions)
   * - **Medium**: 5-15 minutes (complex processes)
   * - **Long**: > 15 minutes (extensive processes, manual reviews)
   *
   * Used for:
   * - Timeout configuration guidance
   * - UX loading state planning
   * - Journey completion time estimation
   *
   * @example
   * estimatedDuration: StepDuration.Instant
   * estimatedDuration: StepDuration.Long
   */
  estimatedDuration?: StepDuration;

  /**
   * Parallel group identifier
   *
   * Actions with the same parallelGroup can execute simultaneously.
   * Used when executionMode is Parallel.
   *
   * Use cases:
   * - Independent operations that can run concurrently
   * - Performance optimization through parallelization
   * - Fan-out patterns
   *
   * @example
   * parallelGroup: 'card-issuance'
   * parallelGroup: 'verification-checks'
   */
  parallelGroup?: string;

  // ============================================================================
  // ERROR HANDLING & RESILIENCE (Optional)
  // ============================================================================

  /**
   * Fallback action to execute on failure
   *
   * If this action fails, attempt the fallback action instead.
   * Enables graceful degradation and alternative paths.
   *
   * Use cases:
   * - AI verification fails → Manual review
   * - Primary API unavailable → Backup API
   * - Automated process fails → Human intervention
   *
   * Constraints:
   * - Fallback action must exist
   * - Avoid mutual fallback loops (A → B, B → A)
   *
   * @example
   * fallbackAction: ManualReviewAction
   * fallbackAction: BackupAPIAction
   */
  fallbackAction?: WithAction<Constructor>;

  /**
   * Compensating action for rollback/undo (saga pattern)
   *
   * Action to execute if downstream actions fail and this action needs to be undone.
   * Enables distributed transaction compensation and saga patterns.
   *
   * Use cases:
   * - Undo state changes if journey fails later
   * - Refund payment if order processing fails
   * - Delete account if verification fails
   * - Rollback resource allocation
   *
   * Best practices:
   * - Journey and System scope actions should consider compensatingAction
   * - State-changing actions benefit from compensation
   * - Idempotent compensation operations preferred
   *
   * @example
   * compensatingAction: RollbackAccountCreationAction
   * compensatingAction: RefundPaymentAction
   */
  compensatingAction?: WithAction<Constructor>;

  /**
   * Maximum retry attempts on failure
   *
   * How many times to retry this action if it fails before giving up.
   *
   * @default 0 (no retries)
   * @min 0
   * @max 10
   *
   * Recommendations:
   * - Idempotent actions: 3-5 retries
   * - Non-idempotent actions: 0-1 retries
   * - Critical actions: Pair with fallbackAction
   * - Always pair with timeoutDuration
   *
   * @example
   * maxRetries: 3
   * maxRetries: 0  // No retries
   */
  maxRetries?: number;

  /**
   * Timeout duration (ISO 8601 format)
   *
   * Maximum time to wait for action completion before considering it failed.
   *
   * Format: ISO 8601 duration (PT = Period of Time)
   * - PT30S = 30 seconds
   * - PT2M = 2 minutes
   * - PT1H = 1 hour
   * - PT5M30S = 5 minutes 30 seconds
   *
   * Recommendations:
   * - Base on estimatedDuration (2-3x estimated)
   * - Always set for actions with maxRetries
   * - Critical actions should have timeouts
   * - Long-running actions need realistic timeouts
   *
   * @example
   * timeoutDuration: 'PT2M'    // 2 minutes
   * timeoutDuration: 'PT30S'   // 30 seconds
   * timeoutDuration: 'PT1H'    // 1 hour
   */
  timeoutDuration?: string;

  /**
   * Skip on error - continue journey if this action fails
   *
   * If true, journey continues even if this action fails.
   * Enables optional/best-effort actions.
   *
   * @default false (action failure stops journey)
   *
   * Use cases:
   * - Optional features (e.g., analytics tracking)
   * - Nice-to-have operations (e.g., send notification)
   * - Non-critical integrations
   *
   * Constraints:
   * - CANNOT be true if criticality is Critical or Required
   * - Consider if action is truly optional
   *
   * @example
   * skipOnError: true  // Journey continues on failure
   */
  skipOnError?: boolean;

  // ============================================================================
  // EXPECTATIONS (Optional)
  // ============================================================================

  /**
   * Expectations from stakeholders for this action
   *
   * Defines what stakeholders expect from this action in terms of:
   * - Quality (SLOs, SLIs)
   * - Verification requirements
   * - Observability needs
   * - Business context
   *
   * Expectations link to:
   * - Interactions (technical contracts)
   * - Behaviors (implementations)
   * - Witnesses (verification)
   *
   * Context injection:
   * - Expectations have provider/consumer stakeholders
   * - Provides additional context beyond the actor
   *
   * @example
   * expectations: [
   *   FastEmailResponseExpectation,
   *   SecureAuthenticationExpectation
   * ]
   */
  expectations?: WithExpectation<Constructor>[];

  /**
   * Collaboration pattern for this action (optional)
   *
   * Links this action to a multi-stakeholder collaboration pattern.
   * Use when this action involves or represents a complex collaboration
   * between multiple stakeholders (e.g., meetings, reviews, approvals).
   *
   * The collaboration decorator models the human coordination aspects,
   * while the action models the business workflow.
   *
   * COMPILE-TIME TYPE SAFETY: Must be @Collaboration decorated class
   *
   * @example Action representing a meeting
   * ```typescript
   * @Action({
   *   name: 'Conduct Monthly Investment Review',
   *   actor: InvestorStakeholder,
   *   scope: ActionScope.Journey,
   *   collaboration: InvestmentCommitteeMeetingCollaboration,
   *   triggers: [{ action: UpdatePortfolioAction }]
   * })
   * export class MonthlyInvestmentReviewAction {}
   * ```
   *
   * @example Action involving manual review
   * ```typescript
   * @Action({
   *   name: 'Manual Compliance Review',
   *   actor: ComplianceOfficerStakeholder,
   *   scope: ActionScope.Composite,
   *   collaboration: AccountOpeningComplianceReviewCollaboration,
   *   estimatedDuration: StepDuration.Long,
   *   triggers: [
   *     { action: ApproveAccountAction, condition: 'reviewPassed' },
   *     { action: RejectAccountAction, condition: 'reviewFailed' }
   *   ]
   * })
   * export class ManualComplianceReviewAction {}
   * ```
   */
  collaboration?: WithCollaboration<Constructor>;

  // ============================================================================
  // METADATA (Inherited from BaseDecoratorOptions)
  // ============================================================================

  /**
   * Human-readable description
   *
   * Detailed explanation of what this action does, when it happens, and why it matters.
   * Use present tense for atomic actions, past tense for journey/system actions.
   *
   * @inherited from BaseDecoratorOptions
   *
   * @example
   * description: 'Customer submits the account opening form with email and password'
   * description: 'Email verification is complete and customer can proceed to identity verification'
   */
  // description?: string;

  /**
   * Tags for categorization
   *
   * @inherited from BaseDecoratorOptions
   *
   * @example
   * tags: ['authentication', 'customer-facing', 'critical-path']
   */
  // tags?: string[];

  /**
   * Custom metadata extension point
   *
   * @inherited from BaseDecoratorOptions
   *
   * @example
   * extensions: {
   *   uiComponent: 'SubmitButton',
   *   analyticsEvent: 'form_submitted',
   *   featureFlag: 'new-onboarding-flow'
   * }
   */
  // extensions?: Record<string, unknown>;
}

/**
 * Action Decorator
 *
 * Unified component replacing Step and Milestone with event-driven action abstraction.
 *
 * @param options - Action configuration options
 * @returns Class decorator function
 *
 * @example Atomic Action
 * ```typescript
 * @Action({
 *   name: 'User Enters Email and Password',
 *   actor: CustomerStakeholder,
 *   scope: ActionScope.Atomic,
 *   automationLevel: StepAutomationLevel.Manual,
 *   estimatedDuration: StepDuration.Quick,
 *   triggers: [{ action: ClickSubmitAction }]
 * })
 * export class EnterEmailPasswordAction {}
 * ```
 *
 * @example Journey-Level Action
 * ```typescript
 * @Action({
 *   name: 'Email Verified',
 *   actor: CustomerStakeholder,
 *   scope: ActionScope.Journey,
 *   emitsEvent: 'account.email.verified',
 *   automationLevel: StepAutomationLevel.SemiAutomated,
 *   criticality: StepCriticality.Critical,
 *   expectations: [FastEmailResponseExpectation],
 *   triggers: [{ action: EnterPersonalInfoAction }]
 * })
 * export class EmailVerifiedAction {}
 * ```
 */
export function Action(options: ActionOptions) {
  return function <T extends Constructor>(
    target: T,
    _context?: ClassDecoratorContext<T>
  ): WithAction<T> {
    applyBrand(target, 'action');
    void options;
    return target as WithAction<T>;
  };
}
