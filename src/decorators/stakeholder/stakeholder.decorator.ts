/**
 * @Stakeholder Decorator
 * Marks a class as a Stakeholder (context-specific role)
 * @module aabha/decorators/stakeholder
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 *
 */

import type {
  Constructor,
  WithStakeholder,
  WithPersona,
  WithContext,
  WithMetric,
  BaseDecoratorOptions,
} from '../../types/index.js';
import type { StakeholderType } from '../../enums/stakeholder-type.enum.js';
import { applyBrand } from '../../internal/brand.utils.js';

/**
 * Relationship to another stakeholder
 *
 * Describes how this stakeholder relates to other stakeholders in the organizational ecosystem.
 * Understanding stakeholder relationships helps identify collaboration patterns, reporting lines,
 * and dependency chains.
 */
export interface StakeholderRelationship {
  /**
   * Related stakeholder
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Stakeholder
   */
  stakeholder: WithStakeholder<Constructor>;

  /**
   * Type of relationship
   *
   * @example 'reports-to' - Hierarchical reporting relationship
   * @example 'collaborates-with' - Peer collaboration
   * @example 'depends-on' - Dependency on another stakeholder
   * @example 'serves' - Service provider relationship
   * @example 'governs' - Governance/oversight relationship
   */
  relationshipType:
    | 'reports-to'
    | 'collaborates-with'
    | 'depends-on'
    | 'serves'
    | 'governs'
    | 'consults'
    | 'informs'
    | string;

  /**
   * Description of the relationship
   *
   * @example "Reports quarterly investment performance and seeks approval for major decisions"
   * @example "Collaborates on cross-functional product launches"
   */
  description?: string;

  /**
   * Interaction frequency
   *
   * @example "daily" - Daily interactions
   * @example "weekly" - Weekly interactions
   * @example "on-demand" - As needed
   * @example "quarterly" - Quarterly reviews
   */
  interactionFrequency?: string;

  /**
   * Communication channels used in this relationship
   *
   * @example ['email', 'slack', 'video-calls', 'in-person-meetings']
   */
  communicationChannels?: string[];

  /**
   * Formal agreements governing this relationship
   *
   * @example ['SLA-2024-Q1', 'Partnership Agreement', 'Service Contract']
   */
  formalAgreements?: string[];
}

/**
 * Collaboration pattern definition
 *
 * Describes how stakeholders work together, including collaboration style,
 * touchpoints, and artifacts exchanged.
 */
export interface StakeholderCollaboration {
  /**
   * Stakeholder to collaborate with
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Stakeholder
   */
  withStakeholder: WithStakeholder<Constructor>;

  /**
   * Type of collaboration
   *
   * @example 'sync' - Synchronous, real-time collaboration
   * @example 'async' - Asynchronous collaboration
   * @example 'event-driven' - Triggered by specific events
   */
  collaborationType: 'sync' | 'async' | 'event-driven' | string;

  /**
   * Purpose of this collaboration
   *
   * @example "Joint decision-making on product features"
   * @example "Handoff of customer issues requiring escalation"
   */
  purpose: string;

  /**
   * Collaboration frequency
   *
   * @example "daily" - Daily collaboration
   * @example "weekly" - Weekly collaboration
   * @example "on-demand" - As needed
   */
  frequency: string;

  /**
   * Collaboration touchpoints (meetings, reviews, handoffs)
   *
   * @example ['Daily standup', 'Weekly planning', 'Sprint reviews']
   */
  touchpoints?: string[];

  /**
   * Artifacts or documents exchanged during collaboration
   *
   * @example ['Requirements docs', 'Status reports', 'Design mockups']
   */
  artifacts?: string[];
}

/**
 * Decision rights structure
 *
 * Defines what decisions this stakeholder can make, veto, or must be consulted on.
 * This clarifies decision authority and governance boundaries.
 */
export interface DecisionRights {
  /**
   * Decisions this stakeholder can approve
   *
   * @example ['Budget allocations under $10K', 'Feature prioritization', 'Team hiring']
   */
  canApprove?: string[];

