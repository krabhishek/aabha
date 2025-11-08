# Strategic Decorators

**Strategic-level components for modeling business strategy**

This document covers the four decorators that model business strategy: @Strategy, @BusinessInitiative, @Metric, and @Context. These are the highest level components in Aabha, providing the "why" and "what" before diving into the "how" of journeys and actions.

---

## Core Concepts

### The Strategic Layer

```
@Strategy ←── defines the game plan
    ↓ references
@Metric  ←── measures success

@BusinessInitiative ←── executes strategy through concrete initiatives
    ↓ references
@Journey ←── implements initiatives via customer/user journeys

@Context ←── organizational boundaries (DDD bounded contexts)
```

**Key Principles:**
- All four decorators are **class decorators on empty classes**
- **Playing to Win framework** (Roger L. Martin) powers @Strategy
- **Metrics attach anywhere** - strategy, initiative, journey, context, action
- **Contexts are stakeholder-free** - they define boundaries, not people

---

## 1. @Strategy Decorator

**Purpose**: Model business strategy using the Playing to Win framework.

###  Schema Overview

```typescript
@Strategy({
  name: string,                    // Required: Strategy name

  // Playing to Win Framework (5 core questions)
  winningAspiration?: string,      // What does winning look like?
  whereToPlay?: string[],          // Which markets/segments?
  howToWin?: string,               // Competitive advantage?
  coreCapabilities?: string[],     // What capabilities needed?
  managementSystems?: string[],    // Systems to build capabilities?

  // Strategic Choices
  strategicChoices?: {
    focus: string[],               // What we WILL do
    deliberateExclusions: string[] // What we WON'T do
  },

  // Context & Validation
  competitiveContext?: string,     // Market landscape
  valueProposition?: string,       // Unique value created
  assumptions?: string[],          // Critical assumptions

  // Metrics & Execution
  metrics?: WithMetric<Constructor>[],  // Success metrics
  timeHorizon?: string,            // Timeline (e.g., "2024-2027")
  objectives?: string[],           // Concrete objectives
  risks?: Array<{risk, mitigation, impact, likelihood}>,

  // Governance
  owner?: string,
  reviewCycle?: string,
  lastReviewed?: string,
  nextReview?: string,

  // Metadata
  description?: string,
  tags?: string[],
  extensions?: Record<string, unknown>
})
export class YourStrategy {}
```

### Complete Example: OgPgy Bank Digital Transformation

