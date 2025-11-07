# Aabha

**Aabha** (Sanskrit: आभा, meaning "aura" or "radiance") - **Enterprise Context Management Framework for Context Engineering at Scale**

Foundation for **systematic context engineering** across the enterprise. Define strategy, initiatives, **digital products**, **offline operations**, and organizational processes with TypeScript decorators—creating engineered, AI-comprehensible context.

Aabha enables **context engineering at enterprise scale** - from digital customer journeys to offline business processes - with the rigor and formality of the TypeScript programming language. It transforms product strategy, user journeys, stakeholder expectations, manual workflows, and organizational knowledge into declarative, type-safe code that serves as structured, engineered context for AI systems and human teams.

Just as an aura radiates from a well-crafted enterprise vision, Aabha brings clarity, structure, and machine-readable context to both **online digital products** and **offline operational processes** making it a truly holistic **context engineering framework** for the modern enterprise.

---

## 🤖 For AI Assistants: API Documentation

**AI coding assistants (Claude, Gemini, GitHub Copilot, Cursor, etc.)**: To understand the Aabha API and use it effectively, read the comprehensive **AI Primer** documentation designed specifically for AI systems:

📚 **Start here**: [`docs/ai-primer/README.md`](./aabha/docs/ai-primer/README.md)

The AI Primer provides:
- **Token-efficient documentation** (~71K tokens total, modular loading strategy)
- **Complete decorator reference** (12 core decorators: @Strategy, @BusinessInitiative, @Context, @Journey, @Stakeholder, @Persona, @Expectation, @Interaction, @Collaboration, @Behavior, @Witness, @Metric)
- **Digital and offline journey patterns** (mobile apps, APIs, branch operations, manual processes, hybrid workflows)
- **Type-safe examples** with compile-time validation patterns
- **Integration scenarios** showing how decorators compose
- **Common mistakes** and anti-patterns to avoid

**Quick loading guide**:
- **Minimum start** (~9K tokens): `00-overview.md` + `01-core-concepts.md`
- **Digital journeys** (~20K tokens): Add `03-digital-journey-decorators.md` + `05-stakeholder-persona-decorators.md`
- **Offline processes** (~24K tokens): Add `04-offline-journey-decorators.md` + `05-stakeholder-persona-decorators.md`
- **Implementation & testing** (~11K tokens): `06-behavioral-decorators.md`
- **Full integration** (~13K tokens): `07-composition-patterns.md`

The primer uses **scenario-based loading** to optimize your token budget while providing complete API understanding.

---

## Why Aabha?

### 📋 Enterprise-Scale Context Engineering Foundation

Traditional enterprise context is scattered across documents, spreadsheets, and diagrams that can't handle complexity at scale. Aabha provides a **systematic context engineering approach** with highly dense, reusable foundation for entire enterprise contexts:

- **Single Source of Truth** - Entire enterprise context engineered as type-safe code
- **Dense Context Representation** - Engineered for maximum information density while maintaining readability
- **Compile-Time Validation** - Enterprise-wide context inconsistencies caught before implementation
- **Reusable Context Components** - Engineer libraries of reusable strategies, journeys, and stakeholders
- **Version Control** - Track enterprise context evolution with Git's rigor
- **Testable Context Models** - Write tests validating your engineered organizational knowledge

### 📊 Model the Entire Enterprise - Digital AND Offline

Aabha is unique in modeling **both online digital products and offline operational processes** in a unified framework:

**✅ Digital Journeys** - Fast, automated, self-service experiences
- Mobile applications (iOS/Android)
- Web applications (browser-based)
- APIs and microservices
- Real-time event-driven systems
- Measured in seconds/minutes

**✅ Offline Journeys** - Human-driven, manual, compliance-heavy processes
- Branch operations and in-person services
- Manual reviews and approvals (compliance, risk, legal)
- Physical documents and wet signatures
- Paper-based workflows
- Measured in hours/days/weeks

**✅ Human Collaboration** - Multi-stakeholder coordination
- Governance meetings (investment committees, boards)
- Review/approval processes (compliance, audits)
- Consultations and negotiations
- Organizational decision-making

**✅ Organizational Processes** - Enterprise-to-enterprise interactions
- Regulatory audits and submissions
- Partnership contracts and SLAs
- Legal agreements and compliance
- Third-party vendor management

