/**
 * Payment and Card Issuance System Personas
 *
 * Systems handling payment processing, card issuance,
 * and transaction authorization.
 */

import { Persona } from '../../../../../src/index.js';

@Persona({
  name: 'Virtual Card Issuance System',
  technicalProficiency: 'high',
  description: 'Cloud-based virtual debit card issuance platform providing instant card provisioning for digital wallets',
  preferredChannels: ['REST API', 'SDK integration'],
  extensions: {
    type: 'External Service',
    vendor: 'Marqeta Card Issuing Platform',
    capabilities: [
      'Instant virtual card creation (< 1 second)',
      'Card tokenization for Apple Pay / Google Pay',
      'PIN setting and management',
      'Card controls (spending limits, merchant categories)',
      'Real-time authorization decisions',
      'Card lifecycle management (activate, freeze, replace)',
      'EMV compliance',
      'PCI DSS compliant'
    ],
    cardNetwork: 'Visa',
    issuance: {
      virtualCards: 'Instant provisioning',
      physicalCards: '3-5 business days delivery',
      cardFormat: 'Visa Debit',
      expiryPeriod: '3 years'
    },
    performance: {
      issuanceLatency: '< 500ms',
      authorizationLatency: '< 200ms',
      throughput: '10,000 authorizations/second'
    },
    sla: {
      availability: '99.99%',
      uptime: '24/7/365'
    },
    compliance: ['PCI DSS Level 1', 'Visa certification', 'EMV standards'],
    pricing: 'GD$0.50 per virtual card + GD$0.02 per authorization',
    integration: 'RESTful API + webhook notifications',
    security: 'Tokenization, encryption at rest and in transit, HSM for key storage',
    documentation: 'https://www.marqeta.com/docs/developer-guides'
  }
})
export class VirtualCardIssuanceSystemPersona {}

@Persona({
  name: 'Payment Gateway Service',
  technicalProficiency: 'high',
  description: 'Payment processing gateway handling domestic and international money transfers, bill payments, and merchant transactions',
  preferredChannels: ['REST API', 'SWIFT messaging', 'ACH batch files'],
  extensions: {
    type: 'Internal + External Service',
    components: [
      'Domestic payment switch (Genai InstaPay)',
      'SWIFT gateway for international transfers',
      'ACH processor for batch payments',
      'Real-time payment rails (Genai RTP)'
    ],
    capabilities: [
      'Instant domestic transfers (< 10 seconds)',
      'International wire transfers (SWIFT)',
      'Bill payment processing',
      'Merchant acquiring and settlement',
      'Standing orders and scheduled payments',
      'Payment status tracking',
      'FX conversion for multi-currency'
    ],
    performance: {
      domesticTransferLatency: '< 10 seconds',
      internationalTransferLatency: '1-3 business days',
      throughput: '20,000 transactions/second',
      successRate: '99.7%'
    },
    volume: {
      dailyTransactions: '2 million',
      peakTPS: '15,000 during salary day'
    },
    currentMetrics: {
      processingTime: 'T+2 (target: Real-time)',
      failureRate: '0.3%',
      averageFees: 'GD$0.25 domestic, GD$15 international'
    },
    integration: 'REST APIs + message queues + batch files',
    compliance: ['SWIFT standards', 'Genai Payment Act', 'AML transaction monitoring']
  }
})
export class PaymentGatewayServicePersona {}
