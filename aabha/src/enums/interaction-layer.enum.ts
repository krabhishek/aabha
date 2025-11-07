/**
 * Interaction Layer Enumeration
 * @module aabha/enums/interaction-layer
 *
 * Defines the architectural layer where an interaction takes place.
 * Each layer has specific characteristics, technologies, and validation requirements.
 */

/**
 * Interaction Layer
 *
 * Specifies the architectural layer of an interaction:
 * - Frontend: User interface and user experience interactions
 * - Backend: Service-to-service API interactions
 * - Data: Database and storage operations
 * - Device: Hardware and sensor interactions
 * - External: Third-party service integrations
 * - Orchestration: Multi-service workflow coordination
 *
 * The layer determines:
 * - Which layer-specific configuration is required (frontendConfig, backendConfig, etc.)
 * - Applicable validation rules
 * - Expected interaction patterns
 * - Observability and monitoring requirements
 */
export enum InteractionLayer {
  /**
   * Frontend layer
   * User interface and user experience interactions
   * Examples: UI components, user gestures, form interactions, navigation, animations
   * Typical patterns: UserGesture, FormInteraction, Navigation, UIStateChange
   * Config: frontendConfig (framework, gestures, accessibility, etc.)
   */
  Frontend = 'frontend',

  /**
   * Backend layer
   * Service-to-service API and business logic interactions
   * Examples: REST APIs, GraphQL, gRPC, message queues, microservices
   * Typical patterns: RequestResponse, Event, Streaming, Batch
   * Config: backendConfig (service mesh, resilience, caching, tracing, etc.)
   */
  Backend = 'backend',

  /**
   * Data layer
   * Database, storage, and persistence interactions
   * Examples: SQL queries, NoSQL operations, cache access, file storage
   * Typical patterns: Query, Command, Transaction
   * Config: dataConfig (database type, transaction management, schema, consistency, etc.)
   */
  Data = 'data',

  /**
   * Device layer
   * Hardware and sensor interactions on mobile/IoT devices
   * Examples: Camera, GPS, biometric sensors, push notifications, local storage
   * Typical patterns: SensorRead, DeviceNotification, LocalStorage
   * Config: deviceConfig (capabilities, sensors, notifications, storage, permissions, etc.)
   */
  Device = 'device',

  /**
   * External layer
   * Third-party service integrations and external APIs
   * Examples: Payment gateways, KYC providers, AI services, partner APIs
   * Typical patterns: RequestResponse, Event, Streaming
   * Config: backendConfig (with emphasis on security, SLAs, error handling)
   */
  External = 'external',

  /**
   * Orchestration layer
   * Multi-service workflow coordination and process management
   * Examples: Saga patterns, step functions, distributed workflows
   * Typical patterns: Workflow, Choreography
   * Config: Can reference multiple interactions across other layers
   */
  Orchestration = 'orchestration',

  /**
   * Interpersonal layer
   * Human-to-human communication and collaboration
   * Examples: Meetings, phone calls, emails, consultations, negotiations
   * Typical patterns: Meeting, PhoneCall, EmailExchange, InstantMessage
   * Config: interpersonalConfig (communicationChannel, location, synchronicity, attendees, etc.)
   */
  Interpersonal = 'interpersonal',

  /**
   * Manual layer
   * Offline processes and human-driven workflows
   * Examples: Paper forms, physical signatures, manual reviews, in-person verification
   * Typical patterns: ManualReview, PhysicalDocument, PhysicalSignature, InPersonVerification
   * Config: manualConfig (physicalLocation, documentsRequired, approvalWorkflow, offlineStorage, etc.)
   */
  Manual = 'manual',

  /**
   * Organizational layer
   * Organization-to-organization interactions and formal processes
   * Examples: Partnerships, contracts, regulatory submissions, audits, legal agreements
   * Typical patterns: FormalAgreement, RegulatorySubmission, Audit
   * Config: organizationalConfig (organizations, legalFramework, complianceRequirements, formalAgreements, etc.)
   */
  Organizational = 'organizational',
}
