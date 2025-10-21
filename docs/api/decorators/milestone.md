# @Milestone

> **📝 Documentation In Progress** - Contributions welcome!

## Overview

Define business-significant achievements in a journey.

## Import

```typescript
import { Milestone } from 'aabha';
```

## Example

```typescript
@Milestone({
  name: 'Identity Verified',
  stakeholder: KYCSubjectStakeholder,
  successCriteria: ['ID validated', 'Face match successful', 'AML screening passed']
})
export class IdentityVerifiedMilestone {}
```

**Contribute**: [github.com/krabhishek/aabha](https://github.com/krabhishek/aabha)

---

[← @Journey](./journey.md) | [API Reference](../README.md) | [Next: @Step →](./step.md)