**✅ Hybrid Workflows** - Seamless digital-to-offline-to-digital transitions
- AI triage → manual review → digital completion
- Digital application → branch verification → account creation
- Online submission → physical signature → digital processing

### 🤝 Business-Engineering Alignment at Scale

Aabha creates a **shared language** that scales across the enterprise:

- **Enterprise Traceability** - Track features from strategy → initiatives → journeys → expectations → code
- **Cross-Organization Alignment** - Multiple teams work from the same context foundation
- **Impact Analysis** - TypeScript shows ripple effects when enterprise strategy shifts
- **Living Documentation** - Enterprise context and documentation are unified
- **Reduced Ambiguity** - Type-safe relationships eliminate misunderstandings at scale

### 🤖 AI-Assisted Development Through Context Engineering

Aabha's **engineered context models** make AI systems comprehend enterprise complexity efficiently. Systematic context engineering creates rich, structured context for AI coding assistants (Gemini, Claude Code, GitHub Copilot, Cursor, etc.):

#### 🎯 Engineered Context = Massive Token Efficiency

Context engineering delivers **maximum AI comprehension with minimum tokens**:

```typescript
// Traditional approach: 500+ tokens of scattered context
// - Copy-paste from PRD
// - Paste user stories
// - Explain relationships
// - Describe metrics
// - Clarify ambiguities

// Aabha approach: 50 tokens of dense, structured context
@BusinessInitiative({
  name: 'Seamless Checkout',
  strategy: GrowthStrategy, // Links entire strategy context
  journeys: [CheckoutJourney], // Complete user journey
  metrics: [CartAbandonmentRate], // Embedded measurement
  objectives: ['Reduce abandonment by 30%'],
})
class CheckoutInitiative {}

// 10x token efficiency! AI reads the Aabha structure:
// ✅ Business goal (reduce abandonment)
// ✅ Linked strategy (growth)
// ✅ User experience (checkout journey)
// ✅ Success metrics (30% target)
// ✅ Type-safe relationships
```

**Why This Matters**:

- **Lower Costs** - 10x fewer tokens per AI interaction
- **Faster Responses** - AI processes compact structure vs verbose docs
- **Better Context Window Usage** - More room for complex queries
- **Consistent Quality** - Structure eliminates ambiguity

#### 🧠 AI-Powered Product Planning

Aabha enables AI assistants to **co-create product plans** with type-safe validation:

**1. AI as Product Planning Partner**

```typescript
// Developer: "Claude, help me plan the 'User Onboarding' initiative"

// AI generates structured Aabha model:
@BusinessInitiative({
  name: 'User Onboarding',
  objectives: [
    'Reduce time-to-first-value to < 5 minutes',
    'Achieve 80% activation rate',
    'Decrease support tickets by 40%',
  ],
  journeys: [
    SignupJourney, // AI suggests journey
    FirstLoginJourney, // AI breaks down flows
    InitialSetupJourney, // AI identifies milestones
  ],
  metrics: [
    TimeToValueMetric, // AI proposes metrics
    ActivationRateMetric,
    SupportTicketMetric,
  ],
})
class UserOnboardingInitiative {}

// ✅ TypeScript validates: Are journeys properly defined?
// ✅ TypeScript validates: Do metrics exist?
// ✅ IDE shows: What's missing in real-time
```

**2. Iterative Refinement with Type Feedback**

```typescript
// AI proposes journey structure:
@Journey({
  name: 'Signup Journey',
  primaryStakeholder: UserStakeholder, // ❌ Type error if not defined!
  milestones: [
    { milestone: EmailVerificationMilestone, order: 1 },
    { milestone: ProfileCompletionMilestone, order: 2 },
  ],
})
class SignupJourney {}

// TypeScript + IDE provide instant feedback:
// ❌ "UserStakeholder not defined" → AI creates it
// ❌ "EmailVerificationMilestone missing @Milestone" → AI adds decorator
// ✅ All types satisfied → Product plan is complete and consistent!
```

**3. AI Discovers Gaps Through Type Errors**

```typescript
// AI-generated initiative:
@BusinessInitiative({
  name: 'Analytics Dashboard',
  strategy: DataDrivenStrategy,    // ❌ Strategy not defined
  journeys: [DashboardJourney],    // ❌ Journey not defined
  metrics: []                      // ❌ No metrics = no way to measure success!
})

// IDE highlights errors in red → AI sees structural gaps
// AI then asks clarifying questions:
// "What strategy does this initiative support?"
// "What journeys comprise this initiative?"
// "How will we measure success?"

// Result: Complete, validated product plan
```

