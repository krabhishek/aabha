/**
 * Expectation stakeholder relation type enumeration
 * @module aabha/enums
 */

/**
 * Stakeholder relationship types for expectations
 * Used to classify the nature of the relationship between provider and consumer
 */
export enum ExpectationStakeholderRelationType {
  /**
   * Business-to-Consumer (B2C)
   * Company providing services to individual end users
   *
   * Example: Banking app serving retail customers, E-commerce platform serving shoppers
   */
  B2C = 'b2c',

  /**
   * Business-to-Business (B2B)
   * Company providing services to other companies
   *
   * Example: API platform serving enterprise clients, SaaS solution for businesses
   */
  B2B = 'b2b',

  /**
   * Business-to-Employee (B2E)
   * Company providing internal services to its employees
   *
   * Example: HR portal for staff, Internal tooling for developers
   */
  B2E = 'b2e',

  /**
   * System-to-System (S2S)
   * Automated system integration without human interaction
   *
   * Example: Microservice communication, API-to-API integration
   */
  S2S = 's2s',

  /**
   * Peer-to-Peer (P2P)
   * Direct interaction between users without intermediary
   *
   * Example: User-to-user messaging, Collaborative document editing
   */
  P2P = 'p2p',
}
