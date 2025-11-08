import { Stakeholder, StakeholderType } from 'aabha';
import { DigitalBankingContext } from '../../contexts/DigitalBankingContext.js';
import { ComplianceSystemPersona } from '../../personas/system/ComplianceSystemPersona.js';

/**
 * Compliance System Stakeholder
 * System actor for compliance checking operations
 */
@Stakeholder({
  name: 'Compliance System',
  description: 'Automated system responsible for performing KYC, AML, and other compliance checks on account applications and transactions. This system stakeholder ensures all operations comply with banking regulations.',
  type: StakeholderType.System,
  role: 'Compliance System',
  persona: ComplianceSystemPersona,
  context: DigitalBankingContext,
  responsibilities: [
    'Perform KYC compliance checks',
    'Screen against AML databases',
    'Check sanctions lists',
    'Generate compliance reports',
    'Maintain comprehensive audit trails'
  ],
  goals: [
    'Ensure 100% compliance with regulations',
    'Process compliance checks within 5 seconds',
    'Maintain comprehensive audit trails',
    'Stay current with regulatory changes'
  ],
  accountability: [
    'Process compliance checks within 5 second SLA',
    'Maintain 99.9% uptime',
    'Ensure zero regulatory violations',
    'Comply with all banking regulations'
  ],
  engagement: 'daily',
  permissions: [
    'read_application_data',
    'write_compliance_results',
    'read_customer_data',
    'write_audit_logs',
    'read_regulatory_rules',
    'write_compliance_reports'
  ],
  touchpoints: [
    'API endpoints - Real-time compliance checking',
    'Event streams - Compliance status updates',
    'Monitoring dashboards - System health'
  ],
  contextualNeeds: [
    'Access to compliance databases',
    'Regulatory rule engine',
    'Audit logging capabilities',
    'Real-time processing infrastructure',
    'Reporting and analytics systems'
  ],
  painPoints: [
    'Complex regulatory requirements',
    'High latency during peak processing times',
    'Maintaining accuracy across multiple jurisdictions',
    'Keeping up with regulatory changes'
  ],
  successCriteria: [
    'Compliance rate 100%',
    'Processing time < 5 seconds',
    'Uptime > 99.9%',
    'Zero regulatory violations',
    'Audit trail completeness 100%'
  ],
  kpis: [
    'Compliance check processing time < 5 seconds',
    'System uptime > 99.9%',
    'Compliance rate 100%',
    'Regulatory violation rate 0%'
  ],
  strategicImportance: 'critical',
  businessValue: 'Ensures regulatory compliance and reduces risk of fines and penalties, protecting the bank\'s reputation and financial standing.',
  risks: [
    {
      risk: 'Regulatory violations due to system failures or outdated rules',
      likelihood: 'low',
      impact: 'high',
      mitigation: 'Regular regulatory updates, comprehensive testing, and audit procedures'
    },
    {
      risk: 'Service outage prevents application processing',
      likelihood: 'low',
      impact: 'high',
      mitigation: 'Redundant infrastructure, monitoring, and failover procedures'
    }
  ],
  tags: ['system', 'compliance', 'kyc', 'aml', 'regulatory', 'critical-path']
})
export class ComplianceSystemStakeholder {}

