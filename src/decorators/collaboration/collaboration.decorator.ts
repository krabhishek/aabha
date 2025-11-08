/**
 * @Collaboration Decorator
 * Marks a class as a Collaboration (multi-stakeholder interaction pattern)
 * @module aabha/decorators/collaboration
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 *
 * The Collaboration decorator models complex multi-stakeholder interactions that don't fit
 * the traditional provider/consumer model. It's designed for:
 * - Human-to-human interactions (meetings, consultations, negotiations)
 * - Manual processes (reviews, approvals, offline workflows)
 * - Organizational interactions (partnerships, regulatory processes, audits)
 *
 * Key differences from @Interaction:
 * - @Interaction: Technical contracts between systems or components (provider/consumer model)
 * - @Collaboration: Human coordination and multi-party processes (participant-based model)
 */

import { applyBrand } from '../../internal/brand.utils.js';
import type {
  BaseDecoratorOptions,
  Constructor,
  WithCollaboration,
  WithContext,
  WithInteraction,
  WithMetric,
  WithStakeholder,
} from '../../types/index.js';

/**
 * Collaboration participant configuration
 *
 * Defines a stakeholder's role and requirements in a collaboration.
 */
export interface CollaborationParticipant {
  /**
   * Stakeholder participating in this collaboration
   * COMPILE-TIME TYPE SAFETY: Must be @Stakeholder decorated class
   */
  stakeholder: WithStakeholder<Constructor>;

  /**
   * Role this stakeholder plays in the collaboration
   *
   * @example 'decision-maker' - Makes final decisions
   * @example 'presenter' - Presents information
   * @example 'reviewer' - Reviews materials or outcomes
   * @example 'approver' - Provides approval
   * @example 'facilitator' - Moderates/facilitates the collaboration
   * @example 'observer' - Observes but doesn't actively participate
   * @example 'contributor' - Contributes input
   * @example 'stakeholder' - General stakeholder with interest
   */
  role:
    | 'decision-maker'
    | 'presenter'
    | 'reviewer'
    | 'approver'
    | 'facilitator'
    | 'observer'
    | 'contributor'
    | 'stakeholder'
    | string;

  /**
   * Whether this stakeholder's participation is required
   *
   * @default true
   */
  required?: boolean;

  /**
   * Responsibilities of this participant
   *
   * @example ['Present quarterly portfolio performance', 'Answer questions about investments']
   */
  responsibilities?: string[];
}

/**
 * Collaboration artifact
 *
 * Documents, materials, or deliverables associated with the collaboration.
 */
export interface CollaborationArtifact {
  /**
   * Artifact name
   *
   * @example 'Meeting minutes'
   * @example 'Investment proposal document'
   * @example 'Approval form'
   */
  name: string;

  /**
   * Artifact type
   *
   * @example 'document' - Written document
   * @example 'presentation' - Slide deck or presentation
   * @example 'form' - Form to be filled out
   * @example 'report' - Report or analysis
   * @example 'recording' - Audio/video recording
   * @example 'decision' - Decision or resolution
   */
  type?:
    | 'document'
    | 'presentation'
    | 'form'
    | 'report'
    | 'recording'
    | 'decision'
    | 'approval'
    | 'agreement'
    | string;

  /**
   * Description of the artifact
   */
  description?: string;

  /**
   * Whether this artifact is required
   */
  required?: boolean;

  /**
   * Format of the artifact
   *
   * @example 'PDF'
   * @example 'Google Slides'
   * @example 'Physical document'
   */
  format?: string;

  /**
   * Who is responsible for producing this artifact
   */
  owner?: WithStakeholder<Constructor>;
}

/**
 * Collaboration outcome
 *
 * Expected result or deliverable from the collaboration.
 */
export interface CollaborationOutcome {
  /**
   * Outcome description
   *
   * @example 'Investment decisions approved'
   * @example 'Action items assigned'
   * @example 'Contract signed'
   */
  outcome: string;

