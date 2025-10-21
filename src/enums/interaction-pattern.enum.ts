/**
 * Interaction Pattern Enumeration
 * @module blueprint/enums/interaction-pattern
 *
 * Defines how stakeholders interact in an expectation exchange.
 */

/**
 * Interaction Pattern
 *
 * Specifies the communication pattern for an expectation exchange:
 * - RequestResponse: Synchronous request-response pattern
 * - Event: Asynchronous event-driven pattern
 * - Streaming: Continuous data streaming pattern
 * - Batch: Batch processing pattern
 */
export enum InteractionPattern {
  /**
   * Synchronous request-response
   * Consumer sends request, provider responds immediately
   * Example: API call, form submission
   */
  RequestResponse = 'request-response',

  /**
   * Asynchronous event-driven
   * Provider publishes events, consumer subscribes
   * Example: Account created notification, payment processed event
   */
  Event = 'event',

  /**
   * Continuous streaming
   * Provider streams data continuously to consumer
   * Example: Real-time market data, live transaction feed
   */
  Streaming = 'streaming',

  /**
   * Batch processing
   * Provider processes requests in batches
   * Example: Nightly reconciliation, monthly report generation
   */
  Batch = 'batch',
}
