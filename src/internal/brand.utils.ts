/**
 * Internal branding utilities
 * @module blueprint/internal
 * @internal
 */

import type { Constructor } from '../types/constructor.types.js';

/**
 * Apply a decorator brand to a class constructor
 * This adds a non-enumerable __decoratorBrand property for TypeScript type checking
 *
 * @param target - Class constructor
 * @param brand - Brand identifier
 * @internal
 */
export function applyBrand<T extends Constructor>(
  target: T,
  brand: string
): void {
  Object.defineProperty(target, '__decoratorBrand', {
    value: brand,
    enumerable: false, // Hidden from Object.keys() and for...in loops
    configurable: false, // Cannot be deleted or reconfigured
    writable: false, // Cannot be changed
  });
}
