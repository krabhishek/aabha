import { Stakeholder, StakeholderType } from 'aabha';
import { DigitalBankingContext } from '../../contexts/DigitalBankingContext.js';
import { AccountManagementSystemPersona } from '../../personas/system/AccountManagementSystemPersona.js';

/**
 * Account System Stakeholder
 * System actor for automated account management operations
 */
@Stakeholder({
  name: 'Account Management System',
  description: 'Automated system responsible for processing account applications, activating accounts, and managing account lifecycle operations. This system stakeholder executes business rules and workflows without human intervention.',
  type: StakeholderType.System,
  role: 'System',
  persona: AccountManagementSystemPersona,
  context: DigitalBankingContext,
  responsibilities: [
    'Process account applications automatically',
    'Activate approved accounts',
    'Manage account lifecycle',
    'Execute automated workflows'
  ],
  goals: [
    'Process applications within SLA',
    'Maintain system consistency',
    'Ensure data integrity',
    'Support automated operations'
  ],
  accountability: [
    'Process applications within 5 minute SLA',
    'Maintain 99.9% uptime',
    'Ensure zero data loss',
    'Comply with regulatory requirements'
  ],
  engagement: 'daily',
  permissions: [
    'read_account_applications',
    'write_account_status',
    'read_customer_data',
    'write_account_lifecycle_events',
    'read_compliance_rules',
    'write_audit_logs'
  ],
  touchpoints: [
    'API endpoints - Continuous processing',
    'Event streams - Real-time updates',
    'Monitoring dashboards - System health'
  ],
  contextualNeeds: [
    'Access to customer database for validation',
    'Integration with compliance checking systems',
    'Real-time event streaming infrastructure',
    'Monitoring and alerting systems',
    'Audit logging capabilities'
  ],
  painPoints: [
    'High latency during peak load times',
    'Complex integration with legacy systems',
    'Maintaining consistency across distributed components',
    'Handling edge cases in application processing'
  ],
  successCriteria: [
    'Process applications within 5 minute SLA',
    'Maintain 99.9% uptime',
    'Zero data loss incidents',
    'Error rate < 0.1%',
    'Throughput > 1000 applications/hour'
  ],
  kpis: [
    'Application processing time < 2 minutes',
    'System uptime > 99.9%',
    'Error rate < 0.1%',
    'Throughput > 1000 applications/hour'
  ]
})
export class AccountSystemStakeholder {}

