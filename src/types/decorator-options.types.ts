/**
 * Base Decorator Options Types
 * @module blueprint/types/decorator-options
 *
 * Provides common base types that all decorator options extend from.
 */

/**
 * Base options interface that all decorator options extend from
 *
 * Provides the common `extensions` field for custom metadata that every
 * decorator supports.
 *
 * @example
 * ```typescript
 * interface MyDecoratorOptions extends BaseDecoratorOptions {
 *   name: string;
 *   // other fields...
 * }
 * ```
 */
export interface BaseDecoratorOptions {
  /**
   * Extension point for custom metadata
   *
   * Use this field to add any custom data that your organization needs
   * beyond the standard Blueprint fields. This allows you to extend
   * Blueprint without modifying the core API.
   *
   * @example
   * ```typescript
   * extensions: {
   *   jiraTicket: 'PROJ-123',
   *   teamOwner: 'payments-team',
   *   customMetric: { value: 42, unit: 'ms' }
   * }
   * ```
   */
  extensions?: Record<string, unknown>;
}
