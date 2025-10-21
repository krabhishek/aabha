/**
 * Audit and Fraud Detection System Personas
 *
 * Internal systems for audit logging, fraud detection,
 * and compliance monitoring.
 */

import { Persona } from '../../../../../src/index.js';

@Persona({
  name: 'Audit Log System',
  technicalProficiency: 'high',
  description: 'Centralized audit logging platform capturing all system events, user actions, and data changes for compliance and forensics',
  preferredChannels: ['Event streaming', 'log aggregation', 'search API'],
  extensions: {
    type: 'Internal Platform',
    techStack: 'Elasticsearch + Logstash + Kibana (ELK Stack)',
    capabilities: [
      'Immutable event logging',
      'User action tracking',
      'Data change auditing (before/after)',
      'API access logging',
      'Authentication/authorization events',
      'Compliance event capture',
      'Tamper-proof storage',
      'Full-text search across logs'
    ],
    performance: {
      ingestion: '100,000 events/second',
      searchLatency: '< 500ms',
      retention: '7 years hot storage, 20 years cold archive'
    },
    dataVolume: {
      dailyEvents: '50 million',
      totalStorage: '2.5 PB',
      growth: '200 GB/day'
    },
    compliance: [
      'Genai Banking Act audit requirements',
      'GDPR right to access',
      'SOX compliance',
      'ISO 27001 audit trails'
    ],
    security: 'Append-only storage, cryptographic hashing, WORM (Write Once Read Many)',
    access: 'Role-based with approval workflow for sensitive queries'
  }
})
export class AuditLogSystemPersona {}

@Persona({
  name: 'AI Fraud Detection System',
  technicalProficiency: 'high',
  description: 'Machine learning-powered fraud detection platform analyzing transactions in real-time to identify suspicious patterns and prevent fraud',
  preferredChannels: ['Event streaming', 'REST API', 'webhook callbacks'],
  extensions: {
    type: 'Internal AI Platform',
    techStack: 'Python + TensorFlow + Apache Kafka + Redis',
    capabilities: [
      'Real-time transaction scoring (fraud probability)',
      'Behavioral anomaly detection',
      'Device fingerprinting and velocity checks',
      'Network analysis (money laundering patterns)',
      'Account takeover detection',
      'Synthetic identity detection',
      'Rule engine + ML models hybrid',
      'Case management for investigators'
    ],
    mlModels: {
      algorithms: ['Random Forest', 'XGBoost', 'Neural Networks', 'Graph Analytics'],
      accuracy: '95% fraud detection rate',
      falsePositiveRate: '2%',
      modelRetraining: 'Weekly with new fraud patterns',
      features: '250+ features per transaction'
    },
    performance: {
      latency: '< 100ms for scoring',
      throughput: '50,000 transactions/second',
      realtime: 'Inline scoring before transaction approval'
    },
    currentMetrics: {
      detectionRate: '78% (target: 95%)',
      falsePositives: '5% (target: < 2%)',
      fraudPrevented: 'GD$12 million/year'
    },
    integration: 'Kafka consumer + REST API for adhoc queries',
    team: 'Data Science (8 ML engineers) + Fraud Ops (25 investigators)'
  }
})
export class AIFraudDetectionSystemPersona {}
