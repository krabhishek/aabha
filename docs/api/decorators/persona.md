# @Persona

> **📝 Documentation In Progress**
>
> Contributions welcome!

## Overview

The `@Persona` decorator defines **WHO people are** (characteristics, goals, pain points). Personas are archetypes that can be human, system, or organization.

**Key Insight**: Persona = WHO (not WHERE). Combined with Context (WHERE), they form Stakeholders (roles).

## Import

```typescript
import { Persona } from 'aabha';
```

## Basic Example

```typescript
@Persona({
  name: 'Zara Ahmed',
  age: '21',
  occupation: 'University Student',
  description: 'Tech-savvy digital native',
  goals: ['Open account without paperwork', 'Manage money from phone'],
  painPoints: ['Traditional banks too slow', 'Complex processes']
})
export class ZaraPersona {}
```

## Persona Types

- **Human** - Customers, employees, partners
- **System** - AI systems, APIs, automated processes
- **Organization** - Regulatory bodies, partner companies

## Formula

```
Stakeholder = Persona × Context
```

Same persona in different contexts = different stakeholders with different expectations!

## See Also

- [@Stakeholder](./stakeholder.md) - Persona × Context
- [@Context](./context.md)
- [Defining Stakeholders and Personas Guide](../../guides/defining-stakeholders-and-personas.md) _(coming soon)_

## Full Documentation Coming Soon

**Contribute**: [github.com/krabhishek/aabha](https://github.com/krabhishek/aabha)

---

[← Back: @Context](./context.md) | [API Reference](../README.md) | [Next: @Stakeholder →](./stakeholder.md)
