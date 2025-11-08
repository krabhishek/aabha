import { Persona, PersonaType } from 'aabha';

/**
 * Risk Manager Persona
 * Represents risk management professionals who assess and manage banking risks
 */
@Persona({
  name: 'Risk Manager',
  type: PersonaType.Human,
  archetype: 'The Risk Guardian - Identifies, assesses, and mitigates risks to protect the bank',
  description: 'Risk management professional responsible for assessing credit risk, operational risk, and other banking risks',
  age: '35-55',
  occupation: 'Risk Manager',
  demographics: {
    incomeRange: 'GD$75K - GD$120K/year',
    incomeLevel: 'middle to upper-middle',
    familyStatus: 'Varied',
    location: 'Genai',
    educationLevel: 'Bachelor\'s or Master\'s degree in Finance, Economics, or Risk Management, with FRM or similar certifications'
  },
  context: {
    lifeStage: 'Mid to late career - specialized in risk management and analysis',
    currentSituation: 'Works in risk management department assessing credit applications, operational risks, and market risks',
    challenges: ['Balancing risk with business growth', 'Complex risk models', 'Regulatory risk requirements', 'Time pressure for risk assessments'],
    environmentalFactors: ['Evolving risk landscape', 'Regulatory requirements', 'Economic uncertainty', 'Need for accurate risk assessment']
  },
  goals: [
    'Accurately assess and mitigate risks',
    'Support business growth while managing risk',
    'Maintain regulatory compliance',
    'Protect bank from losses',
    'Provide clear risk recommendations'
  ],
  painPoints: [
    'Complex risk assessment models',
    'Pressure to approve applications while managing risk',
    'Insufficient data for accurate risk assessment',
    'Balancing risk with business objectives',
    'Keeping up with regulatory changes'
  ],
  needs: {
    functional: [
      'Comprehensive risk assessment tools',
      'Access to credit and financial data',
      'Risk modeling capabilities',
      'Clear risk policies and guidelines',
      'Support for complex risk decisions'
    ],
    emotional: [
      'Confidence in risk decisions',
      'Recognition for protecting the bank',
      'Support for difficult decisions',
      'Clear escalation paths'
    ]
  },
  technicalProficiency: 'high',
  preferredChannels: [
    'Risk management system',
    'Email for documentation',
    'Phone for urgent escalations',
    'In-person meetings for complex cases'
  ],
  characteristics: [
    'Analytical',
    'Risk-aware',
    'Data-driven',
    'Detail-oriented',
    'Decision-focused'
  ],
  usagePatterns: [
    'Daily risk assessments',
    'Regular risk committee meetings',
    'Quarterly risk reviews',
    'Ongoing risk monitoring'
  ],
  metrics: {
    successIndicators: [
      'Accurate risk assessments',
      'Low default rates',
      'Regulatory compliance',
      'Effective risk mitigation'
    ],
    engagementPatterns: [
      'Daily risk assessment activities',
      'Participation in risk committees',
      'Regular risk reporting',
      'Risk training and development'
    ],
    satisfactionSignals: [
      'Low risk-related losses',
      'Positive feedback from management',
      'Effective risk mitigation',
      'Clear risk policies'
    ],
    churnRisks: [
      'High workload and stress',
      'Lack of support for complex decisions',
      'Outdated risk tools',
      'Unclear risk policies'
    ]
  },
  psychology: {
    values: [
      'Protecting the bank from losses',
      'Accurate risk assessment',
      'Supporting responsible business growth',
      'Professional risk management expertise'
    ],
    fears: [
      'Approving loans that default',
      'Inaccurate risk assessments',
      'Missing risk indicators',
      'Balancing risk with business pressure'
    ],
    aspirations: [
      'Become a recognized risk management expert',
      'Contribute to bank\'s financial stability',
      'Develop advanced risk models',
      'Advance to senior risk management leadership'
    ]
  },
  motivations: [
    'Protecting the bank from losses',
    'Supporting responsible business growth',
    'Professional growth in risk management',
    'Contributing to bank\'s financial stability'
  ],
  dayInTheLife: 'The risk manager starts the day by reviewing a queue of credit applications requiring risk assessment. They analyze each application using risk models, reviewing credit history, financial statements, and market conditions. For high-risk applications, they prepare detailed risk assessments and recommendations for the risk committee. They attend a risk committee meeting to discuss complex cases and make decisions. Throughout the day, they monitor portfolio risk metrics, update risk models, and provide risk guidance to business teams.'
})
export class RiskManagerPersona {}

