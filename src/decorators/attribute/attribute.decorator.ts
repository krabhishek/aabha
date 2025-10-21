/**
 * @Attribute Decorator
 * Marks a class property as an Attribute (reusable property definition)
 * @module blueprint/decorators/attribute
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import type { Constructor, WithAttribute } from '../../types/branded-types.js';
import { applyBrand } from '../../internal/brand.utils.js';

/**
 * Attribute decorator options
 */
export interface AttributeOptions {
  /**
   * Attribute name (required)
   */
  name: string;

  /**
   * Data type
   */
  type?: string;

  /**
   * Is this attribute required?
   */
  required?: boolean;

  /**
   * Default value
   */
  defaultValue?: unknown;

  /**
   * Validation rules
   */
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: unknown[];
    custom?: string;
  };

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
 * @Attribute decorator
 * Marks a class as an Attribute with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * @param options - Attribute configuration
 * @returns Class decorator that brands the class with WithAttribute type
 *
 * @example
 * ```typescript
 * @Attribute({
 *   name: 'Email Address',
 *   type: 'string',
 *   required: true,
 *   validation: {
 *     pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
 *   },
 *   description: 'Valid email address for contact'
 * })
 * class EmailAttribute {}
 * ```
 */
export function Attribute(options: AttributeOptions) {
  return function <T extends Constructor>(
    target: T,
    _context: ClassDecoratorContext<T>
  ): WithAttribute<T> {
    applyBrand(target, 'attribute');
    void options;
    return target as WithAttribute<T>;
  };
}
