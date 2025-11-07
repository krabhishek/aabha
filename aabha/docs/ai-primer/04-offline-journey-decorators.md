# Offline Journey Decorators

> **Part 4 of the Aabha AI Primer Series**
>
> **Focus:** Journey orchestration for offline, manual, and human-centric processes
>
> This guide demonstrates how @Journey, @Action, @Expectation, @Interaction, and @Collaboration decorators work together to model **offline business processes** including branch operations, manual reviews, human collaborations, and organizational interactions.

---

## Table of Contents

1. [Overview: Offline Journey Modeling](#overview-offline-journey-modeling)
2. [@Interaction Decorator for Offline Processes](#interaction-decorator-for-offline-processes)
3. [@Collaboration Decorator](#collaboration-decorator)
4. [Complete Offline Example: Branch Account Opening](#complete-offline-example-branch-account-opening)
5. [Complete Hybrid Example: High-Value Account Opening](#complete-hybrid-example-high-value-account-opening)
6. [Integration Patterns](#integration-patterns)

---

## Overview: Offline Journey Modeling

Offline journeys represent human-driven, manual business processes where stakeholders interact through:
- **Physical branches** (in-person services)
- **Paper documents** (forms, contracts, signatures)
- **Manual reviews** (compliance checks, approvals)
- **Human collaborations** (meetings, consultations, negotiations)
- **Organizational processes** (audits, regulatory submissions, partnerships)

### Key Characteristics of Offline Journeys

- **Timeframe**: Actions complete in hours/days/weeks (not seconds/minutes)
- **Human-driven**: Manual actions requiring human judgment and decision-making
- **Physical artifacts**: Paper documents, wet signatures, face-to-face meetings
- **Collaboration-heavy**: Multiple stakeholders coordinating together
- **Regulatory/Compliance**: Often required by law or regulation (not just convenience)

### Digital vs. Offline Comparison

| Aspect | Digital Journey | Offline Journey |
|--------|----------------|-----------------|
| **Speed** | Seconds/minutes | Hours/days/weeks |
| **Automation** | Fully/semi-automated | Manual/human-driven |
| **Interactions** | APIs, UIs, databases | Physical documents, meetings, phone calls |
| **Location** | Anywhere (mobile/web) | Specific physical locations |
| **Artifacts** | Digital files, events | Paper documents, physical signatures |
| **Scalability** | High (automated) | Low (human-limited) |
| **Cost per transaction** | Low | High |
| **Regulatory** | Some requirements | Heavy compliance/audit requirements |

---

## @Interaction Decorator for Offline Processes

The `@Interaction` decorator supports offline processes through specialized layers and patterns:

### Offline Interaction Layers

| Layer | Purpose | Typical Patterns | Example |
|-------|---------|------------------|---------|
| **Interpersonal** | Human-to-human | Meeting, PhoneCall, EmailExchange | Investment committee meeting |
| **Manual** | Offline workflows | ManualReview, PhysicalDocument, PhysicalSignature | Compliance document review |
| **Organizational** | Org-to-org | FormalAgreement, RegulatorySubmission, Audit | Partnership contract signing |

### Example 1: Interpersonal - In-Person Meeting

```typescript
import {
  Interaction,
  InteractionPattern,
  InteractionLayer,
} from '@aabha/core';

@Interaction({
  name: 'Branch Account Opening Consultation',
  description: 'Face-to-face consultation between customer and branch relationship manager to discuss account options',

  pattern: InteractionPattern.Meeting,
  layer: InteractionLayer.Interpersonal,

  inputs: [
    {
      name: 'customerRequirements',
      type: 'string',
      required: true,
      description: 'Customer stated needs and preferences for banking services'
    },
    {
      name: 'customerDocuments',
      type: 'PhysicalDocuments',
      required: true,
      description: 'Government ID, proof of address, and other required documents'
    }
  ],

  outputs: [
    {
      name: 'recommendedAccountType',
      type: 'string',
      required: true,
      description: 'Recommended account type based on consultation'
    },
    {
      name: 'completedApplicationForm',
      type: 'PhysicalDocument',
      required: true,
      description: 'Filled and signed paper application form'
    },
    {
      name: 'consultationNotes',
      type: 'string',
      required: true,
      description: 'Relationship manager notes from consultation'
    }
  ],

  preconditions: [
    'Customer has scheduled appointment',
    'Branch relationship manager is available',
    'Private consultation room is available',
    'Required forms and documents are prepared'
  ],

  postconditions: [
    'Customer understands account options',
    'Application form is completed and signed',
    'All required documents collected and verified',
    'Next steps communicated to customer'
  ],

  interpersonalConfig: {
    communicationChannel: 'in-person-meeting',
    synchronicity: 'synchronous',

    location: {
      type: 'physical',
      address: 'OgPgyBank branch office',
      virtualOption: false  // Must be in-person for document verification
    },

    attendees: {
      required: [DigitalFirstCustomer, BranchRelationshipManagerStakeholder],
      maxAttendees: 2
    },

    duration: 'PT30M',  // 30 minutes typical
    frequency: 'ad-hoc',

    agenda: [
      'Greet customer and understand needs',
      'Review account options and features',
      'Verify identity documents',
      'Complete application form together',
      'Collect signatures',
      'Explain next steps'
    ],

    materialsRequired: [
      'Blank application forms',
      'Account features comparison sheet',
      'Terms and conditions documents',
      'Privacy policy disclosure'
    ],

    deliverablesExpected: [
      'Completed application form',
      'Photocopies of identity documents',
      'Signed disclosures and agreements',
      'Consultation notes'
    ]
  },

  security: {
    compliance: ['GDPR', 'KYC regulations', 'AML requirements'],
    securityNotes: [
      'Private consultation room for confidentiality',
      'Documents must be stored securely immediately after',
      'Personal data handling per privacy policy'
    ]
  },

  observability: {
    enabled: true,
    metrics: [ConsultationDurationMetric, ConsultationSatisfactionMetric],
    logLevel: 'info'
  },

  tags: ['interpersonal', 'branch', 'in-person', 'consultation']
})
export class BranchAccountOpeningConsultationInteraction {}
```

### Example 2: Manual - Physical Document Review

```typescript
@Interaction({
  name: 'Manual Compliance Document Review',
  description: 'Compliance officer manually reviews account opening documents for regulatory compliance',

  pattern: InteractionPattern.ManualReview,
  layer: InteractionLayer.Manual,

  inputs: [
    {
      name: 'applicationForm',
      type: 'PhysicalDocument',
      required: true,
      sensitivity: 'confidential',
      description: 'Physical account opening application form'
    },
    {
      name: 'identityDocuments',
      type: 'PhysicalDocument[]',
      required: true,
      sensitivity: 'restricted',
      description: 'Government-issued ID and proof of address'
    },
    {
      name: 'riskAssessmentWorksheet',
      type: 'PhysicalDocument',
      required: true,
      description: 'Completed risk assessment checklist'
    }
  ],

  outputs: [
    {
      name: 'reviewDecision',
      type: 'string',
      required: true,
      description: 'Approved | Rejected | RequiresMoreInfo'
    },
    {
      name: 'complianceNotes',
      type: 'string',
      required: true,
      description: 'Detailed notes on compliance checks performed'
    },
    {
      name: 'reviewerSignature',
      type: 'PhysicalSignature',
      required: true,
      description: 'Compliance officer signature on review form'
    }
  ],

  preconditions: [
    'All required documents submitted',
    'Application form is complete',
    'Documents are legible and authentic'
  ],

  postconditions: [
    'All compliance checks completed',
    'Decision documented with rationale',
    'Review signed and dated by officer',
    'Documents filed securely'
  ],

  manualConfig: {
    processType: 'manual-review',

    physicalLocation: 'Compliance Department, OgPgyBank Headquarters, Floor 3',

    reviewers: [ComplianceOfficerStakeholder],

    reviewCriteria: [
      'Identity documents valid and not expired',
      'Address proof dated within last 3 months',
      'Application form complete with all required fields',
      'Customer not on sanctions list or PEP database',
      'Risk assessment appropriate for customer profile',
      'AML red flags checked and documented'
    ],

    approvalWorkflow: {
      levels: 2,  // Compliance officer + Senior compliance officer for high-risk
      description: 'Single approver for standard accounts, dual approval for high-risk customers',
      escalationPath: 'Escalate to Senior Compliance Officer if red flags identified'
    },

    estimatedDuration: 'PT2H',  // 2 hours typical

    documentsRequired: [
      'Application form (original)',
      'Government ID (photocopy)',
      'Proof of address (photocopy)',
      'Risk assessment worksheet',
      'Compliance review checklist',
      'AML screening report'
    ],

    witnessRequired: false,
    notarizationRequired: false,

    offlineStorage: {
      location: 'Secure document archive, Building 1, Room 101',
      retentionPeriod: '7 years',  // Regulatory requirement
      securityLevel: 'restricted'
    },

    qualityAssurance: {
      required: true,
      checkType: 'Spot check by Senior Compliance Officer',
      responsibleParty: SeniorComplianceOfficerStakeholder
    },

    complianceRequirements: [
      'Retain documents for 7 years per Banking Act Section 12',
      'Annual audit of compliance review process',
      'Quarterly quality checks on 10% of reviews',
      'Confidential handling per Data Protection Act'
    ]
  },

  security: {
    compliance: ['KYC regulations', 'AML Act', 'Data Protection Act'],
    securityNotes: [
      'Documents must never leave secure area',
      'Access log maintained for all document handling',
      'Shred rejected applications after retention period'
    ]
  },

  observability: {
    enabled: true,
    metrics: [
      ComplianceReviewTimeMetric,
      ComplianceApprovalRateMetric,
      ComplianceRejectReasonDistributionMetric
    ],
    logLevel: 'info',
    auditTrail: {
      enabled: true,
      retentionPeriod: '10y',  // Longer than document retention
      includeDetails: ['timestamp', 'reviewer', 'decision', 'rationale', 'documents-reviewed']
    }
  },

  tags: ['manual', 'compliance', 'review', 'offline', 'regulatory']
})
export class ManualComplianceDocumentReviewInteraction {}
```

### Example 3: Manual - Physical Signature

```typescript
@Interaction({
  name: 'Physical Contract Signature',
  description: 'Customer signs account opening contract and terms & conditions in branch',

  pattern: InteractionPattern.PhysicalSignature,
  layer: InteractionLayer.Manual,

  inputs: [
    {
      name: 'accountContract',
      type: 'PhysicalDocument',
      required: true,
      description: 'Printed account contract (3 copies)'
    },
    {
      name: 'termsAndConditions',
      type: 'PhysicalDocument',
      required: true,
      description: 'Printed T&C document'
    },
    {
      name: 'privacyPolicy',
      type: 'PhysicalDocument',
      required: true,
      description: 'Printed privacy policy acknowledgment'
    }
  ],

  outputs: [
    {
      name: 'signedContract',
      type: 'PhysicalDocument',
      required: true,
      sensitivity: 'restricted',
      description: 'Signed account contract (original + 2 copies)'
    },
    {
      name: 'signatureTimestamp',
      type: 'datetime',
      required: true,
      description: 'Date and time of signature'
    },
    {
      name: 'witnessSignature',
      type: 'PhysicalSignature',
      required: true,
      description: 'Branch staff witness signature'
    }
  ],

  preconditions: [
    'Customer identity verified',
    'Customer understands contract terms',
    'All contract pages present and in order',
    'Branch staff available to witness'
  ],

  postconditions: [
    'Customer signed all required pages',
    'Witness signed and dated',
    'Original contract filed securely',
    'Customer copy provided',
    'Bank copy retained'
  ],

  manualConfig: {
    processType: 'physical-signature',

    physicalLocation: 'Branch office or private consultation room',

    documentsRequired: [
      'Account contract (3 copies - original, customer copy, bank copy)',
      'Terms and conditions (1 copy)',
      'Privacy policy acknowledgment (1 copy)',
      'Signature witness form'
    ],

    witnessRequired: true,  // Bank staff must witness signature

    notarizationRequired: false,  // Not required for standard accounts

    offlineStorage: {
      location: 'Secure document vault, Branch office',
      retentionPeriod: '7 years after account closure',
      securityLevel: 'restricted'
    },

    complianceRequirements: [
      'Original contract must be retained for duration of account + 7 years',
      'Signature must be witnessed by authorized bank staff',
      'Customer must receive copy of all signed documents',
      'Signature date must be recorded in core banking system'
    ]
  },

  security: {
    compliance: ['Contract law', 'Banking regulations', 'Consumer protection act'],
    securityNotes: [
      'Verify customer identity before signature',
      'Ensure customer signs in presence of witness',
      'Store original securely immediately after signing'
    ]
  },

  observability: {
    enabled: true,
    metrics: [ContractSigningTimeMetric],
    logLevel: 'info'
  },

  tags: ['manual', 'signature', 'contract', 'legal', 'branch']
})
export class PhysicalContractSignatureInteraction {}
```

### Example 4: Organizational - Regulatory Audit

```typescript
@Interaction({
  name: 'Annual Regulatory Compliance Audit',
  description: 'Annual audit of account opening processes by financial regulatory authority',

  pattern: InteractionPattern.Audit,
  layer: InteractionLayer.Organizational,

  inputs: [
    {
      name: 'auditRequest',
      type: 'FormalDocument',
      required: true,
      description: 'Official audit notification from regulator'
    },
    {
      name: 'sampleAccountApplications',
      type: 'PhysicalDocument[]',
      required: true,
      description: 'Random sample of account applications for review'
    },
    {
      name: 'compliancePolicyDocuments',
      type: 'Document[]',
      required: true,
      description: 'Bank compliance policies and procedures'
    }
  ],

  outputs: [
    {
      name: 'auditReport',
      type: 'FormalDocument',
      required: true,
      description: 'Official audit findings report'
    },
    {
      name: 'findingsList',
      type: 'AuditFinding[]',
      required: true,
      description: 'List of compliance gaps or violations found'
    },
    {
      name: 'remediationPlan',
      type: 'Document',
      required: true,
      description: 'Bank response and remediation plan'
    }
  ],

  preconditions: [
    'Audit notification received with 30 days notice',
    'Sample accounts identified per regulator criteria',
    'All required documents prepared and organized',
    'Compliance team briefed and available'
  ],

  postconditions: [
    'Audit completed within regulatory timeframe',
    'All findings documented',
    'Remediation plan submitted to regulator',
    'Internal follow-up actions assigned'
  ],

  organizationalConfig: {
    interactionType: 'audit',

    organizations: [
      {
        organization: OgPgyBankOrganization,
        role: 'regulated-entity'
      },
      {
        organization: GenaiFinancialRegulatoryAuthorityOrganization,
        role: 'regulator'
      }
    ],

    legalFramework: {
      jurisdiction: 'Genai Island Nation',
      governingLaw: 'Banking Act 2018, Section 45',
      disputeResolution: 'Administrative appeal to Banking Tribunal'
    },

    auditDetails: {
      auditType: 'compliance',
      scope: 'Account opening and KYC/AML processes',
      auditor: RegulatoryAuditorStakeholder,
      frequency: 'annually',
      lastAuditDate: '2024-03-15',
      nextAuditDate: '2025-03-15'
    },

    regulatoryBody: 'Genai Financial Services Regulatory Authority (GFSRA)',

    filingRequirements: {
      frequency: 'annually',
      deadline: '30 days after fiscal year end',
      format: 'PDF report + supporting documentation',
      certificationRequired: true  // Must be signed by CEO and Chief Risk Officer
    },

    complianceRequirements: [
      'Provide sample of 50 random account openings from past year',
      'Demonstrate compliance with KYC/AML regulations',
      'Show evidence of staff training on compliance procedures',
      'Provide statistics on rejected applications and reasons',
      'Demonstrate data retention and secure storage practices'
    ],

    keyContacts: [
      {
        organization: OgPgyBankOrganization,
        contactName: 'Elena Rodriguez',
        contactRole: 'Chief Risk Officer',
        contactInfo: 'elena.rodriguez@ogpgybank.gn'
      },
      {
        organization: GenaiFinancialRegulatoryAuthorityOrganization,
        contactName: 'Senior Auditor',
        contactRole: 'Lead Auditor',
        contactInfo: 'audits@gfsra.gov.gn'
      }
    ]
  },

  participants: [
    {
      stakeholder: RegulatoryAuditorStakeholder,
      role: 'auditor',
      required: true
    },
    {
      stakeholder: ChiefRiskOfficerStakeholder,
      role: 'bank-representative',
      required: true
    },
    {
      stakeholder: ComplianceOfficerStakeholder,
      role: 'subject-matter-expert',
      required: true
    },
    {
      stakeholder: LegalCounselStakeholder,
      role: 'observer',
      required: false
    }
  ],

  observability: {
    enabled: true,
    metrics: [AuditFindingsCountMetric, AuditRemediationTimeMetric],
    logLevel: 'info',
    auditTrail: {
      enabled: true,
      retentionPeriod: 'permanent',
      includeDetails: ['audit-date', 'auditor', 'findings', 'remediation-actions', 'closure-date']
    }
  },

  tags: ['organizational', 'regulatory', 'audit', 'compliance', 'annual']
})
export class AnnualRegulatoryComplianceAuditInteraction {}
```

`★ Insight ─────────────────────────────────────`
1. **Layer-specific configs shine**: interpersonalConfig, manualConfig, and organizationalConfig capture nuances (location, physical documents, witnessing) that don't apply to digital interactions.
2. **Compliance is paramount**: Offline interactions often exist BECAUSE of regulations—notice the heavy emphasis on compliance, audit trails, and retention periods.
3. **Time scales differ dramatically**: Digital interactions measure latency in milliseconds; offline interactions measure duration in hours/days and retention in years.
`─────────────────────────────────────────────────`

---

## @Collaboration Decorator

The `@Collaboration` decorator models **multi-stakeholder coordination patterns** that don't fit the provider/consumer model. Use it when:
- Multiple stakeholders participate (not just 2)
- Human coordination is central (meetings, reviews, workshops)
- Process is manual or offline
- Interaction spans organizational boundaries

### Schema Overview

```typescript
interface CollaborationOptions {
  // ===== CORE IDENTITY =====
  name: string;
  context?: WithContext;
  description?: string;
  purpose: string;                        // Why this collaboration happens
  collaborationType?: string;             // meeting | review-approval | negotiation | audit | etc.

  // ===== PARTICIPANTS (Required) =====
  participants: CollaborationParticipant[];  // Must have ≥ 2

  // ===== TEMPORAL ASPECTS =====
  frequency?: string;                     // daily | weekly | monthly | ad-hoc | etc.
  duration?: string;                      // ISO 8601 format
  scheduling?: {...};

  // ===== COMMUNICATION & LOCATION =====
  communicationChannel?: string;          // in-person | video-call | phone | email | etc.
  synchronicity?: string;                 // synchronous | asynchronous | mixed
  location?: {...};

  // ===== PROCESS & WORKFLOW =====
  touchpoints?: string[];                 // Key phases/stages
  agenda?: string[];                      // Topics for meetings
  prerequisites?: string[];

  // ===== ARTIFACTS =====
  artifactsRequired?: CollaborationArtifact[];
  artifactsProduced?: CollaborationArtifact[];

  // ===== OUTCOMES =====
  expectedOutcomes?: CollaborationOutcome[];
  successCriteria?: string[];

  // ===== RELATED TECHNICAL INTERACTIONS =====
  relatedInteractions?: WithInteraction[];

  // ===== GOVERNANCE =====
  decisionMaking?: {...};
  complianceRequirements?: string[];
  documentation?: {...};
  facilitation?: {...};
  supportNeeded?: string[];

  // ===== PERFORMANCE & METRICS =====
  metrics?: WithMetric[];
  kpis?: string[];

  // ===== RISK & ESCALATION =====
  risks?: Array<{...}>;
  escalationPath?: string;

  tags?: string[];
}
```

### Example 1: Manual Compliance Review Collaboration

```typescript
import { Collaboration } from '@aabha/core';

@Collaboration({
  name: 'Account Opening Manual Compliance Review',
  description: 'Multi-stakeholder review process for high-risk account applications requiring manual compliance approval',

  context: AccountOpeningComplianceContext,

  purpose: 'Ensure high-risk account applications meet all regulatory requirements through multi-level human review',

  collaborationType: 'review-approval',

  // Multiple stakeholders with defined roles
  participants: [
    {
      stakeholder: ComplianceOfficerStakeholder,
      role: 'reviewer',
      required: true,
      responsibilities: [
        'Review all application documents for completeness',
        'Verify identity documents against government databases',
        'Check customer against sanctions lists and PEP databases',
        'Assess AML risk factors',
        'Document findings and recommendation'
      ]
    },
    {
      stakeholder: SeniorComplianceOfficerStakeholder,
      role: 'approver',
      required: true,
      responsibilities: [
        'Review compliance officer findings',
        'Make final approval/rejection decision',
        'Document rationale for decision',
        'Sign off on review'
      ]
    },
    {
      stakeholder: ChiefRiskOfficerStakeholder,
      role: 'escalation-approver',
      required: false,
      responsibilities: [
        'Review escalated high-risk cases',
        'Provide final decision on edge cases'
      ]
    }
  ],

  frequency: 'ad-hoc',  // Triggered when high-risk application received
  duration: 'PT4H',     // Typically 4 hours for complete review

  communicationChannel: 'document-review',  // Asynchronous document-based
  synchronicity: 'asynchronous',

  location: {
    type: 'physical',
    address: 'Compliance Department, OgPgyBank HQ, Floor 3'
  },

  // Process stages
  touchpoints: [
    'Application received and assigned',
    'Initial compliance officer review',
    'Document verification',
    'AML/sanctions screening',
    'Risk assessment',
    'Senior officer review',
    'Final approval decision',
    'Documentation and filing'
  ],

  prerequisites: [
    'Complete application form received',
    'All required identity documents submitted',
    'Customer consent for background checks obtained',
    'Application flagged as high-risk by automated screening'
  ],

  // Inputs to collaboration
  artifactsRequired: [
    {
      name: 'Account application form',
      type: 'document',
      required: true,
      format: 'Physical paper form',
      owner: BranchRelationshipManagerStakeholder
    },
    {
      name: 'Identity documents',
      type: 'document',
      required: true,
      format: 'Photocopies of government ID and proof of address'
    },
    {
      name: 'Risk assessment worksheet',
      type: 'form',
      required: true,
      format: 'Completed risk scoring form',
      owner: ComplianceOfficerStakeholder
    },
    {
      name: 'AML screening report',
      type: 'report',
      required: true,
      format: 'Automated screening system output'
    }
  ],

  // Outputs from collaboration
  artifactsProduced: [
    {
      name: 'Compliance review report',
      type: 'report',
      required: true,
      format: 'Structured review form with findings',
      owner: ComplianceOfficerStakeholder
    },
    {
      name: 'Approval decision memo',
      type: 'decision',
      required: true,
      format: 'Signed approval/rejection with rationale',
      owner: SeniorComplianceOfficerStakeholder
    },
    {
      name: 'Filed application package',
      type: 'document',
      required: true,
      format: 'Complete application with all reviews and signatures',
      description: 'Archived for 7 years per regulation'
    }
  ],

  expectedOutcomes: [
    {
      outcome: 'Application approved or rejected with documented rationale',
      type: 'decision',
      successCriteria: [
        'All required checks completed',
        'Decision aligns with risk policy',
        'Rationale clearly documented',
        'Senior officer signature obtained'
      ],
      responsibleParty: SeniorComplianceOfficerStakeholder
    },
    {
      outcome: 'Compliance documentation complete and filed',
      type: 'approval',
      successCriteria: [
        'All forms signed and dated',
        'Documents filed in secure archive',
        'Electronic record updated in system'
      ],
      responsibleParty: ComplianceOfficerStakeholder
    }
  ],

  successCriteria: [
    'Review completed within 4 hours of assignment',
    'All compliance checks passed and documented',
    'Decision made with clear rationale',
    'No audit findings on review quality',
    'Customer notified of decision within 24 hours'
  ],

  decisionMaking: {
    approach: 'hierarchical',
    description: 'Compliance officer recommends, senior officer decides, CRO escalates edge cases'
  },

  complianceRequirements: [
    'All reviews must be documented in writing',
    'Senior officer sign-off required for high-risk accounts',
    'Documents retained for 7 years per Banking Act Section 12',
    'Monthly quality audit of 10% of reviews',
    'Annual training for all compliance reviewers'
  ],

  documentation: {
    required: true,
    documentsRequired: [
      'Completed compliance review form',
      'AML screening results',
      'Risk assessment scoring',
      'Approval decision memo'
    ],
    retentionPeriod: '7y',
    documentOwner: ComplianceOfficerStakeholder
  },

  // Links to technical systems
  relatedInteractions: [
    ManualComplianceDocumentReviewInteraction,
    ComplianceSystemRecordUpdateInteraction,
    CustomerNotificationEmailInteraction
  ],

  metrics: [
    ComplianceReviewTimeMetric,
    ComplianceApprovalRateMetric,
    ComplianceAuditFindingsMetric
  ],

  kpis: [
    'Average review time < 4 hours',
    'Zero major audit findings',
    'Customer satisfaction with process > 4/5'
  ],

  risks: [
    {
      risk: 'Reviewer unavailable causing delay',
      likelihood: 'medium',
      impact: 'high',
      mitigation: 'Maintain pool of trained backup reviewers, cross-train team members'
    },
    {
      risk: 'Inconsistent decision-making across reviewers',
      likelihood: 'medium',
      impact: 'high',
      mitigation: 'Regular calibration sessions, clear decision criteria, peer review spot checks'
    },
    {
      risk: 'Documentation incomplete or missing',
      likelihood: 'low',
      impact: 'critical',
      mitigation: 'Mandatory checklist, automated reminders, QA spot checks'
    }
  ],

  escalationPath: 'Escalate to Chief Risk Officer if senior compliance officer uncertain or conflict of interest identified',

  tags: ['compliance', 'manual-review', 'high-risk', 'multi-level-approval']
})
export class AccountOpeningComplianceReviewCollaboration {}
```

### Example 2: Investment Committee Meeting Collaboration

```typescript
@Collaboration({
  name: 'Monthly Investment Committee Meeting',
  description: 'Monthly governance meeting where senior stakeholders review portfolio performance and approve new investment proposals',

  context: InvestmentManagementContext,

  purpose: 'Joint review of investment portfolio performance and approval of new investment proposals for high-net-worth clients',

  collaborationType: 'meeting',

  participants: [
    {
      stakeholder: PrimaryInvestorStakeholder,
      role: 'decision-maker',
      required: true,
      responsibilities: [
        'Review portfolio performance',
        'Evaluate new investment proposals',
        'Make final investment decisions',
        'Approve risk allocation changes'
      ]
    },
    {
      stakeholder: FinancialAdvisorStakeholder,
      role: 'presenter',
      required: true,
      responsibilities: [
        'Present portfolio performance report',
        'Recommend new investment opportunities',
        'Explain market trends and outlook',
        'Answer questions about proposals'
      ]
    },
    {
      stakeholder: RiskManagerStakeholder,
      role: 'reviewer',
      required: true,
      responsibilities: [
        'Assess risk of new proposals',
        'Report on portfolio risk metrics',
        'Ensure alignment with risk policy',
        'Flag concerns or red flags'
      ]
    },
    {
      stakeholder: ComplianceOfficerStakeholder,
      role: 'observer',
      required: false,
      responsibilities: [
        'Observe for regulatory compliance',
        'Flag any compliance concerns',
        'Ensure proper documentation'
      ]
    }
  ],

  frequency: 'monthly',
  duration: 'PT2H',  // 2 hours

  scheduling: {
    timeOfDay: 'Morning (9:00 AM)',
    dayPattern: 'First Tuesday of each month',
    leadTime: 'PT72H',  // 3 days notice for materials
    cancellationNotice: 'PT48H'  // 2 days notice to cancel
  },

  communicationChannel: 'in-person-meeting',
  synchronicity: 'synchronous',

  location: {
    type: 'hybrid',
    address: 'OgPgyBank Conference Room A, Floor 5',
    virtualPlatform: 'Zoom (for remote participants)'
  },

  agenda: [
    'Review minutes from previous meeting',
    'Portfolio performance review (20 min)',
    'Market outlook discussion (15 min)',
    'New investment proposals presentation (30 min)',
    'Risk assessment discussion (20 min)',
    'Investment decisions and voting (20 min)',
    'Action items assignment (10 min)',
    'Closing and next meeting confirmation (5 min)'
  ],

  prerequisites: [
    'Portfolio performance report distributed 72 hours prior',
    'Investment proposals submitted 72 hours prior',
    'All participants reviewed materials',
    'Conference room booked and equipment tested'
  ],

  artifactsRequired: [
    {
      name: 'Portfolio performance report',
      type: 'report',
      required: true,
      format: 'PDF presentation',
      owner: FinancialAdvisorStakeholder,
      description: 'Detailed portfolio performance for past month'
    },
    {
      name: 'Investment proposals',
      type: 'document',
      required: true,
      format: 'Proposal template with risk analysis',
      owner: FinancialAdvisorStakeholder
    },
    {
      name: 'Risk metrics dashboard',
      type: 'report',
      required: true,
      format: 'Excel dashboard',
      owner: RiskManagerStakeholder
    }
  ],

  artifactsProduced: [
    {
      name: 'Meeting minutes',
      type: 'document',
      required: true,
      format: 'Written minutes document',
      owner: FinancialAdvisorStakeholder,
      description: 'Summary of discussions and decisions'
    },
    {
      name: 'Investment decision log',
      type: 'decision',
      required: true,
      format: 'Structured decision record',
      owner: PrimaryInvestorStakeholder,
      description: 'Approved/rejected proposals with rationale'
    },
    {
      name: 'Action items list',
      type: 'document',
      required: true,
      format: 'Action tracker with owners and deadlines',
      owner: FinancialAdvisorStakeholder
    }
  ],

  expectedOutcomes: [
    {
      outcome: 'Investment decisions made on all proposals',
      type: 'decision',
      successCriteria: [
        'All proposals reviewed and voted on',
        'Decisions documented with rationale',
        'Risk implications understood'
      ],
      responsibleParty: PrimaryInvestorStakeholder
    },
    {
      outcome: 'Action items assigned with clear owners',
      type: 'action-items',
      successCriteria: [
        'All action items have assigned owners',
        'Due dates set for all items',
        'Follow-up process agreed'
      ],
      responsibleParty: FinancialAdvisorStakeholder
    }
  ],

  successCriteria: [
    'Meeting completed within 2 hour timeframe',
    'All agenda items covered',
    'Decisions made on all proposals',
    'Action items assigned with owners and dates',
    'All stakeholders satisfied with process',
    'Minutes distributed within 24 hours'
  ],

  decisionMaking: {
    approach: 'consensus',
    quorum: 'Primary investor and financial advisor required',
    tieBreaker: 'Primary investor has final decision authority'
  },

  documentation: {
    required: true,
    documentsRequired: [
      'Meeting minutes',
      'Investment decision log',
      'Action items tracker'
    ],
    retentionPeriod: '7y',  // Financial records retention
    documentOwner: FinancialAdvisorStakeholder
  },

  facilitation: {
    required: true,
    facilitator: FinancialAdvisorStakeholder,
    approach: 'Structured agenda with timed sections'
  },

  supportNeeded: [
    'Conference room with projector and video conferencing',
    'Zoom account for virtual participants',
    'Printed copies of all materials',
    'Whiteboard for discussion',
    'Refreshments'
  ],

  relatedInteractions: [
    PortfolioDashboardQueryInteraction,
    InvestmentProposalSubmissionAPIInteraction,
    MeetingMinutesStorageInteraction,
    EmailMeetingInviteInteraction
  ],

  metrics: [
    MeetingDurationMetric,
    MeetingSatisfactionScoreMetric,
    InvestmentDecisionQualityMetric
  ],

  kpis: [
    'Meeting starts and ends on time',
    'All participants attend (>90% attendance rate)',
    'Decisions made on 100% of proposals',
    'Minutes distributed within 24 hours',
    'Participant satisfaction score > 4/5'
  ],

  risks: [
    {
      risk: 'Key participant unable to attend',
      likelihood: 'medium',
      impact: 'high',
      mitigation: 'Reschedule or allow proxy with decision-making authority'
    },
    {
      risk: 'Meeting runs over time',
      likelihood: 'medium',
      impact: 'medium',
      mitigation: 'Strict time management, prioritize agenda items, defer non-critical topics'
    }
  ],

  escalationPath: 'Defer decision to offline discussion if consensus cannot be reached in meeting',

  tags: ['governance', 'investment', 'monthly', 'decision-making', 'meeting']
})
export class InvestmentCommitteeMeetingCollaboration {}
```

`★ Insight ─────────────────────────────────────`
1. **Participants vs provider/consumer**: @Collaboration uses participant-based model where roles are more nuanced (decision-maker, presenter, observer) rather than binary provider/consumer.
2. **Artifacts bridge digital and physical**: artifactsRequired and artifactsProduced can reference both digital (PDFs, emails) and physical items (paper forms, signatures), capturing hybrid workflows.
3. **Governance is explicit**: decisionMaking, escalationPath, and documentation fields make governance transparent and auditable—crucial for regulated environments.
`─────────────────────────────────────────────────`

---

## Complete Offline Example: Branch Account Opening

Let's model a complete **offline branch-based account opening journey** with manual processes, physical documents, and human collaboration.

### Journey Topology

```
CustomerArriveAtBranch
  → CheckInWithReceptionist
    → AssignedToRelationshipManager
      → BranchConsultation (INTERPERSONAL - @Collaboration link)
        → CompleteApplicationForm
          → ReviewIdentityDocuments
            → MakePhotocopiesOfDocuments
              → CustomerSignsContract (MANUAL - PhysicalSignature)
                → SubmitToComplianceQueue
                  → ManualComplianceReview (MANUAL + @Collaboration)
                    ├─[Approved]→ ApplicationApproved
                    │              → EnterDataIntoSystem
                    │                → CreateAccountInCoreBanking
                    │                  → IssueAccountNumber
                    │                    → PrintWelcomeKit
                    │                      → CustomerReceivesWelcomeKit
                    │                        → CustomerLeavesBranch (Success)
                    │
                    └─[Rejected]→ ApplicationRejected
                                   → NotifyCustomerOfRejection
                                     → ReturnDocumentsToCustomer
                                       → CustomerLeavesBranch (Failed)
```

### Full Journey Declaration

```typescript
@Journey({
  name: 'Branch Account Opening',
  description: 'Traditional in-person account opening at physical OgPgyBank branch with manual processing',

  primaryStakeholder: TraditionalBranchCustomer,

  actions: [
    CustomerArriveAtBranchAction,
    CheckInWithReceptionistAction,
    AssignedToRelationshipManagerAction,
    BranchConsultationAction,
    CompleteApplicationFormAction,
    ReviewIdentityDocumentsAction,
    MakePhotocopiesOfDocumentsAction,
    CustomerSignsContractAction,
    SubmitToComplianceQueueAction,
    ManualComplianceReviewAction,
    ApplicationApprovedAction,
    EnterDataIntoSystemAction,
    CreateAccountInCoreBankingAction,
    IssueAccountNumberAction,
    PrintWelcomeKitAction,
    CustomerReceivesWelcomeKitAction,
    CustomerLeavesBranchSuccessAction,
    ApplicationRejectedAction,
    NotifyCustomerOfRejectionAction,
    ReturnDocumentsToCustomerAction,
    CustomerLeavesBranchFailedAction,
  ],

  entryActions: [CustomerArriveAtBranchAction],

  metrics: [
    BranchAccountOpeningTimeMetric,
    BranchAccountOpeningSuccessRateMetric,
    CustomerSatisfactionAtBranchMetric,
    ComplianceReviewTimeMetric,
  ],

  outcomes: [
    'Customer has completed account opening process in branch',
    'All required documents collected and verified',
    'Compliance review completed and approved',
    'Account created in core banking system',
    'Customer has account number and welcome kit',
    'Customer can immediately use account services'
  ],

  tags: ['branch', 'offline', 'traditional', 'manual-process', 'in-person']
})
export class BranchAccountOpeningJourney {}
```

### Key Actions with Offline Interactions

#### Action 1: Branch Consultation (Links to @Collaboration)

```typescript
@Action({
  name: 'Branch Consultation',
  actor: BranchRelationshipManagerStakeholder,
  scope: ActionScope.Composite,

  automationLevel: StepAutomationLevel.Manual,
  estimatedDuration: StepDuration.Medium,  // 20-30 minutes
  criticality: StepCriticality.Required,

  description: 'Relationship manager meets with customer to discuss account options, verify documents, and complete application form',

  expectations: [
    PersonalizedAccountRecommendationExpectation,
    AccurateDocumentVerificationExpectation,
    CompleteApplicationFormExpectation,
  ],

  // Links to Collaboration decorator
  collaboration: BranchAccountOpeningConsultationCollaboration,

  triggers: [
    { action: CompleteApplicationFormAction }
  ],

  tags: ['branch', 'consultation', 'interpersonal']
})
export class BranchConsultationAction {}
```

#### Action 2: Physical Signature

```typescript
@Action({
  name: 'Customer Signs Contract',
  actor: TraditionalBranchCustomer,
  scope: ActionScope.Atomic,

  automationLevel: StepAutomationLevel.Manual,
  estimatedDuration: StepDuration.Quick,  // 5-10 minutes
  criticality: StepCriticality.Critical,

  description: 'Customer reviews and signs account contract and terms & conditions documents in presence of branch staff witness',

  expectations: [
    LegallyBindingSignatureExpectation,
    WitnessedSignatureExpectation,
  ],

  triggers: [
    { action: SubmitToComplianceQueueAction }
  ],

  tags: ['signature', 'legal', 'manual']
})
export class CustomerSignsContractAction {}
```

#### Action 3: Manual Compliance Review (Links to @Collaboration)

```typescript
@Action({
  name: 'Manual Compliance Review',
  actor: ComplianceOfficerStakeholder,
  scope: ActionScope.Composite,

  automationLevel: StepAutomationLevel.Manual,
  estimatedDuration: StepDuration.Long,  // 2-4 hours
  criticality: StepCriticality.Critical,

  description: 'Compliance officer manually reviews application documents, verifies identity, checks sanctions lists, and makes approval decision',

  expectations: [
    ThoroughComplianceReviewExpectation,
    AMLCheckCompletedExpectation,
    DocumentedDecisionRationaleExpectation,
  ],

  // Links to Collaboration decorator for multi-stakeholder review
  collaboration: AccountOpeningComplianceReviewCollaboration,

  triggers: [
    {
      action: ApplicationApprovedAction,
      condition: 'reviewDecision == "Approved"'
    },
    {
      action: ApplicationRejectedAction,
      condition: 'reviewDecision == "Rejected"'
    }
  ],

  maxRetries: 0,  // Manual review cannot be automatically retried
  skipOnError: false,

  tags: ['compliance', 'manual-review', 'critical-decision']
})
export class ManualComplianceReviewAction {}
```

#### Action 4: Application Approved (Journey Milestone)

```typescript
@Action({
  name: 'Application Approved',
  actor: SeniorComplianceOfficerStakeholder,
  scope: ActionScope.Journey,

  emitsEvent: 'account.application.approved',

  automationLevel: StepAutomationLevel.Manual,
  estimatedDuration: StepDuration.Instant,
  criticality: StepCriticality.Critical,

  description: 'Compliance review complete and application approved for account opening',

  triggers: [
    { action: EnterDataIntoSystemAction }
  ],

  tags: ['milestone', 'approval', 'compliance']
})
export class ApplicationApprovedAction {}
```

### Expectation Linking Offline Interaction

```typescript
@Expectation({
  name: 'Thorough Compliance Review',
  description: 'Given a complete application, When compliance officer reviews, Then all KYC/AML checks completed with documented decision within 4 hours',

  provider: ComplianceOfficerStakeholder,
  consumer: TraditionalBranchCustomer,

  // Link to offline manual interaction
  interaction: ManualComplianceDocumentReviewInteraction,

  behaviors: [
    VerifyIdentityDocumentsBehavior,
    CheckSanctionsListsBehavior,
    AssessAMLRiskBehavior,
    DocumentReviewDecisionBehavior,
  ],

  complexity: ExpectationComplexity.Complex,
  category: ExpectationCategory.Compliance,
  verificationLevel: ExpectationVerificationLevel.Enforced,

  quality: {
    slo: {
      latency: {
        max: 'PT4H'  // 4 hours
      }
    }
  },

  observability: {
    enabled: true,
    metrics: [ComplianceReviewTimeMetric, ComplianceApprovalRateMetric],
    auditTrail: {
      enabled: true,
      retentionPeriod: '10y',
      includeDetails: ['reviewer', 'decision', 'rationale', 'documents-checked']
    }
  },

  businessContext: {
    strategicImportance: 'critical',
    impactAssessment: {
      operationalEfficiency: 'Manual review is bottleneck but required by regulation',
      customerSatisfaction: 'Wait time impacts satisfaction but thorough review builds trust'
    }
  },

  tags: ['compliance', 'manual', 'kyc', 'aml', 'regulatory']
})
export class ThoroughComplianceReviewExpectation {}
```

---

## Complete Hybrid Example: High-Value Account Opening

This example shows a **hybrid journey** that combines digital and offline elements: digital instant KYC check followed by mandatory manual compliance review for high-value accounts.

### Journey Topology

```
[DIGITAL PHASE]
LaunchMobileApp
  → SelectHighValueAccount
    → EnterPersonalInfo
      → SubmitForInstantKYC
        → AIPerformsBasicKYCCheck
          ├─[Low Risk + Amount < $50K]→ AutoApprove → AccountCreated (Digital Complete)
          │
          └─[High Risk OR Amount ≥ $50K]→ FlagForManualReview
                                           ↓
                                        [TRANSITION TO OFFLINE]
                                           ↓
[OFFLINE PHASE]
AssignToComplianceOfficer
  → NotifyCustomerOfManualReview (Email)
    → ComplianceOfficerReviewsApplication (Manual)
      → RequestAdditionalDocuments? (Optional)
        → CustomerSubmitsPhysicalDocuments (Branch visit)
          → EnhancedDueDiligenceReview (@Collaboration)
            ├─[Approved]→ SeniorOfficerApproves
            │              → NotifyCustomerOfApproval
            │                → [RETURN TO DIGITAL]
            │                  → AccountCreatedInSystem
            │                    → SendWelcomeEmail
            │
            └─[Rejected]→ NotifyCustomerOfRejection
                           → RefundInitialDeposit
```

### Hybrid Journey Declaration

```typescript
@Journey({
  name: 'High-Value Account Opening (Hybrid)',
  description: 'Digital account opening for high-value accounts with mandatory offline compliance review',

  primaryStakeholder: HighNetWorthCustomer,

  actions: [
    // Digital phase
    LaunchMobileAppAction,
    SelectHighValueAccountAction,
    EnterPersonalInfoAction,
    SubmitForInstantKYCAction,
    AIPerformsBasicKYCCheckAction,
    FlagForManualReviewAction,

    // Transition
    AssignToComplianceOfficerAction,
    NotifyCustomerOfManualReviewAction,

    // Offline phase
    ComplianceOfficerReviewsApplicationAction,
    RequestAdditionalDocumentsAction,
    CustomerSubmitsPhysicalDocumentsAction,
    EnhancedDueDiligenceReviewAction,
    SeniorOfficerApprovesAction,

    // Return to digital
    NotifyCustomerOfApprovalAction,
    AccountCreatedInSystemAction,
    SendWelcomeEmailAction,

    // Rejection path
    NotifyCustomerOfRejectionAction,
    RefundInitialDepositAction,
  ],

  entryActions: [LaunchMobileAppAction],

  metrics: [
    HybridAccountOpeningTimeMetric,
    DigitalToManualTransitionTimeMetric,
    ManualReviewCompletionTimeMetric,
    HighValueAccountApprovalRateMetric,
    CustomerSatisfactionHybridJourneyMetric,
  ],

  outcomes: [
    'Customer initiated account opening digitally',
    'AI performed initial KYC screening',
    'High-risk/high-value flagged for manual review',
    'Compliance officer completed enhanced due diligence',
    'Senior officer approved high-value account',
    'Account created and customer notified',
    'Customer has access to premium banking services'
  ],

  tags: ['hybrid', 'high-value', 'enhanced-due-diligence', 'digital-to-manual-transition']
})
export class HighValueAccountOpeningHybridJourney {}
```

### Key Hybrid Actions

#### Digital-to-Offline Transition Action

```typescript
@Action({
  name: 'Flag For Manual Review',
  actor: SystemStakeholder,
  scope: ActionScope.Composite,

  emitsEvent: 'account.flagged.manual.review',

  automationLevel: StepAutomationLevel.FullyAutomated,
  estimatedDuration: StepDuration.Instant,
  criticality: StepCriticality.Critical,

  description: 'System automatically flags high-risk or high-value account application for manual compliance review',

  expectations: [
    InstantFlaggingExpectation,
    AutomatedWorkflowRoutingExpectation,
  ],

  triggers: [
    { action: AssignToComplianceOfficerAction },
    { action: NotifyCustomerOfManualReviewAction }  // Parallel notification
  ],

  tags: ['transition', 'automated', 'workflow-routing']
})
export class FlagForManualReviewAction {}
```

#### Offline Manual Review with Collaboration

```typescript
@Action({
  name: 'Enhanced Due Diligence Review',
  actor: ComplianceOfficerStakeholder,
  scope: ActionScope.Composite,

  automationLevel: StepAutomationLevel.Manual,
  estimatedDuration: StepDuration.Long,  // 1-2 days
  criticality: StepCriticality.Critical,

  description: 'Multi-stakeholder enhanced due diligence review for high-value account including source of funds verification',

  expectations: [
    SourceOfFundsVerificationExpectation,
    EnhancedAMLCheckExpectation,
    SeniorOfficerApprovalExpectation,
  ],

  // Links to complex multi-stakeholder collaboration
  collaboration: EnhancedDueDiligenceCollaboration,

  triggers: [
    {
      action: SeniorOfficerApprovesAction,
      condition: 'reviewDecision == "Approved" && seniorOfficerApproval == true'
    },
    {
      action: NotifyCustomerOfRejectionAction,
      condition: 'reviewDecision == "Rejected"'
    }
  ],

  tags: ['enhanced-due-diligence', 'high-value', 'manual', 'collaboration']
})
export class EnhancedDueDiligenceReviewAction {}
```

#### Offline-to-Digital Transition Action

```typescript
@Action({
  name: 'Account Created In System',
  actor: SystemStakeholder,
  scope: ActionScope.Journey,

  emitsEvent: 'account.created.high.value',

  automationLevel: StepAutomationLevel.FullyAutomated,
  estimatedDuration: StepDuration.Instant,
  criticality: StepCriticality.Critical,

  description: 'System creates high-value account after manual approval, returning to digital processing',

  expectations: [
    ReliableAccountCreationExpectation,
    PremiumAccountFeaturesExpectation,
  ],

  triggers: [
    { action: SendWelcomeEmailAction },
    { action: AssignDedicatedRelationshipManagerAction }  // Premium service
  ],

  tags: ['account-creation', 'transition-to-digital', 'premium']
})
export class AccountCreatedInSystemAction {}
```

### Enhanced Due Diligence Collaboration

```typescript
@Collaboration({
  name: 'Enhanced Due Diligence Review',
  description: 'Multi-level review process for high-value accounts requiring enhanced AML/KYC checks and senior officer approval',

  context: HighValueAccountComplianceContext,

  purpose: 'Thorough verification of high-value customer identity, source of funds, and AML risk to meet regulatory enhanced due diligence requirements',

  collaborationType: 'review-approval',

  participants: [
    {
      stakeholder: ComplianceOfficerStakeholder,
      role: 'primary-reviewer',
      required: true,
      responsibilities: [
        'Verify customer identity with enhanced checks',
        'Investigate source of funds and wealth',
        'Conduct enhanced AML screening',
        'Interview customer if required',
        'Document findings comprehensively'
      ]
    },
    {
      stakeholder: SeniorComplianceOfficerStakeholder,
      role: 'secondary-reviewer',
      required: true,
      responsibilities: [
        'Review primary compliance officer findings',
        'Validate source of funds verification',
        'Make preliminary approval recommendation'
      ]
    },
    {
      stakeholder: ChiefRiskOfficerStakeholder,
      role: 'final-approver',
      required: true,
      responsibilities: [
        'Final sign-off on high-value accounts',
        'Assess reputational risk',
        'Make ultimate approval/rejection decision'
      ]
    },
    {
      stakeholder: LegalCounselStakeholder,
      role: 'advisor',
      required: false,
      responsibilities: [
        'Advise on legal/regulatory implications',
        'Review if politically exposed person identified'
      ]
    }
  ],

  frequency: 'ad-hoc',
  duration: 'PT48H',  // Typically 2 business days

  communicationChannel: 'hybrid',  // Email + in-person meetings
  synchronicity: 'asynchronous',

  touchpoints: [
    'Application flagged and assigned',
    'Primary compliance officer investigation',
    'Customer interview (if required)',
    'Source of funds documentation review',
    'Enhanced AML/PEP screening',
    'Secondary compliance officer review',
    'Chief Risk Officer final decision',
    'Customer notification of decision'
  ],

  artifactsRequired: [
    {
      name: 'Account application',
      type: 'document',
      required: true
    },
    {
      name: 'Source of funds documentation',
      type: 'document',
      required: true,
      description: 'Bank statements, tax returns, proof of business ownership, inheritance documents, etc.'
    },
    {
      name: 'Enhanced identity verification',
      type: 'document',
      required: true,
      description: 'Multiple forms of ID, utility bills, reference letters'
    },
    {
      name: 'Enhanced AML screening report',
      type: 'report',
      required: true,
      description: 'Comprehensive AML, sanctions, PEP, adverse media screening'
    }
  ],

  artifactsProduced: [
    {
      name: 'Enhanced due diligence report',
      type: 'report',
      required: true,
      owner: ComplianceOfficerStakeholder,
      description: 'Comprehensive EDD report with findings and recommendation'
    },
    {
      name: 'Senior officer approval memo',
      type: 'decision',
      required: true,
      owner: ChiefRiskOfficerStakeholder,
      description: 'Final approval decision with detailed rationale'
    }
  ],

  expectedOutcomes: [
    {
      outcome: 'High-value account approved or rejected with documented rationale',
      type: 'decision',
      successCriteria: [
        'All enhanced checks completed',
        'Source of funds verified',
        'Three-level review completed',
        'CRO sign-off obtained',
        'Comprehensive documentation retained'
      ],
      responsibleParty: ChiefRiskOfficerStakeholder
    }
  ],

  successCriteria: [
    'Review completed within 2 business days',
    'All regulatory EDD requirements met',
    'Clear decision with documented rationale',
    'Customer satisfied with process transparency',
    'Zero regulatory findings on EDD quality'
  ],

  decisionMaking: {
    approach: 'hierarchical',
    description: 'Compliance officer recommends → Senior compliance validates → CRO decides',
    quorum: 'All three levels required for approval'
  },

  complianceRequirements: [
    'Enhanced due diligence required for accounts ≥ $100,000 per AML regulations',
    'Source of funds must be verified and documented',
    'PEP screening mandatory',
    'Senior officer sign-off required',
    'Documentation retained for 10 years'
  ],

  documentation: {
    required: true,
    documentsRequired: [
      'EDD report',
      'Source of funds verification',
      'Customer interview notes (if conducted)',
      'Approval decision memo'
    ],
    retentionPeriod: '10y',
    documentOwner: ComplianceOfficerStakeholder
  },

  relatedInteractions: [
    EnhancedAMLScreeningAPIInteraction,
    SourceOfFundsVerificationInteraction,
    CustomerInterviewInteraction,
    EDDReportStorageInteraction
  ],

  metrics: [
    EDDReviewTimeMetric,
    EDDApprovalRateMetric,
    SourceOfFundsVerificationQualityMetric
  ],

  risks: [
    {
      risk: 'Insufficient source of funds documentation',
      likelihood: 'high',
      impact: 'high',
      mitigation: 'Proactive customer communication, clear documentation requirements, escalation to legal if suspicious'
    },
    {
      risk: 'Delayed review causing customer frustration',
      likelihood: 'medium',
      impact: 'medium',
      mitigation: 'Set clear expectations on timing, provide status updates every 24 hours'
    }
  ],

  escalationPath: 'Escalate to Legal Counsel and CEO if PEP or significant reputational risk identified',

  tags: ['enhanced-due-diligence', 'high-value', 'multi-level-approval', 'regulatory']
})
export class EnhancedDueDiligenceCollaboration {}
```

---

## Integration Patterns

### Pattern 1: Digital-to-Offline Handoff

```typescript
// Digital action detects need for manual intervention
@Action({
  name: 'AI Document Verification',
  triggers: [
    { action: IdentityVerifiedAction, condition: 'aiConfidence >= 95' },
    { action: FlagForManualReviewAction, condition: 'aiConfidence < 95' }  // Handoff
  ]
})

// Transition action bridges to offline
@Action({
  name: 'Flag For Manual Review',
  emitsEvent: 'account.flagged.manual.review',  // Digital event
  triggers: [
    { action: AssignToComplianceOfficerAction },  // Offline action starts
    { action: NotifyCustomerOfDelayAction }      // Keep customer informed
  ]
})

// Offline action with collaboration
@Action({
  name: 'Manual Compliance Review',
  collaboration: AccountOpeningComplianceReviewCollaboration,  // Human coordination
  triggers: [
    { action: ApplicationApprovedAction, condition: 'approved' },
    { action: ApplicationRejectedAction, condition: 'rejected' }
  ]
})
```

### Pattern 2: Parallel Digital + Offline Processing

```typescript
@Action({
  name: 'Account Application Submitted',
  triggers: [
    { action: CreateDigitalAccountRecordAction },      // Parallel: digital processing
    { action: PrintPhysicalApplicationFormAction }     // Parallel: offline documentation
  ]
})
```

### Pattern 3: Offline Collaboration with Digital Artifacts

```typescript
@Collaboration({
  name: 'Branch Consultation',
  communicationChannel: 'in-person-meeting',  // Offline
  relatedInteractions: [
    AccountLookupAPIInteraction,              // Digital: lookup customer history
    ProductRecommendationAIInteraction,       // Digital: AI suggests products
    ApplicationFormStorageInteraction         // Digital: store scanned form
  ]
})
```

### Pattern 4: Manual Review with Digital Audit Trail

```typescript
@Expectation({
  name: 'Thorough Compliance Review',
  interaction: ManualComplianceDocumentReviewInteraction,  // Manual process
  observability: {
    enabled: true,
    auditTrail: {
      enabled: true,                          // Digital audit trail
      retentionPeriod: '10y',
      includeDetails: ['reviewer', 'decision', 'timestamp', 'documents']
    }
  }
})
```

---

## Summary

Offline journeys leverage Aabha's decorator system to model **human-centric, manual, and organizational processes** with:

1. **@Journey**: Same container model, but actions span days/weeks instead of seconds
2. **@Action**: Manual actions with longer durations, often linked to @Collaboration
3. **@Interaction**: Specialized layers (Interpersonal, Manual, Organizational) with layer-specific configs
4. **@Collaboration**: Multi-stakeholder coordination patterns for meetings, reviews, and organizational processes
5. **@Expectation**: Same contract model, but quality measures differ (hours not milliseconds, audit trail not real-time metrics)

**Key Offline Characteristics:**
- Human judgment and decision-making central
- Physical artifacts (documents, signatures, meetings)
- Longer time horizons (hours/days/weeks)
- Regulatory/compliance heavy
- Rich collaboration patterns

**Hybrid Journeys:**
- Seamlessly transition between digital and offline
- Digital actions emit events that route to manual processes
- Manual approvals trigger digital account creation
- Maintains unified audit trail across both domains

**Previous:** See `03-digital-journey-decorators.md` for digital, automated, self-service journeys.
