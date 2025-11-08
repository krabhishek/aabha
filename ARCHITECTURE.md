# Aabha Architecture: Compile-Time Only Context Engineering

## Design Philosophy

Aabha is a **compile-time focused** package that uses TypeScript's type system for validation. The goal is:

> **Type error-free compilation = Internally consistent and complete context model**

### Context Engineering Through Type Safety

Aabha's compile-time architecture directly supports **systematic context engineering** for AI systems:

- **Structured Context**: Type-safe decorators enforce consistent context modeling across the enterprise
- **AI Comprehension**: Compile-time validation ensures context is internally consistent before AI systems consume it
- **Enterprise Scale**: TypeScript's type system scales to complex contexts (digital + offline + organizational)
- **Zero Runtime Cost**: All validation happens at compile-time, leaving engineered context lightweight for AI processing

The compile-time approach means **invalid context never reaches production**—only well-formed, type-checked enterprise context is available to AI systems.

## TypeScript Decorator Compatibility

Aabha uses **Stage 3 decorator syntax** with **optional context parameters** for hybrid compatibility:

```typescript
export function Decorator(options: Options) {
  return function <T extends Constructor>(
    target: T,
    _context?: ClassDecoratorContext<T>  // Optional for hybrid compatibility
  ): WithDecorator<T> {
    applyBrand(target, 'decorator');
    void options;
    return target as WithDecorator<T>;
  };
}
```

This pattern supports both:
- ✅ **Stage 3 decorators** (TypeScript 5.0+, recommended) - `experimentalDecorators: false` or omitted
- ✅ **Experimental decorators** (legacy) - `experimentalDecorators: true`

**Why it works**: The optional `_context?` parameter allows the decorator to be called with or without the context argument. Since Aabha performs all validation at compile-time through type branding, we don't rely on decorator context for runtime behavior.

**Recommendation**: Use **Stage 3 decorators** (the default in TypeScript 5.0+) by ensuring `experimentalDecorators` is **false** or **omitted** in tsconfig.json.

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
Context (organizational boundary - WHERE business happens)
  ↓
Persona (archetype - WHO people ARE, context-independent)
  +
Context
  ↓
Stakeholder (role - WHAT people DO = Persona + Context + Role)
  ↓
Journey (container for related actions)
  ↓
Action (event-driven DAG nodes - unified atomic/composite/journey/system scopes)
  ↓
Expectation (provider/consumer contracts with SLO/SLI)
  +
Interaction (technical exchange contracts across 7 layers)
  +
Collaboration (multi-stakeholder coordination)
  ↓
Behavior (executable implementation)
  ↓
Witness (BDD-style method-level proof)
  ↓
Metric (measurable outcomes - can attach to any level)
```

**One-Way Rule**: Parents reference children via branded arrays. Children have NO knowledge of parents (`kunti` pattern - `#iykyk` 😂).

**Action Flow**: Actions form a **Directed Acyclic Graph** via forward-looking `triggers`, not linear flows. Journey is a container; flow emerges from event-driven action triggers.

**Contract Model**: Three layers of contracts:
- **Expectation**: Provider/consumer contracts (WHAT stakeholders want - SLO/SLI, quality metrics)
- **Interaction**: Technical exchange contracts (HOW they exchange - 7 layers: Frontend, Backend, Data, Device, Interpersonal, Manual, Organizational)
- **Collaboration**: Multi-stakeholder coordination (meetings, reviews, approvals, governance)

**Stakeholder Formula**: `Stakeholder = WHO (persona) + WHAT (role) + WHERE (context)`

## Decorator Reference

**13 Total Decorators**: 12 class decorators + 1 method decorator

### Strategic Level
- `@Strategy` - Business strategy (where to play, how to win)
- `@BusinessInitiative` - Strategic initiatives that execute the strategy
- `@Metric` - Measurable outcomes (KPIs, can attach to any level)
- `@Context` - Organizational boundaries (DDD bounded contexts)

### Journey Level
- `@Journey` - Container for related actions (minimal metadata)
- `@Action` - Unified event-driven actions (replaces @Step and @Milestone)
  - Scopes: `Atomic`, `Composite`, `Journey`, `System`
  - Form DAG via forward-looking `triggers`

### People Level
- `@Persona` - WHO people ARE (archetypes, context-independent)
- `@Stakeholder` - WHAT people DO (Persona + Context + Role)

### Contract Level
- `@Expectation` - Provider/consumer contracts (SLO/SLI, quality metrics)
- `@Interaction` - Technical exchange contracts (7 layers: Frontend, Backend, Data, Device, Interpersonal, Manual, Organizational)
- `@Collaboration` - Multi-stakeholder coordination (meetings, reviews, governance)

### Implementation Level
- `@Behavior` - Executable implementation (class decorator)
- `@Witness` - **METHOD DECORATOR** for BDD-style verification (only method decorator!)
- `@Attribute` - Reusable data properties (class decorator, rare edge case)

## Example Usage