  /**
   * Decisions this stakeholder can veto
   *
   * @example ['Major architectural changes', 'Security policy exceptions']
   */
  canVeto?: string[];

  /**
   * Decisions requiring this stakeholder's consultation
   *
   * @example ['Product roadmap changes', 'Technology stack decisions']
   */
  mustConsult?: string[];

  /**
   * Decisions this stakeholder must be informed about
   *
   * @example ['Production deployments', 'Security incidents', 'Customer escalations']
   */
  mustInform?: string[];
}

/**
 * Communication preferences
 *
 * Defines how this stakeholder prefers to communicate and be communicated with.
 * This helps optimize collaboration and ensure effective information flow.
 */
export interface CommunicationPreferences {
  /**
   * Preferred communication channels (in priority order)
   *
   * @example ['email', 'slack', 'video-call', 'phone']
   */
  preferredChannels?: string[];

  /**
   * Expected response time for this stakeholder
   *
   * @example "Within 24 hours for non-urgent matters"
   * @example "Within 1 hour during business hours"
   */
  responseTime?: string;

  /**
   * Escalation path when stakeholder is unavailable
   *
   * @example "Escalate to VP of Product after 48 hours"
   */
  escalationPath?: string;

  /**
   * Language preferences
   *
   * @example ['English', 'Spanish']
   */
  languagePreferences?: string[];

  /**
   * Best times for communication
   *
   * @example "9 AM - 5 PM EST, avoid Friday afternoons"
   */
  availability?: string;
}

/**
 * Stakeholder decorator options
 *
 * Represents a context-specific role that a Persona plays. Stakeholders are the
 * organizational actors with specific responsibilities, authority, and relationships
 * within a business context.
 *
 * Key principles:
 * - Stakeholder = WHO (persona) + WHAT (role) + WHERE (context)
 * - Same persona can be different stakeholders in different contexts
 * - Stakeholders have influence, decision rights, and collaboration patterns
 * - Relationships describe stakeholder-to-stakeholder interactions
 */
export interface StakeholderOptions extends BaseDecoratorOptions {
  // ============================================================================
  // Stakeholder Identity
  // ============================================================================

  /**
   * Type of stakeholder (required)
   *
   * Distinguishes between Human, Team, Organization, and System stakeholders.
   * This fundamental classification affects how we model their behaviors and needs.
   *
   * @example StakeholderType.Human - Individual person
   * @example StakeholderType.Team - Group of people
   * @example StakeholderType.Organization - Company or department
   * @example StakeholderType.System - Software system or service
   */
  type: StakeholderType;

  /**
   * Stakeholder role name (required)
   *
   * The specific role this stakeholder plays within the context.
   * Use clear, business-meaningful names.
   *
   * @example "Investor" - Person investing money
   * @example "Account Owner" - Person owning a bank account
   * @example "Risk Analyst" - Person analyzing risk
   * @example "Email Validation Service" - System validating emails
   */
  role: string;

  /**
   * Stakeholder name (defaults to role)
   *
   * Optional specific name for this stakeholder instance.
   *
   * @example "John Smith - Primary Investor"
   * @example "Sendgrid Email Validator"
   */
  name?: string;

  /**
   * Human-readable description of this stakeholder
   *
   * Explain the stakeholder's role, importance, and context-specific characteristics.
   *
   * @example "High-net-worth individual seeking diversified investment opportunities with focus on ESG criteria"
   * @example "Third-party email validation service ensuring deliverability and reducing bounce rates"
   */
  description?: string;

  /**
   * Tags for categorization and discovery
   *
   * @example ['external', 'regulated', 'high-value']
   * @example ['internal', 'technical', 'critical-path']
   */
  tags?: string[];

  // ============================================================================
  // Core Relationships (Required)
  // ============================================================================

  /**
   * Reference to underlying persona (required)
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Persona
   *
   * Even systems have personas! A persona represents the entity's identity
   * and characteristics, while the stakeholder role is context-specific.
   *
   * Key concept: Same persona can be different stakeholders in different contexts.
   *
   * @example
   * ```typescript
   * // Human persona
   * persona: TechSavvyMillennial
   *
   * // System persona
   * persona: AuthenticationSystemPersona
   * ```
   */
  persona: WithPersona<Constructor>;

