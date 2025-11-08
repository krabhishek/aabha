import { Expectation, ExpectationCategory, ExpectationComplexity, ExpectationStakeholderRelationType, ExpectationVerificationLevel } from 'aabha';
import { DigitalCustomerStakeholder } from '../stakeholders/human/DigitalCustomerStakeholder.js';
import { ApplicationProcessingBehavior } from '../behaviors/ApplicationProcessingBehavior.js';
import { SubmitApplicationAction } from '../actions/SubmitApplicationAction.js';

/**
 * Process Application Expectation
 * Customer expects fast processing and approval of account application
 */
@Expectation({
  name: 'Fast Application Processing',
  description: 'Account application is processed and approved automatically within minutes',
  provider: DigitalCustomerStakeholder,
  consumer: DigitalCustomerStakeholder,
  interaction: SubmitApplicationAction,
  behaviors: [
    ApplicationProcessingBehavior
  ],
  category: ExpectationCategory.Functional,
  complexity: ExpectationComplexity.Complex,
  stakeholderRelationType: ExpectationStakeholderRelationType.B2C,
  verificationLevel: ExpectationVerificationLevel.Enforced,
  quality: {
    slo: {
      latency: {
        p95: '2m',
        p99: '3m',
        max: '5m'
      },
      availability: {
        target: '99.95%',
        errorBudget: '0.05%'
      }
    }
  },
  verification: {
    level: 'enforced',
    testCoverage: {
      minWitnessCoverage: 95,
      requiredScenarios: {
        happyPath: true,
        errorScenarios: [
          'Application rejection with clear reason',
          'KYC check failure handling',
          'AML compliance verification',
          'Timeout and retry scenarios'
        ],
        edgeCases: [
          'Partial application data',
          'Concurrent application submissions'
        ]
      }
    },
    acceptanceTesting: {
      approach: 'fully-automated',
      tools: ['Jest', 'Integration test framework'],
      frequency: 'continuous'
    }
  }
})
export class ProcessApplicationExpectation {}


