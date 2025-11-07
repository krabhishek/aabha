/**
 * @Persona Decorator
 * Marks a class as a Persona (user archetype)
 * @module aabha/decorators/persona
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 *
 * Personas represent WHO people are - their demographics, psychology, behaviors, and needs.
 * This is distinct from Stakeholders (WHAT people do in specific contexts).
 * Same persona can play different stakeholder roles across multiple contexts.
 */

import { applyBrand } from '../../internal/brand.utils.js';
import type { Constructor, WithPersona } from '../../types/branded-types.js';
import type { BaseDecoratorOptions } from '../../types/decorator-options.types.js';

/**
 * Persona type classification
 *
 * Distinguishes between different categories of personas to enable type-specific
 * attributes and validation.
 */
export enum PersonaType {
  /** Individual human being */
  Human = 'human',
  /** Group or team of people */
  Team = 'team',
  /** Company, department, or organization */
  Organization = 'organization',
  /** Software system, service, or technical component */
  System = 'system',
}

/**
 * Structured demographics
 *
 * Captures demographic information in a structured, analyzable format rather than
 * using unstructured key-value pairs. This enables richer analysis and validation.
 */
export interface PersonaDemographics {
  /**
   * Income level or range
   *
   * @example "GD$45,000 - GD$65,000/year"
   * @example "Upper middle class"
   * @example "High-net-worth (>$1M liquid assets)"
   */
  incomeLevel?: string;

  /**
   * Specific income range (alternative to incomeLevel)
   *
   * @example "GD$50,000/year"
   */
  incomeRange?: string;

  /**
   * Education level
   *
   * @example "Bachelor's Degree in Computer Science"
   * @example "High school diploma"
   * @example "MBA from top-tier university"
   */
  educationLevel?: string;

  /**
   * Geographic location
   *
   * @example "Urban - San Francisco, CA"
   * @example "Suburban - Greater Toronto Area"
   * @example "Remote - anywhere with internet"
   */
  location?: string;

  /**
   * Family or household status
   *
   * @example "Single, no dependents"
   * @example "Married with 2 children"
   * @example "Divorced, co-parenting"
   */
  familyStatus?: string;

  /**
   * Cultural background or identity
   *
   * @example "First-generation immigrant"
   * @example "Multicultural background"
   */
  culturalBackground?: string;

  /**
   * Language preferences (in priority order)
   *
   * @example ['English', 'Spanish']
   * @example ['Mandarin', 'English', 'Cantonese']
   */
  languagePreferences?: string[];

  /**
   * Household size (number of people)
   *
   * @example 1 - Living alone
   * @example 4 - Family of four
   */
  householdSize?: number;

  /**
   * Employment status
   *
   * @example "Full-time employed"
   * @example "Freelancer/Contractor"
   * @example "Retired"
   * @example "Student"
   */
  employmentStatus?: string;
}

/**
 * Psychology and values
 *
 * Captures the internal drivers, values, fears, and decision-making patterns
 * that shape behavior. Understanding psychology is critical for creating
 * empathetic, user-centered designs.
 */
export interface PersonaPsychology {
  /**
   * Core values and beliefs
   *
   * What this persona believes in and values most.
   *
   * @example ['Financial independence', 'Family security', 'Work-life balance']
   * @example ['Innovation', 'Efficiency', 'Transparency']
   * @example ['Environmental sustainability', 'Social responsibility']
   */
  values?: string[];

  /**
   * Fears and anxieties
   *
   * What keeps this persona up at night. Understanding fears helps identify
   * risk mitigation and reassurance needs.
   *
   * @example ['Losing savings due to poor investments', 'Identity theft', 'Job loss']
   * @example ['Missing out on opportunities', 'Making wrong financial decisions']
   */
  fears?: string[];

  /**
   * Aspirations and dreams
   *
   * What this persona hopes to achieve in the future. Goes beyond immediate goals
   * to capture longer-term vision.
   *
   * @example ['Own a home by age 35', 'Retire early at 50', 'Start own business']
   * @example ['Financial freedom to travel', 'Leave legacy for children']
   */
  aspirations?: string[];

  /**
   * Decision-making style
   *
   * How this persona approaches decisions - analytical, emotional, social, etc.
   *
   * @example "Analytical - researches extensively before deciding"
   * @example "Impulsive - makes quick decisions based on gut feel"
   * @example "Social - seeks advice from friends and family before deciding"
   * @example "Risk-averse - prefers safe, proven options"
   */
  decisionMakingStyle?: string;

  /**
   * Risk tolerance level
   *
   * How comfortable this persona is with uncertainty and risk.
   *
   * @example 'low' - Risk-averse, prefers safety
   * @example 'medium' - Balanced approach to risk
   * @example 'high' - Comfortable with risk, seeks growth opportunities
   */
  riskTolerance?: 'low' | 'medium' | 'high';

  /**
   * Trust factors
   *
   * What makes this persona trust a product, service, or organization.
   *
   * @example ['Established brand reputation', 'Personal recommendations', 'Transparent pricing']
   * @example ['Security certifications', 'Insurance coverage', 'Customer reviews']
   * @example ['Open-source code', 'Privacy policies', 'Industry regulations']
   */
  trustFactors?: string[];
}

/**
 * Behavioral patterns
 *
 * Observable behaviors, habits, and interaction patterns. Behavior reveals
 * how personas actually act, complementing what they say about themselves.
 */
export interface PersonaBehavior {
  /**
   * Typical behaviors and habits
   *
   * Day-to-day patterns that characterize this persona.
   *
   * @example ['Checks bank balance daily', 'Budgets monthly', 'Uses cash for small purchases']
   * @example ['Mobile-first for everything', 'Never visits physical branches']
   * @example ['Researches extensively before purchases', 'Comparison shops online']
   */
  typicalBehaviors?: string[];

  /**
   * Communication style
   *
   * How this persona communicates and prefers to be communicated with.
   *
   * @example "Direct and concise - dislikes unnecessary details"
   * @example "Warm and conversational - appreciates personal touch"
   * @example "Formal and professional - expects business etiquette"
   */
  communicationStyle?: string;

