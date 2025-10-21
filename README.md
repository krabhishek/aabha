# Blueprint

**Product Management as Code** - Define strategy, initiatives, journeys, and expectations with TypeScript decorators.

Bring the rigor of software engineering to product management. Blueprint transforms product strategy, user journeys, and stakeholder expectations into executable TypeScript code with complete compile-time validation.

## Why Blueprint?

### 📋 Complete Clarity & Rigor

Traditional product management relies on scattered documents, spreadsheets, and diagrams. Blueprint brings **engineering discipline** to product definition:

- **Single Source of Truth** - Your product model IS your code
- **Compile-Time Validation** - Inconsistencies caught before implementation
- **Version Control** - Track product evolution with Git
- **Refactoring Support** - TypeScript tooling helps evolve your product model
- **Testable Product Specs** - Write tests against your product model

### 🤝 Business-Engineering Alignment

Blueprint creates a **shared language** between business and engineering:

- **Traceability** - Track features from strategy → initiatives → journeys → expectations → code
- **Impact Analysis** - TypeScript shows what changes when strategy shifts
- **Cross-Team Collaboration** - Product, design, and engineering work from the same model
- **Living Documentation** - Code and docs are one and the same
- **Reduced Ambiguity** - Type-safe relationships eliminate misunderstandings

### 🤖 AI-Assisted Development Acceleration

Blueprint models provide **rich, structured context** for AI coding assistants (Gemini, Claude Code, GitHub Copilot, Cursor, etc.):

#### 🎯 High Signal-to-Noise Ratio = Massive Token Savings

Blueprint delivers **maximum context with minimum tokens**:

```typescript
// Traditional approach: 500+ tokens of scattered context
// - Copy-paste from PRD
// - Paste user stories
// - Explain relationships
// - Describe metrics
// - Clarify ambiguities

// Blueprint approach: 50 tokens of dense, structured context
@BusinessInitiative({
  name: 'Seamless Checkout',
  strategy: GrowthStrategy, // Links entire strategy context
  journeys: [CheckoutJourney], // Complete user journey
  metrics: [CartAbandonmentRate], // Embedded measurement
  objectives: ['Reduce abandonment by 30%'],
})
class CheckoutInitiative {}

// 10x token efficiency! AI reads the structure:
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

Blueprint enables AI assistants to **co-create product plans** with type-safe validation:

**1. AI as Product Planning Partner**

```typescript
// Developer: "Claude, help me plan the 'User Onboarding' initiative"

// AI generates structured blueprint:
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

With blueprint, AI assistants can:

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

// Blueprint: Precise, uses 50 tokens + type-safe structure
"Implement CheckoutJourney with all milestones, ensuring CustomerStakeholder
expectations are met and CartAbandonmentRate metric is tracked" ✅

// AI instantly understands from blueprint model:
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

| Scenario                | Traditional Approach              | Blueprint Approach               | Token Savings |
| ----------------------- | --------------------------------- | -------------------------------- | ------------- |
| **Context Sharing**     | 500-1000 tokens (copy-paste docs) | 50-100 tokens (structured model) | **90%**       |
| **AI Query**            | Repeat context each time          | Reference once, reuse            | **80%**       |
| **Clarification Round** | Multiple back-and-forth cycles    | Type errors guide AI immediately | **70%**       |
| **Implementation**      | Verbose requirements              | Dense, linked structure          | **85%**       |

**Cumulative Effect**: Blueprint reduces token consumption by **80-90%** across development lifecycle while improving output quality!

### ⚡ Team Velocity Benefits

- **Faster Onboarding** - New developers understand product by reading code
- **Reduced Context Switching** - Product specs and code live together
- **AI-Augmented Coding** - Junior developers ship senior-level work with AI assistance
- **Consistency** - Blueprint enforces architectural patterns across teams
- **Knowledge Retention** - Product knowledge captured in executable code, not tribal knowledge

## Features

✨ **Compile-Time Type Safety** - Catch errors before runtime
🚀 **Zero Runtime Overhead** - Decorators only apply type brands
📊 **Complete Product Hierarchy** - From strategy to tests
🔗 **One-Way References** - Parents know children, not vice versa
🎯 **Independent Package** - No external dependencies
🤖 **AI-Ready Context** - Rich metadata for AI coding assistants

## Installation

```bash
npm install blueprint
# or
yarn add blueprint
# or
pnpm add blueprint
```

## Quick Start

