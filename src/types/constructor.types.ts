/**
 * Constructor type definitions
 * @module blueprint/types
 */

/**
 * Generic constructor type
 */
export type Constructor<T = unknown> = new (...args: never[]) => T;