  /**
   * Business context where this stakeholder operates (required)
   * COMPILE-TIME TYPE SAFETY: Must be a class decorated with @Context
   *
   * The organizational or business context that gives meaning to this stakeholder role.
   *
   * @example
   * ```typescript
   * context: InvestmentContext
   * context: RiskManagementContext
   * context: CustomerSupportContext
   * ```
   */
  context: WithContext<Constructor>;

  // ============================================================================
  // Role Definition & Scope
  // ============================================================================

  /**
   * Context-specific goals this stakeholder aims to achieve
   *
   * What this stakeholder wants to accomplish within this context.
   *
   * @example ['Maximize investment returns', 'Minimize risk exposure', 'Track portfolio performance daily']
   * @example ['Ensure 99.9% email deliverability', 'Reduce bounce rate below 2%']
   */
  goals?: string[];

  /**
   * Context-specific responsibilities this stakeholder holds
   *
   * What this stakeholder is accountable for doing within this context.
   *
   * @example ['Review investment opportunities weekly', 'Approve large withdrawals', 'Monitor portfolio risk']
   * @example ['Validate email syntax', 'Check DNS records', 'Flag suspicious domains']
   */
  responsibilities?: string[];

  /**
   * Accountability: What this stakeholder is held accountable for
   *
   * Outcomes or results this stakeholder must deliver or maintain.
   *
   * @example ['Portfolio performance meets benchmark +2%', 'Compliance with investment policy']
   * @example ['99.95% uptime SLA', 'Response time < 200ms']
   */
  accountability?: string[];

  /**
   * Stakeholder interests in this context
   *
   * What matters to this stakeholder; their concerns and priorities.
   *
   * @example ['High returns with moderate risk', 'Tax optimization', 'ESG compliance']
   * @example ['Service reliability', 'API stability', 'Clear documentation']
   */
  interests?: string[];

  /**
   * Role-specific constraints or limitations
   *
   * Boundaries or restrictions that limit what this stakeholder can do.
   *
   * @example ['Cannot invest in tobacco companies', 'Must diversify across 10+ positions']
   * @example ['Read-only access to customer data', 'Cannot initiate transactions']
   */
  constraints?: string[];

  // ============================================================================
  // Influence & Power Dynamics
  // ============================================================================

  /**
   * Influence level within this context
   *
   * How much power or sway this stakeholder has over decisions and outcomes.
   *
   * @example 'low' - Limited influence, rarely consulted
   * @example 'medium' - Moderate influence, consulted on relevant decisions
   * @example 'high' - Significant influence, can drive or block decisions
   */
  influence?: 'low' | 'medium' | 'high';

  /**
   * Sphere of influence: Areas where this stakeholder has impact
   *
   * Specific domains, processes, or decisions where this stakeholder's influence matters.
   *
   * @example ['Investment strategy', 'Risk tolerance decisions', 'Fee negotiations']
   * @example ['Technical architecture', 'Tool selection', 'API design']
   */
  influenceSphere?: string[];

  /**
   * Decision authority: Types of decisions this stakeholder can make
   *
   * Categories of decisions where this stakeholder has final say.
   *
   * @example ['Withdrawal requests up to $50K', 'Rebalancing within asset classes']
   * @example ['Service selection', 'SLA parameters', 'Failover triggers']
   */
  decisionAuthority?: string[];

  /**
   * Stakeholder priority level for engagement and management
   *
   * How important this stakeholder is to prioritize in stakeholder management.
   *
   * @example 'critical' - Mission-critical, business cannot function without this stakeholder
   * @example 'primary' - Must be actively managed, critical to success
   * @example 'secondary' - Should be kept informed, important but not critical
   * @example 'tertiary' - Monitor periodically, low priority
   */
  stakeholderPriority?: 'critical' | 'primary' | 'secondary' | 'tertiary';