  /**
   * Outcome type
   *
   * @example 'decision' - Decision made
   * @example 'approval' - Approval given
   * @example 'agreement' - Agreement reached
   * @example 'action-items' - Action items created
   * @example 'escalation' - Issue escalated
   */
  type?:
    | 'decision'
    | 'approval'
    | 'agreement'
    | 'action-items'
    | 'escalation'
    | 'information-sharing'
    | string;

  /**
   * Success criteria for this outcome
   *
   * @example ['All proposals reviewed', 'Decisions documented', 'Stakeholders aligned']
   */
  successCriteria?: string[];

  /**
   * Responsible stakeholder for this outcome
   */
  responsibleParty?: WithStakeholder<Constructor>;
}

/**
 * Collaboration decorator options
 *
 * Represents a multi-stakeholder interaction pattern. Unlike @Interaction which models
 * technical provider/consumer contracts, @Collaboration models human coordination,
 * offline processes, and organizational interactions.
 *
 * Use @Collaboration when:
 * - Multiple stakeholders participate (not just provider/consumer)
 * - The interaction involves human coordination (meetings, consultations)
 * - The process is manual or offline (reviews, physical documents)
 * - The interaction spans organizational boundaries
 *
 * Use @Interaction when:
 * - Modeling technical system-to-system contracts
 * - Clear provider/consumer relationship
 * - Digital/automated interactions
 * - Focus is on data exchange and protocols
 */
export interface CollaborationOptions extends BaseDecoratorOptions {
  // ============================================================================
  // Core Identity (Required)
  // ============================================================================

  /**
   * Collaboration name (required)
   *
   * Clear, descriptive name for this collaboration pattern.
   *
   * @example 'Monthly Investment Committee Meeting'
   * @example 'Account Opening Manual Review'
   * @example 'Annual Regulatory Compliance Audit'
   * @example 'Partnership Agreement Negotiation'
   */
  name: string;

  /**
   * Business context where this collaboration occurs
   * COMPILE-TIME TYPE SAFETY: Must be @Context decorated class
   *
   * Provides the organizational or business context for this collaboration.
   *
   * @example InvestmentManagementContext
   * @example ComplianceContext
   * @example PartnershipContext
   */
  context?: WithContext<Constructor>;

  /**
   * Human-readable description
   *
   * Detailed explanation of what this collaboration is, when it happens, and why it matters.
   *
   * @example 'Monthly meeting where investors and advisors review portfolio performance, discuss new investment opportunities, and make allocation decisions'
   */
  description?: string;

  // ============================================================================
  // Collaboration Purpose & Type
  // ============================================================================

  /**
   * Purpose of this collaboration (required)
   *
   * Why this collaboration happens and what it aims to achieve.
   *
   * @example 'Joint review of investment portfolio performance and approval of new investments'
   * @example 'Manual compliance review of new account applications'
   * @example 'Negotiation and execution of strategic partnership agreement'
   */
  purpose: string;

  /**
   * Type of collaboration
   *
   * High-level classification of the collaboration pattern.
   *
   * @example 'meeting' - Scheduled meeting or conference
   * @example 'review-approval' - Review and approval process
   * @example 'negotiation' - Multi-party negotiation
   * @example 'audit' - Audit or examination process
   * @example 'consultation' - Advisory consultation
   * @example 'workshop' - Collaborative workshop or working session
   */
  collaborationType?:
    | 'meeting'
    | 'review-approval'
    | 'negotiation'
    | 'audit'
    | 'consultation'
    | 'workshop'
    | 'coordination'
    | string;

  // ============================================================================
  // Participants (Required)
  // ============================================================================

