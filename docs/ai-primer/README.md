# Aabha AI Primer

**Dense, modular documentation for AI coding assistants**

## Purpose

This primer enables AI assistants to efficiently learn the Aabha framework API without overwhelming token budgets. Load documents as needed based on your task.

## Framework Summary

**Aabha** (आभा, "radiance") is an **enterprise context management framework** designed for **context engineering at scale**. It models entire enterprise contexts—digital processes, offline operations, organizational workflows, and business strategy—in type-safe TypeScript with zero runtime overhead, enabling AI systems to comprehend complex business contexts efficiently.

---

## Navigation Guide

### Quick Start (ALWAYS START HERE)

**Start here for all tasks:**
- **[00-overview.md](./00-overview.md)** - Framework philosophy, quick example (~3K tokens)
- **[01-core-concepts.md](./01-core-concepts.md)** - Essential patterns, DAG topology, compile-time safety (~6K tokens)

### Core Documentation Series

**Load based on what you're modeling:**

#### **File 2: Transformer & Validation Rules**
- **[02-transformer-rules.md](./02-transformer-rules.md)** - TypeScript → JSON transformation, validation rules (~8K tokens)
- **When to load**: Understanding how decorators serialize, debugging validation errors

#### **File 3: Digital Journey Decorators**
- **[03-digital-journey-decorators.md](./03-digital-journey-decorators.md)** - @Journey, @Action, @Expectation, @Interaction for digital processes (~11K tokens)
- **When to load**: Modeling mobile apps, APIs, automated workflows, digital-first processes

#### **File 4: Offline Journey Decorators**
- **[04-offline-journey-decorators.md](./04-offline-journey-decorators.md)** - @Interaction (offline), @Collaboration for human processes (~14K tokens)
- **When to load**: Modeling branch operations, manual reviews, meetings, human collaboration, hybrid digital+offline

#### **File 5: Stakeholder & Persona Decorators**
- **[05-stakeholder-persona-decorators.md](./05-stakeholder-persona-decorators.md)** - @Persona (WHO), @Stakeholder (WHAT + WHERE) (~10K tokens)
- **When to load**: Defining participants, organizational actors, human/system personas, stakeholder relationships

#### **File 6: Behavioral Decorators**
- **[06-behavioral-decorators.md](./06-behavioral-decorators.md)** - @Behavior, @Witness (method decorator!), @Attribute (~11K tokens)
- **When to load**: Implementing expectations, writing BDD tests, proving behaviors work

#### **File 7: Composition Patterns**
- **[07-composition-patterns.md](./07-composition-patterns.md)** - Full hierarchy, integration scenarios, anti-patterns, migration guide (~13K tokens)
- **When to load**: Understanding how all decorators work together, debugging complex models, avoiding mistakes

### Reference Documents

- **[API-CORRECTIONS.md](./API-CORRECTIONS.md)** - Common mistakes and correct patterns
  - **When to load**: Fixing compilation errors, learning correct API usage

---

## Loading Strategy

### Scenario-Based Loading

**"Model a mobile account opening journey"**
→ Load: 00-overview, 01-core-concepts, 03-digital-journey-decorators, 05-stakeholder-persona-decorators

**"Model a branch compliance review process"**
→ Load: 00-overview, 01-core-concepts, 04-offline-journey-decorators, 05-stakeholder-persona-decorators

**"Create personas and stakeholders"**
→ Load: 00-overview, 01-core-concepts, 05-stakeholder-persona-decorators

**"Implement and test a behavior"**
→ Load: 00-overview, 01-core-concepts, 06-behavioral-decorators

**"Understand the full decorator hierarchy"**
→ Load: 00-overview, 01-core-concepts, 07-composition-patterns

**"Debug validation errors or understand serialization"**
→ Load: 00-overview, 01-core-concepts, 02-transformer-rules

**"Model hybrid journey (digital → offline → digital)"**
→ Load: 00-overview, 01-core-concepts, 03-digital-journey-decorators, 04-offline-journey-decorators, 07-composition-patterns

### Progressive Loading

