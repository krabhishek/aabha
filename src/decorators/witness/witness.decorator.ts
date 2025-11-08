/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @Witness Decorator
 * Marks a method as a Witness (verification witness for a behavior)
 * @module aabha/decorators/witness
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import type { WithWitness, BaseDecoratorOptions } from '../../types/index.js';
import { applyBrand } from '../../internal/brand.utils.js';

// ============================================================================
// Enumerations
// ============================================================================

/**
 * Witness type enumeration - defines the scope and nature of the test
 */
export enum WitnessType {
  /**
   * Unit test - Tests individual functions/methods in isolation
   * Typically fast (<100ms), no external dependencies
   */
  Unit = 'unit',

  /**
   * Integration test - Tests interaction between multiple components
   * May involve databases, APIs, or services
   */
  Integration = 'integration',

  /**
   * End-to-end test - Tests complete user workflows
   * Involves full system stack including UI, backend, database
   */
  E2E = 'e2e',

  /**
   * Acceptance test - Validates business requirements and user stories
   * Often maps to Given-When-Then scenarios from stakeholders
   */
  Acceptance = 'acceptance',

  /**
   * Performance test - Measures response time, throughput, scalability
   * Validates system meets performance SLAs
   */
  Performance = 'performance',

  /**
   * Security test - Validates security controls and vulnerabilities
   * Tests authentication, authorization, data protection
   */
  Security = 'security',
}

/**
 * Test execution priority levels
 */
export enum WitnessPriority {
  /**
   * Critical - Must pass for deployment (e.g., security, data integrity)
   * Blocks release if fails
   */
  Critical = 'critical',

  /**
   * High - Important functionality (e.g., core user workflows)
   * Should pass before deployment
   */
  High = 'high',

  /**
   * Normal - Standard test priority
   * Default for most tests
   */
  Normal = 'normal',

  /**
   * Low - Nice-to-have validation (e.g., edge cases, cosmetic issues)
   * Failure doesn't block deployment
   */
  Low = 'low',
}

/**
 * Test isolation levels - defines how test state is managed
 */
export enum WitnessIsolationLevel {
  /**
   * None - No isolation, tests share state
   * Fastest but riskiest - test order matters
   */
  None = 'none',

  /**
   * Method - Each test method gets fresh state
   * Standard isolation level for most tests
   */
  Method = 'method',

  /**
   * Class - All tests in class share state, but isolated from other classes
   * Useful for expensive setup shared across multiple tests
   */
  Class = 'class',

  /**
   * Suite - Tests across classes share state within test suite
   * Rare - used for complex integration scenarios
   */
  Suite = 'suite',
}

/**
 * Risk level classification for tested functionality
 */
export enum WitnessRiskLevel {
  /**
   * High risk - Critical business functionality or security concerns
   * Failure has severe consequences (e.g., data loss, security breach)
   */
  High = 'high',

  /**
   * Medium risk - Important functionality with moderate impact
   * Failure affects user experience but not catastrophic
   */
  Medium = 'medium',

  /**
   * Low risk - Minor functionality with minimal impact
   * Failure is inconvenient but not critical
   */
  Low = 'low',
}

/**
 * Coverage scope - what aspect of behavior this witness covers
 */
export enum WitnessCoverageScope {
  /**
   * Full coverage - Tests complete behavior from start to finish
   * All paths, edge cases, and error conditions covered
   */
  Full = 'full',

  /**
   * Partial coverage - Tests main path but not all edge cases
   * Happy path covered, some error scenarios may be missing
   */
  Partial = 'partial',

  /**
   * Edge case coverage - Specifically tests boundary conditions
   * Focuses on unusual inputs, error conditions, race conditions
   */
  EdgeCase = 'edge-case',
}

// ============================================================================
// Sub-Interfaces
// ============================================================================

/**
 * Test execution configuration
 *
 * Defines how the witness should be executed, including retry logic,
 * parallelization, dependencies, and priority.
 *
 * @example
 * ```typescript
 * execution: {
 *   retries: 3,                // Retry up to 3 times on failure
 *   parallel: false,           // Must run serially (not parallel)
 *   dependencies: ['witnessAuth'],  // Run after auth witness
 *   priority: WitnessPriority.Critical,  // Critical test
 *   isolationLevel: WitnessIsolationLevel.Method  // Fresh state per test
 * }
 * ```
 */
