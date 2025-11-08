# How Action, Expectation, Interaction, Behavior, and Witness Work Together

This document explains how the five core decorators work together to model a complete journey using the **Instant Account Opening Journey** as an example.

## The Complete Picture

```
Journey
  └── Actions (the "what happens" - flow steps)
      └── Expectations (the "contracts" - what stakeholders expect)
          └── Interactions (the "how" - technical contracts)
          └── Behaviors (the "implementation" - what actually happens)
              └── Witnesses (the "tests" - how we verify it works)
```

## 1. Journey - The Container

**Journey** is the top-level container that defines the complete customer experience flow.

```typescript
@Journey({
  name: 'Instant Account Opening',
  primaryStakeholder: DigitalCustomerStakeholder,
  entryActions: [StartAccountApplicationAction],
  actions: [
    StartAccountApplicationAction,
    SubmitApplicationAction,
    ActivateAccountAction
  ],
  outcomes: [
    'Account opened successfully',
    'Account activated and ready to use'
  ],
  metrics: [AccountOpeningTime]
})
export class InstantAccountOpeningJourney {}
```

**Key Points:**
- **Journey** lists all **Actions** that are part of the flow
- **entryActions** define where the journey starts
- **outcomes** define what the journey achieves
- **metrics** track journey success

## 2. Actions - The Flow Steps

**Actions** represent the imperative steps in the journey - the "do this" commands that drive progress.

```typescript
@Action({
  name: 'Start Account Application',
  actor: DigitalCustomerStakeholder,
  scope: ActionScope.Journey,
  expectations: [VerifyIdentityExpectation],
  triggers: [
    { condition: 'formCompleted', action: SubmitApplicationAction }
  ],
  emitsEvent: 'account.application.started'
})
export class StartAccountApplicationAction {}
```

**Key Points:**
- **Actions** define **what happens** in sequence
- **triggers** create the flow graph (forward-looking DAG)
- **expectations** link to stakeholder contracts
- **emitsEvent** produces business events
- **actor** defines who performs the action

**Flow Example:**
```
StartAccountApplicationAction
  └── triggers → SubmitApplicationAction
      └── triggers → ActivateAccountAction
```

## 3. Expectations - The Contracts

**Expectations** represent contracts between stakeholders - what the provider commits to deliver and what the consumer expects to receive.

```typescript
@Expectation({
  name: 'Real-Time Identity Verification',
  provider: DigitalCustomerStakeholder,
  consumer: DigitalCustomerStakeholder,
  interaction: KYCVerificationServiceInteraction,
  behaviors: [IdentityVerificationBehavior],
  quality: {
    slo: { latency: { p95: '3s' }, availability: { target: '99.9%' } }
  },
  verification: {
    testCoverage: { minWitnessCoverage: 100 }
  }
})
export class VerifyIdentityExpectation {}
```

