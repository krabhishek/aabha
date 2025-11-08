import { Stakeholder, StakeholderType } from 'aabha';
import { BankingContext } from '../../contexts/BankingContext.js';
import { VictoriaZhangPersona } from '../../personas/human/VictoriaZhangPersona.js';

/**
 * Premium Customer Stakeholder
 * High net worth customer requiring premium services
 */
@Stakeholder({
  name: 'Premium Customer',
  description: 'High net worth individual requiring premium banking services including wealth management, estate planning, and concierge services. This stakeholder represents the highest value customer segment.',
  type: StakeholderType.Human,
  role: 'Premium Customer',
  persona: VictoriaZhangPersona,
  context: BankingContext,
  responsibilities: [
    'Manage wealth portfolio',
    'Access premium investment products',
    'Coordinate estate planning',
    'Utilize concierge services',
    'Maintain global banking relationships'
  ],
  goals: [
    'Wealth preservation and growth',
    'Tax optimization',
    'Estate planning',
    'Exclusive investment access',
    'Proactive financial advice'
  ],
  painPoints: [
    'Lack of personalized service',
    'No proactive advice',
    'Limited exclusive products',
    'Poor relationship management',
    'Generic service experience'
  ],
  strategicImportance: 'critical',
  businessValue: 'Represents highest value customer segment with GD$45M+ in assets. Generates significant revenue through wealth management fees, premium services, and maintains large deposit balances.',
  engagement: 'weekly',
  accountability: [
    'Maintain minimum balance requirements',
    'Provide accurate financial information',
    'Engage with relationship manager regularly'
  ],
  touchpoints: [
    'Relationship manager - Weekly meetings',
    'Mobile app - Daily transaction monitoring',
    'Phone - Urgent matters',
    'In-person - Quarterly planning sessions'
  ],
  communicationPreferences: {
    preferredChannels: ['relationship-manager', 'phone', 'mobile-app', 'in-person'],
    responseTime: 'within 2 hours',
    availability: 'Business hours with 24/7 emergency support'
  },
  successCriteria: [
    'Dedicated relationship manager',
    'Proactive outreach and advice',
    'Exclusive product access',
    'Personalized service experience',
    'Global banking capabilities'
  ],
  influence: 'high',
  influenceSphere: [
    'Investment strategy decisions',
    'Fee negotiations',
    'Product development priorities',
    'Service level expectations'
  ],
  decisionAuthority: [
    'Wealth management decisions',
    'Investment product selection',
    'Banking relationship continuation'
  ],
  risks: [
    {
      risk: 'May switch to competitor if service quality declines',
      likelihood: 'medium',
      impact: 'high',
      mitigation: 'Maintain high service standards and proactive relationship management'
    },
    {
      risk: 'Risk of relationship manager turnover affecting satisfaction',
      likelihood: 'low',
      impact: 'high',
      mitigation: 'Succession planning and knowledge transfer protocols'
    }
  ],
  kpis: [
    'Assets under management > GD$40M',
    'Relationship manager satisfaction > 4.8/5.0',
    'Wealth management revenue > GD$200K/year',
    'Customer retention rate > 95%'
  ],
  satisfactionIndicators: [
    'Engages with relationship manager regularly',
    'Increases assets under management',
    'Uses premium services actively',
    'Refers other high-net-worth individuals',
    'Provides positive feedback on service quality',
    'Renews premium service agreements',
    'Participates in exclusive events and offerings'
  ]
})
export class PremiumCustomerStakeholder {}


