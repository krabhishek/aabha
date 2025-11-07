/**
 * @Interaction Decorator
 * Marks a class as an Interaction (technical contract for how stakeholders exchange data)
 * @module aabha/decorators/interaction
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 *
 * The Interaction decorator replaces the inline `exchange` field in Expectations,
 * providing reusable, type-safe interaction patterns across all architectural layers:
 * - Frontend (UI/UX)
 * - Backend (APIs/Services)
 * - Data (Database/Storage)
 * - Device (Hardware/Sensors)
 * - External (Third-party services)
 * - Orchestration (Workflows)
 */

import type {
  Constructor,
  WithInteraction,
  WithStakeholder,
  WithMetric,
  WithPersona,
  BaseDecoratorOptions,
} from '../../types/index.js';
import { applyBrand } from '../../internal/brand.utils.js';
import { InteractionPattern } from '../../enums/interaction-pattern.enum.js';
import { InteractionLayer } from '../../enums/interaction-layer.enum.js';

// ============================================================================
// CORE SUB-INTERFACES
// ============================================================================

/**
 * Interaction Data Item
 *
 * Represents a single input or output in an interaction's data contract.
 * Provides validation rules, sensitivity classification, and type references.
 *
 * @example Simple string input
 * ```typescript
 * {
 *   name: 'customerEmail',
 *   type: 'string',
 *   required: true,
 *   validation: {
 *     format: 'email',
 *     constraints: ['Valid email format per RFC 5322']
 *   },
 *   sensitivity: 'confidential'
 * }
 * ```
 *
 * @example Constructor type reference
 * ```typescript
 * {
 *   name: 'governmentID',
 *   type: GovernmentIDDocument,  // Constructor reference
 *   required: true,
 *   sensitivity: 'restricted'
 * }
 * ```
 */
export interface InteractionData {
  /**
   * Data field name
   */
  name: string;

  /**
   * Data type
   * Can be:
   * - String description (e.g., 'string', 'number', 'boolean')
   * - Constructor reference (e.g., GovernmentIDDocument class)
   */
  type: string | Constructor;

  /**
   * Whether this field is required
   * @default false
   */
  required?: boolean;

  /**
   * Validation rules for this data
   */
  validation?: {
    /**
     * Data format specification
     * @example 'email', 'uuid', 'date-iso8601', 'phone-e164'
     */
    format?: string;

    /**
     * Validation constraints
     * @example ['Length: 8-100 characters', 'Must contain uppercase and lowercase']
     */
    constraints?: string[];

    /**
     * JSON schema reference (URL or inline)
     * @example 'https://api.example.com/schemas/customer.json'
     */
    jsonSchema?: string;

    /**
     * Regular expression pattern
     * @example '^[A-Z]{2}[0-9]{6}$'
     */
    pattern?: string;

    /**
     * Min/max values for numeric types
     */
    range?: {
      min?: number;
      max?: number;
    };
  };

  /**
   * Data sensitivity level for compliance
   *
   * - **public**: No sensitivity, can be logged/shared freely
   * - **internal**: Internal use only, not for external sharing
   * - **confidential**: Sensitive data requiring encryption
   * - **restricted**: Highly sensitive (PII, PCI, PHI) requiring strict controls
   */
  sensitivity?: 'public' | 'internal' | 'confidential' | 'restricted';

  /**
   * Description of this data field
   */
  description?: string;
}

/**
 * Interaction Quality Configuration
 *
 * Defines Service Level Objectives (SLOs) and Service Level Indicators (SLIs)
 * for measuring interaction performance and reliability.
 *
 * @example
 * ```typescript
 * quality: {
 *   slo: {
 *     latency: { p50: '100ms', p95: '500ms', p99: '1s', max: '5s' },
 *     availability: { target: '99.9%', errorBudget: '43m/month' },
 *     throughput: { min: '1000 req/sec', burst: '5000 req/sec' },
 *     deliveryGuarantee: 'exactly-once',
 *     consistency: 'strong'
 *   },
 *   sli: {
 *     successRate: APISuccessRateMetric,
 *     latency: APILatencyP95Metric,
 *     errorRate: APIErrorRateMetric
 *   }
 * }
 * ```
 */
export interface InteractionQuality {
  /**
   * Service Level Objectives
   * Target performance and reliability goals
   */
  slo?: {
    /**
     * Latency targets
     * Measured at different percentiles for comprehensive understanding
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
     * Availability targets
     */
    availability?: {
      /** Target availability percentage (e.g., '99.9%') */
      target: string;
      /**
       * Error budget (allowed downtime)
       * @example '43m/month' for 99.9% availability
       */
      errorBudget?: string;
    };

    /**
     * Throughput targets
     */
    throughput?: {
      /** Minimum throughput */
      min?: string;
      /** Average throughput */
      avg?: string;
      /** Maximum burst throughput */
      burst?: string;
    };

    /**
     * Delivery guarantee for message/event interactions
     *
     * - **at-most-once**: May lose messages (fire-and-forget)
     * - **at-least-once**: May duplicate messages
     * - **exactly-once**: Guaranteed single delivery (most expensive)
     */
    deliveryGuarantee?: 'at-most-once' | 'at-least-once' | 'exactly-once';

    /**
     * Consistency level for data interactions
     *
     * - **strong**: Read always returns latest write (highest consistency, may impact availability)
     * - **eventual**: Reads may return stale data temporarily
     * - **causal**: Reads respect causal ordering of writes
     * - **read-your-writes**: Client always reads its own writes
     */
    consistency?: 'strong' | 'eventual' | 'causal' | 'read-your-writes';
  };

  /**
   * Service Level Indicators
   * Metrics that measure whether SLOs are being met
   * COMPILE-TIME TYPE SAFETY: Must be @Metric decorated classes
   */
  sli?: {
    /** Metric tracking success rate */
    successRate?: WithMetric<Constructor>;
    /** Metric tracking latency */
    latency?: WithMetric<Constructor>;
    /** Metric tracking error rate */
    errorRate?: WithMetric<Constructor>;
  };
}

/**
 * Interaction Security Configuration
 *
 * Defines authentication, authorization, encryption, and compliance requirements.
 *
 * @example
 * ```typescript
 * security: {
 *   authentication: 'oauth2',
 *   authorization: 'rbac',
 *   encryptionInTransit: {
 *     required: true,
 *     protocol: 'TLS 1.3',
 *     cipherSuites: ['TLS_AES_256_GCM_SHA384']
 *   },
 *   encryptionAtRest: {
 *     required: true,
 *     algorithm: 'AES-256'
 *   },
 *   compliance: ['GDPR', 'PCI-DSS', 'SOX']
 * }
 * ```
 */