  /**
   * Information-seeking patterns
   *
   * How this persona finds and consumes information.
   *
   * @example ['Google search first', 'YouTube tutorials', 'Asks friends/family']
   * @example ['Reads reviews on Reddit', 'Follows influencers', 'Trial and error']
   * @example ['Official documentation', 'Industry reports', 'Professional networks']
   */
  informationSeeking?: string[];

  /**
   * Technology adoption pattern
   *
   * How quickly this persona adopts new technology.
   *
   * @example 'early-adopter' - First to try new tech
   * @example 'mainstream' - Adopts once proven
   * @example 'laggard' - Resists change, adopts when forced
   */
  technologyAdoption?: 'early-adopter' | 'mainstream' | 'laggard' | string;

  /**
   * Usage patterns
   *
   * How this persona uses products or services.
   *
   * @example ['Daily active user', 'Logs in multiple times per day', 'Power user of advanced features']
   * @example ['Weekly batch processing', 'Set-it-and-forget-it approach']
   * @example ['Seasonal usage - tax time only']
   */
  usagePatterns?: string[];
}

/**
 * Needs framework
 *
 * Multi-dimensional needs model capturing functional, emotional, social, and
 * informational needs. Goes beyond surface-level goals to understand deeper
 * human needs.
 */
export interface PersonaNeeds {
  /**
   * Functional needs
   *
   * Practical, task-oriented needs. What this persona needs to accomplish.
   *
   * @example ['Track expenses automatically', 'Transfer money instantly', 'Access account 24/7']
   * @example ['Generate tax reports', 'Set up recurring payments', 'Freeze card instantly if lost']
   */
  functional?: string[];

  /**
   * Emotional needs
   *
   * Feelings and emotional states this persona seeks. Often unstated but powerful.
   *
   * @example ['Feel in control of finances', 'Feel secure about future', 'Feel empowered']
   * @example ['Reduce financial anxiety', 'Feel smart/informed', 'Avoid embarrassment']
   */
  emotional?: string[];

  /**
   * Social needs
   *
   * Needs related to social connections, status, and belonging.
   *
   * @example ['Be seen as financially responsible', 'Provide for family', 'Keep up with peers']
   * @example ['Gain social status', 'Belong to exclusive group', 'Get recognition']
   */
  social?: string[];

  /**
   * Informational needs
   *
   * Information and knowledge this persona needs.
   *
   * @example ['Understand investment options', 'Know what fees apply', 'Track financial health']
   * @example ['Learn best practices', 'Receive timely alerts', 'Access historical data']
   */
  informational?: string[];
}

/**
 * Contextual information
 *
 * The broader context in which this persona operates - their life stage,
 * current situation, and environmental factors affecting their behavior.
 */
export interface PersonaContext {
  /**
   * Life stage or phase
   *
   * Where this persona is in their life journey.
   *
   * @example "Early career - building foundation"
   * @example "Mid-career - peak earning years"
   * @example "Pre-retirement - wealth preservation"
   * @example "Young family - high expenses, long time horizon"
   */
  lifeStage?: string;

  /**
   * Current situation or circumstances
   *
   * Immediate context affecting this persona's needs and behaviors.
   *
   * @example "Just started first job, new to managing money"
   * @example "Recently divorced, reorganizing finances"
   * @example "Preparing to buy first home"
   */
  currentSituation?: string;

  /**
   * Current challenges
   *
   * Specific challenges this persona is facing right now.
   *
   * @example ['Managing student loan debt', 'Saving for house down payment', 'Supporting aging parents']
   * @example ['Irregular income from gig work', 'Rebuilding credit score']
   */
  challenges?: string[];

  /**
   * Environmental factors
   *
   * External factors influencing this persona's context.
   *
   * @example ['High cost of living in urban area', 'Competitive job market', 'Rising interest rates']
   * @example ['Economic uncertainty', 'Industry disruption', 'Regulatory changes']
   */
  environmentalFactors?: string[];
}

/**
 * Structured persona quote
 *
 * Representative quote that captures persona's voice and perspective,
 * with optional context explaining when/why they said it.
 */
export interface PersonaQuote {
  /**
   * The quote itself
   *
   * @example "If my banking app is slower than my code compiler, I'm switching banks"
   * @example "I don't have time to visit branches - I need banking that fits my life"
   */
  quote: string;

  /**
   * Context for this quote
   *
   * When, why, or under what circumstances this was said.
   *
   * @example "Said after frustrating mobile app experience"
   * @example "Expressed during user research session about digital banking preferences"
   */
  context?: string;
}

/**
 * Persona story
 *
 * Success or failure story that illustrates this persona's experiences.
 * Stories make personas memorable and help teams empathize.
 */
export interface PersonaStory {
  /**
   * Story title
   *
   * @example "The Late Fee That Changed Everything"
   * @example "First Investment Success"
   */
  title: string;

  /**
   * Story description
   *
   * The narrative explaining what happened.
   *
   * @example "Marcus missed a credit card payment by one day because the app didn't send a notification..."
   */
  description: string;

  /**
   * Story outcome
   *
   * How the story ended and what was learned.
   *
   * @example "Now obsessively checks multiple times per day and uses auto-pay for everything"
   */
  outcome?: string;
}

/**
 * Persona metrics
 *
 * Measurable indicators of persona satisfaction, engagement, and success.
 * Makes personas actionable by defining what success looks like.
 */
export interface PersonaMetrics {
  /**
   * Success indicators
   *
   * How to measure if this persona is successful/satisfied.
   *
   * @example ['Achieves savings goals', 'Maintains good credit score', 'Feels confident about finances']
   * @example ['Completes tasks without support', 'Returns to app regularly', 'Recommends to friends']
   */
  successIndicators?: string[];

  /**
   * Engagement patterns
   *
   * How this persona engages with products/services.
   *
   * @example ['Daily active user', 'Uses 5+ features regularly', 'Long session times']
   * @example ['Weekly batch user', 'Single-purpose usage', 'Quick in-and-out']
   */
  engagementPatterns?: string[];

