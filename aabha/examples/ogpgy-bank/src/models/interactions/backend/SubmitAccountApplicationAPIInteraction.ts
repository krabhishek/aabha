import { Interaction, InteractionPattern, InteractionLayer } from 'aabha';
import { DigitalCustomerStakeholder } from '../../stakeholders/human/DigitalCustomerStakeholder.js';

/**
 * Submit Account Application API Interaction
 * Backend API endpoint that receives and processes account opening application
 */
@Interaction({
  name: 'Submit Account Application API',
  description: 'REST API endpoint that receives account opening application from frontend, validates data, and initiates processing workflow',
  pattern: InteractionPattern.RequestResponse,
  layer: InteractionLayer.Backend,
  inputs: [
    {
      name: 'applicationData',
      type: 'object',
      required: true,
      description: 'Complete account application data including personal info, contact details, and documents',
      sensitivity: 'confidential',
      validation: {
        format: 'json',
        jsonSchema: 'https://api.ogpgybank.com/schemas/account-application.json',
        constraints: ['All required fields present', 'Valid data formats']
      }
    },
    {
      name: 'documentImages',
      type: 'array',
      required: true,
      description: 'Array of captured ID document images',
      sensitivity: 'restricted',
      validation: {
        constraints: ['At least one document image required', 'Images must be valid format']
      }
    }
  ],
  outputs: [
    {
      name: 'applicationId',
      type: 'string',
      required: true,
      description: 'Unique application identifier for tracking',
      validation: {
        format: 'uuid'
      }
    },
    {
      name: 'processingStatus',
      type: 'string',
      required: true,
      description: 'Initial processing status (submitted, pending-review, approved, rejected)',
      validation: {
        constraints: ['Must be valid status value']
      }
    },
    {
      name: 'estimatedCompletionTime',
      type: 'string',
      required: false,
      description: 'Estimated time for application processing (ISO 8601 duration)'
    }
  ],
  protocol: {
    name: 'HTTP',
    version: '1.1',
    http: {
      method: 'POST',
      path: '/api/v1/accounts/applications',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {token}'
      },
      contentType: 'application/json',
      acceptType: 'application/json'
    }
  },
  security: {
    authentication: 'oauth2',
    authorization: 'rbac',
    encryptionInTransit: {
      required: true,
      protocol: 'TLS 1.3',
      cipherSuites: ['TLS_AES_256_GCM_SHA384']
    },
    encryptionAtRest: {
      required: true,
      algorithm: 'AES-256'
    },
    compliance: ['GDPR', 'PCI-DSS', 'KYC']
  },
  quality: {
    slo: {
      latency: {
        p50: '200ms',
        p95: '500ms',
        p99: '1s',
        max: '2s'
      },
      availability: {
        target: '99.9%',
        errorBudget: '43m/month'
      },
      throughput: {
        min: '100 req/sec',
        burst: '500 req/sec'
      }
    }
  },
  errorHandling: {
    errorCodes: [
      {
        code: 'INVALID_APPLICATION_DATA',
        description: 'Application data validation failed',
        severity: 'medium',
        retryable: false,
        httpStatus: 400
      },
      {
        code: 'MISSING_DOCUMENTS',
        description: 'Required documents not provided',
        severity: 'medium',
        retryable: false,
        httpStatus: 400
      },
      {
        code: 'SERVICE_UNAVAILABLE',
        description: 'Application processing service temporarily unavailable',
        severity: 'high',
        retryable: true,
        httpStatus: 503
      }
    ],
    fallback: {
      strategy: 'retry',
      maxRetries: 3,
      retryBackoff: 'exponential',
      details: 'Retry with exponential backoff: 1s, 2s, 4s'
    },
    timeoutBehavior: 'Return error after 2s timeout'
  },
  observability: {
    enabled: true,
    logLevel: 'info',
    tracing: {
      enabled: true,
      traceHeaders: ['X-Trace-Id', 'X-Span-Id'],
      spanName: 'submit-account-application',
      samplingRate: 1.0
    },
    monitoring: {
      healthCheck: {
        enabled: true,
        endpoint: '/health',
        interval: '30s'
      }
    }
  },
  backendConfig: {
    resilience: {
      circuitBreaker: {
        enabled: true,
        failureThreshold: 5,
        resetTimeout: 30000
      },
      rateLimit: {
        enabled: true,
        requestsPerSecond: 100,
        burstCapacity: 200
      },
      timeout: {
        connection: 5000,
        read: 2000,
        write: 2000
      }
    },
    caching: {
      enabled: false
    }
  },
  participants: [
    {
      stakeholder: DigitalCustomerStakeholder,
      role: 'initiator',
      required: true
    }
  ],
  tags: ['backend', 'api', 'account-opening', 'onboarding', 'critical-path']
})
export class SubmitAccountApplicationAPIInteraction {}