1. **Always start**: 00-overview + 01-core-concepts (~9K tokens)
2. **Add journey docs**: Digital (03) and/or Offline (04) based on process type
3. **Add stakeholders**: If modeling WHO participates (05)
4. **Add behaviors**: If implementing HOW things work (06)
5. **Add composition**: When integrating multiple decorators (07)
6. **Add transformer**: When debugging or understanding serialization (02)

---

## Key Principles (Critical!)

Before loading any decorators, understand these from **01-core-concepts.md**:

1. **DAG Topology**: Actions form Directed Acyclic Graph via `triggers` (forward-looking)
2. **Journey ≠ Flow**: Journeys are containers; flow emerges from Action.triggers
3. **Action Scopes**: Atomic (plentiful) → Composite → Journey (rare, emits events) → System
4. **Type Branding**: Each decorator adds compile-time type brand (WithJourney, WithAction, etc.)
5. **Zero Runtime**: All validation is compile-time only (no metadata at runtime)
6. **Empty Classes**: All decorators applied to empty exported classes (except @Witness = method decorator)
7. **Direct References**: Use `TargetAction` not `() => TargetAction` (no arrow functions!)
8. **Stakeholder Formula**: Stakeholder = WHO (persona) + WHAT (role) + WHERE (context)

---

## Token Budget Guide

### Full Documentation
- **Total**: ~71K tokens (all 7 files + overview + concepts + API corrections)
- **Minimum viable**: ~9K tokens (00-overview + 01-core-concepts)
- **Typical task**: ~20-30K tokens (overview + concepts + 2-3 relevant files)

### File Sizes
| File | Tokens | Purpose |
|------|--------|---------|
| 00-overview.md | ~3K | Framework philosophy, quick start |
| 01-core-concepts.md | ~6K | Essential patterns, DAG, compile-time safety |
| 02-transformer-rules.md | ~8K | Serialization, validation rules |
| 03-digital-journey-decorators.md | ~11K | Digital journeys (@Journey, @Action, @Expectation, @Interaction) |
| 04-offline-journey-decorators.md | ~14K | Offline journeys (@Interaction offline, @Collaboration) |
| 05-stakeholder-persona-decorators.md | ~10K | Personas and stakeholders (WHO/WHAT/WHERE) |
| 06-behavioral-decorators.md | ~11K | Behaviors, witnesses, attributes (HOW + PROOF) |
| 07-composition-patterns.md | ~13K | Integration, anti-patterns, migration |
| API-CORRECTIONS.md | ~3K | Common mistakes, correct patterns |

---

## Complete Decorator Reference

### 13 Core Decorators (Class Decorators)

**Journey & Process Flow**:
- `@Journey` - Container for related actions (minimal metadata)
- `@Action` - Event-driven DAG nodes (4 scopes: Atomic → Composite → Journey → System)

**Organizational Actors**:
- `@Context` - WHERE business activities happen
- `@Persona` - WHO people ARE (demographics, psychology, behaviors)
- `@Stakeholder` - WHAT people DO in specific context (role + responsibilities + authority)

**Stakeholder Contracts**:
- `@Expectation` - WHAT stakeholders want (SLO/SLI, quality metrics)
- `@Interaction` - Technical contracts (7 layers: Frontend, Backend, Data, Device, Interpersonal, Manual, Organizational)
- `@Collaboration` - Multi-stakeholder coordination (meetings, reviews, governance)

**Implementation & Verification**:
- `@Behavior` - HOW expectations are implemented (executable code)
- `@Witness` - **METHOD DECORATOR** proving behaviors work (BDD tests)
- `@Attribute` - Reusable data properties (rare edge case)

**Measurement**:
- `@Metric` - Measurable KPIs (performance, quality, business)

---

## Complete Hierarchy Visualization

