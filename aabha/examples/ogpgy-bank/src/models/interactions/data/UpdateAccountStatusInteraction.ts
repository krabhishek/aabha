import { Interaction, InteractionPattern, InteractionLayer } from 'aabha';
import { AccountSystemStakeholder } from '../../stakeholders/system/AccountSystemStakeholder.js';

/**
 * Update Account Status Interaction
 * Data layer interaction for updating account status in database
 */
@Interaction({
  name: 'Update Account Status',
  description: 'Database transaction to update account status (e.g., from pending to active) and related account information',
  pattern: InteractionPattern.Command,
  layer: InteractionLayer.Data,
  inputs: [
    {
      name: 'accountId',
      type: 'string',
      required: true,
      description: 'Account identifier to update',
      validation: {
        format: 'uuid'
      }
    },
    {
      name: 'newStatus',
      type: 'string',
      required: true,
      description: 'New account status value',
      validation: {
        constraints: ['Must be valid status value']
      }
    },
    {
      name: 'statusUpdateReason',
      type: 'string',
      required: false,
      description: 'Reason for status change'
    }
  ],
  outputs: [
    {
      name: 'updateResult',
      type: 'object',
      required: true,
      description: 'Result of status update including previous and new status',
      validation: {
        format: 'json'
      }
    },
    {
      name: 'updatedTimestamp',
      type: 'string',
      required: true,
      description: 'Timestamp when status was updated (ISO 8601)',
      validation: {
        format: 'date-iso8601'
      }
    }
  ],
  dataConfig: {
    databaseType: 'sql',
    databaseImplementation: 'postgresql',
    schema: {
      tableName: 'accounts',
      primaryKey: 'account_id',
      indexes: ['account_status', 'updated_at']
    },
    transactionManagement: {
      isolationLevel: 'read-committed',
      lockingStrategy: 'optimistic',
      timeout: 3000,
      supportsRollback: true
    },
    consistency: {
      replicationStrategy: 'master-slave',
      writeAcknowledgment: 'majority'
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
        p50: '20ms',
        p95: '50ms',
        p99: '100ms',
        max: '200ms'
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
        code: 'ACCOUNT_NOT_FOUND',
        description: 'Account with specified ID not found',
        severity: 'medium',
        retryable: false
      },
      {
        code: 'INVALID_STATUS_TRANSITION',
        description: 'Status transition is not allowed',
        severity: 'medium',
        retryable: false
      }
    ],
    fallback: {
      strategy: 'fail-fast',
      details: 'Return error immediately if update cannot be performed'
    }
  },
  observability: {
    enabled: true,
    logLevel: 'info',
    tracing: {
      enabled: true,
      spanName: 'update-account-status-db',
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
  tags: ['data', 'database', 'update', 'account-status', 'critical-path']
})
export class UpdateAccountStatusInteraction {}

