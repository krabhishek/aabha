/**
 * @Metric Decorator
 * Marks a class as a Metric (measurable outcome)
 * @module aabha/decorators/metric
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import { applyBrand } from '../../internal/brand.utils.js';
import type { Constructor, WithMetric } from '../../types/branded-types.js';
import type { BaseDecoratorOptions } from '../../types/decorator-options.types.js';

/**
 * Metric category classification
 *
 * Categorizes metrics to enable category-specific validation and analysis.
 */
export enum MetricCategory {
  /** Business-level metrics (revenue, growth, market share) */
  Business = 'business',
  /** Operational metrics (efficiency, throughput, utilization) */
  Operational = 'operational',
  /** Customer-centric metrics (satisfaction, retention, NPS) */
  Customer = 'customer',
  /** Financial metrics (costs, margins, ROI) */
  Financial = 'financial',
  /** Technical/system metrics (uptime, latency, errors) */
  Technical = 'technical',
  /** Quality metrics (defects, test coverage, reliability) */
  Quality = 'quality',
  /** Security metrics (vulnerabilities, incidents, compliance) */
  Security = 'security',
  /** Compliance and regulatory metrics */
  Compliance = 'compliance',
}

/**
 * Metric goal and strategic context
 *
 * Captures the "why" behind a metric - its strategic purpose, historical context,
 * and business value. This replaces the common pattern of storing goal/backstory
 * in unstructured extensions.
 *
 * @example
 * ```typescript
 * goal: {
 *   goal: 'Increase from #2 to #1 in customer satisfaction in Genai',
 *   backstory: 'Current NPS is 42, down from 48 last year. Target is 65 by end of 2025.',
 *   businessValue: 'Higher NPS correlates with 25% lower churn and 2x referral rate',
 *   strategicAlignment: ['Customer Experience Excellence', 'Market Leadership']
 * }
 * ```
 */
export interface MetricGoal {
  /**
   * Strategic purpose of this metric
   *
   * What are we trying to achieve by tracking and improving this metric?
   */
  goal: string;

  /**
   * Historical context and journey
   *
   * Where we've been, where we are now, and where we're headed
   */
  backstory?: string;

  /**
   * Business value proposition
   *
   * Why this metric matters to the business (impact on revenue, costs, risk, etc.)
   */
  businessValue?: string;

  /**
   * Strategic initiatives or themes this metric supports
   *
   * Links metric to broader strategic priorities
   */
  strategicAlignment?: string[];
}

/**
 * Metric history and trend analysis
 *
 * Captures temporal patterns, historical performance, and forecasts. This enables
 * richer analysis of metric evolution over time beyond a simple "improving/declining" flag.
 *
 * @example
 * ```typescript
 * history: {
 *   trend: 'improving',
 *   historicalValues: [
 *     { timestamp: '2025-01-01', value: 42 },
 *     { timestamp: '2025-02-01', value: 45 },
 *     { timestamp: '2025-03-01', value: 48 }
 *   ],
 *   changeRate: 7.1,  // % per month
 *   projectedValue: 65,
 *   confidenceInterval: { lower: 60, upper: 70 }
 * }
 * ```
 */
export interface MetricHistory {
  /**
   * Overall trend direction
   */
  trend: 'improving' | 'declining' | 'stable' | 'volatile';

  /**
   * Historical data points
   *
   * Time-series of past measurements for trend analysis
   */
  historicalValues?: Array<{
    /** ISO 8601 timestamp or date string */
    timestamp: string;
    /** Measured value at this point */
    value: number;
  }>;

  /**
   * Rate of change
   *
   * Percentage change per time period (sign indicates direction)
   *
   * @example 7.1 = improving 7.1% per month
   * @example -3.2 = declining 3.2% per week
   */
  changeRate?: number;

  /**
   * Forecasted future value
   *
   * Projected value based on current trends and models
   */
  projectedValue?: number;

  /**
   * Confidence interval for projection
   *
   * Range of likely values for the projection (if applicable)
   */
  confidenceInterval?: {
    /** Lower bound of confidence interval */
    lower: number;
    /** Upper bound of confidence interval */
    upper: number;
  };
}

