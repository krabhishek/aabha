# Core Concepts

Understand the foundational principles that make Aabha powerful.

## The Aabha Philosophy

> **"The aura of a great product comes from clarity, not complexity."**
>
> **"If the strategy is not in place, what are you even building?"**

Aabha brings engineering discipline to product management by making product strategy, user journeys, and expectations:

1. **Executable** - Product models are code, not documents
2. **Type-safe** - Inconsistencies caught at compile time
3. **Version-controlled** - Track evolution with Git
4. **Context-aware** - Multiple perspectives on the same product
5. **AI-ready** - Rich context for AI assistants
6. **Living** - Code and documentation are one

## Key Principles

### 1. Strategy-First Thinking

**Everything starts with strategy.**

Traditional product management often jumps to features without establishing strategic foundation. Aabha enforces strategic discipline:

```typescript
// ❌ Wrong approach: Starting with features
@Journey({ name: 'User signs up'... })  // But WHY? For WHAT strategy?

// ✅ Right approach: Strategy first
@Strategy({
  whereToPlay: ['Young professionals'],
  howToWin: 'Fastest onboarding'
})
class GrowthStrategy {}

@BusinessInitiative({
  strategy: GrowthStrategy,  // Linked to strategy!
  journeys: [...]
})
```

**The Build Order:**
```
1. Strategy (WHERE to play, HOW to win)
2. Metrics (HOW we measure success)
3. Initiatives (WHAT we're building)
4. Contexts (ALL perspectives)
5. Personas (WHO people are)
6. Stakeholders (WHO in WHERE)
7. Journeys → Milestones → Steps → Expectations → Behaviors
```

See: [Strategic Build Order](../best-practices/strategic-build-order.md)

### 2. Context = Perspective

**This is the most powerful concept in Aabha.**

A **Context** represents a perspective or domain through which you view your product:

```typescript
// Different ways to view the same product:

@Context({
  name: 'Sales',
  description: 'How we acquire customers',
  goals: ['High conversion', 'Low acquisition cost']
})
class SalesContext {}

@Context({
  name: 'Customer Onboarding',
  description: 'How customers get started',
  goals: ['Fast time-to-value', 'High activation']
})
class OnboardingContext {}

@Context({
  name: 'Compliance',
  description: 'Regulatory and legal requirements',
  goals: ['100% compliance', 'Audit readiness']
})
class ComplianceContext {}

@Context({
  name: 'Support',
  description: 'How customers get help',
  goals: ['Quick resolution', 'Customer satisfaction']
})
class SupportContext {}

@Context({
  name: 'Risk Management',
  description: 'Fraud prevention and risk assessment',
  goals: ['Minimize fraud', 'Protect assets']
})
class RiskContext {}
```

**Common Context Types:**

**Customer-Facing:**
- Sales / Marketing
- Onboarding
- Daily Operations / Usage
- Customer Support
- Billing / Payments

**Internal:**
- Operations
- Compliance
- Audit
- Risk Management
- Security
- Technology / Engineering

**External:**
- Regulatory
- Partner Integration
- API / Developer

### 3. Stakeholder = Persona × Context

**The mathematical formula for stakeholders:**

```
Stakeholder = Persona × Context
```

A **Persona** is WHO someone is (archetype, characteristics).
A **Context** is WHERE they operate (perspective, domain).
A **Stakeholder** is a specific ROLE (Persona in a Context).

**Example: Maria Santos (Working Mother)**

```typescript
// WHO Maria is
@Persona({
  name: 'Maria Santos',
  age: '35',
  occupation: 'Marketing Manager',
  goals: ['Manage family finances', 'Save for children education']
})
class MariaSantosPersona {}

// WHERE perspectives exist
@Context({ name: 'Mobile Banking' })
class MobileBankingContext {}

@Context({ name: 'Loan Application' })
class LoanContext {}

@Context({ name: 'Customer Support' })
class SupportContext {}

// WHAT roles Maria has (WHO × WHERE)

// Maria in Mobile Banking context
@Stakeholder({
  role: 'Mobile Banking Customer',
  persona: MariaSantosPersona,  // WHO
  context: MobileBankingContext  // WHERE
})
class MariaMobileBanking {}
// Expectations: Fast transactions, simple UI, 24/7 access

// Maria in Loan Application context
@Stakeholder({
  role: 'Mortgage Applicant',
  persona: MariaSantosPersona,  // SAME PERSON
  context: LoanContext           // DIFFERENT CONTEXT
})
class MariaLoanApplicant {}
// Expectations: Clear guidance, transparent rates, easy documentation

// Maria in Support context
@Stakeholder({
  role: 'Customer Seeking Help',
  persona: MariaSantosPersona,  // SAME PERSON
  context: SupportContext        // DIFFERENT CONTEXT
})
class MariaSupportCustomer {}
// Expectations: Quick response, empathy, problem resolution
```

