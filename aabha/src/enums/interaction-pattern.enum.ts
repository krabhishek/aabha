/**
 * Interaction Pattern Enumeration
 * @module aabha/enums/interaction-pattern
 *
 * Defines how stakeholders interact across all layers (Frontend, Backend, Data, Device, etc.).
 * Enhanced to support frontend UI patterns, device interactions, data operations, and orchestration.
 */

/**
 * Interaction Pattern
 *
 * Specifies the communication pattern for interactions across multiple layers:
 *
 * **Backend Service Patterns** (4):
 * - RequestResponse: Synchronous API calls
 * - Event: Asynchronous pub/sub
 * - Streaming: Continuous data streams
 * - Batch: Scheduled bulk processing
 *
 * **Frontend UI Patterns** (4):
 * - UserGesture: User interactions (taps, clicks, swipes)
 * - FormInteraction: Form input and validation
 * - Navigation: Screen transitions and routing
 * - UIStateChange: Component re-rendering and animations
 *
 * **Device/Hardware Patterns** (3):
 * - SensorRead: Camera, GPS, biometric sensors
 * - DeviceNotification: Push/local notifications
 * - LocalStorage: Device storage access
 *
 * **Data Access Patterns** (3):
 * - Query: Read operations (SELECT)
 * - Command: Write operations (INSERT/UPDATE/DELETE)
 * - Transaction: ACID transactions
 *
 * **Real-Time Patterns** (3):
 * - ServerSentEvents: One-way server push
 * - WebSocket: Bidirectional real-time
 * - Polling: Client-initiated periodic checks
 *
 * **Orchestration Patterns** (2):
 * - Workflow: Multi-step orchestration (saga pattern)
 * - Choreography: Decentralized event-driven coordination
 */
export enum InteractionPattern {
  // ===== BACKEND SERVICE PATTERNS =====

  /**
   * Synchronous request-response
   * Consumer sends request, provider responds immediately
   * Layer: Backend
   * Example: REST API call, GraphQL query, gRPC unary call
   */
  RequestResponse = 'request-response',

  /**
   * Asynchronous event-driven
   * Provider publishes events, consumers subscribe
   * Layer: Backend
   * Example: Account created notification, payment processed event, audit log event
   */
  Event = 'event',

  /**
   * Continuous data streaming
   * Provider streams data continuously to consumer
   * Layer: Backend
   * Example: Real-time market data, live transaction feed, log streaming
   */
  Streaming = 'streaming',

  /**
   * Batch processing
   * Provider processes requests in scheduled batches
   * Layer: Backend
   * Example: Nightly reconciliation, monthly report generation, ETL jobs
   */
  Batch = 'batch',

  // ===== FRONTEND UI PATTERNS =====

  /**
   * User gesture interaction
   * User performs physical interaction with UI
   * Layer: Frontend
   * Example: Button tap, screen swipe, pinch-to-zoom, drag-and-drop
   */
  UserGesture = 'user-gesture',

  /**
   * Form interaction
   * User inputs data into form fields with validation
   * Layer: Frontend
   * Example: Text input, checkbox selection, form submission, field validation
   */
  FormInteraction = 'form-interaction',

  /**
   * Navigation interaction
   * User navigates between screens or sections
   * Layer: Frontend
   * Example: Screen transition, modal presentation, tab switch, back navigation
   */
  Navigation = 'navigation',

  /**
   * UI state change
   * Component state updates causing re-rendering or animations
   * Layer: Frontend
   * Example: Loading state, error display, animation trigger, component lifecycle
   */
  UIStateChange = 'ui-state-change',

  // ===== DEVICE/HARDWARE PATTERNS =====

  /**
   * Sensor read interaction
   * Reading data from device sensors or hardware
   * Layer: Device
   * Example: Camera capture, GPS location, fingerprint scan, accelerometer reading
   */
  SensorRead = 'sensor-read',

  /**
   * Device notification
   * Sending notifications to device
   * Layer: Device
   * Example: Push notification, local notification, in-app alert
   */
  DeviceNotification = 'device-notification',

  /**
   * Local storage interaction
   * Accessing device local storage
   * Layer: Device
   * Example: Keychain access, shared preferences, local database, file system
   */
  LocalStorage = 'local-storage',

  // ===== DATA ACCESS PATTERNS =====

