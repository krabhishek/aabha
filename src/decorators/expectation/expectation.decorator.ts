/**
 * @Expectation Decorator
 * Marks a class as an Expectation (stakeholder expectation)
 * @module blueprint/decorators/expectation
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import type {
  Constructor,
  WithExpectation,
  WithStakeholder,
  WithBehavior,
  BaseDecoratorOptions,
} from '../../types/index.js';
import type { ExpectationPriority } from '../../enums/expectation-priority.enum.js';
import type { ExchangeContract } from '../../types/exchange-contract.types.js';
import { applyBrand } from '../../internal/brand.utils.js';

/**
 * Expectation decorator options
 */
export interface ExpectationOptions extends BaseDecoratorOptions {
  /**
   * Expectation name (required)
   *
   * @example
   * ```typescript
   * name: 'Fast Email Validation'
   * ```
   */
  name: string;

  /**
   * Expectation description (required)
   * Written in Given-When-Then or As-a...I-want...So-that format
   *
   * @example
   * ```typescript
   * description: 'Given a valid account, When depositing money, Then balance should increase'
   * ```
   */
  description: string;

  /**
   * Provider stakeholder - who fulfills/implements this expectation (required)
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Stakeholder
   *
   * @example
   * ```typescript
   * provider: BankingSystemStakeholder // The system providing the capability
   * ```
   */
  provider: WithStakeholder<Constructor>;

  /**
   * Consumer stakeholder - who benefits from this expectation (required)
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Stakeholder
   *
   * @example
   * ```typescript
   * consumer: DigitalFirstCustomer // The stakeholder benefiting from the capability
   * ```
   */
  consumer: WithStakeholder<Constructor>;

  /**
   * Exchange contract defining the interaction between provider and consumer (required)
   *
   * Specifies:
   * - What inputs the provider needs
   * - What outputs the consumer receives
   * - How the exchange happens (interaction pattern)
   * - Preconditions and postconditions
   * - SLA constraints
   *
   * @example
   * ```typescript
   * exchange: {
   *   inputs: ['email address', EmailValueObject],
   *   outputs: ['validation result boolean', ValidationResult],
   *   interactionPattern: InteractionPattern.RequestResponse,
   *   preconditions: ['Email is provided', 'System is available'],
   *   postconditions: ['Result is returned', 'Result is cached'],
   *   constraints: {
   *     maxLatency: '< 1 second',
   *     availability: '99.9%'
   *   }
   * }
   * ```
   */
  exchange: ExchangeContract;

  /**
   * Behaviors that implement this expectation
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Behavior
   *
   * @example
   * ```typescript
   * behaviors: [ValidateAmountBehavior, UpdateBalanceBehavior]
   * ```
   */
  behaviors?: WithBehavior<Constructor>[];

  /**
   * Priority of this expectation
   */
  priority?: ExpectationPriority;

  /**
   * Acceptance criteria (bullet points)
   */
  acceptanceCriteria?: string[];

  /**
   * Business value of this expectation
   */
  businessValue?: string;

  /**
   * Tags for categorization
   */
  tags?: string[];
}

/**
 * @Expectation decorator
 * Marks a class as an Expectation with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Expectations represent contracts between two stakeholders: a provider who
 * fulfills the expectation and a consumer who benefits from it.
 * They are traceable through the hierarchy and linked to behaviors.
 *
 * Enforces one-way hierarchy: Expectation knows about Behaviors, but Behaviors
 * don't know about the Expectation (enables behavior reusability).
 *
 * @param options - Expectation configuration
 * @returns Class decorator that brands the class with WithExpectation type
 *
 * @example
 * ```typescript
 * @Expectation({
 *   name: 'Fast Email Validation',
 *   description: 'Email validation service validates email format and DNS records in real-time',
 *   provider: EmailValidationServiceStakeholder,
 *   consumer: DigitalFirstCustomerStakeholder,
 *   exchange: {
 *     inputs: ['email address string'],
 *     outputs: ['validation result boolean', 'error message if invalid'],
 *     interactionPattern: InteractionPattern.RequestResponse,
 *     preconditions: ['Email address provided', 'Service available'],
 *     postconditions: ['Validation result returned', 'Result cached for 5 minutes'],
 *     constraints: {
 *       maxLatency: '< 1 second',
 *       availability: '99.9%'
 *     }
 *   },
 *   behaviors: [ValidateEmailFormatBehavior, CheckDNSRecordsBehavior],
 *   priority: ExpectationPriority.Critical,
 *   acceptanceCriteria: [
 *     'Email format validated using RFC 5322',
 *     'DNS MX records checked',
 *     'Response within 1 second'
 *   ],
 *   businessValue: 'Prevent invalid emails early in signup flow'
 * })
 * class FastEmailValidationExpectation {}
 * ```
 */
export function Expectation(options: ExpectationOptions) {
  return function <T extends Constructor>(
    target: T,
    _context?: ClassDecoratorContext<T>
  ): WithExpectation<T> {
    applyBrand(target, 'expectation');
    void options;
    return target as WithExpectation<T>;
  };
}
