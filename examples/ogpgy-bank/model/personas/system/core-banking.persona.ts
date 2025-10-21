/**
 * Core Banking System Personas
 *
 * Internal banking platforms handling accounts, transactions,
 * customer data, and financial operations.
 */

import { Persona } from '../../../../../src/index.js';

@Persona({
  name: 'Core Banking Platform',
  technicalProficiency: 'high',
  description: 'Modern cloud-native core banking system handling accounts, transactions, customer master data, and financial operations',
  preferredChannels: ['Internal APIs', 'message queues', 'event streams'],
  extensions: {
    type: 'Internal Platform',
    vendor: 'Mambu Cloud Banking Platform (SaaS)',
    status: 'Migration in progress (60% complete)',
    capabilities: [
      'Account lifecycle management (open, maintain, close)',
      'Transaction processing (deposits, withdrawals, transfers)',
      'Customer 360° data management',
      'Balance and ledger management',
      'Interest calculation and posting',
      'Fee calculation and billing',
      'Product catalog management',
      'Multi-currency support'
    ],
    architecture: 'Microservices on AWS',
    performance: {
      accountCreation: '< 2 seconds',
      transactionProcessing: 'Real-time (T+0)',
      concurrentUsers: '50,000+',
      throughput: '10,000 TPS'
    },
    dataVolume: {
      accounts: '3.2 million active accounts',
      transactions: '50 million/month',
      dataRetention: '10 years online, 20 years archive'
    },
    integration: 'REST APIs + Kafka event streaming',
    deployment: 'Multi-region active-active (99.99% uptime)',
    migration: {
      from: 'Legacy COBOL mainframe (40+ years old)',
      approach: 'Strangler fig pattern - migrate by product line',
      completion: 'Q2 2025 target'
    }
  }
})
export class CoreBankingPlatformPersona {}

@Persona({
  name: 'Mobile App Backend Service',
  technicalProficiency: 'high',
  description: 'Backend-for-frontend (BFF) service powering OgPgyBank mobile apps with optimized APIs for mobile UX',
  preferredChannels: ['GraphQL API', 'WebSocket', 'push notifications'],
  extensions: {
    type: 'Internal Service',
    techStack: 'Node.js + TypeScript + GraphQL + Redis',
    capabilities: [
      'GraphQL API for efficient data fetching',
      'Push notification orchestration',
      'Offline-first data sync',
      'Session management',
      'Device fingerprinting',
      'API rate limiting per user',
      'Real-time balance updates via WebSocket'
    ],
    performance: {
      latency: '< 100ms p95',
      throughput: '5,000 RPS',
      concurrentConnections: '100,000 WebSocket connections'
    },
    deployment: 'Kubernetes on AWS (auto-scaling)',
    caching: 'Redis for session + frequently accessed data',
    security: 'mTLS, JWT tokens, device attestation',
    observability: 'DataDog APM + custom dashboards',
    team: 'Mobile Engineering (15 backend engineers)'
  }
})
export class MobileAppBackendServicePersona {}