  /**
   * Structured decision rights: What this stakeholder can approve, veto, or must be consulted on
   *
   * Formal governance defining this stakeholder's decision-making authority.
   *
   * @example
   * ```typescript
   * decisionRights: {
   *   canApprove: ['Budget allocations under $10K', 'Feature prioritization'],
   *   canVeto: ['Changes to risk framework', 'Security policy exceptions'],
   *   mustConsult: ['Strategic roadmap changes', 'Major vendor selections'],
   *   mustInform: ['All production deployments', 'Customer escalations']
   * }
   * ```
   */
  decisionRights?: DecisionRights;

  // ============================================================================
  // Engagement & Collaboration
  // ============================================================================

  /**
   * Engagement frequency
   *
   * How often this stakeholder actively engages with the context or system.
   *
   * @example 'real-time' - Continuous, instant engagement (< 1 second latency)
   * @example 'daily' - Active daily engagement
   * @example 'weekly' - Weekly check-ins or reviews
   * @example 'monthly' - Monthly reviews or updates
   * @example 'occasional' - Ad-hoc, infrequent engagement
   */
  engagement?: 'real-time' | 'daily' | 'weekly' | 'monthly' | 'occasional';

  /**
   * Collaboration patterns with other stakeholders
   *
   * Structured descriptions of how this stakeholder works with others.
   *
   * @example
   * ```typescript
   * collaborationPatterns: [
   *   {
   *     withStakeholder: RiskManagerStakeholder,
   *     collaborationType: 'sync',
   *     purpose: 'Joint review of high-risk investment proposals',
   *     frequency: 'weekly',
   *     touchpoints: ['Risk review meeting', 'Investment committee'],
   *     artifacts: ['Risk assessment reports', 'Investment proposals']
   *   }
   * ]
   * ```
   */
  collaborationPatterns?: StakeholderCollaboration[];

  /**
   * Communication preferences for this stakeholder
   *
   * How this stakeholder prefers to communicate and be communicated with.
   *
   * @example
   * ```typescript
   * communicationPreferences: {
   *   preferredChannels: ['email', 'phone', 'video-call'],
   *   responseTime: 'Within 24 hours for non-urgent',
   *   escalationPath: 'Escalate to assistant after 48 hours',
   *   availability: '9 AM - 6 PM EST, avoid Friday afternoons'
   * }
   * ```
   */
  communicationPreferences?: CommunicationPreferences;

  /**
   * Touchpoints: When and where this stakeholder interacts with the system/context
   *
   * Specific moments or places where engagement happens.
   *
   * @example ['Portfolio review dashboard', 'Monthly statements', 'Quarterly meetings', 'Mobile app alerts']
   * @example ['API health dashboard', 'Incident notifications', 'SLA reports']
   */
  touchpoints?: string[];

  // ============================================================================
  // Context-Specific Attributes
  // ============================================================================

  /**
   * Permissions in this context
   *
   * What actions or resources this stakeholder is authorized to access.
   *
   * @example ['view_portfolio', 'initiate_transfers', 'download_statements', 'update_preferences']
   * @example ['read_email_input', 'write_validation_result', 'access_dns_records']
   */
  permissions?: string[];

  /**
   * Contextual needs: What this stakeholder needs to be effective in this context
   *
   * Resources, information, or support required for this stakeholder to succeed.
   *
   * @example ['Real-time portfolio performance data', 'Risk analytics dashboard', 'Market news feed']
   * @example ['API documentation', '24/7 support', 'Sandbox environment']
   */
  contextualNeeds?: string[];

  /**
   * Pain points: Context-specific challenges this stakeholder faces
   *
   * Problems, frustrations, or obstacles this stakeholder encounters.
   *
   * @example ['Slow mobile app performance', 'Confusing fee structure', 'Delayed trade confirmations']
   * @example ['Unclear error messages', 'Frequent API timeouts', 'Inconsistent response formats']
   */
  painPoints?: string[];

  /**
   * Success criteria: How this stakeholder measures success in this context
   *
   * Indicators that tell this stakeholder they're achieving their goals.
   *
   * @example ['Portfolio outperforms S&P 500 by 2%', 'No unexpected losses > 5%', 'Access info within 3 clicks']
   * @example ['99.9% uptime', 'Response time < 200ms', 'Zero data loss incidents']
   */
  successCriteria?: string[];