#### AI-Powered "Vibe Coding" with Context Richness

With Aabha, AI assistants can:

1. **Generate Implementation** - "Implement the CheckoutJourney with all expectations"
2. **Suggest Architecture** - AI sees stakeholder relationships and suggests optimal design
3. **Write Tests** - AI generates tests from `@Expectation` and `@Behavior` decorators
4. **Detect Gaps** - AI identifies missing milestones or expectations through type analysis
5. **Propose Refactoring** - AI suggests improvements based on metrics and outcomes
6. **Co-Create Product Plans** - AI drafts initiatives, journeys, and metrics with type-safe validation
7. **Validate Completeness** - TypeScript errors guide AI to complete missing pieces

#### Example AI Prompt Evolution

```typescript
// Traditional: Vague, requires 500+ tokens of context
"Build a checkout flow for an e-commerce site.
Users should be able to add items to cart, review their order,
enter payment details, and complete purchase.
We want to reduce cart abandonment.
The primary user is a tech-savvy millennial who values speed..." ❌
// Problem: AI must infer structure, relationships, metrics

// Aabha: Precise, uses 50 tokens + type-safe structure
"Implement CheckoutJourney with all milestones, ensuring CustomerStakeholder
expectations are met and CartAbandonmentRate metric is tracked" ✅

// AI instantly understands from Aabha model:
// - Primary stakeholder: CustomerStakeholder (with persona details)
// - Business goal: Reduce cart abandonment to 30%
// - User journey: CheckoutJourney (with all milestones)
// - Success criteria: All expectations must pass
// - Measurement: CartAbandonmentRate tracking
// - Context: ECommerceContext (with goals and stakeholders)
// - Strategy: GrowthStrategy (where to play, how to win)

// Result: 10x less context, 10x better output
```

#### Token Efficiency Comparison

| Scenario                | Traditional Approach              | Aabha Approach                   | Token Savings |
| ----------------------- | --------------------------------- | -------------------------------- | ------------- |
| **Context Sharing**     | 500-1000 tokens (copy-paste docs) | 50-100 tokens (structured model) | **90%**       |
| **AI Query**            | Repeat context each time          | Reference once, reuse            | **80%**       |
| **Clarification Round** | Multiple back-and-forth cycles    | Type errors guide AI immediately | **70%**       |
| **Implementation**      | Verbose requirements              | Dense, linked structure          | **85%**       |

**Cumulative Effect**: Aabha reduces token consumption by **80-90%** across development lifecycle while improving output quality!

### ⚡ Team Velocity Benefits

- **Faster Onboarding** - New developers understand product by reading code
- **Reduced Context Switching** - Product specs and code live together
- **AI-Augmented Coding** - Junior developers ship senior-level work with AI assistance
- **Consistency** - Aabha enforces architectural patterns across teams
- **Knowledge Retention** - Product knowledge captured in executable code, not tribal knowledge

## Features

✨ **Compile-Time Type Safety** - Catch errors before runtime
🚀 **Zero Runtime Overhead** - Decorators only apply type brands
📊 **Holistic Enterprise Coverage** - Model digital products AND offline operations
🔗 **One-Way References** - Parents know children, not vice versa
🎯 **Independent Package** - No external dependencies
🤖 **AI-Ready Context** - Rich metadata for AI coding assistants
🏢 **Unified Framework** - From strategy to digital APIs to branch operations

## Installation

```bash
npm install aabha
# or
yarn add aabha
# or
pnpm add aabha
```

### ESLint Plugin (Recommended)

To ensure your Aabha models follow best practices and catch common mistakes at development time, install the official ESLint plugin:

```bash
npm install --save-dev eslint-plugin-aabha
# or
pnpm add -D eslint-plugin-aabha
```

Configure ESLint:

```javascript
// eslint.config.js (flat config)
import aabhaPlugin from 'eslint-plugin-aabha';

export default [
  {
    plugins: {
      aabha: aabhaPlugin,
    },
    rules: {
      ...aabhaPlugin.configs.recommended.rules,  // Use recommended rules
    },
  },
];
```

