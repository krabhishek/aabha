import { Collaboration } from 'aabha';
import { ComplianceContext } from '../contexts/ComplianceContext.js';
import { ComplianceOfficerStakeholder } from '../stakeholders/human/ComplianceOfficerStakeholder.js';
import { ComplianceSystemStakeholder } from '../stakeholders/system/ComplianceSystemStakeholder.js';

/**
 * Account Opening Manual Compliance Review Collaboration
 * Manual review of account applications that require human compliance judgment
 */
@Collaboration({
  name: 'Account Opening Manual Compliance Review',
  context: ComplianceContext,
  description: 'Manual review process for account applications that automated compliance systems flag for human review. This collaboration ensures regulatory compliance when automated checks cannot make a definitive decision.',
  purpose: 'Manual review of new account applications for compliance and risk when automated systems require human judgment',
  collaborationType: 'review-approval',
  participants: [
    {
      stakeholder: ComplianceOfficerStakeholder,
      role: 'reviewer',
      required: true,
      responsibilities: [
        'Review flagged account applications',
        'Verify identity and documentation',
        'Assess AML and KYC compliance',
        'Make compliance approval decision',
        'Document review findings and decision'
      ]
    },
    {
      stakeholder: ComplianceSystemStakeholder,
      role: 'contributor',
      required: false,
      responsibilities: [
        'Flag applications requiring manual review',
        'Provide automated compliance check results',
        'Supply relevant compliance data'
      ]
    }
  ],
  frequency: 'ad-hoc',
  duration: 'PT2H',
  communicationChannel: 'document-review',
  synchronicity: 'asynchronous',
  touchpoints: [
    'Application flagged by automated system',
    'Compliance officer receives review assignment',
    'Initial review of application and documentation',
    'Identity verification check',
    'AML and KYC compliance assessment',
    'Risk evaluation',
    'Approval or rejection decision',
    'Documentation of decision and rationale'
  ],
  prerequisites: [
    'Application submitted and flagged by automated compliance system',
    'All required documentation provided by customer',
    'Automated compliance check results available'
  ],
  artifactsRequired: [
    {
      name: 'Account application form',
      type: 'document',
      required: true,
      format: 'Digital form',
      owner: 'Customer',
      description: 'Customer account application with personal and financial information'
    },
    {
      name: 'Identity verification documents',
      type: 'document',
      required: true,
      format: 'Scanned government ID',
      owner: 'Customer',
      description: 'Government-issued ID documents for identity verification'
    },
    {
      name: 'Automated compliance check results',
      type: 'report',
      required: true,
      format: 'Digital report',
      owner: ComplianceSystemStakeholder,
      description: 'Results from automated compliance checking system'
    },
    {
      name: 'Supporting documentation',
      type: 'document',
      required: false,
      format: 'Various',
      description: 'Additional documents as required (proof of address, income verification, etc.)'
    }
  ],
  artifactsProduced: [
    {
      name: 'Compliance review decision',
      type: 'decision',
      required: true,
      owner: ComplianceOfficerStakeholder,
      description: 'Approval or rejection decision with rationale'
    },
    {
      name: 'Compliance review report',
      type: 'document',
      required: true,
      owner: ComplianceOfficerStakeholder,
      description: 'Detailed report documenting review findings, compliance checks performed, and decision rationale'
    },
    {
      name: 'Audit trail',
      type: 'document',
      required: true,
      owner: ComplianceOfficerStakeholder,
      description: 'Complete audit trail of review process for regulatory compliance'
    }
  ],
  expectedOutcomes: [
    {
      outcome: 'Application approved or rejected with documented rationale',
      type: 'decision',
      responsibleParty: ComplianceOfficerStakeholder,
      successCriteria: [
        'Decision made within 48-hour SLA',
        'All compliance checks documented',
        'Rationale clearly explained',
        'Audit trail complete'
      ]
    },
    {
      outcome: 'Regulatory compliance maintained',
      type: 'approval',
      responsibleParty: ComplianceOfficerStakeholder,
      successCriteria: [
        'All regulatory requirements met',
        'No compliance violations',
        'Documentation complete for audit'
      ]
    }
  ],
  successCriteria: [
    'Review completed within 48 hours of assignment',
    'All compliance checks passed',
    'Decision documented with clear rationale',
    'Zero regulatory violations',
    'Customer notified of decision promptly'
  ],
  decisionMaking: {
    approach: 'single-approver',
    tieBreaker: 'Compliance officer makes final decision, with escalation to senior compliance officer for complex cases'
  },
  complianceRequirements: [
    'Meeting minutes must be retained for 7 years',
    'Decisions require documented rationale',
    'All compliance checks must be recorded',
    'Audit trail must be complete and tamper-proof'
  ],
  documentation: {
    required: true,
    documentsRequired: [
      'Compliance review report',
      'Decision documentation',
      'Audit trail',
      'Supporting documentation references'
    ],
    retentionPeriod: '7 years',
    documentOwner: ComplianceOfficerStakeholder
  },
  risks: [
    {
      risk: 'High volume of reviews may cause delays',
      likelihood: 'medium',
      impact: 'high',
      mitigation: 'Adequate staffing, prioritization of urgent cases, and efficient review tools'
    },
    {
      risk: 'Complex cases may require additional expertise',
      likelihood: 'medium',
      impact: 'medium',
      mitigation: 'Escalation path to senior compliance officers and access to legal counsel'
    },
    {
      risk: 'Regulatory changes may require updated review procedures',
      likelihood: 'low',
      impact: 'high',
      mitigation: 'Regular training on regulatory updates and clear communication of policy changes'
    }
  ],
  escalationPath: 'Complex cases or disagreements escalate to Senior Compliance Officer within 24 hours. Critical compliance issues escalate to Chief Compliance Officer immediately.',
  tags: ['compliance', 'manual-review', 'account-opening', 'regulatory', 'kyc', 'aml']
})
export class AccountOpeningComplianceReviewCollaboration {}