export interface InteractionSecurity {
  /**
   * Authentication method
   *
   * - **none**: No authentication (public endpoint)
   * - **api-key**: API key in header/query
   * - **oauth2**: OAuth 2.0 token
   * - **jwt**: JSON Web Token
   * - **mtls**: Mutual TLS (client certificates)
   * - **saml**: SAML 2.0 assertion
   */
  authentication?: 'none' | 'api-key' | 'oauth2' | 'jwt' | 'mtls' | 'saml' | string;

  /**
   * Authorization model
   *
   * - **none**: No authorization checks
   * - **rbac**: Role-Based Access Control
   * - **abac**: Attribute-Based Access Control
   * - **acl**: Access Control List
   */
  authorization?: 'none' | 'rbac' | 'abac' | 'acl' | string;

  /**
   * Encryption in transit (data moving over network)
   */
  encryptionInTransit?: {
    /** Whether encryption is required */
    required: boolean;
    /** TLS/SSL protocol version */
    protocol?: 'TLS 1.2' | 'TLS 1.3' | string;
    /** Allowed cipher suites */
    cipherSuites?: string[];
  };

  /**
   * Encryption at rest (data stored in databases/files)
   */
  encryptionAtRest?: {
    /** Whether encryption is required */
    required: boolean;
    /** Encryption algorithm */
    algorithm?: 'AES-256' | 'AES-128' | string;
    /** Key management service */
    keyManagement?: string;
  };

  /**
   * Compliance standards this interaction must satisfy
   * @example ['PCI-DSS', 'GDPR', 'HIPAA', 'SOX', 'ISO-27001']
   */
  compliance?: string[];

  /**
   * Additional security notes or requirements
   */
  securityNotes?: string[];
}

/**
 * Interaction Protocol Configuration
 *
 * Defines technical protocol details for backend interactions.
 *
 * @example HTTP
 * ```typescript
 * protocol: {
 *   name: 'HTTP',
 *   version: '1.1',
 *   http: {
 *     method: 'POST',
 *     path: '/api/v1/accounts',
 *     headers: { 'Content-Type': 'application/json' },
 *     queryParams: ['filter', 'sort']
 *   }
 * }
 * ```
 *
 * @example gRPC
 * ```typescript
 * protocol: {
 *   name: 'gRPC',
 *   version: '1.0',
 *   grpc: {
 *     service: 'AccountService',
 *     method: 'CreateAccount',
 *     protoFile: 'account.proto'
 *   }
 * }
 * ```
 */
export interface InteractionProtocol {
  /**
   * Protocol name
   */
  name: 'HTTP' | 'gRPC' | 'AMQP' | 'MQTT' | 'WebSocket' | 'GraphQL' | 'custom' | string;

  /**
   * Protocol version
   */
  version?: string;

  /**
   * HTTP-specific configuration
   */
  http?: {
    /** HTTP method */
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
    /** URL path (can include path parameters) */
    path?: string;
    /** Required headers */
    headers?: Record<string, string>;
    /** Query parameters */
    queryParams?: string[];
    /** Request body content type */
    contentType?: string;
    /** Response content type */
    acceptType?: string;
  };

  /**
   * gRPC-specific configuration
   */
  grpc?: {
    /** Service name */
    service?: string;
    /** Method name */
    method?: string;
    /** Proto file reference */
    protoFile?: string;
    /** Package name */
    package?: string;
  };

  /**
   * Message queue-specific configuration
   */
  messageQueue?: {
    /** Exchange name */
    exchange?: string;
    /** Routing key */
    routingKey?: string;
    /** Queue name */
    queue?: string;
    /** Message TTL */
    ttl?: number;
  };

  /**
   * WebSocket-specific configuration
   */
  websocket?: {
    /** WebSocket path */
    path?: string;
    /** Subprotocol */
    subprotocol?: string;
  };

  /**
   * GraphQL-specific configuration
   */
  graphql?: {
    /** Operation type */
    operationType?: 'query' | 'mutation' | 'subscription';
    /** Operation name */
    operationName?: string;
  };
}

/**
 * Interaction Error Handling Configuration
 *
 * Defines error codes, fallback strategies, and timeout behavior.
 *
 * @example
 * ```typescript
 * errorHandling: {
 *   errorCodes: [
 *     {
 *       code: 'INVALID_EMAIL',
 *       description: 'Email format invalid',
 *       severity: 'medium',
 *       retryable: false
 *     },
 *     {
 *       code: 'SERVICE_TIMEOUT',
 *       description: 'External service timeout',
 *       severity: 'high',
 *       retryable: true
 *     }
 *   ],
 *   fallback: {
 *     strategy: 'retry',
 *     details: 'Retry up to 3 times with exponential backoff (1s, 2s, 4s)'
 *   },
 *   timeoutBehavior: 'Return cached data if available, otherwise return error'
 * }
 * ```
 */
export interface InteractionErrorHandling {
  /**
   * Defined error codes for this interaction
   */
  errorCodes?: Array<{
    /** Error code identifier */
    code: string;
    /** Human-readable description */
    description: string;
    /** Error severity */
    severity: 'low' | 'medium' | 'high' | 'critical';
    /** Whether the operation can be retried */
    retryable: boolean;
    /** HTTP status code (if applicable) */
    httpStatus?: number;
  }>;

  /**
   * Fallback strategy when interaction fails
   */
  fallback?: {
    /** Fallback strategy type */
    strategy: 'retry' | 'compensate' | 'fail-fast' | 'degrade-gracefully' | 'circuit-breaker' | string;
    /** Details of the fallback approach */
    details?: string;
    /** Maximum retry attempts (if strategy is 'retry') */
    maxRetries?: number;
    /** Retry backoff strategy (if strategy is 'retry') */
    retryBackoff?: 'linear' | 'exponential' | 'jitter';
  };

  /**
   * Behavior when timeout occurs
   */
  timeoutBehavior?: string;

  /**
   * Dead letter queue configuration (for message-based interactions)
   */
  deadLetterQueue?: {
    /** Whether to use DLQ */
    enabled: boolean;
    /** DLQ name */
    queueName?: string;
    /** Max retry count before sending to DLQ */
    maxRetries?: number;
  };
}

/**
 * Interaction Versioning Configuration
 *
 * Manages API versions, compatibility, and deprecation.
 *
 * @example
 * ```typescript
 * versioning: {
 *   version: '2.0.0',
 *   backwardCompatible: ['1.5.0', '1.4.0'],
 *   deprecated: [
 *     {
 *       version: '1.0.0',
 *       deprecationDate: '2025-01-01',
 *       removalDate: '2025-06-01'
 *     }
 *   ],
 *   breakingChanges: [
 *     {
 *       version: '2.0.0',
 *       description: 'Changed authentication from API key to OAuth 2.0',
 *       migrationGuide: 'https://docs.example.com/migration-v2'
 *     }
 *   ]
 * }
 * ```
 */