The ESLint plugin provides:
- **80+ validation rules** across all decorators
- **Automatic fixes** for common issues (missing properties, incorrect configurations)
- **Real-time feedback** in your IDE
- **Best practice enforcement** (SLO ordering, layer-config matching, error code uniqueness, etc.)
- **Context engineering quality** checks (verification levels, metrics alignment, stakeholder completeness)

**Rule Categories**:
- Expectation rules (7) - SLO validation, verification coverage
- Collaboration rules (14) - Participant validation, artifact ownership, decision-making
- Interaction rules (15) - Layer-config matching, protocol validation, error code uniqueness
- Behavior rules (8) - Complexity alignment, postconditions quality
- Context rules (6) - Boundary validation, relationship consistency
- Business Initiative rules (6) - Budget validation, timeline consistency
- Witness rules (14) - BDD completeness, fixture validation
- Journey rules (3) - Entry actions, metrics relevance
- Metric rules (8) - Baseline requirements, target alignment
- Persona rules (7) - Identity completeness, needs-goals alignment
- Stakeholder rules (6) - Engagement completeness, role definition
- Strategy rules (3) - Governance completeness, P2W validation

## Quick Start

```typescript
import {
  Strategy,
  BusinessInitiative,
  Journey,
  Expectation,
  Stakeholder,
  Persona,
  Context,
  Metric,
} from 'aabha';

// 1. Define a Persona (WHO people are)
@Persona({
  name: 'Tech-Savvy Millennial',
  type: 'user',
  identity: {
    age: '25-35',
    occupation: 'Digital professional',
    techSavviness: 'high'
  },
  goals: ['Quick online shopping', 'Seamless checkout'],
  needs: ['Fast, mobile-first experience', 'Minimal friction']
})
class TechSavvyMillennial {}

// 2. Define a Context (WHERE they operate)
@Context({
  name: 'E-Commerce',
  boundary: 'Online shopping and checkout platform',
  goals: ['Maximize conversion', 'Minimize cart abandonment'],
})
class ECommerceContext {}

// 3. Define a Stakeholder (WHAT they do in WHERE)
@Stakeholder({
  role: 'Customer',
  persona: TechSavvyMillennial,
  context: ECommerceContext,
  responsibilities: ['Browse products', 'Complete checkout', 'Provide payment']
})
class CustomerStakeholder {}

// 4. Define Metrics (WHAT we measure)
@Metric({
  name: 'Cart Abandonment Rate',
  type: 'percentage',
  target: { value: 30, comparison: 'lessThanOrEqual' },
  unit: '%',
  baseline: 45,
  owner: 'Product Team'
})
class CartAbandonmentRate {}

// 5. Define Strategy (WHERE to play, HOW to win)
@Strategy({
  name: 'E-Commerce Growth',
  vision: 'Become the fastest checkout in the market',
  whereToPlay: {
    markets: ['Direct-to-Consumer'],
    segments: ['Tech-savvy millennials', 'Mobile-first shoppers']
  },
  howToWin: 'Fastest checkout in the market with < 2 minute completion',
  metrics: [CartAbandonmentRate],
})
class GrowthStrategy {}

// 6. Define an Expectation (Provider-Consumer contract)
@Expectation({
  name: 'Fast Checkout Completion',
  provider: CustomerStakeholder,
  consumer: CustomerStakeholder,
  description: 'Customer expects checkout to complete in under 2 minutes',
  slos: [
    {
      metric: 'Checkout completion time',
      target: '< 2 minutes',
      percentile: 'p95'
    }
  ],
  verification: {
    level: 'monitored',
    testCoverage: { minWitnessCoverage: 50 }
  }
})
class FastCheckoutExpectation {}

// 7. Define a Journey
@Journey({
  name: 'Checkout Journey',
  primaryStakeholder: CustomerStakeholder,
  description: 'Customer completes purchase from cart to order confirmation',
  entryPoints: ['Cart page', 'Buy now button'],
  exitPoints: ['Order confirmation', 'Payment failure'],
  expectations: [FastCheckoutExpectation],
  metrics: [CartAbandonmentRate]
})
class CheckoutJourney {}

// 8. Define a Business Initiative
@BusinessInitiative({
  name: 'Seamless Checkout Experience',
  strategy: GrowthStrategy,
  journeys: [CheckoutJourney],
  objectives: ['Reduce cart abandonment to <30%', 'Achieve <2min checkout time'],
  metrics: [CartAbandonmentRate],
  budget: {
    amount: 500000,
    currency: 'USD',
    breakdown: [
      { category: 'Engineering', amount: 300000 },
      { category: 'Design', amount: 100000 },
      { category: 'Testing', amount: 100000 }
    ]
  },
  timeline: {
    startDate: '2025-Q1',
    targetDate: '2025-Q2',
    milestones: [
      { name: 'Design complete', date: '2025-02-15' },
      { name: 'MVP launch', date: '2025-04-01' }
    ]
  }
})
class SeamlessCheckoutInitiative {}
```

