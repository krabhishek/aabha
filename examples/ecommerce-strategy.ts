/**
 * E-Commerce Strategy Example
 *
 * This example demonstrates blueprint's compile-time type safety.
 * Type errors will be caught during compilation, not at runtime.
 *
 * @module blueprint/examples
 */

import {
  Strategy,
  BusinessInitiative,
  Journey,
  Milestone,
  Step,
  Expectation,
  Stakeholder,
  Persona,
  Behavior,
  Test,
  Metric,
  Context,
  ExpectationPriority,
  ContextRelationship,
  TestType,
} from '../src/index.js';

// ============================================================================
// LEVEL 1: PERSONAS (Who people are)
// ============================================================================

@Persona({
  name: 'Tech-Savvy Millennial',
  age: '25-35',
  occupation: 'Software Engineer',
  goals: [
    'Quick online shopping',
    'Seamless checkout experience',
    'Track order in real-time',
  ],
  painPoints: [
    'Slow checkout processes',
    'Complex payment flows',
    'Lack of order tracking',
  ],
  technicalProficiency: 'high',
  preferredChannels: ['mobile app', 'web'],
})
class TechSavvyMillennial {}

// ============================================================================
// LEVEL 2: CONTEXTS (Where they operate)
// ============================================================================

@Context({
  name: 'E-Commerce',
  goals: ['Maximize conversion', 'Minimize cart abandonment'],
  responsibilities: ['Product catalog', 'Checkout flow', 'Order fulfillment'],
})
class ECommerceContext {}

@Context({
  name: 'Payment',
  relationships: [
    {
      context: ECommerceContext,
      type: ContextRelationship.Upstream,
      description: 'Receives payment requests from e-commerce',
      exchanged: ['payment details', 'order totals'],
    },
  ],
})
class PaymentContext {}

// ============================================================================
// LEVEL 3: STAKEHOLDERS (What they do in contexts)
// ============================================================================

@Stakeholder({
  role: 'Customer',
  persona: TechSavvyMillennial,
  context: ECommerceContext,
  goals: ['Complete purchase quickly', 'Get order confirmation'],
  permissions: ['browse_products', 'add_to_cart', 'checkout'],
})
class CustomerStakeholder {}

@Stakeholder({
  role: 'Payment Processor',
  persona: TechSavvyMillennial, // In real scenario, might be different persona
  context: PaymentContext,
  responsibilities: ['Process payments', 'Handle failures', 'Issue receipts'],
})
class PaymentProcessorStakeholder {}

// ============================================================================
// LEVEL 4: METRICS (What we measure)
// ============================================================================

@Metric({
  name: 'Cart Abandonment Rate',
  target: 30,
  unit: '%',
  thresholds: {
    healthy: 30,
    warning: 40,
    critical: 50,
  },
  calculation: '(abandoned_carts / total_carts) * 100',
  frequency: 'real-time',
})
class CartAbandonmentRate {}

@Metric({
  name: 'Checkout Conversion Rate',
  target: 85,
  unit: '%',
  thresholds: {
    healthy: 85,
    warning: 75,
    critical: 65,
  },
})
class CheckoutConversionRate {}

// ============================================================================
// LEVEL 5: STRATEGY (Where to play, how to win)
// ============================================================================

@Strategy({
  name: 'E-Commerce Growth Strategy 2025',
  whereToPlay: [
    'Direct-to-Consumer E-commerce',
    'Mobile-first shopping',
    'North America & Europe',
  ],
  howToWin: 'Fastest, most seamless checkout experience in the market',
  coreCapabilities: [
    'One-click checkout',
    'Real-time inventory',
    'AI-powered recommendations',
  ],
  metrics: [CartAbandonmentRate, CheckoutConversionRate],
  timeHorizon: '2025-2027',
})
class ECommerceGrowthStrategy {}

// ============================================================================
// LEVEL 6: TESTS (Verification)
// ============================================================================

@Test({
  name: 'Positive Amount Validation Test',
  type: TestType.Unit,
  given: ['Amount is a positive number'],
  when: ['Validation is executed'],
  then: ['Validation returns true', 'No errors are thrown'],
})
class PositiveAmountTest {}

@Test({
  name: 'Cart Total Calculation Test',
  type: TestType.Unit,
  given: ['Cart has multiple items with quantities'],
  when: ['Total is calculated'],
  then: ['Total equals sum of (price × quantity) for all items'],
})
class CartTotalTest {}

// ============================================================================
// LEVEL 7: BEHAVIORS (How expectations are met)
// ============================================================================

@Behavior({
  name: 'Validate Cart Amount',
  tests: [PositiveAmountTest, CartTotalTest],
  preconditions: ['Cart has items', 'Prices are valid'],
  postconditions: ['Cart total is calculated', 'Amount is positive'],
})
class ValidateCartAmountBehavior {}

@Behavior({
  name: 'Process Payment',
  tests: [PositiveAmountTest],
  preconditions: ['Payment method is valid', 'Amount is positive'],
  postconditions: ['Payment is processed', 'Order is confirmed'],
})
class ProcessPaymentBehavior {}

// ============================================================================
// LEVEL 8: EXPECTATIONS (What stakeholders expect)
// ============================================================================

