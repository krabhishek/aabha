/**
 * Organizational Stakeholders
 *
 * Maps organizational personas to business contexts with specific roles,
 * goals, and responsibilities.
 *
 * NAMING CONVENTION: Role-based names for clarity and readability
 * Format: {Role}{Context}
 * Example: ChiefTechnologyOfficer, ComplianceOfficer, OperationsManager
 */

import { Stakeholder, StakeholderType } from '../../../../src/index.js';
import { RetailBankingContext } from '../contexts/retail-banking.context.js';
import { SMEBankingContext } from '../contexts/sme-banking.context.js';
import { WealthManagementContext } from '../contexts/wealth-management.context.js';
import { RiskComplianceContext } from '../contexts/risk-compliance.context.js';
import { OperationsContext } from '../contexts/operations.context.js';
import { TechnologyContext } from '../contexts/technology.context.js';
import {
  PriyaSharmaPersona,
  ElenaRodriguezPersona
} from '../personas/human/employees/c-suite.persona.js';
import {
  RajPatelPersona,
  AmaraWilliamsPersona,
  DavidKimPersona,
  LisaWongPersona
} from '../personas/human/employees/technology.persona.js';
import {
  MichaelSantosPersona,
  RobertChangPersona,
  SophiaMartinezPersona,
  JamesAndersonSMEPersona
} from '../personas/human/employees/front-office.persona.js';
import {
  DrKenjiYamamotoPersona,
  GraceLeePersona,
  ThomasMurphyPersona,
  CatherineBrownPersona
} from '../personas/human/employees/middle-back-office.persona.js';

// ============================================================================
// Technology Context Stakeholders
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Chief Technology Officer',
  persona: RajPatelPersona,
  context: TechnologyContext,
  goals: ['Build modern cloud-native platform', 'Complete core banking migration', 'Scale engineering team'],
  permissions: ['technology_strategy', 'architecture_decisions', 'vendor_selection', 'budget_allocation']
})
export class ChiefTechnologyOfficer {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Chief Information Security Officer',
  persona: AmaraWilliamsPersona,
  context: TechnologyContext,
  goals: ['Zero-trust architecture', 'Proactive threat detection', 'Security culture'],
  permissions: ['security_policy', 'incident_response', 'security_architecture', 'compliance_oversight']
})
export class ChiefInformationSecurityOfficer {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Chief Data Officer',
  persona: DavidKimPersona,
  context: TechnologyContext,
  goals: ['Real-time customer insights', 'AI/ML platform', 'Data governance'],
  permissions: ['data_strategy', 'ai_ml_initiatives', 'data_governance', 'analytics_platform']
})
export class ChiefDataOfficer {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Chief Digital Officer',
  persona: LisaWongPersona,
  context: TechnologyContext,
  goals: ['Mobile app excellence', 'Digital-first culture', '60% digital adoption'],
  permissions: ['digital_product_strategy', 'mobile_web_platforms', 'digital_marketing', 'customer_journeys']
})
export class ChiefDigitalOfficer {}

// ============================================================================
// Risk & Compliance Context Stakeholders
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Chief Risk Officer',
  persona: ElenaRodriguezPersona,
  context: RiskComplianceContext,
  goals: ['95% fraud detection', 'Zero critical incidents', 'Risk as enabler'],
  permissions: ['risk_policy', 'fraud_detection', 'credit_risk', 'operational_risk']
})
export class ChiefRiskOfficer {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Chief Compliance Officer',
  persona: DrKenjiYamamotoPersona,
  context: RiskComplianceContext,
  goals: ['Compliance as competitive advantage', 'Zero incidents', 'Proactive compliance'],
  permissions: ['compliance_policy', 'aml_kyc', 'regulatory_reporting', 'audit_oversight']
})
export class ChiefComplianceOfficer {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Head of Internal Audit',
  persona: GraceLeePersona,
  context: RiskComplianceContext,
  goals: ['Continuous auditing', 'Trusted advisor', 'Risk-based approach'],
  permissions: ['audit_planning', 'control_testing', 'audit_reporting', 'risk_assessment']
})
export class HeadInternalAudit {}

// ============================================================================
// Operations Context Stakeholders
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Chief Operating Officer',
  persona: PriyaSharmaPersona,
  context: OperationsContext,
  goals: ['Branch digitization', '15% cost reduction', 'Reskill employees'],
  permissions: ['operations_strategy', 'branch_network', 'process_improvement', 'automation']
})
export class ChiefOperatingOfficer {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Head of Finance Operations',
  persona: ThomasMurphyPersona,
  context: OperationsContext,
  goals: ['Real-time payments', 'Operational excellence', 'Automation'],
  permissions: ['payment_processing', 'reconciliation', 'financial_reporting', 'process_automation']
})
export class HeadFinanceOperations {}

// ============================================================================
// Retail Banking Context Stakeholders
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Chief Customer Officer',
  persona: MichaelSantosPersona,
  context: RetailBankingContext,
  goals: ['CES 1.8', 'NPS 65', 'Voice of Customer'],
  permissions: ['customer_experience_strategy', 'service_standards', 'feedback_management', 'journey_design']
})
export class ChiefCustomerOfficer {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Head of Retail Banking',
  persona: RobertChangPersona,
  context: RetailBankingContext,
  goals: ['Digital adoption', 'Branch evolution', 'Customer growth'],
  permissions: ['retail_strategy', 'product_management', 'branch_coordination', 'customer_segmentation']
})
export class HeadRetailBanking {}

// ============================================================================
// SME Banking Context Stakeholders
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Head of SME Banking',
  persona: JamesAndersonSMEPersona,
  context: SMEBankingContext,
  goals: ['40% portfolio growth', 'Business in a Box', 'Banking partners'],
  permissions: ['sme_strategy', 'business_lending', 'merchant_services', 'relationship_management']
})
export class HeadSMEBanking {}

// ============================================================================
// Wealth Management Context Stakeholders
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Head of Wealth Management',
  persona: SophiaMartinezPersona,
  context: WealthManagementContext,
  goals: ['Democratize wealth management', '30% AUM growth', 'Q1 2025 platform'],
  permissions: ['wealth_strategy', 'investment_products', 'advisory_services', 'platform_oversight']
})
export class HeadWealthManagement {}

// ============================================================================
// Additional Organizational Stakeholders
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Branch Manager',
  persona: CatherineBrownPersona,
  context: RetailBankingContext,
  goals: ['Customer satisfaction', 'Digital adoption in branch', 'Team performance'],
  permissions: ['branch_operations', 'customer_service', 'staff_management', 'local_marketing']
})
export class BranchManager {}
