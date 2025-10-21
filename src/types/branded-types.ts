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
export type WithStrategy<T extends Constructor = Constructor> =
  T & DecoratorBrand<'strategy'>;

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
export type WithBusinessInitiative<T extends Constructor = Constructor> =
  T & DecoratorBrand<'business-initiative'>;

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
export type WithMetric<T extends Constructor = Constructor> =
  T & DecoratorBrand<'metric'>;

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
export type WithContext<T extends Constructor = Constructor> =
  T & DecoratorBrand<'context'>;

// ============================================================================
// JOURNEY LEVEL BRANDS
// ============================================================================

/**
 * Branded type for classes decorated with @Journey
 *
 * @template T The class constructor type
 */
export type WithJourney<T extends Constructor = Constructor> =
  T & DecoratorBrand<'journey'>;

/**
 * Branded type for classes decorated with @Milestone
 *
 * @template T The class constructor type
 */
export type WithMilestone<T extends Constructor = Constructor> =
  T & DecoratorBrand<'milestone'>;

/**
 * Branded type for classes decorated with @Step
 *
 * @template T The class constructor type
 */
export type WithStep<T extends Constructor = Constructor> =
  T & DecoratorBrand<'step'>;

// ============================================================================
// EXPECTATION LEVEL BRANDS
// ============================================================================

/**
 * Branded type for classes decorated with @Expectation
 *
 * @template T The class constructor type
 */
export type WithExpectation<T extends Constructor = Constructor> =
  T & DecoratorBrand<'expectation'>;

/**
 * Branded type for classes decorated with @Stakeholder
 *
 * @template T The class constructor type
 */
export type WithStakeholder<T extends Constructor = Constructor> =
  T & DecoratorBrand<'stakeholder'>;

/**
 * Branded type for classes decorated with @Persona
 *
 * @template T The class constructor type
 */
export type WithPersona<T extends Constructor = Constructor> =
  T & DecoratorBrand<'persona'>;

// ============================================================================
// BEHAVIORAL LEVEL BRANDS
// ============================================================================

/**
 * Branded type for classes decorated with @Behavior
 *
 * @template T The class constructor type
 */
export type WithBehavior<T extends Constructor = Constructor> =
  T & DecoratorBrand<'behavior'>;

/**
 * Branded type for classes decorated with @Attribute
 *
 * @template T The class constructor type
 */
export type WithAttribute<T extends Constructor = Constructor> =
  T & DecoratorBrand<'attribute'>;

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
export type WithWitness<T = (...args: any[]) => any> =
  T & DecoratorBrand<'witness'>;
