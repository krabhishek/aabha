import { Expectation, ExpectationCategory, ExpectationComplexity, ExpectationStakeholderRelationType, ExpectationVerificationLevel } from 'aabha';
import { DigitalCustomerStakeholder } from '../stakeholders/human/DigitalCustomerStakeholder.js';
import { AccountSystemStakeholder } from '../stakeholders/system/AccountSystemStakeholder.js';
import { ApplicationProcessingBehavior } from '../behaviors/ApplicationProcessingBehavior.js';
import { ProcessAccountApplicationInteraction } from '../interactions/backend/ProcessAccountApplicationInteraction.js';
import { SubmitAccountApplicationAPIInteraction } from '../interactions/backend/SubmitAccountApplicationAPIInteraction.js';
import { StoreAccountApplicationInteraction } from '../interactions/data/StoreAccountApplicationInteraction.js';
import { AccountOpeningTime } from '../metrics/AccountOpeningTime.js';

/**
 * Process Application Expectation
 * Customer expects fast processing and approval of account application
 */
@Expectation({
  name: 'Fast Application Processing',
  description: 'Account application is processed and approved automatically within minutes',
  provider: DigitalCustomerStakeholder,
  consumer: DigitalCustomerStakeholder,
  interaction: ProcessAccountApplicationInteraction,
  additionalInteractions: [
    {
      interaction: SubmitAccountApplicationAPIInteraction,
      role: 'api-submission',
      description: 'Frontend submits application via REST API'
    },
    {
      interaction: StoreAccountApplicationInteraction,
      role: 'data-persistence',
      description: 'Application data stored in database'
    }
  ],
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
      includeDetails: ['timestamp', 'actor', 'result', 'metrics', 'applicationId']
    }
  },
  businessContext: {
    strategicImportance: 'critical',
    impactAssessment: {
      revenueImpact: 'Fast processing enables instant account opening, increasing conversion by 25%',
      customerSatisfaction: 'Sub-5-minute processing improves customer experience and reduces abandonment',
      operationalEfficiency: 'Automated processing handles 1000+ applications/hour without manual intervention'
    },
    successMeasurement: {
      baseline: { value: '5 minutes', date: '2025-01-01' },
      target: { value: '2 minutes', date: '2025-06-01' },
      approachToMeasurement: 'Track average application processing time from submission to approval'
    },
    risks: [
      {
        description: 'High application volume may cause processing delays',
        probability: 'medium',
        impact: 'high',
        mitigation: 'Auto-scaling infrastructure and queue management'
      }
    ]
  },
  tags: ['application-processing', 'onboarding', 'automation', 'critical-path', 'customer-facing']
})
export class ProcessApplicationExpectation {}