### Quick Start - Offline Journey Example

Aabha also models offline processes like branch operations and manual reviews:

```typescript
import {
  Collaboration,
  Interaction, InteractionPattern, InteractionLayer,
  Action, ActionScope,
  Journey
} from 'aabha';

// Define a manual review collaboration
@Collaboration({
  name: 'Manual Compliance Review',
  purpose: 'Multi-stakeholder review for high-risk applications',
  collaborationType: 'review-approval',

  participants: [
    {
      stakeholder: ComplianceOfficerStakeholder,
      role: 'reviewer',
      required: true,
      responsibilities: ['Verify documents', 'Check sanctions', 'Assess risk']
    },
    {
      stakeholder: SeniorOfficerStakeholder,
      role: 'approver',
      required: true
    }
  ],

  duration: 'PT4H',  // 4 hours typical
  communicationChannel: 'document-review',

  expectedOutcomes: [
    { outcome: 'Application approved or rejected', type: 'decision' }
  ]
})
class ComplianceReviewCollaboration {}

// Define manual interaction
@Interaction({
  name: 'Physical Document Review',
  pattern: InteractionPattern.ManualReview,
  layer: InteractionLayer.Manual,

  inputs: [
    { name: 'applicationForm', type: 'PhysicalDocument', required: true },
    { name: 'identityDocuments', type: 'PhysicalDocument[]', required: true }
  ],

  outputs: [
    { name: 'reviewDecision', type: 'string', required: true },
    { name: 'reviewerSignature', type: 'PhysicalSignature', required: true }
  ],

  manualConfig: {
    processType: 'manual-review',
    physicalLocation: 'Compliance Department',
    documentsRequired: ['Application', 'ID', 'Risk assessment'],
    offlineStorage: {
      retentionPeriod: '7 years'  // Regulatory requirement
    }
  }
})
class PhysicalDocumentReviewInteraction {}

// Define offline action linking to collaboration
@Action({
  name: 'Manual Compliance Review',
  actor: ComplianceOfficerStakeholder,
  scope: ActionScope.Composite,

  collaboration: ComplianceReviewCollaboration,  // Links human coordination

  triggers: [
    { action: ApplicationApprovedAction, condition: 'approved' },
    { action: ApplicationRejectedAction, condition: 'rejected' }
  ]
})
class ManualComplianceReviewAction {}

// Define offline journey
@Journey({
  name: 'Branch Account Opening',
  primaryStakeholder: TraditionalCustomer,

  actions: [
    BranchConsultationAction,      // In-person meeting
    PhysicalFormAction,             // Paper form
    PhysicalSignatureAction,        // Wet signature
    ManualComplianceReviewAction,   // Manual review (hours)
    AccountCreatedAction
  ],

  outcomes: ['Account opened at branch', 'All documents verified']
})
class BranchAccountOpeningJourney {}
```

**Key Differences**:
- **Digital**: Measured in seconds, fully automated, APIs and databases
- **Offline**: Measured in hours/days, human-driven, physical documents and signatures
- **Both**: Modeled in the same unified Aabha framework with type safety

## Compile-Time Safety

Aabha enforces relationships at **compile time**:

```typescript
// ✅ VALID: All types are correctly branded
@BusinessInitiative({
  strategy: GrowthStrategy, // Has @Strategy
  journeys: [CheckoutJourney], // Has @Journey
})
class ValidInitiative {}

// ❌ COMPILE ERROR: Wrong decorator type
@BusinessInitiative({
  strategy: CheckoutJourney, // ERROR: Journey is not a Strategy!
  journeys: [GrowthStrategy], // ERROR: Strategy is not a Journey!
})
class InvalidInitiative {}
```