  /**
   * Stakeholders participating in this collaboration (required)
   *
   * All stakeholders involved, with their roles and requirements.
   * Must have at least 2 participants (otherwise use @Interaction).
   *
   * @example
   * ```typescript
   * participants: [
   *   {
   *     stakeholder: InvestorStakeholder,
   *     role: 'decision-maker',
   *     required: true,
   *     responsibilities: ['Review proposals', 'Make final investment decisions']
   *   },
   *   {
   *     stakeholder: FinancialAdvisorStakeholder,
   *     role: 'presenter',
   *     required: true,
   *     responsibilities: ['Present portfolio performance', 'Recommend new investments']
   *   },
   *   {
   *     stakeholder: RiskManagerStakeholder,
   *     role: 'reviewer',
   *     required: true,
   *     responsibilities: ['Assess risk of proposals', 'Ensure compliance with risk policy']
   *   },
   *   {
   *     stakeholder: ComplianceOfficerStakeholder,
   *     role: 'observer',
   *     required: false
   *   }
   * ]
   * ```
   */
  participants: CollaborationParticipant[];

  // ============================================================================
  // Temporal Aspects
  // ============================================================================

  /**
   * Frequency of this collaboration
   *
   * How often this collaboration occurs.
   *
   * @example 'monthly' - Monthly recurrence
   * @example 'quarterly' - Quarterly recurrence
   * @example 'ad-hoc' - As-needed, no regular schedule
   * @example 'annually' - Yearly recurrence
   */
  frequency?:
    | 'daily'
    | 'weekly'
    | 'bi-weekly'
    | 'monthly'
    | 'quarterly'
    | 'annually'
    | 'ad-hoc'
    | 'one-time'
    | string;

  /**
   * Estimated duration (ISO 8601 format)
   *
   * How long this collaboration typically takes.
   *
   * @example 'PT2H' - 2 hours
   * @example 'PT30M' - 30 minutes
   * @example 'PT1D' - 1 day
   * @example 'PT1W' - 1 week
   */
  duration?: string;

  /**
   * Scheduling details
   */
  scheduling?: {
    /** Typical time of day */
    timeOfDay?: string;
    /** Typical day of week/month */
    dayPattern?: string;
    /** Lead time required for scheduling */
    leadTime?: string;
    /** Notice required for cancellation */
    cancellationNotice?: string;
  };

  // ============================================================================
  // Communication & Location
  // ============================================================================

  /**
   * Communication channel for this collaboration
   *
   * How participants interact.
   *
   * @example 'in-person-meeting' - Face-to-face meeting
   * @example 'video-call' - Virtual video conference
   * @example 'phone' - Conference call
   * @example 'email-thread' - Email discussion
   * @example 'document-review' - Asynchronous document review
   */
  communicationChannel?:
    | 'in-person-meeting'
    | 'video-call'
    | 'phone'
    | 'email-thread'
    | 'document-review'
    | 'instant-message'
    | 'hybrid'
    | string;

  /**
   * Whether this collaboration is synchronous or asynchronous
   *
   * @example 'synchronous' - All participants interact at the same time
   * @example 'asynchronous' - Participants interact at different times
   */
  synchronicity?: 'synchronous' | 'asynchronous' | 'mixed';

  /**
   * Location details
   */
  location?: {
    /** Type of location */
    type?: 'physical' | 'virtual' | 'hybrid';
    /** Physical address or room */
    address?: string;
    /** Virtual platform */
    virtualPlatform?: string;
  };

  // ============================================================================
  // Process & Workflow
  // ============================================================================

  /**
   * Collaboration touchpoints or phases
   *
   * Key moments or stages in the collaboration process.
   *
   * @example ['Pre-meeting preparation', 'Opening and introductions', 'Portfolio review', 'Investment proposals discussion', 'Decision making', 'Action items assignment', 'Closing and next steps']
   * @example ['Application submission', 'Initial review', 'Document verification', 'Risk assessment', 'Approval decision']
   */
  touchpoints?: string[];

  /**
   * Agenda or topics (for meetings/discussions)
   *
   * @example ['Portfolio performance review', 'New investment proposals', 'Risk assessment', 'Market outlook discussion']
   */
  agenda?: string[];