  /**
   * Satisfaction signals
   *
   * Observable signals that this persona is happy/satisfied.
   *
   * @example ['Renews subscription', 'Upgrades to premium', 'Leaves positive reviews']
   * @example ['Refers friends', 'Provides feedback', 'Engages with support']
   */
  satisfactionSignals?: string[];

  /**
   * Churn risks
   *
   * Warning signs that this persona might leave.
   *
   * @example ['Decreasing login frequency', 'Support tickets not resolved', 'Competitor research']
   * @example ['Failed transactions', 'Negative social media mentions']
   */
  churnRisks?: string[];
}

/**
 * Security profile
 *
 * Security and compliance characteristics for personas. Particularly relevant for
 * System personas but can apply to Teams (security practices), Organizations
 * (certifications), or Humans (clearance levels).
 */
export interface SecurityProfile {
  /**
   * Data classification level
   *
   * Sensitivity level of data handled by this persona.
   *
   * @example "Highly Confidential (customer PII, account data)"
   * @example "Confidential (internal business data)"
   * @example "Public"
   */
  dataClassification?: string;

  /**
   * Encryption methods
   *
   * How data is encrypted at rest and in transit.
   *
   * @example "AES-256 at rest, TLS 1.3 in transit"
   * @example "End-to-end encryption using RSA-2048"
   */
  encryption?: string;

  /**
   * Access control mechanisms
   *
   * How access is controlled and authenticated.
   *
   * @example "Role-based access control (RBAC), service mesh mTLS"
   * @example "OAuth 2.0 + JWT, multi-factor authentication required"
   * @example "Security clearance: Level 3 required"
   */
  accessControl?: string;

  /**
   * Audit logging approach
   *
   * What is logged for security and compliance auditing.
   *
   * @example "Every transaction logged with user, timestamp, IP, before/after state"
   * @example "All API calls logged with request/response bodies (PII redacted)"
   */
  auditLogging?: string;

  /**
   * Compliance requirements
   *
   * Regulatory and compliance standards that must be met.
   *
   * @example ["PCI-DSS Level 1", "GDPR", "SOC 2 Type II"]
   * @example ["HIPAA", "ISO 27001"]
   */
  complianceRequirements?: string[];

  /**
   * Backup and recovery strategy
   *
   * How data is backed up and can be recovered.
   *
   * @example "Hourly incremental backups, daily full backups, 90-day retention, offsite replicas"
   * @example "Real-time replication to 3 regions, point-in-time recovery"
   */
  backupStrategy?: string;

  /**
   * Incident response process
   *
   * How security incidents are detected and handled.
   *
   * @example "24/7 SOC monitoring, automated alerting, incident response team on-call"
   * @example "SIEM integration, quarterly penetration testing"
   */
  incidentResponse?: string;
}

/**
 * System persona attributes
 *
 * Specialized attributes for System-type personas (software systems, APIs, services).
 * These capture technical characteristics that don't apply to human personas.
 */
export interface SystemPersonaAttributes {
  /**
   * Vendor or provider
   *
   * @example "SendGrid"
   * @example "AWS"
   * @example "Stripe"
   */
  vendor?: string;

  /**
   * Capabilities and features
   *
   * What this system can do.
   *
   * @example ['Email validation', 'Deliverability scoring', 'Spam detection']
   * @example ['Payment processing', 'Fraud detection', 'Subscription management']
   */
  capabilities?: string[];

  /**
   * Service Level Agreement (SLA)
   *
   * Performance guarantees for this system.
   */
  sla?: {
    /**
     * Uptime guarantee
     * @example "99.9%"
     */
    availability?: string;

    /**
     * Response time guarantee
     * @example "< 200ms p95"
     */
    latency?: string;

    /**
     * Throughput capacity
     * @example "10,000 requests/second"
     */
    throughput?: string;
  };

  /**
   * Authentication method
   *
   * @example "API key (Bearer token)"
   * @example "OAuth 2.0"
   * @example "mTLS certificate"
   */
  authentication?: string;

  /**
   * Rate limit
   *
   * @example "100,000 requests/month"
   * @example "1,000 requests/hour"
   */
  rateLimit?: string;

  /**
   * Pricing model
   *
   * @example "GD$0.002 per validation"
   * @example "GD$99/month + GD$0.01 per transaction"
   * @example "Free tier: 10K/month, then pay-as-you-go"
   */
  pricing?: string;

  /**
   * Integration approach
   *
   * @example "RESTful API with JSON payloads"
   * @example "GraphQL API"
   * @example "gRPC with Protocol Buffers"
   */
  integration?: string;

  /**
   * Documentation URL
   *
   * @example "https://docs.stripe.com/api"
   */
  documentation?: string;

  /**
   * Caching strategy
   *
   * @example "Results cached for 24 hours to reduce API calls"
   * @example "No caching - real-time only"
   */
  caching?: string;
}

/**
 * Organization persona attributes
 *
 * Specialized attributes for Organization-type personas (companies, departments,
 * regulatory bodies, partners).
 */
export interface OrganizationPersonaAttributes {
  /**
   * Legal entity name
   *
   * The official registered legal name of the organization, used in contracts,
   * regulatory filings, and legal documentation.
   *
   * @example "KPMG Genai LLP"
   * @example "Visa Inc. & Mastercard Incorporated"
   * @example "Genai Central Bank (Official)"
   */
  legalName?: string;

  /**
   * Type of organization
   *
   * @example "Regulatory body"
   * @example "Strategic partner"
   * @example "Competitor"
   * @example "Customer segment"
   * @example "Audit firm"
   */
  organizationType?: string;

  /**
   * Organization size
   *
   * @example "Enterprise (10,000+ employees)"
   * @example "Mid-market (100-1,000 employees)"
   * @example "Small business (10-100 employees)"
   * @example "2,500 employees in Genai, 245,000 globally"
   */
  size?: string;

