# @Test

> **📝 Documentation In Progress** - Contributions welcome!

## Overview

Define verification tests for behaviors.

## Import

```typescript
import { Test } from 'aabha';
```

## Example

```typescript
@Test({
  name: 'AI KYC completes in under 10 seconds',
  behavior: AIKYCBehavior,
  given: ['Valid government ID', 'Camera access granted'],
  when: ['User uploads ID photo'],
  then: ['ID verified < 10s', 'Success message shown']
})
export class FastKYCTest {}
```

**Contribute**: [github.com/krabhishek/aabha](https://github.com/krabhishek/aabha)

---

[← @Behavior](./behavior.md) | [API Reference](../README.md) | [Next: @Attribute →](./attribute.md)
