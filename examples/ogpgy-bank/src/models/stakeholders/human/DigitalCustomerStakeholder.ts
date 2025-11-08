import { Stakeholder, StakeholderType } from 'aabha';
import { DigitalBankingContext } from '../../contexts/DigitalBankingContext.js';
import { MarcusLeePersona } from '../../personas/human/MarcusLeePersona.js';

/**
 * Digital Customer Stakeholder
 * Tech-savvy customer who primarily uses digital channels
 */
@Stakeholder({
  name: 'Digital Customer',
  description: 'Tech-savvy customer who exclusively uses digital channels for banking. This stakeholder represents the future of banking and is at high risk of switching to neobanks if experience doesn\'t meet expectations.',
  type: StakeholderType.Human,
  role: 'Customer',
  persona: MarcusLeePersona,
  context: DigitalBankingContext,
  responsibilities: [
    'Open accounts digitally',
    'Manage finances via mobile app',
    'Use digital payment services',
    'Access open banking APIs',
    'Engage with AI financial assistant'
  ],
  goals: [
    'Instant account opening',
    'Seamless mobile experience',
    'Real-time financial insights',
    'Integration with personal finance apps',
    'Modern, engaging UX'
  ],
  painPoints: [
    'Slow account opening process',
    'Outdated mobile app',
    'No real-time insights',
    'Poor API availability',
    'Lack of gamification'
  ],
  strategicImportance: 'critical',
  businessValue: 'Represents growing segment of tech-savvy customers with high lifetime value potential. Early adopters who drive digital innovation and can influence other customers through word-of-mouth.',
  engagement: 'daily',
  accountability: [
    'Maintain account security',
    'Use digital services responsibly',
    'Provide feedback on digital experience'
  ],
  touchpoints: [
    'Mobile app - Multiple times daily',
    'Web banking - Weekly account reviews',
    'API - Integration with personal finance apps',
    'In-app notifications - Real-time updates'
  ],
  communicationPreferences: {
    preferredChannels: ['mobile-app', 'api', 'web'],
    responseTime: 'real-time',
    availability: '24/7'
  },
  successCriteria: [
    'Account opening in < 5 minutes',
    'App rating > 4.5 stars',
    'Real-time transaction updates',
    'Spending analytics available',
    'API access for integrations'
  ],
  risks: [
    {
      risk: 'Will switch to neobank if experience doesn\'t improve',
      likelihood: 'high',
      impact: 'high',
      mitigation: 'Accelerate digital transformation and improve mobile app experience'
    }
  ],
  kpis: [
    'App rating > 4.5 stars',
    'Daily active usage > 5 sessions',
    'Account opening conversion > 60%',
    'Feature adoption rate > 70%'
  ],
  satisfactionIndicators: [
    'Uses mobile app daily',
    'App rating > 4.5 stars',
    'Refers friends to service',
    'Uses multiple features regularly',
    'Engages with AI financial assistant',
    'Integrates with personal finance apps',
    'Provides positive feedback in surveys'
  ]
})
export class DigitalCustomerStakeholder {}


