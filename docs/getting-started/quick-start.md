# Quick Start

Build your first product model with Aabha in 5 minutes using **strategy-first thinking**. We'll model OgPgy Bank's **Instant Account Opening** initiative.

## Prerequisites

- [Aabha installed](./installation.md)
- [TypeScript configured](./typescript-configuration.md)
- Basic TypeScript knowledge

## The Strategy-First Approach

> **"If the strategy is not in place, what are you even building?"**

Aabha follows a logical top-down flow that mirrors how product management actually works:

**Strategy → Metrics → Initiatives → Contexts → Personas → Stakeholders → Journeys → Details**

Let's build step by step.

## Your First Product Model

We'll model OgPgy Bank's digital transformation initiative for young adults.

### Step 1: Define Your Strategy

**Everything starts with strategy.** Where are you playing? How will you win?

```typescript
// src/model/strategy.ts
import { Strategy } from 'aabha';

@Strategy({
  name: 'Digital-First Banking 2025',
  description: 'Transform from branch-centric to mobile-first banking',
  whereToPlay: [
    'Young adults (21-35) seeking mobile-first banking',
    'Digital natives who never visit branches',
    'Tech-savvy millennials expecting instant gratification'
  ],
  howToWin: 'Fastest, easiest account opening in Genai - under 5 minutes',
  capabilities: [
    'AI-powered KYC verification',
    'Real-time document processing',
    'Instant account provisioning',
    'Mobile-first UX'
  ],
  timeframe: '2024-2027'
})
export class DigitalFirstStrategy {}
```

### Step 2: Define Success Metrics

**How will we know if we're winning?** Define metrics upfront.

```typescript
// src/model/metrics.ts
import { Metric } from 'aabha';

@Metric({
  name: 'Account Opening Time',
  description: 'Time from start to active account',
  target: 5,
  unit: 'minutes',
  measurement: 'Average time to complete digital onboarding'
})
export class AccountOpeningTimeMetric {}

@Metric({
  name: 'Digital Adoption Rate',
  description: 'Percentage of accounts opened digitally vs in-branch',
  target: 80,
  unit: '%',
  measurement: 'Digital opens / Total opens'
})
export class DigitalAdoptionMetric {}
```

### Step 3: Define Your Initiative