```typescript
import { Strategy, Metric, MetricCategory } from 'aabha';

// First, define metrics (Strategy references Metrics)
@Metric({
  name: 'Net Promoter Score',
  category: MetricCategory.Customer,
  baseline: 42,
  currentValue: 50,
  target: 65,
  unit: 'score',
  direction: 'higher-is-better'
})
export class NPSMetric {}

@Metric({
  name: 'Digital Adoption Rate',
  category: MetricCategory.Business,
  baseline: 37.5,
  target: 62.5,
  unit: 'percentage',
  direction: 'higher-is-better'
})
export class DigitalAdoptionMetric {}

// Then, define the strategy
@Strategy({
  name: 'Digital Transformation Strategy 2024-2027',

  description:
    "Transform OgPgyBank from branch-centric bank to digital-first " +
    "banking powerhouse, combining 72 years of trusted heritage with " +
    "modern technology to deliver instant financial experiences",

  // ============================================================
  // Playing to Win Framework
  // ============================================================

  winningAspiration:
    "To become Genai's most loved bank by 2027, combining trusted " +
    "heritage with digital-first experiences, and establish OgPgyBank " +
    "as a globally recognized banking powerhouse through an IPO",

  whereToPlay: [
    // Customer Segments
    'Mass Market Retail Banking (3.2M customers)',
    'SME & Commercial Banking (GD$18B → GD$25.2B portfolio)',
    'Mass Affluent Wealth Management (new, Q1 2025)',
    // Geographic Markets
    'Genai Domestic Market (8.5M population)',
    'Genai Diaspora & Expats (remittances)',
    // Channels
    'Mobile-First Digital Banking (primary)',
    'Omnichannel Experience (247 → 220 advice centers)',
    'API & Embedded Banking (partner ecosystem)'
  ],

  howToWin:
    'Beat neobanks on TRUST (72-year heritage, GD$125B assets), ' +
    'beat traditional banks on SPEED (instant everything, AI-powered, mobile-first). ' +
    'Combine trusted brand with digital-first experiences: "Your trusted bank, now instant."',

  coreCapabilities: [
    'Cloud-Native Banking Platform (microservices, 100% by Q4 2025)',
    'AI/ML Excellence (95% fraud detection, personalized recommendations)',
    'Data & Analytics Mastery (single customer view, real-time pipelines)',
    'Digital Experience Design (4.9 star app, 5-min account opening)',
    'Omnichannel Excellence (220 digitized advice centers)',
    'Risk & Compliance Leadership (zero critical incidents)',
    'Agile Operating Model (cross-functional squads)'
  ],

  managementSystems: [
    'Quarterly Strategy Reviews (Executive team + Board)',
    'Monthly OKR Reviews (company-wide alignment)',
    'Weekly Transformation Standups (cross-functional leadership)',
    'Real-Time Metrics Dashboard (11 transformation metrics)'
  ],

  // ============================================================
  // Strategic Choices
  // ============================================================

  strategicChoices: {
    focus: [
      'Mobile-First Experience (2M users by 2027)',
      'Customer Experience Excellence (NPS 42 → 65)',
      'Gen-Z & Millennial Acquisition (500K new customers)',
      'Core Banking Modernization (100% cloud by Q4 2025)',
      'SME Banking Growth (GD$18B → GD$25.2B portfolio)'
    ],

    deliberateExclusions: [
      'NO Regional Expansion (focus Genai first)',
      'NO Acquisitions (organic growth only)',
      'NO Ultra-High-Net-Worth segment',
      'NO Branch Expansion (consolidate to 220)',
      'NO Blockchain/Crypto (regulatory uncertainty)'
    ]
  },

  // ============================================================
  // Strategic Context
  // ============================================================

  competitiveContext:
    "Genai banking market has 12 banks, GD$425B assets. Lost 120,000 " +
    "customers in Q2 2022 to NeoBrightBank (neobank). Threats: digital-first " +
    "neobanks with modern UX, slow traditional bank competitors, potential " +
    "BigTech entry. Opportunities: leading transformation, #1 satisfaction, " +
    "open banking mandated 2024",

  valueProposition:
    "Your trusted bank, now instant. 72 years of heritage + instant account " +
    "opening + AI insights + 220 advice centers when you need humans. Financial " +
    "inclusion for all, delivered digitally.",

  assumptions: [
    'Cloud-native migration completes by Q4 2025 without disruptions',
    'Customers value speed but still trust traditional banks over neobanks',
    'Mobile penetration in Genai reaches 85% by 2027',
    'Genai Central Bank remains supportive of digital innovation',
    '8,200 employees can be reskilled for digital-first model'
  ],

  // ============================================================
  // Metrics & Timeline
  // ============================================================

  metrics: [
    NPSMetric,
    DigitalAdoptionMetric
    // ... other metrics
  ],

  timeHorizon: '2024-2027 (3-year transformation, IPO-ready by end)',

  objectives: [
    '2024 Q4: Mobile app 4.8 stars, 40% digital adoption, 60% core banking migrated',
    '2025 Q4: 100% core banking migrated, 1.65M digital users, 92% fraud detection',
    '2026 Q4: 220 advice centers, 60% digital adoption, GD$23B SME portfolio',
    '2027 Q4: IPO execution, all targets achieved, transformation complete'
  ],

  // ============================================================
  // Risk Management
  // ============================================================

  risks: [
    {
      risk: 'Core banking migration failure causing service disruptions',
      impact: 'high',
      likelihood: 'medium',
      mitigation: 'Phased migration, 6-month parallel run, extensive testing, rollback plans'
    },
    {
      risk: 'Neobank competitor raises funding and accelerates',
      impact: 'medium',
      likelihood: 'medium',
      mitigation: 'Accelerate digital features, emphasize trust advantage, monitor competitors'
    }
  ],

  // ============================================================
  // Governance
  // ============================================================

  owner: 'Sarah Nakamura, CEO',
  reviewCycle: 'Quarterly (Board), Monthly (Executive Team)',
  lastReviewed: '2024-10-15',
  nextReview: '2025-01-15',

  tags: [
    'digital-transformation',
    'playing-to-win',
    'customer-experience',
    'mobile-first'
  ]
})
export class DigitalTransformationStrategy {}
```

`★ Insight ─────────────────────────────────────`
- **Playing to Win framework** forces clarity on 5 critical questions—most strategies fail by skipping "what we WON'T do"
- Notice `strategicChoices.deliberateExclusions`—saying NO to regional expansion, acquisitions, and crypto is as important as saying YES to mobile-first
- **Metrics are direct class references**, not strings—this enables compile-time validation that metrics actually exist
`─────────────────────────────────────────────────`

