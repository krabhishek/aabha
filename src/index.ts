/**
 * Blueprint - Product Management as Code
 *
 * A compile-time only TypeScript package for defining product strategy,
 * initiatives, journeys, and expectations with zero runtime overhead.
 *
 * @module blueprint
 *
 * @example
 * ```typescript
 * import { Strategy, BusinessInitiative, Journey, Metric } from 'blueprint';
 *
 * @Strategy({
 *   name: 'E-Commerce Growth',
 *   whereToPlay: ['Direct-to-Consumer', 'B2B'],
 *   howToWin: 'Best-in-class UX'
 * })
 * class GrowthStrategy {}
 *
 * @BusinessInitiative({
 *   name: 'Seamless Checkout',
 *   strategy: GrowthStrategy,
 *   journeys: [CheckoutJourney]
 * })
 * class CheckoutInitiative {}
 * ```
 */

// Decorators
export * from './decorators/index.js';

// Types
export type * from './types/index.js';

// Enums
export * from './enums/index.js';
