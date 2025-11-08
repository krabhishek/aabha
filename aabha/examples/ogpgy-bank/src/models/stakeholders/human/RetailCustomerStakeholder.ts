import { Stakeholder, StakeholderType } from 'aabha';
import { BankingContext } from '../../contexts/BankingContext.js';
import { MariaSantosPersona } from '../../personas/human/MariaSantosPersona.js';

/**
 * Retail Customer Stakeholder
 * Mass market customer role in the banking context
 */
@Stakeholder({
  name: 'Retail Customer',
  description: 'Mass market customer representing the largest customer segment. This stakeholder uses banking services for daily financial needs including account management, bill payments, and savings goals.',
  type: StakeholderType.Human,
  role: 'Customer',
  persona: MariaSantosPersona,
  context: BankingContext,
  responsibilities: [
    'Open and manage accounts',
    'Make deposits and withdrawals',
    'Pay bills and transfer funds',
    'Monitor account balances',
    'Save for financial goals'
  ],
  goals: [
    'Easy account management',
    'Quick access to funds',
    'Secure transactions',
    'Achieve savings goals',
    'Minimize banking fees'
  ],
  painPoints: [
    'Complex account management',
    'Slow transaction processing',
    'Poor mobile experience',
    'Difficulty tracking savings goals',
    'Hidden fees'
  ],
  strategicImportance: 'critical',
  businessValue: 'Represents 60% of customer base with high transaction volume. Provides stable deposit base and generates fee revenue through transactions and account services.',
  engagement: 'daily',
  accountability: [
    'Maintain account in good standing',
    'Provide accurate information for account management',
    'Comply with banking terms and conditions'
  ],
  touchpoints: [
    'Mobile app - Daily balance checks',
    'Mobile app - Weekly bill payments',
    'Online banking - Monthly statements',
    'Phone banking - Occasional support needs'
  ],
  communicationPreferences: {
    preferredChannels: ['mobile-app', 'online-banking', 'phone'],
    responseTime: 'within 24 hours',
    availability: '24/7 for digital channels'
  },
  successCriteria: [
    'Can complete transactions in < 30 seconds',
    'Can view all accounts in one place',
    'Receives real-time transaction notifications',
    'Can set up automated savings goals'
  ],
  risks: [
    {
      risk: 'May switch to competitor if fees increase or service degrades',
      likelihood: 'medium',
      impact: 'high',
      mitigation: 'Regular fee reviews and competitive analysis'
    },
    {
      risk: 'Churn risk if mobile app experience doesn\'t meet expectations',
      likelihood: 'medium',
      impact: 'medium',
      mitigation: 'Continuous mobile app improvements and user feedback'
    }
  ],
  kpis: [
    'Account balance > GD$5,000 average',
    'Transaction volume > 10 transactions/month',
    'Customer satisfaction score > 4.0/5.0',
    'Mobile app usage > 3 times/week'
  ],
  satisfactionIndicators: [
    'Uses mobile app regularly (3+ times/week)',
    'Completes transactions successfully',
    'Maintains account in good standing',
    'Uses multiple banking services',
    'Provides positive feedback in surveys',
    'Refers friends and family',
    'Increases account balance over time'
  ]
})
export class RetailCustomerStakeholder {}