---

## 2. @Metric Decorator

**Purpose**: Define measurable outcomes that can attach to any level (strategy, initiative, context, journey, action).

### Schema Overview

```typescript
@Metric({
  name: string,                    // Required
  category?: MetricCategory,       // Business, Customer, Operational, etc.

  // Strategic Context
  goal?: {                         // NEW: structured goal vs extension field
    goal: string,                  // Strategic purpose
    backstory?: string,            // Historical context
    businessValue?: string,        // Why this matters
    strategicAlignment?: string[]  // Links to strategy themes
  },

  // Measurement
  target?: number,
  baseline?: number,
  currentValue?: number,
  unit?: string,                   // '%', 'USD', 'score', 'count'
  direction?: 'higher-is-better' | 'lower-is-better',
  thresholds?: {
    critical?: number,
    warning?: number,
    healthy?: number
  },

  // Calculation & Data
  calculation?: string,
  frequency?: string,              // 'real-time', 'daily', 'monthly'
  measurementMethod?: string,
  dataSource?: {
    system: string,
    endpoint?: string,
    refreshFrequency?: string
  },

  // History & Trend
  history?: {
    trend: 'improving' | 'declining' | 'stable' | 'volatile',
    historicalValues?: Array<{timestamp, value}>,
    changeRate?: number,
    projectedValue?: number,
    confidenceInterval?: {lower, upper}
  },

  // Visualization
  visualization?: {
    dashboardUrl?: string,
    visualizationType?: 'line-chart' | 'gauge' | 'scorecard' | etc.,
    refreshInterval?: string,
    alerting?: {enabled, channels, conditions}
  },

  // Dimensions & Aggregation
  dimensions?: {
    dimensions?: string[],         // ['channel', 'region', 'segment']
    defaultDimension?: string,
    aggregationMethod?: 'sum' | 'average' | 'weighted-average' | etc.,
    rollupRules?: string
  },

  // Relationships
  relationships?: {
    leadsTo?: WithMetric<Constructor>[],         // This predicts these
    lagsFrom?: WithMetric<Constructor>[],        // These predict this
    correlatesWith?: WithMetric<Constructor>[],
    aggregatesFrom?: WithMetric<Constructor>[], // Rolls up from these
    influencedBy?: WithMetric<Constructor>[]
  },

  // Metadata
  description?: string,
  owner?: string,
  tags?: string[]
})
export class YourMetric {}
```

### Example 1: Customer Satisfaction (CES) Metric

```typescript
import { Metric, MetricCategory } from 'aabha';

@Metric({
  name: 'Customer Effort Score',
  category: MetricCategory.Customer,

  description:
    'Measures customer effort across all journeys. Lower score = less effort = better experience',

  goal: {
    goal: 'Reduce friction in every customer interaction to become easiest bank to work with',
    backstory:
      'Current CES is 3.2 (on 1-5 scale where 1 = very easy). Industry leading banks achieve <2.0. ' +
      'High effort drives churn—customers abandon journeys or switch banks.',
    businessValue:
      'Every 1-point CES reduction correlates with ~10-point NPS increase and 15% lower churn',
    strategicAlignment: ['Customer Experience First', 'Digital Transformation']
  },

  // Measurement
  baseline: 3.2,
  currentValue: 2.8,
  target: 1.8,
  unit: 'score (1-5 scale)',
  direction: 'lower-is-better',

  thresholds: {
    healthy: 2.0,   // Green: <2.0
    warning: 2.5,   // Yellow: 2.0-2.5
    critical: 3.0   // Red: >3.0
  },

  calculation:
    'Average of "How easy was it to complete this task?" (1=very easy, 5=very difficult) ' +
    'across post-journey surveys',

  frequency: 'monthly',
  measurementMethod:
    'Post-interaction surveys via app, email, SMS. Sample size: 3,000+ responses/month. ' +
    'Weighted by journey importance and volume',

  dataSource: {
    system: 'Qualtrics Customer Experience Platform',
    endpoint: 'https://analytics.ogpgybank.com/api/metrics/ces',
    refreshFrequency: '30d'
  },

  // History
  history: {
    trend: 'improving',
    historicalValues: [
      { timestamp: '2024-01-01', value: 3.2 },
      { timestamp: '2024-04-01', value: 3.0 },
      { timestamp: '2024-07-01', value: 2.9 },
      { timestamp: '2024-10-01', value: 2.8 }
    ],
    changeRate: -4.2, // Improving 4.2% per quarter
    projectedValue: 1.8,
    confidenceInterval: { lower: 1.9, upper: 2.1 }
  },

  // Visualization
  visualization: {
    dashboardUrl: 'https://analytics.ogpgybank.com/metrics/ces',
    visualizationType: 'line-chart',
    refreshInterval: '30d',
    alerting: {
      enabled: true,
      channels: ['email', 'slack', 'executive-dashboard'],
      conditions: ['exceeds-warning-threshold', 'month-over-month-increase']
    }
  },

  // Dimensions
  dimensions: {
    dimensions: ['journey', 'channel', 'customer_segment', 'region'],
    defaultDimension: 'journey',
    aggregationMethod: 'weighted-average',
    rollupRules: 'Weighted by journey volume; exclude journeys with <50 responses'
  },

  owner: 'Michael Santos, Chief Customer Officer',
  tags: ['customer-experience', 'transformation-kpi', 'executive-dashboard']
})
export class CustomerEffortScoreMetric {}
```

