/**
 * Branded types for compile-time decorator presence verification
 * @module aabha/types/branded-types
 *
 * These branded types enable TypeScript to verify at compile time that classes
 * have the required decorators applied. This transforms validation into
 * compile-time type checking with ZERO runtime overhead.
 *
 * @example
 * ```typescript
 * // Compile-time error if CustomerJourney doesn't have @Journey decorator
 * @BusinessInitiative({
 *   name: 'Seamless Checkout',
 *   journeys: [CustomerJourney] // Must be WithJourney<Constructor>
 * })
 * class SeamlessCheckoutInitiative {}
 * ```
 */

import type { Constructor } from './constructor.types.js';

/**
 * Base interface for decorator branding
 *
 * This creates a unique symbol that TypeScript uses to distinguish decorated
 * classes from undecorated ones at the type level.
 *
 * The brand property is added at runtime by decorators via Object.defineProperty.
 *
 * @template T The decorator type identifier (e.g., 'strategy', 'journey')
 */
export interface DecoratorBrand<T extends string> {
  readonly __decoratorBrand?: T;
}

/**
 * Re-export Constructor for convenience
 */
export type { Constructor };

// ============================================================================
// STRATEGIC LEVEL BRANDS
// ============================================================================

/**
 * Branded type for classes decorated with @Strategy
 *
 * @template T The class constructor type
 *
 * @example
 * ```typescript
 * @Strategy({ name: 'Growth Strategy' })
 * class GrowthStrategy {} // Type: WithStrategy<typeof GrowthStrategy>
 * ```
 */
export type WithStrategy<T extends Constructor = Constructor> = T &
  DecoratorBrand<'strategy'>;

/**
 * Branded type for classes decorated with @BusinessInitiative
 *
 * @template T The class constructor type
 *
 * @example
 * ```typescript
 * @BusinessInitiative({ name: 'Seamless Checkout' })
 * class CheckoutInitiative {} // Type: WithBusinessInitiative<typeof CheckoutInitiative>
 * ```
 */
export type WithBusinessInitiative<T extends Constructor = Constructor> = T &
  DecoratorBrand<'business-initiative'>;

/**
 * Branded type for classes decorated with @Metric
 *
 * @template T The class constructor type
 *
 * @example
 * ```typescript
 * @Metric({ name: 'Cart Abandonment Rate', unit: '%' })
 * class CartAbandonmentRate {} // Type: WithMetric<typeof CartAbandonmentRate>
 * ```
 */
export type WithMetric<T extends Constructor = Constructor> = T &
  DecoratorBrand<'metric'>;

/**
 * Branded type for classes decorated with @Context
 *
 * @template T The class constructor type
 *
 * @example
 * ```typescript
 * @Context({ name: 'Sales' })
 * class SalesContext {} // Type: WithContext<typeof SalesContext>
 * ```
 */
export type WithContext<T extends Constructor = Constructor> = T &
  DecoratorBrand<'context'>;

// ============================================================================
// JOURNEY LEVEL BRANDS
// ============================================================================

/**
 * Branded type for classes decorated with @Journey
 *
 * Journey is a minimal container for Actions with business metadata.
 * Flow topology is entirely defined by Actions via their triggers property.
 *
 * @template T The class constructor type
 *
 * @example
 * ```typescript
 * @Journey({
 *   name: 'Customer Account Opening',
 *   primaryStakeholder: CustomerStakeholder,
 *   actions: [EmailVerifiedAction, IdentityVerifiedAction],
 *   entryActions: [EnterEmailPasswordAction]
 * })
 * class AccountOpeningJourney {} // Type: WithJourney<typeof AccountOpeningJourney>
 * ```
 */
export type WithJourney<T extends Constructor = Constructor> = T &
  DecoratorBrand<'journey'>;

/**
 * Branded type for classes decorated with @Action
 *
 * Actions are the unified event-driven component that replaced Step and Milestone.
 * An action represents an imperative command that causes events in a journey.
 *
 * @template T The class constructor type
 *
 * @example
 * ```typescript
 * @Action({
 *   name: 'User Clicks Submit Button',
 *   actor: CustomerStakeholder,
 *   scope: ActionScope.Atomic,
 *   triggers: [{ action: ValidateFormAction }]
 * })
 * class ClickSubmitAction {} // Type: WithAction<typeof ClickSubmitAction>
 * ```
 */
