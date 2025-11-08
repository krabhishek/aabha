import { Expectation, ExpectationCategory, ExpectationComplexity, ExpectationStakeholderRelationType, ExpectationVerificationLevel } from 'aabha';
import { DigitalCustomerStakeholder } from '../stakeholders/human/DigitalCustomerStakeholder.js';
import { AccountActivationBehavior } from '../behaviors/AccountActivationBehavior.js';
import { ActivateAccountAction } from '../actions/ActivateAccountAction.js';

/**
 * Account Activation Expectation
 * Customer expects immediate account activation after approval
 */
@Expectation({
  name: 'Immediate Account Activation',
  description: 'Approved account is activated instantly and ready for immediate use',
  provider: DigitalCustomerStakeholder,
  consumer: DigitalCustomerStakeholder,
  interaction: ActivateAccountAction,
  behaviors: [
    AccountActivationBehavior
  ],
  category: ExpectationCategory.Functional,
  complexity: ExpectationComplexity.Simple,
  stakeholderRelationType: ExpectationStakeholderRelationType.B2C,
  verificationLevel: ExpectationVerificationLevel.Enforced,
  quality: {
    slo: {
      latency: {
        p95: '1s',
        p99: '2s',
        max: '5s'
      },
      availability: {
        target: '99.99%',
        errorBudget: '0.01%'
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
          'Error handling for activation failures',
          'Account activation timeout'
        ],
        edgeCases: [
          'Concurrent activation requests',
          'Partial activation state'
        ]
      }
    },
    acceptanceTesting: {
      approach: 'fully-automated',
      tools: ['Jest', 'E2E test framework'],
      frequency: 'per-commit'
    }
  }
})
export class AccountActivationExpectation {}


