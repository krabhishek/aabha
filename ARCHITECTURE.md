# Blueprint Architecture: Compile-Time Only Product Management

## Design Philosophy

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
Expectation (stakeholder contract between provider and consumer)
  ↓ references
Behavior (executable behavior with witnesses)
  ↓ contains
Witness (method-level proof that behavior works)
```

**One-Way Rule**: Parents reference children via branded arrays. Children have NO knowledge of parents (`kunti` pattern - `#iykyk` 😂).

**Contract Model**: Expectations define explicit contracts between two stakeholders:
- **Provider**: Stakeholder who fulfills the expectation
- **Consumer**: Stakeholder who benefits from the expectation
- **Exchange**: Optional structured contract defining inputs, outputs, interaction pattern, and constraints

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
- `@Expectation` - Stakeholder expectations (contracts between provider and consumer)
- `@Stakeholder` - Context-specific stakeholder roles (Human, Team, Organization, System)
- `@Persona` - Underlying user/system personas

### Behavioral Level
- `@Behavior` - Executable behaviors with participant stakeholders
- `@Witness` - Method-level verification witnesses (live inside Behavior classes)
- `@Attribute` - Reusable attributes

## Example Usage

```typescript
// 1. Define stakeholders with types
@Stakeholder({
  type: StakeholderType.System,
  role: 'Email Validation Service',
  persona: EmailValidationSystemPersona,
  context: DigitalBankingContext,
})
class EmailValidationServiceStakeholder {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Digital-First Customer',
  persona: TechSavvyMillennialPersona,
  context: RetailBankingContext,
})
class DigitalFirstCustomerStakeholder {}

// 2. Define behavior with witnesses and participants
@Behavior({
  name: 'Validate Email Format',
  participants: [EmailValidationServiceStakeholder],
  implementation: 'RFC 5322 regex validation + DNS MX check',
})
class ValidateEmailBehavior {
  @Witness({
    name: 'Valid Email Format Witness',
    type: WitnessType.Unit,
    given: ['Valid email format provided'],
    when: ['Validation executes'],
    then: ['Returns true', 'No errors thrown']
  })
  witnessValidFormat() {
    const result = this.validate('test@example.com');
    assert(result === true);
  }

  validate(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// 3. Define expectation as contract with exchange
@Expectation({
  name: 'Fast Email Validation',
  description: 'Email validation completes in under 1 second',
  provider: EmailValidationServiceStakeholder, // Who provides
  consumer: DigitalFirstCustomerStakeholder,   // Who benefits
  exchange: {
    inputs: ['email address string'],
    outputs: ['validation result boolean', 'error message if invalid'],
    interactionPattern: InteractionPattern.RequestResponse,
    constraints: {
      maxLatency: '< 1 second',
      availability: '99.9%'
    }
  },
  behaviors: [ValidateEmailBehavior], // Type-safe! Must be WithBehavior
})
class FastEmailValidationExpectation {}

// 4. If you try to pass a non-Behavior class, TypeScript error!
class NotABehavior {}

@Expectation({
  name: 'Invalid Expectation',
  provider: EmailValidationServiceStakeholder,
  consumer: DigitalFirstCustomerStakeholder,
  behaviors: [NotABehavior], // ❌ COMPILE ERROR! Missing @Behavior decorator
})
class BadExpectation {}
```

## Compilation = Validation

When the TypeScript compiler completes without errors, you know:

✅ All hierarchies are valid (parents reference properly branded children)
✅ All required fields are provided
✅ All relationships are consistent
✅ One-way reference rule is maintained

**No runtime checks needed. No runtime overhead. Pure compile-time safety.**