### Example 2: Operational Metric with Relationships

```typescript
@Metric({
  name: 'Account Opening Time',
  category: MetricCategory.Operational,

  goal: {
    goal: 'Instant account opening to compete with neobanks',
    backstory: 'Was 5 days (branch + paperwork), now 1 hour (digital), target 5 minutes',
    businessValue: 'Speed = conversion. Every hour delay = 15% more abandonment',
    strategicAlignment: ['Digital Core', 'Customer Experience First']
  },

  baseline: 7200,  // 5 days in minutes
  currentValue: 60,  // 1 hour in minutes
  target: 5,         // 5 minutes
  unit: 'minutes',
  direction: 'lower-is-better',

  thresholds: {
    healthy: 10,
    warning: 30,
    critical: 60
  },

  // Relationships
  relationships: {
    leadsTo: [ActiveDigitalUsersMetric],  // Faster opening → more users
    lagsFrom: [KYCVerificationSpeedMetric], // KYC speed predicts opening time
    influencedBy: [DocumentVerificationAccuracyMetric] // AI accuracy affects speed
  },

  frequency: 'real-time',
  calculation: 'Time from account creation initiated to account activated',

  owner: 'Raj Patel, CTO',
  tags: ['digital-transformation', 'operational-excellence', 'competitive-advantage']
})
export class AccountOpeningTimeMetric {}
```

`★ Insight ─────────────────────────────────────`
- **goal** field replaces the anti-pattern of stuffing backstory into `extensions`—structure enables AI to understand context
- **relationships** create a metric dependency graph—`leadsTo` and `lagsFrom` reveal cause-effect chains (CES reduction leads to NPS increase)
- **dimensions** enable slicing by journey, channel, segment—essential for finding where problems actually are (might be low overall CES but high in mobile app)
`─────────────────────────────────────────────────`

---

## 3. @Context Decorator

**Purpose**: Define organizational boundaries (DDD bounded contexts). Contexts are stakeholder-free—they represent areas of responsibility, not people.

### Schema Overview

```typescript
@Context({
  name: string,  // Required

  // Domain Boundaries (DDD)
  domainModel?: {
    coreEntities: string[],              // ['Account', 'Transaction']
    valueObjects?: string[],             // ['Money', 'AccountNumber']
    ubiquitousLanguage?: Record<string, string>  // Context-specific definitions
  },
  inScope?: string[],
  outOfScope?: string[],

  // Capabilities
  capabilities?: {
    core: string[],        // Strategic competencies
    supporting?: string[], // Necessary but not differentiating
    emerging?: string[]    // In development
  },

  // Context Relationships
  relationships?: Array<{
    context: WithContext<Constructor>,
    type: ContextRelationship,       // Upstream, Downstream, Partnership, etc.
    description?: string,
    exchanged?: string[],             // Data/services exchanged
    handoffProtocol?: string,
    communicationPattern?: 'sync' | 'async' | 'event-driven',
    frequency?: string
  }>,

  // Organizational Structure
  owner?: string,
  team?: string,
  goals?: string[],

  // Performance
  metrics?: WithMetric<Constructor>[],
  healthIndicators?: string[],

  // Operating Environment
  assumptions?: string[],
  constraints?: string[],

  // Metadata
  description?: string,
  tags?: string[]
})
export class YourContext {}
```

### Example: Digital Banking Context

