# Core Concepts

**Essential patterns you must understand before using aabha**

These concepts are fundamental to the framework. Understanding them is critical for correct usage.

## 1. Class Decorators (Zero Runtime Overhead)

### The Pattern

Aabha **primarily** uses **class decorators** applied to **empty exported classes**:

**Note**: Most decorators (@Strategy, @Journey, @Action, @Stakeholder, etc.) are class decorators. The exception is:
- **@Witness** - method decorator (must be within @Behavior class)
- **@Attribute** - also a class decorator (rarely used for reusable data properties)

```typescript
// Decorator is applied to the class itself
@Strategy({
  name: 'Digital Transformation',
  winningAspiration: 'Be the #1 digital bank'
})
export class DigitalTransformationStrategy {}  // Empty class

// The decorator brands the class type for compile-time validation
// Type becomes: WithStrategy<typeof DigitalTransformationStrategy>
```

**NOT property decorators:**
```typescript
// ❌ WRONG - This is not how aabha works
class MyModel {
  @Strategy({ name: 'My Strategy' })  // ❌ No property decorators!
  strategy = something();  // ❌ No helper functions!
}
```

### Why This Works

At **compile time**:
- Decorator applies type brand to the class
- TypeScript enforces valid relationships
- Invalid references = compile errors

At **runtime**:
- Decorator stores metadata on class prototype
- Classes remain empty (zero overhead)
- Metadata used for serialization only

### Type Safety Example

```typescript
@Strategy({ name: 'My Strategy' })
export class MyStrategy {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Customer',
  persona: SomePersona,
  context: SomeContext
})
export class MyStakeholder {}

// ✅ Correct - Strategy references Metrics
@Strategy({
  name: 'Another Strategy',
  metrics: [SomeMetric]  // Valid
})
export class AnotherStrategy {}

// ❌ Compile Error - Journey expects Stakeholder, not Strategy
@Journey({
  name: 'My Journey',
  primaryStakeholder: MyStrategy  // ❌ Type error!
  // Expected: WithStakeholder<Constructor>
  // Got: WithStrategy<Constructor>
})
export class MyJourney {}

// ✅ Correct - Journey references Stakeholder
@Journey({
  name: 'My Journey',
  primaryStakeholder: MyStakeholder  // ✅ Correct type
})
export class CorrectJourney {}
```

## 2. Direct Class References (Not Arrow Functions)

### The Pattern

All references use **direct class constructors**, not arrow functions:

```typescript
// ✅ CORRECT
@Journey({
  name: 'Account Opening',
  primaryStakeholder: CustomerStakeholder,  // Direct class reference
  actions: [EnterDataAction, ValidateAction, CompleteAction],  // Array of classes
  metrics: [ConversionRateMetric, TimeToCompleteMetric]
})
export class AccountOpeningJourney {}

@Action({
  name: 'Submit application',
  actor: CustomerStakeholder,  // Direct class reference
  triggers: [{ action: ValidateAction }]  // Object with direct reference
})
export class SubmitApplicationAction {}
```

### Common Mistakes

```typescript
// ❌ WRONG - No arrow functions!
@Journey({
  primaryStakeholder: () => CustomerStakeholder,  // ❌ Don't do this
  actions: [() => EnterDataAction]  // ❌ Don't do this
})
export class WrongJourney {}

// ❌ WRONG - No this references!
@Journey({
  name: 'My Journey',
  actions: [SubmitAction, ValidateAction]
})
export class MyJourney {
  // ❌ Can't reference siblings with this - each action is separate class!
  @Action({
    triggers: [() => this.validateAction]  // ❌ No this!
  })
  submitAction = action();  // ❌ No helper functions!
}
```

### Why Direct References?

1. **TypeScript type inference works correctly**
2. **Simpler mental model** - just reference the class
3. **Compile-time validation** - invalid references caught immediately
4. **No circular reference issues** - classes are defined before use

## 3. Context = Perspective

### The Formula

```
Stakeholder = WHO (persona) + WHAT (role) + WHERE (context)
```

This is the **most important concept** for modeling people correctly.

### The Three Components

#### WHO: Persona (universal archetype)

```typescript
@Persona({
  type: PersonaType.Human,
  name: 'Marcus Lee - Young Professional',
  age: '26',
  occupation: 'Junior Software Developer',
  technicalProficiency: 'high'
})
export class MarcusLeePersona {}
```

**Persona is context-free**: Marcus is Marcus regardless of where he operates.

#### WHERE: Context (organizational boundary)