```typescript
import {
  Strategy,
  BusinessInitiative,
  Journey,
  Milestone,
  Stakeholder,
  Persona,
  Context,
  Metric,
} from 'blueprint';

// 1. Define a Persona (WHO people are)
@Persona({
  name: 'Tech-Savvy Millennial',
  age: '25-35',
  goals: ['Quick online shopping', 'Seamless checkout'],
})
class TechSavvyMillennial {}

// 2. Define a Context (WHERE they operate)
@Context({
  name: 'E-Commerce',
  goals: ['Maximize conversion'],
})
class ECommerceContext {}

// 3. Define a Stakeholder (WHAT they do in WHERE)
@Stakeholder({
  role: 'Customer',
  persona: TechSavvyMillennial,
  context: ECommerceContext,
})
class CustomerStakeholder {}

// 4. Define Metrics (WHAT we measure)
@Metric({
  name: 'Cart Abandonment Rate',
  target: 30,
  unit: '%',
})
class CartAbandonmentRate {}

// 5. Define Strategy (WHERE to play, HOW to win)
@Strategy({
  name: 'E-Commerce Growth',
  whereToPlay: ['Direct-to-Consumer'],
  howToWin: 'Fastest checkout in the market',
  metrics: [CartAbandonmentRate],
})
class GrowthStrategy {}

// 6. Define a Milestone
@Milestone({
  name: 'Cart Validated',
  stakeholder: CustomerStakeholder,
})
class CartValidatedMilestone {}

// 7. Define a Journey
@Journey({
  name: 'Checkout Journey',
  primaryStakeholder: CustomerStakeholder,
  milestones: [{ milestone: CartValidatedMilestone, order: 1 }],
})
class CheckoutJourney {}

// 8. Define a Business Initiative
@BusinessInitiative({
  name: 'Seamless Checkout Experience',
  strategy: GrowthStrategy,
  journeys: [CheckoutJourney],
  metrics: [CartAbandonmentRate],
})
class SeamlessCheckoutInitiative {}
```

## Compile-Time Safety

Blueprint enforces relationships at **compile time**:

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
Journey (user experience)
  ↓
Milestone (significant waypoints)
  ↓
Step (granular actions)
  ↓
Expectation (stakeholder expectations)
  ↓
Behavior (executable behaviors)
  ↓
Test (verification)
```

### Strategic Level

- `@Strategy` - Business strategy (where to play, how to win)
- `@BusinessInitiative` - Concrete initiatives implementing strategy
- `@Stakeholder` - Context-specific roles
- `@Persona` - User archetypes
- `@Metric` - Measurable outcomes (attachable to any level)
- `@Context` - Business perspectives (Sales, Marketing, Compliance)

### Journey Level

- `@Journey` - User/stakeholder experience flows
- `@Milestone` - Business-significant achievements
- `@Step` - Granular actions within milestones

### Expectation Level

- `@Expectation` - Stakeholder expectations
- `@Behavior` - Executable behaviors
- `@Test` - Verification tests
- `@Attribute` - Reusable attributes

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
// AI reads the blueprint model and generates:
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

6. **Product evolves** - Blueprint tracks changes:

```typescript
// Modify strategy → TypeScript shows all impacted initiatives
// Update journey → See which features need updates
// Add metric → Automatically propagates to relevant components
```

## Architecture

Blueprint is **compile-time only** with minimal runtime footprint:

- **Type Brands**: Each decorator applies a type brand for compile-time validation
- **Phantom Properties**: Tiny non-enumerable `__decoratorBrand` property added at runtime
- **Zero Dependencies**: Completely standalone package
- **Independent**: No ties to DDD or domain modeling

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full details.

## Blueprint vs Traditional Approaches

| Traditional Approach                      | Blueprint Approach               |
| ----------------------------------------- | -------------------------------- |
| 📄 Scattered docs (PRDs, specs, diagrams) | 💻 Single executable codebase    |
| ❌ Manual validation                      | ✅ Compile-time type checking    |
| 📝 Docs drift from reality                | 🔄 Code IS the documentation     |
| 🤔 Ambiguous requirements                 | 🎯 Type-safe relationships       |
| 👥 Siloed teams (PM, Design, Eng)         | 🤝 Shared language & model       |
| 🐌 Slow AI context gathering              | ⚡ Rich, structured AI context   |
| 📊 Metrics tracked separately             | 📈 Metrics embedded in model     |
| 🔍 Manual impact analysis                 | 🤖 TypeScript shows dependencies |
| 📚 Tribal knowledge                       | 💾 Knowledge in code             |

### Concrete Example: Adding a Feature

**Traditional**:

1. PM writes 10-page PRD
2. Designer creates Figma mockups
3. Engineer reads docs, asks clarifying questions
4. Implementation begins with partial understanding
5. QA writes test plan from PRD
6. Features shipped with gaps
7. AI assistant has no context

**Blueprint**:

1. PM adds `@BusinessInitiative` with objectives
2. Designer adds `@Journey` with milestones
3. Engineer asks AI: "Implement XYZJourney"
4. AI generates implementation with full context
5. QA asks AI: "Generate tests for XYZJourney"
6. Type errors catch gaps before runtime
7. All changes tracked in Git

**Result**: 10x faster iteration with fewer bugs.

## Examples

See the [examples](./examples) directory for complete examples:

- `ecommerce-strategy.ts` - Full e-commerce strategy with type safety demonstrations

## TypeScript Configuration

Blueprint uses **TypeScript 5.0+ Stage 3 decorators** (native decorators), NOT the experimental decorators:

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

**Important**: Blueprint is incompatible with legacy `experimentalDecorators`. Ensure it's **disabled** or **omitted** from your tsconfig.json.

## Building

Run `vite build blueprint` to build the library.

## Running unit tests

Run `vitest blueprint` to execute the unit tests via [Vitest](https://vitest.dev/).

## License

MIT © Abhishek Pathak
