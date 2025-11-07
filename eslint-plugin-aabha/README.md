# eslint-plugin-aabha

**ESLint plugin for Aabha** - Ensures your context engineering models follow best practices and catch common mistakes at development time.

The `eslint-plugin-aabha` provides **111 validation rules** across all Aabha decorators, helping you maintain high-quality, AI-comprehensible context models with real-time feedback in your IDE.

## Why Use This Plugin?

### 🎯 Context Engineering Quality

Aabha enables **systematic context engineering at enterprise scale**. The ESLint plugin ensures your models maintain the rigor and consistency needed for AI systems to comprehend your enterprise context efficiently:

- **Compile-Time Validation** - Catch context engineering mistakes before they propagate
- **Best Practice Enforcement** - Ensure decorators follow Aabha patterns and conventions
- **AI Readiness** - Validate that your models provide rich, structured context for AI assistants
- **Real-Time Feedback** - Get instant validation in your IDE as you write Aabha models

### 🚀 Developer Experience

- **Automatic Fixes** - Many rules include auto-fix capabilities to resolve common issues
- **Helpful Messages** - Clear error messages explain what's wrong and how to fix it
- **Type-Safe Validation** - Leverages TypeScript AST for accurate rule detection
- **Zero Configuration** - Use the recommended config for sensible defaults

### 📊 Comprehensive Coverage

The plugin validates **all 13 core Aabha decorators (aabha:^1.1.0)**:

- `@Strategy` - Strategy completeness, governance, metrics alignment
- `@BusinessInitiative` - Required fields, budget validation, timeline consistency
- `@Context` - Boundary validation, naming conventions, relationship consistency
- `@Journey` - Entry actions, metrics relevance, outcomes measurability
- `@Stakeholder` - Engagement completeness, role definition, strategic alignment
- `@Persona` - Identity completeness, needs-goals alignment, type consistency
- `@Expectation` - SLO validation, verification coverage, provider-consumer contracts
- `@Interaction` - Layer-config matching, protocol validation, error code uniqueness
- `@Collaboration` - Participant validation, artifact ownership, decision-making
- `@Action` - Event naming, scope alignment, trigger validation, retry-timeout pairing
- `@Behavior` - Complexity alignment, postconditions quality, witness coverage
- `@Witness` - BDD completeness, fixture validation, execution consistency
- `@Metric` - Baseline requirements, target alignment, threshold ordering

## Installation

```bash
npm install --save-dev eslint-plugin-aabha
# or
yarn add -D eslint-plugin-aabha
# or
pnpm add -D eslint-plugin-aabha
```

## Configuration

### Flat Config (Recommended)

```javascript
// eslint.config.js
import aabhaPlugin from 'eslint-plugin-aabha';

export default [
  {
    plugins: {
      aabha: aabhaPlugin,
    },
    rules: {
      // Use recommended rules (sensible defaults)
      ...aabhaPlugin.configs.recommended.rules,
      
      // Or use all rules (maximum strictness)
      // ...aabhaPlugin.configs.all.rules,
    },
  },
];
```

### Legacy ESLint Config

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['aabha'],
  extends: ['plugin:aabha/recommended'],
};
```

## Rule Categories

### Strategy Rules (3 rules)

Ensures strategies follow the complete "Playing to Win" framework and have proper governance:

- `strategy-metrics-required` - Strategies must define metrics to measure success
- `strategy-p2w-completeness` - Validates all 5 Playing to Win framework elements
- `strategy-governance-completeness` - Ensures owner, review cycle, and review dates

**Example**:
```typescript
// ❌ Error: Missing metrics
@Strategy({
  name: 'Growth Strategy',
  winningAspiration: 'Become market leader',
})
class GrowthStrategy {}

// ✅ Valid
@Strategy({
  name: 'Growth Strategy',
  winningAspiration: 'Become market leader',
  metrics: [MarketShareMetric, RevenueMetric],
  owner: 'CEO',
  reviewCycle: 'Quarterly',
  lastReviewed: '2025-01-15',
  nextReview: '2025-04-15',
})
class GrowthStrategy {}
```

### Stakeholder Rules (6 rules)

Validates stakeholder definitions for completeness and strategic alignment:

- `stakeholder-strategic-alignment` - Critical stakeholders need business value and risks
- `stakeholder-role-definition` - Ensures goals, responsibilities, and accountability
- `stakeholder-engagement-completeness` - Validates engagement frequency and touchpoints
- `stakeholder-influence-consistency` - High-influence stakeholders need complete documentation
- `stakeholder-metrics-tracking` - Ensures stakeholders have metrics or KPIs
- `stakeholder-relationship-reciprocity` - Suggests reciprocal relationships

**Example**:
```typescript
// ❌ Error: Missing role definition
@Stakeholder({
  role: 'Customer',
  strategicImportance: 'critical',
})
class CustomerStakeholder {}

