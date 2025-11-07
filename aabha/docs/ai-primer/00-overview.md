# Aabha Framework Overview

## What is Aabha?

**Aabha** (Sanskrit: आभा, "radiance" or "aura") is an **enterprise context management framework** designed for **context engineering at scale**. It transforms business strategy, digital and offline processes, stakeholder expectations, and organizational knowledge into executable, type-safe TypeScript—creating structured, AI-comprehensible context for enterprise systems.

### Core Value Proposition

Traditional enterprise context is:
- ❌ Scattered across tools (Jira, Confluence, Figma, Miro, wikis, emails)
- ❌ Becomes stale and inconsistent
- ❌ Difficult for AI systems to comprehend at scale
- ❌ Not validated or type-checked
- ❌ Cannot handle digital + offline + organizational complexity

Aabha's context engineering approach enables:
- ✅ **Single source of truth** - Entire enterprise context in code
- ✅ **Compile-time validation** - Invalid relationships = compile errors
- ✅ **AI-native** - 10x token efficiency for AI comprehension
- ✅ **Zero runtime overhead** - Pure type-level decorators
- ✅ **Enterprise scale** - Models digital, offline, and organizational processes
- ✅ **Executable** - Generate diagrams, docs, tests from context model

## Philosophy

### Context Engineering at Enterprise Scale

Engineer your entire enterprise context—business strategy, digital processes, offline operations, and organizational workflows—in type-safe TypeScript:

```typescript
import { Strategy, Metric, MetricCategory } from 'aabha';

// Each component is its own class with a decorator
@Metric({
  name: 'Net Promoter Score',
  category: MetricCategory.CustomerExperience,
  target: 65,
  unit: 'score'
})
export class NetPromoterScoreMetric {}

@Metric({
  name: 'Active Digital Users',
  category: MetricCategory.Business,
  target: 2000000,
  unit: 'users'
})
export class ActiveDigitalUsersMetric {}

@Strategy({
  name: 'Digital Transformation Strategy',
  winningAspiration: "Be Genai's most loved bank by 2027",
  whereToPlay: ['Mass market retail', 'SME banking', 'Mass affluent wealth'],
  howToWin: 'Trusted heritage + Digital speed = Instant trust',
  metrics: [NetPromoterScoreMetric, ActiveDigitalUsersMetric]  // Direct class references
})
export class DigitalTransformationStrategy {}
```

```typescript
import { Journey, Action, ActionScope, Stakeholder } from 'aabha';

// Each action is a separate class
@Action({
  name: 'User enters email and password',
  actor: GenZCustomerStakeholder,  // Direct reference to stakeholder class
  scope: ActionScope.Atomic,
  triggers: [{ action: ClickSubmitAction }]  // Reference to next action
})
export class EnterCredentialsAction {}

@Action({
  name: 'User clicks submit button',
  actor: GenZCustomerStakeholder,
  scope: ActionScope.Atomic,
  triggers: [{ action: ValidateCredentialsAction }]
})
export class ClickSubmitAction {}

@Action({
  name: 'System validates credentials',
  actor: AuthSystemStakeholder,
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
  actor: AuthSystemStakeholder,
  scope: ActionScope.Journey,
  emitsEvent: 'account.created'
})
export class CreateAccountAction {}

// Journey references the actions
@Journey({
  name: 'Digital Account Opening',
  primaryStakeholder: GenZCustomerStakeholder,
  actions: [
    EnterCredentialsAction,
    ClickSubmitAction,
    ValidateCredentialsAction,
    CreateAccountAction
  ],
  entryActions: [EnterCredentialsAction],
  outcomes: ['Account activated in <3 minutes']
})
export class AccountOpeningJourney {}
```

### Key Benefits for AI Systems

1. **Engineered Context**: Systematically modeled relationships via direct class references
2. **Type-Safe at Scale**: Compiler catches invalid references across entire enterprise context
3. **Dense Representation**: 10x more efficient than prose documentation for AI comprehension
4. **Compositional**: Reusable context components with clear boundaries
5. **Verifiable**: Successful compilation = internally consistent enterprise model
6. **Enterprise Complexity**: Handles digital + offline + organizational processes in unified framework