export interface InteractionVersioning {
  /**
   * Current version (semantic versioning recommended)
   * @example '1.2.3', '2.0.0-beta.1'
   */
  version: string;

  /**
   * Versions with which this version is backward compatible
   * @example ['1.5.0', '1.4.0']
   */
  backwardCompatible?: string[];

  /**
   * Deprecated versions
   */
  deprecated?: Array<{
    /** Deprecated version */
    version: string;
    /** Date when deprecated */
    deprecationDate: string;
    /** Date when removed (if planned) */
    removalDate?: string;
    /** Reason for deprecation */
    reason?: string;
  }>;

  /**
   * Breaking changes introduced in this or previous versions
   */
  breakingChanges?: Array<{
    /** Version that introduced the breaking change */
    version: string;
    /** Description of the breaking change */
    description: string;
    /** Migration guide URL or instructions */
    migrationGuide?: string;
  }>;

  /**
   * Version negotiation strategy
   */
  negotiation?: {
    /** How version is specified */
    method?: 'url' | 'header' | 'query-param' | 'content-negotiation';
    /** Header name (if method is 'header') */
    headerName?: string;
  };
}

/**
 * Interaction Observability Configuration
 *
 * Defines monitoring, logging, tracing, and alerting for the interaction.
 *
 * @example
 * ```typescript
 * observability: {
 *   enabled: true,
 *   metrics: [InteractionLatencyMetric, InteractionSuccessRateMetric],
 *   logLevel: 'info',
 *   tracing: {
 *     enabled: true,
 *     traceHeaders: ['X-Trace-Id', 'X-Span-Id'],
 *     spanName: 'account-opening-api-call'
 *   },
 *   monitoring: {
 *     healthCheck: {
 *       enabled: true,
 *       endpoint: '/health',
 *       interval: '30s'
 *     },
 *     alerts: [
 *       {
 *         condition: 'error_rate > 5%',
 *         severity: 'high',
 *         notifyStakeholders: [OpsTeamStakeholder]
 *       }
 *     ]
 *   }
 * }
 * ```
 */
export interface InteractionObservability {
  /**
   * Whether observability is enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * Metrics to track for this interaction
   * COMPILE-TIME TYPE SAFETY: Must be @Metric decorated classes
   */
  metrics?: WithMetric<Constructor>[];

  /**
   * Logging level
   */
  logLevel?: 'error' | 'warn' | 'info' | 'debug' | 'trace';

  /**
   * Distributed tracing configuration
   */
  tracing?: {
    /** Whether tracing is enabled */
    enabled: boolean;
    /** Trace context propagation headers */
    traceHeaders?: string[];
    /** Span name for this interaction */
    spanName?: string;
    /** Sampling rate (0.0 to 1.0) */
    samplingRate?: number;
  };

  /**
   * Monitoring and health check configuration
   */
  monitoring?: {
    /** Health check endpoint configuration */
    healthCheck?: {
      /** Whether health check is enabled */
      enabled: boolean;
      /** Health check endpoint path */
      endpoint?: string;
      /** Health check interval */
      interval?: string;
    };

    /** Alert configuration */
    alerts?: Array<{
      /** Alert condition */
      condition: string;
      /** Alert severity */
      severity: 'low' | 'medium' | 'high' | 'critical';
      /** Stakeholders to notify */
      notifyStakeholders?: WithStakeholder<Constructor>[];
      /** Notification channel */
      channel?: 'email' | 'slack' | 'pagerduty' | 'webhook' | string;
    }>;
  };

  /**
   * Custom observability configuration
   */
  custom?: Record<string, unknown>;
}

// ============================================================================
// LAYER-SPECIFIC CONFIGURATION SUB-INTERFACES
// ============================================================================

/**
 * Frontend Interaction Configuration
 *
 * Configuration specific to frontend/UI interactions.
 * Only applicable when layer is InteractionLayer.Frontend.
 *
 * @example
 * ```typescript
 * frontendConfig: {
 *   framework: 'react-native',
 *   gestureTypes: ['tap', 'swipe', 'pinch'],
 *   formValidation: {
 *     validationRules: ['email-format', 'required-fields'],
 *     validationTiming: 'on-blur'
 *   },
 *   accessibility: {
 *     ariaLabels: { submit: 'Submit account opening form' },
 *     keyboardNavigation: true,
 *     screenReaderSupport: true
 *   },
 *   responsive: {
 *     breakpoints: ['mobile', 'tablet', 'desktop'],
 *     adaptiveLayouts: true
 *   }
 * }
 * ```
 */
export interface FrontendInteractionConfig {
  /**
   * UI framework/library
   */
  framework?: 'react' | 'react-native' | 'flutter' | 'vue' | 'angular' | 'svelte' | string;

  /**
   * Component lifecycle events
   */
  lifecycle?: {
    /** Events triggered on component mount */
    mountEvents?: string[];
    /** Events triggered on component unmount */
    unmountEvents?: string[];
    /** State update triggers */
    stateUpdateTriggers?: string[];
  };

  /**
   * User gesture types (for UserGesture pattern)
   */
  gestureTypes?: Array<'tap' | 'swipe' | 'pinch' | 'drag' | 'long-press' | 'double-tap' | string>;

  /**
   * Form validation configuration (for FormInteraction pattern)
   */
  formValidation?: {
    /** Validation rules */
    validationRules?: string[];
    /** When to trigger validation */
    validationTiming?: 'on-blur' | 'on-change' | 'on-submit' | 'real-time';
    /** Client-side vs server-side validation */
    validationType?: 'client' | 'server' | 'both';
  };

  /**
   * Navigation configuration (for Navigation pattern)
   */
  navigationDetails?: {
    /** Transition type */
    transitionType?: 'push' | 'modal' | 'replace' | 'back' | 'pop' | string;
    /** Deep link pattern */
    deepLinkPattern?: string;
    /** Animation details */
    animation?: {
      type?: 'slide' | 'fade' | 'scale' | 'none' | string;
      duration?: number;
    };
  };

  /**
   * Accessibility configuration
   */
  accessibility?: {
    /** ARIA labels for screen readers */
    ariaLabels?: Record<string, string>;
    /** Keyboard navigation support */
    keyboardNavigation?: boolean;
    /** Screen reader support */
    screenReaderSupport?: boolean;
    /** Focus management */
    focusManagement?: string;
  };

