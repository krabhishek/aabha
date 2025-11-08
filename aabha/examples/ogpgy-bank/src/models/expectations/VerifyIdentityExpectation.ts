import { Expectation, ExpectationCategory, ExpectationComplexity, ExpectationStakeholderRelationType, ExpectationVerificationLevel } from 'aabha';
import { DigitalCustomerStakeholder } from '../stakeholders/human/DigitalCustomerStakeholder.js';
import { IdentityVerificationBehavior } from '../behaviors/IdentityVerificationBehavior.js';
import { StartAccountApplicationAction } from '../actions/StartAccountApplicationAction.js';

/**
 * Verify Identity Expectation
 * Customer expects real-time identity verification during account opening
 */
@Expectation({
  name: 'Real-Time Identity Verification',
  description: 'Customer identity is verified in real-time using government ID and biometric checks',
  provider: DigitalCustomerStakeholder,
  consumer: DigitalCustomerStakeholder,
  interaction: StartAccountApplicationAction,
  behaviors: [
    IdentityVerificationBehavior
  ],
  category: ExpectationCategory.Functional,
  complexity: ExpectationComplexity.Moderate,
  stakeholderRelationType: ExpectationStakeholderRelationType.B2C,
  verificationLevel: ExpectationVerificationLevel.Enforced,
  quality: {
    slo: {
      latency: {
        p95: '3s',
        p99: '5s',
        max: '10s'
      },
      availability: {
        target: '99.9%',
        errorBudget: '0.1%'
      }
    }
  },
  verification: {
    level: 'enforced',
    testCoverage: {
      minWitnessCoverage: 100,
      requiredScenarios: {
        happyPath: true,
        errorScenarios: [
          'Invalid document rejection',
          'Timeout handling'
        ],
        edgeCases: [
          'Expired ID documents',
          'Poor image quality'
        ]
      }
    },
    acceptanceTesting: {
      approach: 'fully-automated',
      tools: ['Jest', 'Playwright'],
      frequency: 'per-commit'
    }
  }
})
export class VerifyIdentityExpectation {}