```typescript
@Context({
  name: 'Digital Banking',
  capabilities: {
    core: ['Mobile app', 'Online banking', 'Instant transfers']
  }
})
export class DigitalBankingContext {}

@Context({
  name: 'Wealth Management',
  capabilities: {
    core: ['Investment advisory', 'Portfolio management']
  }
})
export class WealthManagementContext {}
```

**Context is DDD bounded context**: Clear boundaries, specific domain.

#### WHAT: Stakeholder (role in context)

```typescript
// Marcus as Digital Banking Customer
@Stakeholder({
  type: StakeholderType.Human,
  role: 'Digital Customer',
  persona: MarcusLeePersona,  // WHO
  context: DigitalBankingContext,  // WHERE
  goals: ['Fast mobile banking', 'Instant transfers'],
  permissions: ['view_balance', 'make_transfers']
})
export class MarcusAsDigitalCustomer {}

// Same Marcus, different context = different stakeholder
@Stakeholder({
  type: StakeholderType.Human,
  role: 'Investment Client',
  persona: MarcusLeePersona,  // Same WHO
  context: WealthManagementContext,  // Different WHERE
  goals: ['Build investment portfolio', 'Financial planning'],
  permissions: ['view_portfolio', 'make_trades']
})
export class MarcusAsInvestor {}
```

### Why This Matters

**Traditional (wrong) approach:**
```typescript
// ❌ Mixing persona and role
@Persona({
  name: 'Marcus Lee - Digital Banking Customer in Mobile App Context'
})
export class MarcusDigitalCustomer {}

// What if Marcus uses wealth management too?
// What if he switches contexts?
// Can't reuse persona!
```

**Aabha (correct) approach:**
```typescript
// ✅ Separation of concerns
@Persona({ name: 'Marcus Lee' })  // WHO - reusable
export class MarcusLee {}

@Context({ name: 'Digital Banking' })  // WHERE - reusable
export class DigitalBanking {}

@Context({ name: 'Wealth Management' })  // WHERE - reusable
export class WealthManagement {}

@Stakeholder({  // WHAT in WHERE
  persona: MarcusLee,
  context: DigitalBanking
})
export class MarcusInDigitalBanking {}

@Stakeholder({  // Same WHO, different WHERE
  persona: MarcusLee,
  context: WealthManagement
})
export class MarcusInWealth {}
```

## 4. Event-Driven Action Model

### Actions as Separate Classes

Each action is its own class:

```typescript
@Action({
  name: 'User enters email and password',
  actor: CustomerStakeholder,
  scope: ActionScope.Atomic,
  emitsEvent: 'credentials.entered',
  triggers: [{ action: ClickSubmitAction }]
})
export class EnterCredentialsAction {}

@Action({
  name: 'User clicks submit button',
  actor: CustomerStakeholder,
  scope: ActionScope.Atomic,
  emitsEvent: 'submit.clicked',
  triggers: [{ action: ValidateCredentialsAction }]
})
export class ClickSubmitAction {}

@Action({
  name: 'System validates credentials',
  actor: SystemStakeholder,
  scope: ActionScope.Atomic,
  emitsEvent: 'credentials.validated',
  triggers: [
    { action: CreateAccountAction, condition: 'valid === true' },
    { action: ShowErrorAction, condition: 'valid === false' }
  ]
})
export class ValidateCredentialsAction {}

@Action({
  name: 'Account created',
  actor: SystemStakeholder,
  scope: ActionScope.Journey,
  emitsEvent: 'account.created'
})
export class CreateAccountAction {}

@Action({
  name: 'Show validation error',
  actor: SystemStakeholder,
  scope: ActionScope.Atomic,
  emitsEvent: 'error.shown'
})
export class ShowErrorAction {}
```

### Event Emission

Every action can emit a business event:

```typescript
@Action({
  name: 'Process payment',
  actor: PaymentSystemStakeholder,
  scope: ActionScope.Atomic,
  emitsEvent: 'payment.processed'  // Published to event bus
})
export class ProcessPaymentAction {}
```

### Forward-Looking DAG (via triggers)

Actions form a **Directed Acyclic Graph**:

