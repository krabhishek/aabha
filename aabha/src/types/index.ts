/**
 * Type exports
 * @module aabha/types
 */

export type { Constructor } from './constructor.types.js';

export type {
  DecoratorBrand,
  WithAction,
  WithAttribute,
  WithBehavior,
  WithBusinessInitiative,
  WithCollaboration,
  WithContext,
  WithExpectation,
  WithInteraction,
  WithJourney,
  WithMetric,
  WithPersona,
  WithStakeholder,
  WithStrategy,
  WithWitness,
} from './branded-types.js';

export type {
  AllDecorated,
  AtLeastOne,
  ExtractBrand,
  FilterDecorated,
  HasDecorator,
  InstanceTypeOf,
  IsAnyDecorated,
  MakeOptional,
  RequireKeys,
  ValidateArrayBrands,
  ValidateBrand,
  XOR,
} from './type-utilities.js';

export type { BaseDecoratorOptions } from './decorator-options.types.js';
