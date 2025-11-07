# ESLint Plugin Aabha Documentation

Documentation for the `eslint-plugin-aabha` package.

## Overview

This ESLint plugin provides validation rules for Aabha decorators, helping teams engineer high-quality, AI-comprehensible context in their enterprise models.

**Key Philosophy**: Aabha is a **context engineering framework**, not just a documentation tool. These rules help you create valuable, structured business context that enables AI systems to understand your domain and generate accurate implementations.

## Documentation Structure

### Developer Guides

- **[Creating Rules](./developer-guide/creating-rules.md)** - Comprehensive guide for implementing new ESLint rules
  - Context engineering philosophy
  - Rule anatomy and structure
  - Documentation standards
  - Error message guidelines
  - Implementation patterns
  - Testing approach
  - Complete examples

- **[Quick Reference](./developer-guide/quick-reference.md)** - Fast lookup for experienced developers
  - Rule templates
  - Error message templates
  - Common code patterns
  - Validation checklist

## Getting Started

### For Rule Implementers

1. **Read**: [Creating Rules Guide](./developer-guide/creating-rules.md) - Understand the philosophy and patterns
2. **Reference**: [Quick Reference](./developer-guide/quick-reference.md) - Use as you implement
3. **Explore**: Existing rules in `src/rules/` - See working examples
4. **Test**: Use `RuleTester` to validate your implementation

### For Plugin Users

See the main [README](../README.md) for:
- Installation instructions
- Configuration examples
- Available rules
- Usage in projects

## Context Engineering Philosophy

From the [Aabha README](../../../aabha/README.md):

> **Aabha** enables **context engineering at enterprise scale** - from digital customer journeys to offline business processes - with the rigor and formality of the TypeScript programming language. It transforms product strategy, user journeys, stakeholder expectations, manual workflows, and organizational knowledge into declarative, type-safe code that serves as structured, engineered context for AI systems and human teams.

### Why This Matters for ESLint Rules

Traditional ESLint plugins enforce code style and catch bugs. This plugin has a different mission:

**Goal**: Help engineers create valuable, AI-comprehensible business context

**Focus**: Context quality, not just correctness

**Benefit**: Better AI assistance, preserved tribal knowledge, efficient token usage

### Key Principles

1. **Context is Valuable** - Aabha decorators capture business logic and domain expertise
2. **AI Comprehension** - Well-structured context enables accurate AI-generated implementations
3. **Token Efficiency** - Good context = 80-90% reduction in AI interaction costs
4. **Traceability** - Connect strategy → initiatives → journeys → code
5. **Living Documentation** - Context evolves with the codebase

## Rule Categories

Rules are organized by business domain:

| Category | Description | Example Rules |
|----------|-------------|---------------|
| **naming** | Naming conventions for context clarity | `component-naming-convention`, `required-description` |
| **action** | Action validation | `action-event-naming`, `action-fallback-exists` |
| **interaction** | Interaction patterns | `interaction-layer-pattern-alignment` |
| **collaboration** | Human coordination | `collaboration-participant-role-validation` |
| **expectation** | Stakeholder expectations | `expectation-slo-target-realism` |
| **journey** | User journey structure | `journey-entry-actions-exist` |
| **metric** | Measurement quality | `metric-baseline-required` |
| **behavior** | Behavior validation | `behavior-complexity-alignment` |
| **witness** | Test validation | `witness-scenario-quality` |
| **stakeholder** | Stakeholder management | `stakeholder-role-definition` |
| **persona** | Persona validation | `persona-identity-completeness` |
| **strategy** | Strategy completeness | `strategy-metrics-required` |
| **context** | Context validation | `context-boundary-required` |
| **business-initiative** | Initiative validation | `initiative-budget-breakdown` |
| **validation** | Schema validation | `schema-validation` |
| **complexity** | Complexity limits | `max-journey-steps` |

## Contributing

We welcome contributions! To add new rules:

1. Read the [Creating Rules Guide](./developer-guide/creating-rules.md)
2. Implement your rule following the patterns
3. Add comprehensive tests
4. Submit a pull request

### Guidelines

- **Emphasize context engineering value** in all documentation
- **Write educational error messages** that explain business impact
- **Provide auto-fixes** where possible
- **Test thoroughly** with real-world examples
- **Respect code formatting** in auto-fixes

## Resources

### Internal
- [Aabha Package](../../../aabha/) - Main framework documentation
- [Aabha Core Rules](../../../aabha-plugin-core-rules/) - Reference implementations
- [Existing ESLint Rules](../src/rules/) - Working examples

### External
- [TypeScript ESLint - Custom Rules](https://typescript-eslint.io/developers/custom-rules)
- [ESLint - Working with Rules](https://eslint.org/docs/latest/developer-guide/working-with-rules)
- [AST Explorer](https://astexplorer.net/) - Visualize TypeScript AST

## Questions?

- **Context engineering philosophy**: Read the [Aabha README](../../../aabha/README.md)
- **Rule implementation**: See [Creating Rules Guide](./developer-guide/creating-rules.md)
- **Technical issues**: Check existing rules in `src/rules/`
- **API questions**: Reference [@typescript-eslint/utils docs](https://typescript-eslint.io/)

---

**Remember**: These rules help engineers create better context, not just enforce arbitrary standards. Every rule should explain the **business value** of context engineering.
