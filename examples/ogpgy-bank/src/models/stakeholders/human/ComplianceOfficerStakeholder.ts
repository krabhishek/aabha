import { Stakeholder, StakeholderType } from 'aabha';
import { ComplianceContext } from '../../contexts/ComplianceContext.js';
import { ComplianceOfficerPersona } from '../../personas/human/ComplianceOfficerPersona.js';

/**
 * Compliance Officer Stakeholder
 * Human stakeholder responsible for manual compliance reviews
 */
@Stakeholder({
  name: 'Compliance Officer',
  description: 'Compliance professional responsible for manual review of account applications and transactions that require human judgment. This stakeholder ensures regulatory compliance when automated systems flag cases for review.',
  type: StakeholderType.Human,
  role: 'Compliance Officer',
  persona: ComplianceOfficerPersona,
  context: ComplianceContext,
  responsibilities: [
    'Review flagged account applications',
    'Perform manual compliance checks',
    'Verify identity and documentation',
    'Assess AML and KYC compliance',
    'Document compliance decisions',
    'Escalate complex cases'
  ],
  goals: [
    'Ensure 100% regulatory compliance',
    'Process reviews within 48-hour SLA',
    'Maintain comprehensive documentation',
    'Protect bank from regulatory violations',
    'Balance compliance with customer experience'
  ],
  painPoints: [
    'High volume of manual reviews',
    'Complex and changing regulations',
    'Pressure to process quickly while maintaining accuracy',
    'Lack of clear guidelines for edge cases',
    'Insufficient tools for efficient review'
  ],
  strategicImportance: 'critical',
  businessValue: 'Ensures regulatory compliance and protects the bank from fines, penalties, and reputational damage. Enables the bank to process applications that automated systems cannot handle.',
  engagement: 'daily',
  accountability: [
    'Review applications within SLA',
    'Ensure compliance with all regulations',
    'Document decisions thoroughly',
    'Escalate complex cases appropriately'
  ],
  touchpoints: [
    'Compliance review system - Daily application reviews',
    'Email - Documentation and communication',
    'Phone - Urgent escalations',
    'In-person - Complex case discussions'
  ],
  communicationPreferences: {
    preferredChannels: ['compliance-system', 'email', 'phone'],
    responseTime: 'within 4 hours',
    availability: 'Business hours'
  },
  successCriteria: [
    'Zero regulatory violations',
    'Reviews completed within SLA',
    'High accuracy in compliance decisions',
    'Comprehensive documentation',
    'Effective escalation of complex cases'
  ],
  influence: 'high',
  influenceSphere: [
    'Application approval decisions',
    'Compliance policy interpretation',
    'Risk assessment for applications',
    'Regulatory compliance standards'
  ],
  decisionAuthority: [
    'Application compliance approval',
    'Compliance policy application',
    'Escalation to senior compliance officers'
  ],
  risks: [
    {
      risk: 'High workload may lead to errors or delays',
      likelihood: 'medium',
      impact: 'high',
      mitigation: 'Adequate staffing, clear procedures, and efficient review tools'
    },
    {
      risk: 'Regulatory changes may require retraining',
      likelihood: 'medium',
      impact: 'medium',
      mitigation: 'Regular training programs and clear communication of regulatory updates'
    }
  ],
  kpis: [
    'Review completion rate > 95% within SLA',
    'Zero regulatory violations',
    'Review accuracy > 99%',
    'Average review time < 2 hours per application'
  ],
  satisfactionIndicators: [
    'Completes reviews within SLA',
    'Receives positive feedback from management',
    'Has access to efficient review tools',
    'Feels confident in compliance decisions',
    'Participates in compliance training',
    'Effectively escalates complex cases'
  ],
  tags: ['compliance', 'human', 'review', 'regulatory', 'critical-path']
})
export class ComplianceOfficerStakeholder {}

