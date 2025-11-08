/**
 * @Context Decorator
 * Marks a class as a Context (business perspective/lens)
 * @module aabha/decorators/context
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 *
 */

import type { ContextRelationship } from '../../enums/context-relationship.enum.js';
import { applyBrand } from '../../internal/brand.utils.js';
import type {
  Constructor,
  WithContext,
  WithMetric,
} from '../../types/branded-types.js';
import type { BaseDecoratorOptions } from '../../types/decorator-options.types.js';

/**
 * Relationship to another context
 *
 * Describes how this context collaborates with or depends on other contexts.
 * Understanding context relationships helps identify handoff points and integration needs.
 */
export interface ContextRelationshipDefinition {
  /**
   * Related context
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Context
   */
  context: WithContext<Constructor>;

  /**
   * Type of relationship
   *
   * @see ContextRelationship enum for available relationship types
   */
  type: ContextRelationship;

  /**
   * Description of the relationship
   *
   * @example "Receives KYC verification results and fraud screening alerts"
   */
  description?: string;

  /**
   * Data/services exchanged between contexts
   *
   * @example ['KYC status', 'fraud alerts', 'compliance clearance']
   */
  exchanged?: string[];

  /**
   * Handoff protocol: How work is transferred between contexts
   *
   * @example "API callback when verification completes"
   * @example "Daily batch file transfer via SFTP"
   */
  handoffProtocol?: string;

  /**
   * Communication pattern between contexts
   *
   * @example "sync" - Synchronous, blocking communication
   * @example "async" - Asynchronous, non-blocking
   * @example "event-driven" - Event-based, pub/sub
   */
  communicationPattern?: 'sync' | 'async' | 'event-driven' | string;

  /**
   * Interaction frequency
   *
   * @example "real-time" - Continuous interaction
   * @example "daily" - Once per day
   * @example "on-demand" - As needed
   */
  frequency?: string;
}

/**
 * Domain model definition for bounded context (DDD)
 *
 * Defines the core domain concepts that this context owns and manages.
 * This helps establish clear boundaries and ubiquitous language.
 */
export interface DomainModel {
  /**
   * Core entities: Primary domain objects with identity
   *
   * @example ['Account', 'Transaction', 'Customer']
   */
  coreEntities: string[];

  /**
   * Value objects: Domain concepts without identity
   *
   * @example ['Money', 'Address', 'Email']
   */
  valueObjects?: string[];

  /**
   * Ubiquitous language: Context-specific term definitions
   * Maps terms to their meanings within this context
   *
   * @example { 'Customer': 'An individual with at least one active account', 'Dormant': 'No transactions for 180 days' }
   */
  ubiquitousLanguage?: Record<string, string>;
}

/**
 * Capability categorization for a context
 *
 * Organizes capabilities by maturity and strategic importance.
 */
export interface ContextCapabilities {
  /**
   * Core capabilities: Established, strategic competencies
   * These are what the context does best and are critical to its purpose.
   *
   * @example ['Account management', 'Transaction processing', 'Balance inquiry']
   */
  core: string[];

  /**
   * Supporting capabilities: Necessary but not differentiating
   * These support the core capabilities but aren't strategic advantages.
   *
   * @example ['Customer notifications', 'Reporting', 'Audit logging']
   */
  supporting?: string[];

  /**
   * Emerging capabilities: In development or early stages
   * These are being built or experimented with for future value.
   *
   * @example ['AI-powered fraud detection', 'Real-time analytics', 'Voice banking']
   */
  emerging?: string[];
}

/**
 * Context decorator options
 *
 * Represents an organizational context - a bounded area of responsibility and concern.
 * Contexts group related capabilities, define domain boundaries, and collaborate with other contexts.
 *
 * Key principles:
 * - Context is stakeholder-free (stakeholders reference contexts, not vice versa)
 * - Focuses on organizational boundaries and capabilities
 * - Defines what's in/out of scope (bounded context from DDD)
 * - Relationships describe context-to-context collaboration
 */
export interface ContextOptions extends BaseDecoratorOptions {
  // ============================================================================
  // Context Identity
  // ============================================================================

  /**
   * Context name (required)
   *
   * Use clear, business-meaningful names that reflect the organizational area.
   *
   * @example "Retail Banking"
   * @example "Risk & Compliance"
   * @example "Customer Support"
   */
  name: string;

  /**
   * Human-readable description of this context
   *
   * Explain the purpose, scope, and role of this context in the organization.
   *
   * @example "Manages personal banking accounts, customer onboarding, and day-to-day retail banking operations"
   */
  description?: string;

  /**
   * Tags for categorization and discovery
   *
   * @example ['customer-facing', 'core-banking', 'regulated']
   */
  tags?: string[];

