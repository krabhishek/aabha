# Digital Journey Decorators

> **Part 3 of the Aabha AI Primer Series**
>
> **Focus:** Journey orchestration for digital products and services
>
> This guide demonstrates how @Journey, @Action, @Expectation, @Interaction, and @Collaboration decorators work together to model **digital customer journeys** through mobile apps, web applications, and automated systems.

---

## Table of Contents

1. [Overview: Digital Journey Modeling](#overview-digital-journey-modeling)
2. [@Journey Decorator](#journey-decorator)
3. [@Action Decorator](#action-decorator)
4. [@Expectation Decorator](#expectation-decorator)
5. [@Interaction Decorator](#interaction-decorator)
6. [Complete Digital Example: Mobile Account Opening](#complete-digital-example-mobile-account-opening)
7. [Integration Patterns](#integration-patterns)

---

## Overview: Digital Journey Modeling

Digital journeys represent automated, technology-driven customer experiences where users interact with systems through:
- **Mobile applications** (iOS/Android)
- **Web applications** (browser-based)
- **APIs and microservices** (backend processing)
- **Databases and data stores** (persistence)
- **Device capabilities** (camera, sensors, biometrics)

### Key Characteristics of Digital Journeys

- **Speed**: Actions complete in seconds/minutes (not hours/days)
- **Automation**: Most actions are fully or semi-automated
- **Event-driven**: Actions emit business events for real-time processing
- **Data-intensive**: Heavy reliance on APIs, databases, and integrations
- **Self-service**: Customers drive their own progress

---

## @Journey Decorator

The `@Journey` decorator is a **minimal container** for Actions with business metadata. It defines WHAT actions are part of a journey, while the flow topology emerges from how Actions link together via `triggers`.

### Schema Overview

```typescript
interface JourneyOptions {
  // Required
  name: string;                           // Journey name
  primaryStakeholder: WithStakeholder;    // Who drives this journey

  // Optional
  actions?: WithAction[];                 // Actions in this journey
  entryActions?: WithAction[];            // Starting points
  metrics?: WithMetric[];                 // Success tracking
  outcomes?: string[];                    // Business outcomes
  description?: string;
  tags?: string[];
}
```

### Key Design Principles

1. **Journey is a container, not a flowchart**: Flow topology is defined by Actions via their `triggers` property
2. **Stakeholder-centric**: Every journey has a primary stakeholder who drives it
3. **Outcome-focused**: Journeys specify business outcomes, not implementation details
4. **Event-driven**: Actions within journeys emit business events

### Example: Digital Account Opening Journey

```typescript
import { Journey, Customer, DigitalAccountOpeningTimeMetric } from '@aabha/core';

@Journey({
  name: 'Digital Account Opening',
  description: 'Self-service account opening via OgPgyBank mobile app',

  primaryStakeholder: DigitalFirstCustomer,

  actions: [
    // Entry points
    LaunchAppAction,
    TapOpenAccountButtonAction,

    // Email verification flow
    EnterEmailPasswordAction,
    SubmitEmailFormAction,
    SendVerificationEmailAction,
    ClickVerificationLinkAction,
    EmailVerifiedAction,

    // Identity verification flow
    CaptureIDPhotoAction,
    SubmitIDForVerificationAction,
    AIVerifyDocumentAction,
    IdentityVerifiedAction,

    // Account creation
    CreateAccountRecordAction,
    IssueAccountNumberAction,
    SendWelcomeNotificationAction,
    AccountCreatedAction,
  ],

  entryActions: [
    LaunchAppAction  // Journey starts when user opens app
  ],

  metrics: [
    DigitalAccountOpeningTimeMetric,
    AccountOpeningConversionRateMetric,
    EmailVerificationSuccessRateMetric,
    IDVerificationSuccessRateMetric,
  ],

  outcomes: [
    'Customer has verified email address',
    'Customer identity is verified',
    'Customer has active bank account',
    'Customer can access all banking services',
  ],

  tags: ['onboarding', 'digital-first', 'self-service', 'customer-facing']
})
export class DigitalAccountOpeningJourney {}
```

`★ Insight ─────────────────────────────────────`
1. **Journeys don't define flow**: Notice how @Journey doesn't specify "first do X, then Y". The flow emerges from Action.triggers. This separation enables dynamic routing and conditional branching.
2. **Actions list is declarative**: The actions array is a flat list of all actions in the journey, regardless of execution order. Think of it as a "cast of characters" rather than a script.
3. **Entry actions matter**: Multiple entry points enable A/B testing and different user paths to start the same journey.
`─────────────────────────────────────────────────`

---

## @Action Decorator

The `@Action` decorator is the **unified event-driven action** that replaces the old Step and Milestone concepts. Actions form a **forward-looking DAG (Directed Acyclic Graph)** where each action declares what comes next via `triggers`.

### Schema Overview

```typescript
interface ActionOptions {
  // ===== CORE IDENTITY (Required) =====
  name: string;                           // Imperative, future-tense name
  actor: WithStakeholder;                 // Who performs this action
  scope: ActionScope;                     // Atomic | Composite | Journey | System

  // ===== EVENT EMISSION =====
  emitsEvent?: string;                    // 'domain.entity.action' format

  // ===== FLOW CONTROL - DAG =====
  triggers?: ActionTrigger[];             // What happens next (forward-looking)
  order?: number;                         // Display order hint

  // ===== CLASSIFICATION =====
  executionMode?: StepExecutionMode;      // Sequential | Parallel | Conditional
  automationLevel?: StepAutomationLevel;  // Manual | SemiAutomated | FullyAutomated
  criticality?: StepCriticality;          // Optional | Required | Critical
  estimatedDuration?: StepDuration;       // Instant | Quick | Short | Medium | Long
  parallelGroup?: string;                 // For parallel execution

  // ===== ERROR HANDLING =====
  fallbackAction?: WithAction;            // Alternative if this fails
  compensatingAction?: WithAction;        // Undo action (saga pattern)
  maxRetries?: number;                    // Retry attempts
  timeoutDuration?: string;               // ISO 8601 duration
  skipOnError?: boolean;                  // Continue on failure

  // ===== EXPECTATIONS =====
  expectations?: WithExpectation[];       // Quality/SLO requirements
  collaboration?: WithCollaboration;      // Multi-stakeholder coordination

  // ===== METADATA =====
  description?: string;
  tags?: string[];
}
```

### Action Scope Levels

| Scope | Description | Emits Event? | Example |
|-------|-------------|--------------|---------|
| **Atomic** | Single, indivisible action | Rarely | "User Clicks Submit", "System Validates Email" |
| **Composite** | Groups multiple atomic actions | Sometimes | "Complete Form Submission", "Process Payment" |
| **Journey** | Major milestone within journey | **Should** | "Email Verified", "KYC Approved", "Account Created" |
| **System** | Cross-journey strategic milestone | **Must** | "Customer Fully Onboarded", "Product Launched" |

### DAG Flow with Triggers

Actions use `triggers` to create a forward-looking graph:

```typescript
interface ActionTrigger {
  action: WithAction<Constructor>;  // Next action to trigger
  condition?: string;               // Optional condition (for branching)
}
```

### Example 1: Atomic Action (User Input)

```typescript
import { Action, ActionScope, StepAutomationLevel, StepDuration } from '@aabha/core';

@Action({
  name: 'User Enters Email and Password',
  actor: DigitalFirstCustomer,
  scope: ActionScope.Atomic,

  automationLevel: StepAutomationLevel.Manual,
  estimatedDuration: StepDuration.Quick,
  criticality: StepCriticality.Required,

  description: 'Customer types email and password into account opening form',

  triggers: [
    { action: SubmitEmailFormAction }  // Unconditional: always leads here
  ],

  tags: ['user-input', 'authentication', 'frontend']
})
export class EnterEmailPasswordAction {}
```

### Example 2: Composite Action with Orchestration

```typescript
@Action({
  name: 'Submit Email Verification Form',
  actor: DigitalFirstCustomer,
  scope: ActionScope.Composite,

  automationLevel: StepAutomationLevel.FullyAutomated,
  estimatedDuration: StepDuration.Quick,
  executionMode: StepExecutionMode.Sequential,

  description: 'System validates email format, checks for duplicates, and sends verification link',

  expectations: [
    FastEmailValidationExpectation,
    NoDuplicateEmailExpectation,
    EmailDeliveryExpectation,
  ],

  triggers: [
    { action: SendVerificationEmailAction }  // Next step in sequence
  ],

  maxRetries: 3,
  timeoutDuration: 'PT10S',  // 10 seconds

  fallbackAction: ShowValidationErrorAction,

  tags: ['validation', 'backend', 'automated']
})
export class SubmitEmailFormAction {}
```

### Example 3: Journey-Level Action with Events

```typescript
@Action({
  name: 'Email Verified',
  actor: DigitalFirstCustomer,
  scope: ActionScope.Journey,

  emitsEvent: 'account.email.verified',  // Domain event for downstream systems

  automationLevel: StepAutomationLevel.SemiAutomated,
  estimatedDuration: StepDuration.Instant,
  criticality: StepCriticality.Critical,

  description: 'Customer has successfully verified their email address by clicking the verification link',

  expectations: [
    FastEmailResponseExpectation
  ],

  triggers: [
    { action: ShowIDCaptureScreenAction }  // Move to next phase
  ],

  tags: ['milestone', 'email-verification', 'customer-facing']
})
export class EmailVerifiedAction {}
```

### Example 4: Conditional Branching with AI

```typescript
@Action({
  name: 'AI Verifies Government ID',
  actor: SystemStakeholder,
  scope: ActionScope.Composite,

  automationLevel: StepAutomationLevel.FullyAutomated,
  estimatedDuration: StepDuration.Short,
  criticality: StepCriticality.Critical,

  description: 'AI system analyzes government ID photo for authenticity and extracts customer data',

  expectations: [
    HighAccuracyDocumentVerificationExpectation,
    FastIDVerificationExpectation,
  ],

  triggers: [
    {
      action: IdentityVerifiedAction,
      condition: 'aiConfidence >= 95 && documentValid == true'
    },
    {
      action: FlagForManualReviewAction,
      condition: 'aiConfidence < 95 || documentValid == false'
    }
  ],

  maxRetries: 2,
  timeoutDuration: 'PT30S',

  fallbackAction: FlagForManualReviewAction,

  tags: ['ai', 'verification', 'conditional-branching']
})
export class AIVerifyDocumentAction {}
```

### Example 5: Parallel Actions

```typescript
@Action({
  name: 'Account Created',
  actor: SystemStakeholder,
  scope: ActionScope.Journey,

  emitsEvent: 'account.created',

  automationLevel: StepAutomationLevel.FullyAutomated,
  estimatedDuration: StepDuration.Instant,
  criticality: StepCriticality.Critical,

  description: 'New account record created in core banking system with unique account number',

  expectations: [
    UniqueAccountNumberExpectation,
    AccountPersistenceExpectation,
  ],

  triggers: [
    // Both triggered in parallel (no conditions)
    { action: IssueVirtualDebitCardAction },
    { action: SendWelcomeEmailAction },
    { action: CreateDefaultSavingsAccountAction }
  ],

  compensatingAction: RollbackAccountCreationAction,  // Saga pattern

  tags: ['milestone', 'account-creation', 'parallel-flow']
})
export class AccountCreatedAction {}
```

`★ Insight ─────────────────────────────────────`
1. **Triggers define topology**: The DAG emerges organically from trigger declarations. No central orchestrator needed—each action knows its next steps.
2. **Conditions enable branching**: Simple string expressions (`aiConfidence >= 95`) provide if-then-else logic without complex workflow engines.
3. **Scopes determine significance**: Atomic actions are plentiful and granular; Journey actions are rare and meaningful—they should emit events.
`─────────────────────────────────────────────────`

---

## @Expectation Decorator

The `@Expectation` decorator defines **stakeholder contracts** for what should happen and how well it should perform. Expectations link Actions to Interactions and Behaviors, forming the bridge between "what" and "how".

### Schema Overview

```typescript
interface ExpectationOptions {
  // ===== CORE (Required) =====
  name: string;
  description: string;                    // Given-When-Then format
  provider: WithStakeholder;              // Who fulfills this
  consumer: WithStakeholder;              // Who benefits
  interaction: WithInteraction;           // Primary technical contract

  // ===== ADDITIONAL INTERACTIONS =====
  additionalInteractions?: Array<{
    interaction: WithInteraction;
    role: string;
    description?: string;
  }>;

  // ===== IMPLEMENTATION =====
  behaviors?: WithBehavior[];             // How it's implemented

  // ===== CLASSIFICATION =====
  complexity?: ExpectationComplexity;
  category?: ExpectationCategory;
  stakeholderRelationType?: ExpectationStakeholderRelationType;
  verificationLevel?: ExpectationVerificationLevel;

  // ===== QUALITY (SLO/SLI) =====
  quality?: ExpectationQuality;

  // ===== VERIFICATION =====
  verification?: ExpectationVerification;

  // ===== OBSERVABILITY =====
  observability?: ExpectationObservability;

  // ===== BUSINESS CONTEXT =====
  businessContext?: ExpectationBusinessContext;

  // ===== RELATIONSHIPS =====
  additionalStakeholders?: Array<{...}>;
  dependsOn?: WithExpectation[];
  conflictsWith?: WithExpectation[];
  prerequisites?: string[];
  tags?: string[];
}
```

### Example 1: Fast Email Validation (Functional)

```typescript
import {
  Expectation,
  ExpectationComplexity,
  ExpectationCategory,
  ExpectationStakeholderRelationType,
  ExpectationVerificationLevel,
} from '@aabha/core';

@Expectation({
  name: 'Fast Email Validation',
  description: 'Given a user enters an email, When they submit the form, Then the email should be validated for format and uniqueness within 1 second',

  provider: EmailValidationServiceStakeholder,
  consumer: DigitalFirstCustomer,

  interaction: EmailValidationAPIInteraction,  // Backend HTTP POST

  behaviors: [
    ValidateEmailFormatBehavior,
    CheckEmailUniquenessInDatabaseBehavior,
  ],

  complexity: ExpectationComplexity.Simple,
  category: ExpectationCategory.Functional,
  stakeholderRelationType: ExpectationStakeholderRelationType.B2C,
  verificationLevel: ExpectationVerificationLevel.Enforced,

  quality: {
    slo: {
      latency: {
        p50: '200ms',
        p95: '800ms',
        p99: '1s',
        max: '2s'
      },
      availability: {
        target: '99.9%',
        errorBudget: '43m/month'
      }
    },
    sli: {
      successRate: EmailValidationSuccessRateMetric,
      latency: EmailValidationP95LatencyMetric,
      errorRate: EmailValidationErrorRateMetric
    }
  },

  verification: {
    level: ExpectationVerificationLevel.Enforced,
    testCoverage: {
      minWitnessCoverage: 85,
      requiredScenarios: {
        happyPath: true,
        errorScenarios: ['invalid-format', 'duplicate-email', 'service-timeout'],
        edgeCases: ['special-characters', 'international-domains', 'very-long-email']
      }
    },
    acceptanceTesting: {
      approach: 'automated',
      tools: ['jest', 'supertest'],
      frequency: 'on-commit'
    }
  },

  observability: {
    enabled: true,
    metrics: [EmailValidationSuccessRateMetric],
    logLevel: 'info',
    tracing: {
      enabled: true,
      traceHeaders: ['X-Trace-Id'],
      spanName: 'email-validation'
    },
    monitoring: {
      alerts: [
        {
          condition: 'p95_latency > 1s',
          severity: 'high',
          notifyStakeholders: [EngineeringLeadStakeholder],
          channel: 'slack'
        },
        {
          condition: 'error_rate > 5%',
          severity: 'critical',
          notifyStakeholders: [OnCallEngineerStakeholder],
          channel: 'pagerduty'
        }
      ]
    }
  },

  businessContext: {
    strategicImportance: 'high',
    impactAssessment: {
      customerSatisfaction: 'Prevents invalid signups, improves conversion',
      operationalEfficiency: 'Reduces support tickets for account issues'
    },
    successMeasurement: {
      baseline: { value: '88% valid emails', date: '2024-01-01' },
      target: { value: '96% valid emails', date: '2025-06-01' },
      approachToMeasurement: 'Track ratio of valid to invalid signups'
    }
  },

  tags: ['email', 'validation', 'authentication', 'critical-path']
})
export class FastEmailValidationExpectation {}
```

### Example 2: Secure Document Verification (Performance + Security)

```typescript
@Expectation({
  name: 'High-Accuracy Document Verification',
  description: 'Given a government ID photo, When submitted for verification, Then AI should verify authenticity with ≥95% confidence within 30 seconds',

  provider: AIDocumentVerificationServiceStakeholder,
  consumer: DigitalFirstCustomer,

  interaction: AIDocumentVerificationAPIInteraction,

  additionalInteractions: [
    {
      interaction: DocumentImageStorageInteraction,
      role: 'persistence',
      description: 'Store encrypted ID images for compliance (7 years retention)'
    },
    {
      interaction: AuditLogInteraction,
      role: 'compliance',
      description: 'Log all verification attempts for regulatory audit'
    }
  ],

  behaviors: [
    ExtractIDDataFromImageBehavior,
    VerifyDocumentAuthenticityBehavior,
    CheckAgainstWatchlistBehavior,
  ],

  complexity: ExpectationComplexity.Complex,
  category: ExpectationCategory.Security,
  stakeholderRelationType: ExpectationStakeholderRelationType.B2C,
  verificationLevel: ExpectationVerificationLevel.Enforced,

  quality: {
    slo: {
      latency: {
        p95: '10s',
        p99: '20s',
        max: '30s'
      },
      availability: {
        target: '99.5%',
        errorBudget: '3.6h/month'
      }
    },
    sli: {
      successRate: IDVerificationSuccessRateMetric,
      latency: IDVerificationP95LatencyMetric
    }
  },

  verification: {
    level: ExpectationVerificationLevel.Enforced,
    testCoverage: {
      minWitnessCoverage: 90,
      requiredScenarios: {
        happyPath: true,
        errorScenarios: ['blurry-image', 'fake-id', 'expired-id', 'ai-service-down'],
        edgeCases: ['non-english-ids', 'damaged-documents', 'black-and-white-photos']
      }
    }
  },

  observability: {
    enabled: true,
    metrics: [IDVerificationAccuracyMetric, IDVerificationLatencyMetric],
    monitoring: {
      alerts: [
        {
          condition: 'accuracy < 95%',
          severity: 'critical',
          notifyStakeholders: [ProductOwnerStakeholder, AITeamLeadStakeholder]
        }
      ]
    },
    auditTrail: {
      enabled: true,
      retentionPeriod: '7y',  // Regulatory requirement
      includeDetails: ['timestamp', 'customer-id', 'ai-confidence', 'document-type', 'result']
    }
  },

  businessContext: {
    strategicImportance: 'critical',
    impactAssessment: {
      revenueImpact: 'Enables instant account opening (vs 3-5 day manual review)',
      customerSatisfaction: 'Reduces onboarding time from days to minutes',
      operationalEfficiency: 'Saves 20 hours/week of manual verification work'
    },
    risks: [
      {
        description: 'AI model accuracy degrades with new ID formats',
        probability: 'medium',
        impact: 'high',
        mitigation: 'Continuous retraining with new ID samples, fallback to manual review'
      },
      {
        description: 'Regulatory compliance for biometric data storage',
        probability: 'low',
        impact: 'critical',
        mitigation: 'Encrypt all images, implement data retention policy, regular audits'
      }
    ]
  },

  dependsOn: [
    SecureImageUploadExpectation,
    EncryptedStorageExpectation
  ],

  tags: ['kyc', 'ai', 'security', 'compliance', 'critical-path']
})
export class HighAccuracyDocumentVerificationExpectation {}
```

`★ Insight ─────────────────────────────────────`
1. **Expectations are contracts with teeth**: The quality.slo defines hard numbers (p95 < 1s), and observability.alerts enforce them. This isn't documentation—it's operational governance.
2. **Business context connects strategy to code**: The businessContext field answers "why does this matter?" for non-technical stakeholders, linking technical SLOs to revenue, satisfaction, and efficiency.
3. **Relationships model dependencies**: dependsOn and conflictsWith create a graph of expectations, enabling impact analysis ("if we change X, what breaks?").
`─────────────────────────────────────────────────`

---

## @Interaction Decorator

The `@Interaction` decorator defines **technical contracts** for how stakeholders exchange data. It replaces the inline `exchange` field from older expectation models with reusable, type-safe patterns across all architectural layers.

### Schema Overview

```typescript
interface InteractionOptions {
  // ===== CORE =====
  name: string;
  description?: string;
  pattern: InteractionPattern;            // HOW (RequestResponse, Event, FormInteraction, etc.)
  layer: InteractionLayer;                // WHERE (Frontend, Backend, Data, Device, etc.)

  // ===== DATA CONTRACT =====
  inputs: InteractionData[];              // What consumer provides
  outputs: InteractionData[];             // What provider returns
  preconditions?: string[];
  postconditions?: string[];

  // ===== QUALITY & OPERATIONS =====
  quality?: InteractionQuality;           // SLO/SLI
  security?: InteractionSecurity;         // Auth, encryption, compliance
  protocol?: InteractionProtocol;         // HTTP, gRPC, WebSocket, etc.
  errorHandling?: InteractionErrorHandling;
  versioning?: InteractionVersioning;
  observability?: InteractionObservability;

  // ===== LAYER-SPECIFIC CONFIG =====
  frontendConfig?: FrontendInteractionConfig;
  backendConfig?: BackendInteractionConfig;
  dataConfig?: DataInteractionConfig;
  deviceConfig?: DeviceInteractionConfig;

  // ===== MULTI-STAKEHOLDER =====
  participants?: Array<{
    stakeholder: WithStakeholder;
    role: string;
    required?: boolean;
  }>;

  tags?: string[];
}
```

### Digital Interaction Layers

| Layer | Purpose | Typical Patterns | Example |
|-------|---------|------------------|---------|
| **Frontend** | UI/UX | FormInteraction, UserGesture, Navigation | User fills account form |
| **Backend** | Services/APIs | RequestResponse, Event, Streaming | POST /api/v1/accounts |
| **Data** | Persistence | Query, Command, Transaction | INSERT INTO accounts |
| **Device** | Hardware/Sensors | SensorRead, DeviceNotification, LocalStorage | Camera captures ID photo |

### Example 1: Frontend Form Interaction

```typescript
import {
  Interaction,
  InteractionPattern,
  InteractionLayer,
} from '@aabha/core';

@Interaction({
  name: 'Account Opening Form Input',
  description: 'User fills out email and password fields in the account opening form',

  pattern: InteractionPattern.FormInteraction,
  layer: InteractionLayer.Frontend,

  inputs: [
    {
      name: 'emailInput',
      type: 'string',
      required: true,
      validation: {
        format: 'email',
        constraints: ['Valid email format per RFC 5322', 'Max 100 characters']
      },
      sensitivity: 'confidential',
      description: 'Customer email address for account'
    },
    {
      name: 'passwordInput',
      type: 'string',
      required: true,
      validation: {
        constraints: [
          'Min 8 characters',
          'Max 128 characters',
          'Must contain uppercase, lowercase, digit, and special character'
        ]
      },
      sensitivity: 'restricted',
      description: 'Customer chosen password'
    }
  ],

  outputs: [
    {
      name: 'validationResult',
      type: 'boolean',
      required: true,
      description: 'Whether form inputs pass client-side validation'
    },
    {
      name: 'validationErrors',
      type: 'string[]',
      required: false,
      description: 'List of validation error messages'
    }
  ],

  preconditions: [
    'User has opened the account opening screen',
    'Form fields are rendered and interactive'
  ],

  postconditions: [
    'Email and password are validated client-side',
    'Submit button is enabled if validation passes'
  ],

  frontendConfig: {
    framework: 'react-native',
    formValidation: {
      validationRules: ['email', 'required', 'password-strength'],
      validationTiming: 'on-blur',  // Validate when user leaves field
      validationType: 'both'         // Client + server validation
    },
    accessibility: {
      ariaLabels: {
        email: 'Email address input',
        password: 'Password input',
        submit: 'Submit account opening form'
      },
      keyboardNavigation: true,
      screenReaderSupport: true
    },
    stateManagement: {
      approach: 'local',  // Component-level state
      persistence: 'none'  // Don't persist sensitive data
    }
  },

  observability: {
    enabled: true,
    logLevel: 'info',
    metrics: [FormValidationErrorRateMetric, FormCompletionTimeMetric]
  },

  tags: ['frontend', 'form', 'user-input', 'validation']
})
export class AccountOpeningFormInputInteraction {}
```

### Example 2: Backend API Interaction

```typescript
@Interaction({
  name: 'Email Validation API',
  description: 'Backend service validates email format and checks for duplicates',

  pattern: InteractionPattern.RequestResponse,
  layer: InteractionLayer.Backend,

  inputs: [
    {
      name: 'email',
      type: 'string',
      required: true,
      validation: {
        format: 'email'
      },
      sensitivity: 'confidential'
    }
  ],

  outputs: [
    {
      name: 'isValid',
      type: 'boolean',
      required: true,
      description: 'Whether email passes all validation checks'
    },
    {
      name: 'isDuplicate',
      type: 'boolean',
      required: true,
      description: 'Whether email already exists in system'
    },
    {
      name: 'reason',
      type: 'string',
      required: false,
      description: 'Reason for validation failure'
    }
  ],

  protocol: {
    name: 'HTTP',
    version: '1.1',
    http: {
      method: 'POST',
      path: '/api/v1/validate-email',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  },

  security: {
    authentication: 'oauth2',
    authorization: 'none',  // Public endpoint
    encryptionInTransit: {
      required: true,
      protocol: 'TLS 1.3',
      cipherSuites: ['TLS_AES_256_GCM_SHA384']
    }
  },

  quality: {
    slo: {
      latency: {
        p50: '200ms',
        p95: '800ms',
        max: '2s'
      },
      availability: {
        target: '99.9%'
      }
    }
  },

  errorHandling: {
    errorCodes: [
      {
        code: 'INVALID_EMAIL_FORMAT',
        description: 'Email does not match RFC 5322 format',
        severity: 'medium',
        retryable: false,
        httpStatus: 400
      },
      {
        code: 'EMAIL_ALREADY_EXISTS',
        description: 'Email already registered',
        severity: 'medium',
        retryable: false,
        httpStatus: 409
      },
      {
        code: 'DATABASE_TIMEOUT',
        description: 'Database query timed out',
        severity: 'high',
        retryable: true,
        httpStatus: 503
      }
    ],
    fallback: {
      strategy: 'retry',
      maxRetries: 3,
      retryBackoff: 'exponential'
    },
    timeoutBehavior: 'Return error after 2 seconds'
  },

  versioning: {
    version: '1.0.0',
    backwardCompatible: [],
    negotiation: {
      method: 'url',  // Version in URL path
    }
  },

  backendConfig: {
    resilience: {
      circuitBreaker: {
        enabled: true,
        failureThreshold: 5,
        resetTimeout: 30000,
        halfOpenRequests: 3
      },
      timeout: {
        connection: 1000,
        read: 2000
      }
    },
    caching: {
      enabled: false  // Don't cache validation results
    }
  },

  observability: {
    enabled: true,
    metrics: [APILatencyMetric, APIErrorRateMetric],
    logLevel: 'info',
    tracing: {
      enabled: true,
      implementation: 'opentelemetry',
      samplingRate: 1.0,  // 100% sampling for critical path
      spanName: 'email-validation-api'
    }
  },

  tags: ['backend', 'api', 'validation', 'http']
})
export class EmailValidationAPIInteraction {}
```

### Example 3: Data Layer Interaction

```typescript
@Interaction({
  name: 'Check Email Uniqueness in Database',
  description: 'Query database to check if email already exists',

  pattern: InteractionPattern.Query,
  layer: InteractionLayer.Data,

  inputs: [
    {
      name: 'email',
      type: 'string',
      required: true,
      sensitivity: 'confidential'
    }
  ],

  outputs: [
    {
      name: 'exists',
      type: 'boolean',
      required: true,
      description: 'Whether email exists in database'
    },
    {
      name: 'accountId',
      type: 'string',
      required: false,
      description: 'Account ID if email exists'
    }
  ],

  dataConfig: {
    databaseType: 'sql',
    databaseImplementation: 'postgresql',

    schema: {
      tableName: 'accounts',
      primaryKey: 'account_id',
      indexes: ['email_unique_idx']
    },

    queryOptimization: {
      useIndexes: true,
      hints: ['Use email_unique_idx for fast lookup']
    },

    consistency: {
      readPreference: 'primary',  // Always read from primary for accuracy
    },

    connectionPool: {
      min: 5,
      max: 20,
      timeout: 5000
    }
  },

  quality: {
    slo: {
      latency: {
        p95: '50ms',
        max: '200ms'
      }
    }
  },

  observability: {
    enabled: true,
    metrics: [DatabaseQueryLatencyMetric],
    logLevel: 'debug'
  },

  tags: ['data', 'database', 'query', 'postgresql']
})
export class CheckEmailUniquenessDBInteraction {}
```

### Example 4: Device Camera Interaction

```typescript
@Interaction({
  name: 'Capture Government ID Photo',
  description: 'Use device camera to capture photo of government-issued ID',

  pattern: InteractionPattern.SensorRead,
  layer: InteractionLayer.Device,

  inputs: [
    {
      name: 'cameraPermission',
      type: 'boolean',
      required: true,
      description: 'Whether user granted camera permission'
    }
  ],

  outputs: [
    {
      name: 'photoData',
      type: 'base64Image',
      required: true,
      sensitivity: 'restricted',
      description: 'Base64-encoded photo of government ID'
    },
    {
      name: 'photoMetadata',
      type: 'object',
      required: true,
      description: 'Photo metadata (timestamp, resolution, device info)'
    }
  ],

  preconditions: [
    'User has granted camera permission',
    'Device has camera capability',
    'User is on ID capture screen'
  ],

  postconditions: [
    'Photo is captured in high resolution',
    'Photo is stored temporarily on device',
    'Photo ready for upload to backend'
  ],

  deviceConfig: {
    requiredCapabilities: ['camera'],

    sensorDetails: {
      sensorType: 'camera',
      accuracy: 'high',
      resolution: '1920x1080 minimum'
    },

    platformRequirements: {
      minimumOS: 'iOS 13.0 / Android 10.0',
      permissions: ['CAMERA'],
      platforms: ['ios', 'android']
    },

    powerConsideration: {
      batteryImpact: 'medium',
      backgroundExecution: false
    },

    offlineCapabilities: {
      supportsOffline: true,
      syncStrategy: 'immediate'  // Upload as soon as captured
    }
  },

  security: {
    encryptionAtRest: {
      required: true,
      algorithm: 'AES-256',
      keyManagement: 'Device keychain'
    },
    compliance: ['GDPR', 'CCPA'],  // Biometric data handling
    securityNotes: [
      'Photo must be encrypted immediately after capture',
      'Photo should be deleted from device after successful upload',
      'No photo should be stored in device photo gallery'
    ]
  },

  observability: {
    enabled: true,
    metrics: [IDPhotoCaptureSuccessRateMetric],
    logLevel: 'info'
  },

  tags: ['device', 'camera', 'kyc', 'biometric']
})
export class CaptureGovernmentIDPhotoInteraction {}
```

`★ Insight ─────────────────────────────────────`
1. **Layer-specific configs add precision**: frontendConfig, backendConfig, dataConfig, and deviceConfig provide layer-appropriate details without cluttering the core interaction schema.
2. **Interactions are reusable building blocks**: EmailValidationAPIInteraction can be referenced by multiple Expectations across different Journeys. Write once, link many times.
3. **Security and compliance are first-class**: The security field isn't an afterthought—it's required for sensitive data, making compliance automatic and auditable.
`─────────────────────────────────────────────────`

---

## Complete Digital Example: Mobile Account Opening

Let's bring everything together with a **complete, end-to-end digital journey** showing how all decorators integrate.

### Journey Topology

```
LaunchApp
  → TapOpenAccountButton
    → EnterEmailPassword
      → SubmitEmailForm
        → SendVerificationEmail
          → ClickVerificationLink
            → EmailVerified (MILESTONE - emits event)
              → ShowIDCaptureScreen
                → CaptureIDPhoto
                  → SubmitIDForVerification
                    → AIVerifyDocument
                      ├─[AI confident]→ IdentityVerified (MILESTONE - emits event)
                      │                   → CreateAccountRecord
                      │                     → IssueAccountNumber
                      │                       → AccountCreated (MILESTONE - emits event)
                      │                         ├─→ IssueVirtualDebitCard (parallel)
                      │                         ├─→ SendWelcomeEmail (parallel)
                      │                         └─→ CreateDefaultSavingsAccount (parallel)
                      │
                      └─[AI not confident]→ FlagForManualReview
                                             → [offline journey - not covered here]
```

### Full Journey Declaration

```typescript
@Journey({
  name: 'Digital Account Opening',
  description: 'Self-service mobile account opening with AI-powered identity verification',
  primaryStakeholder: DigitalFirstCustomer,

  actions: [
    LaunchAppAction,
    TapOpenAccountButtonAction,
    EnterEmailPasswordAction,
    SubmitEmailFormAction,
    SendVerificationEmailAction,
    ClickVerificationLinkAction,
    EmailVerifiedAction,
    ShowIDCaptureScreenAction,
    CaptureIDPhotoAction,
    SubmitIDForVerificationAction,
    AIVerifyDocumentAction,
    IdentityVerifiedAction,
    CreateAccountRecordAction,
    IssueAccountNumberAction,
    AccountCreatedAction,
    IssueVirtualDebitCardAction,
    SendWelcomeEmailAction,
    CreateDefaultSavingsAccountAction,
    FlagForManualReviewAction,
  ],

  entryActions: [LaunchAppAction],

  metrics: [
    DigitalAccountOpeningTimeMetric,
    AccountOpeningConversionRateMetric,
    EmailVerificationSuccessRateMetric,
    IDVerificationSuccessRateMetric,
    AIConfidenceScoreMetric,
  ],

  outcomes: [
    'Customer has verified email',
    'Customer identity verified via AI',
    'Active bank account created',
    'Virtual debit card issued',
    'Customer can access all banking services',
  ],

  tags: ['onboarding', 'digital', 'self-service', 'ai-powered']
})
export class DigitalAccountOpeningJourney {}
```

### Sample Action with Full Integration

```typescript
@Action({
  name: 'Submit Email Verification Form',
  actor: DigitalFirstCustomer,
  scope: ActionScope.Composite,

  automationLevel: StepAutomationLevel.FullyAutomated,
  estimatedDuration: StepDuration.Quick,
  criticality: StepCriticality.Critical,

  description: 'System validates email format, checks database for duplicates, and sends verification link',

  // Expectations link to Interactions and Behaviors
  expectations: [
    FastEmailValidationExpectation,      // → EmailValidationAPIInteraction
    NoDuplicateEmailExpectation,         // → CheckEmailUniquenessDBInteraction
    EmailDeliveryExpectation,            // → SendEmailViaSendGridInteraction
  ],

  // DAG: What happens next
  triggers: [
    { action: SendVerificationEmailAction }
  ],

  // Error handling
  maxRetries: 3,
  timeoutDuration: 'PT10S',
  fallbackAction: ShowValidationErrorAction,

  tags: ['email', 'validation', 'backend', 'critical-path']
})
export class SubmitEmailFormAction {}
```

### Expectation with Multiple Interactions

```typescript
@Expectation({
  name: 'Fast Email Validation',
  description: 'Given user submits email, When backend validates, Then response within 1 second with format + uniqueness check',

  provider: EmailValidationServiceStakeholder,
  consumer: DigitalFirstCustomer,

  // Primary interaction
  interaction: EmailValidationAPIInteraction,

  // Additional interactions for complete workflow
  additionalInteractions: [
    {
      interaction: CheckEmailUniquenessDBInteraction,
      role: 'persistence-check',
      description: 'Query database for duplicate email'
    },
    {
      interaction: EmailValidationCacheInteraction,
      role: 'performance-optimization',
      description: 'Check cache before hitting database'
    }
  ],

  behaviors: [
    ValidateEmailFormatBehavior,
    CheckEmailUniquenessInDatabaseBehavior,
  ],

  quality: {
    slo: {
      latency: { p95: '800ms', max: '2s' },
      availability: { target: '99.9%' }
    },
    sli: {
      successRate: EmailValidationSuccessRateMetric,
      latency: EmailValidationP95LatencyMetric,
    }
  },

  observability: {
    enabled: true,
    metrics: [EmailValidationSuccessRateMetric],
    monitoring: {
      alerts: [{
        condition: 'p95_latency > 1s',
        severity: 'high',
        notifyStakeholders: [EngineeringLeadStakeholder]
      }]
    }
  },

  tags: ['email', 'validation', 'critical-path']
})
export class FastEmailValidationExpectation {}
```

---

## Integration Patterns

### Pattern 1: Journey → Action → Expectation → Interaction Chain

```
@Journey
  └─ actions: [SubmitEmailFormAction]
       │
       └─ @Action (SubmitEmailFormAction)
            └─ expectations: [FastEmailValidationExpectation]
                 │
                 └─ @Expectation (FastEmailValidationExpectation)
                      ├─ interaction: EmailValidationAPIInteraction
                      │    │
                      │    └─ @Interaction (Backend, RequestResponse)
                      │         ├─ protocol: HTTP POST /api/v1/validate-email
                      │         ├─ quality: p95 < 800ms
                      │         └─ observability: metrics + alerts
                      │
                      ├─ additionalInteractions: [CheckEmailUniquenessDBInteraction]
                      │    │
                      │    └─ @Interaction (Data, Query)
                      │         ├─ schema: accounts table
                      │         └─ queryOptimization: use email_unique_idx
                      │
                      └─ behaviors: [ValidateEmailFormatBehavior]
                           │
                           └─ @Behavior + @Witness (test coverage)
```

### Pattern 2: Conditional Branching with AI

```typescript
// Action with conditional triggers
@Action({
  name: 'AI Verifies Document',
  triggers: [
    {
      action: IdentityVerifiedAction,
      condition: 'aiConfidence >= 95'
    },
    {
      action: FlagForManualReviewAction,
      condition: 'aiConfidence < 95'
    }
  ]
})
export class AIVerifyDocumentAction {}

// High confidence path (digital continues)
@Action({
  name: 'Identity Verified',
  scope: ActionScope.Journey,
  emitsEvent: 'account.identity.verified',
  triggers: [{ action: CreateAccountRecordAction }]
})
export class IdentityVerifiedAction {}

// Low confidence path (escalate to human)
@Action({
  name: 'Flag For Manual Review',
  scope: ActionScope.Composite,
  triggers: [{ action: AssignToComplianceOfficerAction }]
  // This bridges to offline journey (covered in 04-offline-journey-decorators.md)
})
export class FlagForManualReviewAction {}
```

### Pattern 3: Parallel Action Execution

```typescript
@Action({
  name: 'Account Created',
  scope: ActionScope.Journey,
  emitsEvent: 'account.created',

  triggers: [
    // All three triggered simultaneously (no conditions = parallel)
    { action: IssueVirtualDebitCardAction },
    { action: SendWelcomeEmailAction },
    { action: CreateDefaultSavingsAccountAction }
  ],

  compensatingAction: RollbackAccountCreationAction  // If any parallel action fails
})
export class AccountCreatedAction {}
```

### Pattern 4: Frontend → Backend → Data Flow

```typescript
// 1. FRONTEND: User interaction
@Interaction({
  name: 'Account Opening Form Input',
  pattern: InteractionPattern.FormInteraction,
  layer: InteractionLayer.Frontend,
  frontendConfig: {
    framework: 'react-native',
    formValidation: { validationTiming: 'on-blur' }
  }
})
export class AccountOpeningFormInputInteraction {}

// 2. BACKEND: API call
@Interaction({
  name: 'Email Validation API',
  pattern: InteractionPattern.RequestResponse,
  layer: InteractionLayer.Backend,
  protocol: {
    http: { method: 'POST', path: '/api/v1/validate-email' }
  },
  backendConfig: {
    resilience: {
      circuitBreaker: { enabled: true, failureThreshold: 5 }
    }
  }
})
export class EmailValidationAPIInteraction {}

// 3. DATA: Database query
@Interaction({
  name: 'Check Email Uniqueness',
  pattern: InteractionPattern.Query,
  layer: InteractionLayer.Data,
  dataConfig: {
    schema: { tableName: 'accounts', indexes: ['email_unique_idx'] }
  }
})
export class CheckEmailUniquenessDBInteraction {}

// Expectation ties them together
@Expectation({
  name: 'Fast Email Validation',
  interaction: EmailValidationAPIInteraction,  // Primary
  additionalInteractions: [
    { interaction: CheckEmailUniquenessDBInteraction, role: 'persistence' }
  ]
})
export class FastEmailValidationExpectation {}
```

---

## Summary

Digital journeys leverage Aabha's decorator system to model **fast, automated, self-service experiences** with:

1. **@Journey**: Minimal container defining stakeholders, actions, and outcomes
2. **@Action**: Event-driven actions forming forward-looking DAG via `triggers`
3. **@Expectation**: Stakeholder contracts with SLO/SLI, linking Actions to Interactions
4. **@Interaction**: Layer-specific technical contracts (Frontend, Backend, Data, Device)

**Key Digital Characteristics:**
- Instant feedback (milliseconds to seconds)
- Fully/semi-automated actions
- Event-driven architecture (emitsEvent on Journey/System actions)
- Rich device integrations (camera, biometrics, GPS)
- Strong observability and monitoring

**Next:** See `04-offline-journey-decorators.md` for manual, branch-based, and organizational processes.
