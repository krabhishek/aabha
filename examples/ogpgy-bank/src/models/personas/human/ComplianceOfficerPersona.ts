import { Persona, PersonaType } from 'aabha';

/**
 * Compliance Officer Persona
 * Represents compliance professionals who perform manual reviews
 */
@Persona({
  name: 'Compliance Officer',
  type: PersonaType.Human,
  archetype: 'The Regulatory Guardian - Ensures all operations comply with banking regulations',
  description: 'Compliance professional responsible for manual review of account applications and transactions that require human judgment',
  age: '35-55',
  occupation: 'Compliance Officer',
  demographics: {
    incomeRange: 'GD$65K - GD$95K/year',
    incomeLevel: 'middle',
    familyStatus: 'Varied',
    location: 'Genai',
    educationLevel: 'Bachelor\'s degree in Finance, Law, or related field, with compliance certifications'
  },
  context: {
    lifeStage: 'Mid to late career - specialized in compliance and risk management',
    currentSituation: 'Works in compliance department reviewing applications and transactions that automated systems flag for manual review',
    challenges: ['High volume of reviews', 'Complex regulatory requirements', 'Balancing compliance with customer experience', 'Keeping up with regulatory changes'],
    environmentalFactors: ['Evolving regulatory landscape', 'Increasing regulatory scrutiny', 'Pressure to process reviews quickly', 'Need for accuracy and thoroughness']
  },
  goals: [
    'Ensure 100% regulatory compliance',
    'Process reviews within SLA',
    'Maintain comprehensive documentation',
    'Protect bank from regulatory violations',
    'Balance compliance with customer experience'
  ],
  painPoints: [
    'High volume of manual reviews',
    'Complex and changing regulations',
    'Pressure to process quickly while maintaining accuracy',
    'Lack of clear guidelines for edge cases',
    'Insufficient tools for efficient review'
  ],
  needs: {
    functional: [
      'Clear review guidelines and procedures',
      'Access to comprehensive customer data',
      'Efficient review tools and systems',
      'Training on regulatory changes',
      'Support for complex cases'
    ],
    emotional: [
      'Confidence in decision-making',
      'Recognition for protecting the bank',
      'Reduced stress from high workload',
      'Clear escalation paths'
    ]
  },
  technicalProficiency: 'medium',
  preferredChannels: [
    'Compliance review system',
    'Email for documentation',
    'Phone for urgent escalations',
    'In-person meetings for complex cases'
  ],
  characteristics: [
    'Detail-oriented',
    'Risk-averse',
    'Methodical',
    'Documentation-focused',
    'Regulatory knowledge'
  ],
  usagePatterns: [
    'Reviews applications daily',
    'Documents decisions thoroughly',
    'Escalates complex cases',
    'Attends compliance training regularly'
  ],
  metrics: {
    successIndicators: [
      'Zero regulatory violations',
      'Reviews completed within SLA',
      'High accuracy in compliance decisions',
      'Comprehensive documentation'
    ],
    engagementPatterns: [
      'Daily review of flagged applications',
      'Regular compliance training attendance',
      'Participation in compliance meetings'
    ],
    satisfactionSignals: [
      'Low error rate in reviews',
      'Positive feedback from management',
      'Efficient review processes',
      'Clear regulatory guidance'
    ],
    churnRisks: [
      'High workload and stress',
      'Lack of support for complex cases',
      'Outdated review tools',
      'Unclear regulatory guidance'
    ]
  },
  psychology: {
    values: [
      'Regulatory compliance and integrity',
      'Protecting the bank from violations',
      'Accuracy and thoroughness',
      'Professional expertise'
    ],
    fears: [
      'Regulatory violations that harm the bank',
      'Missing compliance issues',
      'Inadequate documentation for audits',
      'Pressure to approve risky applications'
    ],
    aspirations: [
      'Become a recognized compliance expert',
      'Contribute to bank\'s compliance excellence',
      'Balance compliance with customer experience',
      'Advance to senior compliance leadership'
    ]
  },
  motivations: [
    'Protecting the bank from regulatory violations',
    'Ensuring customer applications are processed fairly',
    'Professional growth in compliance expertise',
    'Contributing to bank\'s reputation and success'
  ],
  dayInTheLife: 'The compliance officer starts the day by reviewing a queue of account applications flagged by automated systems. They carefully examine each case, checking against regulatory requirements and internal policies. For complex cases, they consult with senior compliance officers and document their decisions thoroughly. Throughout the day, they balance the need for thorough review with the pressure to process applications within SLA, ensuring both compliance and customer experience are maintained.'
})
export class ComplianceOfficerPersona {}