  // ============================================================================
  // Domain Boundaries (DDD Bounded Context)
  // ============================================================================

  /**
   * Domain model: Core entities and concepts owned by this context
   *
   * Defines the domain objects and ubiquitous language within this bounded context.
   * This establishes clear ownership and terminology.
   *
   * @example
   * ```typescript
   * domainModel: {
   *   coreEntities: ['Account', 'Transaction', 'Customer'],
   *   valueObjects: ['Money', 'AccountNumber', 'Balance'],
   *   ubiquitousLanguage: {
   *     'Customer': 'An individual with at least one active account',
   *     'Active Account': 'Account with transaction in last 90 days'
   *   }
   * }
   * ```
   */
  domainModel?: DomainModel;

  /**
   * What's explicitly IN this context's scope
   *
   * List the areas, processes, or concerns that this context owns and manages.
   * Being explicit about scope prevents boundary confusion.
   *
   * @example ['Personal savings accounts', 'Current accounts', 'Debit cards', 'Account opening']
   */
  inScope?: string[];

  /**
   * What's explicitly OUT of this context's scope
   *
   * List what this context does NOT handle, even if related.
   * Explicit exclusions prevent scope creep and clarify boundaries.
   *
   * @example ['Credit cards', 'Loans', 'Investment products', 'Business banking']
   */
  outOfScope?: string[];

  // ============================================================================
  // Capabilities & Competencies
  // ============================================================================

  /**
   * Capabilities organized by maturity and strategic importance
   *
   * Categorize what this context can do into core (strategic), supporting (necessary),
   * and emerging (developing) capabilities.
   *
   * @example
   * ```typescript
   * capabilities: {
   *   core: [
   *     'Account lifecycle management',
   *     'Real-time transaction processing',
   *     'Customer identity verification'
   *   ],
   *   supporting: [
   *     'Statement generation',
   *     'Regulatory reporting',
   *     'Audit logging'
   *   ],
   *   emerging: [
   *     'AI-powered fraud detection',
   *     'Predictive account recommendations'
   *   ]
   * }
   * ```
   */
  capabilities?: ContextCapabilities;

  // ============================================================================
  // Context Relationships & Integration
  // ============================================================================

  /**
   * Relationships with other contexts
   *
   * Define how this context collaborates with, depends on, or provides services to other contexts.
   * Understanding relationships reveals integration points and potential handoff issues.
   *
   * @example
   * ```typescript
   * relationships: [
   *   {
   *     context: RiskComplianceContext,
   *     type: ContextRelationship.Downstream,
   *     description: 'Receives KYC verification and fraud screening results',
   *     exchanged: ['KYC status', 'fraud alerts', 'compliance clearance'],
   *     handoffProtocol: 'Real-time API callback on verification completion',
   *     communicationPattern: 'async',
   *     frequency: 'real-time'
   *   },
   *   {
   *     context: CustomerSupportContext,
   *     type: ContextRelationship.Partnership,
   *     description: 'Collaborate on customer issue resolution',
   *     exchanged: ['issue tickets', 'account status', 'resolution updates'],
   *     communicationPattern: 'event-driven',
   *     frequency: 'on-demand'
   *   }
   * ]
   * ```
   */
  relationships?: ContextRelationshipDefinition[];

  // ============================================================================
  // Organizational Structure & Governance
  // ============================================================================

  /**
   * Context owner/lead
   *
   * Person or role accountable for this context's success and decisions.
   *
   * @example "Sarah Johnson"
   * @example "Head of Retail Banking"
   */
  owner?: string;

  /**
   * Team or department managing this context
   *
   * @example "Retail Banking Division"
   * @example "Customer Operations Team"
   */
  team?: string;

  /**
   * Primary goals of this context
   *
   * What this context aims to achieve organizationally (context-internal goals).
   * These are NOT journey goals - they're operational/organizational objectives.
   *
   * @example [
   *   'Maintain 99.9% account system uptime',
   *   'Process account openings within 24 hours',
   *   'Achieve NPS > 60 for retail customers'
   * ]
   */
  goals?: string[];

  // ============================================================================
  // Metrics & Performance
  // ============================================================================

  /**
   * Metrics of importance for this context
   *
   * Type-safe references to metrics that measure this context's health and performance.
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Metric
   *
   * @example [AccountOpeningTimeMetric, SystemUptimeMetric, CustomerSatisfactionMetric]
   */
  metrics?: WithMetric<Constructor>[];

  /**
   * Health indicators: Signals that show this context is operating well
   *
   * Non-metric indicators that suggest context health (qualitative or hard-to-quantify).
   *
   * @example ['Team morale high', 'Low escalation rate', 'Minimal production incidents']
   */
  healthIndicators?: string[];

