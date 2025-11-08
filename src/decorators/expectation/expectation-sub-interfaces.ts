/**
 * Expectation Sub-Interfaces
 * Type definitions for Expectation sub-configurations
 * @module aabha/decorators/expectation
 */

import type { Constructor, WithMetric, WithStakeholder } from '../../types/index.js';

// ============================================================================
// EXPECTATION SUB-INTERFACES
// ============================================================================

/**
 * Expectation Quality Configuration
 *
 * Defines Service Level Objectives (SLOs) and Service Level Indicators (SLIs)
 * for measuring expectation fulfillment and performance.
 *
 * @example
 * ```typescript
 * quality: {
 *   slo: {
 *     latency: { p50: '500ms', p95: '2s', p99: '5s', max: '10s' },
 *     availability: { target: '99.9%', errorBudget: '43m/month' },
 *     throughput: { min: '100 req/sec', avg: '500 req/sec', burst: '1000 req/sec' },
 *     deliveryGuarantee: 'at-least-once',
 *     consistency: 'eventual'
 *   },
 *   sli: {
 *     successRate: ExpectationFulfillmentRateMetric,
 *     latency: ExpectationLatencyP95Metric,
 *     errorRate: ExpectationFailureRateMetric
 *   }
 * }
 * ```
 */
export interface ExpectationQuality {
  /**
   * Service Level Objectives (SLO)
   * Target performance goals for this expectation
   */
  slo?: {
    /**
     * Latency targets at different percentiles
     */
    latency?: {
      /** Median latency (50th percentile) */
      p50?: string;
      /** 95th percentile latency */
      p95?: string;
      /** 99th percentile latency */
      p99?: string;
      /** Maximum acceptable latency */
      max?: string;
    };

    /**
     * Availability targets and error budget
     */
    availability?: {
      /** Target availability percentage (e.g., '99.9%') */
      target: string;
      /** Allowed downtime or error budget (e.g., '43m/month') */
      errorBudget?: string;
    };

    /**
     * Throughput targets
     */
    throughput?: {
      /** Minimum throughput required */
      min?: string;
      /** Average expected throughput */
      avg?: string;
      /** Maximum burst throughput */
      burst?: string;
    };

    /**
     * Delivery guarantee for async expectations
     */
    deliveryGuarantee?: 'at-most-once' | 'at-least-once' | 'exactly-once';

    /**
     * Consistency level for data expectations
     */
    consistency?: 'strong' | 'eventual' | 'causal' | 'read-your-writes';
  };

  /**
   * Service Level Indicators (SLI)
   * Metrics that measure SLO compliance
   */
  sli?: {
    /** Metric tracking expectation success rate */
    successRate?: WithMetric<Constructor>;
    /** Metric tracking expectation latency */
    latency?: WithMetric<Constructor>;
    /** Metric tracking expectation error rate */
    errorRate?: WithMetric<Constructor>;
  };
}

/**
 * Expectation Verification Configuration
 *
 * Defines how the expectation should be verified through testing and monitoring.
 *
 * @example
 * ```typescript
 * verification: {
 *   level: ExpectationVerificationLevel.Enforced,
 *   testCoverage: {
 *     minWitnessCoverage: 80,
 *     requiredScenarios: {
 *       happyPath: true,
 *       errorScenarios: ['invalid-input', 'timeout', 'network-failure'],
 *       edgeCases: ['boundary-values', 'concurrent-access']
 *     }
 *   },
 *   acceptanceTesting: {
 *     approach: 'automated',
 *     tools: ['jest', 'playwright'],
 *     frequency: 'on-commit'
 *   }
 * }
 * ```
 */
export interface ExpectationVerification {
  /**
   * Verification level (from ExpectationVerificationLevel enum)
   * Determines enforcement strictness
   */
  level: string;

  /**
   * Test coverage requirements
   */
  testCoverage?: {
    /**
     * Minimum witness (test) coverage percentage required
     * @default 80
     */
    minWitnessCoverage?: number;

    /**
     * Required test scenarios
     */
    requiredScenarios?: {
      /** Whether happy path must be tested */
      happyPath?: boolean;
      /** List of error scenarios that must be covered */
      errorScenarios?: string[];
      /** List of edge cases that must be tested */
      edgeCases?: string[];
    };
  };

  /**
   * Acceptance testing approach
   */
  acceptanceTesting?: {
    /** Testing approach (e.g., 'automated', 'manual', 'exploratory') */
    approach?: string;
    /** Testing tools used */
    tools?: string[];
    /** Testing frequency (e.g., 'on-commit', 'daily', 'weekly') */
    frequency?: string;
  };
}