**Key Insight**: Maria is ONE person but has DIFFERENT expectations in DIFFERENT contexts!

This is why Context matters.

### 4. Product Completeness

**A complete product satisfies ALL expectations of ALL stakeholders across ALL contexts.**

Mathematically:
```
Stakeholders = Personas × Contexts
Product Completeness = ∀ stakeholders ∈ Stakeholders,
                       ∀ expectations ∈ stakeholder.expectations,
                       expectation is satisfied
```

In plain English:
- Identify ALL personas (customers, employees, regulators, etc.)
- Identify ALL contexts (perspectives/domains)
- For each Persona × Context combination = Stakeholder
- For each stakeholder, define their expectations
- Product is complete when ALL expectations are met

**Example: Account Opening Product**

| Persona | Context | Stakeholder Role | Expectations |
|---------|---------|------------------|--------------|
| Zara (customer) | Onboarding | New Customer | Fast, easy, mobile-first |
| Zara (customer) | Compliance | KYC Subject | Privacy, security, transparency |
| Dr. Yamamoto (compliance) | Compliance | Compliance Validator | Complete docs, audit trail |
| Amara (security) | Security | Security Auditor | Data protection, access control |
| System AI | Operations | KYC Verifier | Clear APIs, accurate data |

**Product completeness** = Meeting ALL 5 stakeholders' expectations.

See: [Product Completeness Guide](../guides/product-completeness.md)

### 5. One-Way Hierarchy

**Parents know children. Children don't know parents.**

This enables component reusability:

```typescript
// ✅ Journey is independent - no parent reference
@Journey({
  name: 'Checkout Journey',
  primaryStakeholder: CustomerStakeholder
  // NO reference to which initiative uses it!
})
class CheckoutJourney {}

// Multiple initiatives can reuse the same journey
@BusinessInitiative({
  name: 'Initiative A',
  journeys: [CheckoutJourney]  // Parent knows child
})
class InitiativeA {}

@BusinessInitiative({
  name: 'Initiative B',
  journeys: [CheckoutJourney]  // Same journey, different initiative!
})
class InitiativeB {}
```

See: [One-Way Hierarchy Principle](../guides/one-way-hierarchy-principle.md)

### 6. Progressive Disclosure

**Build incrementally with empty arrays, fill them in logical order.**

```typescript
// Step 1: Create initiative with empty journeys
@BusinessInitiative({
  name: 'My Initiative',
  strategy: MyStrategy,
  journeys: []  // Empty!
})
class MyInitiative {}

// Step 2: Create journey with empty milestones
@Journey({
  name: 'My Journey',
  milestones: []  // Empty!
})
class MyJourney {}

// Step 3: Link journey to initiative
@BusinessInitiative({
  journeys: [MyJourney]  // Now filled!
})

// Step 4: Create milestones
@Milestone({ name: 'Milestone 1' })
class Milestone1 {}

// Step 5: Link milestones to journey
@Journey({
  milestones: [{ milestone: Milestone1, order: 1 }]  // Now filled!
})
```

This mirrors how products are actually built - high-level first, details later.

## The Product Hierarchy

```
┌────────────────────────────────────────┐
│ @Strategy                              │ ← WHERE to play, HOW to win
│  Business strategy & competitive edge  │
└──────────────┬─────────────────────────┘
               ↓
┌────────────────────────────────────────┐
│ @BusinessInitiative                    │ ← WHAT we're building
│  Concrete initiatives                  │
└──────────────┬─────────────────────────┘
               ↓
┌────────────────────────────────────────┐
│ @Journey                               │ ← HOW users experience it
│  User/stakeholder journeys             │
└──────────────┬─────────────────────────┘
               ↓
┌────────────────────────────────────────┐
│ @Milestone                             │ ← Significant achievements
│  Key waypoints                         │
└──────────────┬─────────────────────────┘
               ↓
┌────────────────────────────────────────┐
│ @Step                                  │ ← Granular actions
│  Specific user/system actions          │
└──────────────┬─────────────────────────┘
               ↓
┌────────────────────────────────────────┐
│ @Expectation                           │ ← WHAT stakeholders expect
│  Requirements per context              │
└──────────────┬─────────────────────────┘
               ↓
┌────────────────────────────────────────┐
│ @Behavior                              │ ← HOW system behaves
│  Executable behaviors                  │
└──────────────┬─────────────────────────┘
               ↓
┌────────────────────────────────────────┐
│ @Test                                  │ ← Verification
│  Test specifications                   │
└────────────────────────────────────────┘
```