**Key Points:**
- **Expectations** define **stakeholder contracts**
- **provider** = who fulfills the expectation
- **consumer** = who benefits from the expectation
- **interaction** = the technical contract (HOW it's delivered)
- **behaviors** = the implementation (WHAT actually happens)
- **quality** = SLO/SLI targets
- **verification** = test coverage requirements

**Relationship:**
- **Actions** reference **Expectations** (actions fulfill expectations)
- **Expectations** reference **Interactions** (technical delivery mechanism)
- **Expectations** reference **Behaviors** (actual implementation)

## 4. Interactions - The Technical Contracts

**Interactions** define the technical contracts for how stakeholders exchange data across architectural layers.

```typescript
@Interaction({
  name: 'KYC Verification Service',
  pattern: InteractionPattern.RequestResponse,
  layer: InteractionLayer.External,
  inputs: [
    { name: 'documentImage', type: 'object', required: true },
    { name: 'personalInformation', type: 'object', required: true }
  ],
  outputs: [
    { name: 'verificationResult', type: 'object', required: true },
    { name: 'confidenceScore', type: 'number', required: true }
  ],
  protocol: {
    name: 'HTTP',
    http: { method: 'POST', path: '/api/v2/verify' }
  },
  quality: {
    slo: { latency: { p95: '2s' }, availability: { target: '99.5%' } }
  }
})
export class KYCVerificationServiceInteraction {}
```

**Key Points:**
- **Interactions** define **technical contracts** (API contracts, data contracts)
- **pattern** = how communication happens (RequestResponse, Event, etc.)
- **layer** = where it happens (Frontend, Backend, External, Data, etc.)
- **inputs/outputs** = data contract
- **protocol** = technical protocol (HTTP, gRPC, etc.)
- **quality** = technical SLOs

**Relationship:**
- **Expectations** reference **Interactions** as the primary delivery mechanism
- **Interactions** define the technical "how" for fulfilling expectations

## 5. Behaviors - The Implementation

**Behaviors** define the actual implementation logic - the "what actually happens" code that fulfills expectations.

```typescript
@Behavior({
  name: 'Verify Customer Identity',
  description: 'Real-time identity verification using government ID scanning',
  implementation: 'POST /api/identity/verify via Identity Verification Service',
  preconditions: [
    'Customer has government-issued ID',
    'Customer has device with camera'
  ],
  postconditions: [
    'Identity verified or rejected',
    'Verification result stored'
  ],
  participants: [IdentityVerificationServiceStakeholder],
  sideEffects: [
    'Identity verification result stored',
    'Compliance record created'
  ]
})
export class IdentityVerificationBehavior {
  @Witness({ ... })
  testSuccessfulVerification() {}
}
```

**Key Points:**
- **Behaviors** define **implementation logic**
- **preconditions/postconditions** = contract guarantees
- **implementation** = actual code/API/service
- **sideEffects** = what changes in the system
- **Witnesses** = tests that verify the behavior

**Relationship:**
- **Expectations** reference **Behaviors** (behaviors implement expectations)
- **Behaviors** contain **Witnesses** (tests verify behaviors)
- **Behaviors** are reusable across multiple expectations

## 6. Witnesses - The Tests

**Witnesses** are BDD-style tests that verify behaviors work correctly.

```typescript
@Witness({
  name: 'Test Successful Identity Verification',
  type: WitnessType.Integration,
  given: [
    'Valid government ID document',
    'Matching biometric data'
  ],
  when: [
    'Identity verification is requested'
  ],
  then: [
    'Returns verification success',
    'Completes in < 3 seconds',
    'Stores verification result'
  ]
})
testSuccessfulVerification() {}
```

**Key Points:**
- **Witnesses** define **test scenarios** (BDD Given/When/Then)
- **type** = test type (Unit, Integration, E2E)
- **given/when/then** = BDD scenario structure
- **Witnesses** verify **Behaviors** work correctly

**Relationship:**
- **Witnesses** are methods inside **Behaviors**
- **Witnesses** verify that behaviors meet their preconditions/postconditions
- **Expectations** define test coverage requirements that Witnesses fulfill

## Complete Flow Example

Here's how they all connect in the Instant Account Opening Journey:

### Step 1: Customer Starts Application
```
Journey: InstantAccountOpeningJourney
  └── Action: StartAccountApplicationAction
      └── Expectation: VerifyIdentityExpectation
          ├── Interaction: KYCVerificationServiceInteraction (technical contract)
          └── Behavior: IdentityVerificationBehavior (implementation)
              └── Witness: testSuccessfulVerification() (verification)
```

### Step 2: Customer Submits Application
```
Action: SubmitApplicationAction
  └── Expectation: ProcessApplicationExpectation
      ├── Interaction: ProcessAccountApplicationInteraction
      ├── Interaction: SubmitAccountApplicationAPIInteraction
      ├── Interaction: StoreAccountApplicationInteraction
      └── Behavior: ApplicationProcessingBehavior
          └── Witness: testSuccessfulProcessing()
```

### Step 3: System Activates Account
```
Action: ActivateAccountAction
  └── Expectation: AccountActivationExpectation
      ├── Interaction: ActivateAccountAPIInteraction
      ├── Interaction: UpdateAccountStatusInteraction
      └── Behavior: AccountActivationBehavior
          └── Witness: testSuccessfulActivation()
```

## Key Relationships Summary

1. **Journey → Actions**: Journey contains and orchestrates Actions
2. **Actions → Expectations**: Actions fulfill Expectations (stakeholder contracts)
3. **Expectations → Interactions**: Expectations define technical delivery via Interactions
4. **Expectations → Behaviors**: Expectations are implemented by Behaviors
5. **Behaviors → Witnesses**: Behaviors are verified by Witnesses (tests)

## Design Principles

1. **Separation of Concerns**:
   - **Journey** = business flow
   - **Actions** = flow steps
   - **Expectations** = stakeholder contracts
   - **Interactions** = technical contracts
   - **Behaviors** = implementation
   - **Witnesses** = verification

2. **Reusability**:
   - **Behaviors** can be reused across multiple Expectations
   - **Interactions** can be reused across multiple Expectations
   - **Actions** can reference multiple Expectations

3. **Traceability**:
   - Journey → Actions → Expectations → Interactions/Behaviors → Witnesses
   - Complete traceability from business goal to test

4. **One-Way Hierarchy**:
   - Expectations know about Behaviors, but Behaviors don't know about Expectations
   - This enables behavior reusability

## Benefits

1. **Clear Separation**: Business flow (Journey/Actions) separate from technical contracts (Interactions) and implementation (Behaviors)
2. **Stakeholder Focus**: Expectations clearly define who expects what
3. **Technical Clarity**: Interactions define exact technical contracts
4. **Implementation Guidance**: Behaviors provide implementation details
5. **Verification**: Witnesses ensure everything works
6. **Reusability**: Behaviors and Interactions can be reused
7. **Traceability**: Complete chain from business goal to test

This modeling approach enables AI systems to:
- Generate code from expectations and behaviors
- Generate tests from witnesses
- Generate API contracts from interactions
- Generate user flows from journeys and actions
- Understand stakeholder relationships
- Track dependencies and relationships

