# @Context

> **📝 Documentation In Progress**
>
> This decorator documentation is being developed. Contributions welcome!

## Overview

The `@Context` decorator defines a **perspective or domain** through which you view your product. Context is one of the most powerful concepts in Aabha.

**Key Insight**: Context represents the lens (Sales, Onboarding, Compliance, Risk, Support, etc.) through which different stakeholders view the same product.

## Import

```typescript
import { Context } from 'aabha';
```

## Basic Example

```typescript
@Context({
  name: 'Customer Onboarding',
  description: 'How customers get started with the product',
  goals: ['Fast activation', 'High completion rate', 'Great first impression']
})
export class OnboardingContext {}
```

## Common Context Types

**Customer-Facing**: Sales, Onboarding, Daily Operations, Support, Billing

**Internal**: Compliance, Risk, Security, Audit, Operations

**External**: Regulatory, Partner Integration, Developer/API

## See Also

- [Understanding Contexts Guide](../../guides/understanding-contexts.md) _(in progress)_
- [Core Concepts - Context = Perspective](../../getting-started/core-concepts.md#2-context--perspective)
- [@Stakeholder](./stakeholder.md) - Persona × Context

## Full Documentation Coming Soon

This API reference will include:
- Complete parameter reference
- OgPgy Bank examples for all 8+ contexts
- Common patterns
- Validation rules
- Best practices

**Contribute**: [github.com/krabhishek/aabha](https://github.com/krabhishek/aabha)

---

[← Back to API Reference](../README.md) | [Next: @Persona →](./persona.md)
