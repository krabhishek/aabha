# Strategic Build Order

**The definitive guide to building Aabha product models in the correct logical sequence.**

> **"If the strategy is not in place, what are you even building?"**

## Overview

Aabha enforces a **strategy-first, top-down approach** that mirrors how product management actually works. This guide shows you the exact order to build your product model.

## The Complete Build Order

```
1. Strategy → 2. Metrics → 3. Initiatives (empty journeys)
4. Contexts → 5. Personas → 6. Stakeholders (Persona × Context)
7. Journeys (empty milestones) → 8. Link Journeys to Initiatives
9. Milestones (empty) → 10. Link Milestones to Journeys
11. Steps → 12. Expectations → 13. Behaviors → 14. Witnesses
```

## Why This Order?

Each step builds on the previous ones:

- **Strategy first** - Defines WHERE to play and HOW to win (the foundation)
- **Metrics second** - Defines HOW we measure success (before building anything)
- **Initiatives third** - Defines WHAT we're building (linked to strategy)
- **Contexts fourth** - Identifies ALL perspectives (before personas)
- **Personas fifth** - Defines WHO people are (characteristics only)
- **Stakeholders sixth** - Combines WHO + WHERE (roles with expectations)
- **Progressive refinement** - Build structure first, add details later

## Step-by-Step Guide

### Step 1: Define Your Strategy

**Question**: WHERE will we play and HOW will we win?

**Output**: One or more `@Strategy` classes

```typescript
// src/model/strategy.ts
import { Strategy } from 'aabha';

@Strategy({
  name: 'Digital-First Banking 2025',
  description: 'Transform from branch-centric to mobile-first banking',
  whereToPlay: [
    'Young adults (21-35) seeking mobile-first banking',
    'Mass affluent wanting wealth management',
    'SMEs needing integrated business banking'
  ],
  howToWin: 'Fastest, most intuitive banking experience in Genai',
  capabilities: [
    'AI-powered personalization',
    'Real-time fraud detection',
    'Instant account provisioning',
    'Open banking APIs'
  ],
  timeframe: '2024-2027'
})
export class DigitalFirstStrategy {}
```

**Checklist**:
- [ ] Defined where to play (specific markets/segments)
- [ ] Defined how to win (competitive advantage)
- [ ] Listed required capabilities
- [ ] Set timeframe

### Step 2: Define Success Metrics

**Question**: HOW will we measure success?

**Output**: `@Metric` classes for strategy, initiatives, and journeys

```typescript
// src/model/metrics.ts
import { Metric } from 'aabha';

// Strategy-level metrics
@Metric({
  name: 'Digital Adoption Rate',
  description: 'Percentage of customers using digital channels',
  target: 75,
  unit: '%'
})
export class DigitalAdoptionMetric {}

@Metric({
  name: 'Net Promoter Score',
  target: 65,
  unit: 'points'
})
export class NPSMetric {}

// Initiative-level metrics
@Metric({
  name: 'Account Opening Time',
  target: 5,
  unit: 'minutes'
})
export class AccountOpeningTimeMetric {}
```

**Checklist**:
- [ ] Defined strategy-level metrics
- [ ] Defined initiative-level metrics
- [ ] Set specific targets for each metric
- [ ] Defined measurement methods

### Step 3: Define Initiatives (with Empty Journeys)

**Question**: WHAT are we building to execute the strategy?

**Output**: `@BusinessInitiative` classes with `journeys: []`

```typescript
// src/model/initiatives.ts
import { BusinessInitiative } from 'aabha';
import { DigitalFirstStrategy } from './strategy';
import { AccountOpeningTimeMetric, DigitalAdoptionMetric } from './metrics';

@BusinessInitiative({
  name: 'Instant Account Opening',
  description: 'Enable customers to open accounts instantly via mobile',
  strategy: DigitalFirstStrategy,  // Links to strategy
  objectives: [
    'Reduce opening time from 5 days to 5 minutes',
    'Achieve 80% digital adoption for new accounts',
    'Acquire 50K new customers in Q1 2025'
  ],
  journeys: [],  // EMPTY - we'll add journeys later!
  metrics: [AccountOpeningTimeMetric, DigitalAdoptionMetric],
  targetAudience: ['Young adults 21-26', 'Digital natives']
})
export class InstantAccountOpeningInitiative {}
```