/**
 * Metric visualization and monitoring configuration
 *
 * Defines how the metric should be displayed, monitored, and alerted on.
 * This replaces the simple dashboardUrl field with comprehensive visualization config.
 *
 * @example
 * ```typescript
 * visualization: {
 *   dashboardUrl: 'https://dashboard.company.com/metrics/nps',
 *   visualizationType: 'gauge',
 *   refreshInterval: '1h',
 *   alerting: {
 *     enabled: true,
 *     channels: ['email', 'slack'],
 *     conditions: ['crosses-threshold', 'rapid-change']
 *   }
 * }
 * ```
 */
export interface MetricVisualization {
  /**
   * URL to dashboard or visualization
   */
  dashboardUrl?: string;

  /**
   * Type of visualization best suited for this metric
   */
  visualizationType?:
    | 'line-chart'
    | 'gauge'
    | 'table'
    | 'scorecard'
    | 'heatmap'
    | 'bar-chart'
    | 'area-chart';

  /**
   * How often the visualization should refresh
   *
   * @example 'real-time', '5m', '1h', 'daily'
   */
  refreshInterval?: string;

  /**
   * Alerting configuration
   */
  alerting?: {
    /** Whether alerting is enabled */
    enabled: boolean;
    /** Notification channels */
    channels: string[];
    /** Conditions that trigger alerts */
    conditions: string[];
  };
}

/**
 * Metric dimensions and aggregation rules
 *
 * Defines how a metric can be sliced, diced, and aggregated across different dimensions.
 * Enables multi-dimensional analysis (e.g., by region, channel, segment).
 *
 * @example
 * ```typescript
 * dimensions: {
 *   dimensions: ['channel', 'region', 'customer_segment'],
 *   defaultDimension: 'channel',
 *   aggregationMethod: 'weighted-average',
 *   rollupRules: 'Weighted by transaction volume; exclude channels with <100 transactions'
 * }
 * ```
 */
export interface MetricDimensions {
  /**
   * Available dimensions for slicing this metric
   *
   * @example ['channel', 'region', 'segment', 'product_line']
   */
  dimensions?: string[];

  /**
   * Default dimension for initial display
   *
   * Which dimension should be shown by default in visualizations
   */
  defaultDimension?: string;

  /**
   * Method for aggregating values across dimensions
   */
  aggregationMethod?:
    | 'sum'
    | 'average'
    | 'min'
    | 'max'
    | 'weighted-average'
    | 'median'
    | 'count';

  /**
   * Rules for rolling up to parent levels
   *
   * Description of how child values aggregate to parent (e.g., weighted by volume,
   * exclude outliers, handle missing data)
   */
  rollupRules?: string;
}

/**
 * Metric relationships and dependencies
 *
 * Captures how metrics relate to each other as leading/lagging indicators,
 * correlations, hierarchies, and influence chains. This expands the simple
 * aggregatesFrom field into a rich relationship model.
 *
 * @example
 * ```typescript
 * relationships: {
 *   leadsTo: [CustomerRetentionRate],      // NPS leads retention
 *   lagsFrom: [CustomerSupportQuality],    // NPS lags support quality
 *   correlatesWith: [BrandSentiment],      // NPS correlates with sentiment
 *   aggregatesFrom: [ChannelNPS1, ChannelNPS2], // Rolls up from channel metrics
 *   influencedBy: [ProductQuality, SupportSpeed] // Upstream factors
 * }
 * ```
 */
export interface MetricRelationships {
  /**
   * Metrics this metric leads/predicts (downstream indicators)
   *
   * What future outcomes does this metric predict?
   */
  leadsTo?: WithMetric<Constructor>[];

  /**
   * Metrics that lead/predict this metric (upstream indicators)
   *
   * What earlier signals predict this metric's movement?
   */
  lagsFrom?: WithMetric<Constructor>[];

  /**
   * Metrics that correlate with this metric
   *
   * What moves together with this metric (without causal relationship)?
   */
  correlatesWith?: WithMetric<Constructor>[];

  /**
   * Child metrics that aggregate into this metric
   *
   * What component metrics roll up into this metric?
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Metric
   */
  aggregatesFrom?: WithMetric<Constructor>[];

  /**
   * Metrics that influence or impact this metric
   *
   * What factors drive changes in this metric?
   */
  influencedBy?: WithMetric<Constructor>[];
}

/**
 * Metric threshold configuration
 */
export interface MetricThreshold {
  /**
   * Critical threshold (red zone)
   */
  critical?: number;

