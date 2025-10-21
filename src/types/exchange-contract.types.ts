/**
 * Exchange Contract Types
 * @module aabha/types/exchange-contract
 *
 * Defines the contract structure for expectation exchanges between stakeholders.
 */

import type { Constructor } from './constructor.types.js';
import type { InteractionPattern } from '../enums/interaction-pattern.enum.js';

/**
 * Exchange item - can be a string description or a constructor reference
 *
 */
export type ExchangeItem = string | Constructor;

/**
 * Exchange constraints defining SLA and performance requirements
 */
export interface ExchangeConstraints {
  /**
   * Maximum latency allowed for the exchange
   * @example '< 1 second', '< 100ms', '< 5 minutes'
   */
  maxLatency?: string;

  /**
   * Required throughput
   * @example '1000 req/sec', '10K transactions/day'
   */
  throughput?: string;

  /**
   * Availability SLA
   * @example '99.9%', '99.99%', '24/7'
   */
  availability?: string;

  /**
   * Data retention period
   * @example '7 days', '90 days', '7 years'
   */
  retention?: string;

  /**
   * Security requirements
   * @example 'TLS 1.3', 'AES-256 encryption'
   */
  security?: string[];

  /**
   * Custom constraints
   */
  custom?: Record<string, string>;
}

/**
 * Exchange Contract
 *
 * Defines the explicit contract for an expectation exchange between
 * a provider and consumer stakeholder.
 *
 * Captures:
 * - What the provider needs as input
 * - What the consumer receives as output
 * - How the exchange happens (interaction pattern)
 * - Preconditions and postconditions
 * - SLA constraints
 *
 * @example
 * ```typescript
 * {
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
export interface ExchangeContract {
  /**
   * Inputs required by the provider to fulfill the expectation
   * Can be string descriptions or constructor references to domain types
   */
  inputs: ExchangeItem[];

  /**
   * Outputs provided to the consumer
   * Can be string descriptions or constructor references to domain types
   */
  outputs: ExchangeItem[];

  /**
   * How the exchange happens (synchronous, event-driven, etc.)
   */
  interactionPattern: InteractionPattern;

  /**
   * Conditions that must be true before the exchange can happen
   */
  preconditions?: string[];

  /**
   * Guarantees that will be true after the exchange completes
   */
  postconditions?: string[];

  /**
   * SLA and performance constraints for the exchange
   */
  constraints?: ExchangeConstraints;
}