**Key Point**: Journeys array is EMPTY because we haven't designed them yet!

**Checklist**:
- [ ] Each initiative links to a strategy
- [ ] Objectives are specific and measurable
- [ ] Metrics defined
- [ ] Journeys array is empty

### Step 4: Define ALL Contexts (Perspectives)

**Question**: What are ALL the perspectives through which we view this product?

**Output**: `@Context` classes for every domain/perspective

```typescript
// src/model/contexts.ts
import { Context } from 'aabha';

// Customer-facing contexts
@Context({
  name: 'Sales & Marketing',
  description: 'Customer acquisition and conversion',
  goals: ['High conversion', 'Low CAC', 'Brand awareness']
})
export class SalesContext {}

@Context({
  name: 'Customer Onboarding',
  description: 'How customers get started',
  goals: ['Fast activation', 'High completion rate', 'Great first impression']
})
export class OnboardingContext {}

@Context({
  name: 'Daily Operations',
  description: 'Day-to-day product usage',
  goals: ['High engagement', 'Feature adoption', 'Satisfaction']
})
export class OperationsContext {}

@Context({
  name: 'Customer Support',
  description: 'How customers get help',
  goals: ['Quick resolution', 'Self-service', 'Satisfaction']
})
export class SupportContext {}

// Internal contexts
@Context({
  name: 'Compliance & KYC',
  description: 'Regulatory requirements and KYC',
  goals: ['100% compliance', 'Audit readiness', 'Risk mitigation']
})
export class ComplianceContext {}

@Context({
  name: 'Risk Management',
  description: 'Fraud prevention and risk assessment',
  goals: ['Fraud detection', 'Risk scoring', 'Loss prevention']
})
export class RiskContext {}

@Context({
  name: 'Security',
  description: 'Data protection and access control',
  goals: ['Data security', 'Access control', 'Threat prevention']
})
export class SecurityContext {}

@Context({
  name: 'Audit',
  description: 'Tracking and verification',
  goals: ['Complete audit trail', 'Transparency', 'Accountability']
})
export class AuditContext {}
```

**Critical**: Identify EVERY perspective - don't miss any context!

**Common Context Categories**:
- **Customer-facing**: Sales, Onboarding, Operations, Support, Billing
- **Internal**: Compliance, Risk, Security, Audit, Operations
- **External**: Regulatory, Partner Integration, Developer/API

**Checklist**:
- [ ] All customer-facing contexts defined
- [ ] All internal contexts defined
- [ ] All external contexts defined
- [ ] Each context has clear goals

### Step 5: Define Personas (WHO People Are)

**Question**: WHO are all the people involved (characteristics only)?

**Output**: `@Persona` classes (human, system, organization)

```typescript
// src/model/personas.ts
import { Persona } from 'aabha';

// Customer personas
@Persona({
  name: 'Zara Ahmed',
  age: '21',
  occupation: 'University Student',
  description: 'Tech-savvy digital native',
  goals: [
    'Open account without paperwork',
    'Manage money from phone',
    'Get instant access to funds'
  ],
  painPoints: [
    'Traditional banks too slow',
    'Complex processes',
    'Branch visits inconvenient'
  ]
})
export class ZaraPersona {}

// Employee personas
@Persona({
  name: 'Dr. Kenji Yamamoto',
  age: '55',
  occupation: 'Chief Compliance Officer',
  description: 'Ensures regulatory compliance',
  goals: [
    'Meet all regulatory requirements',
    'Maintain complete audit trail',
    'Prevent financial crime'
  ]
})
export class ComplianceOfficerPersona {}

@Persona({
  name: 'Amara Williams',
  age: '39',
  occupation: 'Chief Information Security Officer',
  description: 'Protects customer data and systems',
  goals: [
    'Prevent data breaches',
    'Ensure access control',
    'Build security culture'
  ]
})
export class SecurityOfficerPersona {}

// System personas
@Persona({
  name: 'KYC Verification AI',
  personaType: 'system',
  description: 'AI system that verifies customer identity',
  goals: [
    'Accurate identity verification',
    'Fast processing',
    'Fraud detection'
  ]
})
export class KYCSystemPersona {}
```

