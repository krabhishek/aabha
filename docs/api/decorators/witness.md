# @Witness

> **📝 Documentation In Progress** - Contributions welcome!

## Overview

Define observers and auditors who track behaviors and events.

## Import

```typescript
import { Witness } from 'aabha';
```

## Example

```typescript
@Witness({
  name: 'KYC Audit Logger',
  context: AuditContext,
  observes: ['All KYC verification events'],
  records: ['Timestamp', 'User ID', 'Result', 'Data captured']
})
export class KYCAuditWitness {}
```

**Contribute**: [github.com/krabhishek/aabha](https://github.com/krabhishek/aabha)

---

[← @Attribute](./attribute.md) | [API Reference](../README.md)