  /**
   * Industry or sector
   *
   * @example "Financial services"
   * @example "Healthcare"
   * @example "Government - Federal"
   * @example "Professional Services - Audit & Assurance"
   * @example "Payment Processing Networks"
   */
  industry?: string;

  /**
   * Headquarters location
   *
   * Primary location or headquarters of the organization.
   *
   * @example "Capital City, Genai"
   * @example "San Francisco, CA"
   * @example "New York, NY"
   */
  headquarters?: string;

  /**
   * Relationship type with your organization
   *
   * Nature of the business relationship.
   *
   * @example "External service provider"
   * @example "Regulatory authority"
   * @example "Strategic partner"
   * @example "Vendor"
   * @example "Payment network provider"
   */
  relationship?: string;

  /**
   * Contract type or engagement model
   *
   * Formal agreement structure governing the relationship.
   *
   * @example "Annual engagement letter, renewable yearly"
   * @example "Long-term service agreement (5 years)"
   * @example "Master service agreement"
   */
  contractType?: string;

  /**
   * Engagement team structure
   *
   * Team composition from the partner organization.
   *
   * @example "12 people: 1 Partner, 2 Managers, 3 Senior Auditors, 6 Staff"
   * @example "Dedicated account team of 8 specialists"
   */
  engagementTeam?: string;

  /**
   * Services offered or provided
   *
   * Key services this organization provides.
   *
   * @example ["Annual statutory audit", "SOC 2 Type II audit", "IPO readiness"]
   * @example ["Payment processing", "Fraud detection", "Chargeback management"]
   */
  serviceOffered?: string[];

  /**
   * Jurisdiction or geography
   *
   * Geographic scope or legal jurisdiction.
   *
   * @example "Global"
   * @example "North America only"
   * @example "EU (GDPR-compliant)"
   * @example "Genai (domestic)"
   */
  jurisdiction?: string;

  /**
   * Key contacts
   *
   * Important people within this organization.
   *
   * @example ['John Smith - CEO', 'Jane Doe - Compliance Officer']
   * @example ['Alice Johnson - Engagement Partner', 'Bob Williams - Senior Manager']
   */
  keyContacts?: string[];

  /**
   * Compliance requirements
   *
   * Regulatory or compliance needs for this organization.
   *
   * @example ['SOC 2 Type II certification', 'GDPR compliance', 'PCI DSS Level 1']
   * @example ['ISO 27001 certified', 'Annual external audit required']
   */
  complianceRequirements?: string[];

  /**
   * Partnership type
   *
   * Nature of relationship with this organization.
   *
   * @example "Technology partner - integration"
   * @example "Distribution partner - referrals"
   * @example "Strategic investor"
   */
  partnershipType?: string;
}

/**
 * Team persona attributes
 *
 * Specialized attributes for Team-type personas (cross-functional teams, departments,
 * project squads). Teams are groups of people working together toward common goals.
 */
export interface TeamPersonaAttributes {
  /**
   * Team size (number of members)
   *
   * @example 7
   * @example 25
   * @example 11
   */
  size?: number;

  /**
   * Team composition (roles and distribution)
   *
   * Breakdown of roles, specializations, and seniority levels within the team.
   *
   * @example "5 AML Analysts, 2 Compliance Officers"
   * @example "20 support agents, 3 team leads, 1 support manager, 1 quality analyst"
   * @example "4 iOS developers (Swift), 4 Android developers (Kotlin), 2 QA engineers, 1 PM"
   */
  composition?: string;

  /**
   * Team structure and reporting
   *
   * Organizational structure, hierarchy, and reporting lines.
   *
   * @example "Flat team reporting to Chief Compliance Officer"
   * @example "Three shifts covering 7 AM - 10 PM, reporting to Head of Customer Experience"
   * @example "Agile Scrum team reporting to VP of Digital Product"
   */
  structure?: string;

  /**
   * Working hours and availability
   *
   * Normal operating hours, shift patterns, and availability.
   *
   * @example "8 AM - 6 PM weekdays, on-call rotation for urgent alerts"
   * @example "7 AM - 10 PM daily (3 shifts), limited weekend coverage"
   * @example "9 AM - 6 PM with flexible work (remote-friendly)"
   */
  workingHours?: string;

  /**
   * Team location and distribution
   *
   * Physical location, remote work arrangements, and geographic distribution.
   *
   * @example "OgPgyBank HQ (4 in-office, 3 hybrid)"
   * @example "Contact center at OgPgyBank HQ + 5 remote agents"
   * @example "Distributed: 6 in HQ office, 5 fully remote"
   */
  location?: string;

  /**
   * Tools and systems used by the team
   *
   * Key software, platforms, and tools the team relies on for their work.
   *
   * @example ["Actimize", "Jumio", "Regis-TR", "Slack", "Confluence"]
   * @example ["Zendesk", "Intercom", "Five9", "Salesforce", "Jira"]
   * @example ["Xcode", "Android Studio", "GitHub", "Jira", "Slack", "TestFlight", "Firebase"]
   */
  toolsUsed?: string[];

  /**
   * Team culture or values
   *
   * Cultural characteristics, working style, and team values.
   *
   * @example "Detail-oriented with zero tolerance for errors, compliance-first mindset"
   * @example "Customer-empathetic and solution-oriented"
   * @example "Agile, innovative, and data-driven; strong focus on UX"
   */
  culture?: string;
}

/**
 * Human persona attributes
 *
 * Specialized attributes for Human-type personas (individual people).
 * Currently empty but defined for symmetry and future extensibility.
 *
 * In the future, this may include attributes like:
 * - Personality type (e.g., MBTI, Big Five)
 * - Work style preferences
 * - Availability patterns
 * - Communication preferences
 */
export interface HumanPersonaAttributes {
  // Reserved for future human-specific attributes
  // Example future fields:
  // personalityType?: string;  // e.g., "MBTI: INTJ", "Big Five: High Openness"
  // workStyle?: string;  // e.g., "Prefers async communication", "Visual learner"
  // availability?: string;  // e.g., "9-5 weekdays, responsive after hours for emergencies"
}

