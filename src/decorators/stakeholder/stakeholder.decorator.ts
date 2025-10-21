/**
 * @Stakeholder Decorator
 * Marks a class as a Stakeholder (context-specific role)
 * @module blueprint/decorators/stakeholder
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import type {
  Constructor,
  WithStakeholder,
  WithPersona,
  WithContext,
} from '../../types/branded-types.js';
import { applyBrand } from '../../internal/brand.utils.js';

/**
 * Stakeholder decorator options
 */
export interface StakeholderOptions {
  /**
   * Stakeholder role name (required)
   * Example: "Investor", "Account Owner", "Compliance Officer"
   */
  role: string;

  /**
   * Reference to underlying persona (required)
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Persona
   *
   * @example
   * ```typescript
   * persona: TechSavvyMillennial // Must have @Persona decorator
   * ```
   */
  persona: WithPersona<Constructor>;

  /**
   * Business context where this stakeholder operates (required)
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Context
   *
   * NOTE: This is blueprint's @Context (business perspective),
   * NOT bhasha's @BoundedContext (domain boundary)
   *
   * @example
   * ```typescript
   * context: InvestmentContext // Must have @Context decorator
   * ```
   */
  context: WithContext<Constructor>;

  /**
   * Stakeholder name (defaults to role)
   */
  name?: string;

  /**
   * Context-specific goals
   */
  goals?: string[];

  /**
   * Context-specific responsibilities
   */
  responsibilities?: string[];

  /**
   * Stakeholder interests in this context
   */
  interests?: string[];

  /**
   * Influence level
   */
  influence?: 'low' | 'medium' | 'high';

  /**
   * Engagement frequency
   */
  engagement?: 'daily' | 'weekly' | 'monthly' | 'occasional';

  /**
   * Context-specific attributes
   */
  contextAttributes?: Record<string, unknown>;

  /**
   * Permissions in this context
   */
  permissions?: string[];

  /**
   * Relationships to other stakeholders
   */
  relationships?: Record<string, string | string[]>;

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
 * @Stakeholder decorator
 * Marks a class as a Stakeholder with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Stakeholders represent context-specific roles that a Persona plays.
 * They bridge WHO (persona) with WHAT (role) in WHERE (context).
 *
 * @param options - Stakeholder configuration
 * @returns Class decorator that brands the class with WithStakeholder type
 *
 * @example
 * ```typescript
 * @Stakeholder({
 *   role: 'Investor',
 *   persona: TechSavvyMillennial,
 *   context: InvestmentContext,
 *   goals: [
 *     'Maximize returns',
 *     'Track portfolio in real-time',
 *     'Minimize risk'
 *   ],
 *   responsibilities: [
 *     'Review investment opportunities',
 *     'Monitor portfolio performance',
 *     'Rebalance portfolio quarterly'
 *   ],
 *   interests: ['Market trends', 'Portfolio diversification', 'Tax optimization'],
 *   influence: 'high',
 *   engagement: 'daily',
 *   permissions: ['view_portfolio', 'execute_trades', 'download_statements'],
 *   contextAttributes: {
 *     riskTolerance: 'moderate',
 *     investmentHorizon: '10+ years',
 *     preferredAssets: ['stocks', 'bonds', 'crypto']
 *   }
 * })
 * class InvestorStakeholder {}
 * ```
 */
export function Stakeholder(options: StakeholderOptions) {
  return function <T extends Constructor>(
    target: T,
    _context: ClassDecoratorContext<T>
  ): WithStakeholder<T> {
    applyBrand(target, 'stakeholder');
    void options;
    return target as WithStakeholder<T>;
  };
}