  /**
   * Responsive design configuration
   */
  responsive?: {
    /** Breakpoints */
    breakpoints?: string[];
    /** Whether layouts adapt to screen size */
    adaptiveLayouts?: boolean;
    /** Mobile-first approach */
    mobileFirst?: boolean;
  };

  /**
   * UI state management
   */
  stateManagement?: {
    /** State management approach */
    approach?: 'local' | 'redux' | 'mobx' | 'context' | 'zustand' | string;
    /** State persistence */
    persistence?: 'none' | 'local-storage' | 'session-storage' | string;
  };
}

/**
 * Backend Interaction Configuration
 *
 * Configuration specific to backend service interactions.
 * Only applicable when layer is InteractionLayer.Backend or InteractionLayer.External.
 *
 * @example
 * ```typescript
 * backendConfig: {
 *   serviceMesh: {
 *     enabled: true,
 *     implementation: 'istio'
 *   },
 *   resilience: {
 *     circuitBreaker: {
 *       enabled: true,
 *       failureThreshold: 5,
 *       resetTimeout: 30000
 *     },
 *     rateLimit: {
 *       enabled: true,
 *       requestsPerSecond: 100
 *     }
 *   },
 *   caching: {
 *     enabled: true,
 *     strategy: 'cache-aside',
 *     ttl: 300
 *   }
 * }
 * ```
 */
export interface BackendInteractionConfig {
  /**
   * Service mesh configuration
   */
  serviceMesh?: {
    /** Whether service mesh is enabled */
    enabled: boolean;
    /** Service mesh implementation */
    implementation?: 'istio' | 'linkerd' | 'consul' | string;
  };

  /**
   * Load balancing configuration
   */
  loadBalancing?: {
    /** Load balancing strategy */
    strategy?: 'round-robin' | 'least-connections' | 'weighted' | 'hash' | 'ip-hash' | string;
    /** Sticky sessions (session affinity) */
    stickySession?: boolean;
  };

  /**
   * Resilience patterns
   */
  resilience?: {
    /** Circuit breaker pattern */
    circuitBreaker?: {
      enabled: boolean;
      /** Failure threshold before opening circuit */
      failureThreshold?: number;
      /** Timeout before attempting reset (ms) */
      resetTimeout?: number;
      /** Half-open state request count */
      halfOpenRequests?: number;
    };

    /** Bulkhead pattern (isolate resources) */
    bulkhead?: {
      enabled: boolean;
      /** Max concurrent calls */
      maxConcurrentCalls?: number;
      /** Max queued calls */
      maxQueuedCalls?: number;
    };

    /** Rate limiting */
    rateLimit?: {
      enabled: boolean;
      /** Requests per second */
      requestsPerSecond?: number;
      /** Burst capacity */
      burstCapacity?: number;
    };

    /** Timeout configuration */
    timeout?: {
      /** Connection timeout (ms) */
      connection?: number;
      /** Read timeout (ms) */
      read?: number;
      /** Write timeout (ms) */
      write?: number;
    };
  };

  /**
   * Caching configuration
   */
  caching?: {
    /** Whether caching is enabled */
    enabled: boolean;
    /** Caching strategy */
    strategy?: 'cache-aside' | 'read-through' | 'write-through' | 'write-behind' | 'refresh-ahead';
    /** Time to live (seconds) */
    ttl?: number;
    /** Cache invalidation policy */
    invalidationPolicy?: string;
    /** Cache key pattern */
    keyPattern?: string;
  };

  /**
   * Distributed tracing configuration
   */
  tracing?: {
    /** Whether tracing is enabled */
    enabled: boolean;
    /** Tracing implementation */
    implementation?: 'opentelemetry' | 'jaeger' | 'zipkin' | 'datadog' | string;
    /** Sampling rate (0.0 to 1.0) */
    samplingRate?: number;
  };

  /**
   * API gateway configuration
   */
  apiGateway?: {
    /** Gateway implementation */
    implementation?: 'kong' | 'apigee' | 'aws-api-gateway' | string;
    /** Gateway endpoint */
    endpoint?: string;
  };
}

/**
 * Data Interaction Configuration
 *
 * Configuration specific to data layer interactions.
 * Only applicable when layer is InteractionLayer.Data.
 *
 * @example
 * ```typescript
 * dataConfig: {
 *   databaseType: 'sql',
 *   schema: {
 *     tableName: 'accounts',
 *     primaryKey: 'account_id',
 *     indexes: ['customer_email', 'account_number']
 *   },
 *   transactionManagement: {
 *     isolationLevel: 'read-committed',
 *     lockingStrategy: 'optimistic',
 *     timeout: 5000
 *   },
 *   consistency: {
 *     replicationStrategy: 'master-slave',
 *     writeAcknowledgment: 'majority'
 *   }
 * }
 * ```
 */
export interface DataInteractionConfig {
  /**
   * Database type
   */
  databaseType?: 'sql' | 'nosql' | 'graph' | 'timeseries' | 'cache' | 'search-engine' | string;

  /**
   * Specific database implementation
   */
  databaseImplementation?: 'postgresql' | 'mysql' | 'mongodb' | 'redis' | 'elasticsearch' | 'dynamodb' | string;

  /**
   * Query optimization hints
   */
  queryOptimization?: {
    /** Whether to use indexes */
    useIndexes?: boolean;
    /** Estimated rows returned */
    estimatedRowsReturned?: number;
    /** Whether explain plan is available */
    explainPlanAvailable?: boolean;
    /** Query hints */
    hints?: string[];
  };

  /**
   * Transaction management (for Transaction pattern)
   */
  transactionManagement?: {
    /**
     * Transaction isolation level
     *
     * - **read-uncommitted**: Lowest isolation, allows dirty reads
     * - **read-committed**: Prevents dirty reads
     * - **repeatable-read**: Prevents non-repeatable reads
     * - **serializable**: Highest isolation, fully serializes transactions
     */
    isolationLevel?: 'read-uncommitted' | 'read-committed' | 'repeatable-read' | 'serializable';

    /**
     * Locking strategy
     *
     * - **optimistic**: Assumes low conflict, checks at commit
     * - **pessimistic**: Locks resources during transaction
     */
    lockingStrategy?: 'optimistic' | 'pessimistic';

    /** Transaction timeout (ms) */
    timeout?: number;

    /** Whether transaction supports rollback */
    supportsRollback?: boolean;
  };

