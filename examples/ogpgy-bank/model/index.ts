/**
 * OgPgyBank Product Model - Main Export
 *
 * Complete product model for OgPgyBank's digital transformation (2024-2027).
 * This model demonstrates blueprint's capabilities for comprehensive product definition.
 *
 * Model Statistics:
 * - 1 Strategy (Digital Transformation)
 * - 14 Metrics (Customer, Business, Operational, Financial)
 * - 6 Business Contexts (Retail, SME, Wealth, Risk, Operations, Technology)
 * - 15+ Customer Personas
 * - 20+ Organizational Personas
 * - 30+ Stakeholders
 * - 5 Business Initiatives
 * - 7 Journeys (4 customer + 3 internal)
 * - 20+ Milestones
 * - 50+ Steps
 * - 20+ Expectations with priorities
 * - 15+ Behaviors
 * - 10+ Tests
 *
 * Full traceability from Strategy → Tests
 */

// ============================================================================
// Strategy & Metrics
// ============================================================================

export * from './strategy/digital-transformation-strategy.js';
export * from './strategy/metrics.js';

// ============================================================================
// Business Contexts
// ============================================================================

export * from './contexts/retail-banking.context.js';
export * from './contexts/sme-banking.context.js';
export * from './contexts/wealth-management.context.js';
export * from './contexts/risk-compliance.context.js';
export * from './contexts/operations.context.js';
export * from './contexts/technology.context.js';

// ============================================================================
// Customer Personas
// ============================================================================

export * from './personas/human/customers/young-adults.persona.js';
export * from './personas/human/customers/families.persona.js';
export * from './personas/human/customers/seniors.persona.js';
export * from './personas/human/customers/affluent.persona.js';
export * from './personas/human/customers/sme-owners.persona.js';
export * from './personas/human/customers/migrant-expat.persona.js';

// ============================================================================
// Organizational Personas
// ============================================================================

export * from './personas/human/employees/c-suite.persona.js';
export * from './personas/human/employees/technology.persona.js';
export * from './personas/human/employees/front-office.persona.js';
export * from './personas/human/employees/middle-back-office.persona.js';

// ============================================================================
// Stakeholders
// ============================================================================

export * from './stakeholders/customer-stakeholders.js';
export * from './stakeholders/organizational-stakeholders.js';

// ============================================================================
// Business Initiatives
// ============================================================================

export * from './initiatives/mobile-app-excellence.initiative.js';
export * from './initiatives/instant-account-opening.initiative.js';
export * from './initiatives/branch-digitization.initiative.js';
export * from './initiatives/ai-powered-insights.initiative.js';
export * from './initiatives/compliance-automation.initiative.js';

// ============================================================================
// Customer Journeys (with Milestones, Steps, Expectations, Behaviors, Tests)
// ============================================================================

export * from './journeys/customer/account-opening/index.js';
export * from './journeys/customer/mobile-onboarding/index.js';
export * from './journeys/customer/funds-transfer/index.js';
export * from './journeys/customer/savings-goals/index.js';

// ============================================================================
// Internal Journeys
// ============================================================================

export * from './journeys/internal/compliance-workflow/index.js';
export * from './journeys/internal/relationship-manager-onboarding/index.js';
export * from './journeys/internal/fraud-investigation/index.js';
