/**
 * Expectation category enumeration
 * @module aabha/enums
 */

/**
 * Categories for expectations
 * Used to classify expectations by their primary concern area
 */
export enum ExpectationCategory {
  /**
   * Functional expectation
   * Focuses on business capabilities and feature correctness
   *
   * Example: User can deposit money, System validates email format
   */
  Functional = 'functional',

  /**
   * Performance expectation
   * Focuses on speed, throughput, and resource utilization
   *
   * Example: Page loads in < 2 seconds, API handles 1000 requests/sec
   */
  Performance = 'performance',

  /**
   * Security expectation
   * Focuses on authentication, authorization, encryption, and data protection
   *
   * Example: User data is encrypted at rest, API requires OAuth2 authentication
   */
  Security = 'security',

  /**
   * Usability expectation
   * Focuses on user experience, accessibility, and ease of use
   *
   * Example: Form provides real-time validation feedback, UI supports screen readers
   */
  Usability = 'usability',

  /**
   * Compliance expectation
   * Focuses on regulatory and policy adherence
   *
   * Example: Data retention complies with GDPR, Audit trails meet SOX requirements
   */
  Compliance = 'compliance',

  /**
   * Reliability expectation
   * Focuses on uptime, fault tolerance, and error recovery
   *
   * Example: System recovers from database failures, Service maintains 99.9% uptime
   */
  Reliability = 'reliability',

  /**
   * Scalability expectation
   * Focuses on growth handling and capacity planning
   *
   * Example: System handles 10x traffic increase, Database supports 1M users
   */
  Scalability = 'scalability',

  /**
   * Integration expectation
   * Focuses on system interoperability and data exchange
   *
   * Example: System integrates with payment gateway, Data syncs with CRM
   */
  Integration = 'integration',

  /**
   * Business outcome expectation
   * Focuses on strategic business goals and metrics
   *
   * Example: Reduce customer churn by 20%, Increase conversion rate to 5%
   */
  BusinessOutcome = 'business-outcome',
}
