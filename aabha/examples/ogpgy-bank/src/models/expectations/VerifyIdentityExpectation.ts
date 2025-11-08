import { Expectation, ExpectationCategory, ExpectationComplexity, ExpectationStakeholderRelationType, ExpectationVerificationLevel } from 'aabha';
import { DigitalCustomerStakeholder } from '../stakeholders/human/DigitalCustomerStakeholder.js';
import { ComplianceOfficerStakeholder } from '../stakeholders/human/ComplianceOfficerStakeholder.js';
import { IdentityVerificationBehavior } from '../behaviors/IdentityVerificationBehavior.js';
import { KYCVerificationServiceInteraction } from '../interactions/external/KYCVerificationServiceInteraction.js';
import { IDDocumentCaptureInteraction } from '../interactions/frontend/IDDocumentCaptureInteraction.js';
import { BiometricVerificationInteraction } from '../interactions/device/BiometricVerificationInteraction.js';
import { AccountOpeningTime } from '../metrics/AccountOpeningTime.js';

/**
 * Verify Identity Expectation
 * Customer expects real-time identity verification during account opening
 */
@Expectation({
  name: 'Real-Time Identity Verification',
  description: 'Customer identity is verified in real-time using government ID and biometric checks',
  provider: DigitalCustomerStakeholder,
  consumer: DigitalCustomerStakeholder,
  interaction: KYCVerificationServiceInteraction,
  additionalInteractions: [
    {
      interaction: IDDocumentCaptureInteraction,
      role: 'document-capture',
      description: 'Customer captures ID document using device camera'
    },
    {
      interaction: BiometricVerificationInteraction,
      role: 'biometric-verification',
      description: 'Customer verifies identity using device biometric authentication'
    }
  ],
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
  },
  observability: {
    enabled: true,
    metrics: [AccountOpeningTime],
    alerts: {
      onSLOBreach: {
        severity: 'high',
        notifyStakeholders: [ComplianceOfficerStakeholder],
        channel: 'slack'
      },
      onExpectationFailure: {
        severity: 'critical',
        notifyStakeholders: [ComplianceOfficerStakeholder],
        channel: 'pagerduty'
      }
    },
    auditTrail: {
      enabled: true,
      retentionPeriod: '7y',
      includeDetails: ['timestamp', 'actor', 'result', 'metrics']
    }
  },
  businessContext: {
    strategicImportance: 'critical',
    impactAssessment: {
      revenueImpact: 'Enables compliant customer onboarding, preventing regulatory fines and customer losses',
      customerSatisfaction: 'Real-time verification improves signup experience and reduces friction',
      operationalEfficiency: 'Automated verification reduces manual review workload by 80%'
    },
    successMeasurement: {
      baseline: { value: '85%', date: '2025-01-01' },
      target: { value: '98%', date: '2025-06-01' },
      approachToMeasurement: 'Track identity verification success rate and time to completion'
    },
    risks: [
      {
        description: 'KYC service downtime impacts customer onboarding',
        probability: 'low',
        impact: 'high',
        mitigation: 'Fallback to manual review process with compliance officer'
      }
    ]
  },
  tags: ['kyc', 'identity-verification', 'compliance', 'onboarding', 'customer-facing', 'critical-path']
})
export class VerifyIdentityExpectation {}