/**
 * Base persona options (internal)
 *
 * Shared fields across all persona types. This interface is extended by type-specific
 * persona option interfaces to create a discriminated union.
 *
 * Do not use this interface directly. Use the PersonaOptions type instead,
 * which provides compile-time type safety based on the persona type.
 *
 * @internal
 */
interface BasePersonaOptions extends BaseDecoratorOptions {
  // ============================================================================
  // Persona Identity
  // ============================================================================

  /**
   * Type of persona (required)
   *
   * Fundamental classification determining which type-specific attributes apply.
   * Different persona types have different characteristics and needs.
   *
   * @example PersonaType.Human - Individual person
   * @example PersonaType.Team - Group of people
   * @example PersonaType.Organization - Company or regulatory body
   * @example PersonaType.System - Software system or API
   */
  type: PersonaType;

  /**
   * Persona name (required)
   *
   * Clear, memorable name for this persona archetype.
   *
   * @example "Tech-Savvy Millennial"
   * @example "Budget-Conscious Parent"
   * @example "Marcus Lee - Young Professional"
   * @example "Email Validation Service"
   */
  name: string;

  /**
   * Human-readable description
   *
   * Overview of who this persona is and what defines them.
   *
   * @example "Digital-native young professional comfortable with technology, seeking simple and fast banking that fits their mobile-first lifestyle"
   */
  description?: string;

  /**
   * Tags for categorization and discovery
   *
   * @example ['millennial', 'tech-savvy', 'mobile-first']
   * @example ['external-service', 'saas', 'critical-dependency']
   */
  tags?: string[];

  /**
   * Archetype or category
   *
   * Higher-level classification or archetype this persona belongs to.
   *
   * @example "The Optimizer - Always seeking efficiency and optimization"
   * @example "The Cautious Saver - Risk-averse, security-focused"
   * @example "The Early Adopter - First to try new features"
   */
  archetype?: string;

  // ============================================================================
  // Demographics
  // ============================================================================

  /**
   * Age or age range
   *
   * @example "26"
   * @example "25-35"
   * @example "Millennial (born 1981-1996)"
   */
  age?: string;

  /**
   * Occupation or job title
   *
   * @example "Junior Software Developer"
   * @example "Small Business Owner"
   * @example "Retired Teacher"
   */
  occupation?: string;

  /**
   * Structured demographics
   *
   * Rich demographic information in a structured, analyzable format.
   * Replaces the old unstructured Record<string, unknown> approach.
   *
   * @see PersonaDemographics
   */
  demographics?: PersonaDemographics;

  // ============================================================================
  // Psychology & Values
  // ============================================================================

  /**
   * Motivations driving this persona
   *
   * Core internal drivers that motivate behavior and decisions.
   *
   * @example ['Financial independence', 'Career growth', 'Family security']
   * @example ['Social status', 'Personal achievement', 'Helping others']
   */
  motivations?: string[];

  /**
   * Psychology and values
   *
   * Deep psychological profile including values, fears, aspirations,
   * decision-making style, risk tolerance, and trust factors.
   *
   * @see PersonaPsychology
   */
  psychology?: PersonaPsychology;

  // ============================================================================
  // Behavior Patterns
  // ============================================================================

  /**
   * Behavioral characteristics (legacy)
   *
   * High-level behavioral traits. For richer behavior modeling, use the
   * structured `behavior` field instead.
   *
   * @example ['Impulsive spender', 'Detail-oriented', 'Socially influenced']
   * @deprecated Consider using structured `behavior` field instead
   */
  characteristics?: string[];

  /**
   * Structured behavior patterns
   *
   * Observable behaviors, communication style, information seeking,
   * technology adoption, and usage patterns.
   *
   * @see PersonaBehavior
   */
  behavior?: PersonaBehavior;

  /**
   * Usage patterns (convenience field)
   *
   * Shorthand for behavior.usagePatterns. Common usage patterns and workflows
   * for this persona. Can be used at the top level for convenience, or nested
   * within the behavior field.
   *
   * @example ['Daily standup at 9:30 AM → Review backlog → Sprint planning bi-weekly']
   * @example ['Morning: Check overnight alerts → Investigate suspicious transactions → File SARs if needed']
   * @example ['Real-time transaction processing', 'Batch settlement at end of day']
   */
  usagePatterns?: string[];

  /**
   * Dependencies
   *
   * Other personas, systems, or entities this persona depends on for their work.
   *
   * @example ['Mobile Banking App backend APIs', 'Design team for UI/UX', 'DevOps team for infrastructure']
   * @example ['Core Banking System', 'Payment Gateway', 'Customer database']
   * @example ['External audit reports', 'Regulatory guidelines', 'Management approval']
   */
  dependencies?: string[];

  /**
   * Integrations
   *
   * Integration points with other teams, systems, or personas.
   *
   * @example ['Backend Engineering Team (API contracts)', 'Design Team (Figma handoffs)', 'Customer Support (bug reports)']
   * @example ['Core Banking System (real-time sync)', 'Email Service (transaction notifications)', 'SMS Gateway (OTP delivery)']
   * @example ['Compliance Team (regulatory checks)', 'Risk Management (fraud alerts)', 'Legal Team (policy updates)']
   */
  integrations?: string[];

  // ============================================================================
  // Needs & Goals
  // ============================================================================

  /**
   * Goals this persona wants to achieve
   *
   * Explicit, stated goals. For deeper needs analysis, see the `needs` field.
   *
   * @example ['Save for house down payment', 'Build emergency fund', 'Start investing']
   * @example ['Manage finances efficiently', 'Track investments in real-time']
   */
  goals?: string[];

  /**
   * Multi-dimensional needs
   *
   * Structured needs framework capturing functional, emotional, social,
   * and informational needs. Goes beyond surface-level goals.
   *
   * @see PersonaNeeds
   */
  needs?: PersonaNeeds;

  // ============================================================================
  // Pain Points & Frustrations
  // ============================================================================

