import { Context, ContextRelationship } from 'aabha';
import { BankingContext } from './BankingContext.js';
import { DigitalBankingContext } from './DigitalBankingContext.js';

/**
 * Compliance Context
 * Regulatory compliance, AML, KYC, and policy framework
 */
@Context({
  name: 'Compliance',
  description: 'Regulatory compliance domain covering KYC, AML, sanctions screening, and policy framework. This context ensures all banking operations comply with regulations and protects the bank from regulatory violations.',
  inScope: [
    'KYC compliance checking',
    'AML screening and monitoring',
    'Sanctions list checking',
    'Regulatory policy framework',
    'Compliance training and awareness',
    'Manual compliance reviews',
    'Regulatory reporting',
    'Compliance audit trails'
  ],
  outOfScope: [
    'Credit risk assessment',
    'Operational risk management',
    'Internal audit',
    'Customer service',
    'Product development'
  ],
  capabilities: {
    core: [
      'Automated compliance checking',
      'Manual compliance review',
      'Regulatory policy enforcement',
      'AML transaction monitoring',
      'Sanctions screening'
    ],
    supporting: [
      'Compliance training',
      'Regulatory reporting',
      'Audit trail management',
      'Compliance documentation'
    ],
    emerging: [
      'AI-powered compliance monitoring',
      'Real-time compliance alerts',
      'Predictive compliance analytics'
    ]
  },
  domainModel: {
    coreEntities: ['ComplianceCheck', 'RegulatoryPolicy', 'ComplianceReview', 'SanctionsMatch', 'AMLAlert'],
    valueObjects: ['ComplianceStatus', 'RiskRating', 'RegulatoryRequirement'],
    ubiquitousLanguage: {
      'KYC': 'Know Your Customer - identity verification process',
      'AML': 'Anti-Money Laundering - detection and prevention of money laundering',
      'Sanctions': 'Government-imposed restrictions on transactions with specific entities',
      'Compliance Review': 'Manual human review of applications flagged by automated systems',
      'Regulatory Violation': 'Failure to comply with banking regulations'
    }
  },
  relationships: [
    {
      type: ContextRelationship.Partnership,
      context: BankingContext,
      description: 'Compliance checks are performed for all banking operations',
      exchanged: ['Compliance status', 'KYC results', 'AML alerts'],
      communicationPattern: 'event-driven',
      frequency: 'real-time'
    },
    {
      type: ContextRelationship.Partnership,
      context: DigitalBankingContext,
      description: 'Digital banking operations require compliance verification',
      exchanged: ['Digital KYC results', 'Identity verification status'],
      communicationPattern: 'sync',
      frequency: 'real-time'
    }
  ],
  healthIndicators: [
    'Compliance check processing time',
    'Regulatory violation rate',
    'Compliance review completion rate',
    'AML detection rate',
    'Sanctions screening accuracy'
  ],
  goals: [
    'Maintain 100% regulatory compliance',
    'Process compliance checks within 5 seconds',
    'Complete manual reviews within 48-hour SLA',
    'Zero regulatory violations',
    'Maintain comprehensive audit trails'
  ],
  owner: 'Dr. Kenji Yamamoto - Chief Compliance Officer',
  team: 'Compliance Division',
  assumptions: [
    'Regulatory environment remains stable',
    'Compliance systems maintain 99.9% uptime',
    'Regulatory requirements are clearly communicated',
    'Compliance officers have adequate training'
  ],
  constraints: [
    'Regulatory requirements vary by jurisdiction',
    'Compliance systems must integrate with multiple banking systems',
    'Manual reviews require human expertise and time',
    'Regulatory changes require system and process updates',
    'Audit trails must be retained for 7 years'
  ],
  tags: [
    'regulatory',
    'compliance',
    'kyc',
    'aml',
    'middle-office',
    'mission-critical'
  ]
})
export class ComplianceContext {}