  /**
   * Query operation
   * Reading data from storage
   * Layer: Data
   * Example: SELECT query, index lookup, cache read
   */
  Query = 'query',

  /**
   * Command operation
   * Writing data to storage
   * Layer: Data
   * Example: INSERT, UPDATE, DELETE, cache write
   */
  Command = 'command',

  /**
   * Transaction operation
   * ACID-compliant multi-step database operation
   * Layer: Data
   * Example: Account transfer with rollback, order processing with inventory update
   */
  Transaction = 'transaction',

  // ===== REAL-TIME PATTERNS =====

  /**
   * Server-sent events
   * One-way server push to client
   * Layer: Backend
   * Example: Real-time notifications, live updates, progress tracking
   */
  ServerSentEvents = 'server-sent-events',

  /**
   * WebSocket communication
   * Bidirectional real-time communication
   * Layer: Backend
   * Example: Chat application, collaborative editing, live gaming
   */
  WebSocket = 'websocket',

  /**
   * Polling interaction
   * Client periodically checks server for updates
   * Layer: Backend
   * Example: Status polling, job completion check, availability check
   */
  Polling = 'polling',

  // ===== ORCHESTRATION PATTERNS =====

  /**
   * Workflow orchestration
   * Centralized multi-step process coordination (saga pattern)
   * Layer: Orchestration
   * Example: Account opening workflow, loan approval process, onboarding journey
   */
  Workflow = 'workflow',

  /**
   * Choreography pattern
   * Decentralized event-driven coordination
   * Layer: Orchestration
   * Example: Distributed microservices coordination, event-sourcing architecture
   */
  Choreography = 'choreography',

  // ===== INTERPERSONAL PATTERNS =====

  /**
   * Meeting interaction
   * In-person or virtual meeting between human stakeholders
   * Layer: Interpersonal
   * Example: Investment committee meeting, client consultation, team standup, board meeting
   */
  Meeting = 'meeting',

  /**
   * Phone call interaction
   * Synchronous voice communication between human stakeholders
   * Layer: Interpersonal
   * Example: Client advisory call, support escalation call, sales call, emergency contact
   */
  PhoneCall = 'phone-call',

  /**
   * Email exchange
   * Asynchronous written communication via email
   * Layer: Interpersonal
   * Example: Investment proposal email, policy update notification, stakeholder updates
   */
  EmailExchange = 'email-exchange',

  /**
   * Instant message
   * Real-time text-based communication
   * Layer: Interpersonal
   * Example: Slack/Teams messages, SMS, chat conversations, quick clarifications
   */
  InstantMessage = 'instant-message',

  // ===== MANUAL PROCESS PATTERNS =====

  /**
   * Manual review
   * Human analysis, evaluation, and approval process
   * Layer: Manual
   * Example: Compliance review, risk assessment, document verification, quality check
   */
  ManualReview = 'manual-review',

  /**
   * Physical document exchange
   * Paper-based document transfer and processing
   * Layer: Manual
   * Example: Printed application forms, paper statements, physical contracts, certificates
   */
  PhysicalDocument = 'physical-document',

  /**
   * Physical signature
   * Wet signature process on physical documents
   * Layer: Manual
   * Example: Contract signing, authorization forms, notarized documents, legal agreements
   */
  PhysicalSignature = 'physical-signature',

  /**
   * In-person verification
   * Physical identity or credential verification
   * Layer: Manual
   * Example: In-branch identity verification, physical ID check, face-to-face authentication
   */
  InPersonVerification = 'in-person-verification',

  // ===== ORGANIZATIONAL PATTERNS =====

  /**
   * Formal agreement
   * Legal contracts, SLAs, and partnership agreements
   * Layer: Organizational
   * Example: Partnership contract, SLA agreement, vendor contract, licensing agreement
   */
  FormalAgreement = 'formal-agreement',

  /**
   * Regulatory submission
   * Compliance reporting and regulatory filings
   * Layer: Organizational
   * Example: Annual compliance report, audit response, regulatory disclosure, license application
   */
  RegulatorySubmission = 'regulatory-submission',

  /**
   * Audit process
   * Formal audit or examination process
   * Layer: Organizational
   * Example: Financial audit, compliance audit, security audit, operational review
   */
  Audit = 'audit',
}
