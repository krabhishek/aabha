import { Interaction, InteractionPattern, InteractionLayer } from 'aabha';
import { DigitalCustomerStakeholder } from '../../stakeholders/human/DigitalCustomerStakeholder.js';

/**
 * Activate Account API Interaction
 * Backend API endpoint that activates approved account and makes it ready for use
 */
@Interaction({
  name: 'Activate Account API',
  description: 'REST API endpoint that activates an approved account, generates account credentials, and enables account for immediate use',
  pattern: InteractionPattern.RequestResponse,
  layer: InteractionLayer.Backend,
  inputs: [
    {
      name: 'applicationId',
      type: 'string',
      required: true,
      description: 'Application identifier for the approved account',
      validation: {
        format: 'uuid'
      }
    },
    {
      name: 'activationRequest',
      type: 'object',
      required: true,
      description: 'Account activation request including initial password setup',
      sensitivity: 'confidential',
      validation: {
        format: 'json'
      }
    }
  ],
  outputs: [
    {
      name: 'accountNumber',
      type: 'string',
      required: true,
      description: 'Generated account number',
      validation: {
        format: 'alphanumeric',
        constraints: ['8-12 characters']
      },
      sensitivity: 'confidential'
    },
    {
      name: 'accountStatus',
      type: 'string',
      required: true,
      description: 'Account status after activation (active, pending-setup)',
      validation: {
        constraints: ['Must be valid status value']
      }
    },
    {
      name: 'activationTimestamp',
      type: 'string',
      required: true,
      description: 'Timestamp when account was activated (ISO 8601)',
      validation: {
        format: 'date-iso8601'
      }
    }
  ],
  protocol: {
    name: 'HTTP',
    version: '1.1',
    http: {
      method: 'POST',
      path: '/api/v1/accounts/activate',
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
      protocol: 'TLS 1.3'
    },
    encryptionAtRest: {
      required: true,
      algorithm: 'AES-256'
    },
    compliance: ['GDPR', 'PCI-DSS']
  },
  quality: {
    slo: {
      latency: {
        p50: '100ms',
        p95: '500ms',
        p99: '1s',
        max: '2s'
      },
      availability: {
        target: '99.99%',
        errorBudget: '4.3m/month'
      },
      throughput: {
        min: '200 req/sec',
        burst: '1000 req/sec'
      }
    }
  },
  errorHandling: {
    errorCodes: [
      {
        code: 'ACCOUNT_ALREADY_ACTIVATED',
        description: 'Account has already been activated',
        severity: 'low',
        retryable: false,
        httpStatus: 409
      },
      {
        code: 'ACTIVATION_FAILED',
        description: 'Account activation process failed',
        severity: 'high',
        retryable: true,
        httpStatus: 500
      }
    ],
    fallback: {
      strategy: 'retry',
      maxRetries: 3,
      retryBackoff: 'exponential'
    },
    timeoutBehavior: 'Return error and log for manual intervention'
  },
  observability: {
    enabled: true,
    logLevel: 'info',
    tracing: {
      enabled: true,
      traceHeaders: ['X-Trace-Id', 'X-Span-Id'],
      spanName: 'activate-account-api',
      samplingRate: 1.0
    }
  },
  backendConfig: {
    resilience: {
      circuitBreaker: {
        enabled: true,
        failureThreshold: 5,
        resetTimeout: 30000
      },
      timeout: {
        connection: 5000,
        read: 2000,
        write: 2000
      }
    }
  },
  participants: [
    {
      stakeholder: DigitalCustomerStakeholder,
      role: 'initiator',
      required: true
    }
  ],
  tags: ['backend', 'api', 'account-activation', 'onboarding', 'critical-path']
})
export class ActivateAccountAPIInteraction {}

