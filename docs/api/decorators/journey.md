# @Journey

> **📝 Documentation In Progress** - Contributions welcome!

## Overview

Map user/stakeholder experience flows. Journeys contain milestones.

## Import

```typescript
import { Journey } from 'aabha';
```

## Example

```typescript
@Journey({
  name: 'Instant Account Opening Journey',
  primaryStakeholder: MobileCustomerStakeholder,
  milestones: []  // Start empty, fill later
})
export class InstantAccountOpeningJourney {}
```

## See Also

- [Mapping User Journeys Guide](../../guides/mapping-user-journeys.md) _(coming soon)_
- [@Milestone](./milestone.md)
- [Strategic Build Order - Step 7](../../best-practices/strategic-build-order.md#step-7-define-journeys-with-empty-milestones)

**Contribute**: [github.com/krabhishek/aabha](https://github.com/krabhishek/aabha)

---

[← @BusinessInitiative](./business-initiative.md) | [API Reference](../README.md) | [Next: @Milestone →](./milestone.md)
