/**
 * @Strategy Decorator
 * Marks a class as a Strategy (business strategy definition)
 * @module blueprint/decorators/strategy
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import type { Constructor, WithStrategy, WithMetric } from '../../types/branded-types.js';
import { applyBrand } from '../../internal/brand.utils.js';

/**
 * Strategy decorator options
 * Based on Roger L. Martin's "Playing to Win" framework
 */
export interface StrategyOptions {
  /**
   * Strategy name (required)
   */
  name: string;

  /**
   * Where to play - markets, segments, geographies, channels
   * Defines the playing field for the strategy
   *
   * @example
   * ```typescript
   * whereToPlay: [
   *   'Direct-to-Consumer E-commerce',
   *   'B2B Marketplace',
   *   'North America & Europe'
   * ]
   * ```
   */
  whereToPlay?: string[];

  /**
   * How to win - value proposition, competitive advantage, differentiation
   * Defines how you will win in the chosen playing field
   *
   * @example
   * ```typescript
   * howToWin: 'Best-in-class UX with 24/7 customer support and fastest delivery'
   * ```
   */
  howToWin?: string;

  /**
   * Core capabilities required to execute this strategy
   *
   * @example
   * ```typescript
   * coreCapabilities: [
   *   'Real-time inventory management',
   *   'AI-powered personalization',
   *   'Global logistics network'
   * ]
   * ```
   */
  coreCapabilities?: string[];

  /**
   * Management systems needed to support this strategy
   *
   * @example
   * ```typescript
   * managementSystems: [
   *   'OKR tracking system',
   *   'Customer feedback loop',
   *   'Continuous deployment pipeline'
   * ]
   * ```
   */
  managementSystems?: string[];

  /**
   * Strategic metrics to track success
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Metric
   *
   * @example
   * ```typescript
   * metrics: [MarketShareMetric, CustomerSatisfactionMetric]
   * ```
   */
  metrics?: WithMetric<Constructor>[];

  /**
   * Human-readable description
   */
  description?: string;

  /**
   * Tags for categorization
   */
  tags?: string[];

  /**
   * Time horizon for this strategy (e.g., "2025-2027", "3 years")
   */
  timeHorizon?: string;

  /**
   * Strategic objectives
   */
  objectives?: string[];

  /**
   * Key risks and mitigation strategies
   */
  risks?: {
    risk: string;
    mitigation: string;
    impact?: 'high' | 'medium' | 'low';
    likelihood?: 'high' | 'medium' | 'low';
  }[];

  /**
   * Extension point for custom metadata
   */
  extensions?: Record<string, unknown>;
}

/**
 * @Strategy decorator
 * Marks a class as a Strategy with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * @param options - Strategy configuration
 * @returns Class decorator that brands the class with WithStrategy type
 *
 * @example
 * ```typescript
 * @Strategy({
 *   name: 'E-Commerce Growth Strategy',
 *   whereToPlay: [
 *     'Direct-to-Consumer',
 *     'B2B Marketplace',
 *     'North America & Europe'
 *   ],
 *   howToWin: 'Best-in-class UX with 24/7 support and fastest delivery',
 *   coreCapabilities: [
 *     'Real-time inventory',
 *     'AI personalization',
 *     'Global logistics'
 *   ],
 *   metrics: [MarketShareMetric, NpsMetric],
 *   timeHorizon: '2025-2027'
 * })
 * class ECommerceGrowthStrategy {}
 * ```
 */
export function Strategy(options: StrategyOptions) {
  return function <T extends Constructor>(
    target: T,
    _context: ClassDecoratorContext<T>
  ): WithStrategy<T> {
    // Apply the brand property for TypeScript inference
    applyBrand(target, 'strategy');

    // Options are only used for type information at compile time
    void options;

    return target as WithStrategy<T>;
  };
}
