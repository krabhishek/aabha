import { Stakeholder, StakeholderType } from 'aabha';
import { DigitalBankingContext } from '../../contexts/DigitalBankingContext.js';
import { IdentityVerificationServicePersona } from '../../personas/system/IdentityVerificationServicePersona.js';

/**
 * Identity Verification Service Stakeholder
 * System actor for identity verification operations
 */
@Stakeholder({
  name: 'Identity Verification Service',
  description: 'Automated system responsible for verifying customer identity using government ID scanning and biometric authentication. This system stakeholder executes identity verification workflows without human intervention.',
  type: StakeholderType.System,
  role: 'Identity Verification Service',
  persona: IdentityVerificationServicePersona,
  context: DigitalBankingContext,
  responsibilities: [
    'Verify government-issued ID documents',
    'Match biometric data with ID documents',
    'Perform real-time identity checks',
    'Maintain compliance audit trails',
    'Detect fraudulent identity attempts'
  ],
  goals: [
    'Verify identity within 3 seconds',
    'Maintain 99%+ verification accuracy',
    'Ensure compliance with KYC/AML regulations',
    'Minimize false positives and false negatives'
  ],
  accountability: [
    'Process verifications within 3 second SLA',
    'Maintain 99.9% uptime',
    'Ensure zero data breaches',
    'Comply with KYC/AML regulations'
  ],
  engagement: 'daily',
  permissions: [
    'read_identity_documents',
    'write_verification_results',
    'read_biometric_data',
    'write_compliance_records',
    'read_fraud_patterns'
  ],
  touchpoints: [
    'API endpoints - Real-time verification',
    'Event streams - Verification status updates',
    'Monitoring dashboards - System health'
  ],
  contextualNeeds: [
    'Access to government ID databases',
    'Biometric matching service infrastructure',
    'Real-time processing capabilities',
    'Compliance checking systems',
    'Audit logging capabilities'
  ],
  painPoints: [
    'High latency during peak verification times',
    'Complex integration with multiple verification providers',
    'Maintaining accuracy while processing at scale',
    'Handling edge cases with document quality'
  ],
  successCriteria: [
    'Verification accuracy > 99%',
    'Processing time < 3 seconds',
    'Uptime > 99.9%',
    'False positive rate < 0.1%',
    'Compliance audit trail completeness 100%'
  ],
  kpis: [
    'Verification processing time < 3 seconds',
    'System uptime > 99.9%',
    'Verification accuracy > 99%',
    'False positive rate < 0.1%'
  ],
  strategicImportance: 'critical',
  businessValue: 'Enables compliant customer onboarding and reduces fraud risk, avoiding potential regulatory fines and customer losses.',
  risks: [
    {
      risk: 'Service outage impacts customer onboarding and compliance',
      likelihood: 'low',
      impact: 'high',
      mitigation: 'Redundant infrastructure, monitoring, and failover procedures'
    },
    {
      risk: 'High latency during peak times affects user experience',
      likelihood: 'medium',
      impact: 'medium',
      mitigation: 'Auto-scaling infrastructure and load balancing'
    }
  ],
  tags: ['system', 'identity-verification', 'kyc', 'compliance', 'critical-path']
})
export class IdentityVerificationServiceStakeholder {}

