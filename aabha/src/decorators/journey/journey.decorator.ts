/**
 * @Journey Decorator
 * Marks a class as a Journey (user/stakeholder experience flow)
 * @module aabha/decorators/journey
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 *
 * Journey is a minimal container for Actions with business metadata.
 * Flow topology is entirely defined by Actions via their triggers property.
 */

import { applyBrand } from '../../internal/brand.utils.js';
import type {
  Constructor,
  WithAction,
  WithJourney,
  WithMetric,
  WithStakeholder,
} from '../../types/branded-types.js';
import type { BaseDecoratorOptions } from '../../types/decorator-options.types.js';

/**
 * Journey decorator options
 *
 * Journey is a simple container for Actions with business context.
 * Everything else is derived via static analysis:
 * - participatingStakeholders: derived from Action actors + Expectation providers/consumers
 * - alternativeFlows: derived from Action fallbackAction/compensatingAction
 * - slug: auto-generated kebab-case from name
 */
export interface JourneyOptions extends BaseDecoratorOptions {
  /**
   * Journey name (required)
   *
   * @example
   * name: 'Customer Account Opening'
   */
  name: string;

  /**
   * Primary stakeholder who drives this journey (required)
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Stakeholder
   *
   * @example
   * ```typescript
   * primaryStakeholder: CustomerStakeholder
   * ```
   */
  primaryStakeholder: WithStakeholder<Constructor>;

  /**
   * Action references (unified event-driven actions)
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Action
   *
   * Flow topology is defined by Actions themselves via triggers.
   * This array simply lists all actions that are part of this journey.
   *
   * @example
   * ```typescript
   * actions: [
   *   EnterEmailPasswordAction,
   *   EmailVerifiedAction,
   *   IdentityVerifiedAction,
   *   AccountCreatedAction
   * ]
   * ```
   */
  actions?: WithAction<Constructor>[];

  /**
   * Entry point actions (where the journey starts)
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Action
   *
   * Explicitly marks which Action(s) are triggered to start this journey.
   *
   * @example
   * ```typescript
   * entryActions: [EnterEmailPasswordAction]
   * ```
   */
  entryActions?: WithAction<Constructor>[];

  /**
   * Metrics to track journey success
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Metric
   *
   * @example
   * ```typescript
   * metrics: [AccountOpeningTimeMetric, SuccessRateMetric]
   * ```
   */
  metrics?: WithMetric<Constructor>[];

  /**
   * Measurable business outcomes of this journey
   *
   * @example
   * ```typescript
   * outcomes: [
   *   'Customer has verified account',
   *   'Customer can access banking services'
   * ]
   * ```
   */
  outcomes?: string[];

  /**
   * Human-readable description
   * @inherited from BaseDecoratorOptions
   */
  // description?: string;

  /**
   * Tags for categorization
   * @inherited from BaseDecoratorOptions
   */
  // tags?: string[];

  /**
   * Custom metadata extension point
   * @inherited from BaseDecoratorOptions
   */
  // extensions?: Record<string, unknown>;
}

/**
 * @Journey decorator
 * Marks a class as a Journey with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Journey is a simple container for Actions. Flow topology is defined by
 * Actions themselves via their triggers property.
 *
 * @param options - Journey configuration
 * @returns Class decorator that brands the class with WithJourney type
 *
 * @example
 * ```typescript
 * @Journey({
 *   name: 'Customer Account Opening',
 *   primaryStakeholder: CustomerStakeholder,
 *   actions: [
 *     EnterEmailPasswordAction,
 *     EmailVerifiedAction,
 *     IdentityVerifiedAction,
 *     AccountCreatedAction
 *   ],
 *   entryActions: [EnterEmailPasswordAction],
 *   metrics: [AccountOpeningTimeMetric],
 *   outcomes: [
 *     'Customer has verified account',
 *     'Customer can access banking services'
 *   ],
 *   description: 'Flow for opening a new customer account',
 *   tags: ['onboarding', 'customer']
 * })
 * export class AccountOpeningJourney {}
 * ```
 */
export function Journey(options: JourneyOptions) {
  return function <T extends Constructor>(
    target: T,
    _context?: ClassDecoratorContext<T>
  ): WithJourney<T> {
    applyBrand(target, 'journey');
    void options;
    return target as WithJourney<T>;
  };
}
