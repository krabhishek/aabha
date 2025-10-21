# @Stakeholder

> **📝 Documentation In Progress**
>
> Contributions welcome!

## Overview

The `@Stakeholder` decorator defines a **role** by combining WHO (Persona) with WHERE (Context).

## The Formula

```
Stakeholder = Persona × Context
```

**This is the key insight of Aabha!**

## Import

```typescript
import { Stakeholder } from 'aabha';
```

## Basic Example

```typescript
// WHO: Zara is a person
@Persona({ name: 'Zara Ahmed', age: '21' })
class ZaraPersona {}

// WHERE: Onboarding is a context
@Context({ name: 'Customer Onboarding' })
class OnboardingContext {}

// WHAT: Zara in Onboarding context = Mobile Customer stakeholder
@Stakeholder({
  role: 'Mobile Banking Customer',
  persona: ZaraPersona,  // WHO
  context: OnboardingContext  // WHERE
})
class MobileCustomerStakeholder {}
```

## Same Persona, Different Contexts

```typescript
// Zara in Onboarding context
@Stakeholder({
  role: 'Mobile Customer',
  persona: ZaraPersona,
  context: OnboardingContext
})
class ZaraOnboarding {}
// Expectation: Fast, easy, mobile-first

// Zara in Compliance context - SAME PERSON, DIFFERENT EXPECTATIONS!
@Stakeholder({
  role: 'KYC Subject',
  persona: ZaraPersona,  // Same person!
  context: ComplianceContext  // Different context!
})
class ZaraCompliance {}
// Expectation: Privacy, security, transparency
```

## See Also

- [@Persona](./persona.md) - WHO
- [@Context](./context.md) - WHERE
- [Core Concepts - Stakeholder Formula](../../getting-started/core-concepts.md#3-stakeholder--persona--context)

## Full Documentation Coming Soon

**Contribute**: [github.com/krabhishek/aabha](https://github.com/krabhishek/aabha)

---

[← Back: @Persona](./persona.md) | [API Reference](../README.md) | [Next: @Metric →](./metric.md)
