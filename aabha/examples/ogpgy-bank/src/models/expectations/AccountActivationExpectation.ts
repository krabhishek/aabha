import { Expectation, ExpectationCategory, ExpectationComplexity, ExpectationStakeholderRelationType, ExpectationVerificationLevel } from 'aabha';
import { DigitalCustomerStakeholder } from '../stakeholders/human/DigitalCustomerStakeholder.js';
import { AccountSystemStakeholder } from '../stakeholders/system/AccountSystemStakeholder.js';
import { AccountActivationBehavior } from '../behaviors/AccountActivationBehavior.js';
import { ActivateAccountAPIInteraction } from '../interactions/backend/ActivateAccountAPIInteraction.js';
import { UpdateAccountStatusInteraction } from '../interactions/data/UpdateAccountStatusInteraction.js';
import { AccountOpeningTime } from '../metrics/AccountOpeningTime.js';

/**
 * Account Activation Expectation
 * Customer expects immediate account activation after approval
 */
@Expectation({
  name: 'Immediate Account Activation',
  description: 'Approved account is activated instantly and ready for immediate use',
  provider: DigitalCustomerStakeholder,
  consumer: DigitalCustomerStakeholder,
  interaction: ActivateAccountAPIInteraction,
  additionalInteractions: [
    {
      interaction: UpdateAccountStatusInteraction,
      role: 'status-update',
      description: 'Account status updated in database to active'
    }
  ],
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
  },
  observability: {
    enabled: true,
    metrics: [AccountOpeningTime],
    alerts: {
      onSLOBreach: {
        severity: 'high',
        notifyStakeholders: [AccountSystemStakeholder],
        channel: 'slack'
      },
      onExpectationFailure: {
        severity: 'critical',
        notifyStakeholders: [AccountSystemStakeholder],
        channel: 'pagerduty'
      }
    },
    auditTrail: {
      enabled: true,
      retentionPeriod: '7y',
      includeDetails: ['timestamp', 'actor', 'result', 'metrics', 'accountNumber']
    }
  },
  businessContext: {
    strategicImportance: 'high',
    impactAssessment: {
      revenueImpact: 'Immediate activation enables instant banking, increasing customer engagement and transaction volume',
      customerSatisfaction: 'Instant activation eliminates waiting period, improving customer experience',
      operationalEfficiency: 'Automated activation reduces manual processing time to zero'
    },
    successMeasurement: {
      baseline: { value: '5 minutes', date: '2025-01-01' },
      target: { value: '< 1 second', date: '2025-06-01' },
      approachToMeasurement: 'Track time from approval to account activation completion'
    },
    risks: [
      {
        description: 'Database update failures may prevent activation',
        probability: 'low',
        impact: 'high',
        mitigation: 'Retry mechanism with exponential backoff and manual fallback process'
      }
    ]
  },
  tags: ['account-activation', 'onboarding', 'automation', 'critical-path', 'customer-facing']
})
export class AccountActivationExpectation {}


