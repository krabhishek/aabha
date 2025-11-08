/**
 * @Strategy Decorator
 * Marks a class as a Strategy (business strategy definition)
 * @module aabha/decorators/strategy
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import type { Constructor, WithStrategy, WithMetric } from '../../types/branded-types.js';
import { applyBrand } from '../../internal/brand.utils.js';

/**
 * Strategy decorator options
 * Based on Roger L. Martin's "Playing to Win" framework
 *
 * Playing to Win Framework (Roger L. Martin & A.G. Lafley):
 * 1. Winning Aspiration - What does winning look like?
 * 2. Where to Play - In which markets/segments will we compete?
 * 3. How to Win - How will we achieve competitive advantage?
 * 4. Core Capabilities - What capabilities must we have to win?
 * 5. Management Systems - What systems do we need to build and maintain capabilities?
 */
export interface StrategyOptions {
  /**
   * Strategy name (required)
   */
  name: string;

  // ============================================================================
  // Playing to Win Framework - Core Elements
  // ============================================================================

  /**
   * Winning Aspiration: What does winning look like for us?
   * The top-level goal/vision that defines success for this strategy.
   *
   * @example
   * ```typescript
   * winningAspiration: "To become India's most loved digital bank by 2027"
   * ```
   */
  winningAspiration?: string;

  /**
   * Where to Play - markets, segments, geographies, channels
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
   * How to Win - value proposition, competitive advantage, differentiation
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

  // ============================================================================
  // Strategic Choices & Trade-offs
  // ============================================================================

  /**
   * Strategic Choices: Explicit decisions about what we will and won't do.
   * Defining what you won't do is as important as defining what you will do.
   *
   * @example
   * ```typescript
   * strategicChoices: {
   *   focus: [
   *     'Mobile-first experience',
   *     'Gen-Z customers',
   *     'Instant gratification'
   *   ],
   *   deliberateExclusions: [
   *     'Branch expansion',
   *     'Enterprise banking',
   *     'Legacy system support'
   *   ]
   * }
   * ```
   */
  strategicChoices?: {
    /** What we commit to doing - our strategic focus areas */
    focus: string[];
    /** What we explicitly will NOT do - our strategic trade-offs */
    deliberateExclusions: string[];
  };

  // ============================================================================
  // Strategic Context & Value
  // ============================================================================

  /**
   * Competitive Context: Current market and competitive landscape
   * Understanding the environment in which we're competing
   *
   * @example
   * ```typescript
   * competitiveContext: "Fintech disruption, increasing mobile adoption, regulatory changes favoring digital banking"
   * ```
   */
  competitiveContext?: string;

  /**
   * Value Proposition: Unique value we create for customers
   * The distinctive value that differentiates us
   *
   * @example
   * ```typescript
   * valueProposition: "Instant financial services without paperwork or branch visits, powered by AI"
   * ```
   */
  valueProposition?: string;

  /**
   * Key Assumptions: Critical assumptions this strategy depends on
   * Explicit assumptions that underpin our strategic choices
   *
   * @example
   * ```typescript
   * assumptions: [
   *   'Mobile penetration continues to grow at 20% annually',
   *   'Customers value speed over personal touch',
   *   'Regulatory environment remains favorable to digital banking'
   * ]
   * ```
   */
  assumptions?: string[];

  // ============================================================================
  // Metrics & Success Measurement
  // ============================================================================

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

  // ============================================================================
  // Timeline & Objectives
  // ============================================================================

  /**
   * Time horizon for this strategy (e.g., "2025-2027", "3 years")
   */
  timeHorizon?: string;

  /**
   * Strategic objectives to achieve within the time horizon
   *
   * @example
   * ```typescript
   * objectives: [
   *   'Achieve 1M active users by Q4 2025',
   *   'Launch in 5 major cities',
   *   'Break even by end of 2026'
   * ]
   * ```
   */
  objectives?: string[];

  // ============================================================================
  // Risk Management
  // ============================================================================

  /**
   * Key risks and mitigation strategies
   */
  risks?: {
    risk: string;
    mitigation: string;
    impact?: 'high' | 'medium' | 'low';
    likelihood?: 'high' | 'medium' | 'low';
  }[];

  // ============================================================================
  // Governance
  // ============================================================================

  /**
   * Owner: Person or team responsible for this strategy
   *
   * @example "CEO", "Chief Strategy Officer", "Product Leadership Team"
   */
  owner?: string;

  /**
   * Review Cycle: How often this strategy is reviewed and updated
   *
   * @example "Quarterly", "Annually", "Monthly"
   */
  reviewCycle?: string;

  /**
   * Last Reviewed: Date when strategy was last reviewed
   *
   * @example "2025-01-15"
   */
  lastReviewed?: string;

  /**
   * Next Review: Date of next planned strategy review
   *
   * @example "2025-04-15"
   */
  nextReview?: string;

  // ============================================================================
  // Base Metadata
  // ============================================================================

  /**
   * Human-readable description
   */
  description?: string;

  /**
   * Tags for categorization
   */
  tags?: string[];

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
 * Strategy is an independent component (like Metric) that is referenced by
 * BusinessInitiatives, not part of the execution hierarchy.
 *
 * @param options - Strategy configuration based on Playing to Win framework
 * @returns Class decorator that brands the class with WithStrategy type
 *
 * @example
 * ```typescript
 * @Strategy({
 *   name: 'Digital Banking Transformation 2024-2027',
 *   description: 'Transform into a mobile-first digital bank',
 *
 *   // Playing to Win Framework
 *   winningAspiration: "To become India's most loved digital bank by 2027",
 *   whereToPlay: [
 *     'Retail Banking',
 *     'Gen-Z customers',
 *     'Mobile-first channels'
 *   ],
 *   howToWin: 'Instant, AI-powered financial services through mobile',
 *   coreCapabilities: [
 *     'AI/ML expertise',
 *     'Mobile-first design',
 *     'Real-time processing'
 *   ],
 *   managementSystems: [
 *     'Monthly strategy review',
 *     'OKR tracking',
 *     'Capability gap analysis'
 *   ],
 *
 *   // Strategic Choices
 *   strategicChoices: {
 *     focus: ['Mobile-first experience', 'Gen-Z customers', 'Instant gratification'],
 *     deliberateExclusions: ['Branch expansion', 'Enterprise banking', 'Legacy support']
 *   },
 *
 *   // Context
 *   competitiveContext: 'Fintech disruption, mobile adoption, digital-first expectations',
 *   valueProposition: 'Instant financial services without paperwork or branch visits',
 *   assumptions: [
 *     'Mobile penetration continues to grow',
 *     'Customers value speed over personal touch'
 *   ],
 *
 *   // Metrics & Timeline
 *   metrics: [NetPromoterScore, CustomerEffortScore],
 *   timeHorizon: '2024-2027',
 *   objectives: [
 *     'Achieve 1M active users by Q4 2025',
 *     'Launch in 5 cities',
 *     'Break even by 2026'
 *   ],
 *
 *   // Governance
 *   owner: 'CEO',
 *   reviewCycle: 'Quarterly',
 *   tags: ['digital-transformation', 'customer-experience']
 * })
 * class DigitalTransformationStrategy {}
 * ```
 */
export function Strategy(options: StrategyOptions) {
  return function <T extends Constructor>(
    target: T,
    _context?: ClassDecoratorContext<T>
  ): WithStrategy<T> {
    // Apply the brand property for TypeScript inference
    applyBrand(target, 'strategy');

    // Options are only used for type information at compile time
    void options;

    return target as WithStrategy<T>;
  };
}
