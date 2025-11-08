import { Interaction, InteractionPattern, InteractionLayer } from 'aabha';
import { AccountSystemStakeholder } from '../../stakeholders/system/AccountSystemStakeholder.js';

/**
 * Store Account Application Interaction
 * Data layer interaction for persisting account application to database
 */
@Interaction({
  name: 'Store Account Application',
  description: 'Database transaction to store account application data including personal information, documents, and application status',
  pattern: InteractionPattern.Transaction,
  layer: InteractionLayer.Data,
  inputs: [
    {
      name: 'applicationData',
      type: 'object',
      required: true,
      description: 'Complete application data to be stored',
      sensitivity: 'confidential',
      validation: {
        format: 'json'
      }
    },
    {
      name: 'documentReferences',
      type: 'array',
      required: true,
      description: 'References to stored document images',
      sensitivity: 'restricted'
    },
    {
      name: 'applicationStatus',
      type: 'string',
      required: true,
      description: 'Initial application status',
      validation: {
        constraints: ['Must be valid status value']
      }
    }
  ],
  outputs: [
    {
      name: 'applicationId',
      type: 'string',
      required: true,
      description: 'Generated unique application identifier',
      validation: {
        format: 'uuid'
      }
    },
    {
      name: 'storageTimestamp',
      type: 'string',
      required: true,
      description: 'Timestamp when application was stored (ISO 8601)',
      validation: {
        format: 'date-iso8601'
      }
    },
    {
      name: 'transactionStatus',
      type: 'string',
      required: true,
      description: 'Database transaction status (committed, rolled-back)'
    }
  ],
  dataConfig: {
    databaseType: 'sql',
    databaseImplementation: 'postgresql',
    schema: {
      tableName: 'account_applications',
      primaryKey: 'application_id',
      indexes: ['customer_email', 'application_status', 'created_at'],
      foreignKeys: ['customer_id']
    },
    transactionManagement: {
      isolationLevel: 'read-committed',
      lockingStrategy: 'optimistic',
      timeout: 5000,
      supportsRollback: true
    },
    consistency: {
      replicationStrategy: 'master-slave',
      writeAcknowledgment: 'majority'
    },
    connectionPool: {
      min: 5,
      max: 50,
      timeout: 5000
    }
  },
  security: {
    authentication: 'none',
    authorization: 'rbac',
    encryptionAtRest: {
      required: true,
      algorithm: 'AES-256'
    },
    compliance: ['GDPR', 'PCI-DSS']
  },
  quality: {
    slo: {
      latency: {
        p50: '50ms',
        p95: '100ms',
        p99: '200ms',
        max: '500ms'
      },
      availability: {
        target: '99.99%',
        errorBudget: '4.3m/month'
      },
      consistency: 'strong'
    }
  },
  errorHandling: {
    errorCodes: [
      {
        code: 'DATABASE_CONNECTION_ERROR',
        description: 'Database connection failure',
        severity: 'critical',
        retryable: true,
        httpStatus: 503
      },
      {
        code: 'TRANSACTION_TIMEOUT',
        description: 'Database transaction timeout',
        severity: 'high',
        retryable: true
      },
      {
        code: 'CONSTRAINT_VIOLATION',
        description: 'Database constraint violation (duplicate, invalid data)',
        severity: 'medium',
        retryable: false
      }
    ],
    fallback: {
      strategy: 'retry',
      maxRetries: 3,
      retryBackoff: 'exponential',
      details: 'Retry database transaction with exponential backoff'
    },
    timeoutBehavior: 'Rollback transaction and return error'
  },
  observability: {
    enabled: true,
    logLevel: 'info',
    tracing: {
      enabled: true,
      spanName: 'store-account-application-db',
      samplingRate: 1.0
    }
  },
  participants: [
    {
      stakeholder: AccountSystemStakeholder,
      role: 'initiator',
      required: true
    }
  ],
  tags: ['data', 'database', 'persistence', 'transaction', 'account-opening']
})
export class StoreAccountApplicationInteraction {}