  /**
   * Data schema details
   */
  schema?: {
    /** Table/collection name */
    tableName?: string;
    /** Primary key field */
    primaryKey?: string;
    /** Foreign key fields */
    foreignKeys?: string[];
    /** Index fields */
    indexes?: string[];
    /** Partitioning strategy */
    partitioning?: string;
  };

  /**
   * Consistency and replication
   */
  consistency?: {
    /** Replication strategy */
    replicationStrategy?: 'master-slave' | 'multi-master' | 'quorum' | string;
    /** Write acknowledgment level */
    writeAcknowledgment?: 'one' | 'majority' | 'all' | string;
    /** Read preference */
    readPreference?: 'primary' | 'secondary' | 'nearest' | string;
  };

  /**
   * Data archival configuration
   */
  archival?: {
    /** Whether archival is enabled */
    enabled: boolean;
    /** Retention period before archival */
    retentionPeriod?: string;
    /** Archive storage location */
    archiveStorage?: string;
  };

  /**
   * Connection pooling
   */
  connectionPool?: {
    /** Minimum connections */
    min?: number;
    /** Maximum connections */
    max?: number;
    /** Connection timeout (ms) */
    timeout?: number;
  };
}

/**
 * Interpersonal Interaction Configuration
 *
 * Configuration specific to human-to-human interactions.
 * Only applicable when layer is InteractionLayer.Interpersonal.
 *
 * @example Meeting
 * ```typescript
 * interpersonalConfig: {
 *   communicationChannel: 'in-person-meeting',
 *   synchronicity: 'synchronous',
 *   location: {
 *     type: 'physical',
 *     address: 'Conference Room A, Building 2',
 *     virtualOption: true
 *   },
 *   attendees: {
 *     required: [InvestorStakeholder, FinancialAdvisorStakeholder],
 *     optional: [ComplianceOfficerStakeholder]
 *   },
 *   duration: 'PT2H',
 *   frequency: 'monthly',
 *   agenda: ['Portfolio review', 'Investment proposals', 'Risk assessment']
 * }
 * ```
 *
 * @example Phone Call
 * ```typescript
 * interpersonalConfig: {
 *   communicationChannel: 'phone',
 *   synchronicity: 'synchronous',
 *   duration: 'PT30M',
 *   recordingConsent: true,
 *   languages: ['English', 'Spanish']
 * }
 * ```
 */
export interface InterpersonalInteractionConfig {
  /**
   * Communication channel used for this interaction
   *
   * @example 'in-person-meeting' - Face-to-face meeting
   * @example 'video-call' - Virtual video conference
   * @example 'phone' - Phone call
   * @example 'email' - Email exchange
   * @example 'instant-message' - Chat/messaging
   */
  communicationChannel?:
    | 'in-person-meeting'
    | 'video-call'
    | 'phone'
    | 'email'
    | 'instant-message'
    | 'letter'
    | string;

  /**
   * Synchronicity of the interaction
   *
   * @example 'synchronous' - Real-time, simultaneous communication
   * @example 'asynchronous' - Time-delayed communication
   */
  synchronicity?: 'synchronous' | 'asynchronous';

  /**
   * Location details for the interaction
   */
  location?: {
    /** Type of location */
    type?: 'physical' | 'virtual' | 'hybrid';
    /** Physical address or meeting room */
    address?: string;
    /** Virtual meeting link/platform */
    virtualPlatform?: string;
    /** Whether virtual option is available for physical meeting */
    virtualOption?: boolean;
  };

  /**
   * Attendees participating in this interaction
   * COMPILE-TIME TYPE SAFETY: Must be @Stakeholder decorated classes
   */
  attendees?: {
    /** Required attendees */
    required?: WithStakeholder<Constructor>[];
    /** Optional attendees */
    optional?: WithStakeholder<Constructor>[];
    /** Maximum number of attendees */
    maxAttendees?: number;
  };

  /**
   * Estimated duration (ISO 8601 format)
   *
   * @example 'PT30M' - 30 minutes
   * @example 'PT2H' - 2 hours
   */
  duration?: string;

  /**
   * Frequency of this recurring interaction
   *
   * @example 'weekly' - Weekly recurrence
   * @example 'monthly' - Monthly recurrence
   * @example 'quarterly' - Quarterly recurrence
   * @example 'ad-hoc' - As-needed, no regular schedule
   */
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'ad-hoc' | string;

  /**
   * Agenda or topics for the interaction
   *
   * @example ['Portfolio performance review', 'New investment proposals', 'Risk assessment']
   */
  agenda?: string[];

  /**
   * Whether recording (audio/video) requires consent
   */
  recordingConsent?: boolean;

  /**
   * Language preferences
   *
   * @example ['English', 'Spanish']
   */
  languages?: string[];

  /**
   * Artifacts or materials required for this interaction
   *
   * @example ['Portfolio report', 'Investment proposals', 'Risk analysis']
   */
  materialsRequired?: string[];

  /**
   * Outputs or deliverables from this interaction
   *
   * @example ['Meeting minutes', 'Decision log', 'Action items']
   */
  deliverablesExpected?: string[];

  /**
   * Facilitation or moderation requirements
   */
  facilitation?: {
    /** Whether a facilitator/moderator is needed */
    required?: boolean;
    /** Role of the facilitator */
    facilitatorRole?: string;
  };
}

/**
 * Manual Interaction Configuration
 *
 * Configuration specific to offline and manual process interactions.
 * Only applicable when layer is InteractionLayer.Manual.
 *
 * @example Manual Review
 * ```typescript
 * manualConfig: {
 *   processType: 'manual-review',
 *   physicalLocation: 'Compliance Department, Floor 3',
 *   reviewers: [ComplianceOfficerStakeholder],
 *   reviewCriteria: ['Identity verification', 'AML checks', 'Risk assessment'],
 *   approvalWorkflow: {
 *     levels: 1,
 *     description: 'Single approver for amounts < $50K'
 *   },
 *   estimatedDuration: 'PT48H',
 *   documentsRequired: ['Government ID', 'Proof of address', 'Application form']
 * }
 * ```
 *
 * @example Physical Signature
 * ```typescript
 * manualConfig: {
 *   processType: 'physical-signature',
 *   physicalLocation: 'Branch office or notary',
 *   documentsRequired: ['Contract (3 copies)', 'ID verification'],
 *   witnessRequired: true,
 *   notarizationRequired: false,
 *   offlineStorage: {
 *     location: 'Secure document archive, Building 1',
 *     retentionPeriod: '7 years'
 *   }
 * }
 * ```
 */
export interface ManualInteractionConfig {
  /**
   * Type of manual process
   *
   * @example 'manual-review' - Human review process
   * @example 'physical-document' - Paper document handling
   * @example 'physical-signature' - Wet signature process
   * @example 'in-person-verification' - Physical identity check
   */
  processType?: 'manual-review' | 'physical-document' | 'physical-signature' | 'in-person-verification' | string;

