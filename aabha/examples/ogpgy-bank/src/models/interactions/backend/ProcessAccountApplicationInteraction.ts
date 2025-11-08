import { Interaction, InteractionPattern, InteractionLayer } from 'aabha';
import { ComplianceOfficerStakeholder } from '../../stakeholders/human/ComplianceOfficerStakeholder.js';
import { AccountSystemStakeholder } from '../../stakeholders/system/AccountSystemStakeholder.js';

/**
 * Process Account Application Interaction
 * Backend workflow interaction that orchestrates account application processing including KYC, compliance checks, and approval
 */
@Interaction({
  name: 'Process Account Application',
  description: 'Backend workflow that processes account application by orchestrating KYC verification, compliance checks, risk assessment, and approval decision',
  pattern: InteractionPattern.Workflow,
  layer: InteractionLayer.Orchestration,
  inputs: [
    {
      name: 'applicationId',
      type: 'string',
      required: true,
      description: 'Unique application identifier',
      validation: {
        format: 'uuid'
      }
    },
    {
      name: 'applicationData',
      type: 'object',
      required: true,
      description: 'Application data for processing',
      sensitivity: 'confidential'
    }
  ],
  outputs: [
    {
      name: 'processingResult',
      type: 'object',
      required: true,
      description: 'Final processing result including approval status and decision reason',
      validation: {
        format: 'json'
      }
    },
    {
      name: 'approvalStatus',
      type: 'string',
      required: true,
      description: 'Final approval status (approved, rejected, pending-manual-review)',
      validation: {
        constraints: ['Must be one of: approved, rejected, pending-manual-review']
      }
    },
    {
      name: 'accountNumber',
      type: 'string',
      required: false,
      description: 'Generated account number if approved',
      validation: {
        format: 'alphanumeric',
        constraints: ['8-12 characters']
      },
      sensitivity: 'confidential'
    }
  ],
  preconditions: [
    'Application must be in submitted status',
    'All required documents must be present',
    'Application data must be valid'
  ],
  postconditions: [
    'Application status updated to final state',
    'Account created if approved',
    'Notification sent to customer'
  ],
  quality: {
    slo: {
      latency: {
        p50: '30s',
        p95: '2m',
        p99: '3m',
        max: '5m'
      },
      availability: {
        target: '99.9%',
        errorBudget: '43m/month'
      },
      deliveryGuarantee: 'at-least-once'
    }
  },
  errorHandling: {
    errorCodes: [
      {
        code: 'KYC_VERIFICATION_FAILED',
        description: 'KYC verification service returned rejection',
        severity: 'high',
        retryable: false
      },
      {
        code: 'COMPLIANCE_CHECK_FAILED',
        description: 'Automated compliance check failed, requires manual review',
        severity: 'medium',
        retryable: false
      },
      {
        code: 'WORKFLOW_TIMEOUT',
        description: 'Workflow processing exceeded maximum time',
        severity: 'high',
        retryable: true
      }
    ],
    fallback: {
      strategy: 'degrade-gracefully',
      details: 'Route to manual review if automated processing fails'
    },
    timeoutBehavior: 'Escalate to manual review process'
  },
  observability: {
    enabled: true,
    logLevel: 'info',
    tracing: {
      enabled: true,
      spanName: 'process-account-application-workflow',
      samplingRate: 1.0
    },
    monitoring: {
      alerts: [
        {
          condition: 'workflow_failure_rate > 5%',
          severity: 'high',
          channel: 'slack'
        }
      ]
    }
  },
  participants: [
    {
      stakeholder: ComplianceOfficerStakeholder,
      role: 'reviewer',
      required: false
    },
    {
      stakeholder: AccountSystemStakeholder,
      role: 'orchestrator',
      required: true
    }
  ],
  tags: ['backend', 'workflow', 'orchestration', 'account-opening', 'critical-path']
})
export class ProcessAccountApplicationInteraction {}

