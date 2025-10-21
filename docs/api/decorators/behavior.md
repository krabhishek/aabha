# @Behavior

> **📝 Documentation In Progress** - Contributions welcome!

## Overview

Define HOW the system behaves to meet expectations.

## Import

```typescript
import { Behavior } from 'aabha';
```

## Example

```typescript
@Behavior({
  description: 'AI KYC processes ID in under 10 seconds',
  satisfies: [FastOnboardingExpectation, CompleteKYCExpectation],
  triggers: ['ID image uploaded'],
  actions: ['Extract OCR data', 'Validate ID', 'Face match', 'AML screen'],
  postconditions: ['Identity verified', 'KYC data stored']
})
export class AIKYCBehavior {}
```

**Contribute**: [github.com/krabhishek/aabha](https://github.com/krabhishek/aabha)

---

[← @Expectation](./expectation.md) | [API Reference](../README.md) | [Next: @Test →](./test.md)