  /**
   * Prerequisites or preconditions
   *
   * What must be true or complete before this collaboration can happen.
   *
   * @example ['Portfolio report must be prepared', 'All participants have reviewed materials', 'Investment proposals submitted 48 hours in advance']
   */
  prerequisites?: string[];

  // ============================================================================
  // Artifacts & Materials
  // ============================================================================

  /**
   * Artifacts or materials required for this collaboration
   *
   * Documents, materials, or inputs needed before or during the collaboration.
   *
   * @example
   * ```typescript
   * artifactsRequired: [
   *   {
   *     name: 'Portfolio performance report',
   *     type: 'report',
   *     required: true,
   *     format: 'PDF',
   *     owner: FinancialAdvisorStakeholder
   *   },
   *   {
   *     name: 'Investment proposals',
   *     type: 'document',
   *     required: true,
   *     format: 'Google Docs'
   *   }
   * ]
   * ```
   */
  artifactsRequired?: CollaborationArtifact[];

  /**
   * Artifacts or deliverables produced by this collaboration
   *
   * Outputs, decisions, or materials created during or after the collaboration.
   *
   * @example
   * ```typescript
   * artifactsProduced: [
   *   {
   *     name: 'Meeting minutes',
   *     type: 'document',
   *     required: true,
   *     owner: FinancialAdvisorStakeholder
   *   },
   *   {
   *     name: 'Investment approval decisions',
   *     type: 'decision',
   *     required: true,
   *     owner: InvestorStakeholder
   *   },
   *   {
   *     name: 'Action items',
   *     type: 'document',
   *     required: true
   *   }
   * ]
   * ```
   */
  artifactsProduced?: CollaborationArtifact[];

  // ============================================================================
  // Outcomes & Success Criteria
  // ============================================================================

  /**
   * Expected outcomes from this collaboration
   *
   * What should be achieved or produced by this collaboration.
   *
   * @example
   * ```typescript
   * expectedOutcomes: [
   *   {
   *     outcome: 'Investment decisions made',
   *     type: 'decision',
   *     successCriteria: ['All proposals reviewed', 'Decisions documented'],
   *     responsibleParty: InvestorStakeholder
   *   },
   *   {
   *     outcome: 'Action items assigned',
   *     type: 'action-items',
   *     successCriteria: ['Owners identified', 'Due dates set'],
   *     responsibleParty: FinancialAdvisorStakeholder
   *   }
   * ]
   * ```
   */
  expectedOutcomes?: CollaborationOutcome[];

  /**
   * Success criteria for this collaboration
   *
   * How to measure if this collaboration was successful.
   *
   * @example ['All proposals reviewed', 'Decisions made and documented', 'Action items assigned with owners', 'Stakeholders satisfied with process']
   */
  successCriteria?: string[];

  // ============================================================================
  // Related Technical Interactions
  // ============================================================================

  /**
   * Related technical interactions
   *
   * @Interaction decorated classes that are related to or support this collaboration.
   * Links the human collaboration to the technical system interactions.
   *
   * @example [PortfolioDashboardQueryInteraction, InvestmentProposalSubmissionAPIInteraction, MeetingMinutesStorageInteraction]
   */
  relatedInteractions?: WithInteraction<Constructor>[];

  // ============================================================================
  // Governance & Compliance
  // ============================================================================

  /**
   * Decision-making framework
   *
   * How decisions are made in this collaboration.
   */
  decisionMaking?: {
    /** Decision-making approach */
    approach?:
      | 'consensus'
      | 'majority-vote'
      | 'unanimous'
      | 'single-approver'
      | 'hierarchical'
      | string;
    /** Quorum required (if applicable) */
    quorum?: string;
    /** Tie-breaking mechanism */
    tieBreaker?: string;
  };