**What are we building?** Create the initiative with empty journeys (we'll add them later).

```typescript
// src/model/initiatives.ts
import { BusinessInitiative } from 'aabha';
import { DigitalFirstStrategy } from './strategy';
import { AccountOpeningTimeMetric, DigitalAdoptionMetric } from './metrics';

@BusinessInitiative({
  name: 'Instant Account Opening',
  description: 'Enable customers to open accounts instantly via mobile app',
  strategy: DigitalFirstStrategy,  // Links to our strategy
  objectives: [
    'Reduce account opening time from 5 days to 5 minutes',
    'Achieve 80% digital adoption for new accounts',
    'Acquire 50K new young adult customers in Q1 2025'
  ],
  journeys: [],  // Empty for now - we'll add journeys later
  metrics: [AccountOpeningTimeMetric, DigitalAdoptionMetric],
  targetAudience: ['Young adults 21-26', 'Digital natives']
})
export class InstantAccountOpeningInitiative {}
```

**Note**: Journeys array is empty because we haven't designed them yet!

### Step 4: Define Contexts (Perspectives)

**Context = Perspective or Domain**. What are ALL the lenses through which we view this product?

```typescript
// src/model/contexts.ts
import { Context } from 'aabha';

// Customer-facing context
@Context({
  name: 'Customer Onboarding',
  description: 'How customers get started with OgPgy Bank',
  goals: ['Fast onboarding', 'High conversion', 'Great first impression']
})
export class OnboardingContext {}

// Compliance perspective
@Context({
  name: 'KYC Compliance',
  description: 'Know Your Customer regulatory requirements',
  goals: ['100% regulatory compliance', 'Prevent fraud', 'Audit trail']
})
export class ComplianceContext {}

// Risk management perspective
@Context({
  name: 'Risk Management',
  description: 'Fraud prevention and risk assessment',
  goals: ['Detect fraudulent applications', 'Minimize risk exposure']
})
export class RiskContext {}
```

**Why multiple contexts?** Same product, different perspectives:
- **Customer** cares about speed and ease
- **Compliance** cares about regulatory adherence
- **Risk** cares about fraud prevention

### Step 5: Define Personas

**Who are the people?** Define archetypes (not yet tied to contexts).

```typescript
// src/model/personas.ts
import { Persona } from 'aabha';

// A customer persona
@Persona({
  name: 'Zara Ahmed',
  age: '21',
  occupation: 'University Student',
  description: 'Tech-savvy digital native, never visited a bank branch',
  goals: [
    'Open account without paperwork',
    'Start using account immediately',
    'Manage money from phone'
  ],
  painPoints: [
    'Traditional banks too slow',
    'Branch visits inconvenient',
    'Complex forms and documents'
  ]
})
export class ZaraPersona {}

// A compliance officer persona (internal)
@Persona({
  name: 'Dr. Kenji Yamamoto',
  age: '55',
  occupation: 'Chief Compliance Officer at OgPgy Bank',
  description: 'Ensures regulatory compliance and KYC requirements',
  goals: [
    'Meet all regulatory requirements',
    'Maintain audit trail',
    'Prevent financial crime'
  ]
})
export class ComplianceOfficerPersona {}
```

### Step 6: Define Stakeholders (Persona × Context)

**Stakeholder = WHO (Persona) in WHERE (Context)**. This is the key insight!

```typescript
// src/model/stakeholders.ts
import { Stakeholder } from 'aabha';
import { ZaraPersona, ComplianceOfficerPersona } from './personas';
import { OnboardingContext, ComplianceContext, RiskContext } from './contexts';

// Zara in the Onboarding context
@Stakeholder({
  role: 'Mobile Banking Customer',
  persona: ZaraPersona,           // WHO: Zara
  context: OnboardingContext      // WHERE: Onboarding
})
export class MobileCustomerStakeholder {}
// Expectation: Fast, easy, mobile-first experience

// Same person (Zara) in Compliance context - different expectations!
@Stakeholder({
  role: 'KYC Subject',
  persona: ZaraPersona,           // WHO: Same person (Zara)
  context: ComplianceContext      // WHERE: Different context (Compliance)
})
export class KYCSubjectStakeholder {}
// Expectation: Privacy, data security, transparent process

// Compliance Officer in Compliance context
@Stakeholder({
  role: 'Compliance Validator',
  persona: ComplianceOfficerPersona,
  context: ComplianceContext
})
export class ComplianceValidatorStakeholder {}
// Expectation: Complete documentation, audit trail, regulatory proof
```

**Key Insight**: Zara appears in BOTH Onboarding and Compliance contexts with DIFFERENT roles and expectations!

### Step 7: Define a Journey (with Empty Milestones)

**Map the user experience.** Start with an empty milestones array.

```typescript
// src/model/journeys.ts
import { Journey } from 'aabha';
import { MobileCustomerStakeholder } from './stakeholders';

@Journey({
  name: 'Instant Account Opening Journey',
  description: 'Customer opens account via mobile app in under 5 minutes',
  primaryStakeholder: MobileCustomerStakeholder,
  milestones: []  // Empty for now - we'll add milestones next
})
export class InstantAccountOpeningJourney {}
```

### Step 8: Link Journey to Initiative

**Now we can add the journey to our initiative:**

```typescript
// src/model/initiatives.ts - UPDATE
import { InstantAccountOpeningJourney } from './journeys';

@BusinessInitiative({
  name: 'Instant Account Opening',
  // ... other properties ...
  journeys: [InstantAccountOpeningJourney],  // Add the journey!
  // ... rest ...
})
export class InstantAccountOpeningInitiative {}
```

### Step 9: Define Milestones

**What are the key achievements?**

```typescript
// src/model/milestones.ts
import { Milestone } from 'aabha';
import { MobileCustomerStakeholder, KYCSubjectStakeholder } from './stakeholders';

@Milestone({
  name: 'Identity Verified',
  description: 'Customer identity confirmed via AI KYC',
  stakeholder: KYCSubjectStakeholder,  // Note: Compliance context!
  successCriteria: [
    'Government ID validated',
    'Face match successful',
    'Liveness check passed',
    'AML screening completed'
  ]
})
export class IdentityVerifiedMilestone {}

@Milestone({
  name: 'Account Activated',
  description: 'Account is ready for use',
  stakeholder: MobileCustomerStakeholder,  // Customer context
  successCriteria: [
    'Account number assigned',
    'Virtual debit card issued',
    'Mobile banking enabled',
    'Welcome email sent'
  ]
})
export class AccountActivatedMilestone {}
```

### Step 10: Link Milestones to Journey

**Update the journey with milestones:**

```typescript
// src/model/journeys.ts - UPDATE
import { IdentityVerifiedMilestone, AccountActivatedMilestone } from './milestones';

@Journey({
  name: 'Instant Account Opening Journey',
  description: 'Customer opens account via mobile app in under 5 minutes',
  primaryStakeholder: MobileCustomerStakeholder,
  milestones: [
    { milestone: IdentityVerifiedMilestone, order: 1 },
    { milestone: AccountActivatedMilestone, order: 2 }
  ]  // Added milestones!
})
export class InstantAccountOpeningJourney {}
```

## Compile and Verify

Compile your product model:

```bash
tsc
```

If there are **no errors**, congratulations! 🎉 You've created a type-safe, compile-time validated product model.

## What Did We Just Build?

You've defined a complete product model following the strategy-first approach:

```
1. @Strategy - Digital-First Banking 2025
   ↓
2. @Metric - How we measure success
   ↓
3. @BusinessInitiative - Instant Account Opening (empty journeys → filled later)
   ↓
4. @Context - Onboarding, Compliance, Risk (multiple perspectives!)
   ↓
5. @Persona - Zara (customer), Dr. Yamamoto (compliance officer)
   ↓
6. @Stakeholder - Persona × Context combinations
   • Zara in Onboarding context = Mobile Customer
   • Zara in Compliance context = KYC Subject
   • Dr. Yamamoto in Compliance context = Compliance Validator
   ↓
7. @Journey - Instant Account Opening (empty milestones → filled later)
   ↓
8. Link Journey to Initiative
   ↓
9. @Milestone - Identity Verified, Account Activated
   ↓
10. Link Milestones to Journey
```

**Key Insights:**
- ✅ **Strategy first** - Defined WHERE to play and HOW to win before anything else
- ✅ **Context = Perspective** - Same product viewed through multiple lenses
- ✅ **Stakeholder = Persona × Context** - Zara has different expectations in different contexts
- ✅ **Progressive disclosure** - Built with empty arrays, filled them in logical order
- ✅ **Type safety** - Compile-time validation ensures consistency

## The Power of Contexts

Notice how Zara Ahmed appears in **two different contexts**:

| Context | Role | Expectations |
|---------|------|--------------|
| **Onboarding** | Mobile Banking Customer | Fast, easy, mobile-first |
| **Compliance** | KYC Subject | Privacy, security, transparency |

**Same person, different perspectives, different expectations!**

This is the power of Context in Aabha.

## Type Safety in Action

Try making an invalid reference:

```typescript
@BusinessInitiative({
  strategy: InstantAccountOpeningJourney,  // ❌ ERROR!
  // TypeScript error: Journey is not assignable to Strategy!
})
class BrokenInitiative {}
```

TypeScript **prevents** you from making invalid relationships!

## Product Completeness

**A complete product meets ALL expectations of ALL stakeholders across ALL contexts.**

In our example:
- ✅ Zara's expectations in Onboarding context (fast, easy experience)
- ✅ Zara's expectations in Compliance context (privacy, security)
- ✅ Dr. Yamamoto's expectations in Compliance context (audit trail, regulatory proof)

We haven't fully modeled all expectations yet, but the structure is in place!

## Next Steps

### Continue Building

You can continue adding more detail to your model:

1. **Add @Step** - Granular actions within milestones
2. **Add @Expectation** - Specific stakeholder expectations per step
3. **Add @Behavior** - How the system behaves to meet expectations
4. **Add @Witness** - Observers and auditors

### Learn Core Concepts

- [Core Concepts](./core-concepts.md) - Deep dive into Context = Perspective
- [Understanding Contexts](../guides/understanding-contexts.md) - Master the context concept
- [Product Completeness](../guides/product-completeness.md) - Ensure all expectations are met

### Study the Build Order

- [Strategic Build Order](../best-practices/strategic-build-order.md) - Step-by-step guide

### See Complete Examples

- [OgPgy Bank Digital Transformation](../examples/ogpgy-bank/) - Complete banking transformation
- [Contexts and Stakeholders](../examples/ogpgy-bank/contexts-and-stakeholders.md) - See all contexts and stakeholder combinations

### Use with AI

- [AI-Assisted Development](../guides/ai-assisted-development.md) - 10x token efficiency

## Key Takeaways

1. **Always start with Strategy** - WHERE to play, HOW to win
2. **Define Contexts early** - All perspectives/domains
3. **Context = Perspective** - Sales, Onboarding, Compliance, Risk, etc.
4. **Stakeholder = Persona × Context** - Same person, different contexts, different roles
5. **Build progressively** - Empty arrays first, fill them in logical order
6. **Product completeness** - All expectations met across all contexts

## The Build Order (Summary)

```
1. Strategy → 2. Metrics → 3. Initiative (empty journeys)
4. Contexts → 5. Personas → 6. Stakeholders
7. Journey (empty milestones) → 8. Link to Initiative
9. Milestones → 10. Link to Journey
11. Steps → 12. Expectations → 13. Behaviors → 14. Witness
```

**Remember**: If the strategy is not in place, what are you even building?

---

[← Back: TypeScript Configuration](./typescript-configuration.md) | [Documentation Home](../README.md) | [Next: Core Concepts →](./core-concepts.md)