export interface WitnessExecution {
  /**
   * Number of retry attempts on failure
   *
   * Useful for flaky tests (e.g., external API calls, timing-dependent tests).
   * Set to 0 for no retries (default).
   *
   * @default 0
   * @example
   * ```typescript
   * retries: 3  // Retry up to 3 times before marking as failed
   * ```
   */
  retries?: number;

  /**
   * Can this witness run in parallel with others?
   *
   * Set to false if the witness modifies shared state or requires exclusive
   * access to resources (e.g., database, file system).
   *
   * @default true
   * @example
   * ```typescript
   * parallel: false  // Must run serially, not in parallel
   * ```
   */
  parallel?: boolean;

  /**
   * Other witness method names that must complete before this one
   *
   * Use method names (not full witness names) to declare dependencies.
   * Test runner will order execution accordingly.
   *
   * @example
   * ```typescript
   * dependencies: ['witnessUserAuthentication', 'witnessDataSetup']
   * // This witness runs after the two dependency witnesses complete
   * ```
   */
  dependencies?: string[];

  /**
   * Execution priority level
   *
   * Critical/High priority tests run first. Use for smoke tests,
   * security tests, or tests that validate deployment readiness.
   *
   * @default WitnessPriority.Normal
   * @example
   * ```typescript
   * priority: WitnessPriority.Critical  // Runs before other tests
   * ```
   */
  priority?: WitnessPriority;

  /**
   * Test isolation level
   *
   * Defines whether test state is isolated per method, per class, or shared.
   * Higher isolation = more predictable but slower. Lower isolation = faster but riskier.
   *
   * @default WitnessIsolationLevel.Method
   * @example
   * ```typescript
   * isolationLevel: WitnessIsolationLevel.Class
   * // Share setup across all tests in this behavior class
   * ```
   */
  isolationLevel?: WitnessIsolationLevel;
}

/**
 * Test fixture configuration
 *
 * Defines setup, teardown, data providers, and mocks for the witness.
 * Makes test dependencies explicit and enables fixture reuse.
 *
 * @example
 * ```typescript
 * fixtures: {
 *   setup: 'setupTestData',           // Method to call before test
 *   teardown: 'cleanupTestData',      // Method to call after test
 *   dataProvider: 'getValidEmails',   // Method that provides test data
 *   mocks: ['UserService', 'EmailService'],  // Services to mock
 *   sharedFixtures: ['databaseConnection']   // Shared from behavior/suite
 * }
 * ```
 */
export interface WitnessFixtures {
  /**
   * Setup method name (called before test execution)
   *
   * Method must exist in the same @Behavior class.
   * Use for test data creation, mock initialization, etc.
   *
   * @example
   * ```typescript
   * setup: 'setupTestUser'
   * // Calls this.setupTestUser() before running witness
   * ```
   */
  setup?: string;

  /**
   * Teardown method name (called after test execution)
   *
   * Method must exist in the same @Behavior class.
   * Use for cleanup, resource disposal, mock restoration.
   * Runs even if test fails (like finally block).
   *
   * @example
   * ```typescript
   * teardown: 'cleanupDatabase'
   * // Calls this.cleanupDatabase() after witness completes
   * ```
   */
  teardown?: string;

  /**
   * Data provider method name for parameterized tests
   *
   * Method should return an array of test data sets.
   * Witness runs once for each data set provided.
   *
   * @example
   * ```typescript
   * dataProvider: 'getInvalidEmails'
   * // Method returns: [
   * //   { email: 'invalid', expected: false },
   * //   { email: '@nouser.com', expected: false }
   * // ]
   * // Witness runs twice with each data set
   * ```
   */
  dataProvider?: string;

  /**
   * Mock configurations to apply
   *
   * List of service/class names to mock during test execution.
   * Framework-agnostic - actual mocking handled by test framework.
   *
   * @example
   * ```typescript
   * mocks: ['EmailService', 'PaymentGateway', 'NotificationService']
   * // These services are mocked during witness execution
   * ```
   */
  mocks?: string[];

