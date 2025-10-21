/**
 * Document Verification AI System Persona
 *
 * AI-powered document verification service for ID document validation,
 * data extraction, and fraud detection.
 */

import { Persona } from '../../../../../src/index.js';

@Persona({
  name: 'AI Document Verification Service',
  technicalProficiency: 'high',
  description: 'AI-powered document verification platform using computer vision and machine learning for identity document validation and data extraction',
  preferredChannels: ['REST API', 'SDK integration', 'webhook callbacks'],
  extensions: {
    type: 'External AI Service',
    vendor: 'Onfido Identity Verification Platform',
    capabilities: [
      'Document type detection (passport, ID card, driver license)',
      'OCR data extraction (name, DOB, ID number, address)',
      'Document authenticity checks (holograms, watermarks, security features)',
      'Facial biometric matching (photo on ID vs selfie)',
      'Liveness detection (real person vs photo/video)',
      'Fraud detection (tampered documents, deepfakes)',
      'Confidence scoring per field and overall'
    ],
    aiModels: {
      accuracy: '99.5% for document validity',
      falsePositiveRate: '< 0.5%',
      processingTime: '< 30 seconds average',
      supportedDocuments: '10,000+ document types from 195 countries'
    },
    sla: {
      availability: '99.95%',
      latency: '< 30 seconds p95',
      throughput: '1000 verifications/minute'
    },
    authentication: 'API token + webhook signatures',
    compliance: ['GDPR', 'SOC 2 Type II', 'ISO 27001'],
    dataRetention: 'Configurable: 7 years for OgPgyBank',
    pricing: 'GD$2.50 per verification (includes ID + selfie + liveness)',
    integration: 'RESTful API + Mobile SDK (iOS/Android)',
    documentation: 'https://documentation.onfido.com/'
  }
})
export class AIDocumentVerificationServicePersona {}