  /**
   * Physical location where this process happens
   *
   * @example 'Branch office - 123 Main St'
   * @example 'Compliance Department, Floor 3'
   * @example 'Notary office'
   */
  physicalLocation?: string;

  /**
   * Reviewers or approvers for this manual process
   * COMPILE-TIME TYPE SAFETY: Must be @Stakeholder decorated classes
   */
  reviewers?: WithStakeholder<Constructor>[];

  /**
   * Criteria for review or approval
   *
   * @example ['Identity verification complete', 'AML checks passed', 'Risk within tolerance']
   */
  reviewCriteria?: string[];

  /**
   * Approval workflow details
   */
  approvalWorkflow?: {
    /** Number of approval levels required */
    levels?: number;
    /** Description of the workflow */
    description?: string;
    /** Escalation path if approval is delayed */
    escalationPath?: string;
  };

  /**
   * Estimated duration for this manual process (ISO 8601 format)
   *
   * @example 'PT2H' - 2 hours
   * @example 'PT24H' - 24 hours (1 day)
   * @example 'PT48H' - 48 hours (2 days)
   */
  estimatedDuration?: string;

  /**
   * Physical documents required for this process
   *
   * @example ['Government ID', 'Proof of address', 'Signed application form']
   */
  documentsRequired?: string[];

  /**
   * Whether witness is required for this process
   */
  witnessRequired?: boolean;

  /**
   * Whether notarization is required
   */
  notarizationRequired?: boolean;

  /**
   * Offline storage configuration for physical artifacts
   */
  offlineStorage?: {
    /** Storage location */
    location?: string;
    /** Retention period */
    retentionPeriod?: string;
    /** Security classification */
    securityLevel?: 'public' | 'internal' | 'confidential' | 'restricted';
  };

  /**
   * Quality assurance requirements
   */
  qualityAssurance?: {
    /** Whether QA check is required */
    required?: boolean;
    /** Type of QA check */
    checkType?: string;
    /** QA responsible party */
    responsibleParty?: WithStakeholder<Constructor>;
  };

  /**
   * Compliance requirements for this manual process
   *
   * @example ['Retain for 7 years per regulation XYZ', 'Secure storage required']
   */
  complianceRequirements?: string[];
}

/**
 * Organizational Interaction Configuration
 *
 * Configuration specific to organization-to-organization interactions.
 * Only applicable when layer is InteractionLayer.Organizational.
 *
 * @example Formal Agreement
 * ```typescript
 * organizationalConfig: {
 *   interactionType: 'formal-agreement',
 *   organizations: [
 *     { organization: OgPgyBankOrganization, role: 'service-provider' },
 *     { organization: PaymentProcessorOrganization, role: 'vendor' }
 *   ],
 *   legalFramework: {
 *     jurisdiction: 'State of California, USA',
 *     governingLaw: 'California Commercial Code',
 *     disputeResolution: 'Binding arbitration'
 *   },
 *   formalAgreements: [
 *     {
 *       name: 'Master Service Agreement',
 *       type: 'contract',
 *       effectiveDate: '2024-01-01',
 *       expirationDate: '2026-12-31',
 *       renewalTerms: 'Auto-renew annually unless terminated with 90 days notice'
 *     }
 *   ],
 *   complianceRequirements: ['SOC 2 Type II', 'PCI DSS Level 1', 'Annual audit']
 * }
 * ```
 *
 * @example Regulatory Submission
 * ```typescript
 * organizationalConfig: {
 *   interactionType: 'regulatory-submission',
 *   organizations: [
 *     { organization: OgPgyBankOrganization, role: 'regulated-entity' },
 *     { organization: FinancialRegulatoryAuthorityOrganization, role: 'regulator' }
 *   ],
 *   regulatoryBody: 'Financial Services Regulatory Authority',
 *   submissionType: 'annual-compliance-report',
 *   filingRequirements: {
 *     frequency: 'annually',
 *     deadline: 'March 31st',
 *     format: 'XBRL + PDF',
 *     certificationRequired: true
 *   },
 *   complianceRequirements: ['Audited financials', 'Risk assessment', 'AML report']
 * }
 * ```
 */
export interface OrganizationalInteractionConfig {
  /**
   * Type of organizational interaction
   *
   * @example 'formal-agreement' - Contracts, SLAs, partnerships
   * @example 'regulatory-submission' - Compliance filings
   * @example 'audit' - Formal audit process
   * @example 'partnership' - Strategic partnership
   */
  interactionType?: 'formal-agreement' | 'regulatory-submission' | 'audit' | 'partnership' | string;

  /**
   * Organizations involved in this interaction
   * COMPILE-TIME TYPE SAFETY: Must be @Persona decorated classes of type Organization
   */
  organizations?: Array<{
    /** Organization persona */
    organization: WithPersona<Constructor>;
    /** Role in this interaction */
    role: 'service-provider' | 'client' | 'partner' | 'vendor' | 'regulator' | 'auditor' | 'regulated-entity' | string;
  }>;

  /**
   * Legal framework governing this interaction
   */
  legalFramework?: {
    /** Legal jurisdiction */
    jurisdiction?: string;
    /** Governing law */
    governingLaw?: string;
    /** Dispute resolution mechanism */
    disputeResolution?: 'litigation' | 'arbitration' | 'mediation' | string;
  };

  /**
   * Formal agreements governing this interaction
   */
  formalAgreements?: Array<{
    /** Agreement name */
    name: string;
    /** Agreement type */
    type: 'contract' | 'sla' | 'mou' | 'nda' | 'license' | string;
    /** Effective date */
    effectiveDate?: string;
    /** Expiration date */
    expirationDate?: string;
    /** Renewal terms */
    renewalTerms?: string;
    /** Termination conditions */
    terminationConditions?: string[];
  }>;

  /**
   * Compliance requirements
   *
   * @example ['SOC 2 Type II certification', 'PCI DSS Level 1', 'Annual third-party audit']
   */
  complianceRequirements?: string[];

  /**
   * Regulatory body (for regulatory interactions)
   *
   * @example 'Securities and Exchange Commission (SEC)'
   * @example 'Financial Services Regulatory Authority'
   */
  regulatoryBody?: string;

  /**
   * Submission type (for regulatory submissions)
   *
   * @example 'annual-compliance-report'
   * @example 'quarterly-financial-statement'
   * @example 'incident-report'
   */
  submissionType?: string;