  /**
   * Shared fixture names from behavior or suite level
   *
   * References fixtures set up at behavior/suite level that this
   * witness depends on (e.g., database connection, test server).
   *
   * @example
   * ```typescript
   * sharedFixtures: ['testDatabase', 'mockApiServer']
   * // Uses fixtures set up at suite level
   * ```
   */
  sharedFixtures?: string[];
}

/**
 * Test coverage and traceability information
 *
 * Links witnesses to requirements, tracks risk level, and provides
 * traceability for compliance and audit purposes.
 *
 * @example
 * ```typescript
 * coverage: {
 *   requirements: ['REQ-AUTH-001', 'REQ-SEC-042'],
 *   tickets: ['JIRA-1234', 'JIRA-5678'],
 *   riskLevel: WitnessRiskLevel.High,
 *   coverageScope: WitnessCoverageScope.Full,
 *   traceabilityUrl: 'https://wiki.company.com/requirements/auth'
 * }
 * ```
 */
export interface WitnessCoverage {
  /**
   * Requirement IDs being verified by this witness
   *
   * Use your organization's requirement ID format.
   * Enables requirement → test traceability reports.
   *
   * @example
   * ```typescript
   * requirements: ['REQ-AUTH-001', 'REQ-AUTH-002']
   * // This witness verifies two authentication requirements
   * ```
   */
  requirements?: string[];

  /**
   * Ticket/story IDs related to this witness
   *
   * Links witness to JIRA tickets, user stories, bug reports.
   * Enables ticket → test traceability.
   *
   * @example
   * ```typescript
   * tickets: ['JIRA-1234', 'BUG-5678']
   * // Witness validates fix for JIRA-1234 and BUG-5678
   * ```
   */
  tickets?: string[];

  /**
   * Risk level of functionality being tested
   *
   * High risk = critical business impact if fails (security, data integrity, payments).
   * Medium risk = important but not catastrophic (user experience, performance).
   * Low risk = nice-to-have (cosmetic issues, edge cases).
   *
   * @example
   * ```typescript
   * riskLevel: WitnessRiskLevel.High
   * // Payment processing = high risk functionality
   * ```
   */
  riskLevel?: WitnessRiskLevel;

  /**
   * Coverage scope - what aspect of behavior is covered
   *
   * Full = complete paths including errors and edge cases.
   * Partial = main happy path, some edge cases missing.
   * EdgeCase = specifically tests boundary conditions.
   *
   * @example
   * ```typescript
   * coverageScope: WitnessCoverageScope.Full
   * // Tests all paths, errors, and edge cases
   * ```
   */
  coverageScope?: WitnessCoverageScope;

  /**
   * URL to detailed requirements or test documentation
   *
   * Link to wiki, requirements doc, test plan, or design document.
   * Provides context for why this witness exists.
   *
   * @example
   * ```typescript
   * traceabilityUrl: 'https://wiki.company.com/specs/authentication'
   * // Links to detailed authentication requirements
   * ```
   */
  traceabilityUrl?: string;
}

// ============================================================================
// Main Options Interface
// ============================================================================

