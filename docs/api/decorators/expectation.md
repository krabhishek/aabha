# @Expectation

> **📝 Documentation In Progress** - Contributions welcome!

## Overview

Define what stakeholders expect in their context.

**Key**: Different stakeholders have different expectations for the same feature!

## Import

```typescript
import { Expectation } from 'aabha';
```

## Example

```typescript
@Expectation({
  description: 'Account opening completes in under 5 minutes',
  stakeholder: MobileCustomerStakeholder,  // Customer context
  priority: 'critical',
  rationale: 'Speed is key differentiator'
})
export class FastOnboardingExpectation {}

@Expectation({
  description: 'Complete KYC documentation captured',
  stakeholder: ComplianceValidatorStakeholder,  // Compliance context
  priority: 'critical',
  rationale: 'Regulatory requirement'
})
export class CompleteKYCExpectation {}
```

**Contribute**: [github.com/krabhishek/aabha](https://github.com/krabhishek/aabha)

---

[← @Step](./step.md) | [API Reference](../README.md) | [Next: @Behavior →](./behavior.md)
