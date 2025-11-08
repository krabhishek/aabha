import { Persona, PersonaType } from 'aabha';

/**
 * Maria Santos - Working Mother Persona
 * Represents the mass market family segment
 */
@Persona({
  name: 'Maria Santos',
  type: PersonaType.Human,
  archetype: 'The Family Manager - Juggles multiple responsibilities and values efficiency',
  description: 'Working mother juggling family finances, savings goals, and daily banking needs',
  age: '35',
  occupation: 'Marketing Manager',
  demographics: {
    incomeRange: 'GD$68K/year',
    incomeLevel: 'middle',
    familyStatus: 'Married with children',
    location: 'Genai',
    householdSize: 4
  },
  context: {
    lifeStage: 'Mid-career with young family - balancing career and family responsibilities',
    currentSituation: 'Working full-time while managing household finances and children\'s needs',
    challenges: ['Time constraints', 'Balancing multiple financial goals', 'Ensuring financial security for family'],
    environmentalFactors: ['Rising education costs', 'Economic uncertainty', 'Need for work-life balance']
  },
  goals: [
    'Save for children\'s education',
    'Manage family budget effectively',
    'Pay bills on time',
    'Build emergency fund',
    'Plan for family vacation'
  ],
  painPoints: [
    'Juggling multiple accounts and bills',
    'Time constraints - needs quick banking',
    'Difficulty tracking savings goals',
    'Worried about missing payments',
    'Complex financial planning'
  ],
  needs: {
    functional: [
      'Unified view of all accounts',
      'Automated savings transfers',
      'Bill payment reminders',
      'Goal-based savings tracking',
      'Mobile-first banking experience'
    ],
    emotional: [
      'Peace of mind about family finances',
      'Confidence in financial decisions',
      'Feeling in control'
    ]
  },
  technicalProficiency: 'high',
  preferredChannels: [
    'Mobile app',
    'Online banking',
    'Phone banking (for complex issues)'
  ],
  characteristics: [
    'Time-constrained',
    'Mobile-first user',
    'Goal-oriented',
    'Price-conscious',
    'Values convenience'
  ],
  usagePatterns: [
    'Checks balance daily via mobile app',
    'Pays bills weekly',
    'Transfers to savings monthly',
    'Rarely visits branches'
  ],
  metrics: {
    successIndicators: [
      'Achieves savings goals for children\'s education',
      'Feels confident about family finances',
      'Never misses bill payments'
    ],
    engagementPatterns: [
      'Daily active user of mobile app',
      'Uses bill payment and savings features weekly',
      'Engages with financial planning tools monthly'
    ],
    satisfactionSignals: [
      'Recommends OgPgyBank to friends',
      'Positive app store reviews',
      'Low customer service complaints'
    ],
    churnRisks: [
      'Slow mobile app performance',
      'Hidden fees discovered',
      'Difficulty tracking multiple savings goals'
    ]
  },
  psychology: {
    values: [''], // TODO: What does this persona value most?
    fears: [''], // TODO: What keeps this persona up at night?
    aspirations: [''] // TODO: What does this persona hope to achieve?
  },
  motivations: [
    'Family security and financial stability',
    'Providing for children\'s future',
    'Efficiency and time management',
    'Peace of mind about finances'
  ],
  dayInTheLife: 'Maria wakes up at 6 AM and quickly checks her account balance on her phone while preparing breakfast for the kids. During her lunch break at work, she pays a few bills using the mobile app and transfers money to the children\'s education savings goal. In the evening, she reviews the family budget dashboard to see how they\'re tracking against monthly goals. Before bed, she sets up automatic bill payments for the upcoming week to ensure nothing is missed.'
})
export class MariaSantosPersona {}