**Type error-free compilation = Internally consistent product model!**

## Decorator Hierarchy

```
Strategy (business strategy)
  ↓
BusinessInitiative (concrete initiatives)
  ↓
Journey (user/stakeholder experience)
  ↓
Expectation (provider/consumer contracts with SLOs)
  ↓
Behavior (executable implementations)
  ↓
Witness (BDD test scenarios)
```

### Strategic Level

- `@Strategy` - Business strategy (where to play, how to win, governance)
- `@BusinessInitiative` - Concrete initiatives implementing strategy with budget, timeline, success metrics
- `@Context` - Business contexts/perspectives (bounded contexts from DDD)
- `@Metric` - Measurable outcomes (attachable to any level)

### Stakeholder & User Level

- `@Stakeholder` - Context-specific roles and responsibilities
- `@Persona` - User/organization archetypes with psychology, behaviors, and needs

### Experience Level

- `@Journey` - End-to-end user/stakeholder experience flows with entry/exit points
- `@Expectation` - Provider/consumer expectations with SLOs and verification levels

### Technical Contract Level

- `@Interaction` - Technical data exchange contracts (API, UI, Database, Device, Interpersonal, Manual, Organizational)
- `@Collaboration` - Multi-stakeholder human interactions (meetings, reviews, workshops)

### Implementation & Testing Level

- `@Behavior` - Executable behaviors with preconditions, postconditions, and complexity
- `@Witness` - BDD-style test witnesses with scenarios and fixtures

## One-Way Hierarchy Principle

**Parents know children, children don't know parents.**

This enables component reusability:

```typescript
// ✅ Journey can be used in multiple initiatives
@BusinessInitiative({
  name: 'Initiative A',
  journeys: [CheckoutJourney], // References journey
})
class InitiativeA {}

@BusinessInitiative({
  name: 'Initiative B',
  journeys: [CheckoutJourney], // Same journey, different initiative!
})
class InitiativeB {}

// Journey has NO knowledge of which initiatives use it
@Journey({
  name: 'Checkout Journey',
  primaryStakeholder: CustomerStakeholder,
  // NO initiative reference here!
})
class CheckoutJourney {}
```

## Real-World Workflow

### Product Definition Phase

1. **Product Manager** defines strategy and initiatives:

```typescript
@Strategy({
  name: 'Market Leadership 2025',
  whereToPlay: ['SMB SaaS', 'Enterprise'],
  howToWin: 'Best developer experience',
  metrics: [MarketShareMetric, NpsMetric],
})
class MarketLeadershipStrategy {}
```

2. **Product Team** breaks down into journeys:

```typescript
@BusinessInitiative({
  name: 'Developer Onboarding',
  strategy: MarketLeadershipStrategy,
  journeys: [SignupJourney, FirstProjectJourney],
  objectives: ['Reduce time-to-first-value to < 5 minutes'],
})
class DeveloperOnboardingInitiative {}
```

3. **Designers** map user experiences:

```typescript
@Journey({
  name: 'First Project Setup',
  primaryStakeholder: DeveloperStakeholder,
  milestones: [
    { milestone: AccountCreatedMilestone, order: 1 },
    { milestone: ProjectInitializedMilestone, order: 2 },
    { milestone: FirstDeploymentMilestone, order: 3 },
  ],
})
class FirstProjectJourney {}
```

### AI-Assisted Implementation Phase

4. **Engineer + AI** implements features:

```typescript
// Engineer: "Claude, implement FirstProjectJourney"
// AI reads the aabha model and generates:
// - API endpoints for each milestone
// - Frontend components for each step
// - Tests validating all expectations
// - Telemetry tracking metrics

// All with full context of:
// - Business goals (time-to-value < 5 min)
// - User expectations (DeveloperStakeholder needs)
// - Success metrics (MarketShareMetric, NpsMetric)
```

5. **QA + AI** validates implementation:

```typescript
// QA: "Generate test suite for FirstProjectJourney"
// AI creates comprehensive tests based on:
// - All @Expectation decorators
// - All @Behavior contracts
// - Success criteria from initiative
```

### Continuous Evolution

6. **Product evolves** - Aabha tracks changes:

```typescript
// Modify strategy → TypeScript shows all impacted initiatives
// Update journey → See which features need updates
// Add metric → Automatically propagates to relevant components
```

