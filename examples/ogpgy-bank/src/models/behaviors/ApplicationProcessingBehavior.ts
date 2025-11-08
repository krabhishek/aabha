import { Behavior, BehaviorComplexity, BehaviorScope, BehaviorReusability, Witness, WitnessType, WitnessPriority } from 'aabha';
import { AccountSystemStakeholder } from '../stakeholders/system/AccountSystemStakeholder.js';
import { ComplianceSystemStakeholder } from '../stakeholders/system/ComplianceSystemStakeholder.js';

/**
 * Application Processing Behavior
 * Processes account application with automated decisioning and compliance checks
 */
@Behavior({
  name: 'Process Account Application',
  description: 'Automated processing of account application including KYC, AML, and credit checks',
  implementation: 'POST /api/accounts/process via Account Processing Service using Automated decisioning engine with ML models',
  preconditions: [
    'Application form is complete',
    'Identity is verified',
    'All required documents submitted'
  ],
  validation: {
    strictPreconditions: true,
    strictPostconditions: true,
    invariants: [
      'Application form must contain all required fields',
      'Identity verification must be completed before processing',
      'All required documents must be submitted and valid',
      'Processing must complete with clear decision',
      'Compliance checks must be executed in correct order'
    ]
  },
  postconditions: [
    'Application approved or rejected',
    'Decision reason recorded',
    'Compliance checks completed',
    'Account created if approved'
  ],
  performance: {
    expectedDuration: '2m',
    timeout: 300000,
    retries: 1
  },
  participants: [
    AccountSystemStakeholder,
    ComplianceSystemStakeholder
  ],
  sideEffects: [
    'Application decision recorded',
    'Account created if approved',
    'Customer notification sent',
    'Compliance audit trail created',
    'Application status updated',
    'Decision reason stored'
  ],
  complexity: BehaviorComplexity.Complex,
  scope: BehaviorScope.Atomic,
  reusability: BehaviorReusability.Reusable,
  tags: [
    'onboarding',
    'application-processing',
    'kyc',
    'aml',
    'compliance',
    'automated-decisioning',
    'reusable'
  ]
})
export class ApplicationProcessingBehavior {
  @Witness({
    name: 'Test Successful Application Processing',
    scenario: 'Successful Application Processing',  // TODO: Provide a descriptive scenario
    type: WitnessType.Integration,
    execution: {
      priority: WitnessPriority.Critical
    },
    given: [
      'Valid application with all required information',
      'Identity verified',
      'Passes all compliance checks'
    ],
    when: [
      'Application is submitted for processing'
    ],
    then: [
      'Returns approval decision',
      'Completes in < 2 minutes',
      'Account is created',
      'Customer notified of approval'
    ]
  })
  testSuccessfulProcessing() {}

  @Witness({
    name: 'Test Application Rejection',
    scenario: 'Application Rejection',  // TODO: Provide a descriptive scenario
    type: WitnessType.Integration,
    execution: {
      priority: WitnessPriority.High
    },
    given: [
      'Application fails compliance checks',
      'Or identity verification failed'
    ],
    when: [
      'Application is submitted for processing'
    ],
    then: [
      'Returns rejection decision',
      'Provides clear rejection reason',
      'Customer notified with next steps'
    ]
  })
  testApplicationRejection() {}
}


