/**
 * Base Decorator Options Types
 * @module aabha/types/decorator-options
 *
 * Provides common base types that all decorator options extend from.
 */

/**
 * Base options interface that all decorator options extend from
 *
 * Provides common fields that every decorator supports: `description`,
 * `tags`, and `extensions` for custom metadata.
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
   * Human-readable description
   *
   * Provides context and explanation for this component. Should be
   * clear and concise, explaining the purpose and usage.
   *
   * @example
   * ```typescript
   * description: 'Customer journey from website discovery to purchase'
   * ```
   */
  description?: string;

  /**
   * Tags for categorization and filtering
   *
   * Use tags to group related components, enable filtering, and
   * improve discoverability. Keep tags lowercase and hyphenated.
   *
   * @example
   * ```typescript
   * tags: ['customer-facing', 'critical-path', 'onboarding']
   * ```
   */
  tags?: string[];

  /**
   * Extension point for custom metadata
   *
   * Use this field to add any custom data that your organization needs
   * beyond the standard Aabha fields. This allows you to extend
   * Aabha without modifying the core API.
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
