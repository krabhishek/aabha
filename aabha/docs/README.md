# Aabha Documentation

**Aabha** (Sanskrit: आभा, meaning "aura" or "radiance")

Welcome to the comprehensive documentation for Aabha - Product Management as Code. This documentation will help you master the art of defining product strategy, initiatives, and user journeys with TypeScript decorators.

## 📚 Documentation Sections

### 🚀 [Getting Started](./getting-started/)

New to Aabha? Start here!

- [Installation](./getting-started/installation.md) - Install and set up Aabha
- [Quick Start](./getting-started/quick-start.md) - Your first product model in 5 minutes
- [TypeScript Configuration](./getting-started/typescript-configuration.md) - Required TypeScript settings
- [Core Concepts](./getting-started/core-concepts.md) - Understand Aabha's mental model

### 📖 [API Reference](./api/)

Complete reference for all Aabha decorators, types, and enums.

**Core Decorators:**

*Strategy & Business:*
- [@Strategy](./api/decorators/strategy.md) - Define business strategy with goals, metrics, and governance
- [@BusinessInitiative](./api/decorators/business-initiative.md) - Define concrete initiatives with budget, timeline, and success metrics
- [@Context](./api/decorators/context.md) - Define business contexts (bounded contexts from DDD)

*Stakeholders & Users:*
- [@Stakeholder](./api/decorators/stakeholder.md) - Define context-specific roles and responsibilities
- [@Persona](./api/decorators/persona.md) - Define user/organization archetypes with psychology and behaviors

*User Experience:*
- [@Journey](./api/decorators/journey.md) - Map end-to-end user/stakeholder journeys with entry/exit points
- [@Expectation](./api/decorators/expectation.md) - Define provider/consumer expectations with SLOs

*Technical Contracts:*
- [@Interaction](./api/decorators/interaction.md) - Define technical data exchange contracts (API, UI, Database, Device, etc.)
- [@Collaboration](./api/decorators/collaboration.md) - Define multi-stakeholder human interactions (meetings, reviews, etc.)

*Implementation & Testing:*
- [@Behavior](./api/decorators/behavior.md) - Define executable behaviors with preconditions, postconditions, and complexity
- [@Witness](./api/decorators/witness.md) - Define BDD-style test witnesses with scenarios and fixtures

*Observability:*
- [@Metric](./api/decorators/metric.md) - Define measurable outcomes, KPIs, and targets

**Types & Enums:**
- [Types Reference](./api/types.md)
- [Enums Reference](./api/enums.md)

### 📘 [Guides](./guides/)

In-depth guides for working with Aabha:

- [Designing Product Strategy](./guides/designing-product-strategy.md)
- [Mapping User Journeys](./guides/mapping-user-journeys.md)
- [Defining Stakeholders and Personas](./guides/defining-stakeholders-and-personas.md)
- [Working with Metrics](./guides/working-with-metrics.md)
- [AI-Assisted Development](./guides/ai-assisted-development.md)
- [Type Safety Patterns](./guides/type-safety-patterns.md)
- [One-Way Hierarchy Principle](./guides/one-way-hierarchy-principle.md)

### ✨ [Best Practices](./best-practices/)

Learn the best ways to use Aabha:

- [Naming Conventions](./best-practices/naming-conventions.md)
- [Organizing Large Models](./best-practices/organizing-large-models.md)
- [File Structure](./best-practices/file-structure.md)
- [Reusability Patterns](./best-practices/reusability-patterns.md)
- [Testing Strategies](./best-practices/testing-strategies.md)
- [Version Control Workflows](./best-practices/version-control-workflows.md)

### 💡 [Examples](./examples/)

Real-world examples and patterns:

**OgPgy Bank Case Study:**
- [Overview](./examples/ogpgy-bank/README.md) - Digital transformation of a legacy bank
- [Digital Transformation Strategy](./examples/ogpgy-bank/digital-transformation-strategy.md)
- [Instant Account Opening](./examples/ogpgy-bank/instant-account-opening.md)
- [Mobile Onboarding Journey](./examples/ogpgy-bank/mobile-onboarding-journey.md)
- [Funds Transfer Journey](./examples/ogpgy-bank/funds-transfer-journey.md)
- [Compliance Workflow](./examples/ogpgy-bank/compliance-workflow.md)
- [Stakeholders and Personas](./examples/ogpgy-bank/stakeholders-and-personas.md)
- [Metrics and KPIs](./examples/ogpgy-bank/metrics-and-kpis.md)

**Common Patterns:**
- [Basic Strategy](./examples/patterns/basic-strategy.md)
- [Simple Journey](./examples/patterns/simple-journey.md)
- [Multi-Stakeholder Journey](./examples/patterns/multi-stakeholder-journey.md)
- [Metrics Tracking](./examples/patterns/metrics-tracking.md)

### 🔍 [Reference](./reference/)

Additional reference materials:

- [Architecture](./reference/architecture.md) - Deep dive into Aabha's design
- [Hierarchy Diagram](./reference/hierarchy-diagram.md) - Visual product hierarchy
- [Glossary](./reference/glossary.md) - Terms and definitions
- [FAQ](./reference/faq.md) - Frequently asked questions
- [Troubleshooting](./reference/troubleshooting.md) - Common issues and solutions

## 🎯 Quick Navigation by Task

**I want to...**

- **Get started quickly** → [Quick Start Guide](./getting-started/quick-start.md)
- **Learn core concepts** → [Core Concepts](./getting-started/core-concepts.md)
- **Define a strategy** → [@Strategy Decorator](./api/decorators/strategy.md)
- **Define a business context** → [@Context Decorator](./api/decorators/context.md)
- **Map a user journey** → [Mapping User Journeys Guide](./guides/mapping-user-journeys.md) + [@Journey Decorator](./api/decorators/journey.md)
- **Define stakeholders** → [@Stakeholder Decorator](./api/decorators/stakeholder.md)
- **Create user personas** → [@Persona Decorator](./api/decorators/persona.md)
- **Model API contracts** → [@Interaction Decorator](./api/decorators/interaction.md)
- **Model human interactions** → [@Collaboration Decorator](./api/decorators/collaboration.md)
- **Define expectations with SLOs** → [@Expectation Decorator](./api/decorators/expectation.md)
- **Implement behaviors** → [@Behavior Decorator](./api/decorators/behavior.md)
- **Write BDD tests** → [@Witness Decorator](./api/decorators/witness.md)
- **Track metrics** → [Working with Metrics Guide](./guides/working-with-metrics.md) + [@Metric Decorator](./api/decorators/metric.md)
- **See real examples** → [OgPgy Bank Examples](./examples/ogpgy-bank/)
- **Use AI effectively** → [AI-Assisted Development Guide](./guides/ai-assisted-development.md)
- **Understand type safety** → [Type Safety Patterns](./guides/type-safety-patterns.md)
- **Organize large models** → [Organizing Large Models](./best-practices/organizing-large-models.md)
- **Troubleshoot issues** → [Troubleshooting Guide](./reference/troubleshooting.md)

## 💬 Getting Help

- **Documentation Issues**: [Report on GitHub](https://github.com/krabhishek/aabha/issues)
- **Questions**: Check [FAQ](./reference/faq.md) or open a discussion
- **Examples**: See [Examples Section](./examples/)

## 📝 Contributing to Documentation

Found an error or want to improve the docs? Contributions are welcome!

---

**Happy Product Modeling! ✨**

The aura of a great product starts with clear structure.