```typescript
@Action({
  name: 'Submit loan application',
  actor: CustomerStakeholder,
  scope: ActionScope.Atomic,
  emitsEvent: 'loan.application.submitted',
  triggers: [{ action: ValidateCreditAction }]  // Next action
})
export class SubmitLoanAction {}

@Action({
  name: 'Validate credit score',
  actor: RiskSystemStakeholder,
  scope: ActionScope.Atomic,
  emitsEvent: 'credit.validated',
  triggers: [{ action: DecideApprovalAction }]
})
export class ValidateCreditAction {}

@Action({
  name: 'Decide on approval',
  actor: RiskSystemStakeholder,
  scope: ActionScope.Composite,
  emitsEvent: 'decision.made',
  // Conditional branching
  triggers: [
    { action: ApproveAction, condition: 'creditScore >= 700' },
    { action: RejectAction, condition: 'creditScore < 700' }
  ]
})
export class DecideApprovalAction {}

@Action({
  name: 'Approve loan',
  actor: RiskSystemStakeholder,
  scope: ActionScope.Journey,
  emitsEvent: 'loan.approved'
})
export class ApproveAction {}

@Action({
  name: 'Reject loan',
  actor: RiskSystemStakeholder,
  scope: ActionScope.Journey,
  emitsEvent: 'loan.rejected'
})
export class RejectAction {}
```

### Journey Defines Entry Points

```typescript
@Journey({
  name: 'Loan Application',
  primaryStakeholder: CustomerStakeholder,
  actions: [
    SubmitLoanAction,
    ValidateCreditAction,
    DecideApprovalAction,
    ApproveAction,
    RejectAction
  ],
  entryActions: [SubmitLoanAction],  // Start here
  outcomes: ['Loan approved or rejected with reason']
})
export class LoanApplicationJourney {}
```

**Flow emerges from:**
1. `entryActions` → where to start
2. Action `triggers` → where to go next
3. Conditions in triggers → branching logic

## 5. Provider/Consumer Contracts (Expectations)

### The Pattern

```typescript
// 1. Define stakeholders
@Stakeholder({
  type: StakeholderType.System,
  role: 'Backend API',
  persona: BackendSystemPersona,
  context: DigitalBankingContext
})
export class BackendAPIStakeholder {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Mobile User',
  persona: CustomerPersona,
  context: DigitalBankingContext
})
export class MobileUserStakeholder {}

// 2. Define interaction (technical contract)
@Interaction({
  name: 'Get Account Balance API',
  pattern: InteractionPattern.RequestResponse,
  layer: InteractionLayer.Backend,
  inputs: [{
    name: 'accountId',
    type: 'string',
    required: true
  }],
  outputs: [{
    name: 'balance',
    type: 'number',
    required: true
  }],
  quality: {
    slo: [{
      metric: 'Response time',
      target: '< 100ms',
      percentile: 0.95
    }]
  }
})
export class GetBalanceInteraction {}

// 3. Define expectation (provider/consumer contract)
@Expectation({
  name: 'Real-time account balance',
  provider: BackendAPIStakeholder,  // WHO provides
  consumer: MobileUserStakeholder,  // WHO consumes
  interaction: GetBalanceInteraction,  // HOW they exchange
  description: 'User expects accurate balance within 100ms'
})
export class BalanceExpectation {}

// 4. Link action to expectation
@Action({
  name: 'Check balance',
  actor: MobileUserStakeholder,
  scope: ActionScope.Atomic,
  expectations: [BalanceExpectation],  // References expectation
  emitsEvent: 'balance.checked'
})
export class CheckBalanceAction {}
```

### The Chain

```
Action → Expectation → Interaction → Behavior → Witness
```

Each layer adds more detail:
- **Action**: What happens in the journey (class decorator)
- **Expectation**: Contract between stakeholders (class decorator)
- **Interaction**: Technical exchange details (class decorator)
- **Behavior**: Implementation (class decorator)
- **Witness**: Verification methods (method decorator, must be within @Behavior class)

## 6. Metrics at Every Level

Metrics can attach to any decorator:

```typescript
// Strategy-level metric
@Metric({
  name: 'Net Promoter Score',
  category: MetricCategory.CustomerExperience,
  target: 65,
  unit: 'score'
})
export class NPSMetric {}

@Strategy({
  name: 'Digital Transformation',
  metrics: [NPSMetric]
})
export class DigitalStrategy {}

// Journey-level metric
@Metric({
  name: 'Account Opening Time',
  category: MetricCategory.Operational,
  target: 300,  // 5 minutes
  unit: 'seconds'
})
export class AccountOpeningTimeMetric {}

@Journey({
  name: 'Account Opening',
  primaryStakeholder: CustomerStakeholder,
  metrics: [AccountOpeningTimeMetric]
})
export class AccountOpeningJourney {}

// Context-level metrics
@Metric({
  name: 'Digital Adoption Rate',
  category: MetricCategory.Business,
  target: 0.625,  // 62.5%
  unit: 'percentage'
})
export class DigitalAdoptionMetric {}

@Context({
  name: 'Digital Banking',
  metrics: [DigitalAdoptionMetric]
})
export class DigitalBankingContext {}
```

