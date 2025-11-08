import { Stakeholder, StakeholderType } from 'aabha';
import { WealthManagementContext } from '../../contexts/WealthManagementContext.js';
import { RelationshipManagerPersona } from '../../personas/human/RelationshipManagerPersona.js';

/**
 * Relationship Manager Stakeholder
 * Human stakeholder responsible for managing premium customer relationships
 */
@Stakeholder({
  name: 'Relationship Manager',
  description: 'Relationship manager responsible for managing premium customer relationships and providing personalized wealth management services. This stakeholder builds long-term relationships and provides proactive financial advice.',
  type: StakeholderType.Human,
  role: 'Relationship Manager',
  persona: RelationshipManagerPersona,
  context: WealthManagementContext,
  responsibilities: [
    'Manage premium customer relationships',
    'Provide personalized financial advice',
    'Conduct portfolio reviews',
    'Recommend investment products',
    'Coordinate wealth management services',
    'Proactive customer outreach'
  ],
  goals: [
    'Build strong customer relationships',
    'Grow assets under management',
    'Provide proactive financial advice',
    'Achieve high customer satisfaction',
    'Meet revenue targets'
  ],
  painPoints: [
    'High customer expectations',
    'Time constraints managing multiple relationships',
    'Need for better tools to track customer needs',
    'Balancing relationship building with administrative tasks',
    'Keeping up with investment products and market changes'
  ],
  strategicImportance: 'critical',
  businessValue: 'Manages highest value customer segment, generating significant revenue through wealth management fees and maintaining large deposit balances. Critical for premium service delivery and customer retention.',
  engagement: 'weekly',
  accountability: [
    'Maintain high customer satisfaction',
    'Grow assets under management',
    'Provide proactive advice',
    'Meet revenue targets',
    'Document customer interactions'
  ],
  touchpoints: [
    'CRM system - Daily customer management',
    'Phone and email - Customer communication',
    'In-person meetings - Portfolio reviews',
    'Mobile app - On-the-go access'
  ],
  communicationPreferences: {
    preferredChannels: ['phone', 'email', 'in-person', 'mobile-app'],
    responseTime: 'within 2 hours',
    availability: 'Business hours with 24/7 emergency support'
  },
  successCriteria: [
    'High customer satisfaction scores (> 4.8/5.0)',
    'Growing assets under management',
    'Strong customer retention (> 95%)',
    'Proactive customer engagement',
    'Revenue targets met'
  ],
  influence: 'high',
  influenceSphere: [
    'Customer investment decisions',
    'Wealth management product selection',
    'Customer relationship continuation',
    'Premium service delivery'
  ],
  decisionAuthority: [
    'Investment product recommendations',
    'Portfolio strategy advice',
    'Service level delivery',
    'Customer relationship management'
  ],
  risks: [
    {
      risk: 'Customer dissatisfaction may lead to relationship loss',
      likelihood: 'medium',
      impact: 'high',
      mitigation: 'Regular training, support tools, and proactive relationship management'
    },
    {
      risk: 'High workload may affect service quality',
      likelihood: 'medium',
      impact: 'medium',
      mitigation: 'Adequate staffing, efficient tools, and workload management'
    }
  ],
  kpis: [
    'Customer satisfaction > 4.8/5.0',
    'Assets under management growth > 10% annually',
    'Customer retention rate > 95%',
    'Revenue per customer > GD$200K/year'
  ],
  satisfactionIndicators: [
    'Receives positive customer feedback',
    'Achieves revenue targets',
    'Has access to effective CRM tools',
    'Feels supported by management',
    'Builds long-term customer relationships',
    'Receives recognition for success'
  ],
  tags: ['relationship-management', 'human', 'premium', 'wealth-management', 'critical-path']
})
export class RelationshipManagerStakeholder {}