  /**
   * Context-specific attributes (legacy field, prefer structured fields)
   *
   * Free-form attributes for context-specific data not covered by other fields.
   * Consider using structured fields (contextualNeeds, painPoints, etc.) instead.
   *
   * @deprecated Prefer structured fields for better type safety and validation
   */
  contextAttributes?: Record<string, unknown>;

  // ============================================================================
  // Relationships & Dependencies
  // ============================================================================

  /**
   * Structured relationships with other stakeholders
   *
   * Detailed descriptions of how this stakeholder relates to others, including
   * relationship type, frequency, channels, and agreements.
   *
   * @example
   * ```typescript
   * relationships: [
   *   {
   *     stakeholder: FinancialAdvisorStakeholder,
   *     relationshipType: 'reports-to',
   *     description: 'Reports quarterly performance and seeks guidance on major decisions',
   *     interactionFrequency: 'quarterly',
   *     communicationChannels: ['email', 'video-call', 'in-person'],
   *     formalAgreements: ['Advisory Agreement 2024']
   *   },
   *   {
   *     stakeholder: RiskManagerStakeholder,
   *     relationshipType: 'collaborates-with',
   *     description: 'Collaborates on risk assessment for new investments',
   *     interactionFrequency: 'as-needed',
   *     communicationChannels: ['slack', 'email']
   *   }
   * ]
   * ```
   */
  relationships?: StakeholderRelationship[];

  /**
   * Dependencies: What or who this stakeholder depends on
   *
   * Systems, data, services, or other stakeholders required for this stakeholder to function.
   *
   * @example [MarketDataServiceStakeholder, RiskAnalyticsEngineStakeholder]
   * @example [AuthenticationServiceStakeholder, CustomerDatabaseStakeholder]
   */
  dependencies?: WithStakeholder<Constructor>[];

  /**
   * Dependents: Who depends on this stakeholder
   *
   * Other stakeholders that rely on this stakeholder's outputs or services.
   *
   * @example [PortfolioManagerStakeholder, ComplianceOfficerStakeholder]
   * @example [NotificationServiceStakeholder, AuditSystemStakeholder]
   */
  dependents?: WithStakeholder<Constructor>[];

  // ============================================================================
  // Performance & Metrics
  // ============================================================================

  /**
   * Metrics of importance for this stakeholder
   *
   * Type-safe references to metrics that measure this stakeholder's performance or satisfaction.
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Metric
   *
   * @example [PortfolioReturnsMetric, RiskAdjustedPerformanceMetric, CustomerSatisfactionMetric]
   * @example [ServiceUptimeMetric, APIResponseTimeMetric, ErrorRateMetric]
   */
  metrics?: WithMetric<Constructor>[];

  /**
   * Key performance indicators specific to this stakeholder
   *
   * Measurable values that indicate how well this stakeholder is performing.
   *
   * @example ['Portfolio return > 8% annually', 'Max drawdown < 15%', 'Diversification ratio > 0.7']
   * @example ['Uptime > 99.9%', 'Response time < 200ms', 'Error rate < 0.1%']
   */
  kpis?: string[];

  /**
   * Satisfaction indicators: Signals that this stakeholder is satisfied
   *
   * Qualitative or quantitative indicators of stakeholder satisfaction.
   *
   * @example ['Uses app daily', 'Refers friends', 'Renews subscription', 'NPS score > 8']
   * @example ['No support tickets filed', 'API adoption growing', 'Positive feedback in surveys']
   */
  satisfactionIndicators?: string[];

  // ============================================================================
  // Strategic Alignment
  // ============================================================================

  /**
   * Strategic importance of this stakeholder
   *
   * How critical this stakeholder is to the organization's strategic success.
   *
   * @example 'critical' - Mission-critical, failure would severely impact business
   * @example 'important' - Important to success, but not catastrophic if lost
   * @example 'supporting' - Helpful but not essential, could be replaced
   */
  strategicImportance?: 'critical' | 'important' | 'supporting';

