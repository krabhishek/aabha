# @Step

> **📝 Documentation In Progress** - Contributions welcome!

## Overview

Define granular actions within milestones.

## Import

```typescript
import { Step } from 'aabha';
```

## Example

```typescript
@Step({
  name: 'Upload Government ID',
  actor: MobileCustomerStakeholder,
  trigger: 'User taps Verify Identity button',
  outcome: 'ID image captured and uploaded'
})
export class UploadIDStep {}
```

**Contribute**: [github.com/krabhishek/aabha](https://github.com/krabhishek/aabha)

---

[← @Milestone](./milestone.md) | [API Reference](../README.md) | [Next: @Expectation →](./expectation.md)