```typescript
import { Context, ContextRelationship } from 'aabha';

// Import related contexts
import { RetailBankingContext } from './retail-banking.context.js';
import { RiskManagementContext } from './risk-management.context.js';

// Import metrics
import { DigitalAdoptionMetric } from '../metrics/digital-adoption.metric.js';
import { MobileAppRatingMetric } from '../metrics/mobile-app-rating.metric.js';

@Context({
  name: 'Digital Banking',

  description:
    'Manages mobile app, online banking, and digital self-service channels. ' +
    'Delivers world-class digital experiences competing with neobanks while ' +
    'maintaining OgPgyBank trusted brand',

  // ============================================================
  // Domain Boundaries (DDD Bounded Context)
  // ============================================================

  domainModel: {
    coreEntities: [
      'DigitalUser',
      'MobileSession',
      'OnlineSession',
      'DigitalTransaction',
      'DeviceRegistration'
    ],

    valueObjects: [
      'LoginCredentials',
      'SessionToken',
      'DeviceFingerprint',
      'AppVersion'
    ],

    ubiquitousLanguage: {
      'Digital User': 'Customer who logged into mobile/online in past 30 days',
      'Active Session': 'Authenticated session with valid token, not expired',
      'Device Trust': 'Confidence in device authenticity (registered, biometric)',
      'Self-Service': 'Capability customer completes without human assistance',
      'Instant Action': 'Transaction completed in <5 seconds end-to-end'
    }
  },

  inScope: [
    'Mobile banking app (iOS & Android)',
    'Online banking web platform',
    'Digital account opening & onboarding',
    'Self-service transactions (transfers, payments, bill pay)',
    'Biometric authentication (Face ID, Touch ID)',
    'Push notifications & in-app messaging',
    'Personal financial management features',
    'Digital customer support (chatbot)'
  ],

  outOfScope: [
    'Physical branch operations',
    'Call center voice support (owned by Customer Support)',
    'Core banking system (owned by Operations & Technology)',
    'Credit decisioning (owned by Risk Management)',
    'Physical card issuance (owned by Retail Banking)'
  ],

  // ============================================================
  // Capabilities
  // ============================================================

  capabilities: {
    core: [
      'Instant account opening (5 minutes end-to-end)',
      'Real-time transaction processing',
      'Biometric authentication & device management',
      'Mobile-first UX design & development',
      'Session management & security'
    ],

    supporting: [
      'App store management (iOS, Google Play)',
      'Digital marketing integration',
      'Customer feedback collection (NPS surveys)',
      'Analytics & behavior tracking',
      'A/B testing & feature flags'
    ],

    emerging: [
      'AI-powered financial insights',
      'Voice banking (Alexa, Google Assistant)',
      'Augmented reality features',
      'Conversational AI chatbot'
    ]
  },

  // ============================================================
  // Context Relationships
  // ============================================================

  relationships: [
    {
      context: RetailBankingContext,
      type: ContextRelationship.Partnership,
      description:
        'Partner on omnichannel experience—digital initiates, branch completes',
      exchanged: [
        'Account opening applications',
        'Customer preferences (digital vs branch)',
        'Incomplete transactions requiring branch assistance'
      ],
      handoffProtocol: 'Digital flags incomplete journey, branch staff access via shared CRM',
      communicationPattern: 'event-driven',
      frequency: 'on-demand'
    },

    {
      context: RiskManagementContext,
      type: ContextRelationship.Downstream,
      description: 'Receives fraud alerts and risk scoring for digital transactions',
      exchanged: [
        'Fraud risk scores',
        'Transaction approval/decline decisions',
        'Device trust scores',
        'Suspicious activity alerts'
      ],
      handoffProtocol: 'Real-time API for transaction approval (response <1 second)',
      communicationPattern: 'sync',
      frequency: 'real-time'
    }
  ],

  // ============================================================
  // Organizational Structure
  // ============================================================

  owner: 'Raj Patel, CTO',
  team: 'Digital Product & Engineering Team',

  goals: [
    'Grow digital users from 1.2M to 2.0M by end of 2025',
    'Maintain 4.8+ mobile app rating across iOS and Android',
    'Achieve <5 minute account opening time for 95% of applications',
    'Deliver 99.95% digital platform uptime',
    'Launch 2 major new digital features per quarter'
  ],

  // ============================================================
  // Performance
  // ============================================================

  metrics: [
    DigitalAdoptionMetric,
    MobileAppRatingMetric
  ],

  healthIndicators: [
    'Product team morale high (engineering NPS > 60)',
    'Low technical debt ratio (<15% of sprint capacity)',
    'Fast deployment velocity (daily deployments)',
    'Low production incident rate (<3 critical incidents/month)'
  ],

  // ============================================================
  // Operating Environment
  // ============================================================

  assumptions: [
    'Customer demand for digital banking continues strong growth',
    'Mobile device penetration in Genai continues increasing',
    'Cloud infrastructure (AWS) remains reliable and cost-effective',
    'Regulatory environment allows digital-only account opening'
  ],

  constraints: [
    'Must integrate with legacy core banking (60% modernized, 40% legacy)',
    'Regulatory requirement: KYC verification before account activation',
    'App store approval adds 1-3 day delay for releases',
    'Must support devices back to iOS 14 / Android 10',
    'Budget: GD$15M for 2025 digital investments'
  ],

  tags: ['customer-facing', 'digital-transformation', 'mobile-first', 'innovation']
})
export class DigitalBankingContext {}
```