  /**
   * Warning threshold (yellow zone)
   */
  warning?: number;

  /**
   * Healthy threshold (green zone)
   */
  healthy?: number;
}

/**
 * Data source configuration for metric
 */
export interface MetricDataSource {
  /**
   * Source system name (e.g., "Google Analytics", "Custom API")
   */
  system: string;

  /**
   * Endpoint or query to fetch data
   */
  endpoint?: string;

  /**
   * Refresh frequency (e.g., "real-time", "hourly", "daily")
   */
  refreshFrequency?: string;

  /**
   * Additional configuration
   */
  config?: Record<string, unknown>;
}

/**
 * Metric decorator options
 */
export interface MetricOptions extends BaseDecoratorOptions {
  /**
   * Metric name (required)
   */
  name: string;

  /**
   * Metric category for classification and analysis
   *
   * @example MetricCategory.Customer
   * @example MetricCategory.Business
   */
  category?: MetricCategory;

  /**
   * Strategic goal and context
   *
   * Why this metric matters, historical context, and business value.
   * Replaces the common pattern of storing goal/backstory in extensions.
   *
   * @example
   * ```typescript
   * goal: {
   *   goal: 'Increase from #2 to #1 in customer satisfaction',
   *   backstory: 'Current NPS is 42, target is 65 by end of 2025',
   *   businessValue: '25% lower churn, 2x referral rate',
   *   strategicAlignment: ['Customer Experience', 'Market Leadership']
   * }
   * ```
   */
  goal?: MetricGoal;

  /**
   * Target value to achieve
   *
   * @example
   * ```typescript
   * target: 95 // For 95% customer satisfaction
   * ```
   */
  target?: number;

  /**
   * Unit of measurement
   *
   * @example
   * ```typescript
   * unit: '%' // Percentage
   * unit: 'USD' // Currency
   * unit: 'count' // Absolute number
   * ```
   */
  unit?: string;

  /**
   * Thresholds for metric health
   */
  thresholds?: MetricThreshold;

  /**
   * How the metric is calculated
   *
   * @example
   * ```typescript
   * calculation: '(completed_checkouts / initiated_checkouts) * 100'
   * ```
   */
  calculation?: string;

  /**
   * Measurement frequency (e.g., "real-time", "daily", "weekly")
   */
  frequency?: string;

  /**
   * Measurement method description
   */
  measurementMethod?: string;

  /**
   * Data source configuration
   */
  dataSource?: MetricDataSource;

  /**
   * Historical trend and forecast
   *
   * Captures temporal patterns, historical values, and projections.
   * Replaces the simple trend string with rich historical analysis.
   *
   * @example
   * ```typescript
   * history: {
   *   trend: 'improving',
   *   historicalValues: [...],
   *   changeRate: 7.1,
   *   projectedValue: 65
   * }
   * ```
   */
  history?: MetricHistory;

  /**
   * Visualization and monitoring configuration
   *
   * Dashboard, chart type, refresh interval, and alerting setup.
   * Replaces the simple dashboardUrl with comprehensive visualization config.
   *
   * @example
   * ```typescript
   * visualization: {
   *   dashboardUrl: 'https://...',
   *   visualizationType: 'gauge',
   *   refreshInterval: '1h',
   *   alerting: { enabled: true, channels: ['slack'] }
   * }
   * ```
   */
  visualization?: MetricVisualization;

  /**
   * Dimensions and aggregation rules
   *
   * How the metric can be sliced and aggregated across dimensions.
   *
   * @example
   * ```typescript
   * dimensions: {
   *   dimensions: ['channel', 'region', 'segment'],
   *   defaultDimension: 'channel',
   *   aggregationMethod: 'weighted-average'
   * }
   * ```
   */
  dimensions?: MetricDimensions;

  /**
   * Metric relationships
   *
   * Leading/lagging indicators, correlations, hierarchies, and influence chains.
   * Expands the simple aggregatesFrom into a rich relationship model.
   *
   * @example
   * ```typescript
   * relationships: {
   *   leadsTo: [RetentionRate],
   *   lagsFrom: [SupportQuality],
   *   aggregatesFrom: [MobileNPS, DesktopNPS]
   * }
   * ```
   */
  relationships?: MetricRelationships;

  /**
   * Baseline value (starting point)
   */
  baseline?: number;