## Core Concepts (Quick Version)

See [01-core-concepts.md](./01-core-concepts.md) for full details.

### 1. Class Decorators (Zero Runtime)

Each decorator is a **class decorator** applied to an empty exported class:

```typescript
@Strategy({
  name: 'My Strategy',
  winningAspiration: 'Win the market'
})
export class MyStrategy {}  // Empty class, decorator does everything

// Type becomes: WithStrategy<typeof MyStrategy>
```

Invalid references fail at compile-time:
```typescript
@Journey({
  primaryStakeholder: MyStrategy  // ❌ Compile error!
  // Expected: WithStakeholder<Constructor>
  // Got: WithStrategy<Constructor>
})
export class MyJourney {}
```

### 2. Direct Class References (Not Arrow Functions)

All references use **direct class constructors**:

```typescript
// ✅ CORRECT
@Journey({
  primaryStakeholder: CustomerStakeholder,  // Direct class reference
  actions: [SubmitAction, ValidateAction, CompleteAction],  // Array of classes
  metrics: [SuccessRateMetric]
})
export class MyJourney {}

// ❌ WRONG - No arrow functions!
@Journey({
  primaryStakeholder: () => CustomerStakeholder,  // ❌ Don't do this
  actions: [() => SubmitAction]  // ❌ Don't do this
})
export class MyJourney {}
```

### 3. Context = Perspective

**Critical formula:**
```
Stakeholder = WHO (persona) + WHAT (role) + WHERE (context)
```

Example:
```typescript
@Persona({
  type: PersonaType.Human,
  name: 'Sarah - Product Manager',
  age: '32',
  occupation: 'Product Manager'
})
export class SarahPersona {}

@Context({
  name: 'Product Engineering',
  capabilities: {
    core: ['Feature development', 'Technical planning']
  }
})
export class ProductEngineeringContext {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Product Manager',
  persona: SarahPersona,  // WHO
  context: ProductEngineeringContext  // WHERE
})
export class SarahAsPM {}  // WHAT (role in context)
```

Same persona can be different stakeholders in different contexts.

### 4. Event-Driven Actions

Actions form a DAG via `triggers`:

```typescript
@Action({
  name: 'Submit application',
  actor: CustomerStakeholder,
  scope: ActionScope.Atomic,
  emitsEvent: 'application.submitted',
  triggers: [{ action: ValidateApplicationAction }]  // Next action
})
export class SubmitApplicationAction {}

@Action({
  name: 'Validate application',
  actor: SystemStakeholder,
  scope: ActionScope.Atomic,
  emitsEvent: 'application.validated',
  triggers: [
    { action: ApproveAction, condition: 'score >= 700' },
    { action: RejectAction, condition: 'score < 700' }
  ]
})
export class ValidateApplicationAction {}

@Action({
  name: 'Approve application',
  actor: SystemStakeholder,
  scope: ActionScope.Journey,
  emitsEvent: 'application.approved'
})
export class ApproveAction {}
```

### Offline Journey Example (Branch Operations)

Aabha also models **offline business processes** - manual reviews, physical documents, human collaboration:

```typescript
import {
  Journey, Action, ActionScope,
  Collaboration,
  Interaction, InteractionPattern, InteractionLayer
} from 'aabha';

// Offline manual review collaboration
@Collaboration({
  name: 'Manual Compliance Review',
  purpose: 'Multi-stakeholder review of high-risk account applications',
  collaborationType: 'review-approval',

  participants: [
    {
      stakeholder: ComplianceOfficerStakeholder,
      role: 'reviewer',
      required: true,
      responsibilities: ['Verify documents', 'Check sanctions', 'Assess risk']
    },
    {
      stakeholder: SeniorComplianceOfficerStakeholder,
      role: 'approver',
      required: true,
      responsibilities: ['Final approval decision']
    }
  ],

  duration: 'PT4H',  // 4 hours typical
  frequency: 'ad-hoc',
  communicationChannel: 'document-review',
  synchronicity: 'asynchronous',

  expectedOutcomes: [
    {
      outcome: 'Application approved or rejected with rationale',
      type: 'decision'
    }
  ]
})
export class AccountOpeningComplianceReviewCollaboration {}

// Manual interaction (physical document review)
@Interaction({
  name: 'Physical Document Review',
  pattern: InteractionPattern.ManualReview,
  layer: InteractionLayer.Manual,

  inputs: [
    { name: 'applicationForm', type: 'PhysicalDocument', required: true },
    { name: 'identityDocuments', type: 'PhysicalDocument[]', required: true }
  ],

  outputs: [
    { name: 'reviewDecision', type: 'string', required: true },
    { name: 'reviewerSignature', type: 'PhysicalSignature', required: true }
  ],

  manualConfig: {
    processType: 'manual-review',
    physicalLocation: 'Compliance Department, Floor 3',
    reviewers: [ComplianceOfficerStakeholder],
    estimatedDuration: 'PT2H',
    documentsRequired: ['Application form', 'Government ID', 'Risk assessment'],
    offlineStorage: {
      location: 'Secure document archive',
      retentionPeriod: '7 years'
    }
  }
})
export class PhysicalDocumentReviewInteraction {}

// Action linking to collaboration
@Action({
  name: 'Manual Compliance Review',
  actor: ComplianceOfficerStakeholder,
  scope: ActionScope.Composite,

  automationLevel: StepAutomationLevel.Manual,
  estimatedDuration: StepDuration.Long,  // Hours, not seconds

  collaboration: AccountOpeningComplianceReviewCollaboration,  // Links to collaboration

  triggers: [
    { action: ApplicationApprovedAction, condition: 'decision == "Approved"' },
    { action: ApplicationRejectedAction, condition: 'decision == "Rejected"' }
  ]
})
export class ManualComplianceReviewAction {}

// Offline journey
@Journey({
  name: 'Branch Account Opening',
  primaryStakeholder: TraditionalBranchCustomer,

  actions: [
    BranchConsultationAction,           // In-person meeting
    CompletePhysicalFormAction,         // Paper form
    PhysicalSignatureAction,            // Wet signature
    ManualComplianceReviewAction,       // Manual review (hours)
    EnterDataIntoSystemAction,          // Digital handoff
    AccountCreatedAction
  ],

  outcomes: [
    'Customer completed account opening at branch',
    'All physical documents collected and verified',
    'Compliance review approved'
  ]
})
export class BranchAccountOpeningJourney {}
```

## The 14 Decorators

### Strategic Level
- **@Strategy** - Business strategy (Playing to Win framework)
- **@BusinessInitiative** - Execute strategy through initiatives
- **@Metric** - Measurable outcomes at any level
- **@Context** - Organizational boundaries (DDD bounded contexts)

### Journey Level
- **@Journey** - User/stakeholder experience container
- **@Action** - Unified event-driven action

### People Level
- **@Persona** - WHO people are (archetypes)
- **@Stakeholder** - WHAT people do in WHERE (role in context)

### Contract Level
- **@Expectation** - Provider/consumer contracts
- **@Interaction** - Technical exchange contracts (digital APIs, manual processes, organizational interactions)
- **@Collaboration** - Multi-stakeholder coordination (meetings, reviews, approvals, organizational governance)

