/**
 * @Stakeholder Decorator
 * Marks a class as a Stakeholder (context-specific role)
 * @module aabha/decorators/stakeholder
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import type {
  Constructor,
  WithStakeholder,
  WithPersona,
  WithContext,
  BaseDecoratorOptions,
} from '../../types/index.js';
import type { StakeholderType } from '../../enums/stakeholder-type.enum.js';
import { applyBrand } from '../../internal/brand.utils.js';

/**
 * Stakeholder decorator options
 */
export interface StakeholderOptions extends BaseDecoratorOptions {
  /**
   * Type of stakeholder (required)
   * Distinguishes between Human, Team, Organization, and System stakeholders
   *
   * @example
   * ```typescript
   * type: StakeholderType.System
   * type: StakeholderType.Human
   * ```
   */
  type: StakeholderType;

  /**
   * Stakeholder role name (required)
   * Example: "Investor", "Account Owner", "Email Validation Service"
   */
  role: string;

  /**
   * Reference to underlying persona (required)
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Persona
   *
   * Even systems have personas! A persona represents the entity's identity
   * and characteristics, while the stakeholder role is context-specific.
   *
   * @example
   * ```typescript
   * // Human persona
   * persona: TechSavvyMillennial
   *
   * // System persona
   * persona: AuthenticationSystemPersona
   * ```
   */
  persona: WithPersona<Constructor>;

  /**
   * Business context where this stakeholder operates (required)
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Context
   *
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
 * Key concept: The same persona can be different stakeholders in different contexts.
 * For example, an AuthenticationSystem persona can be:
 * - "Authentication Provider" stakeholder in a Login context
 * - "Audit Subject" stakeholder in an Audit context
 *
 * @param options - Stakeholder configuration
 * @returns Class decorator that brands the class with WithStakeholder type
 *
 * @example Human Stakeholder
 * ```typescript
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Investor',
 *   persona: TechSavvyMillennial,
 *   context: InvestmentContext,
 *   goals: ['Maximize returns', 'Track portfolio in real-time'],
 *   responsibilities: ['Review opportunities', 'Monitor performance'],
 *   influence: 'high',
 *   engagement: 'daily'
 * })
 * class InvestorStakeholder {}
 * ```
 *
 * @example System Stakeholder
 * ```typescript
 * @Stakeholder({
 *   type: StakeholderType.System,
 *   role: 'Email Validation Provider',
 *   persona: EmailValidationSystemPersona,
 *   context: DigitalBankingContext,
 *   responsibilities: ['Validate email format', 'Check DNS records'],
 *   permissions: ['read_email_input', 'write_validation_result']
 * })
 * class EmailValidationServiceStakeholder {}
 * ```
 */
export function Stakeholder(options: StakeholderOptions) {
  return function <T extends Constructor>(
    target: T,
    _context?: ClassDecoratorContext<T>
  ): WithStakeholder<T> {
    applyBrand(target, 'stakeholder');
    void options;
    return target as WithStakeholder<T>;
  };
}