@Expectation({
  expectationId: 'checkout-EXP-001',
  description: 'Given a valid cart, When checking out, Then cart total should be accurate',
  stakeholder: CustomerStakeholder,
  behaviors: [ValidateCartAmountBehavior],
  priority: ExpectationPriority.Critical,
  acceptanceCriteria: [
    'Cart total includes all items',
    'Cart total includes taxes',
    'Cart total includes shipping',
  ],
})
class AccurateCartTotalExpectation {}

@Expectation({
  expectationId: 'checkout-EXP-002',
  description: 'Given valid payment details, When submitting payment, Then payment should be processed successfully',
  stakeholder: CustomerStakeholder,
  behaviors: [ProcessPaymentBehavior],
  priority: ExpectationPriority.Critical,
})
class SuccessfulPaymentExpectation {}

// ============================================================================
// LEVEL 9: STEPS (Granular actions)
// ============================================================================

@Step({
  name: 'Review Cart',
  actor: CustomerStakeholder,
  expectations: [AccurateCartTotalExpectation],
  order: 1,
})
class ReviewCartStep {}

@Step({
  name: 'Enter Payment Details',
  actor: CustomerStakeholder,
  expectations: [SuccessfulPaymentExpectation],
  order: 2,
})
class EnterPaymentDetailsStep {}

@Step({
  name: 'Confirm Order',
  actor: CustomerStakeholder,
  order: 3,
})
class ConfirmOrderStep {}

// ============================================================================
// LEVEL 10: MILESTONES (Business-significant achievements)
// ============================================================================

@Milestone({
  name: 'Cart Validated',
  stakeholder: CustomerStakeholder,
  steps: [
    { step: ReviewCartStep, order: 1 },
  ],
  expectations: [AccurateCartTotalExpectation],
  businessEvent: 'cart.validated',
})
class CartValidatedMilestone {}

@Milestone({
  name: 'Payment Processed',
  stakeholder: PaymentProcessorStakeholder,
  steps: [
    { step: EnterPaymentDetailsStep, order: 1 },
    { step: ConfirmOrderStep, order: 2 },
  ],
  expectations: [SuccessfulPaymentExpectation],
  businessEvent: 'payment.processed',
})
class PaymentProcessedMilestone {}

// ============================================================================
// LEVEL 11: JOURNEYS (User experience flows)
// ============================================================================

@Journey({
  name: 'Checkout Journey',
  primaryStakeholder: CustomerStakeholder,
  slug: 'checkout',
  milestones: [
    { milestone: CartValidatedMilestone, order: 1 },
    { milestone: PaymentProcessedMilestone, order: 2 },
  ],
  participatingStakeholders: [CustomerStakeholder, PaymentProcessorStakeholder],
  metrics: [CartAbandonmentRate, CheckoutConversionRate],
  outcomes: ['Order placed successfully', 'Payment confirmed'],
})
class CheckoutJourney {}

// ============================================================================
// LEVEL 12: BUSINESS INITIATIVES (Strategic initiatives)
// ============================================================================

@BusinessInitiative({
  name: 'Seamless Checkout Experience',
  strategy: ECommerceGrowthStrategy,
  journeys: [CheckoutJourney],
  metrics: [CartAbandonmentRate, CheckoutConversionRate],
  objectives: [
    'Reduce cart abandonment to 30%',
    'Increase checkout conversion to 85%',
  ],
  timeline: {
    startDate: '2025-Q1',
    endDate: '2025-Q3',
    milestones: [
      { name: 'MVP Launch', targetDate: '2025-03-15' },
      { name: 'Full Rollout', targetDate: '2025-06-30' },
    ],
  },
})
class SeamlessCheckoutInitiative {}

// ============================================================================
// COMPILE-TIME TYPE SAFETY DEMONSTRATIONS
// ============================================================================

// ✅ VALID: All types are correctly branded
const validInitiative = SeamlessCheckoutInitiative;
const validJourney = CheckoutJourney;
const validMetric = CartAbandonmentRate;

// ❌ COMPILE ERROR EXAMPLES (uncomment to see type errors):

// @BusinessInitiative({
//   name: 'Invalid Initiative',
//   strategy: CheckoutJourney, // ❌ ERROR: CheckoutJourney is not a Strategy!
//   journeys: [ECommerceGrowthStrategy], // ❌ ERROR: Strategy is not a Journey!
// })
// class InvalidInitiative {}

// @Journey({
//   name: 'Invalid Journey',
//   primaryStakeholder: TechSavvyMillennial, // ❌ ERROR: Persona is not a Stakeholder!
//   milestones: [
//     { milestone: CustomerStakeholder, order: 1 }, // ❌ ERROR: Stakeholder is not a Milestone!
//   ],
// })
// class InvalidJourney {}

// @Stakeholder({
//   role: 'Invalid Stakeholder',
//   persona: CustomerStakeholder, // ❌ ERROR: Stakeholder is not a Persona!
//   context: TechSavvyMillennial, // ❌ ERROR: Persona is not a Context!
// })
// class InvalidStakeholder {}

console.log('✅ Blueprint example compiled successfully!');
console.log('✅ All type constraints are satisfied at compile time!');
console.log('✅ Zero runtime overhead - decorators only apply type brands!');
