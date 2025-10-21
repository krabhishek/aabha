/**
 * @Context Decorator
 * Marks a class as a Context (business perspective/lens)
 * @module blueprint/decorators/context
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 *
 * NOTE: This is different from DDD's BoundedContext.
 * Context in blueprint represents business perspectives (Sales, Marketing, Compliance)
 * while BoundedContext in bhasha represents domain boundaries.
 */

import type { ContextRelationship } from '../../enums/context-relationship.enum.js';
import { applyBrand } from '../../internal/brand.utils.js';
import type {
  Constructor,
  WithContext,
  WithStakeholder,
} from '../../types/branded-types.js';
import type { BaseDecoratorOptions } from '../../types/decorator-options.types.js';

/**
 * Relationship to another context
 */
export interface ContextRelationshipDefinition {
  /**
   * Related context
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Context
   */
  context: WithContext<Constructor>;

  /**
   * Type of relationship
   */
  type: ContextRelationship;

  /**
   * Description of the relationship
   */
  description?: string;

  /**
   * Data/services exchanged
   */
  exchanged?: string[];
}

/**
 * Context decorator options
 * Represents a business perspective or lens
 */
export interface ContextOptions extends BaseDecoratorOptions {
  /**
   * Context name (required)
   * Examples: "Sales", "Marketing", "Compliance", "Customer Support"
   */
  name: string;

  /**
   * Stakeholders who operate within this context
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Stakeholder
   *
   * @example
   * ```typescript
   * stakeholders: [SalesRepStakeholder, SalesManagerStakeholder]
   * ```
   */
  stakeholders?: WithStakeholder<Constructor>[];

  /**
   * Relationships with other contexts
   *
   * @example
   * ```typescript
   * relationships: [
   *   {
   *     context: MarketingContext,
   *     type: ContextRelationship.Partnership,
   *     description: 'Lead generation and qualification',
   *     exchanged: ['leads', 'conversion metrics']
   *   }
   * ]
   * ```
   */
  relationships?: ContextRelationshipDefinition[];

  /**
   * Primary goals of this context
   */
  goals?: string[];

  /**
   * Key responsibilities of this context
   */
  responsibilities?: string[];

  /**
   * Core concerns of this context
   */
  concerns?: string[];

  /**
   * Human-readable description
   */
  description?: string;

  /**
   * Tags for categorization
   */
  tags?: string[];

  /**
   * Context owner/lead
   */
  owner?: string;

  /**
   * Team or department
   */
  team?: string;

  /**
   * Systems/tools used in this context
   */
  systems?: string[];
}

/**
 * @Context decorator
 * Marks a class as a Context (business perspective) with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Contexts represent business lenses through which we view stakeholder interests.
 * Examples: Sales, Marketing, Compliance, Audit, Customer Support, etc.
 *
 * @param options - Context configuration
 * @returns Class decorator that brands the class with WithContext type
 *
 * @example
 * ```typescript
 * @Context({
 *   name: 'Sales',
 *   stakeholders: [SalesRepStakeholder, SalesManagerStakeholder],
 *   relationships: [
 *     {
 *       context: MarketingContext,
 *       type: ContextRelationship.Partnership,
 *       description: 'Lead generation collaboration',
 *       exchanged: ['qualified leads', 'conversion data']
 *     },
 *     {
 *       context: BillingContext,
 *       type: ContextRelationship.Downstream,
 *       description: 'Pass closed deals for invoicing',
 *       exchanged: ['deal details', 'pricing info']
 *     }
 *   ],
 *   goals: [
 *     'Maximize revenue',
 *     'Build customer relationships',
 *     'Meet quarterly targets'
 *   ],
 *   responsibilities: [
 *     'Lead qualification',
 *     'Deal closing',
 *     'Customer onboarding'
 *   ],
 *   systems: ['Salesforce', 'HubSpot', 'LinkedIn Sales Navigator']
 * })
 * class SalesContext {}
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
