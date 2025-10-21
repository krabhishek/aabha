# @BusinessInitiative

> **📝 Documentation In Progress** - Contributions welcome!

## Overview

Define concrete initiatives that implement your strategy. Initiatives contain journeys and link to metrics.

## Import

```typescript
import { BusinessInitiative } from 'aabha';
```

## Example

```typescript
@BusinessInitiative({
  name: 'Instant Account Opening',
  strategy: DigitalFirstStrategy,
  objectives: ['Reduce opening time to 5 minutes', 'Achieve 80% digital adoption'],
  journeys: [],  // Start empty, fill later
  metrics: [AccountOpeningTimeMetric, DigitalAdoptionMetric]
})
export class InstantAccountOpeningInitiative {}
```

## Key Pattern

Start with `journeys: []` (empty), add them after defining the journeys!

## See Also

- [@Strategy](./strategy.md)
- [@Journey](./journey.md)
- [Strategic Build Order - Step 3](../../best-practices/strategic-build-order.md#step-3-define-initiatives-with-empty-journeys)

**Contribute**: [github.com/krabhishek/aabha](https://github.com/krabhishek/aabha)

---

[← @Metric](./metric.md) | [API Reference](../README.md) | [Next: @Journey →](./journey.md)
