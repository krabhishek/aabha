import { Context, ContextRelationship } from 'aabha';
import { BankingContext } from './BankingContext.js';

/**
 * Digital Banking Context
 * Digital channels and mobile-first banking experiences
 */
@Context({
  name: 'Digital Banking',
  description: 'Digital channels including mobile app, web banking, and API services. This context enables customers to access banking services through digital channels, providing 24/7 access and modern banking experiences.',
  inScope: [
    'Mobile banking application',
    'Web banking portal',
    'Open banking APIs',
    'Digital account opening',
    'AI-powered financial assistant',
    'Digital payment services'
  ],
  outOfScope: [
    'Branch operations',
    'ATM network management',
    'Physical card issuance'
  ],
  capabilities: {
    core: [
      'Instant digital account opening',
      'Mobile-first banking experience',
      'Open banking API platform',
      'AI-powered financial insights'
    ],
    supporting: [
      'Web banking portal',
      'Digital payment processing',
      'Multi-channel customer support'
    ]
  },
  healthIndicators: [
    'Mobile app rating',
    'Digital active users',
    'API uptime',
    'Account opening conversion rate'
  ],
  relationships: [
    {
      type: ContextRelationship.Partnership,
      context: BankingContext,
      description: 'Digital channels interact with core banking systems'
    }
  ],
  goals: [
    'Achieve 2M active digital users by end of 2025',
    'Maintain mobile app rating > 4.5 stars',
    'Reduce account opening time to under 5 minutes',
    'Achieve 99.95% API uptime'
  ],
  owner: 'Alex Chen - Head of Digital Banking',
  team: 'Digital Banking Division',
  assumptions: [
    'Mobile app adoption will continue to grow at 20% annually',
    'Customers value digital-first experiences over branch visits',
    'Regulatory environment remains favorable to digital banking',
    'Technology platform can scale to support growth'
  ],
  constraints: [
    'Must integrate with legacy core banking system',
    'Regulatory requirements for digital KYC compliance',
    'Mobile app must support iOS and Android platforms',
    'API rate limits to prevent abuse'
  ],
  tags: [
    'customer-facing',
    'digital',
    'mobile-first',
    'innovation'
  ]
})
export class DigitalBankingContext {}

