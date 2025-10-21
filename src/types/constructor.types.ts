/**
 * Constructor type definitions
 * @module aabha/types
 */

/**
 * Generic constructor type
 */
export type Constructor<T = unknown> = new (...args: never[]) => T;