  /**
   * Governance or compliance requirements
   *
   * Regulatory, legal, or organizational requirements for this collaboration.
   *
   * @example ['Meeting minutes must be retained for 7 years', 'Decisions require documented rationale', 'Conflicts of interest must be disclosed']
   */
  complianceRequirements?: string[];

  /**
   * Recording or documentation requirements
   */
  documentation?: {
    /** Whether documentation is required */
    required?: boolean;
    /** What must be documented */
    documentsRequired?: string[];
    /** Retention period */
    retentionPeriod?: string;
    /** Responsible party for documentation */
    documentOwner?: WithStakeholder<Constructor>;
  };

  // ============================================================================
  // Facilitation & Support
  // ============================================================================

  /**
   * Facilitation requirements
   */
  facilitation?: {
    /** Whether a facilitator is required */
    required?: boolean;
    /** Facilitator stakeholder */
    facilitator?: WithStakeholder<Constructor>;
    /** Facilitation approach */
    approach?: string;
  };

  /**
   * Support or resources needed
   *
   * Infrastructure, tools, or resources required for this collaboration.
   *
   * @example ['Conference room with projector', 'Video conferencing software', 'Shared document repository']
   */
  supportNeeded?: string[];

  // ============================================================================
  // Performance & Metrics
  // ============================================================================

  /**
   * Metrics for measuring collaboration effectiveness
   * COMPILE-TIME TYPE SAFETY: Must be @Metric decorated classes
   *
   * @example [CollaborationSatisfactionMetric, DecisionQualityMetric, TimeToDecisionMetric]
   */
  metrics?: WithMetric<Constructor>[];

  /**
   * Key performance indicators
   *
   * @example ['Collaboration completed within scheduled time', 'All required participants attended', 'Decisions made on all agenda items', 'Action items assigned with owners']
   */
  kpis?: string[];

  // ============================================================================
  // Risk & Escalation
  // ============================================================================

  /**
   * Risks associated with this collaboration
   *
   * Potential issues that could affect collaboration success.
   *
   * @example
   * ```typescript
   * risks: [
   *   {
   *     risk: 'Key stakeholder unable to attend',
   *     likelihood: 'medium',
   *     impact: 'high',
   *     mitigation: 'Reschedule or have proxy attend with decision-making authority'
   *   }
   * ]
   * ```
   */
  risks?: Array<{
    risk: string;
    likelihood?: 'low' | 'medium' | 'high';
    impact?: 'low' | 'medium' | 'high';
    mitigation?: string;
  }>;

  /**
   * Escalation path
   *
   * What happens if the collaboration cannot reach resolution or outcome.
   *
   * @example 'Escalate unresolved decisions to Investment Committee Chair within 48 hours'
   */
  escalationPath?: string;

  // ============================================================================
  // Metadata (Inherited)
  // ============================================================================

  /**
   * Tags for categorization
   *
   * @example ['governance', 'investment-decision', 'monthly-cadence']
   */
  tags?: string[];

  /**
   * Custom metadata extension point
   */
  extensions?: Record<string, unknown>;
}

