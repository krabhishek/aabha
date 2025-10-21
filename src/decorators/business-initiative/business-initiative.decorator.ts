/**
 * @BusinessInitiative Decorator
 * Marks a class as a Business Initiative (concrete strategic initiative)
 * @module blueprint/decorators/business-initiative
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import type {
  Constructor,
  WithBusinessInitiative,
  WithStrategy,
  WithJourney,
  WithMetric,
} from '../../types/branded-types.js';
import { applyBrand } from '../../internal/brand.utils.js';

/**
 * Milestone definition for timeline tracking
 */
export interface InitiativeMilestone {
  /**
   * Milestone name
   */
  name: string;

  /**
   * Target date (ISO date string or human-readable)
   */
  targetDate: string;

  /**
   * Description of what will be achieved
   */
  description?: string;

  /**
   * Success criteria
   */
  successCriteria?: string[];
}

/**
 * BusinessInitiative decorator options
 * Represents concrete initiatives that implement strategy
 */
export interface BusinessInitiativeOptions {
  /**
   * Initiative name (required)
   */
  name: string;

  /**
   * Parent strategy this initiative implements
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Strategy
   *
   * @example
   * ```typescript
   * strategy: ECommerceGrowthStrategy // Must have @Strategy decorator
   * ```
   */
  strategy?: WithStrategy<Constructor>;

  /**
   * Journeys that are part of this initiative
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Journey
   *
   * @example
   * ```typescript
   * journeys: [CheckoutJourney, PaymentJourney]
   * ```
   */
  journeys?: WithJourney<Constructor>[];

  /**
   * Metrics to track initiative success
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Metric
   *
   * @example
   * ```typescript
   * metrics: [CartAbandonmentRate, ConversionRate]
   * ```
   */
  metrics?: WithMetric<Constructor>[];

  /**
   * Initiative objectives
   */
  objectives?: string[];

  /**
   * Expected outcomes
   */
  outcomes?: string[];

  /**
   * Timeline with milestones
   */
  timeline?: {
    startDate?: string;
    endDate?: string;
    milestones?: InitiativeMilestone[];
  };

  /**
   * Dependencies on other initiatives
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @BusinessInitiative
   *
   * @example
   * ```typescript
   * dependencies: [PaymentIntegrationInitiative]
   * ```
   */
  dependencies?: WithBusinessInitiative<Constructor>[];

  /**
   * Human-readable description
   */
  description?: string;

  /**
   * Tags for categorization
   */
  tags?: string[];

  /**
   * Initiative owner/lead
   */
  owner?: string;

  /**
   * Team members involved
   */
  team?: string[];

  /**
   * Budget allocated (if applicable)
   */
  budget?: {
    amount: number;
    currency: string;
    breakdown?: Record<string, number>;
  };

  /**
   * Success criteria for the initiative
   */
  successCriteria?: string[];

  /**
   * Risks and mitigation strategies
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
 * @BusinessInitiative decorator
 * Marks a class as a Business Initiative with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Enforces one-way hierarchy: Initiative knows about Journeys, but Journeys
 * don't know about the Initiative (enables journey reusability).
 *
 * @param options - Business Initiative configuration
 * @returns Class decorator that brands the class with WithBusinessInitiative type
 *
 * @example
 * ```typescript
 * @BusinessInitiative({
 *   name: 'Seamless Checkout Experience',
 *   strategy: ECommerceGrowthStrategy,
 *   journeys: [CheckoutJourney, PaymentJourney],
 *   metrics: [CartAbandonmentRate, ConversionRate],
 *   objectives: [
 *     'Reduce cart abandonment by 30%',
 *     'Increase conversion rate to 4.5%'
 *   ],
 *   timeline: {
 *     startDate: '2025-Q1',
 *     endDate: '2025-Q3',
 *     milestones: [
 *       { name: 'MVP Launch', targetDate: '2025-03-15' },
 *       { name: 'Full Rollout', targetDate: '2025-06-30' }
 *     ]
 *   },
 *   owner: 'Product Team',
 *   team: ['Design', 'Engineering', 'QA']
 * })
 * class SeamlessCheckoutInitiative {}
 * ```
 */
export function BusinessInitiative(options: BusinessInitiativeOptions) {
  return function <T extends Constructor>(
    target: T,
    _context: ClassDecoratorContext<T>
  ): WithBusinessInitiative<T> {
    applyBrand(target, 'business-initiative');
    void options;
    return target as WithBusinessInitiative<T>;
  };
}