`★ Insight ─────────────────────────────────────`
- **Contexts are stakeholder-free**—they define organizational boundaries, not people (stakeholders reference contexts via `context` field)
- **ubiquitousLanguage** establishes DDD bounded context—"Digital User" means something specific in this context (logged in last 30 days)
- **relationships** are typed with enum—`ContextRelationship.Downstream` means Digital Banking receives data from Risk Management
- Notice **handoffProtocol**—this is where integration pain lives ("Real-time API <1 second" is a constraint that affects architecture)
`─────────────────────────────────────────────────`

---

## 4. @BusinessInitiative Decorator

**Purpose**: Concrete initiatives that execute strategy through journeys and metrics.

### Schema Overview

```typescript
@BusinessInitiative({
  name: string,  // Required

  // Hierarchical Links
  strategy?: WithStrategy<Constructor>,
  journeys?: WithJourney<Constructor>[],
  metrics?: WithMetric<Constructor>[],
  dependencies?: WithBusinessInitiative<Constructor>[],

  // Objectives & Outcomes
  objectives?: string[],
  outcomes?: string[],
  successCriteria?: string[],

  // Timeline
  timeline?: {
    startDate?: string,
    endDate?: string,
    milestones?: Array<{
      name: string,
      targetDate: string,
      description?: string,
      successCriteria?: string[]
    }>
  },

  // Team & Budget
  owner?: string,
  team?: string[],
  budget?: {
    amount: number,
    currency: string,
    breakdown?: Record<string, number>
  },

  // Risk Management
  risks?: Array<{
    risk: string,
    mitigation: string,
    impact?: 'high' | 'medium' | 'low',
    likelihood?: 'high' | 'medium' | 'low'
  }>,

  // Metadata
  description?: string,
  tags?: string[]
})
export class YourInitiative {}
```

### Example: Mobile Banking Excellence Initiative

