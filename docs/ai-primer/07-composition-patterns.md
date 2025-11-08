# Aabha AI Primer: Composition Patterns

**File 7 of 7** | Integration: How Everything Works Together

This final guide shows how all Aabha decorators compose into a cohesive system for modeling business processes. We'll visualize the complete hierarchy, explore integration patterns, identify anti-patterns to avoid, and provide migration guidance.

---

## Table of Contents

1. [Decorator Hierarchy Visualization](#decorator-hierarchy-visualization)
2. [Complete Integration Scenarios](#complete-integration-scenarios)
3. [Anti-Patterns: What to Avoid](#anti-patterns-what-to-avoid)
4. [Migration Guide: Step/Milestone → Action](#migration-guide-stepmilestone--action)
5. [Final Mental Model](#final-mental-model)

---

## Decorator Hierarchy Visualization

### The Complete Aabha Decorator Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                     BUSINESS CONTEXT LAYER                       │
│  @Context - WHERE business activities happen                     │
│  (InvestmentContext, AccountOpeningContext, ComplianceContext)  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ provides context for
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ORGANIZATIONAL ACTOR LAYER                    │
│  @Persona - WHO people ARE (archetypes, demographics, behavior) │
│  @Stakeholder - WHAT people DO (roles, responsibilities, power) │
│                                                                  │
│  Relationship: Persona + Context → Stakeholder                  │
│  (MarcusLeePersona + AccountOpeningContext → MobileOpener)     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ participates in
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BUSINESS PROCESS LAYER                      │
│  @Journey - Container for related actions (minimal metadata)    │
│  @Action - Event-driven DAG nodes (scope: Atomic → System)      │
│                                                                  │
│  Key: Journeys don't define flow; Actions do via triggers       │
│  (OpenAccountJourney contains ValidateEmailAction →             │
│   VerifyIdentityAction → CreateAccountAction via triggers)      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ has expectations
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STAKEHOLDER CONTRACT LAYER                    │
│  @Expectation - WHAT stakeholders want (SLO/SLI, quality)       │
│  @Interaction - Technical contracts (layer-specific configs)    │
│  @Collaboration - Multi-stakeholder coordination (meetings)     │
│                                                                  │
│  Key: Expectations define stakeholder-facing promises           │
│  (FastEmailValidation: <3s, 99.9% accuracy, RFC 5322)          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ implemented by
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     IMPLEMENTATION LAYER                         │
│  @Behavior - HOW expectations are implemented (executable code) │
│    └─ @Witness - METHOD DECORATOR proving behaviors work        │
│                                                                  │
│  Key: Behaviors are engineering implementations of promises     │
│  (ValidateEmailBehavior: RFC 5322 regex + DNS MX + SMTP)       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ tracks performance with
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MEASUREMENT LAYER                           │
│  @Metric - Measurable KPIs (performance, quality, business)     │
│  @Attribute - Reusable property definitions (rare, edge case)   │
│                                                                  │
│  Key: Metrics link expectations to observable reality           │
│  (EmailValidationDuration, EmailValidationAccuracyMetric)       │
└─────────────────────────────────────────────────────────────────┘
```

`★ Insight ─────────────────────────────────────`
**The hierarchy flows from abstract to concrete:**
1. **Context** (WHERE) → defines business domain
2. **Persona/Stakeholder** (WHO) → defines participants
3. **Journey/Action** (WHAT) → defines process flow
4. **Expectation/Interaction/Collaboration** (PROMISE) → defines stakeholder contracts
5. **Behavior** (HOW) → implements promises with code
6. **Witness** (PROOF) → proves implementations work
7. **Metric** (MEASURE) → tracks performance against promises

Each layer references the layer above it, creating compile-time type safety throughout the stack.
`─────────────────────────────────────────────────`

---

## Complete Integration Scenarios

### Scenario 1: Mobile Account Opening (Digital Journey)

Let's trace a complete flow through all decorator layers:

```typescript
// ============================================================
// LAYER 1: CONTEXT - WHERE
// ============================================================
@Context({
  name: 'Mobile Account Opening',
  domain: ContextDomain.CustomerEngagement,
  description: 'Digital account opening via mobile app',
  businessGoals: ['Acquire new customers', 'Reduce account opening time to <5 min'],
})
export class MobileAccountOpeningContext {}

// ============================================================
// LAYER 2: PERSONAS & STAKEHOLDERS - WHO
// ============================================================

// WHO Marcus IS (intrinsic characteristics)
@Persona({
  type: PersonaType.Human,
  name: 'Marcus Lee - Young Professional',
  age: '26',
  technicalProficiency: 'high',
  preferredChannels: ['mobile app'],
  needs: {
    functional: ['Open account in <5 min', 'No branch visit'],
    emotional: ['Feel in control', 'Feel secure'],
  },
})
export class MarcusLeePersona {}

// WHAT Marcus DOES in this context (role-specific)
@Stakeholder({
  type: StakeholderType.Human,
  role: 'Mobile Account Opener',
  persona: MarcusLeePersona,           // Links to WHO
  context: MobileAccountOpeningContext, // Links to WHERE
  goals: ['Open account in <5 min', 'Zero errors during signup'],
  successCriteria: ['Account opened successfully', 'Instant debit card'],
})
export class MobileAccountOpenerStakeholder {}

// System stakeholder for email validation
@Stakeholder({
  type: StakeholderType.System,
  role: 'Email Validation Service',
  persona: EmailValidationServicePersona,
  context: MobileAccountOpeningContext,
  goals: ['Validate emails in <3s with 99.9% accuracy'],
})
export class EmailValidationServiceStakeholder {}

// ============================================================
// LAYER 3: JOURNEY & ACTIONS - WHAT (process flow)
// ============================================================

@Journey({
  name: 'Mobile Account Opening',
  stakeholder: MobileAccountOpenerStakeholder, // Primary stakeholder
  context: MobileAccountOpeningContext,
  description: 'End-to-end mobile account opening in <5 minutes',
  outcome: 'Customer has active account with instant virtual debit card',
})
export class MobileAccountOpeningJourney {}

// Action 1: Validate Email (Atomic scope, entry point)
@Action({
  name: 'ValidateCustomerEmail',
  journey: MobileAccountOpeningJourney,
  scope: ActionScope.Atomic,           // Single operation

  // Event that starts this action
  event: {
    type: 'customer.email.submitted',
    source: 'mobile-app',
  },

  // Forward-looking triggers (what comes next)
  triggers: [
    {
      event: {
        type: 'email.validation.succeeded',
        source: 'email-validation-service',
      },
      targetAction: VerifyCustomerIdentityAction, // Next step if email valid
      condition: 'validationResult.valid === true',
    },
    {
      event: {
        type: 'email.validation.failed',
        source: 'email-validation-service',
      },
      targetAction: ShowEmailErrorAction, // Error path
      condition: 'validationResult.valid === false',
    },
  ],

  // Stakeholder expectation for this action
  expectation: FastEmailValidationExpectation,
})
export class ValidateCustomerEmailAction {}

// Action 2: Verify Identity (Composite scope, orchestrates AI + compliance)
@Action({
  name: 'VerifyCustomerIdentity',
  journey: MobileAccountOpeningJourney,
  scope: ActionScope.Composite, // Orchestrates document AI + facial recognition

  event: {
    type: 'email.validation.succeeded', // Triggered by previous action
    source: 'email-validation-service',
  },

  triggers: [
    {
      event: {
        type: 'kyc.verification.high_confidence',
        source: 'kyc-ai-service',
      },
      targetAction: CreateAccountAction,
      condition: 'kycResult.confidence >= 95', // Auto-approve threshold
    },
    {
      event: {
        type: 'kyc.verification.low_confidence',
        source: 'kyc-ai-service',
      },
      targetAction: EscalateToManualReviewAction,
      condition: 'kycResult.confidence < 95', // Manual review needed
    },
  ],

  expectation: HighAccuracyIdentityVerificationExpectation,
})
export class VerifyCustomerIdentityAction {}

// Action 3: Create Account (Journey scope, emits business event)
@Action({
  name: 'CreateCustomerAccount',
  journey: MobileAccountOpeningJourney,
  scope: ActionScope.Journey, // Significant milestone, emits event

  event: {
    type: 'kyc.verification.high_confidence',
    source: 'kyc-ai-service',
  },

  // Parallel triggers (all happen simultaneously)
  triggers: [
    {
      event: {
        type: 'account.created',
        source: 'core-banking-system',
      },
      targetAction: IssueVirtualDebitCardAction,
      parallel: true, // Runs in parallel with others
    },
    {
      event: {
        type: 'account.created',
        source: 'core-banking-system',
      },
      targetAction: SendWelcomeEmailAction,
      parallel: true,
    },
    {
      event: {
        type: 'account.created',
        source: 'core-banking-system',
      },
      targetAction: CreateSavingsAccountAction,
      parallel: true,
    },
  ],

  expectation: InstantAccountCreationExpectation,
})
export class CreateCustomerAccountAction {}

// ============================================================
// LAYER 4: EXPECTATIONS - PROMISE (stakeholder contracts)
// ============================================================

@Expectation({
  name: 'Fast Email Validation',
  stakeholder: MobileAccountOpenerStakeholder,
  action: ValidateCustomerEmailAction,

  description: 'Email validated quickly without blocking user flow',

  // SLO/SLI configuration
  slo: {
    target: 99.9,           // 99.9% success rate
    window: '30d',          // Rolling 30 days
    errorBudget: 0.1,       // 0.1% allowed failure
  },

  qualityAttributes: {
    performance: {
      responseTime: '< 3 seconds p95', // 95th percentile
      throughput: '1000 requests/second',
    },
    reliability: {
      availability: '99.9%',
      errorRate: '< 0.1%',
    },
    correctness: {
      accuracy: '99.9% (false positive rate < 0.1%)',
      validation: 'RFC 5322 compliant',
    },
  },

  // Technical interaction at backend layer
  interaction: EmailValidationInteraction,

  // Implementation
  behavior: ValidateEmailFormatBehavior,

  // Metrics tracking
  metrics: [
    EmailValidationDurationMetric,
    EmailValidationSuccessRateMetric,
    EmailValidationAccuracyMetric,
  ],
})
export class FastEmailValidationExpectation {}

// ============================================================
// LAYER 5: INTERACTIONS - Technical Contracts
// ============================================================

@Interaction({
  name: 'Email Validation API Call',
  expectation: FastEmailValidationExpectation,
  pattern: InteractionPattern.RequestResponse,
  layer: InteractionLayer.Backend,

  // Backend-specific configuration
  backendConfig: {
    protocol: 'HTTPS',
    method: 'POST',
    endpoint: 'https://api.sendgrid.com/v3/validations/email',

    authentication: {
      type: 'bearer-token',
      headerName: 'Authorization',
    },

    requestFormat: {
      contentType: 'application/json',
      schema: { email: 'string' },
    },

    responseFormat: {
      contentType: 'application/json',
      schema: {
        valid: 'boolean',
        confidenceScore: 'number',
        checks: {
          format: 'boolean',
          dnsMX: 'boolean',
          smtpMailbox: 'boolean',
        },
      },
    },

    timeout: 5000, // 5 seconds
    retryPolicy: {
      maxRetries: 2,
      backoffStrategy: 'exponential',
    },

    circuitBreaker: {
      failureThreshold: 5,  // Open circuit after 5 failures
      resetTimeout: 60000,  // Try again after 60 seconds
      fallback: 'basic-regex-validation', // Fallback strategy
    },

    rateLimit: {
      limit: 100000,
      window: '1 month',
      strategy: 'token-bucket',
    },
  },

  provider: EmailValidationServiceStakeholder,
  consumer: MobileAccountOpenerStakeholder,
})
export class EmailValidationInteraction {}

// ============================================================
// LAYER 6: BEHAVIORS - HOW (implementation)
// ============================================================

@Behavior({
  name: 'ValidateEmailFormat',
  description: 'RFC 5322 email validation with DNS MX verification',

  participants: [
    EmailValidationServiceStakeholder,
    AuditLogSystemStakeholder,
  ],

  implementation: `
    1. Validate format using RFC 5322 regex
    2. Extract domain from email
    3. Query DNS for MX records
    4. SMTP mailbox verification (optional)
    5. Return validation result with confidence score
  `,

  complexity: BehaviorComplexity.Moderate,
  scope: BehaviorScope.Atomic,
  reusability: BehaviorReusability.Reusable,

  performance: {
    expectedDuration: '< 3 seconds',
    timeout: 5000,
    cacheable: true,
  },

  tracing: {
    enabled: true,
    metrics: [
      EmailValidationDurationMetric,
      EmailValidationSuccessRateMetric,
    ],
  },
})
export class ValidateEmailFormatBehavior {
  // ===== WITNESSES (Method decorators proving behavior works) =====

  @Witness({
    name: 'Valid Email Format Test',
    type: WitnessType.Unit,
    given: ['Email with valid format'],
    when: ['Validation executes'],
    then: ['Returns true', 'Confidence score = 100'],
    timeout: 1000,
  })
  witnessValidFormat() {
    const result = this.validate('marcus.lee@ogpgybank.com');
    assert(result.valid === true);
    assert(result.confidenceScore === 100);
  }

  @Witness({
    name: 'Invalid Email Syntax Test',
    type: WitnessType.Unit,
    given: ['Email without @ sign'],
    when: ['Validation executes'],
    then: ['Returns false', 'Error message indicates invalid format'],
    timeout: 1000,
  })
  witnessInvalidSyntax() {
    const result = this.validate('invalid-email');
    assert(result.valid === false);
    assert(result.error.includes('Invalid email format'));
  }

  // Implementation method (not decorated)
  validate(email: string): EmailValidationResult {
    // Actual implementation
  }
}

// ============================================================
// LAYER 7: METRICS - MEASURE (performance tracking)
// ============================================================

@Metric({
  name: 'Email Validation Duration',
  type: MetricType.Performance,
  unit: 'milliseconds',
  description: 'Time taken to validate email address (p50, p95, p99)',

  aggregation: MetricAggregation.Percentile,
  percentiles: [50, 95, 99],

  targets: {
    p50: 500,  // 500ms median
    p95: 3000, // 3s at 95th percentile
    p99: 5000, // 5s at 99th percentile
  },

  alerts: [
    {
      condition: 'p95 > 3000',
      severity: 'warning',
      message: 'Email validation p95 latency exceeds SLO',
    },
  ],
})
export class EmailValidationDurationMetric {}
```

`★ Insight ─────────────────────────────────────`
**Complete vertical integration** from business goal to implementation:
1. **Context**: Mobile account opening (business domain)
2. **Stakeholder**: MobileAccountOpener wants fast, error-free signup
3. **Journey**: Container for account opening flow
4. **Action**: ValidateEmail (triggered by email.submitted event, triggers next action)
5. **Expectation**: <3s validation, 99.9% accuracy (stakeholder promise)
6. **Interaction**: HTTPS POST to SendGrid API with circuit breaker
7. **Behavior**: RFC 5322 + DNS MX + SMTP implementation
8. **Witness**: Unit tests proving behavior works
9. **Metric**: Track p95 latency against 3s SLO

AI can trace from "customer wants fast signup" → "3s SLO" → "circuit breaker fallback" → "unit tests validate" → "p95 metrics monitored"
`─────────────────────────────────────────────────`

---

### Scenario 2: Hybrid Journey (Digital → Offline → Digital)

High-value account opening with manual compliance review:

```typescript
// Digital phase: AI verification
@Action({
  name: 'VerifyHighValueCustomerIdentity',
  scope: ActionScope.Composite,
  triggers: [
    {
      event: { type: 'kyc.ai.low_confidence' },
      targetAction: EscalateToComplianceReviewAction, // → Offline
      condition: 'accountValue > 100000 || aiConfidence < 95',
    },
  ],
})
export class VerifyHighValueCustomerIdentityAction {}

// Transition to offline: Create compliance ticket
@Action({
  name: 'EscalateToComplianceReview',
  scope: ActionScope.Journey,
  triggers: [
    {
      event: { type: 'compliance.ticket.created' },
      targetAction: ManualComplianceReviewAction, // → Offline action
    },
  ],
  interaction: JiraTicketCreationInteraction,
})
export class EscalateToComplianceReviewAction {}

// Offline phase: Human review with collaboration
@Action({
  name: 'ManualComplianceReview',
  scope: ActionScope.Journey,
  triggers: [
    {
      event: { type: 'compliance.review.approved' },
      targetAction: CreateHighValueAccountAction, // → Back to digital
    },
  ],

  // Multi-stakeholder collaboration (meeting/review)
  collaboration: EnhancedDueDiligenceCollaboration,
})
export class ManualComplianceReviewAction {}

@Collaboration({
  name: 'Enhanced Due Diligence Review',
  action: ManualComplianceReviewAction,
  pattern: CollaborationPattern.Meeting,

  // Multiple participants with roles
  participants: [
    {
      stakeholder: ComplianceOfficerStakeholder,
      role: CollaborationRole.DecisionMaker,
      requiredForCompletion: true,
    },
    {
      stakeholder: SeniorComplianceManagerStakeholder,
      role: CollaborationRole.Reviewer,
      requiredForCompletion: true, // Hierarchical approval
    },
    {
      stakeholder: AccountOpeningAgentStakeholder,
      role: CollaborationRole.Presenter,
      requiredForCompletion: false,
    },
  ],

  // Offline interaction: In-person meeting
  interpersonalConfig: {
    synchronicity: InteractionSynchronicity.Synchronous,
    location: 'Compliance department office',
    duration: '2-4 hours',
    agenda: [
      'Review customer documentation package',
      'Assess AML risk factors',
      'Discuss source of funds verification',
      'Decision: Approve, Request More Info, or Reject',
    ],
  },

  // Artifacts exchanged
  artifacts: [
    'Customer application package (PDF)',
    'AI verification report',
    'Source of funds documentation',
    'Compliance checklist',
    'Approval memo (if approved)',
  ],

  // Governance
  decisionMakingFramework: 'Hierarchical - ComplianceOfficer recommends, SeniorManager approves',
})
export class EnhancedDueDiligenceCollaboration {}

// Back to digital: Account creation
@Action({
  name: 'CreateHighValueAccount',
  scope: ActionScope.Journey,
  event: { type: 'compliance.review.approved' },
  triggers: [
    { event: { type: 'account.created' }, targetAction: SendWelcomeEmailAction },
  ],
})
export class CreateHighValueAccountAction {}
```

`★ Insight ─────────────────────────────────────`
**Hybrid journeys seamlessly blend digital and offline:**
- **Digital phase**: AI verification (milliseconds, automated)
- **Transition**: AI flags risk → creates Jira ticket (event-driven handoff)
- **Offline phase**: Human collaboration (hours/days, manual) with @Collaboration (meeting pattern, hierarchical approval)
- **Return to digital**: Approval triggers account creation (automated)

Aabha models the ENTIRE flow including handoffs between digital systems and human processes. No gaps.
`─────────────────────────────────────────────────`

---

## Anti-Patterns: What to Avoid

### ❌ Anti-Pattern 1: Journey Defines Flow (WRONG!)

```typescript
// ❌ WRONG: Journey trying to orchestrate flow
@Journey({
  name: 'Account Opening',
  steps: [  // ← DON'T DO THIS! Journeys don't have "steps"
    'ValidateEmail',
    'VerifyIdentity',
    'CreateAccount',
  ],
  flow: 'sequential', // ← NO! Flow emerges from Action.triggers
})
export class AccountOpeningJourney {}
```

**Why wrong**: Journeys are minimal containers. Flow topology is defined by **Action.triggers**, not by Journey.

**✅ Correct pattern**:
```typescript
@Journey({
  name: 'Account Opening',
  stakeholder: MobileAccountOpenerStakeholder,
  outcome: 'Customer has active account',
  // NO flow definition here!
})
export class AccountOpeningJourney {}

// Flow defined by Action triggers
@Action({
  name: 'ValidateEmail',
  triggers: [
    { event: { type: 'email.valid' }, targetAction: VerifyIdentityAction },
  ],
})
export class ValidateEmailAction {}
```

---

### ❌ Anti-Pattern 2: Using Arrow Functions for Class References

```typescript
// ❌ WRONG: Arrow function wrapping class reference
@Stakeholder({
  persona: () => MarcusLeePersona, // ← DON'T DO THIS!
})
export class MobileAccountOpenerStakeholder {}
```

**Why wrong**: Aabha uses compile-time type safety with `WithPersona<Constructor>`. Arrow functions break type checking.

**✅ Correct pattern**:
```typescript
@Stakeholder({
  persona: MarcusLeePersona, // ← Direct class reference (no arrow function, no quotes)
})
export class MobileAccountOpenerStakeholder {}
```

---

### ❌ Anti-Pattern 3: Decorator Confusion (Class vs Method vs Property)

```typescript
// ❌ WRONG: Using @Witness as class decorator
@Witness({  // ← NO! @Witness decorates METHODS, not classes!
  name: 'Test',
})
export class MyTest {}

// ❌ WRONG: Using @Behavior on a method
export class MyBehavior {
  @Behavior({ name: 'DoSomething' }) // ← NO! @Behavior decorates classes!
  doSomething() {}
}
```

**Why wrong**: Only `@Witness` is a method decorator. All other Aabha decorators (including `@Attribute`) are class decorators.

**✅ Correct pattern**:
```typescript
// @Behavior decorates the CLASS
@Behavior({ name: 'ValidateEmail' })
export class ValidateEmailBehavior {

  // @Witness decorates METHODS inside the class
  @Witness({
    name: 'Valid Email Test',
    type: WitnessType.Unit,
  })
  witnessValidEmail() {
    // Test implementation
  }
}
```

---

### ❌ Anti-Pattern 4: Overusing @Attribute

```typescript
// ❌ WRONG: Creating attribute for data that fits in persona
@Attribute({
  name: 'Age',
  type: 'number',
})
export class AgeAttribute {}

@Persona({
  attributes: [AgeAttribute], // ← DON'T! Use demographics.age instead
})
export class SomePersona {}
```

**Why wrong**: `@Attribute` is for **rare cross-cutting data** that doesn't fit anywhere else. Age fits naturally in `demographics.age`.

**✅ Correct pattern**:
```typescript
@Persona({
  age: '26', // ← Use built-in field
  demographics: {
    incomeLevel: 'GD$40K-60K',
    educationLevel: "Bachelor's",
  },
})
export class MarcusLeePersona {}

// Only use @Attribute for truly reusable cross-cutting data:
@Attribute({
  name: 'Tax ID Number',
  type: 'string',
  validation: { pattern: '^\\d{9}$' },
})
export class TaxIDAttribute {} // ← OK: Used by multiple entities with shared validation
```

---

### ❌ Anti-Pattern 5: Missing Expectation → Behavior Link

```typescript
// ❌ WRONG: Expectation without behavior implementation
@Expectation({
  name: 'Fast Email Validation',
  description: 'Validate email in <3s',
  // behavior: ??? ← Missing! How is this implemented?
})
export class FastEmailValidationExpectation {}
```

**Why wrong**: Expectations define stakeholder promises; behaviors implement them. The link must be explicit.

**✅ Correct pattern**:
```typescript
@Expectation({
  name: 'Fast Email Validation',
  behavior: ValidateEmailFormatBehavior, // ← Links expectation to implementation
  slo: { target: 99.9 },
})
export class FastEmailValidationExpectation {}
```

---

### ❌ Anti-Pattern 6: Stakeholder Without Persona or Context

```typescript
// ❌ WRONG: Stakeholder missing required relationships
@Stakeholder({
  type: StakeholderType.Human,
  role: 'Account Opener',
  // persona: ??? ← Missing! WHO is this?
  // context: ??? ← Missing! WHERE are they acting?
})
export class AccountOpenerStakeholder {}
```

**Why wrong**: Stakeholders require **both** persona (WHO) and context (WHERE). The formula is:
```
Stakeholder = WHO (persona) + WHAT (role) + WHERE (context)
```

**✅ Correct pattern**:
```typescript
@Stakeholder({
  type: StakeholderType.Human,
  role: 'Mobile Account Opener',
  persona: MarcusLeePersona,           // ← WHO
  context: MobileAccountOpeningContext, // ← WHERE
  goals: ['Open account in <5 min'],   // ← WHAT they want
})
export class MobileAccountOpenerStakeholder {}
```

---

## Migration Guide: Step/Milestone → Action

Aabha previously used `@Step` and `@Milestone` decorators. These have been **unified into `@Action`** with scope levels.

### Old Model (Deprecated)

```typescript
// ❌ OLD: Separate decorators for steps and milestones
@Step({
  name: 'Validate Email',
  // ... step-specific config
})
export class ValidateEmailStep {}

@Milestone({
  name: 'Account Created',
  // ... milestone-specific config
})
export class AccountCreatedMilestone {}
```

### New Model (Current)

```typescript
// ✅ NEW: Unified @Action with scope levels
@Action({
  name: 'ValidateEmail',
  scope: ActionScope.Atomic, // ← Step = Atomic/Composite
  // ...
})
export class ValidateEmailAction {}

@Action({
  name: 'AccountCreated',
  scope: ActionScope.Journey, // ← Milestone = Journey scope (emits events)
  // ...
})
export class AccountCreatedAction {}
```

### Migration Mapping

| Old Decorator | New Decorator | Scope | Notes |
|---------------|---------------|-------|-------|
| `@Step` (atomic) | `@Action` | `ActionScope.Atomic` | Single operation |
| `@Step` (composite) | `@Action` | `ActionScope.Composite` | Orchestrates multiple |
| `@Milestone` | `@Action` | `ActionScope.Journey` | Significant event, emits business event |
| N/A (new!) | `@Action` | `ActionScope.System` | Cross-journey coordination |

### Migration Checklist

1. ✅ Replace `@Step` with `@Action({ scope: ActionScope.Atomic })` or `Composite`
2. ✅ Replace `@Milestone` with `@Action({ scope: ActionScope.Journey })`
3. ✅ Ensure Journey scope actions emit events (business-significant)
4. ✅ Update triggers to reference new Action classes
5. ✅ Review scope assignments: Atomic (plentiful) vs Journey (rare, meaningful)
6. ✅ Remove any step-specific or milestone-specific fields (now unified)

### Example Migration

**Before (Old)**:
```typescript
@Step({ name: 'Validate Email' })
export class ValidateEmailStep {}

@Step({ name: 'Verify Identity' })
export class VerifyIdentityStep {}

@Milestone({ name: 'Account Created', emitsEvent: true })
export class AccountCreatedMilestone {}
```

**After (New)**:
```typescript
@Action({
  name: 'ValidateEmail',
  scope: ActionScope.Atomic,
  triggers: [{ targetAction: VerifyIdentityAction }],
})
export class ValidateEmailAction {}

@Action({
  name: 'VerifyIdentity',
  scope: ActionScope.Composite,
  triggers: [{ targetAction: CreateAccountAction }],
})
export class VerifyIdentityAction {}

@Action({
  name: 'CreateAccount',
  scope: ActionScope.Journey, // ← Milestone becomes Journey scope
  event: { type: 'account.created', source: 'core-banking' },
  triggers: [
    { targetAction: IssueVirtualCardAction, parallel: true },
    { targetAction: SendWelcomeEmailAction, parallel: true },
  ],
})
export class CreateAccountAction {}
```

---

## Final Mental Model

### The Aabha Stack in One Picture

```
┌──────────────────────────────────────────────┐
│         BUSINESS INTENT (Stakeholder View)    │
│  "I want fast account opening with no errors" │
└───────────────────┬──────────────────────────┘
                    │
                    │ modeled as
                    ▼
┌──────────────────────────────────────────────┐
│    JOURNEY → ACTIONS (Event-driven DAG)       │
│  ValidateEmail → VerifyIdentity → CreateAcct  │
└───────────────────┬──────────────────────────┘
                    │
                    │ with promises
                    ▼
┌──────────────────────────────────────────────┐
│    EXPECTATIONS (SLO/SLI, Quality Metrics)    │
│  <3s validation, 99.9% accuracy, <5 min total │
└───────────────────┬──────────────────────────┘
                    │
                    │ implemented by
                    ▼
┌──────────────────────────────────────────────┐
│    BEHAVIORS (Code, APIs, Integrations)       │
│  RFC 5322 regex + DNS MX + SMTP verification  │
└───────────────────┬──────────────────────────┘
                    │
                    │ proven by
                    ▼
┌──────────────────────────────────────────────┐
│    WITNESSES (BDD Tests, Given-When-Then)     │
│  Unit, Integration, E2E, Acceptance tests     │
└───────────────────┬──────────────────────────┘
                    │
                    │ measured by
                    ▼
┌──────────────────────────────────────────────┐
│    METRICS (Observable Reality)               │
│  p95 latency = 2.8s (within 3s SLO) ✓        │
└──────────────────────────────────────────────┘
```

`★ Insight ─────────────────────────────────────`
**Aabha creates a complete traceability chain:**
1. **Business goal** ("fast signup") →
2. **Stakeholder expectation** (<5 min, zero errors) →
3. **Journey/Action flow** (email → KYC → account) →
4. **SLO/SLI contracts** (<3s per step, 99.9% success) →
5. **Implementation** (RFC 5322 + DNS + SMTP) →
6. **Verification** (BDD tests prove it works) →
7. **Measurement** (metrics track p95 = 2.8s ✓)

AI can traverse this chain in BOTH directions:
- **Top-down**: "Customer wants fast signup" → What SLO? → What implementation? → What tests validate? → What metrics track?
- **Bottom-up**: "p95 latency is 5s" → Violates which SLO? → Affects which expectation? → Disappoints which stakeholder? → Hurts which business goal?

This bidirectional traceability enables AI to reason about business impact of technical changes and technical feasibility of business requirements.
`─────────────────────────────────────────────────`

---

## Key Takeaways

1. **Decorator hierarchy flows abstract → concrete**: Context → Persona/Stakeholder → Journey/Action → Expectation → Behavior → Witness → Metric

2. **Flow topology emerges from Action.triggers**: Journeys don't define flow; Actions do via forward-looking triggers creating DAG

3. **Complete vertical integration**: Every business goal traces to SLO → implementation → tests → metrics

4. **Hybrid journeys blend digital + offline**: `@Collaboration` models human coordination, `@Interaction` models technical contracts

5. **Avoid anti-patterns**:
   - ❌ Journey defining flow (use Action.triggers)
   - ❌ Arrow functions for class refs (use direct references)
   - ❌ Decorator confusion (@Witness is METHOD decorator!)
   - ❌ Overusing @Attribute (use structured fields)
   - ❌ Missing Expectation → Behavior link

6. **Migration: Step/Milestone → Action**: Unified with scope levels (Atomic, Composite, Journey, System)

7. **Bidirectional traceability**: AI can traverse business goal ↔ SLO ↔ implementation ↔ tests ↔ metrics in both directions

---

**Congratulations!** You've completed the full Aabha AI Primer series (Files 1-7). You now understand how to model complete business processes from stakeholder intent to executable implementation with full traceability. 🎉

---

**Full Series**:
1. [Core Concepts & Rules](./01-core-concepts.md) - DAG topology, scopes, compile-time safety
2. [Transformer & Rules](./02-transformer-rules.md) - TypeScript → JSON, validation rules
3. [Digital Journey Decorators](./03-digital-journey-decorators.md) - @Journey, @Action, @Expectation, @Interaction for digital
4. [Offline Journey Decorators](./04-offline-journey-decorators.md) - @Interaction (offline), @Collaboration for human processes
5. [Stakeholder & Persona Decorators](./05-stakeholder-persona-decorators.md) - WHO participates (persona) and WHAT they do (stakeholder)
6. [Behavioral Decorators](./06-behavioral-decorators.md) - HOW things work (@Behavior, @Witness, @Attribute)
7. **Composition Patterns** (this file) - How everything works together
