/**
 * SME Owner Customer Personas
 *
 * Small and Medium Enterprise owners who are the backbone of Genai's economy.
 * Need integrated business + personal banking, cash flow tools, and business financing.
 */

import { Persona } from '../../../../../../src/index.js';

@Persona({
  name: 'Priya Kumar - Small Business Owner (Café)',
  age: '33',
  occupation: "Owner of Priya's Café - Artisan coffee shop + bakery",
  goals: [
    'Expand to 3 more locations in 2 years',
    'Manage cash flow effectively across business',
    'Access business financing for expansion',
    'Simplify business banking and merchant services',
  ],
  painPoints: [
    'Cash flow management is constantly stressful',
    'Payment delays from merchant services',
    'Difficult to separate business and personal finances',
    "Traditional banks don't understand small business needs",
  ],
  technicalProficiency: 'medium',
  preferredChannels: [
    'mobile app',
    'web banking',
    'relationship manager for complex needs',
  ],
  extensions: {
    businessRevenue: 'GD$320,000/year',
    employees: '8',
    bankingNeeds: [
      'Business account',
      'Merchant services',
      'Small business loan',
      'Payroll',
      'Cash flow management tools',
    ],
    painPointDetail: 'Spends hours reconciling payments from multiple sources',
    dream: 'Grow from 1 café to 4-location chain',
    quote:
      '"I\'m great at making coffee but terrible at managing cash flow - I need a bank that helps me with that"',
    opportunity:
      '"Business in a Box" - instant account + payment processing + cash flow tools',
    businessModel: 'B2C retail with high transaction volume, thin margins',
    successMetrics:
      'Business loan take-up, merchant services adoption, cash flow tool usage',
  },
})
export class PriyaKumarPersona {}

@Persona({
  name: 'Jordan Williams - Startup Founder',
  age: '29',
  occupation: 'Founder & CEO of TechStart Solutions (B2B SaaS startup)',
  goals: [
    'Scale business aggressively (200% YoY growth)',
    'Access flexible credit for growth',
    'International payments for global clients',
    'Banking that scales with business growth',
  ],
  painPoints: [
    "Traditional banks don't understand startup cash flow patterns",
    "Rigid lending criteria don't fit startups",
    'International payments are slow and expensive',
    'Need banking APIs for business automation',
  ],
  technicalProficiency: 'high',
  preferredChannels: [
    'API integration',
    'mobile app',
    'web banking - never visit branches',
  ],
  extensions: {
    businessRevenue: 'GD$180,000/year (growing 200% YoY)',
    employees: '12',
    fundingStage: 'Bootstrapped, considering seed round',
    bankingNeeds: [
      'Business account',
      'Payment gateway',
      'Line of credit',
      'Forex for international clients',
      'Banking APIs',
    ],
    challenge: 'Lumpy cash flow - big contracts followed by dry periods',
    techExpectation:
      'Expects API-first banking like Stripe, not traditional bank',
    quote:
      '"My banking should have an API and work like a SaaS product, not a 1950s institution"',
    opportunity:
      'Open banking APIs + flexible credit = loyal high-growth customer',
    businessModel: 'B2B SaaS with international clients, subscription revenue',
    successMetrics:
      'API adoption, credit line utilization, forex volume, retention as company scales',
  },
})
export class JordanWilliamsPersona {}

@Persona({
  name: 'Robert Santiago - Established SME Owner',
  age: '51',
  occupation: 'Owner of Genai Builders Ltd - Construction company',
  goals: [
    'Secure project financing reliably',
    'Equipment financing for growth',
    'Treasury management for large projects',
    'Maintain strong banking relationship',
  ],
  painPoints: [
    'Project financing approval is slow',
    'Complex working capital needs',
    'Multiple accounts and payment flows to manage',
    'Needs proactive advice from relationship manager',
  ],
  technicalProficiency: 'medium',
  preferredChannels: [
    'relationship manager (primary)',
    'web banking for transactions',
    'mobile app for checking balances',
  ],
  extensions: {
    businessRevenue: 'GD$4.5 million/year',
    employees: '45',
    bankingNeeds: [
      'Commercial lending',
      'Equipment financing',
      'Project financing',
      'Treasury management',
      'Multi-account management',
    ],
    relationship:
      'Long-term OgPgyBank customer, values relationship manager deeply',
    loyaltyDriver: 'Relationship manager who understands construction industry',
    quote:
      '"I don\'t just need a bank - I need a financial partner who understands my business cycles"',
    opportunity:
      'Deep relationship + digital tools = full-service business banking',
    businessModel:
      'Project-based revenue, complex working capital, equipment intensive',
    successMetrics:
      'Loan volume, treasury services adoption, relationship manager satisfaction, retention',
  },
})
export class RobertSantiagoPersona {}
