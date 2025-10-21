/**
 * Risk & Compliance - System Stakeholders
 *
 * Systems supporting compliance monitoring, fraud detection, AML screening,
 * and regulatory reporting.
 */

import { Stakeholder, StakeholderType } from '../../../../../src/index.js';
import { RiskComplianceContext } from '../../contexts/risk-compliance.context.js';
import {
  AuditLogSystemPersona,
  AIFraudDetectionSystemPersona
} from '../../personas/system/audit-fraud.persona.js';

// ============================================================================
// Compliance Monitoring Systems
// ============================================================================

@Stakeholder({
  type: StakeholderType.System,
  role: 'AML Transaction Monitor',
  persona: AIFraudDetectionSystemPersona,
  context: RiskComplianceContext,
  responsibilities: [
    'Monitor all transactions for suspicious patterns',
    'Apply AML rules and ML models',
    'Generate alerts for unusual activity',
    'Score transactions for money laundering risk',
    'Track cross-border transactions',
    'Flag structuring and smurfing patterns'
  ],
  permissions: [
    'access_all_transactions',
    'analyze_customer_behavior',
    'generate_aml_alerts',
    'score_transactions',
    'access_customer_profiles',
    'trigger_investigation'
  ],
  description: 'AI-powered transaction monitoring system detecting suspicious patterns for AML compliance'
})
export class AMLTransactionMonitorStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Sanctions Screening Engine',
  persona: AIFraudDetectionSystemPersona,
  context: RiskComplianceContext,
  responsibilities: [
    'Screen customers against sanctions lists',
    'Check PEP (Politically Exposed Persons) status',
    'Perform watchlist screening',
    'Validate against OFAC, UN, EU lists',
    'Alert on positive matches',
    'Re-screen periodically'
  ],
  permissions: [
    'access_sanctions_lists',
    'screen_customer_names',
    'check_pep_status',
    'generate_screening_alerts',
    'block_sanctioned_entities',
    'access_watchlists'
  ],
  description: 'Sanctions screening system checking customers against global watchlists and PEP databases'
})
export class SanctionsScreeningEngineStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Compliance Audit Trail',
  persona: AuditLogSystemPersona,
  context: RiskComplianceContext,
  responsibilities: [
    'Log all compliance-relevant events',
    'Capture KYC verification results',
    'Record AML investigations',
    'Store regulatory reports',
    'Maintain immutable audit trail',
    'Enable compliance forensics'
  ],
  permissions: [
    'write_audit_logs',
    'write_compliance_events',
    'store_verification_results',
    'archive_reports',
    'provide_forensic_data',
    'support_regulator_audits'
  ],
  description: 'Immutable audit logging system capturing all compliance events for regulatory reporting'
})
export class ComplianceAuditTrailStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Regulatory Reporting Engine',
  persona: AuditLogSystemPersona,
  context: RiskComplianceContext,
  responsibilities: [
    'Generate regulatory reports (CTRs, STRs)',
    'Aggregate compliance metrics',
    'Submit reports to Central Bank',
    'Track reporting deadlines',
    'Validate report completeness',
    'Archive submitted reports'
  ],
  permissions: [
    'access_transaction_data',
    'access_customer_data',
    'generate_reports',
    'submit_to_regulator',
    'archive_reports',
    'track_compliance_metrics'
  ],
  description: 'Automated regulatory reporting system generating and submitting compliance reports to regulators'
})
export class RegulatoryReportingEngineStakeholder {}