  /**
   * Pain points and frustrations
   *
   * Problems, frustrations, and obstacles this persona experiences.
   *
   * @example ['Traditional banks feel old and slow', 'Complex processes and paperwork']
   * @example ['Poor mobile app experiences', 'Lack of financial guidance']
   * @example ['High fees', 'Lack of transparency', 'Poor customer service']
   */
  painPoints?: string[];

  // ============================================================================
  // Technical & Channel Preferences
  // ============================================================================

  /**
   * Technical proficiency level
   *
   * How comfortable this persona is with technology.
   *
   * @example 'high' - Very comfortable, early adopter
   * @example 'medium' - Comfortable with mainstream tech
   * @example 'low' - Prefers simple, non-technical solutions
   */
  technicalProficiency?: 'low' | 'medium' | 'high';

  /**
   * Preferred channels (in priority order)
   *
   * How this persona prefers to interact.
   *
   * @example ['mobile app', 'web banking', 'phone support']
   * @example ['in-person branch', 'phone', 'mail']
   * @example ['REST API', 'webhooks', 'batch files']
   */
  preferredChannels?: string[];

  // ============================================================================
  // Context & Life Stage
  // ============================================================================

  /**
   * Contextual information
   *
   * Life stage, current situation, challenges, and environmental factors
   * affecting this persona.
   *
   * @see PersonaContext
   */
  context?: PersonaContext;

  // ============================================================================
  // Stories & Evidence
  // ============================================================================

  /**
   * Representative quotes
   *
   * Quotes that capture this persona's voice, perspective, and pain points.
   * Structured with optional context.
   *
   * @example [{ quote: "If my banking app is slower than my code compiler, I'm switching banks", context: "After frustrating mobile experience" }]
   */
  quotes?: PersonaQuote[];

  /**
   * Day in the life scenario
   *
   * Narrative describing a typical day for this persona, showing how they
   * interact with products/services in context.
   *
   * @example "Marcus wakes up at 7 AM, checks his account balance on his phone while having coffee..."
   */
  dayInTheLife?: string;

  /**
   * Success stories
   *
   * Stories illustrating successful experiences with products/services.
   *
   * @example [{ title: "First Investment Success", description: "Marcus used the app to make his first investment...", outcome: "Gained confidence and increased investment" }]
   */
  successStories?: PersonaStory[];

  /**
   * Failure stories
   *
   * Stories illustrating frustrating or failed experiences. These highlight
   * pain points and opportunities for improvement.
   *
   * @example [{ title: "The Late Fee That Changed Everything", description: "Marcus missed a payment by one day...", outcome: "Now uses auto-pay for everything" }]
   */
  failureStories?: PersonaStory[];

  /**
   * Metrics and success indicators
   *
   * How to measure if this persona is satisfied and engaged.
   *
   * @see PersonaMetrics
   */
  metrics?: PersonaMetrics;

  // ============================================================================
  // Security & Compliance
  // ============================================================================

  /**
   * Security profile
   *
   * Security and compliance characteristics. Particularly relevant for System
   * personas but can apply to all types (Teams have security practices,
   * Organizations have certifications, Humans have clearance levels).
   *
   * @see SecurityProfile
   */
  securityProfile?: SecurityProfile;

  // Note: Type-specific attributes (humanAttributes, teamAttributes, systemAttributes,
  // organizationAttributes) are defined in the type-specific interfaces below,
  // not in this base interface.
}

// ============================================================================
// TYPE-SPECIFIC PERSONA OPTIONS (Discriminated Union)
// ============================================================================

/**
 * Human persona options
 *
 * Configuration for Human-type personas (individual people: customers, employees, users).
 * Only allows humanAttributes, blocks other type-specific attributes.
 */
export interface HumanPersonaOptions extends BasePersonaOptions {
  /**
   * Persona type (must be Human)
   */
  type: PersonaType.Human;

  /**
   * Human-specific attributes
   *
   * Reserved for future human-specific characteristics like personality type,
   * work style preferences, availability patterns, etc.
   *
   * @see HumanPersonaAttributes
   */
  humanAttributes?: HumanPersonaAttributes;

  // Block other type-specific attributes
  teamAttributes?: never;
  systemAttributes?: never;
  organizationAttributes?: never;
}

/**
 * Team persona options
 *
 * Configuration for Team-type personas (cross-functional teams, departments, project squads).
 * Only allows teamAttributes, blocks other type-specific attributes.
 */
export interface TeamPersonaOptions extends BasePersonaOptions {
  /**
   * Persona type (must be Team)
   */
  type: PersonaType.Team;

  /**
   * Team-specific attributes
   *
   * Characteristics for team personas including size, composition,
   * structure, working hours, location, tools used, and culture.
   *
   * @see TeamPersonaAttributes
   */
  teamAttributes?: TeamPersonaAttributes;

  // Block other type-specific attributes
  humanAttributes?: never;
  systemAttributes?: never;
  organizationAttributes?: never;
}

/**
 * System persona options
 *
 * Configuration for System-type personas (software systems, APIs, technical services).
 * Only allows systemAttributes, blocks other type-specific attributes.
 */
export interface SystemPersonaOptions extends BasePersonaOptions {
  /**
   * Persona type (must be System)
   */
  type: PersonaType.System;

  /**
   * System-specific attributes
   *
   * Technical characteristics for system/API personas including vendor,
   * capabilities, SLA, authentication, pricing, etc.
   *
   * @see SystemPersonaAttributes
   */
  systemAttributes?: SystemPersonaAttributes;

  /**
   * Adoption barriers
   *
   * Technical, organizational, or practical obstacles to adopting or integrating this system.
   * Only applicable to System-type personas.
   *
   * @example ['Complex API integration required', 'High latency concerns', 'Vendor lock-in risk']
   * @example ['Steep learning curve', 'Limited documentation', 'Expensive at scale']
   * @example ['Requires infrastructure changes', 'Security compliance gaps', 'Migration complexity']
   */
  adoptionBarriers?: string[];

  // Block other type-specific attributes
  humanAttributes?: never;
  teamAttributes?: never;
  organizationAttributes?: never;
}