/**
 * Witness decorator options
 *
 * Defines a verification test (witness) for a behavior. Witnesses prove that
 * behaviors work correctly through executable tests.
 *
 * @example Basic Usage
 * ```typescript
 * @Witness({
 *   name: 'Valid Email Format Test',
 *   type: WitnessType.Unit,
 *   given: ['Email address is provided'],
 *   when: ['Email validation is executed'],
 *   then: ['Valid emails pass', 'Invalid emails are rejected']
 * })
 * witnessEmailValidation() {
 *   // Test implementation
 * }
 * ```
 *
 * @example Advanced Usage with Sub-Interfaces
 * ```typescript
 * @Witness({
 *   name: 'Payment Processing Integration Test',
 *   type: WitnessType.Integration,
 *   description: 'Validates end-to-end payment flow with external gateway',
 *   scenario: 'User completes purchase with credit card',
 *   given: [
 *     'User has valid payment method',
 *     'Cart has items totaling $99.99',
 *     'Payment gateway is available'
 *   ],
 *   when: [
 *     'User clicks "Pay Now"',
 *     'System submits payment to gateway',
 *     'Gateway returns success'
 *   ],
 *   then: [
 *     'Payment is recorded in database',
 *     'Order status changes to "paid"',
 *     'Confirmation email is sent'
 *   ],
 *   timeout: 30000,
 *   execution: {
 *     retries: 2,
 *     parallel: false,
 *     dependencies: ['witnessUserAuthentication'],
 *     priority: WitnessPriority.Critical,
 *     isolationLevel: WitnessIsolationLevel.Method
 *   },
 *   fixtures: {
 *     setup: 'setupPaymentGatewayMock',
 *     teardown: 'cleanupTestOrder',
 *     mocks: ['PaymentGateway', 'EmailService']
 *   },
 *   coverage: {
 *     requirements: ['REQ-PAY-001', 'REQ-PAY-005'],
 *     tickets: ['JIRA-1234'],
 *     riskLevel: WitnessRiskLevel.High,
 *     coverageScope: WitnessCoverageScope.Full,
 *     traceabilityUrl: 'https://wiki.company.com/specs/payment'
 *   }
 * })
 * witnessPaymentProcessing() {
 *   // Integration test implementation
 * }
 * ```
 */
export interface WitnessOptions extends BaseDecoratorOptions {
  // ----------------------------------------
  // Core Fields (Required & Basic)
  // ----------------------------------------

  /**
   * Witness name (required)
   *
   * Short, descriptive name for the witness. Should clearly indicate what
   * is being verified.
   *
   * @example
   * ```typescript
   * name: 'Valid Email Format Test'
   * name: 'Payment Processing Integration Test'
   * name: 'Negative Amount Rejection Test'
   * ```
   */
  name: string;

  /**
   * Type of witness
   *
   * Categorizes the witness by scope: unit, integration, e2e, acceptance,
   * performance, or security. Affects default timeout expectations and
   * test runner configuration.
   *
   * @default undefined (unspecified)
   * @example
   * ```typescript
   * type: WitnessType.Unit         // Fast, isolated tests
   * type: WitnessType.Integration  // Tests multiple components
   * type: WitnessType.E2E          // Full stack tests
   * ```
   */
  type?: WitnessType;

  /**
   * Witness description
   *
   * Detailed explanation of what this witness verifies and why it matters.
   *
   * @example
   * ```typescript
   * description: 'Validates that email addresses are properly formatted according to RFC 5322'
   * ```
   */
  description?: string;

  /**
   * Witness scenario/case
   *
   * High-level test scenario in plain language. Often maps to user story
   * or acceptance criteria.
   *
   * @example
   * ```typescript
   * scenario: 'User successfully transfers funds between their own accounts'
   * scenario: 'System rejects transaction when account has insufficient balance'
   * ```
   */
  scenario?: string;

  // ----------------------------------------
  // BDD (Behavior-Driven Development) Fields
  // ----------------------------------------

  /**
   * Given conditions (preconditions)
   *
   * List of preconditions that must be true before the test executes.
   * Follows BDD "Given" convention.
   *
   * @example
   * ```typescript
   * given: [
   *   'User is authenticated',
   *   'Source account has $1000 balance',
   *   'Target account exists'
   * ]
   * ```
   */
  given?: string[];

  /**
   * When actions (test actions)
   *
   * List of actions performed during the test. Follows BDD "When" convention.
   *
   * @example
   * ```typescript
   * when: [
   *   'User initiates transfer of $500',
   *   'System validates balance',
   *   'System processes transfer'
   * ]
   * ```
   */
  when?: string[];

  /**
   * Then assertions (expected outcomes)
   *
   * List of expected outcomes that are verified by assertions.
   * Follows BDD "Then" convention.
   *
   * @example
   * ```typescript
   * then: [
   *   'Source account balance is $500',
   *   'Target account balance increased by $500',
   *   'Transaction record is created'
   * ]
   * ```
   */
  then?: string[];

