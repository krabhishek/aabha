/**
 * Type-level utilities for compile-time validation
 * @module aabha/types/type-utilities
 *
 * These utilities enable powerful compile-time checks and transformations,
 * turning runtime validation into TypeScript type errors.
 */

import type { Constructor, DecoratorBrand } from './branded-types.js';

/**
 * Check if a type has a specific decorator brand at compile time
 *
 * @template T The type to check
 * @template D The decorator brand string to look for
 *
 * @example
 * ```typescript
 * type IsJourney = HasDecorator<typeof CustomerJourney, 'journey'>; // true or false
 * ```
 */
export type HasDecorator<T, D extends string> =
  T extends DecoratorBrand<D> ? true : false;

/**
 * Filter a union of types to only those with a specific decorator
 *
 * @template T Union of types to filter
 * @template D The decorator brand string to filter by
 *
 * @example
 * ```typescript
 * type AllClasses = typeof CustomerJourney | typeof Product | typeof Order;
 * type OnlyJourneys = FilterDecorated<AllClasses, 'journey'>;
 * ```
 */
export type FilterDecorated<T, D extends string> =
  T extends DecoratorBrand<D> ? T : never;

/**
 * Ensure all elements in an array type have a specific decorator
 *
 * @template T Array of constructor types
 * @template D The decorator brand string required
 *
 * @example
 * ```typescript
 * // Compile-time error if any journey is missing @Journey decorator
 * type ValidJourneys = AllDecorated<[typeof Journey1, typeof Journey2], 'journey'>;
 * ```
 */
export type AllDecorated<T extends readonly Constructor[], D extends string> = {
  [K in keyof T]: T[K] extends DecoratorBrand<D> ? T[K] : never;
};

/**
 * Make specific keys required in an object type
 *
 * @template T The object type
 * @template K Keys to make required
 *
 * @example
 * ```typescript
 * type Optional = { name?: string; age?: number };
 * type Required = RequireKeys<Optional, 'name'>; // { name: string; age?: number }
 * ```
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Exclusive OR - require exactly one of two property sets
 *
 * This enforces that either all properties from T are present (and U is absent),
 * or all properties from U are present (and T is absent), but never both.
 *
 * @template T First property set
 * @template U Second property set
 *
 * @example
 * ```typescript
 * type Options = XOR<{ journey: Journey }, { journeys: Journey[] }>;
 * // Valid: { journey: foo } or { journeys: [foo, bar] }
 * // Invalid: { journey: foo, journeys: [bar] } or {}
 * ```
 */
export type XOR<T, U> =
  | (T & { [K in keyof U]?: never })
  | (U & { [K in keyof T]?: never });

/**
 * Ensure at least one property from a set is present
 *
 * @template T The object type
 * @template Keys Union of key names that must have at least one present
 *
 * @example
 * ```typescript
 * type Options = { journey?: Journey; journeys?: Journey[]; other?: number };
 * type RequireOne = AtLeastOne<Options, 'journey' | 'journeys'>;
 * // Valid: { journey: foo } or { journeys: [] } or { journey: foo, journeys: [] }
 * // Invalid: { other: 1 } (missing journey/journeys)
 * ```
 */
export type AtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/**
 * Make specific keys optional in an object type
 *
 * @template T The object type
 * @template K Keys to make optional
 *
 * @example
 * ```typescript
 * type Required = { name: string; age: number };
 * type Optional = MakeOptional<Required, 'age'>; // { name: string; age?: number }
 * ```
 */
export type MakeOptional<T, K extends keyof T> =
  Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Extract the instance type from a constructor or branded constructor
 *
 * @template T Constructor type (possibly branded)
 *
 * @example
 * ```typescript
 * @Journey({ name: 'Customer Journey' })
 * class CustomerJourney {}
 *
 * type Instance = InstanceTypeOf<WithJourney<typeof CustomerJourney>>; // CustomerJourney
 * ```
 */
export type InstanceTypeOf<T extends Constructor> =
  T extends new (...args: unknown[]) => infer R ? R : never;

/**
 * Check if a type is branded with any decorator
 *
 * @template T The type to check
 *
 * @example
 * ```typescript
 * type IsDecorated = IsAnyDecorated<WithJourney<typeof CustomerJourney>>; // true
 * type IsNotDecorated = IsAnyDecorated<typeof Product>>; // false
 * ```
 */
export type IsAnyDecorated<T> =
  T extends DecoratorBrand<string> ? true : false;

/**
 * Extract decorator brand name from a branded type
 *
 * @template T Branded type
 *
 * @example
 * ```typescript
 * type Brand = ExtractBrand<WithJourney<typeof CustomerJourney>>; // 'journey'
 * ```
 */
export type ExtractBrand<T> = T extends DecoratorBrand<infer D> ? D : never;

/**
 * Validate that a class reference has the expected brand
 * Returns the type if valid, never if invalid
 *
 * @template T The type to validate
 * @template D The expected decorator brand
 *
 * @example
 * ```typescript
 * type Valid = ValidateBrand<WithJourney<typeof CustomerJourney>, 'journey'>; // WithJourney<...>
 * type Invalid = ValidateBrand<typeof SomeClass, 'journey'>; // never
 * ```
 */
export type ValidateBrand<T, D extends string> =
  T extends DecoratorBrand<D> ? T : never;

/**
 * Validate that all array elements have the expected brand
 *
 * @template T Array type
 * @template D The expected decorator brand
 *
 * @example
 * ```typescript
 * type Valid = ValidateArrayBrands<[WithJourney<...>, WithJourney<...>], 'journey'>;
 * type Invalid = ValidateArrayBrands<[WithJourney<...>, SomeClass], 'journey'>; // Contains never
 * ```
 */
export type ValidateArrayBrands<T extends readonly unknown[], D extends string> = {
  [K in keyof T]: ValidateBrand<T[K], D>;
};
