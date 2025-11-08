/**
 * @Expectation Decorator
 * Marks a class as an Expectation (stakeholder expectation)
 * @module aabha/decorators/expectation
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import type {
  Constructor,
  WithExpectation,
  WithStakeholder,
  WithBehavior,
  WithInteraction,
  BaseDecoratorOptions,
} from '../../types/index.js';
import type { ExpectationComplexity } from '../../enums/expectation-complexity.enum.js';
import type { ExpectationCategory } from '../../enums/expectation-category.enum.js';
import type { ExpectationStakeholderRelationType } from '../../enums/expectation-stakeholder-relation-type.enum.js';
import type { ExpectationVerificationLevel } from '../../enums/expectation-verification-level.enum.js';
import type {
  ExpectationQuality,
  ExpectationVerification,
  ExpectationObservability,
  ExpectationBusinessContext,
} from './expectation-sub-interfaces.js';
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
   * Primary interaction that implements this expectation (required)
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Interaction
   *
   * Replaces the inline `exchange` field with a reusable, type-safe interaction.
   *
   * @example
   * ```typescript
   * interaction: EmailValidationAPIInteraction // Backend HTTP POST interaction
   * ```
   */
  interaction: WithInteraction<Constructor>;

  /**
   * Additional interactions for complex orchestrations
   * Used when an expectation requires multiple interactions to fulfill
   *
   * @example
   * ```typescript
   * additionalInteractions: [
   *   {
   *     interaction: KYCVerificationInteraction,
   *     role: 'verification',
   *     description: 'Verify customer identity before account opening'
   *   },
   *   {
   *     interaction: AccountPersistenceInteraction,
   *     role: 'persistence',
   *     description: 'Store account data in database'
   *   }
   * ]
   * ```
   */
  additionalInteractions?: Array<{
    interaction: WithInteraction<Constructor>;
    role: string;
    description?: string;
  }>;

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

  // ============================================================================
  // CLASSIFICATION ENUMS
  // ============================================================================

  /**
   * Complexity level of this expectation
   * Assesses implementation effort and coordination requirements
   */
  complexity?: ExpectationComplexity;

  /**
   * Category of this expectation
   * Classifies by primary concern area (functional, performance, security, etc.)
   */
  category?: ExpectationCategory;

  /**
   * Stakeholder relationship type
   * Nature of the relationship between provider and consumer
   */
  stakeholderRelationType?: ExpectationStakeholderRelationType;

  /**
   * Verification level
   * Determines enforcement strictness and testing requirements
   */
  verificationLevel?: ExpectationVerificationLevel;

  // ============================================================================
  // SUB-INTERFACES
  // ============================================================================

  /**
   * Quality attributes (SLO/SLI) for this expectation
   */
  quality?: ExpectationQuality;

  /**
   * Verification configuration (test coverage, acceptance testing)
   */
  verification?: ExpectationVerification;

  /**
   * Observability configuration (metrics, alerts, audit trail)
   */
  observability?: ExpectationObservability;

  /**
   * Business context (strategic importance, impact, effort, success metrics, risks)
   */
  businessContext?: ExpectationBusinessContext;

  // ============================================================================
  // RELATIONSHIP FIELDS
  // ============================================================================

  /**
   * Additional stakeholders involved in this expectation
   * Beyond the primary provider and consumer
   */
  additionalStakeholders?: Array<{
    stakeholder: WithStakeholder<Constructor>;
    role: string;
    description?: string;
  }>;

  /**
   * Dependencies on other expectations
   * This expectation requires these expectations to be fulfilled first
   */
  dependsOn?: WithExpectation<Constructor>[];

  /**
   * Conflicts with other expectations
   * This expectation cannot be fulfilled simultaneously with these expectations
   */
  conflictsWith?: WithExpectation<Constructor>[];

  /**
   * Prerequisites that must be met before this expectation can be implemented
   */
  prerequisites?: string[];

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
 *   interaction: EmailValidationAPIInteraction, // Reusable @Interaction
 *   behaviors: [ValidateEmailFormatBehavior, CheckDNSRecordsBehavior],
 *   complexity: ExpectationComplexity.Simple,
 *   category: ExpectationCategory.Functional,
 *   stakeholderRelationType: ExpectationStakeholderRelationType.B2C,
 *   verificationLevel: ExpectationVerificationLevel.Enforced,
 *   quality: {
 *     slo: {
 *       latency: { p95: '1s', max: '5s' },
 *       availability: { target: '99.9%', errorBudget: '43m/month' }
 *     },
 *     sli: {
 *       successRate: EmailValidationSuccessRateMetric,
 *       latency: EmailValidationLatencyMetric
 *     }
 *   },
 *   verification: {
 *     level: ExpectationVerificationLevel.Enforced,
 *     testCoverage: {
 *       minWitnessCoverage: 80,
 *       requiredScenarios: {
 *         happyPath: true,
 *         errorScenarios: ['invalid-format', 'dns-timeout'],
 *         edgeCases: ['empty-input', 'special-characters']
 *       }
 *     }
 *   },
 *   observability: {
 *     enabled: true,
 *     metrics: [EmailValidationSuccessRateMetric],
 *     alerts: {
 *       onSLOBreach: {
 *         severity: 'high',
 *         notifyStakeholders: [EngineeringLeadStakeholder],
 *         channel: 'slack'
 *       }
 *     }
 *   },
 *   businessContext: {
 *     strategicImportance: 'high',
 *     impactAssessment: {
 *       revenueImpact: 'Prevents bounced emails, reduces support costs',
 *       customerSatisfaction: 'Improves signup experience'
 *     },
 *     successMeasurement: {
 *       baseline: { value: '85%', date: '2025-01-01' },
 *       target: { value: '98%', date: '2025-06-01' },
 *       approachToMeasurement: 'Track valid email rate in signup funnel'
 *     }
 *   },
 *   tags: ['authentication', 'validation', 'signup']
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
