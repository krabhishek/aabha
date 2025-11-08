import { Persona, PersonaType } from 'aabha';

/**
 * Compliance System Persona
 * System persona for compliance checking operations
 */
@Persona({
  type: PersonaType.System,
  name: 'Compliance System',
  archetype: 'The Regulatory Guardian - Ensures all operations comply with banking regulations',
  description: 'Automated system responsible for performing KYC, AML, and other compliance checks on account applications and transactions',
  systemAttributes: {
    vendor: 'Internal',
    capabilities: [
      'KYC compliance checking',
      'AML screening',
      'Sanctions list checking',
      'Risk assessment',
      'Regulatory reporting'
    ],
    authentication: 'Service-to-service authentication using mTLS certificates',
    integration: 'RESTful API with JSON payloads, event-driven architecture',
    sla: {
      availability: '99.9%',
      latency: '< 5 seconds',
      throughput: '> 500 checks/hour'
    }
  },
  behavior: {
    typicalBehaviors: [
      'Performs KYC checks on applications',
      'Screens against AML databases',
      'Checks sanctions lists',
      'Generates compliance reports',
      'Maintains audit trails'
    ],
    usagePatterns: [
      'Real-time compliance checking during application processing',
      'Batch processing for regulatory reports',
      'On-demand checks for high-risk transactions'
    ]
  },
  painPoints: [
    'Complex regulatory requirements',
    'High latency during peak processing times',
    'Maintaining accuracy across multiple jurisdictions',
    'Keeping up with regulatory changes'
  ],
  metrics: {
    successIndicators: ['Compliance rate 100%', 'Processing time < 5 seconds'],
    satisfactionSignals: ['Zero regulatory violations', 'Fast processing times'],
    churnRisks: ['Regulatory violations', 'Slow processing times']
  },
  goals: [
    'Ensure 100% compliance with regulations',
    'Process compliance checks quickly',
    'Maintain comprehensive audit trails',
    'Stay current with regulatory changes'
  ],
  adoptionBarriers: [
    'Complex regulatory requirements',
    'High infrastructure costs',
    'Requires continuous regulatory updates',
    'Integration complexity with multiple systems'
  ],
  needs: {
    functional: ['Access to compliance databases', 'Regulatory rule engine', 'Audit logging capabilities'],
    emotional: [],
    social: [],
    informational: ['Regulatory updates', 'Compliance patterns', 'Risk indicators']
  },
  preferredChannels: [
    'REST API',
    'Event-driven message queue',
    'Batch file processing'
  ],
  dependencies: [
    'KYC database access',
    'AML screening service',
    'Sanctions list service',
    'Regulatory rule engine'
  ],
  integrations: [
    'Account Management System',
    'Application Processing System',
    'Identity Verification Service'
  ],
  securityProfile: {
    dataClassification: 'Highly Confidential (customer PII, compliance data, risk assessments)',
    accessControl: 'Service-to-service authentication using mTLS certificates, role-based access control (RBAC)',
    complianceRequirements: ['PCI-DSS Level 1', 'GDPR', 'SOC 2 Type II', 'Banking regulations', 'KYC/AML regulations']
  }
})
export class ComplianceSystemPersona {}

