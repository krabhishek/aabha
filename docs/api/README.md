# API Reference

Complete reference documentation for all Aabha decorators, types, and enums.

## Decorators

### Strategic Level

Define high-level strategy and initiatives:

- **[@Strategy](./decorators/strategy.md)** - Define business strategy (where to play, how to win)
- **[@BusinessInitiative](./decorators/business-initiative.md)** - Define concrete initiatives implementing strategy
- **[@Metric](./decorators/metric.md)** - Define measurable outcomes (attachable to any level)

### Context and Stakeholders

Define who and where:

- **[@Persona](./decorators/persona.md)** - Define user archetypes (human, system, organization)
- **[@Context](./decorators/context.md)** - Define business perspectives (Sales, Marketing, Compliance)
- **[@Stakeholder](./decorators/stakeholder.md)** - Define context-specific roles (Persona + Context)

### Journey Level

Map user experiences:

- **[@Journey](./decorators/journey.md)** - Define user/stakeholder experience flows
- **[@Milestone](./decorators/milestone.md)** - Define business-significant achievements
- **[@Step](./decorators/step.md)** - Define granular actions within milestones

### Expectation Level

Define requirements and behaviors:

- **[@Expectation](./decorators/expectation.md)** - Define stakeholder expectations
- **[@Behavior](./decorators/behavior.md)** - Define executable behaviors
- **[@Test](./decorators/test.md)** - Define verification tests
- **[@Attribute](./decorators/attribute.md)** - Define reusable attributes

### Observability

Track and audit:

- **[@Witness](./decorators/witness.md)** - Define observers and auditors

## Types

- **[Type Utilities](./types.md)** - TypeScript type utilities and helpers

## Enums

- **[Enums Reference](./enums.md)** - Enum values for decorator options

## Quick Reference

### Hierarchy

```
@Strategy
  ↓
@BusinessInitiative
  ↓
@Journey
  ↓
@Milestone
  ↓
@Step
  ↓
@Expectation
  ↓
@Behavior
  ↓
@Test
```

### Cross-Cutting

These can be attached at any level:

- `@Metric` - Measure success
- `@Persona` - Define users
- `@Stakeholder` - Define roles
- `@Context` - Define perspectives
- `@Witness` - Observe and audit
- `@Attribute` - Add metadata

## By Use Case

**I want to...**

- **Define a product strategy** → [@Strategy](./decorators/strategy.md)
- **Create an initiative** → [@BusinessInitiative](./decorators/business-initiative.md)
- **Map a user journey** → [@Journey](./decorators/journey.md)
- **Define a user type** → [@Persona](./decorators/persona.md)
- **Create a stakeholder** → [@Stakeholder](./decorators/stakeholder.md)
- **Track a metric** → [@Metric](./decorators/metric.md)
- **Add expectations** → [@Expectation](./decorators/expectation.md)
- **Define behaviors** → [@Behavior](./decorators/behavior.md)
- **Create tests** → [@Test](./decorators/test.md)

---

[← Back to Documentation](../README.md)
