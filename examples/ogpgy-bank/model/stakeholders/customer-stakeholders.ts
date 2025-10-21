/**
 * Customer Stakeholders
 *
 * Maps customer personas to business contexts with specific roles,
 * goals, and permissions.
 *
 * NAMING CONVENTION: Role-based names for clarity and readability
 * Format: {Role}{Context}Stakeholder
 * Example: DigitalFirstRetailCustomer, FamilySavingsRetailCustomer
 */

import { Stakeholder, StakeholderType } from '../../../../src/index.js';
import { RetailBankingContext } from '../contexts/retail-banking.context.js';
import { SMEBankingContext } from '../contexts/sme-banking.context.js';
import { WealthManagementContext } from '../contexts/wealth-management.context.js';
import {
  MarcusLeePersona,
  ZaraAhmedPersona
} from '../personas/human/customers/young-adults.persona.js';
import {
  MariaSantosPersona,
  DavidEmmaFosterPersona
} from '../personas/human/customers/families.persona.js';
import {
  MargaretOConnorPersona,
  WilliamChenPersona
} from '../personas/human/customers/seniors.persona.js';
import {
  VictoriaZhangPersona,
  RichardBlackwoodPersona,
  DrAliciaFernandezPersona
} from '../personas/human/customers/affluent.persona.js';
import {
  PriyaKumarPersona,
  JordanWilliamsPersona,
  RobertSantiagoPersona
} from '../personas/human/customers/sme-owners.persona.js';
import {
  ElenaPopescuPersona,
  JamesAndersonPersona
} from '../personas/human/customers/migrant-expat.persona.js';

// ============================================================================
// Retail Banking Customer Stakeholders
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Digital-First Young Professional',
  persona: MarcusLeePersona,
  context: RetailBankingContext,
  goals: [
    'Open account instantly on mobile',
    'Transfer money effortlessly',
    'Start investing with guidance',
    'Track spending automatically'
  ],
  permissions: [
    'open_personal_account',
    'transfer_funds',
    'view_account_balance',
    'mobile_banking',
    'apply_for_products'
  ]
})
export class DigitalFirstRetailCustomer {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Student Banking Customer',
  persona: ZaraAhmedPersona,
  context: RetailBankingContext,
  goals: [
    'Manage limited budget effectively',
    'Zero/low fee banking',
    'Learn financial responsibility',
    'Mobile-only banking'
  ],
  permissions: [
    'open_student_account',
    'mobile_banking',
    'debit_card',
    'view_transactions',
    'budget_tools'
  ]
})
export class StudentRetailCustomer {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Working Mother Managing Family Finances',
  persona: MariaSantosPersona,
  context: RetailBankingContext,
  goals: [
    'Manage multiple savings goals',
    'Automate bill payments',
    'Track family budget',
    'Plan for children\'s education'
  ],
  permissions: [
    'multiple_accounts',
    'savings_goals',
    'bill_payment',
    'transfer_funds',
    'education_savings_plan'
  ]
})
export class FamilySavingsRetailCustomer {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Young Couple Planning First Home',
  persona: DavidEmmaFosterPersona,
  context: RetailBankingContext,
  goals: [
    'Joint account management',
    'Save for house deposit',
    'Apply for home loan',
    'Investment planning'
  ],
  permissions: [
    'open_joint_account',
    'home_loan_application',
    'investment_account',
    'savings_goals',
    'financial_planning_tools'
  ]
})
export class HomeBuyerRetailCustomer {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Loyal Senior Customer',
  persona: MargaretOConnorPersona,
  context: RetailBankingContext,
  goals: [
    'Safe retirement savings management',
    'Reliable pension payments',
    'Assisted digital services',
    'Maintain personal banking relationship'
  ],
  permissions: [
    'retirement_account',
    'fixed_deposits',
    'pension_payments',
    'assisted_digital_services',
    'branch_access',
    'phone_banking'
  ]
})
export class SeniorRetailCustomer {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Active Senior Learning Digital',
  persona: WilliamChenPersona,
  context: RetailBankingContext,
  goals: [
    'Manage retirement actively',
    'Learn digital banking',
    'Travel banking services',
    'Estate planning'
  ],
  permissions: [
    'retirement_account',
    'internet_banking',
    'mobile_app_learning',
    'travel_money',
    'relationship_manager_access'
  ]
})
export class DigitalLearningSeniorCustomer {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Migrant Worker Sending Remittances',
  persona: ElenaPopescuPersona,
  context: RetailBankingContext,
  goals: [
    'Low-cost remittances to Romania',
    'Transparent exchange rates',
    'Savings in Genai',
    'Language support'
  ],
  permissions: [
    'salary_account',
    'international_transfers',
    'multi_currency_view',
    'language_support',
    'mobile_banking'
  ]
})
export class RemittanceRetailCustomer {}

