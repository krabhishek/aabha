import { Context, ContextRelationship } from 'aabha';
import { BankingContext } from './BankingContext.js';

/**
 * Risk Management Context
 * Credit risk, operational risk, and risk assessment
 */
@Context({
  name: 'Risk Management',
  description: 'Risk management domain covering credit risk assessment, operational risk, and portfolio risk management. This context protects the bank from losses while enabling responsible business growth.',
  inScope: [
    'Credit risk assessment',
    'Loan approval decisions',
    'Portfolio risk monitoring',
    'Operational risk management',
    'Risk modeling and analytics',
    'Risk policy framework',
    'Risk committee processes',
    'Risk reporting'
  ],
  outOfScope: [
    'Regulatory compliance',
    'Internal audit',
    'Customer service',
    'Product development',
    'Marketing'
  ],
  capabilities: {
    core: [
      'Credit risk assessment',
      'Loan approval decision-making',
      'Portfolio risk monitoring',
      'Risk modeling and analytics',
      'Risk policy enforcement'
    ],
    supporting: [
      'Risk reporting',
      'Risk training',
      'Risk documentation',
      'Risk committee facilitation'
    ],
    emerging: [
      'AI-powered risk prediction',
      'Real-time risk monitoring',
      'Predictive risk analytics'
    ]
  },
  domainModel: {
    coreEntities: ['LoanApplication', 'CreditAssessment', 'RiskModel', 'Portfolio', 'RiskPolicy'],
    valueObjects: ['CreditScore', 'RiskRating', 'LoanTerms'],
    ubiquitousLanguage: {
      'Credit Risk': 'Risk of borrower defaulting on loan obligations',
      'Risk Assessment': 'Evaluation of creditworthiness and repayment ability',
      'Loan Approval Committee': 'Committee that reviews and approves loan applications',
      'Portfolio Risk': 'Aggregate risk across all loans in portfolio',
      'Default Rate': 'Percentage of loans that default'
    }
  },
  relationships: [
    {
      type: ContextRelationship.Partnership,
      context: BankingContext,
      description: 'Risk assessments are performed for all credit decisions',
      exchanged: ['Loan applications', 'Risk assessments', 'Approval decisions'],
      communicationPattern: 'sync',
      frequency: 'on-demand'
    }
  ],
  healthIndicators: [
    'Default rate',
    'Risk assessment accuracy',
    'Loan approval processing time',
    'Portfolio risk metrics',
    'Risk model performance'
  ],
  goals: [
    'Maintain default rate < 2%',
    'Process risk assessments within SLA',
    'Accurate risk assessment > 95%',
    'Support responsible business growth',
    'Protect bank from credit losses'
  ],
  owner: 'Elena Rodriguez - Chief Risk Officer',
  team: 'Risk Management Division',
  assumptions: [
    'Risk models accurately predict default probability',
    'Economic conditions remain relatively stable',
    'Credit data is accurate and complete',
    'Risk policies are clearly defined'
  ],
  constraints: [
    'Risk models require historical data',
    'Risk assessments require human judgment for complex cases',
    'Balancing risk with business growth objectives',
    'Regulatory requirements for risk management',
    'Time pressure for loan approval decisions'
  ],
  tags: [
    'risk-management',
    'credit-risk',
    'middle-office',
    'decision-making',
    'mission-critical'
  ]
})
export class RiskManagementContext {}