### Implementation Level
- **@Behavior** - Executable implementation (class decorator)
- **@Witness** - Method decorator for BDD-style verification (must be within @Behavior class)
- **@Attribute** - Class decorator for reusable data properties (rarely used, only when data doesn't fit elsewhere)

## Quick Start Example

```typescript
import {
  Persona, PersonaType,
  Context,
  Stakeholder, StakeholderType,
  Journey,
  Action, ActionScope,
  Metric, MetricCategory
} from 'aabha';

// 1. WHO: Define persona
@Persona({
  type: PersonaType.Human,
  name: 'Alex - Software Engineer',
  age: '25',
  occupation: 'Software Engineer',
  technicalProficiency: 'high'
})
export class AlexPersona {}

// 2. WHERE: Define context
@Context({
  name: 'E-Commerce Platform',
  capabilities: {
    core: ['Product catalog', 'Shopping cart', 'Checkout']
  }
})
export class ECommerceContext {}

// 3. WHAT: Define stakeholder (WHO + WHERE)
@Stakeholder({
  type: StakeholderType.Human,
  role: 'Customer',
  persona: AlexPersona,
  context: ECommerceContext,
  goals: ['Quick checkout', 'Find products easily']
})
export class AlexAsCustomer {}

// 4. Define actions
@Action({
  name: 'Browse products',
  actor: AlexAsCustomer,
  scope: ActionScope.Atomic,
  emitsEvent: 'product.viewed',
  triggers: [{ action: AddToCartAction }]
})
export class BrowseProductsAction {}

@Action({
  name: 'Add product to cart',
  actor: AlexAsCustomer,
  scope: ActionScope.Atomic,
  emitsEvent: 'product.added_to_cart',
  triggers: [{ action: CheckoutAction }]
})
export class AddToCartAction {}

@Action({
  name: 'Complete checkout',
  actor: AlexAsCustomer,
  scope: ActionScope.Composite,
  emitsEvent: 'order.placed'
})
export class CheckoutAction {}

// 5. Define metric
@Metric({
  name: 'Checkout conversion rate',
  category: MetricCategory.Business,
  target: 0.75,
  unit: 'percentage'
})
export class CheckoutConversionMetric {}

// 6. Define journey
@Journey({
  name: 'Purchase Product',
  primaryStakeholder: AlexAsCustomer,
  actions: [BrowseProductsAction, AddToCartAction, CheckoutAction],
  entryActions: [BrowseProductsAction],
  metrics: [CheckoutConversionMetric],
  outcomes: ['Product purchased successfully']
})
export class PurchaseJourney {}
```

## How Aabha Works

### Compile Time
1. Decorators apply **type brands** to classes
2. TypeScript validates all class references
3. Invalid relationships = **compile errors**
4. Result: Internally consistent model

### Runtime
- Decorators store metadata for serialization
- Classes remain empty (zero overhead)
- Model can be serialized to JSON (via aabha-schema)
- JSON used for: AI context, diagrams, docs, test generation

### Development Flow
```
Write model → Compile → Fix type errors → Model validated
```

## Why This Matters for AI

### Traditional Docs (Inefficient)
```
The user journey for account opening involves several steps.
First, the user enters their email and password. This is
typically done by GenZ customers who are tech-savvy...
[500+ tokens for ambiguous, unstructured prose]
```

### Aabha Model (Efficient)
```typescript
@Journey({
  name: 'Account Opening',
  primaryStakeholder: GenZCustomerStakeholder,
  actions: [EnterCredentialsAction, ValidateAction, CreateAccountAction]
})
export class AccountOpeningJourney {}

@Action({
  name: 'Enter credentials',
  actor: GenZCustomerStakeholder,
  triggers: [{ action: ValidateAction }]
})
export class EnterCredentialsAction {}
```
**[50 tokens, explicit relationships, type-safe]**

**Result: 10x token efficiency + perfect clarity**

## What's Next?

### Essential Reading
1. **[01-core-concepts.md](./01-core-concepts.md)** - Deep dive on patterns
2. **[API-CORRECTIONS.md](./API-CORRECTIONS.md)** - Common mistakes to avoid
3. Choose decorator docs based on what you're modeling

### Modeling Strategy?
→ [02-strategic-decorators.md](./02-strategic-decorators.md)

### Modeling Digital Journeys (Mobile, Web, APIs)?
→ [03-digital-journey-decorators.md](./03-digital-journey-decorators.md) - Fast, automated, event-driven journeys

### Modeling Offline Journeys (Branch Operations, Manual Processes)?
→ [04-offline-journey-decorators.md](./04-offline-journey-decorators.md) - Human-driven, compliance-heavy workflows

### Modeling Stakeholders & Personas?
→ [05-stakeholder-persona-decorators.md](./05-stakeholder-persona-decorators.md)

### Modeling Expectations?
→ Coming soon

### Implementing Behaviors?
→ Coming soon

---

**Remember**: Aabha uses **class decorators** on **empty exported classes** with **direct class references** (except @Witness which decorates methods). No base classes, no arrow functions. Every decorator adds compile-time validation. Invalid models don't compile.
