# @Strategy

Define high-level business strategy - **WHERE to play** and **HOW to win**.

## Overview

The `@Strategy` decorator represents your organization's strategic choices. It answers two fundamental questions:

1. **Where to Play**: Which markets, segments, or spaces will you compete in?
2. **How to Win**: What capabilities or approaches give you competitive advantage?

## Import

```typescript
import { Strategy } from 'aabha';
```

## Syntax

```typescript
@Strategy(options: StrategyOptions)
class YourStrategyClass {}
```

## Parameters

### StrategyOptions

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | ✅ Yes | Strategy name |
| `description` | `string` | No | Detailed description of the strategy |
| `whereToPlay` | `string[]` | ✅ Yes | Markets, segments, or spaces to compete in |
| `howToWin` | `string` | ✅ Yes | Competitive advantage or winning approach |
| `capabilities` | `string[]` | No | Required capabilities to execute strategy |
| `metrics` | `MetricClass[]` | No | Metrics to measure strategy success |
| `timeframe` | `string` | No | Strategy timeframe (e.g., "2025-2027") |

## Type Signature

```typescript
function Strategy(options: {
  name: string;
  description?: string;
  whereToPlay: string[];
  howToWin: string;
  capabilities?: string[];
  metrics?: Constructor<any>[];
  timeframe?: string;
}): ClassDecorator;
```

## Examples

### Example 1: OgPgy Bank Digital Transformation

From OgPgy Bank's digital transformation initiative:

```typescript
import { Strategy, Metric } from 'aabha';

// Define success metrics
@Metric({
  name: 'Digital Adoption Rate',
  description: 'Percentage of customers using digital channels',
  target: 75,
  unit: '%'
})
class DigitalAdoptionMetric {}

@Metric({
  name: 'Net Promoter Score',
  target: 65,
  unit: 'points'
})
class NPSMetric {}

@Metric({
  name: 'Cost-to-Income Ratio',
  description: 'Operational efficiency metric',
  target: 45,
  unit: '%'
})
class CostToIncomeMetric {}

// Define the strategy
@Strategy({
  name: 'Digital-First Banking Strategy 2025',
  description: `Transform OgPgyBank from a branch-centric legacy bank into
                Genai's most loved digital-first banking powerhouse`,
  whereToPlay: [
    'Young adults (21-35) seeking mobile-first banking',
    'Mass affluent customers wanting wealth management',
    'SMEs needing integrated business banking',
    'Digital natives who never visit branches'
  ],
  howToWin: `Fastest, most intuitive banking experience in Genai, powered by
             AI personalization and real-time insights`,
  capabilities: [
    'AI-powered personalization engine',
    'Real-time fraud detection',
    'Instant account provisioning',
    'Open banking APIs',
    'Cloud-native core banking platform'
  ],
  metrics: [DigitalAdoptionMetric, NPSMetric, CostToIncomeMetric],
  timeframe: '2024-2027'
})
export class DigitalFirstStrategy {}
```

**Context**: CEO Sarah Nakamura launched this strategy after losing 120K customers to neobanks in Q2 2022. The strategy guides all of OgPgy Bank's digital initiatives.

### Example 2: Market Expansion Strategy

```typescript
@Metric({
  name: 'Market Share',
  target: 30,
  unit: '%'
})
class MarketShareMetric {}

@Strategy({
  name: 'Genai Market Leadership 2025',
  whereToPlay: [
    'Retail banking in urban centers',
    'SME banking across all sectors',
    'Wealth management for mass affluent'
  ],
  howToWin: 'Best customer experience + comprehensive product suite',
  capabilities: [
    'Omnichannel banking',
    'Relationship management excellence',
    'Product innovation'
  ],
  metrics: [MarketShareMetric]
})
class MarketLeadershipStrategy {}
```

### Example 3: Operational Excellence Strategy

Used by COO Priya Sharma to drive efficiency:

```typescript
@Metric({
  name: 'Operational Cost Reduction',
  target: 15,
  unit: '%'
})
class CostReductionMetric {}

@Metric({
  name: 'Process Automation Rate',
  target: 80,
  unit: '%'
})
class AutomationMetric {}

@Strategy({
  name: 'Operational Excellence 2025',
  description: 'Drive efficiency through automation and process optimization',
  whereToPlay: [
    'Back-office operations',
    'Customer service processes',
    'Compliance workflows'
  ],
  howToWin: 'Automation-first approach with human oversight',
  capabilities: [
    'Robotic Process Automation (RPA)',
    'AI-powered document processing',
    'Real-time process monitoring'
  ],
  metrics: [CostReductionMetric, AutomationMetric],
  timeframe: '2025'
})
class OperationalExcellenceStrategy {}
```

## Validation Rules

### Compile-Time Checks

TypeScript enforces:

```typescript
// ✅ VALID: All required fields provided
@Strategy({
  name: 'Valid Strategy',
  whereToPlay: ['Market A'],
  howToWin: 'Best product'
})
class ValidStrategy {}

// ❌ ERROR: Missing required fields
@Strategy({
  name: 'Invalid Strategy'
  // ERROR: Missing whereToPlay and howToWin
})
class InvalidStrategy {}