// ============================================================================
// Wealth Management Customer Stakeholders
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'High Net Worth Individual',
  persona: VictoriaZhangPersona,
  context: WealthManagementContext,
  goals: [
    'Sophisticated wealth management',
    'Estate planning',
    'Exclusive investment opportunities',
    'Dedicated relationship manager'
  ],
  permissions: [
    'private_banking',
    'dedicated_rm',
    'exclusive_investments',
    'estate_planning',
    'concierge_services',
    'global_banking'
  ]
})
export class HighNetWorthCustomer {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Busy Executive',
  persona: RichardBlackwoodPersona,
  context: WealthManagementContext,
  goals: [
    'Tax-efficient portfolio',
    'Retirement planning',
    'Time-efficient advisory',
    'Trust and estate services'
  ],
  permissions: [
    'portfolio_management',
    'tax_optimization',
    'video_advisory',
    'trust_services',
    'mortgage_services'
  ]
})
export class ExecutiveWealthCustomer {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Mass Affluent Professional',
  persona: DrAliciaFernandezPersona,
  context: WealthManagementContext,
  goals: [
    'Start investing beyond savings',
    'Education fund for children',
    'Retirement planning',
    'Accessible wealth advice'
  ],
  permissions: [
    'investment_advisory',
    'education_planning',
    'retirement_planning',
    'digital_wealth_platform',
    'robo_advisor'
  ]
})
export class MassAffluentCustomer {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Active Senior Investor',
  persona: WilliamChenPersona,
  context: WealthManagementContext,
  goals: [
    'Active investment management',
    'Travel money and forex',
    'Estate planning',
    'Relationship manager access'
  ],
  permissions: [
    'investment_portfolio',
    'estate_planning',
    'multi_currency',
    'relationship_manager',
    'financial_planning'
  ]
})
export class SeniorInvestorCustomer {}

// ============================================================================
// SME Banking Customer Stakeholders
// ============================================================================

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Small Business Owner (Café)',
  persona: PriyaKumarPersona,
  context: SMEBankingContext,
  goals: [
    'Business account with merchant services',
    'Cash flow management',
    'Small business loan for expansion',
    'Payroll services'
  ],
  permissions: [
    'business_account',
    'merchant_services',
    'cash_flow_tools',
    'business_loan',
    'payroll_services'
  ]
})
export class SmallBusinessOwner {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Startup Founder',
  persona: JordanWilliamsPersona,
  context: SMEBankingContext,
  goals: [
    'API-first banking integration',
    'Flexible credit line',
    'International payments',
    'Banking that scales with growth'
  ],
  permissions: [
    'business_account',
    'api_access',
    'line_of_credit',
    'forex_payments',
    'payment_gateway'
  ]
})
export class StartupFounder {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Established SME Owner',
  persona: RobertSantiagoPersona,
  context: SMEBankingContext,
  goals: [
    'Project financing',
    'Equipment financing',
    'Treasury management',
    'Relationship manager support'
  ],
  permissions: [
    'commercial_lending',
    'equipment_financing',
    'project_financing',
    'treasury_management',
    'relationship_manager',
    'multi_account_management'
  ]
})
export class EstablishedSMEOwner {}

@Stakeholder({
  type: StakeholderType.Human,
  role: 'Expat Professional with Business Needs',
  persona: JamesAndersonPersona,
  context: SMEBankingContext,
  goals: [
    'Multi-currency business account',
    'International business payments',
    'Forex management',
    'Global banking coordination'
  ],
  permissions: [
    'multi_currency_business_account',
    'international_payments',
    'forex_services',
    'global_account_access'
  ]
})
export class ExpatBusinessOwner {}