/**
 * Expectation Observability Configuration
 *
 * Defines metrics, alerting, and audit trail requirements for this expectation.
 *
 * @example
 * ```typescript
 * observability: {
 *   enabled: true,
 *   metrics: [ExpectationFulfillmentRateMetric, ExpectationSLOComplianceMetric],
 *   alerts: {
 *     onSLOBreach: {
 *       severity: 'high',
 *       notifyStakeholders: [ProductOwnerStakeholder, EngineeringLeadStakeholder],
 *       channel: 'pagerduty'
 *     },
 *     onExpectationFailure: {
 *       severity: 'critical',
 *       notifyStakeholders: [ProductOwnerStakeholder],
 *       channel: 'slack'
 *     },
 *     custom: [
 *       {
 *         condition: 'error_rate > 5%',
 *         severity: 'medium',
 *         channel: 'email'
 *       }
 *     ]
 *   },
 *   auditTrail: {
 *     enabled: true,
 *     retentionPeriod: '7y',
 *     includeDetails: ['timestamp', 'actor', 'result', 'metrics']
 *   }
 * }
 * ```
 */
export interface ExpectationObservability {
  /**
   * Whether observability is enabled for this expectation
   * @default true
   */
  enabled?: boolean;

  /**
   * Metrics tracking this expectation's performance
   */
  metrics?: WithMetric<Constructor>[];

  /**
   * Alert configuration
   */
  alerts?: {
    /**
     * Alert when SLO is breached
     */
    onSLOBreach?: {
      /** Alert severity */
      severity: 'low' | 'medium' | 'high' | 'critical';
      /** Stakeholders to notify */
      notifyStakeholders?: WithStakeholder<Constructor>[];
      /** Notification channel */
      channel?: string;
    };

    /**
     * Alert when expectation fails
     */
    onExpectationFailure?: {
      /** Alert severity */
      severity: 'low' | 'medium' | 'high' | 'critical';
      /** Stakeholders to notify */
      notifyStakeholders?: WithStakeholder<Constructor>[];
      /** Notification channel */
      channel?: string;
    };

    /**
     * Custom alert rules
     */
    custom?: Array<{
      /** Alert condition (e.g., 'error_rate > 5%') */
      condition: string;
      /** Alert severity */
      severity: 'low' | 'medium' | 'high' | 'critical';
      /** Stakeholders to notify */
      notifyStakeholders?: WithStakeholder<Constructor>[];
      /** Notification channel */
      channel?: string;
    }>;
  };

  /**
   * Audit trail configuration
   */
  auditTrail?: {
    /** Whether audit trail is enabled */
    enabled: boolean;
    /** How long to retain audit records */
    retentionPeriod?: string;
    /** Details to include in audit records */
    includeDetails?: string[];
  };
}

/**
 * Expectation Business Context Configuration
 *
 * Captures strategic importance, impact assessment, effort estimation,
 * and success measurement criteria for this expectation.
 *
 * @example
 * ```typescript
 * businessContext: {
 *   strategicImportance: 'high',
 *   impactAssessment: {
 *     revenueImpact: 'Estimated +$500K annual revenue',
 *     customerSatisfaction: 'Reduces churn by 15%',
 *     operationalEfficiency: 'Saves 10 hours/week for support team'
 *   },
 *   effortEstimation: {
 *     storyPoints: 13,
 *     developmentTime: '2-3 sprints',
 *     dependencies: ['Payment gateway integration', 'KYC system upgrade']
 *   },
 *   successMeasurement: {
 *     baseline: { value: '60%', date: '2025-01-01' },
 *     target: { value: '90%', date: '2025-06-01' },
 *     approachToMeasurement: 'Track conversion funnel completion rate'
 *   },
 *   risks: [
 *     {
 *       description: 'Third-party API rate limits',
 *       probability: 'medium',
 *       impact: 'high',
 *       mitigation: 'Implement caching and fallback mechanism'
 *     }
 *   ]
 * }
 * ```
 */
export interface ExpectationBusinessContext {
  /**
   * Strategic importance to the business
   */
  strategicImportance?: 'low' | 'medium' | 'high' | 'critical';

  /**
   * Impact assessment
   */
  impactAssessment?: {
    /** Expected revenue impact */
    revenueImpact?: string;
    /** Expected customer satisfaction impact */
    customerSatisfaction?: string;
    /** Expected operational efficiency impact */
    operationalEfficiency?: string;
    /** Other business impacts */
    other?: string[];
  };

  /**
   * Effort estimation
   */
  effortEstimation?: {
    /** Story points or complexity estimate */
    storyPoints?: number;
    /** Estimated development time */
    developmentTime?: string;
    /** Key dependencies */
    dependencies?: string[];
  };

  /**
   * Success measurement criteria
   */
  successMeasurement?: {
    /** Baseline measurement before implementation */
    baseline?: {
      value: string;
      date?: string;
    };
    /** Target measurement after implementation */
    target?: {
      value: string;
      date?: string;
    };
    /** How success will be measured */
    approachToMeasurement?: string;
  };

  /**
   * Identified risks
   */
  risks?: Array<{
    /** Risk description */
    description: string;
    /** Probability of occurrence */
    probability?: 'low' | 'medium' | 'high';
    /** Impact if occurs */
    impact?: 'low' | 'medium' | 'high';
    /** Mitigation strategy */
    mitigation?: string;
  }>;
}
