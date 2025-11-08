import { Interaction, InteractionPattern, InteractionLayer } from 'aabha';
import { IdentityVerificationServiceStakeholder } from '../../stakeholders/system/IdentityVerificationServiceStakeholder.js';

/**
 * KYC Verification Service Interaction
 * External service interaction with third-party KYC provider for identity verification
 */
@Interaction({
  name: 'KYC Verification Service',
  description: 'External API call to third-party KYC service provider for automated identity verification using government ID documents and biometric data',
  pattern: InteractionPattern.RequestResponse,
  layer: InteractionLayer.External,
  inputs: [
    {
      name: 'documentImage',
      type: 'object',
      required: true,
      description: 'Government ID document image (passport, driver license, national ID)',
      sensitivity: 'restricted',
      validation: {
        format: 'image',
        constraints: ['Image must be clear and readable', 'Minimum resolution: 1920x1080']
      }
    },
    {
      name: 'personalInformation',
      type: 'object',
      required: true,
      description: 'Personal information extracted from application for matching',
      sensitivity: 'confidential',
      validation: {
        format: 'json'
      }
    },
    {
      name: 'biometricData',
      type: 'object',
      required: false,
      description: 'Biometric verification data if available',
      sensitivity: 'restricted',
      validation: {
        format: 'encrypted'
      }
    }
  ],
  outputs: [
    {
      name: 'verificationResult',
      type: 'object',
      required: true,
      description: 'KYC verification result including match confidence and verification status',
      validation: {
        format: 'json'
      }
    },
    {
      name: 'confidenceScore',
      type: 'number',
      required: true,
      description: 'Confidence score (0-100) indicating verification confidence',
      validation: {
        range: {
          min: 0,
          max: 100
        }
      }
    },
    {
      name: 'verificationStatus',
      type: 'string',
      required: true,
      description: 'Verification status (verified, rejected, manual-review-required)',
      validation: {
        constraints: ['Must be one of: verified, rejected, manual-review-required']
      }
    },
    {
      name: 'extractedData',
      type: 'object',
      required: false,
      description: 'Data extracted from document (name, DOB, ID number, etc.)',
      sensitivity: 'confidential'
    }
  ],
  protocol: {
    name: 'HTTP',
    version: '1.1',
    http: {
      method: 'POST',
      path: '/api/v2/verify',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': '{api-key}'
      },
      contentType: 'application/json',
      acceptType: 'application/json'
    }
  },
  security: {
    authentication: 'api-key',
    authorization: 'none',
    encryptionInTransit: {
      required: true,
      protocol: 'TLS 1.3'
    },
    compliance: ['GDPR', 'PCI-DSS', 'SOC 2']
  },
  quality: {
    slo: {
      latency: {
        p50: '2s',
        p95: '5s',
        p99: '10s',
        max: '30s'
      },
      availability: {
        target: '99.5%',
        errorBudget: '3.6h/month'
      },
      throughput: {
        min: '50 req/sec',
        burst: '100 req/sec'
      }
    }
  },
  errorHandling: {
    errorCodes: [
      {
        code: 'INVALID_DOCUMENT',
        description: 'Document image quality insufficient for verification',
        severity: 'medium',
        retryable: true,
        httpStatus: 400
      },
      {
        code: 'SERVICE_TIMEOUT',
        description: 'KYC service timeout',
        severity: 'high',
        retryable: true,
        httpStatus: 504
      },
      {
        code: 'RATE_LIMIT_EXCEEDED',
        description: 'API rate limit exceeded',
        severity: 'medium',
        retryable: true,
        httpStatus: 429
      }
    ],
    fallback: {
      strategy: 'retry',
      maxRetries: 3,
      retryBackoff: 'exponential',
      details: 'Retry with exponential backoff: 2s, 4s, 8s'
    },
    timeoutBehavior: 'Return error and trigger manual review workflow'
  },
  observability: {
    enabled: true,
    logLevel: 'info',
    tracing: {
      enabled: true,
      traceHeaders: ['X-Trace-Id'],
      spanName: 'kyc-verification-external',
      samplingRate: 1.0
    }
  },
  backendConfig: {
    resilience: {
      circuitBreaker: {
        enabled: true,
        failureThreshold: 10,
        resetTimeout: 60000
      },
      rateLimit: {
        enabled: true,
        requestsPerSecond: 50
      },
      timeout: {
        connection: 10000,
        read: 30000,
        write: 5000
      }
    }
  },
  versioning: {
    version: '2.0.0',
    backwardCompatible: ['1.5.0', '1.4.0'],
    negotiation: {
      method: 'header',
      headerName: 'X-API-Version'
    }
  },
  participants: [
    {
      stakeholder: IdentityVerificationServiceStakeholder,
      role: 'provider',
      required: true
    }
  ],
  tags: ['external', 'kyc', 'identity-verification', 'third-party', 'critical-path']
})
export class KYCVerificationServiceInteraction {}