/**
 * Organization persona options
 *
 * Configuration for Organization-type personas (companies, departments, regulatory bodies, partners).
 * Only allows organizationAttributes, blocks other type-specific attributes.
 */
export interface OrganizationPersonaOptions extends BasePersonaOptions {
  /**
   * Persona type (must be Organization)
   */
  type: PersonaType.Organization;

  /**
   * Organization-specific attributes
   *
   * Characteristics for organization personas including legal name, org type, size,
   * industry, headquarters, relationship, compliance requirements, partnerships, etc.
   *
   * @see OrganizationPersonaAttributes
   */
  organizationAttributes?: OrganizationPersonaAttributes;

  // Block other type-specific attributes
  humanAttributes?: never;
  teamAttributes?: never;
  systemAttributes?: never;
}

/**
 * Persona decorator options (Discriminated Union)
 *
 * Type-safe configuration for persona decoration. The type field discriminates which
 * type-specific attributes are allowed:
 *
 * - type: PersonaType.Human → only humanAttributes allowed
 * - type: PersonaType.Team → only teamAttributes allowed
 * - type: PersonaType.System → only systemAttributes allowed
 * - type: PersonaType.Organization → only organizationAttributes allowed
 *
 * TypeScript will enforce this at compile time, preventing invalid attribute combinations.
 *
 * Personas represent WHO people/systems are - their demographics, psychology, behaviors, and needs.
 * They are foundational archetypes that transcend specific contexts. The same persona can play
 * different stakeholder roles in different contexts.
 *
 * Key principles:
 * - Persona = WHO someone is (archetype, independent of context)
 * - Stakeholder = WHAT someone does (role, within specific context)
 * - Same persona can have multiple stakeholder roles across contexts
 * - Personas capture intrinsic characteristics; stakeholders capture contextual responsibilities
 *
 * @example Human Persona
 * ```typescript
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee',
 *   age: '26',
 *   humanAttributes: { ... }
 *   // teamAttributes: { ... }  // ❌ Compile error!
 * })
 * export class MarcusLeePersona {}
 * ```
 *
 * @example Team Persona
 * ```typescript
 * @Persona({
 *   type: PersonaType.Team,
 *   name: 'Mobile Dev Team',
 *   teamAttributes: {
 *     size: 11,
 *     composition: '4 iOS, 4 Android, 2 QA, 1 PM'
 *   }
 *   // systemAttributes: { ... }  // ❌ Compile error!
 * })
 * export class MobileDevTeamPersona {}
 * ```
 *
 * @example System Persona
 * ```typescript
 * @Persona({
 *   type: PersonaType.System,
 *   name: 'Email Validation Service',
 *   systemAttributes: {
 *     vendor: 'SendGrid',
 *     capabilities: ['RFC 5322 validation']
 *   }
 *   // teamAttributes: { ... }  // ❌ Compile error!
 * })
 * export class EmailValidationServicePersona {}
 * ```
 *
 * @example Organization Persona
 * ```typescript
 * @Persona({
 *   type: PersonaType.Organization,
 *   name: 'External Auditor',
 *   organizationAttributes: {
 *     legalName: 'KPMG Genai LLP',
 *     industry: 'Professional Services - Audit'
 *   }
 *   // humanAttributes: { ... }  // ❌ Compile error!
 * })
 * export class ExternalAuditorPersona {}
 * ```
 */
export type PersonaOptions =
  | HumanPersonaOptions
  | TeamPersonaOptions
  | SystemPersonaOptions
  | OrganizationPersonaOptions;

