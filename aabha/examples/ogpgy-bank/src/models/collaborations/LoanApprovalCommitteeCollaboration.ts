import { Collaboration } from 'aabha';
import { RiskManagementContext } from '../contexts/RiskManagementContext.js';
import { RiskManagerStakeholder } from '../stakeholders/human/RiskManagerStakeholder.js';
import { ComplianceOfficerStakeholder } from '../stakeholders/human/ComplianceOfficerStakeholder.js';
import { RetailCustomerStakeholder } from '../stakeholders/human/RetailCustomerStakeholder.js';

/**
 * Loan Approval Committee Collaboration
 * Committee meeting to review and approve loan applications requiring committee decision
 */
@Collaboration({
  name: 'Loan Approval Committee',
  context: RiskManagementContext,
  description: 'Committee meeting where risk managers and compliance officers review loan applications that exceed individual approval limits or require committee decision. This collaboration ensures proper risk assessment and compliance for significant loan decisions.',
  purpose: 'Review and approve loan applications that require committee-level decision-making based on risk, amount, or complexity',
  collaborationType: 'review-approval',
  participants: [
    {
      stakeholder: RiskManagerStakeholder,
      role: 'reviewer',
      required: true,
      responsibilities: [
        'Assess credit risk of loan applications',
        'Evaluate borrower financial strength',
        'Review risk models and assessments',
        'Provide risk recommendations',
        'Present risk analysis to committee'
      ]
    },
    {
      stakeholder: ComplianceOfficerStakeholder,
      role: 'reviewer',
      required: true,
      responsibilities: [
        'Review compliance aspects of loan applications',
        'Verify regulatory compliance',
        'Assess documentation completeness',
        'Provide compliance recommendations',
        'Ensure audit trail completeness'
      ]
    }
  ],
  frequency: 'weekly',
  duration: 'PT2H',
  scheduling: {
    timeOfDay: 'Business hours (typically 2 PM - 4 PM)',
    dayPattern: 'Every Tuesday',
    leadTime: '1 week',
    cancellationNotice: '24 hours'
  },
  communicationChannel: 'hybrid',
  synchronicity: 'synchronous',
  location: {
    type: 'hybrid',
    address: 'OgPgyBank Risk Committee Room, Floor 5',
    virtualPlatform: 'Microsoft Teams'
  },
  agenda: [
    'Review loan applications requiring committee approval',
    'Risk assessment presentation',
    'Compliance review presentation',
    'Committee discussion and questions',
    'Approval or rejection decisions',
    'Documentation of decisions and rationale'
  ],
  prerequisites: [
    'Loan applications submitted with complete documentation',
    'Risk assessment completed by risk manager',
    'Compliance review completed by compliance officer',
    'All required documentation available 48 hours before meeting',
    'Meeting materials distributed to participants'
  ],
  artifactsRequired: [
    {
      name: 'Loan application package',
      type: 'document',
      required: true,
      format: 'Digital package',
      owner: RetailCustomerStakeholder,
      description: 'Complete loan application with borrower information, financial statements, and supporting documentation'
    },
    {
      name: 'Risk assessment report',
      type: 'report',
      required: true,
      format: 'PDF report',
      owner: RiskManagerStakeholder,
      description: 'Comprehensive risk assessment including credit analysis, financial strength evaluation, and risk rating'
    },
    {
      name: 'Compliance review report',
      type: 'report',
      required: true,
      format: 'PDF report',
      owner: ComplianceOfficerStakeholder,
      description: 'Compliance review including regulatory checks, documentation verification, and compliance recommendations'
    },
    {
      name: 'Credit analysis',
      type: 'report',
      required: true,
      format: 'PDF analysis',
      owner: RiskManagerStakeholder,
      description: 'Detailed credit analysis including borrower capacity, collateral evaluation, and repayment ability'
    }
  ],
  artifactsProduced: [
    {
      name: 'Committee approval decision',
      type: 'decision',
      required: true,
      owner: RiskManagerStakeholder,
      description: 'Approval or rejection decision with conditions if applicable'
    },
    {
      name: 'Meeting minutes',
      type: 'document',
      required: true,
      owner: RiskManagerStakeholder,
      description: 'Detailed minutes documenting discussion, decisions, and rationale'
    },
    {
      name: 'Risk decision documentation',
      type: 'document',
      required: true,
      owner: RiskManagerStakeholder,
      description: 'Documentation of risk assessment and risk-based decision rationale'
    },
    {
      name: 'Compliance decision documentation',
      type: 'document',
      required: true,
      owner: ComplianceOfficerStakeholder,
      description: 'Documentation of compliance review and regulatory compliance confirmation'
    }
  ],
  expectedOutcomes: [
    {
      outcome: 'Loan applications approved or rejected with documented rationale',
      type: 'decision',
      responsibleParty: RiskManagerStakeholder,
      successCriteria: [
        'All applications reviewed',
        'Decisions made within meeting time',
        'Rationale clearly documented',
        'Conditions specified if applicable'
      ]
    },
    {
      outcome: 'Risk and compliance properly assessed',
      type: 'approval',
      responsibleParty: RiskManagerStakeholder,
      successCriteria: [
        'Risk assessment comprehensive',
        'Compliance verified',
        'All regulatory requirements met',
        'Documentation complete'
      ]
    }
  ],
  successCriteria: [
    'All applications reviewed within meeting time',
    'Decisions made with clear rationale',
    'Risk and compliance properly assessed',
    'Documentation complete for audit',
    'Decisions communicated to applicants within 24 hours'
  ],
  decisionMaking: {
    approach: 'consensus',
    quorum: 'Both risk manager and compliance officer must be present',
    tieBreaker: 'If consensus cannot be reached, escalate to Senior Risk Manager and Chief Compliance Officer'
  },
  complianceRequirements: [
    'Meeting minutes must be retained for 7 years',
    'Decisions require documented rationale',
    'All risk and compliance assessments must be recorded',
    'Audit trail must be complete and tamper-proof',
    'Regulatory reporting requirements must be met'
  ],
  documentation: {
    required: true,
    documentsRequired: [
      'Meeting minutes',
      'Risk assessment documentation',
      'Compliance review documentation',
      'Decision rationale',
      'Audit trail'
    ],
    retentionPeriod: '7 years',
    documentOwner: RiskManagerStakeholder
  },
  risks: [
    {
      risk: 'High volume of applications may cause meeting delays',
      likelihood: 'medium',
      impact: 'medium',
      mitigation: 'Prioritization of applications, efficient meeting management, and additional meetings if needed'
    },
    {
      risk: 'Complex applications may require additional expertise',
      likelihood: 'medium',
      impact: 'medium',
      mitigation: 'Escalation path to senior risk and compliance officers, access to legal counsel, and deferral for additional analysis'
    },
    {
      risk: 'Disagreement between risk and compliance perspectives',
      likelihood: 'low',
      impact: 'high',
      mitigation: 'Clear escalation path, senior management involvement, and documented decision-making process'
    }
  ],
  escalationPath: 'Complex applications or disagreements escalate to Senior Risk Manager and Chief Compliance Officer within 24 hours. Critical decisions escalate to Chief Risk Officer and Chief Compliance Officer immediately.',
  tags: ['loan-approval', 'risk-management', 'compliance', 'committee', 'credit-decision', 'regulatory']
})
export class LoanApprovalCommitteeCollaboration {}

