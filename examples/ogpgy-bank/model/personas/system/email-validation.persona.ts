/**
 * Email Validation System Persona
 *
 * Third-party email validation service for format checking,
 * DNS verification, and disposable email detection.
 */

import { Persona } from '../../../../../src/index.js';

@Persona({
  name: 'Email Validation Service',
  technicalProficiency: 'high',
  description: 'Cloud-based email validation API providing RFC 5322 compliance checking, DNS MX verification, and deliverability scoring',
  preferredChannels: ['REST API', 'batch validation API'],
  extensions: {
    type: 'External SaaS Service',
    vendor: 'SendGrid Email Validation API',
    capabilities: [
      'RFC 5322 format validation',
      'DNS MX record verification',
      'SMTP mailbox verification',
      'Disposable/temporary email detection',
      'Role-based email detection (info@, admin@, etc.)',
      'Typo/spam-trap detection',
      'Deliverability score (0-100)'
    ],
    sla: {
      availability: '99.9%',
      latency: '< 200ms p95',
      throughput: '10,000 requests/second'
    },
    authentication: 'API key (Bearer token)',
    rateLimit: '100,000 requests/month (OgPgyBank enterprise tier)',
    pricing: 'GD$0.002 per validation',
    integration: 'RESTful API with JSON payloads',
    caching: 'Results cached for 24 hours to reduce API calls',
    documentation: 'https://sendgrid.com/docs/api-reference/mail-validation'
  }
})
export class EmailValidationServicePersona {}