  /**
   * Current value
   */
  currentValue?: number;

  /**
   * Human-readable description
   */
  description?: string;

  /**
   * Tags for categorization
   */
  tags?: string[];

  /**
   * Metric owner/responsible person
   */
  owner?: string;

  /**
   * Direction of improvement (higher is better vs lower is better)
   */
  direction?: 'higher-is-better' | 'lower-is-better';
}

/**
 * @Metric decorator
 * Marks a class as a Metric with compile-time type safety
 *
 * COMPILE-TIME ONLY: Zero runtime overhead. This decorator only applies
 * type brands for compile-time validation. No metadata is stored at runtime.
 *
 * Metrics can be attached to any level of the hierarchy (Strategy, Initiative, Journey, etc.)
 * and can aggregate from child metrics.
 *
 * @param options - Metric configuration
 * @returns Class decorator that brands the class with WithMetric type
 *
 * @example Basic metric with thresholds
 * ```typescript
 * @Metric({
 *   name: 'Cart Abandonment Rate',
 *   category: MetricCategory.Customer,
 *   target: 30,
 *   unit: '%',
 *   thresholds: {
 *     healthy: 30,
 *     warning: 40,
 *     critical: 50
 *   },
 *   calculation: '(abandoned_carts / total_carts) * 100',
 *   frequency: 'real-time',
 *   dataSource: {
 *     system: 'Google Analytics',
 *     endpoint: '/api/cart-analytics',
 *     refreshFrequency: 'hourly'
 *   },
 *   baseline: 45,
 *   currentValue: 38,
 *   owner: 'Product Analytics Team'
 * })
 * class CartAbandonmentRate {}
 * ```
 *
 * @example With strategic goal and history
 * ```typescript
 * @Metric({
 *   name: 'Net Promoter Score',
 *   category: MetricCategory.Customer,
 *   target: 65,
 *   unit: 'score',
 *   baseline: 42,
 *   currentValue: 48,
 *   goal: {
 *     goal: 'Increase from #2 to #1 in customer satisfaction in Genai',
 *     backstory: 'Current NPS is 48, up from 42 last quarter. Target is 65 by Q4 2025.',
 *     businessValue: 'Higher NPS correlates with 25% lower churn and 2x referral rate',
 *     strategicAlignment: ['Customer Experience Excellence', 'Market Leadership']
 *   },
 *   history: {
 *     trend: 'improving',
 *     historicalValues: [
 *       { timestamp: '2025-01-01', value: 42 },
 *       { timestamp: '2025-02-01', value: 45 },
 *       { timestamp: '2025-03-01', value: 48 }
 *     ],
 *     changeRate: 7.1,
 *     projectedValue: 65
 *   },
 *   owner: 'Michael Santos, Chief Customer Officer'
 * })
 * class NetPromoterScore {}
 * ```
 *
 * @example With relationships and visualization
 * ```typescript
 * @Metric({
 *   name: 'Overall Conversion Rate',
 *   category: MetricCategory.Business,
 *   target: 4.5,
 *   unit: '%',
 *   relationships: {
 *     aggregatesFrom: [MobileConversionRate, DesktopConversionRate],
 *     leadsTo: [MonthlyRevenue],
 *     lagsFrom: [UserEngagementScore]
 *   },
 *   visualization: {
 *     dashboardUrl: 'https://analytics.company.com/conversion',
 *     visualizationType: 'line-chart',
 *     refreshInterval: '5m',
 *     alerting: {
 *       enabled: true,
 *       channels: ['slack', 'email'],
 *       conditions: ['crosses-threshold', 'rapid-decline']
 *     }
 *   },
 *   dimensions: {
 *     dimensions: ['channel', 'region', 'device_type'],
 *     defaultDimension: 'channel',
 *     aggregationMethod: 'weighted-average',
 *     rollupRules: 'Weighted by transaction volume'
 *   },
 *   calculation: 'weighted_average(mobile_rate, desktop_rate)'
 * })
 * class OverallConversionRate {}
 * ```
 */
export function Metric(options: MetricOptions) {
  return function <T extends Constructor>(
    target: T,
    _context?: ClassDecoratorContext<T>
  ): WithMetric<T> {
    applyBrand(target, 'metric');
    void options;
    return target as WithMetric<T>;
  };
}
