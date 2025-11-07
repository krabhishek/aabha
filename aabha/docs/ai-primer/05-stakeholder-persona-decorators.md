# Aabha AI Primer: Stakeholder & Persona Decorators

**File 5 of 7** | Foundation: WHO Participates

This guide explains how Aabha models **WHO** participates in business processes using `@Stakeholder` and `@Persona` decorators. Understanding the distinction between these two concepts is critical:

- **`@Persona`**: WHO someone **IS** (archetype, demographics, psychology, behaviors, needs) - context-independent
- **`@Stakeholder`**: WHAT someone **DOES** (role, responsibilities, authority, relationships) - context-specific

The same persona can play multiple stakeholder roles across different contexts.

---

## Table of Contents

1. [@Persona Decorator: WHO Someone Is](#persona-decorator-who-someone-is)
2. [@Stakeholder Decorator: WHAT Someone Does](#stakeholder-decorator-what-someone-does)
3. [Persona ↔ Stakeholder Relationship](#persona--stakeholder-relationship)
4. [Complete Examples](#complete-examples)

---

## @Persona Decorator: WHO Someone Is

### Core Concept

`★ Insight ─────────────────────────────────────`

Personas are **archetype definitions** that transcend specific contexts. Marcus Lee as a "Tech-Savvy Millennial" persona has intrinsic characteristics (age 26, software developer, mobile-first, risk-tolerant) that don't change whether he's opening a bank account, applying for a loan, or using investment services. These characteristics live in the `@Persona` decorator.

`─────────────────────────────────────────────────`

### Persona Types

Aabha recognizes four persona types, each with specialized attributes:

```typescript
enum PersonaType {
  Human = 'human',        // Individual people (customers, employees)
  Team = 'team',          // Groups (development team, risk committee)
  Organization = 'organization', // Companies, regulators, partners
  System = 'system',      // APIs, services, automated systems
}
```

### Core Structure

Every `@Persona` decorator must specify:
- **`type`** (required): PersonaType enum value
- **`name`** (required): Clear, memorable persona name
- **`description`** (optional but recommended): Overview of who this persona is

### Anatomy of @Persona

Let's examine the rich structure using a Human persona example:

```typescript
@Persona({
  // ===== IDENTITY =====
  type: PersonaType.Human,
  name: 'Marcus Lee - Young Professional',
  archetype: 'The Optimizer - Always seeking efficiency',
  description: 'Digital-native young professional seeking simple, fast banking',

  // ===== DEMOGRAPHICS (structured) =====
  age: '26',
  occupation: 'Junior Software Developer',
  demographics: {
    incomeLevel: 'GD$48,000/year',
    educationLevel: "Bachelor's Degree in Computer Science",
    location: 'Urban - Capital City, Genai',
    familyStatus: 'Single, no dependents',
    employmentStatus: 'Full-time employed at tech startup',
    householdSize: 1,
    languagePreferences: ['English', 'Genai'],
  },

  // ===== PSYCHOLOGY & VALUES =====
  motivations: [
    'Financial independence by age 35',
    'Tech convenience and efficiency',
    'Building wealth through smart investing',
  ],
  psychology: {
    values: ['Financial independence', 'Technology', 'Efficiency', 'Transparency'],
    fears: ['Losing savings', 'Identity theft', 'Being locked into bad service'],
    aspirations: ['Own home by 35', 'Build GD$500K portfolio by 40', 'Retire early'],
    decisionMakingStyle: 'Analytical - researches online, reads Reddit reviews',
    riskTolerance: 'medium', // 'low' | 'medium' | 'high'
    trustFactors: ['Transparent pricing', 'Strong security', 'Good reviews', 'Modern tech'],
  },

  // ===== BEHAVIOR PATTERNS =====
  behavior: {
    typicalBehaviors: [
      'Checks bank balance daily on mobile',
      'Never visited a branch',
      'Uses budgeting apps to track spending',
      'Automates savings (10% of paycheck)',
    ],
    communicationStyle: 'Direct and concise - dislikes marketing speak',
    informationSeeking: ['Google search', 'Reddit r/personalfinance', 'YouTube tutorials'],
    technologyAdoption: 'early-adopter', // 'early-adopter' | 'mainstream' | 'laggard'
    usagePatterns: ['Daily active user', 'Multiple logins per day', 'Explores advanced features'],
  },

  // ===== NEEDS FRAMEWORK (multi-dimensional) =====
  needs: {
    functional: ['Track expenses automatically', 'Transfer money instantly', 'Access 24/7'],
    emotional: ['Feel in control', 'Feel secure', 'Avoid financial anxiety'],
    social: ['Be seen as financially responsible', 'Keep up with tech-savvy peers'],
    informational: ['Understand spending patterns', 'Know what fees apply', 'Get alerts'],
  },

  // ===== GOALS & PAIN POINTS =====
  goals: [
    'Build emergency fund (GD$24K)',
    'Save for house down payment (GD$100K in 5 years)',
    'Start investing without complexity',
  ],
  painPoints: [
    'Traditional banks feel "old and slow"',
    'Poor mobile app experiences',
    'Lack of financial guidance for first-time investors',
  ],

  // ===== TECHNICAL & CHANNEL PREFERENCES =====
  technicalProficiency: 'high', // 'low' | 'medium' | 'high'
  preferredChannels: ['mobile app', 'web banking', 'chat support'], // Priority order

  // ===== CONTEXT & LIFE STAGE =====
  context: {
    lifeStage: 'Early career - building financial foundation',
    currentSituation: 'Started first job 2 years ago, new to managing money',
    challenges: ['Student loan debt (GD$25K)', 'Building credit history', 'High cost of living'],
    environmentalFactors: ['Competitive tech job market', 'Rising interest rates'],
  },

  // ===== STORIES & EVIDENCE =====
  quotes: [
    {
      quote: "If my banking app is slower than my code compiler, I'm switching banks",
      context: 'After frustrating mobile app experience',
    },
  ],

  // ===== SUCCESS METRICS =====
  metrics: {
    successIndicators: ['Achieves savings goals', 'Growing portfolio', 'Feels confident'],
    engagementPatterns: ['Daily active user', 'Uses 5+ features', 'Long session times'],
    satisfactionSignals: ['Recommends to friends', 'Writes positive reviews', 'Increases deposits'],
    churnRisks: ['Slow app performance', 'Hidden fees', 'Poor support', 'Better competitor'],
  },

  // ===== METADATA =====
  tags: ['millennial', 'tech-savvy', 'mobile-first', 'early-career', 'high-potential-ltv'],
})
export class MarcusLeePersona {}
```

`★ Insight ─────────────────────────────────────`

The `needs` framework is multi-dimensional because humans don't just have functional needs. Marcus needs instant transfers (functional), but he also needs to *feel in control* (emotional) and *be seen as responsible* (social). Capturing all dimensions helps AI understand the complete human experience, not just task completion.

`─────────────────────────────────────────────────`

### System Personas

Systems have personas too! Here's an Email Validation Service persona:

```typescript
@Persona({
  type: PersonaType.System,
  name: 'EmailValidationService',
  description: 'Cloud email validation API with RFC 5322 compliance, DNS verification, deliverability scoring',

  // ===== SYSTEM-SPECIFIC ATTRIBUTES =====
  systemAttributes: {
    vendor: 'SendGrid Email Validation API',
    capabilities: [
      'RFC 5322 format validation',
      'DNS MX record verification',
      'SMTP mailbox verification',
      'Disposable email detection',
      'Typo detection',
      'Deliverability score (0-100)',
    ],
    sla: {
      availability: '99.9% uptime',
      latency: '< 200ms p95, < 500ms p99',
      throughput: '10,000 requests/second',
    },
    authentication: 'API key (Bearer token)',
    rateLimit: '100,000 requests/month (enterprise tier)',
    pricing: 'GD$0.002 per validation',
    integration: 'RESTful API with JSON payloads over HTTPS',
    documentation: 'https://sendgrid.com/docs/api-reference/mail-validation',
    caching: 'Results cached for 24 hours (40% hit rate)',
  },

  // Systems still have goals and pain points!
  goals: [
    'Validate emails before database storage',
    'Reduce bounce rates from 15% to <2%',
    'Prevent spam/fake registrations',
  ],
  painPoints: [
    'False positives blocking legitimate users',
    'Latency impact on registration flow',
    'Cost at scale (GD$0.002 adds up)',
  ],

  // Systems have behavior patterns
  behavior: {
    typicalBehaviors: ['Returns results in <200ms', 'Provides detailed error messages'],
    communicationStyle: 'Technical and precise - structured JSON responses',
    usagePatterns: ['Synchronous during registration', 'Batch overnight for cleanup'],
  },

  technicalProficiency: 'high',
  preferredChannels: ['REST API', 'batch validation API', 'webhooks'],

  tags: ['external-service', 'saas', 'email', 'validation', 'critical-dependency'],
})
export class EmailValidationServicePersona {}
```

`★ Insight ─────────────────────────────────────`

System personas model technical dependencies as first-class entities. The EmailValidationService has SLA commitments (99.9% uptime, <200ms p95), pricing models (GD$0.002 per validation), and pain points (false positives, latency). This enables AI to reason about system constraints, costs, and failure modes just like human stakeholders.

`─────────────────────────────────────────────────`

### Organization Personas

Organizations (companies, regulators, partners) are also personas:

```typescript
@Persona({
  type: PersonaType.Organization,
  name: 'Financial Services Regulatory Authority',
  description: 'Government regulatory body overseeing financial institutions',

  // ===== ORGANIZATION-SPECIFIC ATTRIBUTES =====
  organizationAttributes: {
    organizationType: 'Regulatory body',
    size: 'Government agency (500+ employees)',
    industry: 'Financial services regulation',
    jurisdiction: 'National',
    complianceRequirements: [
      'Annual compliance reporting',
      'Audit trail maintenance (7 years)',
      'Consumer complaint handling',
      'Data breach notification within 72 hours',
    ],
    keyContacts: [
      'Jane Smith - Chief Compliance Officer',
      'Robert Johnson - Consumer Protection Director',
    ],
  },

  goals: [
    'Ensure consumer protection',
    'Maintain financial system stability',
    'Enforce compliance with regulations',
  ],
  painPoints: [
    'Incomplete or late compliance reporting',
    'Difficulty accessing audit trails',
    'Consumer complaints not properly handled',
  ],

  preferredChannels: ['formal reports', 'email', 'regulatory portal'],
  technicalProficiency: 'medium',

  tags: ['regulatory', 'government', 'compliance', 'critical-stakeholder'],
})
export class FinancialRegulatoryAuthorityPersona {}
```

---

## @Stakeholder Decorator: WHAT Someone Does

### Core Concept

`★ Insight ─────────────────────────────────────`

Stakeholders represent **context-specific roles**. Marcus Lee persona becomes "MobileAccountOpenerStakeholder" in the account opening context, "InvestorStakeholder" in the wealth management context, and "CustomerSupportCallerStakeholder" in the support context. Same person, different roles, different responsibilities, different authority, different relationships.

`─────────────────────────────────────────────────`

### Stakeholder Formula

```
Stakeholder = WHO (persona) + WHAT (role) + WHERE (context)
```

### Stakeholder Types

Stakeholder types mirror persona types (same enum):

```typescript
enum StakeholderType {
  Human = 'human',        // Individual in specific role
  Team = 'team',          // Team with specific charter
  Organization = 'organization', // Organization in specific relationship
  System = 'system',      // System serving specific purpose
}
```

### Core Structure

Every `@Stakeholder` decorator must specify:
- **`type`** (required): StakeholderType enum value
- **`role`** (required): The specific role name
- **`persona`** (required): Reference to `@Persona` class (WithPersona<Constructor>)
- **`context`** (required): Reference to `@Context` class (WithContext<Constructor>)

### Anatomy of @Stakeholder

Let's examine a comprehensive Human stakeholder example:

```typescript
@Stakeholder({
  // ===== IDENTITY =====
  type: StakeholderType.Human,
  role: 'Primary Investor',
  name: 'High-Net-Worth Individual Investor',
  description: 'High-net-worth individual seeking diversified investments with ESG focus',
  tags: ['external', 'high-value', 'esg-focused'],

  // ===== CORE RELATIONSHIPS (Required) =====
  persona: TechSavvyMillennialPersona, // The WHO
  context: InvestmentManagementContext, // The WHERE

  // ===== ROLE DEFINITION & SCOPE =====
  goals: [
    'Achieve 8-10% annual returns with moderate risk',
    'Build diversified portfolio (15+ positions)',
    'Track performance daily via mobile',
    'Align investments with ESG principles',
  ],
  responsibilities: [
    'Review investment opportunities weekly',
    'Approve or reject investment recommendations',
    'Monitor portfolio performance and rebalancing',
    'Maintain minimum GD$50K account balance',
  ],
  accountability: [
    'Portfolio performance meets benchmark +2%',
    'Compliance with investment policy statement',
    'Timely response to recommendations (within 48 hours)',
  ],
  interests: [
    'High returns with moderate risk (max 15% drawdown)',
    'Tax-efficient strategies',
    'ESG compliance',
    'Transparent fees',
  ],
  constraints: [
    'Cannot invest in tobacco, firearms, fossil fuels',
    'Must diversify (no single position > 10%)',
    'No options/derivatives trading',
  ],

  // ===== INFLUENCE & POWER DYNAMICS =====
  influence: 'high', // 'low' | 'medium' | 'high'
  influenceSphere: [
    'Investment strategy and asset allocation',
    'Risk tolerance decisions',
    'Fee negotiations',
    'Service provider selection',
  ],
  decisionAuthority: [
    'Approval of investments up to GD$50K',
    'Portfolio rebalancing within approved asset classes',
    'Withdrawal requests of any size',
  ],
  stakeholderPriority: 'primary', // 'primary' | 'secondary' | 'tertiary'

  // Structured decision rights (RACI-style)
  decisionRights: {
    canApprove: ['Investments under GD$50K', 'Rebalancing', 'Withdrawals'],
    canVeto: ['ESG violations', 'High-risk outside policy', 'Fee increases'],
    mustConsult: ['Major strategy changes', 'Asset allocation shifts > 10%', 'New products'],
    mustInform: ['All trades', 'Quarterly performance', 'Material risk changes'],
  },

  // ===== ENGAGEMENT & COLLABORATION =====
  engagement: 'daily', // 'daily' | 'weekly' | 'monthly' | 'occasional'

  // Structured collaboration patterns
  collaborationPatterns: [
    {
      withStakeholder: FinancialAdvisorStakeholder,
      collaborationType: 'sync', // 'sync' | 'async' | 'event-driven'
      purpose: 'Joint review of investment performance and strategy',
      frequency: 'quarterly',
      touchpoints: ['Quarterly meeting', 'Ad-hoc phone calls', 'Email updates'],
      artifacts: ['Performance reports', 'Investment proposals', 'Strategy documents'],
    },
    {
      withStakeholder: RiskManagerStakeholder,
      collaborationType: 'async',
      purpose: 'Risk assessment for new investment proposals',
      frequency: 'as-needed',
      touchpoints: ['Email reviews', 'Risk reports'],
      artifacts: ['Risk analysis', 'Compliance checklists'],
    },
  ],

  // Communication preferences
  communicationPreferences: {
    preferredChannels: ['mobile-app', 'email', 'phone', 'video-call'],
    responseTime: 'Within 24 hours non-urgent; 2 hours urgent',
    escalationPath: 'Call mobile after 48 hours no response',
    availability: '9 AM - 9 PM EST weekdays; 10 AM - 6 PM weekends',
  },

  touchpoints: [
    'Mobile app - Daily portfolio check',
    'Email - Weekly market updates',
    'Video call - Quarterly performance reviews',
    'Phone - Ad-hoc consultations',
  ],

  // ===== CONTEXT-SPECIFIC ATTRIBUTES =====
  permissions: [
    'view_portfolio',
    'view_transactions',
    'initiate_transfers',
    'download_statements',
    'approve_investments',
  ],
  contextualNeeds: [
    'Real-time portfolio performance (daily updates)',
    'Risk analytics dashboard (volatility, drawdown)',
    'ESG compliance scoring for holdings',
    'Tax-loss harvesting recommendations',
  ],
  painPoints: [
    'Mobile app slow during market hours',
    'Confusing fee structure',
    'Delayed trade confirmations',
    'ESG scoring methodology not transparent',
  ],
  successCriteria: [
    'Portfolio outperforms S&P 500 by 2%',
    'No unexpected losses > 5% in quarter',
    'Access key info within 3 clicks',
    '100% ESG compliance across holdings',
  ],

  // ===== RELATIONSHIPS & DEPENDENCIES =====
  // Structured relationships (how this stakeholder relates to others)
  relationships: [
    {
      stakeholder: FinancialAdvisorStakeholder,
      relationshipType: 'collaborates-with', // 'reports-to' | 'collaborates-with' | 'depends-on' | 'serves' | 'governs' | 'consults' | 'informs'
      description: 'Primary advisory relationship for investment strategy',
      interactionFrequency: 'quarterly',
      communicationChannels: ['video-call', 'email', 'phone'],
      formalAgreements: ['Investment Advisory Agreement 2024', 'Fee Schedule 2024'],
    },
    {
      stakeholder: PortfolioManagerStakeholder,
      relationshipType: 'depends-on',
      description: 'Depends on for day-to-day portfolio management',
      interactionFrequency: 'weekly',
      communicationChannels: ['email', 'mobile-app'],
    },
  ],

  // Dependencies (what/who this stakeholder needs)
  dependencies: [
    MarketDataServiceStakeholder,
    RiskAnalyticsEngineStakeholder,
    ESGScoringServiceStakeholder,
  ],

  // Dependents (who depends on this stakeholder)
  dependents: [
    PortfolioManagerStakeholder,
    ReportingSystemStakeholder,
  ],

  // ===== PERFORMANCE & METRICS =====
  metrics: [
    PortfolioReturnsMetric,
    RiskAdjustedPerformanceMetric,
    CustomerSatisfactionMetric,
  ],
  kpis: [
    'Portfolio return > 8% annually',
    'Max drawdown < 15%',
    'Sharpe ratio > 1.0',
    'ESG score > 80/100',
  ],
  satisfactionIndicators: [
    'Uses mobile app daily',
    'Refers friends',
    'NPS score > 8',
    'Increases investment balance quarterly',
  ],

  // ===== STRATEGIC ALIGNMENT =====
  strategicImportance: 'critical', // 'critical' | 'important' | 'supporting'
  businessValue: 'Provides GD$2M+ in AUM with low churn, high referral potential',

  // Risk assessment
  risks: [
    {
      risk: 'May switch to competitor offering lower fees',
      likelihood: 'medium', // 'low' | 'medium' | 'high'
      impact: 'high',
      mitigation: 'Quarterly check-ins, proactive communication, fee transparency',
    },
    {
      risk: 'Market downturn may cause losses exceeding tolerance',
      likelihood: 'medium',
      impact: 'high',
      mitigation: 'Proactive risk monitoring, regular rebalancing, downside protection',
    },
  ],
})
export class PrimaryInvestorStakeholder {}
```

`★ Insight ─────────────────────────────────────`

The `relationships` and `collaborationPatterns` fields model the **organizational graph**. A stakeholder doesn't exist in isolation—they collaborate-with FinancialAdvisor quarterly, depend-on PortfolioManager weekly, and must-inform RiskManager on material changes. These relationships form the coordination structure that Aabha uses to orchestrate complex multi-stakeholder processes.

`─────────────────────────────────────────────────`

### System Stakeholder Example

```typescript
@Stakeholder({
  type: StakeholderType.System,
  role: 'Email Validation Service',
  persona: EmailValidationServicePersona,
  context: DigitalBankingContext,
  description: 'Third-party service ensuring deliverability, reducing bounce rates',

  goals: ['Validate 99.9% correctly', 'Response time < 200ms'],
  responsibilities: ['Validate syntax', 'Check DNS', 'Flag suspicious domains'],
  permissions: ['read_email_input', 'write_validation_result', 'access_dns_records'],

  influence: 'medium',
  stakeholderPriority: 'secondary',
  engagement: 'daily',

  metrics: [ServiceUptimeMetric, APIResponseTimeMetric, ErrorRateMetric],
  kpis: ['Uptime > 99.9%', 'Response time < 200ms', 'Error rate < 0.1%'],

  strategicImportance: 'important',
  businessValue: 'Enables compliant email communications, avoiding GD$100K+ in fines',

  tags: ['external-service', 'api-integration', 'critical-path'],
})
export class EmailValidationServiceStakeholder {}
```

---

## Persona ↔ Stakeholder Relationship

### One Persona, Multiple Stakeholders

`★ Insight ─────────────────────────────────────`

This is the power of persona-stakeholder separation: Marcus Lee persona (age 26, software developer, mobile-first) can be THREE different stakeholders: (1) MobileAccountOpenerStakeholder in AccountOpeningContext with goal "Open account in < 5 minutes", (2) SavingsAccountHolderStakeholder in RetailBankingContext with responsibility "Maintain minimum balance", (3) FirstTimeInvestorStakeholder in WealthManagementContext with constraint "Cannot invest in high-risk products". Same person, different contexts, different roles.

`─────────────────────────────────────────────────`

```typescript
// The WHO (persona) - defined once
@Persona({
  type: PersonaType.Human,
  name: 'Marcus Lee - Young Professional',
  age: '26',
  occupation: 'Software Developer',
  // ... all intrinsic characteristics
})
export class MarcusLeePersona {}

// WHAT Marcus does in Account Opening context
@Stakeholder({
  type: StakeholderType.Human,
  role: 'Mobile Account Opener',
  persona: MarcusLeePersona, // Links to WHO
  context: MobileAccountOpeningContext, // WHERE
  goals: ['Open account in < 5 minutes', 'No branch visit required'],
  responsibilities: ['Provide valid ID', 'Fund account with minimum balance'],
  // Context-specific attributes for account opening
})
export class MobileAccountOpenerStakeholder {}

// WHAT Marcus does in Wealth Management context
@Stakeholder({
  type: StakeholderType.Human,
  role: 'First-Time Investor',
  persona: MarcusLeePersona, // Same WHO
  context: WealthManagementContext, // Different WHERE
  goals: ['Start investing with GD$200/month', 'Learn investing basics'],
  constraints: ['Cannot invest in high-risk products', 'Max 10% in single asset'],
  // Context-specific attributes for investing
})
export class FirstTimeInvestorStakeholder {}

// WHAT Marcus does in Customer Support context
@Stakeholder({
  type: StakeholderType.Human,
  role: 'Support Caller',
  persona: MarcusLeePersona, // Same WHO
  context: CustomerSupportContext, // Different WHERE
  goals: ['Resolve issue within 10 minutes', 'Avoid phone calls if possible'],
  preferences: { preferredChannels: ['chat', 'email'] }, // Prefers digital channels
  // Context-specific attributes for support
})
export class SupportCallerStakeholder {}
```

### How AI Uses This

When AI encounters an action like "OpenAccountAction" in MobileAccountOpeningJourney:

1. **Reads Journey**: `MobileAccountOpeningJourney` has `stakeholder: MobileAccountOpenerStakeholder`
2. **Follows to Stakeholder**: Discovers Marcus is in role "Mobile Account Opener" with goals ["Open account < 5 minutes"]
3. **Follows to Persona**: Discovers Marcus is 26-year-old software developer, mobile-first, tech-savvy
4. **Infers Behavior**: Combines context-specific goals (fast account opening) with intrinsic characteristics (mobile-first, impatient) → AI predicts Marcus will abandon if mobile flow takes > 2 minutes
5. **Optimizes Journey**: AI prioritizes mobile UX optimization, instant validation, pre-filling data to meet stakeholder goals given persona characteristics

---

## Complete Examples

### Example 1: Digital Account Opening (Human Stakeholder)

```typescript
// File: src/model/personas/human/customers/young-professional.persona.ts
@Persona({
  type: PersonaType.Human,
  name: 'Young Professional',
  age: '25-35',
  occupation: 'Knowledge worker',
  demographics: {
    incomeLevel: 'GD$40K-GD$70K/year',
    educationLevel: "Bachelor's degree or higher",
    location: 'Urban',
    employmentStatus: 'Full-time employed',
  },
  psychology: {
    values: ['Efficiency', 'Transparency', 'Technology'],
    riskTolerance: 'medium',
    decisionMakingStyle: 'Analytical - researches before deciding',
  },
  behavior: {
    typicalBehaviors: ['Mobile-first', 'Never visits branches', 'Checks balance daily'],
    technologyAdoption: 'early-adopter',
  },
  needs: {
    functional: ['Fast account opening', 'Instant transfers', '24/7 access'],
    emotional: ['Feel in control', 'Feel secure'],
  },
  technicalProficiency: 'high',
  preferredChannels: ['mobile app', 'web banking'],
  tags: ['millennial', 'digital-native', 'mobile-first'],
})
export class YoungProfessionalPersona {}

// File: src/model/stakeholders/digital-banking/mobile-account-opener.stakeholder.ts
@Stakeholder({
  type: StakeholderType.Human,
  role: 'Mobile Account Opener',
  persona: YoungProfessionalPersona,
  context: MobileAccountOpeningContext,

  goals: [
    'Open account in under 5 minutes',
    'No branch visit required',
    'Instant account activation',
  ],
  responsibilities: [
    'Provide valid government ID',
    'Submit selfie for identity verification',
    'Fund account with minimum balance',
  ],
  successCriteria: [
    'Account opened in < 5 minutes',
    'Zero errors during signup',
    'Instant debit card issuance',
  ],

  influence: 'high', // High-value customer segment
  stakeholderPriority: 'primary',
  engagement: 'one-time', // For account opening journey

  permissions: ['submit_application', 'upload_id', 'fund_account'],

  painPoints: [
    'Slow mobile app performance',
    'Complex forms with too many fields',
    'ID verification failures',
    'Delayed account activation',
  ],

  communicationPreferences: {
    preferredChannels: ['mobile app', 'email'],
    responseTime: 'Instant (real-time)',
  },

  dependencies: [
    EmailValidationServiceStakeholder,
    KYCVerificationServiceStakeholder,
    CoreBankingSystemStakeholder,
  ],

  metrics: [TimeToAccountOpeningMetric, SuccessRateMetric, CustomerSatisfactionMetric],
  kpis: ['Time to open < 5 min', 'Success rate > 95%', 'NPS > 50'],

  strategicImportance: 'critical',
  businessValue: 'Primary growth segment - represents 60% of new customer acquisitions',

  tags: ['digital-banking', 'account-opening', 'high-priority'],
})
export class MobileAccountOpenerStakeholder {}
```

### Example 2: Compliance Review (Human Stakeholder in Offline Context)

```typescript
// File: src/model/stakeholders/risk-compliance/compliance-officer.stakeholder.ts
@Stakeholder({
  type: StakeholderType.Human,
  role: 'Compliance Officer',
  persona: ComplianceExpertPersona,
  context: AccountOpeningComplianceContext,

  goals: [
    'Verify AML compliance for all high-risk accounts',
    'Complete review within 2 business days',
    'Maintain 100% audit trail',
  ],
  responsibilities: [
    'Review enhanced due diligence documents',
    'Verify source of funds for deposits > GD$100K',
    'Approve or reject high-risk account openings',
    'Document decision rationale',
  ],
  accountability: [
    'Zero regulatory violations',
    'Complete audit trails maintained for 7 years',
    'Decisions defensible in regulatory audit',
  ],

  influence: 'high',
  decisionAuthority: ['Approve/reject high-risk accounts', 'Request additional documentation'],
  stakeholderPriority: 'primary',

  decisionRights: {
    canApprove: ['High-risk accounts with complete documentation'],
    canVeto: ['Accounts with insufficient KYC', 'Source of funds unclear'],
    mustConsult: ['Legal team for complex cases', 'Senior management for > GD$1M'],
    mustInform: ['Risk committee of all approvals', 'Regulators of suspicious activity'],
  },

  collaborationPatterns: [
    {
      withStakeholder: AccountOpeningAgentStakeholder,
      collaborationType: 'async',
      purpose: 'Receive applications requiring manual review',
      frequency: 'daily',
      touchpoints: ['Compliance queue', 'Email notifications'],
      artifacts: ['Application package', 'ID documents', 'Source of funds proof'],
    },
    {
      withStakeholder: SeniorComplianceManagerStakeholder,
      collaborationType: 'sync',
      purpose: 'Escalation for complex or high-value cases',
      frequency: 'as-needed',
      touchpoints: ['In-person meeting', 'Phone call'],
      artifacts: ['Case summary', 'Recommendation memo'],
    },
  ],

  touchpoints: [
    'Compliance review dashboard',
    'Document management system',
    'Regulatory reporting portal',
  ],

  permissions: [
    'view_kyc_documents',
    'view_transaction_history',
    'approve_high_risk_account',
    'reject_application',
    'request_additional_info',
  ],

  contextualNeeds: [
    'Clear AML risk scoring (0-100 scale)',
    'Automated document OCR (reduce manual review)',
    'Historical compliance decisions for precedent',
    'Real-time regulatory guidance',
  ],

  painPoints: [
    'Incomplete documentation from account opening agents',
    'Poor quality ID scans (hard to verify)',
    'No context on why case escalated to manual review',
    'Tight SLA (2 days) for complex cases',
  ],

  relationships: [
    {
      stakeholder: SeniorComplianceManagerStakeholder,
      relationshipType: 'reports-to',
      description: 'Reports all high-risk decisions, escalates edge cases',
      interactionFrequency: 'daily',
    },
    {
      stakeholder: RegulatoryBodyStakeholder,
      relationshipType: 'informs',
      description: 'Files suspicious activity reports (SARs) when required',
      interactionFrequency: 'as-needed',
      formalAgreements: ['SAR filing requirements', 'Regulatory reporting standards'],
    },
  ],

  metrics: [ComplianceReviewTimeMetric, DecisionAccuracyMetric, AuditTrailCompletenessMetric],
  kpis: [
    'Review time < 2 business days',
    'Zero regulatory violations',
    '100% audit trail completeness',
    'Decision overturn rate < 5%',
  ],

  strategicImportance: 'critical',
  businessValue: 'Prevents GD$1M+ in regulatory fines, protects bank reputation',

  risks: [
    {
      risk: 'Insufficient training on new regulations',
      likelihood: 'medium',
      impact: 'high',
      mitigation: 'Quarterly regulatory training, compliance updates',
    },
    {
      risk: 'Overwhelmed by manual review volume',
      likelihood: 'high',
      impact: 'medium',
      mitigation: 'AI-assisted triage, hire additional officers',
    },
  ],

  tags: ['compliance', 'risk', 'regulatory', 'manual-review', 'critical-control'],
})
export class ComplianceOfficerStakeholder {}
```

### Example 3: System-to-System Stakeholder

```typescript
// File: src/model/stakeholders/systems/kyc-verification-system.stakeholder.ts
@Stakeholder({
  type: StakeholderType.System,
  role: 'KYC Verification System',
  persona: DocumentVerificationAIPersona,
  context: AccountOpeningContext,

  goals: [
    'Verify identity documents with 99% accuracy',
    'Complete verification in < 30 seconds',
    'Flag suspicious documents for manual review',
  ],
  responsibilities: [
    'Extract data from government IDs (passport, license)',
    'Verify document authenticity (security features)',
    'Match selfie to ID photo (facial recognition)',
    'Perform liveness detection (not a photo of a photo)',
  ],

  influence: 'high', // Gates entire account opening journey
  stakeholderPriority: 'primary',
  engagement: 'real-time',

  permissions: [
    'read_id_document_image',
    'read_selfie_image',
    'write_verification_result',
    'flag_for_manual_review',
  ],

  dependencies: [
    DocumentStorageServiceStakeholder,
    FacialRecognitionAPIStakeholder,
  ],
  dependents: [
    MobileAccountOpenerStakeholder, // Waits for verification
    ComplianceOfficerStakeholder, // Reviews flagged cases
  ],

  collaborationPatterns: [
    {
      withStakeholder: ComplianceOfficerStakeholder,
      collaborationType: 'event-driven',
      purpose: 'Escalate low-confidence verifications for manual review',
      frequency: 'continuous',
      touchpoints: ['Compliance queue webhook'],
      artifacts: ['Verification result', 'Confidence score', 'ID images'],
    },
  ],

  contextualNeeds: [
    'High-resolution ID images (min 1200x800px)',
    'Good lighting conditions for facial recognition',
    'Training data for new ID types',
  ],

  painPoints: [
    'Poor quality ID images (blurry, dark)',
    'New ID formats not in training data',
    'False positives on legitimate documents',
    'Adversarial attacks (deepfakes, printed photos)',
  ],

  metrics: [VerificationAccuracyMetric, ProcessingTimeMetric, FalsePositiveRateMetric],
  kpis: [
    'Accuracy > 99%',
    'Processing time < 30 seconds',
    'False positive rate < 1%',
    'False negative rate < 0.1%',
  ],

  strategicImportance: 'critical',
  businessValue: 'Enables instant account opening, reduces manual review costs by GD$500K/year',

  risks: [
    {
      risk: 'Model drift over time (accuracy degrades)',
      likelihood: 'medium',
      impact: 'high',
      mitigation: 'Monthly model retraining, A/B testing new models',
    },
    {
      risk: 'Service outage blocks all account openings',
      likelihood: 'low',
      impact: 'high',
      mitigation: 'Circuit breaker pattern, fallback to manual review',
    },
  ],

  tags: ['ai-system', 'kyc', 'identity-verification', 'critical-path'],
})
export class KYCVerificationSystemStakeholder {}
```

---

## Key Takeaways

`★ Insight ─────────────────────────────────────`

**Persona vs Stakeholder Mental Model:**
- **Persona = Archetype** (who they are intrinsically): Marcus is 26, software developer, mobile-first, risk-tolerant—this doesn't change
- **Stakeholder = Role** (what they do in context): Marcus as MobileAccountOpener has goal "open in <5 min" in AccountOpeningContext; as FirstTimeInvestor has constraint "no high-risk products" in WealthManagementContext
- **Why separate?** One Marcus persona → many stakeholder roles → reuse intrinsic characteristics, context-specific responsibilities
- **AI benefit:** When AI sees "MobileAccountOpener", it knows both role-specific goals (fast opening) AND persona characteristics (impatient, mobile-first) → optimizes journey for BOTH

`─────────────────────────────────────────────────`

1. **@Persona captures WHO**: Demographics, psychology, behaviors, needs (context-independent archetypes)
2. **@Stakeholder captures WHAT**: Role, responsibilities, authority, relationships (context-specific)
3. **One persona → many stakeholders**: Same person, different contexts, different roles
4. **Four types each**: Human, Team, Organization, System (personas AND stakeholders)
5. **Rich relationship modeling**: `relationships`, `collaborationPatterns`, `dependencies` form organizational graph
6. **System personas matter**: APIs and services are first-class stakeholders with SLAs, costs, failure modes
7. **Compile-time safety**: `persona: WithPersona<Constructor>` ensures type-safe references

---

**Next**: [File 6: Behavioral Decorators](./06-behavioral-decorators.md) - How to model implementation units with `@Behavior`, BDD-style verification with `@Witness` (method decorator!), and rare edge case with `@Attribute` (class decorator for reusable data properties)