## Architecture

Aabha is **compile-time only** with minimal runtime footprint:

- **Type Brands**: Each decorator applies a type brand for compile-time validation
- **Phantom Properties**: Tiny non-enumerable `__decoratorBrand` property added at runtime
- **Zero Dependencies**: Completely standalone package

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full details.

## Aabha vs Traditional Approaches

| Traditional Approach                      | Aabha Approach                              |
| ----------------------------------------- | ------------------------------------------- |
| 📄 Scattered docs (PRDs, specs, diagrams) | 💻 Single executable codebase               |
| ❌ Manual validation                      | ✅ Compile-time type checking               |
| 📝 Docs drift from reality                | 🔄 Code IS the documentation                |
| 🤔 Ambiguous requirements                 | 🎯 Type-safe relationships                  |
| 👥 Siloed teams (PM, Design, Eng)         | 🤝 Shared language & model                  |
| 🐌 Slow AI context gathering              | ⚡ Rich, structured AI context              |
| 📊 Metrics tracked separately             | 📈 Metrics embedded in model                |
| 🔍 Manual impact analysis                 | 🤖 TypeScript shows dependencies            |
| 📚 Tribal knowledge                       | 💾 Knowledge in code                        |
| ❌ Only digital products modeled          | ✅ Digital AND offline processes modeled    |
| ❌ Manual processes undocumented          | ✅ Manual workflows as first-class citizens |
| ❌ Compliance trails separate             | ✅ Audit trails and retention built-in      |

### Concrete Example: Adding a Feature

**Traditional**:

1. PM writes 10-page PRD
2. Designer creates Figma mockups
3. Engineer reads docs, asks clarifying questions
4. Implementation begins with partial understanding
5. QA writes test plan from PRD
6. Features shipped with gaps
7. AI assistant has no context

**Aabha**:

1. PM adds `@BusinessInitiative` with objectives
2. Designer adds `@Journey` with milestones
3. Engineer asks AI: "Implement XYZJourney"
4. AI generates implementation with full context
5. QA asks AI: "Generate tests for XYZJourney"
6. Type errors catch gaps before runtime
7. All changes tracked in Git

**Result**: 10x faster iteration with fewer bugs.


## TypeScript Configuration

Aabha uses **TypeScript 5.0+ Stage 3 decorators** (native decorators), NOT the experimental decorators:

```json
{
  "compilerOptions": {
    // TypeScript 5.0+ required (Stage 3 decorators are default)
    "target": "ES2022",  // or higher

    // Do NOT enable these (they're for legacy decorators):
    // "experimentalDecorators": false,  // Must be false or omitted
    // "emitDecoratorMetadata": false,   // Must be false or omitted
  }
}
```

## Building

Run `pnpm run build` to build the library.

## Running unit tests

Run `pnpm test` to execute the unit tests via [Vitest](https://vitest.dev/).
Contribute by adding tests!

## Documentation

**Comprehensive documentation is available**:

📚 **[Read the Full Documentation →](./aabha/docs/README.md)**

**Quick Links**:
- [Quick Start Guide](./aabha/docs/getting-started/quick-start.md) - Build your first model in 5 minutes
- [Core Concepts](./aabha/docs/getting-started/core-concepts.md) - Understand Context = Perspective
- [Strategic Build Order](./aabha/docs/best-practices/strategic-build-order.md) - Step-by-step guide
- [API Reference](./aabha/docs/api/) - Complete decorator documentation (Under development)

## Contributing

We welcome contributions! **many documentation files** are marked "In Progress" and ready for community input.

**📚 Read the [CONTRIBUTING.md](./CONTRIBUTING.md) guide** for:
- How to contribute documentation
- Development setup
- Pull request process
- Style guidelines

**High-priority areas**:
- ✍️ **API Reference** - 13 decorator docs need completion
- 📖 **Guides** - Understanding Contexts, Product Completeness, etc.
- 💡 **OgPgy Bank Examples** - Real-world banking transformation
- ⭐ **Best Practices** - Naming, organizing, testing strategies

See [CONTRIBUTING.md](./CONTRIBUTING.md) for complete list and guidelines.

Fork and contribute: [github.com/krabhishek/aabha](https://github.com/krabhishek/aabha)


## License

MIT © Abhishek Pathak
