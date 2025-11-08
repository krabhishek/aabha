# Aabha AI Primer: Behavioral Decorators

**File 6 of 7** | Implementation: HOW Things Work

This guide explains how Aabha models **HOW** expectations are implemented using `@Behavior`, `@Witness`, and `@Attribute` decorators. These decorators bridge the gap between business intent (what stakeholders want) and executable code (how it's implemented).

**CRITICAL**: `@Witness` is a **METHOD DECORATOR** (decorates methods inside `@Behavior` classes). `@Attribute` is a **CLASS DECORATOR** like all others (rare edge case for reusable data properties).

---

## Table of Contents

1. [@Behavior Decorator: Implementation Units](#behavior-decorator-implementation-units)
2. [@Witness Decorator: BDD-Style Verification (METHOD DECORATOR!)](#witness-decorator-bdd-style-verification)
3. [@Attribute Decorator: Reusable Property Definitions](#attribute-decorator-reusable-property-definitions)
4. [Complete Examples](#complete-examples)

---

## @Behavior Decorator: Implementation Units

### Core Concept

`★ Insight ─────────────────────────────────────`

**Behaviors** are the executable implementations that fulfill `@Expectation` contracts. While expectations define WHAT stakeholders want ("Email validated in <3 seconds with 99.9% accuracy"), behaviors define HOW the system delivers it ("RFC 5322 regex + DNS MX check + SMTP verification"). Expectations are stakeholder-facing promises; behaviors are engineering implementations.

`─────────────────────────────────────────────────`

### Behavior = Empty Class + Implementation Details

Just like other Aabha decorators, `@Behavior` decorates empty exported classes:

```typescript
@Behavior({
  name: 'ValidateEmailFormat',
  description: 'RFC 5322 email validation with DNS MX record verification',
  // ... implementation details
})
export class ValidateEmailFormatBehavior {}
```

### Anatomy of @Behavior

```typescript
@Behavior({
  // ===== CORE IDENTITY =====
  name: 'ValidateEmailFormat', // Required: clear name

  description: 'Validates email format using RFC 5322 regex, checks DNS MX records, performs SMTP mailbox verification',

  participants: [
    EmailValidationServiceStakeholder, // System stakeholder
    AuditLogSystemStakeholder,         // Audit trail
  ], // @Stakeholder class references

  // ===== IMPLEMENTATION SPECIFICATION =====
  implementation: `
    1. Validate format using RFC 5322 regex
    2. Extract domain from email
    3. Query DNS for MX records (fail if none)
    4. Optionally: SMTP mailbox verification (if configured)
    5. Return validation result with confidence score
  `,

  preconditions: [
    'Email address string is provided',
    'EmailValidationService is available',
  ],

  postconditions: [
    'Validation result (true/false) is returned',
    'Confidence score (0-100) is provided',
    'Audit log entry created with timestamp and result',
  ],

  sideEffects: [
    'DNS query executed (external call)',
    'SMTP connection opened (if mailbox verification enabled)',
    'Audit log record created in database',
  ],

  // ===== BEHAVIOR CLASSIFICATION =====
  complexity: BehaviorComplexity.Moderate, // Simple | Moderate | Complex

  scope: BehaviorScope.Atomic, // Atomic | Composite | Workflow

  reusability: BehaviorReusability.Reusable, // SingleUse | Reusable | Template

  // ===== PERFORMANCE & EXECUTION =====
  performance: {
    expectedDuration: '< 3 seconds', // Human-readable
    timeout: 5000,                   // 5 seconds (milliseconds)
    retries: 2,                      // Retry twice on failure
    cacheable: true,                 // Results can be cached
  },

  // ===== VALIDATION & INVARIANTS =====
  validation: {
    strictPreconditions: true,  // Fail fast if preconditions not met
    strictPostconditions: true, // Verify postconditions before returning
    invariants: [
      'Email format must be validated before DNS check',
      'Audit log must be immutable once created',
    ],
  },

  // ===== OBSERVABILITY & TRACING =====
  tracing: {
    enabled: true,
    metrics: [
      EmailValidationDurationMetric,  // @Metric class reference
      EmailValidationSuccessRateMetric,
      EmailValidationErrorRateMetric,
    ],
    logLevel: 'info', // 'error' | 'warn' | 'info' | 'debug'
  },

  // ===== METADATA =====
  tags: ['email', 'validation', 'reusable', 'external-service'],
})
export class ValidateEmailFormatBehavior {}
```

`★ Insight ─────────────────────────────────────`

**Behavior classification** (complexity, scope, reusability) helps AI understand implementation characteristics:
- **Complexity**: Simple (regex check) vs Complex (KYC with credit scoring + AML + compliance)
- **Scope**: Atomic (single operation) vs Composite (orchestrates multiple) vs Workflow (multi-step process)
- **Reusability**: Reusable (email validation used everywhere) vs SingleUse (Q4 2024 financial report)

AI uses this to estimate development effort, testing requirements, and risk assessment.

`─────────────────────────────────────────────────`

### Behavior Complexity Levels

```typescript
enum BehaviorComplexity {
  Simple = 'simple',      // Straightforward logic, minimal dependencies
  Moderate = 'moderate',  // Standard business logic, some dependencies
  Complex = 'complex',    // Intricate logic, many dependencies
}
```

**Examples:**
- **Simple**: Email format validation (regex), currency formatting, date parsing
- **Moderate**: User registration (validate + create account + send email), order processing
- **Complex**: KYC verification (AI + credit scoring + compliance), loan approval workflow, fraud detection

### Behavior Scope Levels

```typescript
enum BehaviorScope {
  Atomic = 'atomic',        // Single, indivisible operation
  Composite = 'composite',  // Orchestrates multiple behaviors
  Workflow = 'workflow',    // End-to-end business process
}
```

**Examples:**
- **Atomic**: Send single email, validate single field, update single record
- **Composite**: User registration = validate + create account + send welcome email
- **Workflow**: Loan approval = application → credit check → risk assessment → manual review → decision

### Behavior Reusability

```typescript
enum BehaviorReusability {
  SingleUse = 'single-use', // Specific to one context
  Reusable = 'reusable',    // General-purpose, used across contexts
  Template = 'template',    // Abstract pattern requiring customization
}
```

**Examples:**
- **SingleUse**: Generate Q4 2024 compliance report (one-time, context-specific)
- **Reusable**: Validate email (used in registration, profile update, password reset, etc.)
- **Template**: Generic approval workflow pattern (customize for loan, account, transaction approvals)

### Performance Configuration

```typescript
performance: {
  expectedDuration: '< 3 seconds',  // Human-readable expectation
  timeout: 5000,                    // Hard limit (milliseconds)
  retries: 2,                       // Automatic retries (for idempotent ops)
  cacheable: true,                  // Can results be cached?
}
```

`★ Insight ─────────────────────────────────────`

**Cacheability** is critical for performance optimization. If a behavior is **deterministic** (same input always produces same output, no side effects), set `cacheable: true`. Examples: currency conversion, tax calculation, email format validation. If a behavior has **side effects** (sends email, updates database, calls external API), set `cacheable: false`. AI systems can use this to automatically cache results and reduce redundant operations.

`─────────────────────────────────────────────────`

---

## @Witness Decorator: BDD-Style Verification

### **CRITICAL: @Witness is a METHOD DECORATOR!**

Unlike all other Aabha decorators (which decorate classes), `@Witness` decorates **METHODS** inside `@Behavior` classes.

```typescript
@Behavior({ name: 'ValidateEmail' })
export class ValidateEmailBehavior {
  // ⚠️ @Witness decorates THIS METHOD ↓
  @Witness({
    name: 'Valid Email Test',
    type: WitnessType.Unit,
    given: ['Email with valid format'],
    when: ['Validation executes'],
    then: ['Returns true'],
  })
  witnessValidFormat() {
    const result = this.validate('test@example.com');
    assert(result === true);
  }

  // Implementation method (NOT decorated)
  validate(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

### Core Concept

`★ Insight ─────────────────────────────────────`

**Witnesses** prove behaviors work correctly through executable tests. They follow **BDD (Behavior-Driven Development)** conventions: Given-When-Then. A witness without a behavior is meaningless—witnesses must exist inside `@Behavior` classes. Think of witnesses as "executable proofs" that the behavior fulfills its contract.

`─────────────────────────────────────────────────`

### Anatomy of @Witness

```typescript
@Behavior({ name: 'ProcessPayment' })
export class ProcessPaymentBehavior {
  @Witness({
    // ===== CORE IDENTITY =====
    name: 'Successful Payment Processing', // Required
    type: WitnessType.Integration,         // Unit | Integration | E2E | Acceptance | Performance | Security
    description: 'Validates successful payment processing with external gateway',
    scenario: 'User completes purchase with valid credit card',

    // ===== BDD (Given-When-Then) =====
    given: [
      'User is authenticated',
      'Cart has items totaling GD$99.99',
      'User has valid payment method on file',
      'Payment gateway is available',
    ],

    when: [
      'User clicks "Pay Now" button',
      'System submits payment to gateway',
      'Gateway returns success response',
    ],

    then: [
      'Payment is recorded in database with transaction ID',
      'Order status changes to "paid"',
      'Inventory is decremented',
      'Confirmation email is sent to user',
    ],

    // ===== TEST MANAGEMENT =====
    timeout: 30000, // 30 seconds (integration test)

    tags: ['payment', 'integration', 'critical', 'gateway'],

    skip: false, // Set to true to skip this test

    // ===== EXECUTION CONFIGURATION =====
    execution: {
      retries: 2, // Retry twice on failure (flaky external gateway)
      parallel: false, // Must run serially (modifies payment state)
      dependencies: ['witnessUserAuthentication'], // Run after auth witness
      priority: WitnessPriority.Critical, // Critical | High | Normal | Low
      isolationLevel: WitnessIsolationLevel.Method, // None | Method | Class | Suite
    },

    // ===== FIXTURES (Setup/Teardown) =====
    fixtures: {
      setup: 'setupPaymentGatewayMock',       // Method name for setup
      teardown: 'cleanupTestOrder',           // Method name for teardown
      dataProvider: 'getPaymentTestCases',    // Method providing test data
      mocks: ['PaymentGateway', 'EmailService'], // Services to mock
      sharedFixtures: ['testDatabase'],       // Shared from suite level
    },

    // ===== COVERAGE & TRACEABILITY =====
    coverage: {
      requirements: ['REQ-PAY-001', 'REQ-PAY-005'], // Requirement IDs
      tickets: ['JIRA-1234', 'JIRA-5678'],          // JIRA/ticket IDs
      riskLevel: WitnessRiskLevel.High,             // High | Medium | Low
      coverageScope: WitnessCoverageScope.Full,     // Full | Partial | EdgeCase
      traceabilityUrl: 'https://wiki.company.com/specs/payment',
    },
  })
  witnessSuccessfulPayment() {
    // Test implementation
    const payment = this.processPayment({
      userId: 'user-123',
      amount: 99.99,
      currency: 'GD$',
      paymentMethod: 'card-456',
    });

    assert(payment.status === 'success');
    assert(payment.transactionId !== null);
    // ... more assertions
  }

  // Other witness methods...
  @Witness({
    name: 'Insufficient Funds Rejection',
    type: WitnessType.Unit,
    given: ['User has GD$10 balance', 'Purchase amount is GD$100'],
    when: ['Payment processing is attempted'],
    then: ['Payment is rejected', 'Error message indicates insufficient funds'],
  })
  witnessInsufficientFundsRejection() {
    // Test implementation for rejection scenario
  }

  // Implementation methods (not decorated with @Witness)
  processPayment(request: PaymentRequest): PaymentResult {
    // Actual implementation
  }

  setupPaymentGatewayMock() {
    // Setup code for fixtures
  }

  cleanupTestOrder() {
    // Teardown code for fixtures
  }
}
```

`★ Insight ─────────────────────────────────────`

**Witness types** guide test execution strategy:
- **Unit** (fast, <100ms, isolated): Test individual functions/methods
- **Integration** (moderate, seconds, with dependencies): Test component interactions
- **E2E** (slow, minutes, full stack): Test complete user workflows
- **Acceptance** (stakeholder-facing, BDD scenarios): Validate business requirements
- **Performance** (measures latency/throughput): Ensure SLA compliance
- **Security** (validates auth/encryption/vulnerabilities): Prevent security breaches

AI test runners can optimize execution: run Unit tests first (fast feedback), then Integration, then E2E (slow but comprehensive).

`─────────────────────────────────────────────────`

### Witness Types

```typescript
enum WitnessType {
  Unit = 'unit',                // Fast, isolated, no external dependencies
  Integration = 'integration',  // Multiple components, databases, APIs
  E2E = 'e2e',                  // Complete user workflows, full stack
  Acceptance = 'acceptance',    // Business requirements validation (BDD)
  Performance = 'performance',  // Response time, throughput, SLA validation
  Security = 'security',        // Auth, authorization, vulnerabilities
}
```

### Witness Priority

```typescript
enum WitnessPriority {
  Critical = 'critical', // Must pass for deployment (blocks release)
  High = 'high',         // Important functionality (should pass)
  Normal = 'normal',     // Standard test priority (default)
  Low = 'low',           // Nice-to-have (doesn't block deployment)
}
```

### Witness Isolation Levels

```typescript
enum WitnessIsolationLevel {
  None = 'none',     // Tests share state (fastest but riskiest)
  Method = 'method', // Each test method gets fresh state (standard)
  Class = 'class',   // All tests in class share state
  Suite = 'suite',   // Tests across classes share state
}
```

### BDD Pattern: Given-When-Then

`★ Insight ─────────────────────────────────────`

**Given-When-Then** makes tests readable by stakeholders. "Given user has GD$1000 balance, When user transfers GD$500, Then source account has GD$500 remaining" is understandable by business analysts, not just engineers. This bridges the gap between technical tests and business requirements, enabling shared understanding across teams.

`─────────────────────────────────────────────────`

```typescript
@Witness({
  name: 'Transfer Between Own Accounts',
  given: [
    'User is authenticated',
    'Source account (checking) has GD$1000 balance',
    'Target account (savings) exists and belongs to same user',
  ],
  when: [
    'User initiates transfer of GD$500 from checking to savings',
    'System validates sufficient balance',
    'System processes transfer atomically',
  ],
  then: [
    'Source account balance is GD$500',
    'Target account balance increased by GD$500',
    'Transaction record created with unique ID',
    'Both balances updated in single transaction (atomic)',
  ],
})
witnessSuccessfulTransfer() {
  // Test implementation
}
```

---

## @Attribute Decorator: Reusable Property Definitions

### Core Concept

`★ Insight ─────────────────────────────────────`

**@Attribute is a CLASS DECORATOR** (like all Aabha decorators except @Witness) but represents a **rare edge case**. Use `@Attribute` ONLY when you have reusable data properties that don't fit elsewhere (not in persona demographics, not in stakeholder context, not in expectation quality metrics). Most Aabha modeling uses structured fields within other decorators. Only use `@Attribute` for truly cross-cutting data attributes that are referenced by multiple entities.

`─────────────────────────────────────────────────`

### When to Use @Attribute (Rare!)

Use `@Attribute` only when:
1. You have a reusable data property used across multiple entities
2. The property needs validation rules that should be consistent everywhere
3. The property doesn't fit into existing structured fields

**Example: Email validation** - If multiple entities (customer, employee, partner) all need email validation with the same rules, create an EmailAttribute:

```typescript
@Attribute({
  name: 'Email Address',
  type: 'string',
  required: true,
  validation: {
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    custom: 'RFC 5322 compliant',
  },
  description: 'Valid email address for contact purposes',
  tags: ['contact', 'validation', 'required'],
})
export class EmailAttribute {}
```

Then reference it in personas, stakeholders, or other entities:

```typescript
@Persona({
  type: PersonaType.Human,
  name: 'Marcus Lee',
  // Instead of duplicating validation rules, reference EmailAttribute
  contactAttributes: [EmailAttribute],
  // ...
})
export class MarcusLeePersona {}
```

### Anatomy of @Attribute

```typescript
@Attribute({
  // ===== IDENTITY =====
  name: 'Tax Identification Number', // Required

  type: 'string', // Data type (string, number, boolean, date, etc.)

  required: true, // Is this attribute mandatory?

  defaultValue: undefined, // Default value if not provided

  // ===== VALIDATION RULES =====
  validation: {
    min: 9,           // Minimum length/value
    max: 9,           // Maximum length/value
    pattern: '^\\d{9}$', // Regex pattern (9 digits)
    enum: undefined,  // Allowed values (for enums)
    custom: 'Must be valid Social Security Number format',
  },

  // ===== METADATA =====
  description: 'Tax identification number for compliance and reporting purposes (SSN, EIN, ITIN)',

  tags: ['tax', 'compliance', 'pii', 'required'],
})
export class TaxIDAttribute {}
```

### @Attribute Use Cases (All Rare!)

1. **Regulatory identifiers**: Tax ID, passport number, driver's license (shared validation)
2. **Financial amounts**: Currency fields with precision requirements (2 decimal places)
3. **Geographic data**: Address fields with geocoding validation
4. **Technical constraints**: UUID format, ISO date format (cross-cutting standards)

**Important**: If the data fits naturally into an existing decorator field (e.g., persona demographics, stakeholder contextualNeeds), use that instead. Don't create attributes unnecessarily.

---

## Complete Examples

### Example 1: Email Validation Behavior with Witnesses

```typescript
// File: src/model/behaviors/email-validation.behavior.ts

@Behavior({
  // ===== IDENTITY =====
  name: 'ValidateEmailFormat',
  description: 'RFC 5322 email format validation with DNS MX record verification and SMTP mailbox check',

  // ===== PARTICIPANTS =====
  participants: [
    EmailValidationServiceStakeholder, // External SaaS API
    AuditLogSystemStakeholder,         // Audit trail
  ],

  // ===== IMPLEMENTATION DETAILS =====
  implementation: `
    Step 1: Validate email format using RFC 5322 regex
    Step 2: Extract domain from email address
    Step 3: Query DNS for MX records (fail if domain has no mail server)
    Step 4: (Optional) SMTP mailbox verification - connect to mail server and verify mailbox exists
    Step 5: Return validation result with confidence score (0-100)
    Step 6: Log validation attempt to audit trail
  `,

  preconditions: [
    'Email address string is provided (non-null, non-empty)',
    'EmailValidationService API is available',
    'DNS resolver is accessible',
  ],

  postconditions: [
    'Validation result (valid: true/false) is returned',
    'Confidence score (0-100) is provided',
    'Detailed validation report (format, DNS, mailbox checks) included',
    'Audit log entry created with timestamp, input, result',
  ],

  sideEffects: [
    'DNS MX query executed (external network call)',
    'SMTP connection opened to target mail server (if mailbox verification enabled)',
    'Audit log record inserted into database',
    'Metrics incremented (validation count, success/failure rates)',
  ],

  // ===== CLASSIFICATION =====
  complexity: BehaviorComplexity.Moderate, // Multiple steps, external dependencies
  scope: BehaviorScope.Atomic,             // Single validation operation
  reusability: BehaviorReusability.Reusable, // Used in registration, profile update, etc.

  // ===== PERFORMANCE =====
  performance: {
    expectedDuration: '< 3 seconds', // Format check ~10ms, DNS ~100ms, SMTP ~2s
    timeout: 5000,                   // 5 second hard limit
    retries: 2,                      // Retry twice on network failures
    cacheable: true,                 // Cache results for 24 hours (same email)
  },

  // ===== VALIDATION =====
  validation: {
    strictPreconditions: true,
    strictPostconditions: true,
    invariants: [
      'Email format must pass before DNS check is performed',
      'Audit log must be append-only (no updates or deletes)',
      'Confidence score must be between 0-100',
    ],
  },

  // ===== OBSERVABILITY =====
  tracing: {
    enabled: true,
    metrics: [
      EmailValidationDurationMetric,
      EmailValidationSuccessRateMetric,
      DNSLookupDurationMetric,
      SMTPConnectionFailureRateMetric,
    ],
    logLevel: 'info',
  },

  // ===== METADATA =====
  tags: ['email', 'validation', 'reusable', 'external-service', 'critical-path'],
})
export class ValidateEmailFormatBehavior {
  // ============================================================
  // WITNESSES (BDD-style tests proving behavior works)
  // ============================================================

  @Witness({
    name: 'Valid Email Format - Happy Path',
    type: WitnessType.Unit,
    description: 'Validates that correctly formatted email passes all checks',

    given: [
      'Email address "marcus.lee@ogpgybank.com" is provided',
      'Domain "ogpgybank.com" has valid MX records',
      'SMTP mailbox verification is enabled',
    ],

    when: [
      'Email validation is executed',
      'RFC 5322 format check passes',
      'DNS MX lookup returns valid mail server',
      'SMTP connection confirms mailbox exists',
    ],

    then: [
      'Validation result returns valid = true',
      'Confidence score = 100 (all checks passed)',
      'Audit log contains successful validation entry',
      'No errors or warnings are raised',
    ],

    timeout: 5000,
    tags: ['happy-path', 'unit', 'email'],

    execution: {
      priority: WitnessPriority.Critical, // Core functionality
      isolationLevel: WitnessIsolationLevel.Method,
    },

    fixtures: {
      setup: 'setupValidEmailMock',
      teardown: 'cleanupAuditLog',
      mocks: ['EmailValidationService', 'DNSResolver'],
    },

    coverage: {
      requirements: ['REQ-EMAIL-001', 'REQ-EMAIL-002'],
      tickets: ['JIRA-123'],
      riskLevel: WitnessRiskLevel.High, // Critical for account opening
      coverageScope: WitnessCoverageScope.Partial, // Happy path only
    },
  })
  witnessValidEmailHappyPath() {
    const result = this.validate('marcus.lee@ogpgybank.com');

    assert(result.valid === true);
    assert(result.confidenceScore === 100);
    assert(result.checks.format === true);
    assert(result.checks.dnsMX === true);
    assert(result.checks.smtpMailbox === true);
  }

  @Witness({
    name: 'Invalid Email Format - Syntax Error',
    type: WitnessType.Unit,
    description: 'Rejects email with invalid syntax',

    given: ['Email address "invalid-email" is provided (no @ sign)'],
    when: ['Email validation is executed', 'RFC 5322 format check fails'],
    then: [
      'Validation returns valid = false',
      'Confidence score = 0',
      'Error message indicates "Invalid email format"',
      'DNS and SMTP checks are skipped (fail fast)',
    ],

    timeout: 1000, // Fast rejection (no network calls)
    tags: ['negative-case', 'unit', 'email'],

    execution: {
      priority: WitnessPriority.High,
      isolationLevel: WitnessIsolationLevel.Method,
    },
  })
  witnessInvalidEmailSyntax() {
    const result = this.validate('invalid-email'); // No @ sign

    assert(result.valid === false);
    assert(result.confidenceScore === 0);
    assert(result.error.includes('Invalid email format'));
  }

  @Witness({
    name: 'Valid Format but No MX Record',
    type: WitnessType.Integration,
    description: 'Rejects email with valid format but domain has no mail server',

    given: [
      'Email address "test@nonexistent-domain-xyz.com" is provided',
      'Format is valid',
      'DNS lookup for "nonexistent-domain-xyz.com" returns no MX records',
    ],

    when: ['Email validation executes', 'Format check passes', 'DNS MX lookup fails'],
    then: [
      'Validation returns valid = false',
      'Confidence score = 50 (format ok, but undeliverable)',
      'Error indicates "Domain has no mail server"',
    ],

    timeout: 5000,
    tags: ['negative-case', 'integration', 'dns'],

    execution: {
      retries: 1, // DNS queries can be flaky
      parallel: true,
      priority: WitnessPriority.High,
    },

    fixtures: {
      setup: 'setupNoMXRecordMock',
      mocks: ['DNSResolver'],
    },

    coverage: {
      requirements: ['REQ-EMAIL-003'],
      riskLevel: WitnessRiskLevel.Medium,
      coverageScope: WitnessCoverageScope.EdgeCase,
    },
  })
  witnessNoMXRecord() {
    const result = this.validate('test@nonexistent-domain-xyz.com');

    assert(result.valid === false);
    assert(result.confidenceScore === 50);
    assert(result.checks.format === true);
    assert(result.checks.dnsMX === false);
  }

  @Witness({
    name: 'Disposable Email Detection',
    type: WitnessType.Unit,
    description: 'Flags disposable/temporary email addresses',

    given: ['Email address "test@tempmail.com" is provided (disposable domain)'],
    when: ['Validation checks disposable email database'],
    then: [
      'Validation returns valid = false',
      'Warning flag indicates "Disposable email detected"',
      'Recommendation to reject or flag for manual review',
    ],

    tags: ['fraud-prevention', 'unit'],

    execution: {
      priority: WitnessPriority.Normal,
    },

    coverage: {
      requirements: ['REQ-FRAUD-001'],
      riskLevel: WitnessRiskLevel.Medium,
    },
  })
  witnessDisposableEmail() {
    const result = this.validate('test@tempmail.com');

    assert(result.valid === false);
    assert(result.warnings.includes('Disposable email detected'));
  }

  // ============================================================
  // IMPLEMENTATION METHODS (not decorated with @Witness)
  // ============================================================

  validate(email: string): EmailValidationResult {
    // Actual implementation code
    // (Not shown for brevity - would include RFC 5322 regex, DNS queries, SMTP verification)
  }

  // Fixture methods
  setupValidEmailMock() {
    // Mock setup code
  }

  setupNoMXRecordMock() {
    // Mock setup for no MX records scenario
  }

  cleanupAuditLog() {
    // Cleanup code
  }
}
```

`★ Insight ─────────────────────────────────────`

Notice the **witness coverage**: Happy path (WitnessCoverageScope.Partial) validates the main flow, while edge cases (invalid syntax, no MX record, disposable email) fill coverage gaps. Together, they approach WitnessCoverageScope.Full. AI test report generators can analyze witness coverage to identify untested scenarios and suggest missing test cases.

`─────────────────────────────────────────────────`

### Example 2: KYC Verification Behavior (Complex)

```typescript
// File: src/model/behaviors/kyc-verification.behavior.ts

@Behavior({
  name: 'VerifyCustomerIdentity',
  description: 'AI-powered KYC verification: document extraction, facial recognition, liveness detection, compliance checks',

  participants: [
    DocumentVerificationAIStakeholder,
    FacialRecognitionAPIStakeholder,
    ComplianceOfficerStakeholder, // Human review for low-confidence cases
    AuditLogSystemStakeholder,
  ],

  implementation: `
    Phase 1: Document Processing
    - Extract ID document type (passport, driver's license, national ID)
    - OCR text extraction (name, DOB, ID number, expiration date)
    - Security feature verification (holograms, watermarks, fonts)
    - Document authenticity AI model (detect forgeries, alterations)

    Phase 2: Facial Recognition
    - Extract face from ID photo
    - Extract face from user selfie
    - Facial matching (confidence score 0-100)
    - Liveness detection (ensure selfie is not a photo of a photo)

    Phase 3: Compliance Checks
    - Sanctions screening (OFAC, UN, EU lists)
    - PEP (Politically Exposed Person) check
    - Adverse media screening
    - Age verification (must be 18+)

    Phase 4: Decision
    - High confidence (≥95%): Auto-approve
    - Medium confidence (70-94%): Flag for manual review
    - Low confidence (<70%): Auto-reject with reason
  `,

  preconditions: [
    'Government-issued ID document image uploaded (min 1200x800px)',
    'User selfie image uploaded with clear face visibility',
    'Customer is not on internal blacklist',
  ],

  postconditions: [
    'Verification result (approved, manual_review, rejected) returned',
    'Confidence score (0-100) provided for each check',
    'Detailed verification report generated',
    'Audit trail recorded with all images and results',
    'If manual review required, ticket created for ComplianceOfficer',
  ],

  sideEffects: [
    'AI model inference executed (GPU compute cost)',
    'Facial recognition API called (billable API call)',
    'Sanctions database queried (OFAC, UN, EU lists)',
    'Audit log records inserted (images stored, GDPR-compliant)',
    'If manual review: Jira ticket created and assigned',
    'Metrics updated (verification count, success/failure, AI confidence distribution)',
  ],

  complexity: BehaviorComplexity.Complex, // AI models, multiple integrations, compliance
  scope: BehaviorScope.Composite,         // Orchestrates document + facial + compliance
  reusability: BehaviorReusability.Template, // Template for all KYC scenarios

  performance: {
    expectedDuration: '< 30 seconds', // AI inference ~10s, sanctions check ~5s
    timeout: 60000,                   // 60 second timeout
    retries: 0,                       // No retries (non-idempotent - creates audit records)
    cacheable: false,                 // Never cache (unique per user, time-sensitive)
  },

  validation: {
    strictPreconditions: true,
    strictPostconditions: true,
    invariants: [
      'All verification steps must be logged to audit trail',
      'Personal data must be encrypted at rest',
      'Results must be deterministic for same input (AI model version locked)',
      'Manual review tickets must be created within 1 minute of low-confidence result',
    ],
  },

  tracing: {
    enabled: true,
    metrics: [
      KYCVerificationDurationMetric,
      KYCAutoApprovalRateMetric,
      KYCManualReviewRateMetric,
      KYCRejectionRateMetric,
      AIConfidenceDistributionMetric,
      FacialMatchConfidenceMetric,
    ],
    logLevel: 'info',
  },

  tags: ['kyc', 'identity', 'ai', 'compliance', 'complex', 'critical-path'],
})
export class VerifyCustomerIdentityBehavior {
  @Witness({
    name: 'High Confidence Auto-Approval',
    type: WitnessType.Integration,
    description: 'AI confidently verifies identity, auto-approves without human review',

    given: [
      'Valid passport image uploaded',
      'Clear selfie with face matching passport photo',
      'Customer is not on sanctions list',
      'Customer is 25 years old (age ≥ 18)',
    ],

    when: [
      'KYC verification executes',
      'Document authenticity AI returns 98% confidence',
      'Facial matching returns 96% confidence',
      'Liveness detection passes',
      'Sanctions screening returns no matches',
    ],

    then: [
      'Verification result = approved',
      'Overall confidence score ≥ 95%',
      'No manual review ticket created',
      'Account opening can proceed immediately',
      'Audit log records all checks and results',
    ],

    timeout: 60000,
    tags: ['happy-path', 'integration', 'ai', 'kyc'],

    execution: {
      retries: 0,
      parallel: false,
      priority: WitnessPriority.Critical,
      isolationLevel: WitnessIsolationLevel.Method,
    },

    fixtures: {
      setup: 'setupHighConfidenceMocks',
      teardown: 'cleanupTestData',
      mocks: ['DocumentVerificationAI', 'FacialRecognitionAPI', 'SanctionsDatabase'],
    },

    coverage: {
      requirements: ['REQ-KYC-001', 'REQ-KYC-002', 'REQ-AI-001'],
      tickets: ['JIRA-456'],
      riskLevel: WitnessRiskLevel.High,
      coverageScope: WitnessCoverageScope.Partial,
      traceabilityUrl: 'https://wiki.ogpgybank.com/specs/kyc-verification',
    },
  })
  witnessHighConfidenceAutoApproval() {
    const result = this.verify({
      idDocument: 'passport-image-high-quality.jpg',
      selfie: 'selfie-clear-face.jpg',
      customerData: { age: 25, name: 'Marcus Lee' },
    });

    assert(result.decision === 'approved');
    assert(result.confidenceScore >= 95);
    assert(result.checks.documentAuthenticity >= 95);
    assert(result.checks.facialMatch >= 95);
    assert(result.checks.livenessDetection === true);
    assert(result.checks.sanctionsScreening === 'clear');
    assert(result.manualReviewRequired === false);
  }

  @Witness({
    name: 'Low Confidence - Manual Review',
    type: WitnessType.Integration,
    description: 'AI has medium confidence, flags for manual review by ComplianceOfficer',

    given: [
      'ID document image is slightly blurry (low quality)',
      'Facial match confidence is 85% (above threshold but not high)',
    ],

    when: [
      'KYC verification executes',
      'Document authenticity AI returns 88% confidence (medium)',
      'Overall confidence is 85% (between 70-94%)',
    ],

    then: [
      'Verification result = manual_review',
      'Jira ticket created and assigned to ComplianceOfficer queue',
      'Account opening is paused (pending manual review)',
      'Customer notified: "Verification in progress, review within 2 business days"',
    ],

    timeout: 60000,
    tags: ['manual-review', 'integration', 'compliance'],

    execution: {
      priority: WitnessPriority.High,
    },

    fixtures: {
      setup: 'setupMediumConfidenceMocks',
      teardown: 'cleanupTestData',
      mocks: ['DocumentVerificationAI', 'FacialRecognitionAPI', 'JiraAPI'],
    },

    coverage: {
      requirements: ['REQ-KYC-003', 'REQ-COMPLIANCE-001'],
      riskLevel: WitnessRiskLevel.High,
      coverageScope: WitnessCoverageScope.EdgeCase,
    },
  })
  witnessMediumConfidenceManualReview() {
    const result = this.verify({
      idDocument: 'passport-image-blurry.jpg',
      selfie: 'selfie-ok.jpg',
      customerData: { age: 30, name: 'Priya Kumar' },
    });

    assert(result.decision === 'manual_review');
    assert(result.confidenceScore >= 70 && result.confidenceScore < 95);
    assert(result.manualReviewRequired === true);
    assert(result.jiraTicket !== null);
    assert(result.jiraTicket.status === 'open');
  }

  @Witness({
    name: 'Sanctions List Match - Auto-Reject',
    type: WitnessType.Integration,
    description: 'Customer matches sanctions list, automatic rejection',

    given: ['Customer name matches OFAC sanctions list'],
    when: ['Sanctions screening executes', 'Match found with 95% confidence'],
    then: [
      'Verification result = rejected',
      'Rejection reason = "Sanctions list match"',
      'Account opening blocked permanently',
      'ComplianceOfficer notified immediately',
      'High-priority alert created',
    ],

    timeout: 30000,
    tags: ['sanctions', 'compliance', 'critical'],

    execution: {
      priority: WitnessPriority.Critical,
    },

    fixtures: {
      mocks: ['SanctionsDatabase'],
    },

    coverage: {
      requirements: ['REQ-COMPLIANCE-002', 'REQ-AML-001'],
      riskLevel: WitnessRiskLevel.High,
      coverageScope: WitnessCoverageScope.Full,
    },
  })
  witnessSanctionsListMatch() {
    const result = this.verify({
      idDocument: 'passport.jpg',
      selfie: 'selfie.jpg',
      customerData: { age: 40, name: 'Known Bad Actor' }, // On OFAC list
    });

    assert(result.decision === 'rejected');
    assert(result.rejectionReason.includes('Sanctions list match'));
    assert(result.checks.sanctionsScreening === 'match_found');
    assert(result.alertSent === true);
  }

  // Implementation method
  verify(input: KYCVerificationInput): KYCVerificationResult {
    // Actual implementation (AI models, API calls, compliance checks)
  }

  // Fixture methods
  setupHighConfidenceMocks() {}
  setupMediumConfidenceMocks() {}
  cleanupTestData() {}
}
```

---

## Key Takeaways

`★ Insight ─────────────────────────────────────`

**Behavior → Witness relationship:**
- **@Behavior**: HOW the system implements expectations (RFC 5322 + DNS + SMTP for email validation)
- **@Witness (METHOD DECORATOR!)**: Executable proofs that behaviors work (unit tests, integration tests, E2E tests)
- **One Behavior → Many Witnesses**: ValidateEmailBehavior has witnessValidFormat, witnessInvalidSyntax, witnessNoMXRecord, witnessDisposableEmail
- **BDD Given-When-Then**: Makes tests readable by non-engineers ("Given user has $1000, When transfer $500, Then balance is $500")
- **Test taxonomy**: WitnessType (Unit/Integration/E2E), WitnessPriority (Critical/High/Normal/Low), WitnessRiskLevel (High/Medium/Low) guide test execution strategy
- **Attributes are rare**: Only use @Attribute for truly reusable cross-cutting data (tax ID, email format with shared validation rules)

`─────────────────────────────────────────────────`

1. **@Behavior**: Executable implementation units with performance, validation, observability config
2. **@Witness (METHOD DECORATOR!)**: BDD-style test methods inside @Behavior classes proving behaviors work
3. **@Attribute (RARE!)**: Reusable property definitions with validation rules (only for cross-cutting data)
4. **Behavior classification**: Complexity (Simple/Moderate/Complex), Scope (Atomic/Composite/Workflow), Reusability (SingleUse/Reusable/Template)
5. **Witness types**: Unit (fast, isolated) → Integration (multi-component) → E2E (full stack) → Acceptance (business validation) → Performance (SLA) → Security (vulnerabilities)
6. **Given-When-Then**: Makes tests stakeholder-readable, bridges business ↔ technical gap
7. **Compile-time safety**: `participants: WithStakeholder<Constructor>[]`, `metrics: WithMetric<Constructor>[]` ensures type-safe references

---

**Next**: [File 7: Composition Patterns](./07-composition-patterns.md) - How all decorators work together to model complete business processes (decorator hierarchy, integration scenarios, anti-patterns, migration guide)
