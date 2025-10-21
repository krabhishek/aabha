/**
 * Type exports
 * @module aabha/types
 */

export type { Constructor } from './constructor.types.js';

export type {
  DecoratorBrand,
  WithStrategy,
  WithBusinessInitiative,
  WithMetric,
  WithContext,
  WithJourney,
  WithMilestone,
  WithStep,
  WithExpectation,
  WithStakeholder,
  WithPersona,
  WithBehavior,
  WithAttribute,
  WithWitness,
} from './branded-types.js';

export type {
  HasDecorator,
  FilterDecorated,
  AllDecorated,
  RequireKeys,
  XOR,
  AtLeastOne,
  MakeOptional,
  InstanceTypeOf,
  IsAnyDecorated,
  ExtractBrand,
  ValidateBrand,
  ValidateArrayBrands,
} from './type-utilities.js';

export type {
  ExchangeItem,
  ExchangeConstraints,
  ExchangeContract,
} from './exchange-contract.types.js';

export type {
  BaseDecoratorOptions,
} from './decorator-options.types.js';
