# Aabha API - Critical Corrections

## ❌ WRONG Patterns (DO NOT USE)

```typescript
// ❌ NO MODEL BASE CLASS
class MyStrategy extends Model {}

// ❌ NO PROPERTY DECORATORS (Only @Witness is a method decorator, all others are class decorators)
class MyJourney extends Model {
  @Action({ ... })  // WRONG! @Action is a class decorator, not a property decorator
  submitAction = action();  // action() helper doesn't exist
}

// ❌ NO ARROW FUNCTIONS FOR REFERENCES
@Journey({
  primaryStakeholder: () => CustomerStakeholder,  // WRONG!
  actions: [() => SubmitAction, () => ValidateAction]  // WRONG!
})

// ❌ NO THIS REFERENCES
class MyJourney {
  @Action({
    triggers: [() => this.nextAction]  // WRONG! No this
  })
  currentAction = action();
}
```

## ✅ CORRECT Patterns (USE THESE)

```typescript
// ✅ CLASS DECORATORS ON EMPTY CLASSES
@Strategy({
  name: 'Digital Transformation',
  winningAspiration: 'Be the #1 digital bank',
  metrics: [NetPromoterScoreMetric, ActiveUsersMetric]  // Direct class references
})
export class DigitalTransformationStrategy {}

// ✅ EACH COMPONENT IS ITS OWN CLASS
@Metric({
  name: 'Net Promoter Score',
  category: MetricCategory.CustomerExperience,
  target: 65
})
export class NetPromoterScoreMetric {}

@Metric({
  name: 'Active Users',
  category: MetricCategory.Business,
  target: 2000000
})
export class ActiveUsersMetric {}

// ✅ DIRECT CLASS REFERENCES (NO ARROW FUNCTIONS)
@Journey({
  name: 'Account Opening',
  primaryStakeholder: CustomerStakeholder,  // Direct reference
  actions: [SubmitFormAction, ValidateDataAction, CreateAccountAction]  // Array of class refs
})
export class AccountOpeningJourney {}

// ✅ EACH ACTION IS A SEPARATE CLASS
@Action({
  name: 'Submit application form',
  actor: CustomerStakeholder,
  scope: ActionScope.Atomic,
  triggers: [{ action: ValidateDataAction }]  // Reference other class
})
export class SubmitFormAction {}

@Action({
  name: 'Validate submitted data',
  actor: SystemStakeholder,
  scope: ActionScope.Atomic,
  triggers: [{ action: CreateAccountAction }]
})
export class ValidateDataAction {}

@Action({
  name: 'Create customer account',
  actor: SystemStakeholder,
  scope: ActionScope.Journey,
  emitsEvent: 'account.created'
})
export class CreateAccountAction {}

// ✅ STAKEHOLDER = PERSONA + CONTEXT
@Persona({
  type: PersonaType.Human,
  name: 'Marcus Lee - Young Professional',
  age: '26',
  occupation: 'Software Developer'
})
export class MarcusLeePersona {}

@Context({
  name: 'Digital Banking',
  capabilities: {
    core: ['Mobile app', 'Online banking', 'Instant transfers']
  }
})
export class DigitalBankingContext {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Digital Customer',
  persona: MarcusLeePersona,  // Direct class reference
  context: DigitalBankingContext  // Direct class reference
})
export class MarcusAsDigitalCustomer {}
```

## Key Differences Summary

| Aspect | ❌ Wrong | ✅ Correct |
|--------|----------|------------|
| Base class | `extends Model` | No base class, plain class |
| Decorator type | Property decorator | Class decorator (except @Witness = method decorator) |
| Helper functions | `action()`, `metric()` | None - just export class |
| References | `() => Foo` arrow functions | `Foo` direct class reference |
| This references | `() => this.foo` | Not applicable - separate classes |
| Class content | Properties with decorators | Empty class `{}` |

## Complete Example (Correct)

```typescript
import {
  Strategy, Metric, MetricCategory,
  Journey, Action, ActionScope,
  Persona, PersonaType, Stakeholder, StakeholderType,
  Context
} from 'aabha';

// 1. Define Metrics
@Metric({
  name: 'Customer Satisfaction',
  category: MetricCategory.CustomerExperience,
  target: 90,
  unit: 'percentage'
})
export class CustomerSatisfactionMetric {}

// 2. Define Strategy
@Strategy({
  name: 'Digital First Strategy 2025',
  winningAspiration: 'Be the most loved digital bank',
  metrics: [CustomerSatisfactionMetric]  // Direct reference
})
export class DigitalFirstStrategy {}

// 3. Define Persona
@Persona({
  type: PersonaType.Human,
  name: 'Sarah - Tech Professional',
  age: '28',
  technicalProficiency: 'high'
})
export class SarahPersona {}

// 4. Define Context
@Context({
  name: 'Mobile Banking',
  capabilities: {
    core: ['Account management', 'Payments', 'Transfers']
  }
})
export class MobileBankingContext {}

// 5. Define Stakeholder
@Stakeholder({
  type: StakeholderType.Human,
  role: 'Mobile App User',
  persona: SarahPersona,  // Direct reference
  context: MobileBankingContext  // Direct reference
})
export class SarahAsMobileUser {}

// 6. Define Actions
@Action({
  name: 'Open mobile app',
  actor: SarahAsMobileUser,
  scope: ActionScope.Atomic,
  triggers: [{ action: CheckBalanceAction }]
})
export class OpenAppAction {}

@Action({
  name: 'Check account balance',
  actor: SarahAsMobileUser,
  scope: ActionScope.Atomic,
  emitsEvent: 'balance.viewed'
})
export class CheckBalanceAction {}

// 7. Define Journey
@Journey({
  name: 'Daily Banking Check',
  primaryStakeholder: SarahAsMobileUser,
  actions: [OpenAppAction, CheckBalanceAction],
  entryActions: [OpenAppAction],
  outcomes: ['User views current balance']
})
export class DailyBankingJourney {}
```

This is the CORRECT pattern. Always use direct class references, not arrow functions!