```typescript
// 1. Define persona (WHO people ARE - reusable archetype)
@Persona({
  name: 'Tech-Savvy Millennial',
  description: 'Digital-first, mobile-native, expects instant gratification',
})
export class TechSavvyMillennialPersona {}

// 2. Define stakeholder (WHAT they DO in specific context)
@Stakeholder({
  type: StakeholderType.Human,
  role: 'Digital Banking Customer',
  persona: TechSavvyMillennialPersona,  // Direct class reference
  context: DigitalBankingContext,
  responsibilities: ['Opens accounts', 'Transfers money', 'Pays bills'],
})
export class DigitalBankingCustomerStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Email Validation Service',
  persona: EmailValidationSystemPersona,
  context: DigitalBankingContext,
})
export class EmailValidationServiceStakeholder {}

// 3. Define action (event-driven DAG node)
@Action({
  name: 'Enter Email Address',
  scope: ActionScope.Atomic,  // Atomic, Composite, Journey, or System
  primaryStakeholder: DigitalBankingCustomerStakeholder,
  triggers: [ValidateEmailAction],  // Forward-looking triggers (DAG)
})
export class EnterEmailAction {}

@Action({
  name: 'Validate Email',
  scope: ActionScope.Composite,
  primaryStakeholder: EmailValidationServiceStakeholder,
  triggers: [CheckEmailUniquenessAction],
})
export class ValidateEmailAction {}

// 4. Define interaction (technical contract - 7 layers)
@Interaction({
  name: 'Email Validation API Call',
  layer: InteractionLayer.Backend,  // Frontend, Backend, Data, Device, Interpersonal, Manual, Organizational
  pattern: InteractionPattern.RequestResponse,
  participants: [DigitalBankingCustomerStakeholder, EmailValidationServiceStakeholder],
  protocol: {
    method: 'POST',
    endpoint: '/api/v1/validate-email',
    requestSchema: 'EmailValidationRequest',
    responseSchema: 'EmailValidationResponse',
  },
})
export class EmailValidationAPIInteraction {}

// 5. Define behavior with witnesses
@Behavior({
  name: 'Validate Email Format',
  participants: [EmailValidationServiceStakeholder],
  implementation: 'RFC 5322 regex + DNS MX check',
})
export class ValidateEmailBehavior {
  @Witness({
    name: 'Valid Format Accepted',
    type: WitnessType.Unit,
    given: ['Valid email format'],
    when: ['Validation runs'],
    then: ['Returns true']
  })
  witnessValidFormat() {
    assert(this.validate('test@example.com') === true);
  }

  validate(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// 6. Define expectation (provider/consumer contract)
@Expectation({
  name: 'Fast Email Validation',
  provider: EmailValidationServiceStakeholder,  // WHO provides
  consumer: DigitalBankingCustomerStakeholder,  // WHO consumes
  interaction: EmailValidationAPIInteraction,   // HOW they exchange (primary)
  quality: {
    slo: {
      latency: { p95: '800ms' },
      availability: { target: '99.9%' }
    }
  },
  behaviors: [ValidateEmailBehavior],  // Type-safe! Must be WithBehavior
})
export class FastEmailValidationExpectation {}

// ❌ COMPILE ERROR if non-decorated class is used
class NotABehavior {}

@Expectation({
  name: 'Invalid Example',
  provider: EmailValidationServiceStakeholder,
  consumer: DigitalBankingCustomerStakeholder,
  behaviors: [NotABehavior],  // ❌ TYPE ERROR! Missing @Behavior brand
})
export class InvalidExpectation {}
```

## Key Architectural Concepts

### 1. Direct Class References (Not Arrow Functions)

All decorator options accept **direct class references**, NOT arrow functions:

```typescript
// ✅ CORRECT
@Journey({
  primaryStakeholder: CustomerStakeholder,  // Direct reference
  actions: [SubmitAction, ValidateAction]
})

// ❌ WRONG
@Journey({
  primaryStakeholder: () => CustomerStakeholder,  // NO arrow functions!
})
```

### 2. Event-Driven DAG (Directed Acyclic Graph)

Actions form a **DAG via forward-looking triggers**, not linear flows:

- **Journey ≠ Flow**: Journeys are containers; flow emerges from action triggers
- Each action declares its next steps via `triggers: [NextAction1, NextAction2]`
- No central orchestrator—decentralized, event-driven architecture

### 3. Action Scopes and Event Emission

| Scope | Should Emit Events? | Usage |
|-------|---------------------|-------|
| **Atomic** | Rarely | Plentiful, granular operations |
| **Composite** | Sometimes | Moderate, orchestrates multiple actions |
| **Journey** | **Should** | Rare, meaningful business milestones |
| **System** | **Must** | Very rare, cross-journey coordination |

### 4. Contract Chain Pattern

```
Action
  ↓ has
Expectation (WHAT: <800ms p95 latency, 99.9% availability)
  ↓ primary technical contract
Interaction (HOW: POST /api/validate-email)
  ↓ implemented by
Behavior (RFC 5322 regex + DNS MX + SMTP check)
  ↓ proven by
Witness (BDD tests: given/when/then)
  ↓ measured by
Metric (P95 latency KPI)
```

### 5. Only @Witness is a Method Decorator

- **@Witness**: Only method decorator (decorates methods inside @Behavior classes)
- **All other 12 decorators**: Class decorators (applied to empty exported classes)
- **@Attribute**: Class decorator for reusable data properties (rare edge case)

## Compilation = Validation

When the TypeScript compiler completes without errors, you know:

✅ All hierarchies are valid (parents reference properly branded children)
✅ All required fields are provided
✅ All relationships are consistent
✅ One-way reference rule is maintained

**No runtime checks needed. No runtime overhead. Pure compile-time safety.**
