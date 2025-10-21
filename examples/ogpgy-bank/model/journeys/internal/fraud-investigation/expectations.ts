/**
 * Fraud Investigation Journey - Expectations
 *
 * Stakeholder expectations for fraud detection and investigation.
 */

import { Expectation, ExpectationPriority, InteractionPattern } from '../../../../../../src/index.js';
import {
  ChiefRiskOfficer,
  ChiefInformationSecurityOfficer
} from '../../../stakeholders/organizational-stakeholders.js';
import {
  FraudDetectionMonitorStakeholder
} from '../../../stakeholders/digital-banking/system-stakeholders.js';

// ============================================================================
// Fraud Investigation Expectations
// ============================================================================

@Expectation({
  name: 'AI-Powered Fraud Detection',
  description: 'AI-powered fraud detection with 95% detection rate and <5% false positives',
  provider: FraudDetectionMonitorStakeholder,
  consumer: ChiefRiskOfficer,
  exchange: {
    inputs: [
      'Transaction data',
      'Customer behavior history',
      'Device fingerprint',
      'Location data',
      'Historical fraud patterns'
    ],
    outputs: [
      'Fraud risk score',
      'Fraud indicators detected',
      'Confidence level',
      'Recommended action'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'ML models are trained',
      'Transaction data is complete',
      'Customer profile is available'
    ],
    postconditions: [
      'Fraud score is calculated',
      'Risk assessment is complete',
      'High-risk cases are flagged',
      'Alert is sent if needed'
    ],
    constraints: {
      maxLatency: '< 500ms for fraud scoring',
      availability: '99.99%',
      security: ['ML models updated regularly', 'Detection rules validated'],
      custom: {
        fraudDetectionRate: 'Fraud detection rate ≥ 95%',
        falsePositiveRate: 'False positive rate < 5%',
        modelAccuracy: 'Model accuracy ≥ 99%'
      }
    }
  },
  priority: ExpectationPriority.Critical,
  acceptanceCriteria: [
    'Fraud detection rate ≥ 95%',
    'False positive rate < 5%',
    'Real-time fraud scoring',
    'Suspicious transactions flagged for review'
  ],
  businessValue: 'Protect customers and bank from fraud while enabling legitimate transactions'
})
export class AIPoweredFraudDetectionExpectation {}

@Expectation({
  name: 'Rapid Fraud Investigation',
  description: 'Complete fraud investigation within 2 hours with clear action taken',
  provider: ChiefRiskOfficer,
  consumer: ChiefInformationSecurityOfficer,
  exchange: {
    inputs: [
      'Fraud alert details',
      'Transaction evidence',
      'Customer history',
      'Device and IP data'
    ],
    outputs: [
      'Investigation findings',
      'Fraud confirmation or dismissal',
      'Action taken',
      'Investigation report'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Fraud alert is triggered',
      'Evidence is collected',
      'Investigator is assigned'
    ],
    postconditions: [
      'Investigation is complete',
      'Decision is made',
      'Action is taken',
      'Report is filed'
    ],
    constraints: {
      maxLatency: '< 2 hours for investigation',
      availability: '24/7 coverage',
      security: ['Investigation data encrypted', 'Access controlled'],
      custom: {
        investigationTime: 'Average investigation time < 2 hours',
        accuracy: 'Investigation accuracy ≥ 98%'
      }
    }
  },
  priority: ExpectationPriority.High,
  acceptanceCriteria: [
    'Investigation complete within 2 hours',
    'Clear documentation of findings',
    'Appropriate action taken',
    'Customer impact minimized'
  ],
  businessValue: 'Minimize fraud losses while maintaining customer trust'
})
export class RapidFraudInvestigationExpectation {}
