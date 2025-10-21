/**
 * Stakeholder Type Enumeration
 * @module blueprint/enums/stakeholder-type
 *
 * Defines the different types of stakeholders in a blueprint model.
 */

/**
 * Stakeholder Type
 *
 * Distinguishes between different categories of stakeholders:
 * - Human: Individual people
 * - Team: Groups or teams within an organization
 * - Organization: External organizations, partners, regulators
 * - System: APIs, services, automated systems
 */
export enum StakeholderType {
  /**
   * Individual human stakeholder
   * Examples: Customer, Employee, Manager
   */
  Human = 'human',

  /**
   * Team or group stakeholder
   * Examples: Development Team, Support Team, Risk Committee
   */
  Team = 'team',

  /**
   * Organizational stakeholder
   * Examples: Partner Bank, Regulator, Vendor
   */
  Organization = 'organization',

  /**
   * System stakeholder
   * Examples: Email Service, Payment Gateway, KYC API
   */
  System = 'system',
}