  /**
   * Filing requirements (for regulatory submissions)
   */
  filingRequirements?: {
    /** Filing frequency */
    frequency?: 'quarterly' | 'annually' | 'ad-hoc' | string;
    /** Filing deadline */
    deadline?: string;
    /** Required format */
    format?: string;
    /** Whether certification is required */
    certificationRequired?: boolean;
  };

  /**
   * Audit details (for audit interactions)
   */
  auditDetails?: {
    /** Type of audit */
    auditType?: 'financial' | 'compliance' | 'security' | 'operational' | string;
    /** Audit scope */
    scope?: string;
    /** Auditor */
    auditor?: WithStakeholder<Constructor>;
    /** Audit frequency */
    frequency?: string;
    /** Last audit date */
    lastAuditDate?: string;
    /** Next audit date */
    nextAuditDate?: string;
  };

  /**
   * Service Level Agreements (for partnership/vendor relationships)
   */
  slaTerms?: {
    /** Uptime guarantee */
    uptime?: string;
    /** Response time */
    responseTime?: string;
    /** Support hours */
    supportHours?: string;
    /** Penalties for SLA breach */
    penalties?: string;
  };

  /**
   * Key contacts at each organization
   */
  keyContacts?: Array<{
    /** Organization */
    organization: WithPersona<Constructor>;
    /** Contact name */
    contactName?: string;
    /** Contact role */
    contactRole?: string;
    /** Contact information */
    contactInfo?: string;
  }>;
}

/**
 * Device Interaction Configuration
 *
 * Configuration specific to device/hardware interactions.
 * Only applicable when layer is InteractionLayer.Device.
 *
 * @example
 * ```typescript
 * deviceConfig: {
 *   requiredCapabilities: ['camera', 'biometric'],
 *   sensorDetails: {
 *     sensorType: 'fingerprint',
 *     accuracy: 'high'
 *   },
 *   platformRequirements: {
 *     minimumOS: 'iOS 13.0 / Android 10.0',
 *     permissions: ['USE_BIOMETRIC', 'CAMERA']
 *   },
 *   powerConsideration: {
 *     batteryImpact: 'medium',
 *     backgroundExecution: false
 *   }
 * }
 * ```
 */
export interface DeviceInteractionConfig {
  /**
   * Required device capabilities
   */
  requiredCapabilities?: Array<'camera' | 'microphone' | 'gps' | 'biometric' | 'nfc' | 'bluetooth' | 'accelerometer' | 'gyroscope' | string>;

  /**
   * Sensor-specific configuration (for SensorRead pattern)
   */
  sensorDetails?: {
    /** Sensor type */
    sensorType?: 'camera' | 'gps' | 'accelerometer' | 'gyroscope' | 'fingerprint' | 'face-id' | 'magnetometer' | string;
    /** Sampling rate (Hz) */
    samplingRate?: number;
    /** Accuracy level */
    accuracy?: 'low' | 'medium' | 'high';
    /** Resolution (for camera) */
    resolution?: string;
  };

  /**
   * Notification-specific configuration (for DeviceNotification pattern)
   */
  notificationDetails?: {
    /** Notification type */
    notificationType?: 'push' | 'local' | 'in-app' | 'badge';
    /** Priority level */
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    /** Sound enabled */
    sound?: boolean;
    /** Vibration enabled */
    vibration?: boolean;
    /** Badge count update */
    badge?: boolean;
    /** Category (for grouped notifications) */
    category?: string;
  };

  /**
   * Storage-specific configuration (for LocalStorage pattern)
   */
  storageDetails?: {
    /** Storage type */
    storageType?: 'keychain' | 'shared-preferences' | 'local-storage' | 'file-system' | 'sqlite' | string;
    /** Whether data is encrypted */
    encrypted?: boolean;
    /** Maximum storage size */
    maxSize?: string;
    /** Backup enabled */
    backup?: boolean;
  };

  /**
   * Platform requirements
   */
  platformRequirements?: {
    /** Minimum OS version */
    minimumOS?: string;
    /** Required permissions */
    permissions?: string[];
    /** Supported platforms */
    platforms?: Array<'ios' | 'android' | 'web' | 'windows' | 'macos' | string>;
  };

  /**
   * Power management considerations
   */
  powerConsideration?: {
    /** Battery impact level */
    batteryImpact?: 'low' | 'medium' | 'high';
    /** Whether can run in background */
    backgroundExecution?: boolean;
    /** Location accuracy (if using GPS) */
    locationAccuracy?: 'low' | 'medium' | 'high';
  };

  /**
   * Offline capabilities
   */
  offlineCapabilities?: {
    /** Whether works offline */
    supportsOffline?: boolean;
    /** Sync strategy when online */
    syncStrategy?: 'immediate' | 'batched' | 'manual';
  };
}

// ============================================================================
// MAIN INTERACTION OPTIONS INTERFACE
// ============================================================================

/**
 * Interaction Decorator Options
 *
 * Defines a complete interaction contract between stakeholders across any architectural layer.
 * Replaces the inline `exchange` field in Expectations with a reusable, type-safe decorator.
 *
 * @example Frontend UI Interaction
 * ```typescript
 * @Interaction({
 *   name: 'Account Opening Form',
 *   description: 'User fills and submits account opening form',
 *   pattern: InteractionPattern.FormInteraction,
 *   layer: InteractionLayer.Frontend,
 *   inputs: [
 *     { name: 'formData', type: AccountFormData, required: true }
 *   ],
 *   outputs: [
 *     { name: 'validationResult', type: 'boolean', required: true }
 *   ],
 *   frontendConfig: {
 *     framework: 'react-native',
 *     formValidation: {
 *       validationRules: ['email', 'required'],
 *       validationTiming: 'on-blur'
 *     }
 *   }
 * })
 * export class AccountOpeningFormInteraction {}
 * ```
 *
 * @example Backend API Interaction
 * ```typescript
 * @Interaction({
 *   name: 'Account Creation API',
 *   pattern: InteractionPattern.RequestResponse,
 *   layer: InteractionLayer.Backend,
 *   inputs: [
 *     { name: 'customerData', type: CustomerData, required: true, sensitivity: 'confidential' }
 *   ],
 *   outputs: [
 *     { name: 'accountNumber', type: 'string', required: true }
 *   ],
 *   protocol: {
 *     name: 'HTTP',
 *     http: { method: 'POST', path: '/api/v1/accounts' }
 *   },
 *   security: {
 *     authentication: 'oauth2',
 *     encryptionInTransit: { required: true, protocol: 'TLS 1.3' }
 *   },
 *   backendConfig: {
 *     resilience: {
 *       circuitBreaker: { enabled: true, failureThreshold: 5 }
 *     }
 *   }
 * })
 * export class AccountCreationAPIInteraction {}
 * ```
 */
