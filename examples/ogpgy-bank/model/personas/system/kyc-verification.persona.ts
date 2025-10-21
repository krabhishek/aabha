/**
 * KYC Verification System Personas
 *
 * External and internal systems handling Know Your Customer verification,
 * identity validation, and compliance checks.
 */

import { Persona } from '../../../../../src/index.js';

@Persona({
  name: 'eKYC Verification Service',
  technicalProficiency: 'high',
  description: 'Cloud-based eKYC verification service providing real-time identity verification against Central Bank KYC Registry',
  preferredChannels: ['REST API', 'webhook callbacks'],
  extensions: {
    type: 'External API Service',
    vendor: 'Genai Central Bank eKYC API',
    capabilities: [
      'Real-time identity verification',
      'Biometric matching (facial recognition)',
      'Document authenticity validation',
      'Sanctions list screening',
      'PEP (Politically Exposed Person) checks',
      'Adverse media screening'
    ],
    sla: {
      availability: '99.95%',
      latency: '< 3 seconds for verification',
      throughput: '5000 verifications/hour'
    },
    dataRetention: '7 years (regulatory requirement)',
    authentication: 'OAuth 2.0 + API key',
    compliance: ['Genai Banking Act 2020', 'AML/CFT Regulations', 'GDPR-equivalent'],
    costs: 'GD$0.50 per verification',
    integration: 'RESTful API with JSON payloads',
    documentation: 'https://centralbankapi.genai.gov/kyc/docs'
  }
})
export class EKYCVerificationServicePersona {}

@Persona({
  name: 'Central Bank KYC Registry',
  technicalProficiency: 'high',
  description: 'National KYC database maintained by Genai Central Bank for cross-bank identity verification',
  preferredChannels: ['Secure API', 'batch queries'],
  extensions: {
    type: 'Government System',
    authority: 'Genai Central Bank',
    coverage: '8.5 million Genai citizens + 2.1 million expats/residents',
    dataPoints: [
      'National ID number',
      'Biometric data (fingerprint, facial)',
      'Address history',
      'Bank account history across all banks',
      'Tax ID linkage',
      'Sanctions/PEP status'
    ],
    sla: {
      availability: '99.99%',
      latency: '< 1 second for lookup',
      batchProcessing: 'Overnight batch for bulk verification'
    },
    updateFrequency: 'Real-time for critical changes, daily for regular updates',
    security: 'Bank-grade encryption, audit trails, strict access controls',
    regulation: 'Genai Digital Identity Act 2022'
  }
})
export class CentralBankKYCRegistryPersona {}