  /**
   * Business value this stakeholder brings
   *
   * The tangible or intangible value this stakeholder contributes to the organization.
   *
   * @example "Provides $2M+ in annual assets under management with low churn risk"
   * @example "Enables compliant email communications, avoiding $100K+ in potential fines"
   */
  businessValue?: string;

  /**
   * Risks associated with this stakeholder
   *
   * Potential risks related to this stakeholder's satisfaction, performance, or relationship.
   *
   * @example [
   *   { risk: 'May switch to competitor', likelihood: 'medium', impact: 'high', mitigation: 'Quarterly check-ins and proactive support' },
   *   { risk: 'Service outage impacts customer experience', likelihood: 'low', impact: 'high', mitigation: 'Redundant provider + monitoring' }
   * ]
   */
  risks?: Array<{
    risk: string;
    likelihood?: 'low' | 'medium' | 'high';
    impact?: 'low' | 'medium' | 'high';
    mitigation?: string;
  }>;
}

/**
 * @Stakeholder decorator
 * Marks a class as a Stakeholder (context-specific role) with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Stakeholders represent context-specific roles that a Persona plays within a business context.
 * They are the organizational actors with specific responsibilities, authority, influence,
 * and relationships.
 *
 * Key concepts:
 * - Stakeholder = WHO (persona) + WHAT (role) + WHERE (context)
 * - Same persona can be different stakeholders in different contexts
 * - Stakeholders have influence, decision rights, and collaboration patterns
 * - Relationships model organizational dynamics and dependencies
 *
 * Examples: Investor, Risk Analyst, Customer Support Agent, Email Validation Service
 *
 * @param options - Stakeholder configuration
 * @returns Class decorator that brands the class with WithStakeholder type
 *
 * @example Comprehensive Human Stakeholder (Primary Investor)
 * ```typescript
 * @Stakeholder({
 *   // ===== Identity =====
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   name: 'High-Net-Worth Individual Investor',
 *   description: 'High-net-worth individual seeking diversified investment opportunities with focus on ESG criteria and steady long-term growth',
 *   tags: ['external', 'high-value', 'esg-focused'],
 *
 *   // ===== Core Relationships (Required) =====
 *   persona: TechSavvyMillennial,
 *   context: InvestmentManagementContext,
 *
 *   // ===== Role Definition & Scope =====
 *   goals: [
 *     'Achieve 8-10% annual returns with moderate risk',
 *     'Build diversified portfolio across 15+ positions',
 *     'Track performance daily via mobile app',
 *     'Align investments with ESG principles'
 *   ],
 *   responsibilities: [
 *     'Review investment opportunities weekly',
 *     'Approve or reject investment recommendations',
 *     'Monitor portfolio performance and rebalancing needs',
 *     'Maintain minimum $50K account balance'
 *   ],
 *   accountability: [
 *     'Portfolio performance meets or exceeds benchmark +2%',
 *     'Compliance with investment policy statement',
 *     'Timely response to rebalancing recommendations (within 48 hours)'
 *   ],
 *   interests: [
 *     'High returns with moderate risk (max 15% drawdown)',
 *     'Tax-efficient investing strategies',
 *     'ESG compliance and impact investing',
 *     'Transparent fee structure'
 *   ],
 *   constraints: [
 *     'Cannot invest in tobacco, firearms, or fossil fuel companies',
 *     'Must maintain diversification (no single position > 10%)',
 *     'No options or derivatives trading allowed'
 *   ],
 *
 *   // ===== Influence & Power Dynamics =====
 *   influence: 'high',
 *   influenceSphere: [
 *     'Investment strategy and asset allocation',
 *     'Risk tolerance decisions',
 *     'Fee negotiations',
 *     'Service provider selection'
 *   ],
 *   decisionAuthority: [
 *     'Approval of individual investments up to $50K',
 *     'Portfolio rebalancing within approved asset classes',
 *     'Withdrawal requests of any size'
 *   ],
 *   stakeholderPriority: 'primary',
 *   decisionRights: {
 *     canApprove: [
 *       'Individual investments under $50K',
 *       'Rebalancing within asset allocation bands',
 *       'Withdrawal requests'
 *     ],
 *     canVeto: [
 *       'Investments violating ESG criteria',
 *       'High-risk investments outside policy',
 *       'Fee increases'
 *     ],
 *     mustConsult: [
 *       'Major strategy changes',
 *       'Asset allocation shifts > 10%',
 *       'New investment vehicles or products'
 *     ],
 *     mustInform: [
 *       'All trades and transactions',
 *       'Quarterly performance reports',
 *       'Material changes to portfolio risk'
 *     ]
 *   },
 *
 *   // ===== Engagement & Collaboration =====
 *   engagement: 'daily',
 *   collaborationPatterns: [
 *     {
 *       withStakeholder: FinancialAdvisorStakeholder,
 *       collaborationType: 'sync',
 *       purpose: 'Joint review of investment performance and strategy adjustments',
 *       frequency: 'quarterly',
 *       touchpoints: ['Quarterly review meeting', 'Ad-hoc phone calls', 'Email updates'],
 *       artifacts: ['Performance reports', 'Investment proposals', 'Strategy documents']
 *     },
 *     {
 *       withStakeholder: RiskManagerStakeholder,
 *       collaborationType: 'async',
 *       purpose: 'Risk assessment and compliance for new investment proposals',
 *       frequency: 'as-needed',
 *       touchpoints: ['Email reviews', 'Risk assessment reports'],
 *       artifacts: ['Risk analysis', 'Compliance checklists']
 *     }
 *   ],
 *   communicationPreferences: {
 *     preferredChannels: ['mobile-app', 'email', 'phone', 'video-call'],
 *     responseTime: 'Within 24 hours for non-urgent; within 2 hours for urgent',
 *     escalationPath: 'Call mobile phone after 48 hours of no response',
 *     availability: '9 AM - 9 PM EST weekdays; 10 AM - 6 PM weekends'
 *   },
 *   touchpoints: [
 *     'Mobile app - Daily portfolio check',
 *     'Email - Weekly market updates',
 *     'Video call - Quarterly performance reviews',
 *     'Phone - Ad-hoc consultations'
 *   ],
 *
 *   // ===== Context-Specific Attributes =====
 *   permissions: [
 *     'view_portfolio',
 *     'view_transactions',
 *     'initiate_transfers',
 *     'download_statements',
 *     'update_preferences',
 *     'approve_investments',
 *     'request_withdrawals'
 *   ],
 *   contextualNeeds: [
 *     'Real-time portfolio performance data with daily updates',
 *     'Risk analytics dashboard showing volatility and drawdown',
 *     'ESG compliance scoring for all holdings',
 *     'Tax-loss harvesting recommendations',
 *     'Market news feed filtered to portfolio holdings'
 *   ],
 *   painPoints: [
 *     'Mobile app performance slow during market hours',
 *     'Confusing fee structure and hidden costs',
 *     'Delayed trade confirmations (want instant)',
 *     'ESG scoring methodology not transparent enough'
 *   ],
 *   successCriteria: [
 *     'Portfolio outperforms S&P 500 by 2% annually',
 *     'No unexpected losses exceeding 5% in any quarter',
 *     'Access key information within 3 clicks',
 *     '100% ESG compliance across all holdings',
 *     'Fees remain under 1% annually'
 *   ],
 *
 *   // ===== Relationships & Dependencies =====
 *   relationships: [
 *     {
 *       stakeholder: FinancialAdvisorStakeholder,
 *       relationshipType: 'collaborates-with',
 *       description: 'Primary advisory relationship for investment strategy and execution',
 *       interactionFrequency: 'quarterly',
 *       communicationChannels: ['video-call', 'email', 'phone'],
 *       formalAgreements: ['Investment Advisory Agreement 2024', 'Fee Schedule 2024']
 *     },
 *     {
 *       stakeholder: PortfolioManagerStakeholder,
 *       relationshipType: 'depends-on',
 *       description: 'Depends on for day-to-day portfolio management and trade execution',
 *       interactionFrequency: 'weekly',
 *       communicationChannels: ['email', 'mobile-app'],
 *       formalAgreements: ['Discretionary Management Agreement']
 *     },
 *     {
 *       stakeholder: ComplianceOfficerStakeholder,
 *       relationshipType: 'consults',
 *       description: 'Consulted on ESG compliance and regulatory matters',
 *       interactionFrequency: 'as-needed',
 *       communicationChannels: ['email']
 *     }
 *   ],
 *   dependencies: [
 *     MarketDataServiceStakeholder,
 *     RiskAnalyticsEngineStakeholder,
 *     ESGScoringServiceStakeholder
 *   ],
 *   dependents: [
 *     PortfolioManagerStakeholder,
 *     ReportingSystemStakeholder
 *   ],
 *
 *   // ===== Performance & Metrics =====
 *   metrics: [
 *     PortfolioReturnsMetric,
 *     RiskAdjustedPerformanceMetric,
 *     CustomerSatisfactionMetric,
 *     EngagementFrequencyMetric
 *   ],
 *   kpis: [
 *     'Portfolio return > 8% annually',
 *     'Max drawdown < 15%',
 *     'Sharpe ratio > 1.0',
 *     'Diversification ratio > 0.7',
 *     'ESG score > 80/100'
 *   ],
 *   satisfactionIndicators: [
 *     'Uses mobile app daily',
 *     'Refers friends to service',
 *     'Responds positively to NPS surveys (score > 8)',
 *     'No complaints filed in past 12 months',
 *     'Increases investment balance quarterly'
 *   ],
 *
 *   // ===== Strategic Alignment =====
 *   strategicImportance: 'critical',
 *   businessValue: 'Provides $2M+ in assets under management with low churn risk and high referral potential',
 *   risks: [
 *     {
 *       risk: 'May switch to competitor offering lower fees',
 *       likelihood: 'medium',
 *       impact: 'high',
 *       mitigation: 'Quarterly check-ins, proactive performance communication, fee transparency'
 *     },
 *     {
 *       risk: 'Market downturn may cause portfolio losses exceeding tolerance',
 *       likelihood: 'medium',
 *       impact: 'high',
 *       mitigation: 'Proactive risk monitoring, regular rebalancing, downside protection strategies'
 *     },
 *     {
 *       risk: 'Dissatisfaction with app performance leads to disengagement',
 *       likelihood: 'low',
 *       impact: 'medium',
 *       mitigation: 'Prioritize mobile app improvements, gather user feedback monthly'
 *     }
 *   ]
 * })
 * export class PrimaryInvestorStakeholder {}
 * ```
 *
 * @example System Stakeholder (Email Validation Service)
 * ```typescript
 * @Stakeholder({
 *   type: StakeholderType.System,
 *   role: 'Email Validation Service',
 *   persona: EmailValidationSystemPersona,
 *   context: DigitalBankingContext,
 *   description: 'Third-party email validation service ensuring deliverability and reducing bounce rates',
 *
 *   goals: ['Validate 99.9% of emails correctly', 'Response time < 200ms'],
 *   responsibilities: ['Validate email syntax', 'Check DNS records', 'Flag suspicious domains'],
 *   permissions: ['read_email_input', 'write_validation_result', 'access_dns_records'],
 *
 *   influence: 'medium',
 *   stakeholderPriority: 'secondary',
 *   engagement: 'daily',
 *
 *   metrics: [ServiceUptimeMetric, APIResponseTimeMetric, ErrorRateMetric],
 *   kpis: ['Uptime > 99.9%', 'Response time < 200ms', 'Error rate < 0.1%'],
 *
 *   strategicImportance: 'important',
 *   businessValue: 'Enables compliant email communications, avoiding $100K+ in potential fines',
 *
 *   tags: ['external-service', 'api-integration', 'critical-path']
 * })
 * export class EmailValidationServiceStakeholder {}
 * ```
 */
export function Stakeholder(options: StakeholderOptions) {
  return function <T extends Constructor>(
    target: T,
    _context?: ClassDecoratorContext<T>
  ): WithStakeholder<T> {
    applyBrand(target, 'stakeholder');
    void options;
    return target as WithStakeholder<T>;
  };
}
