import { Behavior, BehaviorComplexity, BehaviorScope, BehaviorReusability, Witness, WitnessType, WitnessPriority } from 'aabha';
import { IdentityVerificationServiceStakeholder } from '../stakeholders/system/IdentityVerificationServiceStakeholder.js';

/**
 * Identity Verification Behavior
 * Verifies customer identity using government ID and biometric checks
 */
@Behavior({
  name: 'Verify Customer Identity',
  description: 'Real-time identity verification using government ID scanning and biometric authentication',
  implementation: 'POST /api/identity/verify via Identity Verification Service using AI-powered document verification + biometric matching',
  preconditions: [
    'Customer has government-issued ID',
    'Customer has device with camera',
    'Customer is in supported jurisdiction'
  ],
  validation: {
    strictPreconditions: true,
    strictPostconditions: true,
    invariants: [
      'Government-issued ID must be valid and current',
      'Device must have functioning camera',
      'Customer must be in supported jurisdiction',
      'Verification must complete with clear result',
      'Biometric data must match ID document'
    ]
  },
  postconditions: [
    'Identity verified or rejected',
    'Verification result stored',
    'Compliance checks completed'
  ],
  performance: {
    expectedDuration: '3s',
    timeout: 10000,
    retries: 2
  },
  participants: [
    IdentityVerificationServiceStakeholder
  ],
  sideEffects: [
    'Identity verification result stored',
    'Verification status updated',
    'Compliance record created',
    'Biometric data stored (if verified)',
    'Verification event published'
  ],
  complexity: BehaviorComplexity.Complex,
  scope: BehaviorScope.Atomic,
  reusability: BehaviorReusability.Reusable,
  tags: [
    'identity-verification',
    'kyc',
    'biometric',
    'document-verification',
    'compliance',
    'reusable'
  ]
})
export class IdentityVerificationBehavior {
  @Witness({
    name: 'Test Successful Identity Verification',
    scenario: 'Successful Identity Verification',  // TODO: Provide a descriptive scenario
    type: WitnessType.Integration,
    execution: {
      priority: WitnessPriority.Critical
    },
    given: [
      'Valid government ID document',
      'Matching biometric data',
      'Customer in supported jurisdiction'
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

  @Witness({
    name: 'Test Failed Identity Verification',
    scenario: 'Failed Identity Verification',  // TODO: Provide a descriptive scenario
    type: WitnessType.Integration,
    execution: {
      priority: WitnessPriority.High
    },
    given: [
      'Invalid or expired ID document',
      'Non-matching biometric data'
    ],
    when: [
      'Identity verification is requested'
    ],
    then: [
      'Returns verification failure',
      'Provides clear error message',
      'Allows retry with guidance'
    ]
  })
  testFailedVerification() {}
}