export type WithAction<T extends Constructor = Constructor> = T &
  DecoratorBrand<'action'>;

// ============================================================================
// EXPECTATION LEVEL BRANDS
// ============================================================================

/**
 * Branded type for classes decorated with @Expectation
 *
 * @template T The class constructor type
 */
export type WithExpectation<T extends Constructor = Constructor> = T &
  DecoratorBrand<'expectation'>;

/**
 * Branded type for classes decorated with @Interaction
 *
 * Interactions define the technical contract for how stakeholders exchange data.
 * They replace the inline `exchange` field in Expectations, providing reusable
 * interaction patterns across all architectural layers (Frontend, Backend, Data, Device, etc.).
 *
 * @template T The class constructor type
 *
 * @example
 * ```typescript
 * @Interaction({
 *   name: 'Account Opening API',
 *   pattern: InteractionPattern.RequestResponse,
 *   layer: InteractionLayer.Backend,
 *   inputs: [{ name: 'customerData', type: CustomerData }],
 *   outputs: [{ name: 'accountNumber', type: 'string' }]
 * })
 * class AccountOpeningAPIInteraction {} // Type: WithInteraction<typeof AccountOpeningAPIInteraction>
 *
 * // Used in Expectation
 * @Expectation({
 *   name: 'Fast Account Opening',
 *   interaction: AccountOpeningAPIInteraction  // Must be WithInteraction<Constructor>
 * })
 * class FastAccountOpeningExpectation {}
 * ```
 */
export type WithInteraction<T extends Constructor = Constructor> = T &
  DecoratorBrand<'interaction'>;

/**
 * Branded type for classes decorated with @Collaboration
 *
 * Collaborations define multi-stakeholder interaction patterns that don't fit
 * the traditional provider/consumer model. They model human coordination,
 * offline processes, and organizational interactions.
 *
 * @template T The class constructor type
 *
 * @example
 * ```typescript
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting',
 *   purpose: 'Review portfolio performance and approve new investments',
 *   participants: [
 *     { stakeholder: InvestorStakeholder, role: 'decision-maker', required: true },
 *     { stakeholder: AdvisorStakeholder, role: 'presenter', required: true }
 *   ],
 *   communicationChannel: 'in-person-meeting',
 *   frequency: 'monthly'
 * })
 * class InvestmentCommitteeMeetingCollaboration {} // Type: WithCollaboration<typeof InvestmentCommitteeMeetingCollaboration>
 *
 * // Used in Action
 * @Action({
 *   name: 'Monthly Investment Review',
 *   actor: InvestorStakeholder,
 *   scope: ActionScope.Journey,
 *   collaboration: InvestmentCommitteeMeetingCollaboration  // Must be WithCollaboration<Constructor>
 * })
 * class MonthlyInvestmentReviewAction {}
 * ```
 */
export type WithCollaboration<T extends Constructor = Constructor> = T &
  DecoratorBrand<'collaboration'>;

/**
 * Branded type for classes decorated with @Stakeholder
 *
 * @template T The class constructor type
 */
export type WithStakeholder<T extends Constructor = Constructor> = T &
  DecoratorBrand<'stakeholder'>;

/**
 * Branded type for classes decorated with @Persona
 *
 * @template T The class constructor type
 */
export type WithPersona<T extends Constructor = Constructor> = T &
  DecoratorBrand<'persona'>;

// ============================================================================
// BEHAVIORAL LEVEL BRANDS
// ============================================================================

/**
 * Branded type for classes decorated with @Behavior
 *
 * @template T The class constructor type
 */
export type WithBehavior<T extends Constructor = Constructor> = T &
  DecoratorBrand<'behavior'>;

/**
 * Branded type for classes decorated with @Attribute
 *
 * @template T The class constructor type
 */
export type WithAttribute<T extends Constructor = Constructor> = T &
  DecoratorBrand<'attribute'>;

/**
 * Branded type for methods decorated with @Witness
 *
 * Unlike other brands which are for classes, this brand is for methods
 * that serve as verification witnesses for behaviors.
 *
 * @template T The method signature type
 *
 * @example
 * ```typescript
 * @Behavior({ name: 'ValidateEmail' })
 * class ValidateEmailBehavior {
 *   @Witness({ name: 'Valid email witness', type: WitnessType.Unit })
 *   witnessValidEmail() { } // Type includes WithWitness brand
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithWitness<T = (...args: any[]) => any> = T &
  DecoratorBrand<'witness'>;
