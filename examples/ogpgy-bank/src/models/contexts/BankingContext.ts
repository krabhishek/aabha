import { Context } from 'aabha';

/**
 * Core Banking Context
 * The primary domain for customer-facing banking operations including
 * account management, transactions, and customer service.
 */
@Context({
  name: 'Core Banking',
  description: 'Primary banking domain covering account management, transactions, and customer interactions. This context handles all customer-facing banking operations and serves as the foundation for retail, premium, and digital banking services.',
  inScope: [
    'Account opening and management',
    'Deposits and withdrawals',
    'Transaction processing',
    'Customer onboarding',
    'Account balance inquiries',
    'Customer service interactions'
  ],
  outOfScope: [
    'Investment advisory',
    'Loan origination',
    'Regulatory reporting',
    'Internal audit'
  ],
  capabilities: {
    core: [
      'Account lifecycle management',
      'Real-time transaction processing',
      'Multi-segment customer support',
      'High-availability banking operations'
    ],
    supporting: [
      'Customer service',
      'Account inquiries',
      'Basic financial operations'
    ]
  },
  healthIndicators: [
    'Account opening success rate',
    'Transaction processing uptime',
    'Customer satisfaction scores',
    'System availability'
  ],
  goals: [
    'Maintain 99.9% account system uptime',
    'Process account openings within 24 hours',
    'Achieve NPS > 60 for retail customers',
    'Ensure zero data loss in transaction processing'
  ],
  owner: 'Sarah Nakamura - CEO',
  team: 'Core Banking Division',
  assumptions: [
    'Regulatory environment remains stable',
    'Core banking system maintains 99.99% uptime',
    'Customer demand for banking services continues growing',
    'Legacy system migration will complete as planned'
  ],
  constraints: [
    'Legacy core banking system limits real-time capabilities',
    'Regulatory requirements mandate 7-year data retention',
    'Must maintain backward compatibility during migration',
    'Budget constraints limit infrastructure expansion'
  ],
  tags: [
    'customer-facing',
    'core-banking',
    'regulated',
    'mission-critical'
  ]
})
export class BankingContext {}