// ✅ Valid
@Stakeholder({
  role: 'Customer',
  strategicImportance: 'critical',
  goals: ['Quick service', 'Fair pricing'],
  responsibilities: ['Provide requirements', 'Review deliverables'],
  accountability: ['Project success', 'Timeline adherence'],
  businessValue: 'Primary revenue source',
  risks: [{ risk: 'Churn', likelihood: 'medium', impact: 'high' }],
  engagement: 'weekly',
  touchpoints: ['Weekly sync', 'Email updates'],
})
class CustomerStakeholder {}
```

### Metric Rules (8 rules)

Ensures metrics are properly defined with baselines, targets, and thresholds:

- `metric-baseline-required` - Metrics must have baseline values
- `metric-target-alignment` - Targets must align with direction (higher/lower-is-better)
- `metric-threshold-ordering` - Thresholds must be ordered correctly
- `metric-owner-assignment` - Metrics need owners for accountability
- `metric-calculation-method` - Metrics must describe how they're computed
- `metric-data-source-tracking` - Metrics need data source information
- `metric-goal-context` - Metrics should have strategic goal context
- `metric-hierarchy-consistency` - Aggregated metrics need aggregation methods

**Example**:
```typescript
// ❌ Error: Target misaligned with direction
@Metric({
  name: 'Cart Abandonment Rate',
  direction: 'lower-is-better',
  baseline: 45,
  target: 50, // ❌ Should be < 45 for lower-is-better
})
class CartAbandonmentRate {}

// ✅ Valid
@Metric({
  name: 'Cart Abandonment Rate',
  direction: 'lower-is-better',
  baseline: 45,
  target: 30,
  thresholds: { critical: 50, warning: 40, healthy: 30 },
  owner: 'Product Team',
  calculation: '(abandoned_carts / total_carts) * 100',
  dataSource: { system: 'Google Analytics' },
  goal: { goal: 'Reduce cart abandonment' },
})
class CartAbandonmentRate {}
```

### Witness Rules (14 rules)

Validates test witnesses follow BDD structure and have proper configuration:

- `witness-type-required` - Witnesses must specify type (Unit, Integration, E2E, etc.)
- `witness-belongs-to-behavior` - Witnesses must be in @Behavior classes
- `witness-bdd-completeness` - Validates complete BDD structure (given/when/then)
- `witness-timeout-reasonable` - Timeouts must be reasonable for test type
- `witness-fixture-method-exists` - Fixture methods must exist in behavior class
- `witness-fixtures-validation` - Validates fixture structure and types
- `witness-dependency-exists` - Dependencies must reference existing witnesses
- `witness-priority-risk-alignment` - Priority and risk levels must be aligned
- `witness-coverage-traceability` - High-risk witnesses need traceability info
- `witness-execution-consistency` - Execution settings must be consistent
- `witness-isolation-parallel-consistency` - Isolation and parallel settings compatibility
- `witness-mock-consistency` - Integration tests should declare mocks
- `witness-scenario-quality` - Scenarios must be descriptive and meaningful
- `witness-skip-documented` - Skipped witnesses must explain why

**Example**:
```typescript
// ❌ Error: Missing BDD structure
@Witness({
  name: 'Test checkout',
  type: WitnessType.Unit,
})
testCheckout() {}

