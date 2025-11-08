/**
 * Context Relationship Type Enum
 * Defines how business contexts relate to each other
 * @module aabha/enums
 */

/**
 * Types of relationships between business contexts
 */
export enum ContextRelationship {
  /**
   * Upstream context provides data/services to this context
   * Example: Order Management → Fulfillment
   */
  Upstream = 'upstream',

  /**
   * Downstream context consumes data/services from this context
   * Example: Sales → Billing
   */
  Downstream = 'downstream',

  /**
   * Partnership context collaborates as equal partner
   * Example: Marketing ↔ Sales
   */
  Partnership = 'partnership',

  /**
   * Peer context operates independently but shares data
   * Example: Customer Support ↔ Product Development
   */
  Peer = 'peer',

  /**
   * Dependency - this context depends on another
   * Example: Compliance depends on Audit
   */
  Dependency = 'dependency',

  /**
   * Influences - this context influences another without direct integration
   * Example: Legal influences Product Development
   */
  Influences = 'influences',
}
