import { Persona, PersonaType } from 'aabha';

/**
 * Identity Verification Service Persona
 * System persona for identity verification operations
 */
@Persona({
  type: PersonaType.System,
  name: 'Identity Verification Service',
  archetype: 'The Security Guardian - Ensures identity verification with high accuracy and compliance',
  description: 'Automated system responsible for verifying customer identity using government ID scanning and biometric authentication',
  systemAttributes: {
    vendor: 'Internal',
    capabilities: [
      'Government ID document verification',
      'Biometric matching',
      'Real-time identity verification',
      'Compliance checking',
      'Fraud detection'
    ],
    authentication: 'Service-to-service authentication using API keys and mTLS',
    integration: 'RESTful API with JSON payloads, real-time processing',
    sla: {
      availability: '99.9%',
      latency: '< 3 seconds',
      throughput: '> 500 verifications/hour'
    }
  },
  behavior: {
    typicalBehaviors: [
      'Verifies government-issued ID documents',
      'Matches biometric data with ID documents',
      'Performs real-time identity checks',
      'Maintains compliance audit trails'
    ],
    usagePatterns: [
      'Real-time verification during account opening',
      'Batch processing for compliance reports',
      'On-demand verification for high-risk transactions'
    ]
  },
  painPoints: [
    'High latency during peak verification times',
    'Complex integration with multiple ID verification providers',
    'Maintaining accuracy while processing at scale',
    'Handling edge cases with document quality'
  ],
  metrics: {
    successIndicators: ['Verification accuracy > 99%', 'Processing time < 3 seconds'],
    satisfactionSignals: ['Low false positive rate', 'Fast response times'],
    churnRisks: ['High error rates', 'Slow processing times']
  },
  goals: [
    'Verify customer identity accurately and quickly',
    'Maintain high availability and reliability',
    'Ensure compliance with KYC/AML regulations',
    'Minimize false positives and false negatives'
  ],
  adoptionBarriers: [
    'Complex integration with multiple verification providers',
    'High latency concerns affecting user experience',
    'Requires significant infrastructure for biometric processing',
    'Regulatory compliance complexity'
  ],
  needs: {
    functional: ['Access to government ID databases', 'Biometric matching algorithms', 'Real-time processing capabilities'],
    emotional: [],
    social: [],
    informational: ['Document quality standards', 'Compliance requirements', 'Fraud patterns']
  },
  preferredChannels: [
    'REST API',
    'Real-time webhooks',
    'Batch file processing'
  ],
  dependencies: [
    'Government ID database access',
    'Biometric matching service',
    'Compliance checking system'
  ],
  integrations: [
    'Account Management System',
    'Application Processing System',
    'Compliance System'
  ],
  securityProfile: {
    dataClassification: 'Highly Confidential (PII, biometric data, identity documents)',
    accessControl: 'Service-to-service authentication using API keys and mTLS, role-based access control (RBAC)',
    complianceRequirements: ['PCI-DSS Level 1', 'GDPR', 'SOC 2 Type II', 'KYC/AML regulations', 'Biometric data protection laws']
  }
})
export class IdentityVerificationServicePersona {}

