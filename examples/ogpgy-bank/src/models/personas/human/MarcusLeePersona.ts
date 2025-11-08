import { Persona, PersonaType } from 'aabha';

/**
 * Marcus Lee - Young Professional Persona
 * Represents the tech-savvy millennial segment at risk of switching to neobanks
 */
@Persona({
  name: 'Marcus Lee',
  type: PersonaType.Human,
  archetype: 'The Early Adopter - First to try new features and expects cutting-edge technology',
  description: 'Tech-savvy young professional who expects modern, fast, and intuitive banking',
  age: '26',
  occupation: 'Junior Software Developer',
  demographics: {
    incomeRange: 'GD$48K/year',
    incomeLevel: 'middle',
    familyStatus: 'Single',
    location: 'Genai',
    householdSize: 1
  },
  context: {
    lifeStage: 'Early career - building foundation',
    currentSituation: 'Just started first job, new to managing money independently',
    challenges: ['Managing student loan debt', 'Building credit history', 'Starting emergency fund'],
    environmentalFactors: ['High cost of living', 'Competitive tech job market', 'Rising interest rates']
  },
  goals: [
    'Build savings for future',
    'Start investing',
    'Build credit history',
    'Save for first home deposit',
    'Maximize financial growth'
  ],
  painPoints: [
    'Traditional banks feel old and slow',
    'Poor mobile app experience',
    'Lack of real-time insights',
    'No gamification or engagement',
    'Frustrated with legacy banking UX'
  ],
  needs: {
    functional: [
      'Instant account opening',
      'Real-time transaction notifications',
      'Spending analytics',
      'Investment options',
      'API access for personal finance apps'
    ],
    emotional: [
      'Feel modern and tech-forward',
      'Sense of control and transparency',
      'Engagement and gamification'
    ]
  },
  technicalProficiency: 'high',
  preferredChannels: [
    'Mobile app exclusively',
    'Never visits branches',
    'Prefers self-service'
  ],
  characteristics: [
    'Early adopter',
    'Tech-native',
    'Comparison shopper',
    'Low brand loyalty',
    'Values speed and UX'
  ],
  usagePatterns: [
    'Uses mobile app multiple times daily',
    'Expects instant responses',
    'Compares banking apps like code reviews',
    'Willing to switch for better experience'
  ],
  metrics: {
    successIndicators: [
      'Opens account in under 5 minutes',
      'Uses app daily without friction',
      'Feels banking experience is modern'
    ],
    engagementPatterns: [
      'Multiple daily app sessions',
      'Uses advanced features like spending analytics',
      'Integrates with personal finance apps via API'
    ],
    satisfactionSignals: [
      'App rating > 4.5 stars',
      'Recommends to tech-savvy friends',
      'Stays with bank instead of switching to neobank'
    ],
    churnRisks: [
      'Slow account opening process',
      'Outdated mobile app UX',
      'Lack of real-time features',
      'Better offers from neobanks'
    ]
  },
  psychology: {
    values: [''], // TODO: What does this persona value most?
    fears: [''], // TODO: What keeps this persona up at night?
    aspirations: [''] // TODO: What does this persona hope to achieve?
  },
  motivations: [
    'Financial independence',
    'Tech convenience and efficiency',
    'Career growth and advancement',
    'Early adoption of new technology'
  ],
  dayInTheLife: 'Marcus wakes up at 7 AM and checks his account balance on his phone while having coffee. During his commute, he reviews yesterday\'s spending in the budgeting app. At lunch, he splits the bill with coworkers using instant transfers. After work, he researches investment options on his laptop, comparing fees and returns. Before bed, he sets up an automatic transfer to his savings account and checks if any new banking features were released.'
})
export class MarcusLeePersona {}


