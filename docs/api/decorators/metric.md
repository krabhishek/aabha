# @Metric

> **📝 Documentation In Progress** - Contributions welcome!

## Overview

Define measurable outcomes at any level (Strategy, Initiative, Journey, etc.).

## Import

```typescript
import { Metric } from 'aabha';
```

## Example

```typescript
@Metric({
  name: 'Account Opening Time',
  target: 5,
  unit: 'minutes',
  measurement: 'Average time to complete onboarding'
})
export class AccountOpeningTimeMetric {}
```

## See Also

- [Working with Metrics Guide](../../guides/working-with-metrics.md) _(coming soon)_
- [@Strategy](./strategy.md) - Already documented

**Contribute**: [github.com/krabhishek/aabha](https://github.com/krabhishek/aabha)

---

[← @Stakeholder](./stakeholder.md) | [API Reference](../README.md) | [Next: @BusinessInitiative →](./business-initiative.md)
