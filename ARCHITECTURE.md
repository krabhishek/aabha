# Blueprint Architecture: Compile-Time Only Product Management

## Design Philosophy (The `kunti` Design)

Blueprint is a **compile-time focused** package that uses TypeScript's type system for validation. The goal is:

> **Type error-free compilation = Internally consistent and complete product model**

## TypeScript 5.0+ Stage 3 Decorators

Blueprint uses **native Stage 3 decorators** (TypeScript 5.0+), NOT the legacy experimental decorators:

- ✅ **Stage 3 decorators** - Modern, standardized ECMAScript decorators
- ❌ **NOT experimental decorators** - Legacy pre-TC39 syntax
- ⚡ **Native TypeScript support** - No transpilation needed
- 🎯 **Standard compliant** - Follows ECMAScript specification

**Configuration**: Ensure `experimentalDecorators` is **false** or **omitted** in tsconfig.json.

### Minimal Runtime Overhead

- **Phantom properties only** - Tiny non-enumerable `__decoratorBrand` via `Object.defineProperty`
- **No metadata storage** - No use of `Symbol.metadata` for runtime access
- **Compile-time validation** - All type checking happens at compile time
- **Type-level operations** - Branded types enforce relationships
- **2.16 KB bundle** - Entire package (0.69 KB gzipped)

### Compile-Time Safety Guarantees

1. **Hierarchy Enforcement** - Parents can only reference properly branded children
2. **Completeness Validation** - Required fields must be provided (enforced by types)
3. **Consistency Checking** - Relationships must be valid (e.g., Journey can only reference WithMilestone types)
4. **One-Way References** - Children cannot reference parents (enforced by type system)

## Type System Architecture

### 1. Decorator Brands

Each decorator applies a unique brand to enforce compile-time type checking:

```typescript
// Branded type for @Strategy
export type WithStrategy<T extends Constructor = Constructor> =
  T & DecoratorBrand<'strategy'>;

// Branded type for @BusinessInitiative
export type WithBusinessInitiative<T extends Constructor = Constructor> =
  T & DecoratorBrand<'business-initiative'>;

// etc...
```

### 2. Decorator Options with Type Constraints

Decorator options use branded types to enforce relationships:

```typescript
export interface BusinessInitiativeOptions {
  name: string;
  strategy?: WithStrategy<Constructor>; // Can only reference @Strategy classes
  journeys?: Array<WithJourney<Constructor>>; // Can only reference @Journey classes
  metrics?: Array<WithMetric<Constructor>>; // Can only reference @Metric classes
}
```

### 3. Pure Type-Level Decorators

Decorators are lightweight - they only apply brands, no runtime logic:

```typescript
export function Strategy(options: StrategyOptions) {
  return function <T extends Constructor>(
    target: T,
    _context: ClassDecoratorContext<T>
  ): WithStrategy<T> {
    // NO runtime validation
    // NO metadata storage
    // Just return the branded type
    return target as WithStrategy<T>;
  };
}
```

### 4. Type-Level Validators (Optional)

For advanced validation, we can provide type-level utilities:

```typescript
// Check if all journeys in an initiative have the required structure
type ValidateInitiativeJourneys<T extends WithBusinessInitiative> =
  T extends { journeys: infer J }
    ? J extends Array<WithJourney>
      ? T
      : never
    : never;
```

## Hierarchy Model

```
Strategy (business strategy)
  ↓ references
BusinessInitiative (strategic initiative)
  ↓ references
Journey (user experience)
  ↓ references
Milestone (significant waypoint)
  ↓ references
Step (granular action)
  ↓ references
Expectation (stakeholder expectation)
  ↓ references
Behavior (executable behavior)
  ↓ references
Test (verification)
```

**One-Way Rule**: Parents reference children via branded arrays. Children have NO knowledge of parents.

## Decorator Reference

### Strategic Level
- `@Strategy` - Business strategy (where to play, how to win)
- `@BusinessInitiative` - Concrete strategic initiatives
- `@Metric` - Measurable outcomes (can attach to any level)
- `@Context` - Business perspectives (Sales, Marketing, Compliance, etc.)

### Journey Level
- `@Journey` - User/stakeholder experience flows
- `@Milestone` - Significant waypoints in a journey
- `@Step` - Granular actions within a milestone

### Expectation Level
- `@Expectation` - Stakeholder expectations
- `@Stakeholder` - Context-specific stakeholder roles
- `@Persona` - Underlying user personas

### Behavioral Level
- `@Behavior` - Executable behaviors (no Logic/Policy/Rule/Specification)
- `@Test` - Verification tests
- `@Attribute` - Reusable attributes

## Example Usage

```typescript
// 1. Define strategy
@Strategy({
  name: 'E-Commerce Growth',
  whereToPlay: ['Direct-to-Consumer', 'B2B Marketplace'],
  howToWin: 'Best-in-class UX with 24/7 support',
})
class ECommerceStrategy {}

// 2. Define initiative linked to strategy
@BusinessInitiative({
  name: 'Seamless Checkout Experience',
  strategy: ECommerceStrategy, // Type-safe! Must be WithStrategy
  objectives: ['Reduce cart abandonment by 30%'],
})
class SeamlessCheckoutInitiative {}

// 3. Define journey linked to initiative
@Journey({
  name: 'Product Purchase',
  primaryStakeholder: CustomerStakeholder,
})
class ProductPurchaseJourney {}

// 4. Link journey to initiative (parent knows child)
@BusinessInitiative({
  name: 'Seamless Checkout Experience',
  strategy: ECommerceStrategy,
  journeys: [ProductPurchaseJourney], // Type-safe! Must be WithJourney
})
class SeamlessCheckoutInitiativeComplete {}

// 5. If you try to pass a non-Journey class, TypeScript error!
class NotAJourney {}

@BusinessInitiative({
  name: 'Seamless Checkout Experience',
  journeys: [NotAJourney], // ❌ COMPILE ERROR! Missing @Journey decorator
})
class BadInitiative {}
```

## Compilation = Validation

When the TypeScript compiler completes without errors, you know:

✅ All hierarchies are valid (parents reference properly branded children)
✅ All required fields are provided
✅ All relationships are consistent
✅ One-way reference rule is maintained

**No runtime checks needed. No runtime overhead. Pure compile-time safety.**
