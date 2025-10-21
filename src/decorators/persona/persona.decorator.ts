/**
 * @Persona Decorator
 * Marks a class as a Persona (user archetype)
 * @module blueprint/decorators/persona
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import { applyBrand } from '../../internal/brand.utils.js';
import type { Constructor, WithPersona } from '../../types/branded-types.js';
import type { BaseDecoratorOptions } from '../../types/decorator-options.types.js';

/**
 * Persona decorator options
 */
export interface PersonaOptions extends BaseDecoratorOptions {
  /**
   * Persona name (required)
   * Example: "Tech-Savvy Millennial", "Budget-Conscious Parent"
   */
  name: string;

  /**
   * Age range
   */
  age?: string;

  /**
   * Occupation
   */
  occupation?: string;

  /**
   * Goals this persona wants to achieve
   */
  goals?: string[];

  /**
   * Pain points and frustrations
   */
  painPoints?: string[];

  /**
   * Motivations driving this persona
   */
  motivations?: string[];

  /**
   * Behavioral characteristics
   */
  characteristics?: string[];

  /**
   * Technical proficiency level
   */
  technicalProficiency?: 'low' | 'medium' | 'high';

  /**
   * Preferred channels (mobile, web, in-person, etc.)
   */
  preferredChannels?: string[];

  /**
   * Human-readable description
   */
  description?: string;

  /**
   * Tags for categorization
   */
  tags?: string[];

  /**
   * Demographics
   */
  demographics?: Record<string, unknown>;
}

/**
 * @Persona decorator
 * Marks a class as a Persona with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Personas represent user archetypes - WHO people are (demographics, psychology).
 * Stakeholders (decorated with @Stakeholder) represent WHAT people do in specific contexts.
 *
 * @param options - Persona configuration
 * @returns Class decorator that brands the class with WithPersona type
 *
 * @example
 * ```typescript
 * @Persona({
 *   name: 'Tech-Savvy Millennial',
 *   age: '25-35',
 *   occupation: 'Software Engineer',
 *   goals: [
 *     'Manage finances efficiently',
 *     'Track investments in real-time',
 *     'Automate savings'
 *   ],
 *   painPoints: [
 *     'Complex banking interfaces',
 *     'Lack of mobile-first features',
 *     'Poor integration with fintech apps'
 *   ],
 *   motivations: ['Financial independence', 'Tech convenience', 'Data transparency'],
 *   technicalProficiency: 'high',
 *   preferredChannels: ['mobile app', 'web app', 'API']
 * })
 * class TechSavvyMillennial {}
 * ```
 */
export function Persona(options: PersonaOptions) {
  return function <T extends Constructor>(
    target: T,
    _context?: ClassDecoratorContext<T>
  ): WithPersona<T> {
    applyBrand(target, 'persona');
    void options;
    return target as WithPersona<T>;
  };
}
