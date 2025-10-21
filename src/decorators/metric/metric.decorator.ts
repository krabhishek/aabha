/**
 * @Metric Decorator
 * Marks a class as a Metric (measurable outcome)
 * @module blueprint/decorators/metric
 *
 * COMPILE-TIME ONLY: This decorator has zero runtime overhead.
 * It only applies type brands for compile-time validation.
 */

import type { Constructor, WithMetric } from '../../types/branded-types.js';
import { applyBrand } from '../../internal/brand.utils.js';

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
export interface MetricOptions {
  /**
   * Metric name (required)
   */
  name: string;

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
   * Child metrics that aggregate into this metric
   * COMPILE-TIME TYPE SAFETY: Must be classes decorated with @Metric
   *
   * @example
   * ```typescript
   * aggregatesFrom: [MobileConversionRate, DesktopConversionRate]
   * ```
   */
  aggregatesFrom?: WithMetric<Constructor>[];

  /**
   * Baseline value (starting point)
   */
  baseline?: number;

  /**
   * Current value
   */
  current?: number;

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
   * Dashboard or visualization URL
   */
  dashboardUrl?: string;

  /**
   * Historical trend ("improving", "declining", "stable")
   */
  trend?: 'improving' | 'declining' | 'stable';

  /**
   * Extension point for custom metadata
   */
  extensions?: Record<string, unknown>;
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
 * @example
 * ```typescript
 * @Metric({
 *   name: 'Cart Abandonment Rate',
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
 *   owner: 'Product Analytics Team'
 * })
 * class CartAbandonmentRate {}
 * ```
 *
 * @example With aggregation
 * ```typescript
 * @Metric({
 *   name: 'Overall Conversion Rate',
 *   target: 4.5,
 *   unit: '%',
 *   aggregatesFrom: [MobileConversionRate, DesktopConversionRate],
 *   calculation: 'weighted_average(mobile_rate, desktop_rate)'
 * })
 * class OverallConversionRate {}
 * ```
 */
export function Metric(options: MetricOptions) {
  return function <T extends Constructor>(
    target: T,
    _context: ClassDecoratorContext<T>
  ): WithMetric<T> {
    applyBrand(target, 'metric');
    void options;
    return target as WithMetric<T>;
  };
}
