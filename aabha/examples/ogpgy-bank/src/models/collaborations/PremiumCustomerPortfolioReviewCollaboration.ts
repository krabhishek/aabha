import { Collaboration } from 'aabha';
import { WealthManagementContext } from '../contexts/WealthManagementContext.js';
import { PremiumCustomerStakeholder } from '../stakeholders/human/PremiumCustomerStakeholder.js';
import { RelationshipManagerStakeholder } from '../stakeholders/human/RelationshipManagerStakeholder.js';

/**
 * Premium Customer Portfolio Review Collaboration
 * Quarterly portfolio review meeting between premium customer and relationship manager
 */
@Collaboration({
  name: 'Premium Customer Portfolio Review',
  context: WealthManagementContext,
  description: 'Quarterly meeting where premium customers and their relationship managers review portfolio performance, discuss investment strategies, and make wealth management decisions. This collaboration maintains the high-touch relationship that premium customers expect.',
  purpose: 'Joint review of investment portfolio performance, discussion of investment opportunities, and strategic wealth management planning',
  collaborationType: 'meeting',
  participants: [
    {
      stakeholder: PremiumCustomerStakeholder,
      role: 'decision-maker',
      required: true,
      responsibilities: [
        'Review portfolio performance',
        'Provide feedback on investment strategy',
        'Make investment decisions',
        'Share financial goals and concerns',
        'Approve recommended changes'
      ]
    },
    {
      stakeholder: RelationshipManagerStakeholder,
      role: 'presenter',
      required: true,
      responsibilities: [
        'Prepare portfolio performance report',
        'Present investment performance and analysis',
        'Recommend investment opportunities',
        'Address customer questions and concerns',
        'Document meeting outcomes and action items'
      ]
    }
  ],
  frequency: 'quarterly',
  duration: 'PT1H30M',
  scheduling: {
    timeOfDay: 'Business hours (typically 10 AM - 4 PM)',
    dayPattern: 'Scheduled 2 weeks in advance',
    leadTime: '2 weeks',
    cancellationNotice: '48 hours'
  },
  communicationChannel: 'hybrid',
  synchronicity: 'synchronous',
  location: {
    type: 'hybrid',
    address: 'OgPgyBank Premium Banking Center or customer preferred location',
    virtualPlatform: 'Zoom or Microsoft Teams'
  },
  agenda: [
    'Portfolio performance review',
    'Market outlook and economic analysis',
    'Investment opportunities discussion',
    'Risk assessment and portfolio rebalancing',
    'Estate planning and tax optimization',
    'Action items and next steps'
  ],
  prerequisites: [
    'Portfolio performance report prepared 48 hours in advance',
    'Customer has reviewed preliminary materials',
    'All required documentation available',
    'Meeting scheduled with adequate notice'
  ],
  artifactsRequired: [
    {
      name: 'Portfolio performance report',
      type: 'report',
      required: true,
      format: 'PDF or digital dashboard',
      owner: RelationshipManagerStakeholder,
      description: 'Comprehensive report showing portfolio performance, asset allocation, and investment returns'
    },
    {
      name: 'Market outlook analysis',
      type: 'report',
      required: true,
      format: 'PDF presentation',
      owner: RelationshipManagerStakeholder,
      description: 'Analysis of current market conditions and economic outlook'
    },
    {
      name: 'Investment opportunity proposals',
      type: 'document',
      required: false,
      format: 'PDF proposals',
      owner: RelationshipManagerStakeholder,
      description: 'Recommended investment opportunities with risk-return analysis'
    }
  ],
  artifactsProduced: [
    {
      name: 'Meeting minutes',
      type: 'document',
      required: true,
      owner: RelationshipManagerStakeholder,
      description: 'Summary of discussion, decisions made, and action items'
    },
    {
      name: 'Investment decisions',
      type: 'decision',
      required: true,
      owner: PremiumCustomerStakeholder,
      description: 'Decisions on portfolio changes, new investments, or strategy adjustments'
    },
    {
      name: 'Action items',
      type: 'document',
      required: true,
      owner: RelationshipManagerStakeholder,
      description: 'Action items with owners and due dates for follow-up'
    },
    {
      name: 'Updated investment plan',
      type: 'document',
      required: false,
      owner: RelationshipManagerStakeholder,
      description: 'Revised investment plan reflecting decisions made during meeting'
    }
  ],
  expectedOutcomes: [
    {
      outcome: 'Portfolio performance reviewed and understood',
      type: 'information-sharing',
      responsibleParty: RelationshipManagerStakeholder,
      successCriteria: [
        'Customer understands portfolio performance',
        'Performance metrics clearly explained',
        'Questions answered satisfactorily'
      ]
    },
    {
      outcome: 'Investment decisions made',
      type: 'decision',
      responsibleParty: PremiumCustomerStakeholder,
      successCriteria: [
        'Decisions documented clearly',
        'Rationale understood',
        'Action items assigned'
      ]
    },
    {
      outcome: 'Relationship strengthened',
      type: 'agreement',
      responsibleParty: RelationshipManagerStakeholder,
      successCriteria: [
        'Customer feels valued and understood',
        'Proactive advice appreciated',
        'Trust in relationship maintained'
      ]
    }
  ],
  successCriteria: [
    'Meeting completed within scheduled time',
    'All agenda items covered',
    'Customer satisfied with service',
    'Decisions made and documented',
    'Action items assigned with due dates',
    'Follow-up scheduled'
  ],
  decisionMaking: {
    approach: 'single-approver',
    tieBreaker: 'Premium customer has final decision authority on all investment choices'
  },
  facilitation: {
    required: false,
    facilitator: RelationshipManagerStakeholder,
    approach: 'Relationship manager facilitates discussion while customer makes final decisions'
  },
  supportNeeded: [
    'Conference room or virtual meeting platform',
    'Portfolio performance dashboard access',
    'Investment proposal materials',
    'Documentation tools for meeting minutes'
  ],
  risks: [
    {
      risk: 'Customer unable to attend scheduled meeting',
      likelihood: 'medium',
      impact: 'medium',
      mitigation: 'Flexible scheduling, rescheduling options, and virtual meeting alternatives'
    },
    {
      risk: 'Portfolio performance below expectations',
      likelihood: 'medium',
      impact: 'high',
      mitigation: 'Proactive communication before meeting, clear explanation of market conditions, and revised strategy recommendations'
    },
    {
      risk: 'Relationship manager turnover affecting continuity',
      likelihood: 'low',
      impact: 'high',
      mitigation: 'Succession planning, knowledge transfer, and introduction of new relationship manager well in advance'
    }
  ],
  escalationPath: 'Complex investment decisions or customer concerns escalate to Senior Relationship Manager or Wealth Management Director within 24 hours.',
  tags: ['premium-banking', 'wealth-management', 'relationship-management', 'portfolio-review', 'quarterly']
})
export class PremiumCustomerPortfolioReviewCollaboration {}