```typescript
import { BusinessInitiative } from 'aabha';

// Import strategy
import { DigitalTransformationStrategy } from '../strategies/digital-transformation.strategy.js';

// Import journeys (will be defined in 03-journey-decorators.md)
import { AccountOpeningJourney } from '../journeys/account-opening.journey.js';
import { FundsTransferJourney } from '../journeys/funds-transfer.journey.js';

// Import metrics
import { MobileAppRatingMetric } from '../metrics/mobile-app-rating.metric.js';
import { DigitalAdoptionMetric } from '../metrics/digital-adoption.metric.js';
import { CustomerEffortScoreMetric } from '../metrics/customer-effort-score.metric.js';

@BusinessInitiative({
  name: 'Mobile Banking Excellence',

  description:
    'Build the best mobile banking app in Genai to compete with neobanks and ' +
    'win Gen-Z/Millennial customers. Focus on instant, effortless experiences.',

  // ============================================================
  // Hierarchical Links
  // ============================================================

  strategy: DigitalTransformationStrategy,

  journeys: [
    AccountOpeningJourney,
    FundsTransferJourney
    // ... other journeys
  ],

  metrics: [
    MobileAppRatingMetric,      // 4.8 → 4.9 stars
    DigitalAdoptionMetric,      // 37.5% → 62.5%
    CustomerEffortScoreMetric   // 3.2 → 1.8
  ],

  // ============================================================
  // Objectives & Success Criteria
  // ============================================================

  objectives: [
    'Achieve 4.9+ star rating on iOS App Store and Google Play by Q4 2026',
    'Grow active mobile users from 500K to 2M by end of 2027',
    'Reduce customer effort score for mobile journeys from 3.2 to 1.8',
    'Launch 2 major features per quarter (biometric auth, AI insights, etc.)'
  ],

  outcomes: [
    'OgPgyBank mobile app ranked #1 in Genai for banking apps',
    'Gen-Z and Millennials choose OgPgyBank over NeoBrightBank',
    'Mobile channel becomes primary customer touchpoint (>60% transactions)',
    'Mobile app drives new customer acquisition (60% of new accounts via mobile)'
  ],

  successCriteria: [
    'App rating ≥ 4.9 stars on both iOS and Android',
    'Mobile NPS ≥ 70 (higher than overall bank NPS of 65)',
    'Feature adoption rate >40% within 30 days of launch',
    'Zero critical incidents affecting >10% of users'
  ],

  // ============================================================
  // Timeline & Milestones
  // ============================================================

  timeline: {
    startDate: '2024-Q2',
    endDate: '2026-Q4',

    milestones: [
      {
        name: 'Mobile App 2.0 Launch',
        targetDate: '2024-06-30',
        description: 'Complete redesign with modern UI/UX, biometric auth, improved performance',
        successCriteria: [
          'App rating ≥ 4.5 stars within first month',
          '100K downloads in first quarter',
          'Zero critical bugs in production'
        ]
      },
      {
        name: 'AI Financial Assistant Launch',
        targetDate: '2025-03-15',
        description: 'AI-powered spending insights, savings recommendations, financial coaching',
        successCriteria: [
          '>50% of users engage with AI assistant in first 60 days',
          'Savings goal creation increases by 40%',
          'App rating maintains or improves'
        ]
      },
      {
        name: 'Feature Parity with Neobanks',
        targetDate: '2025-09-30',
        description: 'Match or exceed all core features of NeoBrightBank',
        successCriteria: [
          'Feature comparison shows OgPgyBank ≥ NeoBrightBank',
          'Customer surveys show "digital-first" perception',
          'Zero capability gaps identified by users'
        ]
      },
      {
        name: '4.9 Star Rating Achieved',
        targetDate: '2026-Q4',
        description: 'Sustained 4.9+ star rating for 3 consecutive months',
        successCriteria: [
          'iOS App Store rating: 4.9+ for 90 days',
          'Google Play rating: 4.9+ for 90 days',
          'Review sentiment >85% positive'
        ]
      }
    ]
  },

  // ============================================================
  // Team & Budget
  // ============================================================

  owner: 'Lisa Wong, Chief Digital Officer',

  team: [
    'Raj Patel, CTO (technology leadership)',
    'Product Management Team (5 product managers)',
    'Engineering Team (45 mobile developers, iOS & Android)',
    'UX/UI Design Team (8 designers)',
    'QA Team (12 testers)',
    'Analytics Team (4 data analysts)'
  ],

  budget: {
    amount: 85_000_000,
    currency: 'GD$',
    breakdown: {
      'Engineering Salaries': 45_000_000,
      'Design & UX': 8_000_000,
      'Cloud Infrastructure': 12_000_000,
      'Third-party Tools & Services': 10_000_000,
      'Marketing & User Acquisition': 7_000_000,
      'Contingency': 3_000_000
    }
  },

  // ============================================================
  // Dependencies & Risks
  // ============================================================

  dependencies: [
    // InstantAccountOpeningInitiative (another BusinessInitiative)
    // CoreBankingModernizationInitiative
  ],

  risks: [
    {
      risk: 'App quality issues cause rating drop and user churn',
      impact: 'high',
      likelihood: 'medium',
      mitigation:
        'Rigorous testing (automated + manual), gradual rollout, A/B testing, ' +
        'rapid hotfix capability, continuous monitoring, user feedback loops'
    },
    {
      risk: 'Neobank competitors release superior features first',
      impact: 'medium',
      likelihood: 'medium',
      mitigation:
        'Competitive monitoring, agile sprint planning, MVP approach for fast iteration, ' +
        'focus on differentiation (trust + heritage), not just feature parity'
    },
    {
      risk: 'Talent shortage—unable to hire sufficient mobile developers',
      impact: 'medium',
      likelihood: 'high',
      mitigation:
        'Competitive comp, flexible remote work, upskill existing engineers, ' +
        'offshore development partnerships, contracting during peak periods'
    }
  ],

  tags: [
    'digital-transformation',
    'customer-experience',
    'competitive-advantage',
    'mobile-first'
  ]
})
export class MobileBankingExcellenceInitiative {}
```