/**
 * @Collaboration decorator function
 *
 * Marks a class as a Collaboration, defining a multi-stakeholder interaction pattern.
 *
 * This decorator is compile-time only and has zero runtime overhead.
 * It applies the `WithCollaboration` brand for type-safe references.
 *
 * @param options - Collaboration configuration options
 * @returns Class decorator
 *
 * @example Monthly Investment Committee Meeting
 * ```typescript
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting',
 *   context: InvestmentManagementContext,
 *   description: 'Monthly meeting where investors and advisors review portfolio performance and make investment decisions',
 *   purpose: 'Joint review of investment portfolio performance and approval of new investments',
 *   collaborationType: 'meeting',
 *
 *   participants: [
 *     {
 *       stakeholder: PrimaryInvestorStakeholder,
 *       role: 'decision-maker',
 *       required: true,
 *       responsibilities: ['Review proposals', 'Make final investment decisions']
 *     },
 *     {
 *       stakeholder: FinancialAdvisorStakeholder,
 *       role: 'presenter',
 *       required: true,
 *       responsibilities: ['Present portfolio performance', 'Recommend investments']
 *     },
 *     {
 *       stakeholder: RiskManagerStakeholder,
 *       role: 'reviewer',
 *       required: true
 *     }
 *   ],
 *
 *   frequency: 'monthly',
 *   duration: 'PT2H',
 *   communicationChannel: 'in-person-meeting',
 *   synchronicity: 'synchronous',
 *
 *   location: {
 *     type: 'hybrid',
 *     address: 'Conference Room A, Floor 3',
 *     virtualPlatform: 'Zoom'
 *   },
 *
 *   agenda: [
 *     'Portfolio performance review',
 *     'New investment proposals',
 *     'Risk assessment',
 *     'Market outlook discussion'
 *   ],
 *
 *   artifactsRequired: [
 *     {
 *       name: 'Portfolio performance report',
 *       type: 'report',
 *       required: true,
 *       owner: FinancialAdvisorStakeholder
 *     }
 *   ],
 *
 *   artifactsProduced: [
 *     {
 *       name: 'Meeting minutes',
 *       type: 'document',
 *       required: true
 *     },
 *     {
 *       name: 'Investment decisions',
 *       type: 'decision',
 *       required: true
 *     }
 *   ],
 *
 *   expectedOutcomes: [
 *     {
 *       outcome: 'Investment decisions made',
 *       type: 'decision',
 *       responsibleParty: PrimaryInvestorStakeholder
 *     }
 *   ],
 *
 *   decisionMaking: {
 *     approach: 'consensus',
 *     tieBreaker: 'Primary investor has final say'
 *   },
 *
 *   relatedInteractions: [
 *     PortfolioDashboardQueryInteraction,
 *     InvestmentProposalAPIInteraction
 *   ],
 *
 *   tags: ['governance', 'investment', 'decision-making']
 * })
 * export class InvestmentCommitteeMeetingCollaboration {}
 * ```
 *
 * @example Manual Compliance Review
 * ```typescript
 * @Collaboration({
 *   name: 'Account Opening Manual Compliance Review',
 *   purpose: 'Manual review of new account applications for compliance and risk',
 *   collaborationType: 'review-approval',
 *
 *   participants: [
 *     {
 *       stakeholder: ComplianceOfficerStakeholder,
 *       role: 'reviewer',
 *       required: true,
 *       responsibilities: ['Review application', 'Verify identity', 'Check AML']
 *     },
 *     {
 *       stakeholder: SeniorComplianceOfficerStakeholder,
 *       role: 'approver',
 *       required: false
 *     }
 *   ],
 *
 *   frequency: 'ad-hoc',
 *   duration: 'PT2H',
 *   communicationChannel: 'document-review',
 *   synchronicity: 'asynchronous',
 *
 *   touchpoints: [
 *     'Application received',
 *     'Initial review',
 *     'Document verification',
 *     'Risk assessment',
 *     'Approval decision'
 *   ],
 *
 *   expectedOutcomes: [
 *     {
 *       outcome: 'Application approved or rejected',
 *       type: 'decision'
 *     }
 *   ],
 *
 *   successCriteria: [
 *     'Review completed within 48 hours',
 *     'All compliance checks passed',
 *     'Decision documented with rationale'
 *   ],
 *
 *   tags: ['compliance', 'manual-review', 'account-opening']
 * })
 * export class AccountOpeningComplianceReviewCollaboration {}
 * ```
 */
export function Collaboration(options: CollaborationOptions) {
  return function <T extends Constructor>(
    target: T,
    _context?: ClassDecoratorContext<T>
  ): WithCollaboration<T> {
    applyBrand(target, 'collaboration');
    void options;
    return target as WithCollaboration<T>;
  };
}