**Note**: Personas are NOT yet tied to contexts!

**Checklist**:
- [ ] All customer personas defined
- [ ] All employee personas defined
- [ ] System personas defined (if applicable)
- [ ] Organization personas defined (if applicable)

### Step 6: Define Stakeholders (Persona × Context)

**Question**: What are ALL the Persona × Context combinations?

**Output**: `@Stakeholder` classes

```typescript
// src/model/stakeholders.ts
import { Stakeholder } from 'aabha';
import { ZaraPersona, ComplianceOfficerPersona, SecurityOfficerPersona } from './personas';
import { OnboardingContext, ComplianceContext, SecurityContext, SupportContext } from './contexts';

// Zara in different contexts = different stakeholders!

@Stakeholder({
  role: 'Mobile Banking Customer',
  persona: ZaraPersona,
  context: OnboardingContext
})
export class ZaraOnboardingStakeholder {}
// Expectation: Fast, easy, mobile-first experience

@Stakeholder({
  role: 'KYC Subject',
  persona: ZaraPersona,  // SAME PERSON
  context: ComplianceContext  // DIFFERENT CONTEXT
})
export class ZaraComplianceStakeholder {}
// Expectation: Privacy, security, transparent process

@Stakeholder({
  role: 'Customer Seeking Support',
  persona: ZaraPersona,  // SAME PERSON
  context: SupportContext  // DIFFERENT CONTEXT
})
export class ZaraSupportStakeholder {}
// Expectation: Quick help, empathy, resolution

// Internal stakeholders
@Stakeholder({
  role: 'Compliance Validator',
  persona: ComplianceOfficerPersona,
  context: ComplianceContext
})
export class ComplianceValidatorStakeholder {}
// Expectation: Complete documentation, audit trail

@Stakeholder({
  role: 'Security Auditor',
  persona: SecurityOfficerPersona,
  context: SecurityContext
})
export class SecurityAuditorStakeholder {}
// Expectation: Data protection, access control
```

**Key Insight**: Same persona appears in multiple contexts with different roles!

**Checklist**:
- [ ] Created stakeholder for each relevant Persona × Context combination
- [ ] Documented expectations for each stakeholder (as comments for now)
- [ ] Identified all customer stakeholders
- [ ] Identified all internal stakeholders

### Step 7: Define Journeys (with Empty Milestones)

**Question**: What are the user/stakeholder experience flows?

**Output**: `@Journey` classes with `milestones: []`

```typescript
// src/model/journeys.ts
import { Journey } from 'aabha';
import { ZaraOnboardingStakeholder } from './stakeholders';

@Journey({
  name: 'Instant Account Opening Journey',
  description: 'Customer opens account via mobile app in under 5 minutes',
  primaryStakeholder: ZaraOnboardingStakeholder,
  secondaryStakeholders: [],  // Can add compliance, risk stakeholders
  milestones: []  // EMPTY - we'll add milestones next!
})
export class InstantAccountOpeningJourney {}
```

**Checklist**:
- [ ] Primary stakeholder identified
- [ ] Secondary stakeholders identified (if any)
- [ ] Milestones array is empty

### Step 8: Link Journeys to Initiatives

**Question**: Which journeys implement which initiatives?

**Output**: Update initiatives with journey references

```typescript
// src/model/initiatives.ts - UPDATE
import { InstantAccountOpeningJourney } from './journeys';

@BusinessInitiative({
  name: 'Instant Account Opening',
  // ... other properties ...
  journeys: [InstantAccountOpeningJourney],  // NOW FILLED!
})
export class InstantAccountOpeningInitiative {}
```

**Checklist**:
- [ ] All relevant journeys added to initiative
- [ ] Each journey serves the initiative's objectives

### Step 9: Define Milestones

**Question**: What are the significant achievements in each journey?

**Output**: `@Milestone` classes

```typescript
// src/model/milestones.ts
import { Milestone } from 'aabha';
import { ZaraComplianceStakeholder, ZaraOnboardingStakeholder } from './stakeholders';

@Milestone({
  name: 'Identity Verified',
  description: 'Customer identity confirmed via AI KYC',
  stakeholder: ZaraComplianceStakeholder,  // Note: Compliance context!
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
  stakeholder: ZaraOnboardingStakeholder,  // Onboarding context
  successCriteria: [
    'Account number assigned',
    'Virtual debit card issued',
    'Mobile banking enabled',
    'Welcome email sent'
  ]
})
export class AccountActivatedMilestone {}
```