```
┌─────────────────────────────────────────────────┐
│  @Context - WHERE business activities happen    │
└────────────────┬────────────────────────────────┘
                 │ provides context for
                 ▼
┌─────────────────────────────────────────────────┐
│  @Persona - WHO people ARE (archetype)          │
│  @Stakeholder - WHAT people DO (role + context) │
│  Relationship: Persona + Context → Stakeholder  │
└────────────────┬────────────────────────────────┘
                 │ participates in
                 ▼
┌─────────────────────────────────────────────────┐
│  @Journey - Container for actions               │
│  @Action - Event-driven DAG nodes (triggers)    │
│  Key: Flow emerges from Action.triggers         │
└────────────────┬────────────────────────────────┘
                 │ has expectations
                 ▼
┌─────────────────────────────────────────────────┐
│  @Expectation - Stakeholder contracts (SLO/SLI) │
│  @Interaction - Technical contracts (7 layers)  │
│  @Collaboration - Multi-stakeholder governance  │
└────────────────┬────────────────────────────────┘
                 │ implemented by
                 ▼
┌─────────────────────────────────────────────────┐
│  @Behavior - HOW implementation works           │
│    └─ @Witness - METHOD DECORATOR (BDD proof)  │
└────────────────┬────────────────────────────────┘
                 │ measured by
                 ▼
┌─────────────────────────────────────────────────┐
│  @Metric - Observable KPIs                      │
└─────────────────────────────────────────────────┘
```

---

## Critical Distinctions

### Digital vs Offline Journeys

**Digital** (File 3):
- Event-driven, millisecond-scale
- Automated systems, APIs, mobile apps
- `@Interaction` layers: Frontend, Backend, Data, Device
- Examples: Mobile account opening, API workflows

**Offline** (File 4):
- Human-coordination, hour/day-scale
- Manual processes, meetings, reviews
- `@Interaction` layers: Interpersonal, Manual, Organizational
- `@Collaboration`: Multi-stakeholder governance
- Examples: Branch operations, compliance reviews

**Hybrid** (Files 3 + 4 + 7):
- Digital → Offline → Digital handoffs
- Example: AI verification → manual review → account creation

### Persona vs Stakeholder

**@Persona** (WHO they ARE):
- Context-independent archetype
- Demographics, psychology, behaviors, needs
- Example: Marcus Lee (26, software developer, mobile-first)

**@Stakeholder** (WHAT they DO):
- Context-specific role
- Responsibilities, authority, relationships
- Formula: `Stakeholder = Persona + Context`
- Example: Marcus as MobileAccountOpener in AccountOpeningContext

**Relationship**: One persona → many stakeholders across contexts

---

## Special Notes

### Only @Witness is a Method Decorator
- **All other Aabha decorators**: Class decorators on empty exported classes
- **@Witness**: Method decorator inside @Behavior classes for BDD-style tests
- **Common mistake**: Trying to use @Action or @Behavior as property decorators

### Action Scope Levels (Critical!)
- **Atomic**: Single operation (plentiful, granular)
- **Composite**: Orchestrates multiple actions
- **Journey**: Significant milestone, emits business events (rare, meaningful)
- **System**: Cross-journey coordination

**Rule**: Journey scope actions should emit events. Atomic actions should NOT.

### Type Safety Through Branding
Every decorator adds a type brand:
- `@Journey` → `WithJourney<T>`
- `@Action` → `WithAction<T>`
- `@Stakeholder` → `WithStakeholder<T>`
- Invalid references = compile errors = model consistency

---

## Quick Task Reference

| Task | Load Files |
|------|------------|
| Model digital mobile flow | 00, 01, 03, 05 |
| Model offline branch process | 00, 01, 04, 05 |
| Model hybrid digital+offline | 00, 01, 03, 04, 05, 07 |
| Define personas/stakeholders | 00, 01, 05 |
| Implement behaviors with tests | 00, 01, 06 |
| Understand full integration | 00, 01, 07 |
| Debug validation errors | 00, 01, 02 |
| Learn correct API patterns | API-CORRECTIONS |

---

**Start Here**: [00-overview.md](./00-overview.md) → [01-core-concepts.md](./01-core-concepts.md)

**Common Mistakes**: [API-CORRECTIONS.md](./API-CORRECTIONS.md)