  // ----------------------------------------
  // Test Management Fields
  // ----------------------------------------

  /**
   * Tags for categorization
   *
   * Labels for grouping and filtering tests (e.g., 'smoke', 'regression',
   * 'authentication', 'payments').
   *
   * @example
   * ```typescript
   * tags: ['smoke', 'authentication', 'critical']
   * tags: ['regression', 'payments', 'integration']
   * ```
   */
  tags?: string[];

  /**
   * Is this witness skipped?
   *
   * Set to true to skip execution (e.g., temporarily disabled, known flaky test).
   * Most test frameworks respect this flag.
   *
   * @default false
   * @example
   * ```typescript
   * skip: true  // Test will not run
   * ```
   */
  skip?: boolean;

  /**
   * Witness timeout in milliseconds
   *
   * Maximum time allowed for test execution. Test fails if exceeded.
   * Recommended timeouts by type:
   * - Unit: 100-1000ms
   * - Integration: 5000-30000ms (5-30 seconds)
   * - E2E: 30000-300000ms (30 seconds - 5 minutes)
   *
   * @example
   * ```typescript
   * timeout: 5000   // Fail if test takes longer than 5 seconds
   * timeout: 30000  // 30 second timeout for integration test
   * ```
   */
  timeout?: number;

  // ----------------------------------------
  // Structured Sub-Interfaces (New!)
  // ----------------------------------------

  /**
   * Test execution configuration
   *
   * Defines retry logic, parallelization, dependencies, and priority.
   *
   * @see WitnessExecution
   * @example
   * ```typescript
   * execution: {
   *   retries: 3,
   *   parallel: false,
   *   dependencies: ['witnessSetup'],
   *   priority: WitnessPriority.Critical
   * }
   * ```
   */
  execution?: WitnessExecution;

  /**
   * Test fixture configuration
   *
   * Defines setup, teardown, data providers, and mocks.
   *
   * @see WitnessFixtures
   * @example
   * ```typescript
   * fixtures: {
   *   setup: 'setupTestData',
   *   teardown: 'cleanupDatabase',
   *   mocks: ['EmailService', 'PaymentGateway']
   * }
   * ```
   */
  fixtures?: WitnessFixtures;

  /**
   * Test coverage and traceability
   *
   * Links to requirements, tickets, risk level, and documentation.
   *
   * @see WitnessCoverage
   * @example
   * ```typescript
   * coverage: {
   *   requirements: ['REQ-AUTH-001'],
   *   tickets: ['JIRA-1234'],
   *   riskLevel: WitnessRiskLevel.High,
   *   traceabilityUrl: 'https://wiki.company.com/specs/auth'
   * }
   * ```
   */
  coverage?: WitnessCoverage;
}

/**
 * @Witness decorator
 * Marks a method as a Witness with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Witnesses prove that behaviors work correctly. They must exist within
 * a @Behavior decorated class. A witness without a behavior is meaningless.
 *
 * @param options - Witness configuration
 * @returns Method decorator
 *
 * @example
 * ```typescript
 * @Behavior({
 *   name: 'ValidatePositiveAmount',
 *   participants: [CustomerStakeholder, BankingSystemStakeholder]
 * })
 * class ValidatePositiveAmountBehavior {
 *   @Witness({
 *     name: 'Positive Amount Witness',
 *     type: WitnessType.Unit,
 *     given: ['Amount is a positive number'],
 *     when: ['Validation is executed'],
 *     then: ['Validation returns true', 'No errors are thrown'],
 *   })
 *   witnessPositiveAmount() {
 *     const result = this.validate(100);
 *     assert(result === true);
 *   }
 *
 *   validate(amount: number): boolean {
 *     return amount > 0;
 *   }
 * }
 * ```
 */
export function Witness(options: WitnessOptions) {
  return function <This, Return>(
    target: (this: This, ...args: any[]) => Return,
    _context?: ClassMethodDecoratorContext<This, (this: This, ...args: any[]) => Return>
  ): ((this: This, ...args: any[]) => Return) & WithWitness {
    // Apply brand for compile-time tracking
    applyBrand(target as any, 'witness');
    void options;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return target as any;
  };
}
