import { Behavior, BehaviorComplexity, BehaviorScope, BehaviorReusability, Witness, WitnessType, WitnessPriority } from 'aabha';
import { AccountSystemStakeholder } from '../stakeholders/system/AccountSystemStakeholder.js';

/**
 * Account Activation Behavior
 * Activates approved account and enables banking functionality
 */
@Behavior({
  name: 'Activate Account',
  description: 'Immediately activates approved account and enables all banking features',
  implementation: 'POST /api/accounts/{id}/activate via Account Management Service using Core banking system integration',
  preconditions: [
    'Account is approved',
    'Account record exists',
    'Customer identity verified'
  ],
  validation: {
    strictPreconditions: true,
    strictPostconditions: true,
    invariants: [
      'Account must be in approved state before activation',
      'Account record must exist in system',
      'Identity verification must be completed and valid',
      'Activation must complete atomically',
      'Account number must be unique'
    ]
  },
  postconditions: [
    'Account is active',
    'Account number assigned',
    'Banking features enabled',
    'Customer can access account'
  ],
  performance: {
    expectedDuration: '1s',
    timeout: 5000,
    retries: 2
  },
  participants: [
    AccountSystemStakeholder
  ],
  sideEffects: [
    'Account status changed to active',
    'Account number assigned and stored',
    'Banking features enabled for customer',
    'Customer access permissions updated',
    'Account activation event published'
  ],
  complexity: BehaviorComplexity.Complex,
  scope: BehaviorScope.Atomic,
  reusability: BehaviorReusability.Reusable,
  tags: [
    'account-management',
    'activation',
    'critical-path',
    'system-integration',
    'reusable'
  ]
})
export class AccountActivationBehavior {
  @Witness({
    name: 'Test Successful Account Activation',
    scenario: 'Successful Account Activation',  // TODO: Provide a descriptive scenario
    type: WitnessType.Integration,
    execution: {
      priority: WitnessPriority.Critical
    },
    given: [
      'Approved account exists',
      'All prerequisites met'
    ],
    when: [
      'Account activation is requested'
    ],
    then: [
      'Account status changes to active',
      'Account number is assigned',
      'Customer can log in immediately',
      'Completes in < 1 second'
    ]
  })
  testSuccessfulActivation() {}

  @Witness({
    name: 'Test Account Access After Activation',
    scenario: 'Account Access After Activation',  // TODO: Provide a descriptive scenario
    type: WitnessType.E2E,
    execution: {
      priority: WitnessPriority.High
    },
    given: [
      'Account is activated',
      'Customer has login credentials'
    ],
    when: [
      'Customer attempts to log in'
    ],
    then: [
      'Login succeeds',
      'Account balance visible',
      'All features accessible',
      'Transaction capabilities enabled'
    ]
  })
  testAccountAccess() {}
}