/**
 * @Persona decorator
 * Marks a class as a Persona with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Personas represent WHO people are (demographics, psychology, behaviors, needs).
 * Stakeholders (decorated with @Stakeholder) represent WHAT people do in specific contexts.
 * Same persona can be different stakeholders in different contexts.
 *
 * @param options - Persona configuration
 * @returns Class decorator that brands the class with WithPersona type
 *
 * @example
 * ```typescript
 * // Example 1: Human Persona - Young Professional
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee - Young Professional',
 *   age: '26',
 *   occupation: 'Junior Software Developer',
 *   description: 'Digital-native young professional seeking simple, fast banking that fits mobile-first lifestyle',
 *
 *   demographics: {
 *     incomeLevel: 'GD$45,000 - GD$65,000/year',
 *     educationLevel: "Bachelor's Degree in Computer Science",
 *     location: 'Urban - San Francisco, CA',
 *     familyStatus: 'Single, no dependents',
 *     employmentStatus: 'Full-time employed',
 *   },
 *
 *   psychology: {
 *     values: ['Financial independence', 'Tech convenience', 'Data transparency'],
 *     fears: ['Losing savings to poor decisions', 'Identity theft', 'Being locked into bad service'],
 *     aspirations: ['Own a home by 35', 'Build substantial investment portfolio', 'Achieve financial independence'],
 *     decisionMakingStyle: 'Analytical - researches online, reads reviews, compares options',
 *     riskTolerance: 'medium',
 *     trustFactors: ['Transparent pricing', 'Strong security', 'Good reviews', 'Modern tech stack'],
 *   },
 *
 *   behavior: {
 *     typicalBehaviors: [
 *       'Checks balance daily on mobile',
 *       'Never visited a branch',
 *       'Uses budgeting apps',
 *       'Automates savings'
 *     ],
 *     communicationStyle: 'Direct and concise - dislikes unnecessary details',
 *     informationSeeking: ['Google search', 'Reddit reviews', 'YouTube tutorials'],
 *     technologyAdoption: 'early-adopter',
 *     usagePatterns: ['Daily active user', 'Multiple logins per day', 'Explores advanced features'],
 *   },
 *
 *   needs: {
 *     functional: ['Track expenses automatically', 'Transfer money instantly', 'Access 24/7'],
 *     emotional: ['Feel in control', 'Feel secure', 'Avoid financial anxiety'],
 *     social: ['Be seen as financially responsible', 'Keep up with peers'],
 *     informational: ['Understand where money goes', 'Know what fees apply', 'See spending patterns'],
 *   },
 *
 *   goals: [
 *     'Build savings for future (house, investments)',
 *     'Simple, fast banking that "just works"',
 *     'Start investing without complexity',
 *     'Track spending and budget easily',
 *   ],
 *
 *   painPoints: [
 *     'Traditional banks feel "old and slow"',
 *     'Complex processes and paperwork',
 *     'Poor mobile app experiences',
 *     'Lack of financial guidance for first-time investors',
 *   ],
 *
 *   motivations: ['Financial independence', 'Tech convenience', 'Efficiency'],
 *
 *   technicalProficiency: 'high',
 *   preferredChannels: ['mobile app', 'web banking', 'chat support'],
 *
 *   context: {
 *     lifeStage: 'Early career - building foundation',
 *     currentSituation: 'Just started first job, new to managing money independently',
 *     challenges: ['Managing student loan debt', 'Building credit history', 'Starting emergency fund'],
 *     environmentalFactors: ['High cost of living', 'Competitive tech job market', 'Rising interest rates'],
 *   },
 *
 *   quotes: [
 *     {
 *       quote: "If my banking app is slower than my code compiler, I'm switching banks",
 *       context: 'After frustrating mobile app experience with previous bank'
 *     },
 *     {
 *       quote: "I don't want to 'learn' banking - it should just work",
 *       context: 'Explaining preference for intuitive UX over feature complexity'
 *     }
 *   ],
 *
 *   dayInTheLife: `Marcus wakes up at 7 AM, checks his account balance on his phone while having coffee.
 *     During his commute, he reviews yesterday's spending in the budgeting app. At lunch, he splits the bill
 *     with coworkers using instant transfers. After work, he researches investment options on his laptop,
 *     comparing fees and returns. Before bed, he sets up an automatic transfer to his savings account.`,
 *
 *   metrics: {
 *     successIndicators: ['Achieves savings goals', 'Growing investment portfolio', 'Feels confident about finances'],
 *     engagementPatterns: ['Daily active user', 'Uses 5+ features regularly', 'Long session times'],
 *     satisfactionSignals: ['Recommends to friends', 'Writes positive reviews', 'Increases deposits'],
 *     churnRisks: ['Slow app performance', 'Hidden fees', 'Poor customer support', 'Better competitor offer'],
 *   },
 *
 *   tags: ['millennial', 'tech-savvy', 'mobile-first', 'early-career', 'urban'],
 * })
 * class MarcusLeePersona {}
 *
 * // Example 2: System Persona - Email Validation Service
 * @Persona({
 *   type: PersonaType.System,
 *   name: 'Email Validation Service',
 *   description: 'Cloud-based email validation API providing RFC 5322 compliance checking, deliverability verification, and spam detection',
 *
 *   technicalProficiency: 'high',
 *   preferredChannels: ['REST API', 'batch validation API'],
 *
 *   systemAttributes: {
 *     vendor: 'SendGrid Email Validation API',
 *     capabilities: [
 *       'RFC 5322 format validation',
 *       'DNS MX record verification',
 *       'SMTP mailbox verification',
 *       'Disposable/temporary email detection',
 *       'Role-based email detection (info@, admin@, etc.)',
 *       'Typo/spam-trap detection',
 *       'Deliverability score (0-100)'
 *     ],
 *     sla: {
 *       availability: '99.9%',
 *       latency: '< 200ms p95',
 *       throughput: '10,000 requests/second'
 *     },
 *     authentication: 'API key (Bearer token)',
 *     rateLimit: '100,000 requests/month (enterprise tier)',
 *     pricing: 'GD$0.002 per validation',
 *     integration: 'RESTful API with JSON payloads',
 *     caching: 'Results cached for 24 hours to reduce API calls',
 *     documentation: 'https://sendgrid.com/docs/api-reference/mail-validation'
 *   },
 *
 *   goals: [
 *     'Validate email addresses before storing in database',
 *     'Reduce bounce rates and improve deliverability',
 *     'Prevent spam/fake email registrations',
 *   ],
 *
 *   painPoints: [
 *     'False positives blocking legitimate users',
 *     'Latency impact on user registration flow',
 *     'Cost at scale',
 *   ],
 *
 *   tags: ['external-service', 'saas', 'email', 'validation', 'critical-dependency'],
 * })
 * class EmailValidationServicePersona {}
 *
 * // Example 3: Organization Persona - Regulatory Body
 * @Persona({
 *   type: PersonaType.Organization,
 *   name: 'Financial Services Regulatory Authority',
 *   description: 'Government regulatory body overseeing financial institutions and ensuring consumer protection',
 *
 *   organizationAttributes: {
 *     organizationType: 'Regulatory body',
 *     size: 'Government agency (500+ employees)',
 *     industry: 'Financial services regulation',
 *     jurisdiction: 'National',
 *     complianceRequirements: [
 *       'Annual compliance reporting',
 *       'Audit trail maintenance',
 *       'Consumer complaint handling',
 *       'Data breach notification',
 *     ],
 *     keyContacts: [
 *       'Jane Smith - Chief Compliance Officer',
 *       'Robert Johnson - Consumer Protection Director',
 *     ],
 *   },
 *
 *   goals: [
 *     'Ensure consumer protection',
 *     'Maintain financial system stability',
 *     'Enforce compliance with regulations',
 *   ],
 *
 *   painPoints: [
 *     'Incomplete or late compliance reporting',
 *     'Difficulty accessing audit trails',
 *     'Consumer complaints not properly handled',
 *   ],
 *
 *   preferredChannels: ['formal reports', 'email', 'regulatory portal'],
 *   technicalProficiency: 'medium',
 *
 *   tags: ['regulatory', 'government', 'compliance', 'critical-stakeholder'],
 * })
 * class FinancialRegulatoryAuthorityPersona {}
 * ```
 */
export function Persona(options: PersonaOptions) {
  return function <T extends Constructor>(
    target: T,
    _context?: ClassDecoratorContext<T>
  ): WithPersona<T> {
    applyBrand(target, 'persona');
    void options;
    return target as WithPersona<T>;
  };
}
