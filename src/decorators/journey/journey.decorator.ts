/**
 * @Journey Decorator
 * Marks a class as a Journey (user/stakeholder experience flow)
 * @module aabha/decorators/journey
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import { applyBrand } from '../../internal/brand.utils.js';
import type {
  Constructor,
  WithJourney,
  WithMetric,
  WithMilestone,
  WithStakeholder,
} from '../../types/branded-types.js';
import type { BaseDecoratorOptions } from '../../types/decorator-options.types.js';

/**
 * Milestone reference for Journey decorator
 * Allows referencing milestone classes with explicit ordering
 */
export interface MilestoneReference {
  /**
   * Milestone class - COMPILE-TIME TYPE SAFETY: Must have @Milestone decorator
   */
  milestone: WithMilestone<Constructor>;

  /**
   * Order in journey (required for sequencing)
   */
  order: number;

  /**
   * Prerequisites (other milestones that must complete first)
   */
  prerequisites?: string[];
}

/**
 * Journey reference for detours
 * Allows embedding sub-journeys as detours that branch from and rejoin the main journey
 */
export interface JourneyReference {
  /**
   * Sub-journey to execute as a detour
   * COMPILE-TIME TYPE SAFETY: Must have @Journey decorator and isDetour: true
   */
  journey: WithJourney<Constructor>;

  /**
   * Fractional order indicating where the detour branches
   * Use decimals to show position between main milestones (e.g., 2.5 is between 2 and 3)
   */
  order: number;

  /**
   * Which milestone triggers this detour
   */
  triggeredAfter: string | WithMilestone<Constructor>;

  /**
   * Condition expression that determines when detour is taken
   */
  triggeredBy?: string;

  /**
   * Where the detour rejoins the main journey
   */
  rejoinsAt?: number | string;

  /**
   * Human-readable label for this detour
   */
  label?: string;
}

/**
 * Stakeholder interaction - tracks handoffs between stakeholders in a journey
 */
export interface StakeholderInteraction {
  from: string;
  to: string;
  interaction: string;
  milestone?: string;
}

/**
 * Journey decorator options
 */
export interface JourneyOptions extends BaseDecoratorOptions {
  /**
   * Journey name (required)
   */
  name: string;

  /**
   * Primary stakeholder who drives this journey (required)
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Stakeholder
   *
   * @example
   * ```typescript
   * primaryStakeholder: CustomerStakeholder // Must have @Stakeholder decorator
   * ```
   */
  primaryStakeholder: WithStakeholder<Constructor>;

  /**
   * Journey slug (e.g., "deposit-money" or "DEPOSIT")
   * Auto-generated from name if not provided (kebab-case)
   */
  slug?: string;

  /**
   * Milestone references with explicit ordering
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Milestone
   *
   * @example
   * ```typescript
   * milestones: [
   *   { milestone: UserAuthenticationMilestone, order: 1 },
   *   { milestone: InitiateDepositMilestone, order: 2 },
   * ]
   * ```
   */
  milestones?: MilestoneReference[];

  /**
   * All stakeholders participating in this journey
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Stakeholder
   *
   * @example
   * ```typescript
   * participatingStakeholders: [AccountOwnerStakeholder, SystemStakeholder]
   * ```
   */
  participatingStakeholders?: WithStakeholder<Constructor>[];

  /**
   * Metrics to track journey success
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Metric
   */
  metrics?: WithMetric<Constructor>[];

  /**
   * Measurable business outcomes of this journey
   */
  outcomes?: string[];

  /**
   * What triggers this journey?
   */
  triggeringEvent?: string;

  /**
   * Alternative/error flows
   */
  alternativeFlows?: string[];

  /**
   * Track stakeholder interactions/handoffs
   */
  stakeholderInteractions?: StakeholderInteraction[];

  /**
   * Detour sub-journeys that branch from and rejoin the main journey
   *
   * @example
   * ```typescript
   * detours: [
   *   {
   *     journey: InsufficientFundsJourney,
   *     order: 2.5,
   *     triggeredAfter: 'ValidateBalance',
   *     triggeredBy: 'balance < amount',
   *     rejoinsAt: 3
   *   }
   * ]
   * ```
   */
  detours?: JourneyReference[];

  /**
   * Marks this journey as a detour (sub-journey)
   * Default: false
   */
  isDetour?: boolean;

  /**
   * Human-readable description
   */
  description?: string;

  /**
   * Tags for categorization
   */
  tags?: string[];
}

/**
 * @Journey decorator
 * Marks a class as a Journey with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Enforces one-way hierarchy: Journey knows about Milestones, but Milestones
 * don't know about the Journey (enables milestone reusability).
 *
 * @param options - Journey configuration
 * @returns Class decorator that brands the class with WithJourney type
 *
 * @example
 * ```typescript
 * @Journey({
 *   name: 'Deposit Money',
 *   primaryStakeholder: AccountOwnerStakeholder,
 *   slug: 'deposit-money',
 *   milestones: [
 *     { milestone: UserAuthenticationMilestone, order: 1 },
 *     { milestone: InitiateDepositMilestone, order: 2 },
 *     { milestone: ConfirmDepositMilestone, order: 3 },
 *   ],
 *   participatingStakeholders: [AccountOwnerStakeholder, SystemStakeholder],
 *   metrics: [DepositSuccessRate, AverageDepositTime],
 *   outcomes: ['Money deposited to account', 'Balance updated'],
 *   triggeringEvent: 'User clicks deposit button'
 * })
 * class DepositMoneyJourney {}
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