// ❌ ERROR: Wrong type for metrics
@Strategy({
  name: 'Invalid Strategy',
  whereToPlay: ['Market A'],
  howToWin: 'Best product',
  metrics: [SomeJourneyClass]  // ERROR: Journey is not a Metric
})
class InvalidMetrics {}
```

## Common Patterns

### Pattern 1: Multiple Strategies

Organizations can have multiple strategies for different areas:

```typescript
@Strategy({ name: 'Growth Strategy', /* ... */ })
class GrowthStrategy {}

@Strategy({ name: 'Innovation Strategy', /* ... */ })
class InnovationStrategy {}

@Strategy({ name: 'Risk Strategy', /* ... */ })
class RiskStrategy {}

// Initiatives reference the appropriate strategy
@BusinessInitiative({
  name: 'New Market Entry',
  strategy: GrowthStrategy  // References growth
})
class MarketEntryInitiative {}
```

### Pattern 2: Strategy Evolution

Track strategy changes over time:

```typescript
@Strategy({
  name: 'Digital Strategy v1.0',
  timeframe: '2024'
  // Initial focus
})
class DigitalStrategyV1 {}

@Strategy({
  name: 'Digital Strategy v2.0',
  timeframe: '2025-2026'
  // Evolved focus
})
class DigitalStrategyV2 {}
```

### Pattern 3: Nested Capabilities

```typescript
@Strategy({
  name: 'Platform Strategy',
  whereToPlay: ['B2B SaaS', 'API Economy'],
  howToWin: 'Best developer experience',
  capabilities: [
    // Technical capabilities
    'GraphQL APIs',
    'SDK in 5 languages',
    'Real-time webhooks',
    // Business capabilities
    'Partner ecosystem',
    'Developer community',
    'Comprehensive documentation'
  ]
})
class PlatformStrategy {}
```

## Related Decorators

- **[@BusinessInitiative](./business-initiative.md)** - Implements this strategy
- **[@Metric](./metric.md)** - Measures strategy success
- **[@Journey](./journey.md)** - Executes strategy through user experiences

## Usage in Business Initiatives

Strategies are referenced by business initiatives:

```typescript
@Strategy({
  name: 'Customer Acquisition Strategy',
  whereToPlay: ['Young professionals'],
  howToWin: 'Fastest onboarding'
})
class AcquisitionStrategy {}

@BusinessInitiative({
  name: 'Instant Account Opening',
  strategy: AcquisitionStrategy,  // References the strategy
  objectives: ['Acquire 50K new customers'],
  // ...
})
class InstantAccountInitiative {}
```

## Best Practices

### ✅ Do

- **Be specific** about where to play (avoid "everyone everywhere")
- **Quantify** your how to win (use metrics)
- **Link metrics** to measure success
- **Update regularly** as strategy evolves
- **Keep it concise** (strategy should fit on one page)

### ❌ Don't

- **Don't** make it too generic ("be the best")
- **Don't** confuse strategy with tactics
- **Don't** omit metrics (how will you know if you're winning?)
- **Don't** create too many strategies (3-5 is usually enough)

### Example: Good vs. Bad

```typescript
// ❌ BAD: Too generic
@Strategy({
  name: 'Be the Best Bank',
  whereToPlay: ['Everyone'],
  howToWin: 'Best service'
})
class GenericStrategy {}

// ✅ GOOD: Specific and measurable
@Strategy({
  name: 'Youth Banking Leadership',
  whereToPlay: [
    'Ages 18-25 in urban areas',
    'University students',
    'Young professionals'
  ],
  howToWin: 'Mobile-first experience with gamified savings',
  capabilities: [
    'AI spending insights',
    'Social banking features',
    'Instant peer transfers'
  ],
  metrics: [YouthAcquisitionMetric, EngagementMetric]
})
class YouthStrategy {}
```

## TypeScript Tips

### Type Inference

```typescript
// TypeScript infers the strategy type
const strategy = DigitalFirstStrategy;

// Use it in initiative
@BusinessInitiative({
  strategy: strategy  // Type-safe!
})
class MyInitiative {}
```

### Const Assertions

```typescript
const MARKETS = ['Market A', 'Market B'] as const;

@Strategy({
  whereToPlay: [...MARKETS],  // Reusable constants
  // ...
})
class MyStrategy {}
```

## Real-World Examples

See complete examples in:

- [OgPgy Bank Digital Transformation](../../examples/ogpgy-bank/digital-transformation-strategy.md)
- [Market Leadership Strategy](../../examples/patterns/basic-strategy.md)

## FAQ

**Q: Can a Business Initiative reference multiple strategies?**

A: No, each initiative should align to one primary strategy. If you need multiple strategies, consider breaking the initiative into smaller, focused initiatives.

**Q: Should I create a new strategy for each year?**

A: Only if the strategy fundamentally changes. Strategies typically span 2-5 years. Use `timeframe` to track when strategies apply.

**Q: How detailed should capabilities be?**

A: List 5-10 critical capabilities required to execute the strategy. Don't list everything - focus on differentiators.

## See Also

- [Designing Product Strategy Guide](../../guides/designing-product-strategy.md)
- [@BusinessInitiative Decorator](./business-initiative.md)
- [@Metric Decorator](./metric.md)
- [Strategy Examples](../../examples/)

---

[← Back to API Reference](../README.md) | [Next: @BusinessInitiative →](./business-initiative.md)