`★ Insight ─────────────────────────────────────`
- **BusinessInitiative bridges strategy and execution**—it references Strategy (why) and Journeys (how), creating the "what we're doing"
- **milestones have successCriteria**—not just dates, but measurable proof points ("App rating ≥ 4.5 within first month")
- **budget breakdown** makes costs transparent—GD$85M total, but GD$45M is engineering salaries (shows this is talent-heavy)
- Notice the **one-way hierarchy**: Initiative → Journeys (journeys don't know which initiatives use them, enabling reuse)
`─────────────────────────────────────────────────`

---

## Composition Patterns

### Pattern 1: Strategy → Initiative → Journey → Metric (Full Hierarchy)

```typescript
// 1. Define metrics first (leaf nodes)
@Metric({
  name: 'Customer Churn Rate',
  category: MetricCategory.Business,
  target: 5,
  unit: 'percentage'
})
export class ChurnRateMetric {}

// 2. Define strategy (references metrics)
@Strategy({
  name: 'Customer Retention Strategy',
  winningAspiration: 'Lowest churn in industry',
  metrics: [ChurnRateMetric]
})
export class RetentionStrategy {}

// 3. Define initiative (references strategy, journeys, metrics)
@BusinessInitiative({
  name: 'Onboarding Experience Improvement',
  strategy: RetentionStrategy,
  journeys: [OnboardingJourney],  // Will be defined later
  metrics: [ChurnRateMetric]
})
export class OnboardingInitiative {}
```

### Pattern 2: Context with Capabilities and Relationships

```typescript
// Define contexts that work together
@Context({
  name: 'Retail Banking',
  capabilities: {
    core: ['Account management', 'Transaction processing']
  }
})
export class RetailBankingContext {}

@Context({
  name: 'Risk Management',
  capabilities: {
    core: ['Fraud detection', 'AML screening']
  }
})
export class RiskManagementContext {}

// Define context that depends on others
@Context({
  name: 'Digital Banking',
  relationships: [
    {
      context: RetailBankingContext,
      type: ContextRelationship.Partnership,
      description: 'Omnichannel collaboration',
      communicationPattern: 'event-driven'
    },
    {
      context: RiskManagementContext,
      type: ContextRelationship.Downstream,
      description: 'Receives fraud alerts',
      communicationPattern: 'sync',
      frequency: 'real-time'
    }
  ]
})
export class DigitalBankingContext {}
```

### Pattern 3: Metrics with Relationships (Indicator Chains)

```typescript
// Leading indicator
@Metric({
  name: 'Support Response Time',
  category: MetricCategory.Operational
})
export class ResponseTimeMetric {}

// Lagging indicator (predicted by leading indicator)
@Metric({
  name: 'Customer Satisfaction',
  category: MetricCategory.Customer,
  relationships: {
    lagsFrom: [ResponseTimeMetric]  // Support speed predicts satisfaction
  }
})
export class SatisfactionMetric {}

// Ultimate outcome (predicted by satisfaction)
@Metric({
  name: 'Customer Retention Rate',
  category: MetricCategory.Business,
  relationships: {
    lagsFrom: [SatisfactionMetric]  // Satisfaction predicts retention
  }
})
export class RetentionMetric {}
```

---

## Summary

### Strategic Decorator Checklist

- **@Strategy**: Playing to Win framework, defines the game plan
  - ✅ Always include `winningAspiration`, `whereToPlay`, `howToWin`
  - ✅ Be explicit about `strategicChoices.deliberateExclusions` (what you WON'T do)
  - ✅ Reference metrics via direct class references

- **@Metric**: Measurable outcomes at any level
  - ✅ Use `goal` field (not extensions) for strategic context
  - ✅ Define `direction` (higher-is-better vs lower-is-better)
  - ✅ Use `relationships` to build indicator chains
  - ✅ Include `dimensions` for slicing data

- **@Context**: Organizational boundaries (DDD)
  - ✅ Contexts are stakeholder-free (no persona/stakeholder references)
  - ✅ Define `domainModel.ubiquitousLanguage` for bounded context clarity
  - ✅ Explicitly list `inScope` and `outOfScope`
  - ✅ Use `relationships` to show context-to-context collaboration

- **@BusinessInitiative**: Execution bridge (strategy → journeys)
  - ✅ Link to parent `strategy`
  - ✅ Reference `journeys` that implement the initiative
  - ✅ Include `timeline.milestones` with `successCriteria`
  - ✅ List `dependencies` on other initiatives

---

**Next Steps:**
- [03-journey-decorators.md](./03-journey-decorators.md) - Model user/stakeholder journeys with @Journey and @Action
- [04-stakeholder-decorators.md](./04-stakeholder-decorators.md) - Define WHO with @Persona and @Stakeholder
- [07-composition-patterns.md](./07-composition-patterns.md) - See full examples combining all decorators
