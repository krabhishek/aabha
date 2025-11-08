import { Persona, PersonaType } from 'aabha';

/**
 * Relationship Manager Persona
 * Represents relationship managers who serve premium customers
 */
@Persona({
  name: 'Relationship Manager',
  type: PersonaType.Human,
  archetype: 'The Trusted Advisor - Builds long-term relationships and provides personalized financial advice',
  description: 'Relationship manager responsible for managing premium customer relationships and providing personalized wealth management services',
  age: '30-50',
  occupation: 'Relationship Manager / Wealth Advisor',
  demographics: {
    incomeRange: 'GD$85K - GD$150K/year',
    incomeLevel: 'middle to upper-middle',
    familyStatus: 'Varied',
    location: 'Genai',
    educationLevel: 'Bachelor\'s degree in Finance, Business, or related field, with CFP or similar certifications'
  },
  context: {
    lifeStage: 'Mid-career - building expertise in wealth management and relationship building',
    currentSituation: 'Manages portfolio of premium customers, providing personalized service and financial advice',
    challenges: ['Managing multiple high-value relationships', 'Providing proactive advice', 'Balancing customer needs with bank policies', 'Staying current with investment products'],
    environmentalFactors: ['Increasing customer expectations', 'Competition from other banks', 'Regulatory requirements for advice', 'Need for digital tools to enhance service']
  },
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
  needs: {
    functional: [
      'Customer relationship management tools',
      'Access to comprehensive customer data',
      'Investment product information',
      'Portfolio analysis tools',
      'Proactive alerts and insights'
    ],
    emotional: [
      'Recognition for relationship success',
      'Support for complex customer situations',
      'Work-life balance',
      'Professional development opportunities'
    ]
  },
  technicalProficiency: 'medium',
  preferredChannels: [
    'CRM system for customer management',
    'Phone and email for customer communication',
    'In-person meetings for portfolio reviews',
    'Mobile app for on-the-go access'
  ],
  characteristics: [
    'Relationship-focused',
    'Proactive',
    'Empathetic',
    'Knowledgeable about investments',
    'Service-oriented'
  ],
  usagePatterns: [
    'Daily customer outreach',
    'Weekly portfolio reviews',
    'Monthly relationship meetings',
    'Quarterly planning sessions'
  ],
  metrics: {
    successIndicators: [
      'High customer satisfaction scores',
      'Growing assets under management',
      'Strong customer retention',
      'Proactive customer engagement'
    ],
    engagementPatterns: [
      'Regular customer meetings',
      'Proactive outreach and advice',
      'Portfolio review and planning',
      'Product recommendations'
    ],
    satisfactionSignals: [
      'Positive customer feedback',
      'Customer referrals',
      'Increased assets under management',
      'Long-term relationship retention'
    ],
    churnRisks: [
      'High workload affecting service quality',
      'Lack of support tools',
      'Insufficient product knowledge',
      'Poor work-life balance'
    ]
  },
  psychology: {
    values: [
      'Building long-term customer relationships',
      'Helping customers achieve financial goals',
      'Professional expertise and trust',
      'Personalized service excellence'
    ],
    fears: [
      'Losing high-value customer relationships',
      'Failing to meet customer expectations',
      'Inadequate investment advice',
      'Customer dissatisfaction leading to churn'
    ],
    aspirations: [
      'Build a successful wealth management practice',
      'Achieve recognition as a trusted advisor',
      'Grow assets under management significantly',
      'Advance to senior relationship management role'
    ]
  },
  motivations: [
    'Helping customers achieve financial goals',
    'Building long-term trusted relationships',
    'Professional growth in wealth management',
    'Contributing to bank\'s premium service reputation'
  ],
  dayInTheLife: 'The relationship manager starts the day by reviewing their customer portfolio dashboard, identifying customers who need proactive outreach. They prepare for a portfolio review meeting with a premium customer, analyzing performance and preparing recommendations. During the meeting, they discuss investment strategy, review portfolio performance, and address customer concerns. After the meeting, they document the discussion and follow up on action items. Throughout the day, they respond to customer inquiries, prepare investment proposals, and coordinate with internal teams to deliver exceptional service.'
})
export class RelationshipManagerPersona {}