export interface InteractionOptions extends BaseDecoratorOptions {
  // ===== CORE IDENTIFICATION =====

  /**
   * Interaction name (required)
   */
  name: string;

  /**
   * Description of the interaction
   */
  description?: string;

  // ===== INTERACTION CLASSIFICATION =====

  /**
   * Interaction pattern (required)
   * Defines HOW the interaction happens
   */
  pattern: InteractionPattern;

  /**
   * Architectural layer (required)
   * Defines WHERE the interaction happens
   */
  layer: InteractionLayer;

  // ===== DATA CONTRACT =====

  /**
   * Inputs to the interaction (required)
   * What the consumer provides to the provider
   */
  inputs: InteractionData[];

  /**
   * Outputs from the interaction (required)
   * What the provider returns to the consumer
   */
  outputs: InteractionData[];

  /**
   * Preconditions that must be true before interaction
   */
  preconditions?: string[];

  /**
   * Postconditions that must be true after interaction
   */
  postconditions?: string[];

  // ===== CORE SUB-INTERFACES =====

  /**
   * Quality configuration (SLO/SLI)
   */
  quality?: InteractionQuality;

  /**
   * Security configuration
   */
  security?: InteractionSecurity;

  /**
   * Protocol configuration (mainly for backend interactions)
   */
  protocol?: InteractionProtocol;

  /**
   * Error handling configuration
   */
  errorHandling?: InteractionErrorHandling;

  /**
   * Versioning configuration
   */
  versioning?: InteractionVersioning;

  /**
   * Observability configuration
   */
  observability?: InteractionObservability;

  // ===== LAYER-SPECIFIC CONFIGURATION =====

  /**
   * Frontend-specific configuration
   * Only applicable when layer is InteractionLayer.Frontend
   */
  frontendConfig?: FrontendInteractionConfig;

  /**
   * Backend-specific configuration
   * Only applicable when layer is InteractionLayer.Backend or InteractionLayer.External
   */
  backendConfig?: BackendInteractionConfig;

  /**
   * Data-specific configuration
   * Only applicable when layer is InteractionLayer.Data
   */
  dataConfig?: DataInteractionConfig;

  /**
   * Device-specific configuration
   * Only applicable when layer is InteractionLayer.Device
   */
  deviceConfig?: DeviceInteractionConfig;

  /**
   * Interpersonal-specific configuration
   * Only applicable when layer is InteractionLayer.Interpersonal
   */
  interpersonalConfig?: InterpersonalInteractionConfig;

  /**
   * Manual-specific configuration
   * Only applicable when layer is InteractionLayer.Manual
   */
  manualConfig?: ManualInteractionConfig;

  /**
   * Organizational-specific configuration
   * Only applicable when layer is InteractionLayer.Organizational
   */
  organizationalConfig?: OrganizationalInteractionConfig;

  // ===== MULTI-STAKEHOLDER PARTICIPATION =====

  /**
   * Participants in this interaction (optional)
   *
   * For interactions involving multiple stakeholders beyond the traditional
   * provider/consumer model. This is particularly useful for:
   * - Human-to-human collaborations (meetings, consultations)
   * - Manual review processes with multiple approvers
   * - Organizational interactions with multiple parties
   *
   * Note: For simple provider/consumer interactions, use the expectations field
   * which links to @Expectation decorators that define provider and consumer.
   *
   * @example Meeting with multiple participants
   * ```typescript
   * participants: [
   *   { stakeholder: InvestorStakeholder, role: 'decision-maker', required: true },
   *   { stakeholder: FinancialAdvisorStakeholder, role: 'presenter', required: true },
   *   { stakeholder: RiskManagerStakeholder, role: 'reviewer', required: true },
   *   { stakeholder: ComplianceOfficerStakeholder, role: 'observer', required: false }
   * ]
   * ```
   *
   * @example Manual review with approvers
   * ```typescript
   * participants: [
   *   { stakeholder: ComplianceOfficerStakeholder, role: 'primary-reviewer', required: true },
   *   { stakeholder: SeniorComplianceOfficerStakeholder, role: 'secondary-reviewer', required: false }
   * ]
   * ```
   */
  participants?: Array<{
    /**
     * Stakeholder participating in this interaction
     * COMPILE-TIME TYPE SAFETY: Must be @Stakeholder decorated class
     */
    stakeholder: WithStakeholder<Constructor>;

    /**
     * Role this stakeholder plays in the interaction
     *
     * @example 'initiator' - Starts the interaction
     * @example 'participant' - Active participant
     * @example 'approver' - Provides approval
     * @example 'observer' - Observes but doesn't actively participate
     * @example 'facilitator' - Moderates/facilitates the interaction
     * @example 'presenter' - Presents information
     * @example 'decision-maker' - Makes final decisions
     * @example 'reviewer' - Reviews materials or outcomes
     */
    role: 'initiator' | 'participant' | 'approver' | 'observer' | 'facilitator' | 'presenter' | 'decision-maker' | 'reviewer' | string;

    /**
     * Whether this stakeholder's participation is required
     *
     * @default true
     */
    required?: boolean;
  }>;

  // ===== METADATA =====

  /**
   * Tags for categorization
   */
  tags?: string[];
}

// ============================================================================
// DECORATOR FUNCTION
// ============================================================================

/**
 * Interaction decorator function
 *
 * Marks a class as an Interaction, defining the technical contract for how
 * stakeholders exchange data across architectural layers.
 *
 * This decorator is compile-time only and has zero runtime overhead.
 * It applies the `WithInteraction` brand for type-safe references.
 *
 * @param options - Interaction configuration options
 * @returns Class decorator
 *
 * @example
 * ```typescript
 * @Interaction({
 *   name: 'Account Opening API',
 *   pattern: InteractionPattern.RequestResponse,
 *   layer: InteractionLayer.Backend,
 *   inputs: [
 *     { name: 'customerData', type: CustomerData, required: true }
 *   ],
 *   outputs: [
 *     { name: 'accountNumber', type: 'string', required: true }
 *   ],
 *   quality: {
 *     slo: {
 *       latency: { p95: '500ms' },
 *       availability: { target: '99.9%' }
 *     }
 *   }
 * })
 * export class AccountOpeningAPIInteraction {}
 * ```
 */
export function Interaction(options: InteractionOptions) {
  return function <T extends Constructor>(
    target: T,
    _context?: ClassDecoratorContext<T>
  ): WithInteraction<T> {
    applyBrand(target, 'interaction');
    return target as WithInteraction<T>;
  };
}