**Cross-cutting concerns** (attach at any level):
- **@Metric** - Measurable outcomes
- **@Context** - Perspectives/domains
- **@Persona** - User archetypes (human, system, organization)
- **@Stakeholder** - Roles (Persona × Context)
- **@Witness** - Observers and auditors
- **@Attribute** - Reusable metadata

## Compile-Time Validation

Aabha validates your product model **before** implementation:

```typescript
// ✅ VALID: Properly typed relationships
@BusinessInitiative({
  strategy: GrowthStrategy,      // Has @Strategy decorator
  journeys: [CheckoutJourney],   // Has @Journey decorator
})
class ValidInitiative {}

// ❌ COMPILE ERROR: Invalid relationships
@BusinessInitiative({
  strategy: CheckoutJourney,     // ERROR: Journey ≠ Strategy
  journeys: [GrowthStrategy],    // ERROR: Strategy ≠ Journey
})
class InvalidInitiative {}
```

**Type error-free compilation = Internally consistent product model!**

See: [Type Safety Patterns](../guides/type-safety-patterns.md)

## Zero Runtime Overhead

Aabha is **compile-time only**:

- Decorators apply **type brands** (compile-time markers)
- Minimal runtime footprint (phantom properties only)
- No runtime validation or reflection
- No performance impact

**Result**: All benefits of structured product models without runtime cost.

## AI-Assisted Development

Aabha models are **optimized for AI**:

### Token Efficiency

```typescript
// Traditional approach: 500+ tokens
"Build account opening. User enters email, password, verifies identity,
uploads documents, gets approved. Target young professionals who want
fast onboarding. Must comply with KYC regulations..."

// Aabha approach: 50 tokens
@BusinessInitiative({
  name: 'Instant Account Opening',
  strategy: DigitalFirstStrategy,
  journeys: [OnboardingJourney],
  metrics: [TimeToValueMetric]
})
class AccountOpeningInitiative {}

// AI reads the structure and understands:
// - Strategy context (DigitalFirstStrategy)
// - User journey (OnboardingJourney with all milestones)
// - Success metrics (TimeToValueMetric)
// - All stakeholder expectations embedded in journey
```

**Result**: 10x less tokens, 10x better context!

See: [AI-Assisted Development Guide](../guides/ai-assisted-development.md)

## Mental Model: Viewing a Diamond

Think of your product like a **diamond** viewed through different lenses:

- From **Sales** lens: acquisition funnel, conversion rates
- From **Onboarding** lens: activation, time-to-value
- From **Compliance** lens: regulatory requirements, audit trail
- From **Support** lens: common issues, resolution time
- From **Security** lens: threat vectors, access control

**Same product, multiple perspectives (contexts).**

Each stakeholder (persona in context) sees different facets and has different expectations.

Aabha helps you model ALL perspectives to achieve completeness.

## What Aabha Is NOT

Aabha is **not**:

- ❌ A code generation tool
- ❌ A project management tool
- ❌ A database schema designer
- ❌ A runtime validation library

Aabha **is**:

- ✅ A product management framework
- ✅ A type-safe way to express product models
- ✅ A compile-time validation tool
- ✅ A shared language for product teams
- ✅ A context-aware product modeling system
- ✅ An AI context optimization tool

## Best Practices Quick Reference

1. **Start with strategy** - WHERE to play, HOW to win
2. **Identify ALL contexts** - Every perspective matters
3. **Define personas** - WHO people are (characteristics)
4. **Map stakeholders** - Persona × Context = Role
5. **Define expectations per context** - Same person, different expectations
6. **Build progressively** - Empty arrays first, fill later
7. **Measure with metrics** - Attach at all levels
8. **Achieve completeness** - All stakeholders, all contexts, all expectations

See: [Best Practices](../best-practices/)

## Next Steps

### Understand Core Concepts Deeply

- [Understanding Contexts](../guides/understanding-contexts.md) - Master contexts
- [Product Completeness](../guides/product-completeness.md) - Achieve completeness
- [Strategic Build Order](../best-practices/strategic-build-order.md) - Step-by-step

### See Real Examples

- [OgPgy Bank Contexts & Stakeholders](../examples/ogpgy-bank/contexts-and-stakeholders.md)
- [Digital Transformation Strategy](../examples/ogpgy-bank/digital-transformation-strategy.md)

### Explore API

- [@Strategy](../api/decorators/strategy.md)
- [@Context](../api/decorators/context.md)
- [@Stakeholder](../api/decorators/stakeholder.md)
- [All API Reference](../api/)

---

[← Back: Quick Start](./quick-start.md) | [Documentation Home](../README.md) | [API Reference →](../api/)
