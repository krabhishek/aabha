import { Interaction, InteractionPattern, InteractionLayer } from 'aabha';
import { AccountSystemStakeholder } from '../../stakeholders/system/AccountSystemStakeholder.js';

/**
 * Query Account Application Interaction
 * Data layer interaction for retrieving account application data from database
 */
@Interaction({
  name: 'Query Account Application',
  description: 'Database query to retrieve account application data by application ID or customer email for status checking and processing',
  pattern: InteractionPattern.Query,
  layer: InteractionLayer.Data,
  inputs: [
    {
      name: 'applicationId',
      type: 'string',
      required: false,
      description: 'Application identifier for lookup',
      validation: {
        format: 'uuid'
      }
    },
    {
      name: 'customerEmail',
      type: 'string',
      required: false,
      description: 'Customer email for lookup',
      validation: {
        format: 'email'
      },
      sensitivity: 'confidential'
    }
  ],
  outputs: [
    {
      name: 'applicationData',
      type: 'object',
      required: true,
      description: 'Retrieved application data including status and all application fields',
      sensitivity: 'confidential',
      validation: {
        format: 'json'
      }
    },
    {
      name: 'applicationStatus',
      type: 'string',
      required: true,
      description: 'Current application status'
    },
    {
      name: 'found',
      type: 'boolean',
      required: true,
      description: 'Whether application was found'
    }
  ],
  dataConfig: {
    databaseType: 'sql',
    databaseImplementation: 'postgresql',
    schema: {
      tableName: 'account_applications',
      primaryKey: 'application_id',
      indexes: ['customer_email', 'application_status']
    },
    queryOptimization: {
      useIndexes: true,
      estimatedRowsReturned: 1,
      explainPlanAvailable: true
    },
    consistency: {
      replicationStrategy: 'master-slave',
      readPreference: 'primary'
    }
  },
  security: {
    authentication: 'none',
    authorization: 'rbac',
    encryptionAtRest: {
      required: true,
      algorithm: 'AES-256'
    },
    compliance: ['GDPR']
  },
  quality: {
    slo: {
      latency: {
        p50: '10ms',
        p95: '30ms',
        p99: '50ms',
        max: '100ms'
      },
      availability: {
        target: '99.99%',
        errorBudget: '4.3m/month'
      }
    }
  },
  errorHandling: {
    errorCodes: [
      {
        code: 'QUERY_TIMEOUT',
        description: 'Database query exceeded timeout',
        severity: 'medium',
        retryable: true
      }
    ],
    fallback: {
      strategy: 'retry',
      maxRetries: 2
    }
  },
  observability: {
    enabled: true,
    logLevel: 'debug',
    tracing: {
      enabled: true,
      spanName: 'query-account-application-db',
      samplingRate: 0.1
    }
  },
  participants: [
    {
      stakeholder: AccountSystemStakeholder,
      role: 'initiator',
      required: true
    }
  ],
  tags: ['data', 'database', 'query', 'read', 'account-opening']
})
export class QueryAccountApplicationInteraction {}