// ✅ Valid
@Witness({
  name: 'Test checkout',
  type: WitnessType.Unit,
  given: ['User is authenticated', 'Cart has items'],
  when: ['User clicks checkout', 'Payment is processed'],
  then: ['Order is created', 'Confirmation email sent'],
  scenario: 'User successfully completes checkout with valid payment',
  timeout: 5000,
})
testCheckout() {}
```

### Action Rules (11 rules)

Validates action decorators for consistency and best practices:

- `action-event-naming` - Domain events must use past tense verbs
- `action-scope-properties-alignment` - Scope properties must align correctly
- `action-automation-actor-alignment` - Automation actors must be valid
- `action-criticality-skip-conflict` - Critical actions shouldn't be skipped
- `action-trigger-cycle-detection` - Detects circular trigger dependencies
- `action-fallback-exists` - Actions should have fallback strategies
- `action-retry-timeout-pairing` - Retries need appropriate timeouts
- `action-parallel-group-consistency` - Parallel groups must be consistent
- `action-conditional-triggers` - Conditional triggers must be valid
- `action-compensation-pattern` - Compensation patterns must be defined
- `action-duration-realism` - Action durations must be realistic

### Behavior Rules (8 rules)

Validates behavior implementations for quality and completeness:

- `behavior-complexity-alignment` - Complexity must match implementation
- `behavior-validation-consistency` - Validation must be consistent
- `behavior-witness-coverage` - Behaviors need witness test coverage
- `behavior-preconditions-quality` - Preconditions must be well-defined
- `behavior-postconditions-quality` - Postconditions must be clear
- `behavior-implementation-quality` - Implementation must match specification
- `behavior-performance-validation` - Performance requirements must be validated
- `behavior-tracing-configuration` - Tracing must be properly configured

### Context Rules (6 rules)

Validates context definitions for completeness:

- `context-boundary-required` - Contexts must have boundaries
- `context-capability-structure` - Capabilities must be properly structured
- `context-naming-convention` - Context names must follow conventions
- `context-description-quality` - Descriptions must be meaningful
- `context-metrics-required` - Contexts should have metrics
- `context-relationship-consistency` - Relationships must be consistent

### Business Initiative Rules (6 rules)

Validates business initiatives for completeness:

- `initiative-required-fields` - Initiatives must have name and description
- `initiative-strategy-alignment` - Initiatives must align with strategy
- `initiative-no-journeys` - Initiatives should have journeys
- `initiative-budget-breakdown` - Budget breakdowns must be valid
- `initiative-timeline-validation` - Timelines must be realistic
- `initiative-metrics-consistency` - Metrics must be consistent

### Collaboration Rules (14 rules)

Validates collaboration decorators for multi-stakeholder processes:

- `collaboration-required-participants` - Collaborations need required participants
- `collaboration-success-criteria` - Collaborations need success criteria
- `collaboration-artifact-ownership` - Artifacts must have owners
- `collaboration-artifacts-completeness` - Artifacts must be complete
- `collaboration-decision-making-approach` - Decision-making must be defined
- `collaboration-decision-making-quorum` - Quorum requirements must be valid
- `collaboration-duration-realism` - Durations must be realistic
- `collaboration-frequency-duration-alignment` - Frequency and duration must align
- `collaboration-location-type-validation` - Location types must be valid
- `collaboration-minimum-participants` - Minimum participants must be met
- `collaboration-outcome-responsibility` - Outcomes must have responsible parties
- `collaboration-participant-role-validation` - Participant roles must be valid
- `collaboration-scheduling-lead-time` - Scheduling must have lead time
- `collaboration-synchronicity-channel-matching` - Synchronicity and channels must match

### Expectation Rules (7 rules)

Validates expectation contracts for completeness:

- `expectation-provider-consumer-distinct` - Provider and consumer must be different
- `expectation-no-self-reference` - Expectations shouldn't reference themselves
- `expectation-verification-level-coverage` - Verification levels must be appropriate
- `expectation-additional-interactions-unique-roles` - Additional interactions need unique roles
- `expectation-additional-stakeholders-unique-roles` - Additional stakeholders need unique roles
- `expectation-observability-metrics-nonempty` - Observability metrics must be defined
- `expectation-slo-target-realism` - SLO targets must be realistic

### Interaction Rules (15 rules)

Validates interaction decorators for technical contracts:

- `interaction-participants-validation` - Participants must be valid
- `interaction-backend-resilience-timeouts` - Backend interactions need timeouts
- `interaction-error-code-uniqueness` - Error codes must be unique
- `interaction-layer-config-matching` - Layer and config must match
- `interaction-protocol-pattern-matching` - Protocol and pattern must match
- `interaction-interpersonal-duration-realism` - Interpersonal durations must be realistic
- `interaction-interpersonal-location-validation` - Interpersonal locations must be valid
- `interaction-interpersonal-synchronicity-channel` - Synchronicity and channel must match
- `interaction-layer-pattern-alignment` - Layer and pattern must align
- `interaction-manual-approval-workflow` - Manual approvals need workflows
- `interaction-manual-document-storage` - Manual interactions need document storage
- `interaction-manual-duration-estimation` - Manual durations must be estimated
- `interaction-organizational-compliance` - Organizational interactions need compliance
- `interaction-organizational-legal-framework` - Organizational interactions need legal framework
- `interaction-quality-slo-percentile-ordering` - SLO percentiles must be ordered correctly

### Journey Rules (3 rules)

Validates journey definitions:

- `journey-entry-actions-exist` - Entry actions must exist
- `journey-outcomes-measurable` - Outcomes must be measurable
- `journey-metrics-relevant` - Metrics must be relevant to journey

### Persona Rules (7 rules)

Validates persona definitions for completeness:

- `persona-identity-completeness` - Personas must have complete identity
- `persona-type-consistency` - Persona types must be consistent
- `persona-metrics-definition` - Personas should have metrics
- `persona-needs-goals-alignment` - Needs and goals must align
- `persona-psychology-depth` - Personas need psychological depth
- `persona-quote-validation` - Quotes must be valid
- `persona-system-attributes` - Personas need system attributes

### Naming Rules (3 rules)

General naming conventions:

- `component-naming-convention` - Components must follow naming conventions
- `required-description` - Components should have descriptions
- `stakeholder-naming-clarity` - Stakeholder names must be clear

## Auto-Fix Support

Many rules include automatic fixes. When you run ESLint with the `--fix` flag, the plugin will automatically resolve common issues:

```bash
# Fix auto-fixable issues
npx eslint --fix .