**Checklist**:
- [ ] Each milestone has clear success criteria
- [ ] Stakeholder is specified (may be different from journey's primary stakeholder!)
- [ ] Milestones are business-significant (not just technical steps)

### Step 10: Link Milestones to Journeys

**Question**: In what order do milestones occur?

**Output**: Update journeys with milestone references

```typescript
// src/model/journeys.ts - UPDATE
import { IdentityVerifiedMilestone, AccountActivatedMilestone } from './milestones';

@Journey({
  name: 'Instant Account Opening Journey',
  // ... other properties ...
  milestones: [
    { milestone: IdentityVerifiedMilestone, order: 1 },
    { milestone: AccountActivatedMilestone, order: 2 }
  ]  // NOW FILLED!
})
export class InstantAccountOpeningJourney {}
```

**Checklist**:
- [ ] Milestones added in logical order
- [ ] Order numbers are sequential
- [ ] All key achievements represented

### Step 11: Define Steps (Optional but Recommended)

**Question**: What are the granular actions within each milestone?

**Output**: `@Step` classes

```typescript
// src/model/steps.ts
import { Step } from 'aabha';
import { ZaraOnboardingStakeholder } from './stakeholders';

@Step({
  name: 'Upload Government ID',
  description: 'User uploads photo of government-issued ID',
  actor: ZaraOnboardingStakeholder,
  trigger: 'User taps "Verify Identity" button',
  outcome: 'ID image captured and uploaded'
})
export class UploadIDStep {}

@Step({
  name: 'Capture Selfie',
  description: 'User takes selfie for face matching',
  actor: ZaraOnboardingStakeholder,
  trigger: 'ID upload successful',
  outcome: 'Selfie captured and matched against ID'
})
export class CaptureSelfieStep {}
```

Then link steps to milestones in milestone definition.

### Step 12: Define Expectations

**Question**: What does each stakeholder expect in their context?

**Output**: `@Expectation` classes

```typescript
// src/model/expectations.ts
import { Expectation } from 'aabha';
import { ZaraOnboardingStakeholder, ComplianceValidatorStakeholder } from './stakeholders';

// Customer expectations (Onboarding context)
@Expectation({
  description: 'Account opening completes in under 5 minutes',
  stakeholder: ZaraOnboardingStakeholder,
  priority: 'critical',
  rationale: 'Speed is key differentiator for young adults'
})
export class FastOnboardingExpectation {}

@Expectation({
  description: 'No branch visit required',
  stakeholder: ZaraOnboardingStakeholder,
  priority: 'critical',
  rationale: 'Target users never visit branches'
})
export class DigitalOnlyExpectation {}

// Compliance expectations (Compliance context)
@Expectation({
  description: 'Complete KYC documentation captured and stored',
  stakeholder: ComplianceValidatorStakeholder,
  priority: 'critical',
  rationale: 'Regulatory requirement'
})
export class CompleteKYCExpectation {}

@Expectation({
  description: 'Full audit trail of verification process',
  stakeholder: ComplianceValidatorStakeholder,
  priority: 'critical',
  rationale: 'Required for regulatory audits'
})
export class AuditTrailExpectation {}
```

**Key Point**: Different stakeholders have different expectations for the same feature!

### Step 13: Define Behaviors

**Question**: HOW does the system behave to meet expectations?

**Output**: `@Behavior` classes

```typescript
// src/model/behaviors.ts
import { Behavior } from 'aabha';
import { FastOnboardingExpectation, CompleteKYCExpectation } from './expectations';

@Behavior({
  description: 'AI KYC system processes ID in under 10 seconds',
  satisfies: [FastOnboardingExpectation, CompleteKYCExpectation],
  triggers: ['ID image uploaded'],
  actions: [
    'Extract data from ID using OCR',
    'Validate ID authenticity',
    'Perform face match',
    'Run liveness detection',
    'Execute AML screening'
  ],
  postconditions: ['Identity verified', 'KYC data stored', 'Audit log created']
})
export class AIKYCVerificationBehavior {}
```

### Step 14: Define Tests

**Question**: How do we verify the behaviors?

**Output**: `@Test` classes

```typescript
// src/model/tests.ts
import { Test } from 'aabha';
import { AIKYCVerificationBehavior } from './behaviors';

@Test({
  name: 'AI KYC completes in under 10 seconds',
  behavior: AIKYCVerificationBehavior,
  scenario: 'User uploads valid government ID',
  given: ['User has valid government ID', 'Camera access granted'],
  when: ['User uploads ID photo'],
  then: ['ID verified in < 10 seconds', 'Success message shown']
})
export class FastKYCTest {}
```

### Step 15: Define Witnesses (Optional)

**Question**: Who observes and audits these behaviors?

**Output**: `@Witness` classes

```typescript
// src/model/witnesses.ts
import { Witness } from 'aabha';
import { AuditContext } from './contexts';

@Witness({
  name: 'KYC Audit Logger',
  context: AuditContext,
  observes: ['All KYC verification events'],
  records: ['Timestamp', 'User ID', 'Verification result', 'Data captured']
})
export class KYCAuditWitness {}
```

## Verification Checklist

After completing all steps, verify:

- [ ] **Strategy defined** - Clear where to play and how to win
- [ ] **Metrics defined** - Know how to measure success
- [ ] **All contexts identified** - Every perspective covered
- [ ] **All personas defined** - All people types identified
- [ ] **All stakeholders mapped** - Persona × Context combinations
- [ ] **Initiatives link to strategy** - Clear strategic alignment
- [ ] **Journeys link to initiatives** - Implementation path clear
- [ ] **Milestones link to journeys** - Key achievements identified
- [ ] **Expectations per context** - Different stakeholders, different needs
- [ ] **Product compiles** - TypeScript validates all relationships
- [ ] **Product completeness** - All stakeholder expectations addressable

## Common Mistakes to Avoid

### ❌ Mistake 1: Starting with Features

```typescript
// Wrong: Jumping straight to journey
@Journey({ name: 'User signs up'... })  // But for what strategy?
```

### ❌ Mistake 2: Missing Contexts

```typescript
// Wrong: Only thinking about customer context
@Context({ name: 'Customer Experience' })
// Missing: Compliance, Risk, Security, Support, etc.
```

### ❌ Mistake 3: Not Using Progressive Disclosure

```typescript
// Wrong: Trying to define everything at once
@BusinessInitiative({
  journeys: [
    @Journey({  // Can't nest decorators!
      milestones: [...]
    })
  ]
})
```

### ❌ Mistake 4: Confusing Persona and Stakeholder

```typescript
// Wrong: Persona includes context
@Persona({
  name: 'Mobile Banking Customer'  // This is a role, not a persona!
})

// Right: Persona is characteristics only
@Persona({ name: 'Zara Ahmed', age: '21'... })
@Stakeholder({ role: 'Mobile Banking Customer', persona: ZaraPersona, context: OnboardingContext })
```

## Summary

**The Strategic Build Order**:

1. **Strategy** - Foundation (WHERE, HOW)
2. **Metrics** - Success criteria
3. **Initiatives** - What we're building (empty journeys)
4. **Contexts** - All perspectives
5. **Personas** - Who people are
6. **Stakeholders** - Persona × Context
7. **Journeys** - User experiences (empty milestones)
8. **Link** journeys to initiatives
9. **Milestones** - Key achievements
10. **Link** milestones to journeys
11. **Steps** - Granular actions
12. **Expectations** - Per stakeholder per context
13. **Behaviors** - How system responds
14. **Tests** - Verification
15. **Witnesses** - Observers

**Remember**: Build structure first, add details later. Empty arrays are your friend!

## See Also

- [Quick Start](../getting-started/quick-start.md) - Follow this order hands-on
- [Core Concepts](../getting-started/core-concepts.md) - Understand the principles
- [Understanding Contexts](../guides/understanding-contexts.md) - Master contexts
- [Product Completeness](../guides/product-completeness.md) - Ensure nothing is missed

---

[← Back to Best Practices](./README.md) | [Documentation Home](../README.md)
