import { Context, ContextRelationship } from 'aabha';
import { BankingContext } from './BankingContext.js';

/**
 * Wealth Management Context
 * Premium banking services, investment advisory, and relationship management
 */
@Context({
  name: 'Wealth Management',
  description: 'Wealth management domain covering premium banking services, investment advisory, portfolio management, and relationship management for high net worth customers. This context delivers personalized, high-touch service to premium customers.',
  inScope: [
    'Premium customer relationship management',
    'Investment advisory services',
    'Portfolio management and review',
    'Wealth planning and estate planning',
    'Exclusive investment products',
    'Concierge banking services',
    'Tax optimization strategies',
    'Global banking services'
  ],
  outOfScope: [
    'Retail banking services',
    'Mass market products',
    'Basic account management',
    'Compliance checking',
    'Risk assessment'
  ],
  capabilities: {
    core: [
      'Premium relationship management',
      'Investment advisory',
      'Portfolio management',
      'Wealth planning',
      'Exclusive product access'
    ],
    supporting: [
      'Concierge services',
      'Tax optimization',
      'Estate planning',
      'Global banking coordination'
    ],
    emerging: [
      'AI-powered investment insights',
      'Digital wealth management tools',
      'Personalized investment recommendations'
    ]
  },
  domainModel: {
    coreEntities: ['PremiumCustomer', 'Portfolio', 'Investment', 'RelationshipManager', 'WealthPlan'],
    valueObjects: ['InvestmentStrategy', 'RiskTolerance', 'PortfolioPerformance'],
    ubiquitousLanguage: {
      'Premium Customer': 'High net worth individual with GD$1M+ in assets',
      'Portfolio Review': 'Quarterly meeting to review investment performance',
      'Relationship Manager': 'Dedicated advisor managing premium customer relationships',
      'Assets Under Management': 'Total value of customer investments managed by the bank',
      'Wealth Planning': 'Strategic financial planning for wealth preservation and growth'
    }
  },
  relationships: [
    {
      type: ContextRelationship.Partnership,
      context: BankingContext,
      description: 'Wealth management services build on core banking capabilities',
      exchanged: ['Customer data', 'Account information', 'Transaction history'],
      communicationPattern: 'sync',
      frequency: 'real-time'
    }
  ],
  healthIndicators: [
    'Customer satisfaction scores',
    'Assets under management growth',
    'Customer retention rate',
    'Revenue per customer',
    'Portfolio performance'
  ],
  goals: [
    'Achieve customer satisfaction > 4.8/5.0',
    'Grow assets under management by 15% annually',
    'Maintain customer retention rate > 95%',
    'Generate revenue > GD$200K per customer annually',
    'Deliver proactive financial advice'
  ],
  owner: 'Sophia Martinez - Head of Wealth Management',
  team: 'Wealth Management Division',
  assumptions: [
    'Premium customers value personalized service',
    'Relationship managers have adequate expertise',
    'Investment products meet customer needs',
    'Market conditions support investment growth'
  ],
  constraints: [
    'Limited number of relationship managers',
    'High customer expectations',
    'Regulatory requirements for investment advice',
    'Market volatility affects portfolio performance',
    'Time constraints managing multiple relationships'
  ],
  tags: [
    'premium-banking',
    'wealth-management',
    'relationship-management',
    'front-office',
    'high-value'
  ]
})
export class WealthManagementContext {}

