/**
 * Compliance Workflow Journey - Expectations
 *
 * Stakeholder expectations for real-time compliance screening.
 */

import { Expectation, ExpectationPriority, InteractionPattern } from '../../../../../../src/index.js';
import {
  ChiefComplianceOfficerStakeholder,
  AMLComplianceOfficerStakeholder
} from '../../../stakeholders/risk-compliance/employee-stakeholders.js';
import {
  AMLTransactionMonitorStakeholder,
  SanctionsScreeningEngineStakeholder
} from '../../../stakeholders/risk-compliance/system-stakeholders.js';

// ============================================================================
// Compliance Expectations
// ============================================================================

@Expectation({
  name: 'Real-Time AML Screening',
  description: 'Real-time AML screening with 99.5% accuracy for all transactions',
  provider: AMLTransactionMonitorStakeholder,
  consumer: AMLComplianceOfficerStakeholder,
  exchange: {
    inputs: [
      'Transaction details',
      'Customer profile',
      'Transaction history',
      'Risk indicators'
    ],
    outputs: [
      'AML risk score',
      'Alert level (low/medium/high)',
      'Screening result',
      'Recommended action'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Transaction is initiated',
      'Customer KYC is complete',
      'AML rules are configured'
    ],
    postconditions: [
      'Transaction is screened',
      'Risk score is calculated',
      'Alert is generated if needed',
      'Audit log is created'
    ],
    constraints: {
      maxLatency: '< 500ms for screening',
      availability: '99.99%',
      security: ['Encrypted transaction data', 'Audit trail maintained'],
      custom: {
        accuracy: 'AML screening accuracy ≥ 99.5%',
        falsePositives: 'False positive rate < 5%'
      }
    }
  },
  priority: ExpectationPriority.Critical,
  acceptanceCriteria: [
    'Real-time screening for all transactions',
    '99.5% accuracy in sanctions matching',
    'False positive rate < 5%',
    'Automated escalation for high-risk cases'
  ],
  businessValue: 'Compliance as competitive advantage - enables faster innovation'
})
export class RealTimeAMLScreeningExpectation {}

@Expectation({
  name: 'Sanctions List Verification',
  description: 'Automated sanctions screening against all major global lists',
  provider: SanctionsScreeningEngineStakeholder,
  consumer: ChiefComplianceOfficerStakeholder,
  exchange: {
    inputs: [
      'Customer name',
      'Customer identifiers',
      'Beneficiary details',
      'Transaction details'
    ],
    outputs: [
      'Sanctions match result',
      'Match confidence score',
      'Matched entity details',
      'Compliance decision'
    ],
    interactionPattern: InteractionPattern.RequestResponse,
    preconditions: [
      'Sanctions lists are up to date',
      'Customer data is verified',
      'Screening rules are configured'
    ],
    postconditions: [
      'Sanctions check is complete',
      'Match results are documented',
      'High-confidence matches are flagged',
      'Compliance team is notified if needed'
    ],
    constraints: {
      maxLatency: '< 1 second for sanctions check',
      availability: '99.99%',
      security: ['Sanctions data encrypted', 'Access controlled'],
      custom: {
        listCoverage: 'All major sanctions lists covered (OFAC, UN, EU)',
        updateFrequency: 'Lists updated within 24 hours of changes'
      }
    }
  },
  priority: ExpectationPriority.Critical,
  acceptanceCriteria: [
    'Check against all major sanctions lists',
    'Near-zero false negatives',
    'Clear audit trail for regulators',
    'Real-time list updates'
  ],
  businessValue: 'Regulatory compliance maintained - avoid penalties and maintain banking license'
})
export class SanctionsListVerificationExpectation {}