# Or with your package manager
pnpm eslint --fix .
```

**Rules with auto-fix**:
- `witness-type-required` - Adds `type: WitnessType.Unit` if missing
- `initiative-required-fields` - Adds missing description fields
- And more...

## Configuration Presets

### Recommended (Default)

Sensible defaults for production use. Critical rules are set to `error`, best practices to `warn`:

```javascript
import aabhaPlugin from 'eslint-plugin-aabha';

export default [
  {
    plugins: { aabha: aabhaPlugin },
    rules: {
      ...aabhaPlugin.configs.recommended.rules,
    },
  },
];
```

### All Rules (Maximum Strictness)

All 111 rules enabled as `error` for maximum validation:

```javascript
import aabhaPlugin from 'eslint-plugin-aabha';

export default [
  {
    plugins: { aabha: aabhaPlugin },
    rules: {
      ...aabhaPlugin.configs.all.rules,
    },
  },
];
```

## Integration with Aabha

The ESLint plugin is designed to work seamlessly with Aabha's type-safe decorators. It validates:

1. **Structural Completeness** - Ensures all required fields are present
2. **Relationship Validity** - Validates decorator relationships and references
3. **Best Practices** - Enforces Aabha patterns and conventions
4. **AI Readiness** - Ensures models provide rich context for AI systems

## Example: Complete Workflow

```typescript
// 1. Define a strategy (ESLint validates completeness)
@Strategy({
  name: 'Growth Strategy',
  winningAspiration: 'Become market leader',
  whereToPlay: ['SMB SaaS'],
  howToWin: 'Best developer experience',
  coreCapabilities: ['API design', 'Documentation'],
  managementSystems: ['Quarterly reviews'],
  metrics: [MarketShareMetric],
  owner: 'CEO',
  reviewCycle: 'Quarterly',
  lastReviewed: '2025-01-15',
  nextReview: '2025-04-15',
})
class GrowthStrategy {}

// 2. Define a metric (ESLint validates alignment)
@Metric({
  name: 'Market Share',
  direction: 'higher-is-better',
  baseline: 10,
  target: 25, // ✅ Valid: > baseline for higher-is-better
  thresholds: { critical: 5, warning: 15, healthy: 25 },
  owner: 'Product Team',
  calculation: '(our_customers / total_market) * 100',
  dataSource: { system: 'Analytics Platform' },
  goal: { goal: 'Increase market share' },
})
class MarketShareMetric {}

// 3. Define a witness (ESLint validates BDD structure)
@Behavior({
  name: 'User Registration',
  complexity: 'medium',
})
class UserRegistrationBehavior {
  @Witness({
    name: 'Test user registration',
    type: WitnessType.Unit, // ✅ Required field
    given: ['User is new', 'Email is valid'],
    when: ['Registration form is submitted'],
    then: ['User account is created', 'Welcome email is sent'],
    scenario: 'New user successfully registers with valid email',
    timeout: 5000,
  })
  testRegistration() {}
}
```

## Benefits

### 🎯 Context Engineering Quality

- **Systematic Validation** - Catch context engineering mistakes early
- **Consistency** - Enforce Aabha patterns across teams
- **Completeness** - Ensure all required context is captured

### 🤖 AI Readiness

- **Structured Context** - Validates that models provide rich context for AI
- **Relationship Integrity** - Ensures decorator relationships are valid
- **Metadata Completeness** - Validates that AI systems have all needed information

### ⚡ Developer Experience

- **Real-Time Feedback** - Get instant validation in your IDE
- **Automatic Fixes** - Many issues can be auto-fixed
- **Clear Messages** - Helpful error messages explain what's wrong

### 🏢 Enterprise Scale

- **Team Consistency** - All teams follow the same validation rules
- **Knowledge Quality** - Ensures enterprise context is properly engineered
- **Maintainability** - Catch issues before they propagate

## Contributing

Contributions are welcome! The plugin is part of the Aabha ecosystem. See the main [Aabha Contributing Guide](../CONTRIBUTING.md) for details.

## License

MIT © Abhishek Pathak
