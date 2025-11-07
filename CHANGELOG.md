# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-08

### Added

- **New decorators for enhanced journey mapping**:
  - `@Action` - Define executable actions with triggers, retries, and compensation patterns
  - `@Interaction` - Define technical data exchange contracts (API, UI, Database, Device, Interpersonal, Manual, Organizational)
  - `@Collaboration` - Define multi-stakeholder human interactions (meetings, reviews, workshops, approvals)
- **Enhanced journey modeling** - Strong forward-facing DAG (Directed Acyclic Graph) structure for journey mapping, enabling better representation of complex workflows and dependencies
- **Offline process modeling** - `@Collaboration` decorator facilitates better modeling of offline business processes with manual interactions, enabling comprehensive coverage of both digital and offline operations
- **eslint-plugin-aabha** - First release of the official ESLint plugin:
  - 111 validation rules across all 13 core Aabha decorators
  - Real-time validation in IDE
  - Automatic fixes for common issues
  - Recommended and strict configuration presets
  - Comprehensive rule coverage for Strategy, Business Initiative, Context, Journey, Stakeholder, Persona, Expectation, Interaction, Collaboration, Action, Behavior, Witness, and Metric decorators

### Removed

- `@Milestone` - Removed in favor of `@Action` for more flexible journey mapping
- `@Step` - Removed in favor of `@Action` for more granular action definition
- These changes enable a stronger forward-facing DAG structure for journey mapping, improving the ability to model complex workflows and dependencies

### Changed

- **Journey architecture** - Journey mapping now uses `@Action` decorators instead of `@Milestone` and `@Step`, providing a more flexible and powerful DAG-based approach to modeling user experiences and business processes

[1.1.0]: https://github.com/krabhishek/aabha/releases/tag/v1.1.0

## [1.0.0] - 2025-10-22

### Added

- Initial release of Aabha (आभा - "aura") - Product Management as Code
- Core decorator system for product management:
  - `@Strategy` - Define business strategy (where to play, how to win)
  - `@BusinessInitiative` - Define concrete initiatives implementing strategy
  - `@Journey` - Map user/stakeholder experience flows
  - `@Milestone` - Define business-significant achievements
  - `@Step` - Define granular actions within milestones
  - `@Expectation` - Define stakeholder expectations
  - `@Behavior` - Define executable behaviors
  - `@Test` - Define verification tests
  - `@Attribute` - Define reusable attributes
- Supporting decorators:
  - `@Stakeholder` - Define context-specific roles
  - `@Persona` - Define user archetypes (human, system, organization)
  - `@Metric` - Define measurable outcomes
  - `@Context` - Define business perspectives
  - `@Witness` - Define observers and auditors
- Complete compile-time type safety with zero runtime overhead
- Type-safe relationships between all product hierarchy levels
- One-way hierarchy principle (parents know children, not vice versa)
- Full TypeScript 5.0+ Stage 3 decorators support
- Comprehensive documentation and architecture guide
- Examples:
  - E-commerce strategy example
  - OgPgy Bank comprehensive banking example

### Features

- Zero dependencies - completely standalone package
- Minimal runtime footprint (phantom properties only)
- Full type inference and IDE autocomplete support
- Compile-time validation of relationships
- AI-ready context with rich, structured metadata
- Compatible with all TypeScript 5.0+ projects
- ESM module format

[1.0.0]: https://github.com/krabhishek/aabha/releases/tag/v1.0.0