  // ============================================================================
  // Assumptions & Constraints
  // ============================================================================

  /**
   * Key assumptions this context operates under
   *
   * Explicit assumptions about the environment, resources, or dependencies.
   * Tracking assumptions helps identify risks when assumptions change.
   *
   * @example [
   *   'Regulatory environment remains stable',
   *   'Core banking system maintains 99.99% uptime',
   *   'Customer demand for digital services continues growing'
   * ]
   */
  assumptions?: string[];

  /**
   * Constraints limiting this context
   *
   * Known limitations, restrictions, or boundaries that constrain what this context can do.
   *
   * @example [
   *   'Legacy core banking system limits real-time capabilities',
   *   'Regulatory requirements mandate 7-year data retention',
   *   'Budget frozen until Q3 2025'
   * ]
   */
  constraints?: string[];
}

/**
 * @Context decorator
 * Marks a class as a Context (organizational boundary) with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Contexts represent organizational boundaries and areas of responsibility.
 * They are stakeholder-free - stakeholders reference contexts, not vice versa.
 * This prevents circular dependencies and keeps contexts as pure organizational models.
 *
 * Examples: Retail Banking, Risk & Compliance, Wealth Management, Customer Support
 *
 * @param options - Context configuration
 * @returns Class decorator that brands the class with WithContext type
 *
 * @example
 * ```typescript
 * @Context({
 *   name: 'Retail Banking',
 *   description: 'Personal banking accounts, customer onboarding, and retail banking operations',
 *
 *   // Domain boundaries (what we own)
 *   domainModel: {
 *     coreEntities: ['Account', 'Transaction', 'Customer'],
 *     valueObjects: ['Money', 'AccountNumber', 'Balance'],
 *     ubiquitousLanguage: {
 *       'Customer': 'Individual with at least one active account',
 *       'Active': 'Transaction in last 90 days'
 *     }
 *   },
 *
 *   inScope: [
 *     'Personal savings and current accounts',
 *     'Debit card issuance',
 *     'Account opening and KYC',
 *     'Day-to-day transaction processing'
 *   ],
 *
 *   outOfScope: [
 *     'Credit cards',
 *     'Loans and mortgages',
 *     'Investment products',
 *     'Business banking'
 *   ],
 *
 *   // What we can do
 *   capabilities: {
 *     core: [
 *       'Account lifecycle management',
 *       'Real-time transaction processing',
 *       'Customer identity verification'
 *     ],
 *     supporting: [
 *       'Statement generation',
 *       'Regulatory reporting'
 *     ],
 *     emerging: [
 *       'AI-powered fraud detection',
 *       'Predictive account analytics'
 *     ]
 *   },
 *
 *   // How we work with other contexts
 *   relationships: [
 *     {
 *       context: RiskComplianceContext,
 *       type: ContextRelationship.Downstream,
 *       description: 'Receives KYC verification and fraud screening',
 *       exchanged: ['KYC status', 'fraud alerts', 'compliance clearance'],
 *       handoffProtocol: 'Real-time API callback on verification completion',
 *       communicationPattern: 'async',
 *       frequency: 'real-time'
 *     },
 *     {
 *       context: CustomerSupportContext,
 *       type: ContextRelationship.Partnership,
 *       description: 'Collaborate on customer issue resolution',
 *       exchanged: ['issue tickets', 'account status'],
 *       communicationPattern: 'event-driven',
 *       frequency: 'on-demand'
 *     }
 *   ],
 *
 *   // Organizational structure
 *   owner: 'Sarah Johnson',
 *   team: 'Retail Banking Division',
 *
 *   goals: [
 *     'Maintain 99.9% account system uptime',
 *     'Process account openings within 24 hours',
 *     'Achieve NPS > 60 for retail customers'
 *   ],
 *
 *   // Performance tracking
 *   metrics: [AccountOpeningTimeMetric, SystemUptimeMetric, CustomerSatisfactionMetric],
 *   healthIndicators: ['Team morale high', 'Low escalation rate'],
 *
 *   // Operating environment
 *   assumptions: [
 *     'Regulatory environment remains stable',
 *     'Core banking system maintains high availability'
 *   ],
 *
 *   constraints: [
 *     'Legacy core banking system limits real-time capabilities',
 *     'Regulatory requirements mandate 7-year data retention'
 *   ],
 *
 *   tags: ['customer-facing', 'core-banking', 'regulated']
 * })
 * export class RetailBankingContext {}
 * ```
 */
export function Context(options: ContextOptions) {
  return function <T extends Constructor>(
    target: T,
    _context?: ClassDecoratorContext<T>
  ): WithContext<T> {
    applyBrand(target, 'context');
    void options;
    return target as WithContext<T>;
  };
}
