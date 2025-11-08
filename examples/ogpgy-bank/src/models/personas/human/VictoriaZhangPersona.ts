import { Persona, PersonaType } from 'aabha';

/**
 * Victoria Zhang - High Net Worth Individual Persona
 * Represents the premium banking segment
 */
@Persona({
  name: 'Victoria Zhang',
  type: PersonaType.Human,
  archetype: 'The Wealth Builder - Focuses on wealth preservation, growth, and legacy planning',
  description: 'Successful entrepreneur and high net worth individual requiring premium banking services',
  age: '58',
  occupation: 'Founder & CEO of Tech Company',
  demographics: {
    incomeRange: 'High net worth (GD$45M)',
    incomeLevel: 'high',
    familyStatus: 'Married',
    location: 'Genai',
    householdSize: 2
  },
  context: {
    lifeStage: 'Late career - wealth preservation and legacy planning',
    currentSituation: 'Successful entrepreneur with substantial assets, focusing on wealth management and estate planning',
    challenges: ['Complex wealth management needs', 'Tax optimization', 'Estate planning for next generation'],
    environmentalFactors: ['Changing tax regulations', 'Global economic uncertainty', 'Estate planning complexity']
  },
  goals: [
    'Wealth preservation and growth',
    'Estate planning',
    'Tax optimization',
    'Global banking access',
    'Exclusive investment opportunities'
  ],
  painPoints: [
    'Previous bank treated her like a transaction, not a person',
    'Lack of proactive advice',
    'No exclusive access to premium services',
    'Complex wealth management needs not met'
  ],
  needs: {
    functional: [
      'Dedicated relationship manager',
      'Wealth management advisory',
      'Estate planning services',
      'Concierge banking services',
      'Global account access',
      'Exclusive investment products'
    ],
    emotional: [
      'Feel valued and understood',
      'Proactive relationship',
      'Exclusivity and prestige',
      'Trust and confidence'
    ]
  },
  technicalProficiency: 'medium',
  preferredChannels: [
    'Relationship manager (primary)',
    'Mobile app (for quick transactions)',
    'Phone (for urgent matters)',
    'In-person meetings (for complex planning)'
  ],
  characteristics: [
    'Time-valuable',
    'Expects white-glove service',
    'Relationship-focused',
    'Values expertise and advice',
    'Global perspective'
  ],
  usagePatterns: [
    'Regular meetings with relationship manager',
    'Uses mobile app for transactions',
    'Expects proactive outreach',
    'Values personalized service'
  ],
  metrics: {
    successIndicators: [
      'Wealth portfolio meets growth targets',
      'Feels valued and understood by bank',
      'Receives proactive financial advice'
    ],
    engagementPatterns: [
      'Weekly meetings with relationship manager',
      'Uses premium investment products',
      'Engages with wealth management services'
    ],
    satisfactionSignals: [
      'High relationship manager satisfaction scores',
      'Increases assets under management',
      'Refers other high net worth individuals'
    ],
    churnRisks: [
      'Lack of personalized service',
      'No proactive advice',
      'Better wealth management options elsewhere',
      'Poor relationship manager experience'
    ]
  },
  psychology: {
    values: [''], // TODO: What does this persona value most?
    fears: [''], // TODO: What keeps this persona up at night?
    aspirations: [''] // TODO: What does this persona hope to achieve?
  },
  motivations: [
    'Wealth preservation and growth',
    'Legacy planning for next generation',
    'Exclusivity and personalized service',
    'Strategic financial advice'
  ],
  dayInTheLife: 'Victoria starts her day with a morning call from her relationship manager discussing a new investment opportunity. During a break between meetings, she uses the mobile app to transfer funds between her global accounts. In the afternoon, she has a scheduled in-person meeting with her relationship manager to review her estate planning strategy. In the evening, she reviews her wealth portfolio dashboard and receives a proactive alert about a tax optimization opportunity.'
})
export class VictoriaZhangPersona {}