## 7. Collaboration (Multi-Stakeholder)

For human coordination:

```typescript
@Collaboration({
  name: 'Sprint Planning Meeting',
  purpose: 'Plan sprint backlog',
  participants: [
    ProductManagerStakeholder,
    EngineeringTeamStakeholder,
    DesignerStakeholder
  ],
  outcomes: ['Sprint backlog finalized', 'Tasks estimated'],
  frequency: 'Every 2 weeks',
  duration: '2 hours'
})
export class SprintPlanningCollaboration {}

@Action({
  name: 'Plan sprint',
  actor: ProductManagerStakeholder,
  scope: ActionScope.Composite,
  collaboration: SprintPlanningCollaboration  // Reference collaboration
})
export class PlanSprintAction {}
```

## 8. Complete Example (All Concepts)

```typescript
import {
  Strategy, Metric, MetricCategory,
  Context,
  Persona, PersonaType,
  Stakeholder, StakeholderType,
  Journey,
  Action, ActionScope
} from 'aabha';

// Metrics
@Metric({
  name: 'Customer Satisfaction',
  category: MetricCategory.CustomerExperience,
  target: 90,
  unit: 'percentage'
})
export class CustomerSatisfactionMetric {}

@Metric({
  name: 'Active Users',
  category: MetricCategory.Business,
  target: 100000,
  unit: 'users'
})
export class ActiveUsersMetric {}

// Strategy
@Strategy({
  name: 'Mobile First Strategy',
  winningAspiration: 'Best mobile experience',
  metrics: [CustomerSatisfactionMetric, ActiveUsersMetric]
})
export class MobileFirstStrategy {}

// Persona
@Persona({
  type: PersonaType.Human,
  name: 'Sarah - Tech Professional',
  age: '28',
  technicalProficiency: 'high'
})
export class SarahPersona {}

// Context
@Context({
  name: 'Mobile Banking',
  capabilities: {
    core: ['Account management', 'Payments']
  },
  metrics: [ActiveUsersMetric]
})
export class MobileBankingContext {}

// Stakeholder
@Stakeholder({
  type: StakeholderType.Human,
  role: 'Mobile User',
  persona: SarahPersona,
  context: MobileBankingContext
})
export class SarahAsMobileUser {}

// Actions
@Action({
  name: 'Open app',
  actor: SarahAsMobileUser,
  scope: ActionScope.Atomic,
  triggers: [{ action: CheckBalanceAction }]
})
export class OpenAppAction {}

@Action({
  name: 'Check balance',
  actor: SarahAsMobileUser,
  scope: ActionScope.Atomic,
  emitsEvent: 'balance.viewed'
})
export class CheckBalanceAction {}

// Journey
@Journey({
  name: 'Daily Banking Check',
  primaryStakeholder: SarahAsMobileUser,
  actions: [OpenAppAction, CheckBalanceAction],
  entryActions: [OpenAppAction],
  metrics: [CustomerSatisfactionMetric],
  outcomes: ['User views balance successfully']
})
export class DailyBankingJourney {}
```

## Summary: Mental Model

### Class Decorators
- **All components = class decorators on empty exported classes**
- **Exception: @Witness (method decorator within @Behavior classes)**
- **No base classes**
- **Export each class individually**

### Type System
- **Every decorator = type brand**
- **Invalid references = compile errors**
- **Zero runtime overhead**

### References
- **Direct class constructors** (not arrow functions)
- **No this references** (each component is separate)
- **Simple arrays** for multiple references

### People Modeling
- **Persona = WHO** (universal, reusable)
- **Context = WHERE** (boundary, reusable)
- **Stakeholder = WHO + WHAT + WHERE** (role in context)

### Flow Modeling
- **Actions = separate classes**
- **Actions emit events**
- **Actions trigger next actions (DAG)**
- **Conditional branching via trigger conditions**

### Contract Modeling
- **Expectation = provider + consumer + interaction** (class decorator)
- **Interaction = technical exchange** (class decorator)
- **Behavior = implementation** (class decorator)
- **Witness = proof** (method decorator within @Behavior class)
- **Attribute = reusable data properties** (class decorator, rarely used)

### Metrics
- **Attach to any decorator**
- **Direct class references**
- **Type-safe relationships**

---

**Next Steps:**
- Review [API-CORRECTIONS.md](./API-CORRECTIONS.md) for common mistakes
- Start modeling with [02-strategic-decorators.md](./02-strategic-decorators.md)
- See [07-composition-patterns.md](./07-composition-patterns.md) for real-world patterns
