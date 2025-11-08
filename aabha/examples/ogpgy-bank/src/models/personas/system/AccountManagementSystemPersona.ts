import { Persona, PersonaType } from 'aabha';

/**
 * Account Management System Persona
 * System persona for automated account management operations
 */
@Persona({
  type: PersonaType.System,
  name: 'Account Management System',
  archetype: 'The Automated Orchestrator - Executes business workflows reliably and efficiently',
  description: 'Automated system responsible for processing account applications, activating accounts, and managing account lifecycle operations',
  systemAttributes: {
    vendor: 'Internal',
    capabilities: [
      'Account application processing',
      'Automated account activation',
      'Account lifecycle management',
      'Compliance checking',
      'Workflow automation'
    ],
    authentication: 'Service-to-service authentication using mTLS certificates',
    integration: 'RESTful API with JSON payloads, event-driven architecture with message queue',
    sla: {
      availability: '99.9%',
      latency: '< 2 seconds',
      throughput: '> 1000 applications/hour'
    }
  },
  behavior: {
    typicalBehaviors: [
      'Processes account applications automatically',
      'Executes compliance checks in sequence',
      'Activates approved accounts immediately',
      'Maintains audit trail for all operations'
    ],
    usagePatterns: [
      'Continuous processing during business hours',
      'Batch processing for compliance reports',
      'Real-time event-driven account activation'
    ]
  },
  painPoints: [
    'High latency during peak load times',
    'Complex integration with legacy systems',
    'Maintaining consistency across distributed components',
    'Handling edge cases in application processing'
  ],
  metrics: {
    successIndicators: [''], // TODO: How to measure if persona is successful/satisfied?
    satisfactionSignals: [''], // TODO: Observable signals that persona is happy?
    churnRisks: [''] // TODO: Warning signs that persona might leave?
  },
  goals: [
    'Process account applications efficiently and accurately',
    'Maintain high availability and reliability',
    'Ensure compliance with regulatory requirements',
    'Minimize processing latency and improve throughput'
  ],
  adoptionBarriers: [
    'Complex integration with legacy systems requiring custom adapters',
    'High latency concerns during peak load times affecting user experience',
    'Requires significant infrastructure investment for distributed architecture',
    'Steep learning curve for teams unfamiliar with event-driven workflows'
  ],
  needs: {
    functional: [''],  // TODO: Practical, task-oriented needs
    emotional: [''],  // TODO: Feelings and emotional states sought
    social: [''],  // TODO: Social connections and status needs
    informational: ['']  // TODO: Information and knowledge needs
  },
  preferredChannels: [
    'REST API',
    'Event-driven message queue',
    'Batch file processing'
  ],
  dependencies: [
    '', // TODO: Other personas, systems, or entities this persona depends on
    '' // TODO: Add more dependencies
  ],
  integrations: [
    '', // TODO: Integration points with other teams, systems, or personas
    '' // TODO: Add more integrations
  ],
  securityProfile: {
    dataClassification: 'Highly Confidential (customer PII, account data, financial information)',
    accessControl: 'Service-to-service authentication using mTLS certificates, role-based access control (RBAC)',
    complianceRequirements: ['PCI-DSS Level 1', 'GDPR', 'SOC 2 Type II', 'Banking regulations']
  }
})
export class AccountManagementSystemPersona {}

