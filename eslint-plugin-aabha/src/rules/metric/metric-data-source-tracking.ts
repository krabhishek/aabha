/**
 * Metric Data Source Tracking Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **data source tracking** identifies where metric data comes from,
 * enabling data lineage, troubleshooting, and system integration. Metrics without data source
 * information create ambiguity - AI systems can't connect to data systems, verify data freshness,
 * or understand data dependencies.
 *
 * Data source tracking enables AI to:
 * 1. **Connect to data systems** - Know which systems provide metric data
 * 2. **Verify data freshness** - Understand refresh frequencies and data timeliness
 * 3. **Troubleshoot issues** - Trace problems to source systems
 * 4. **Generate integration code** - Create code that fetches metric data
 *
 * Missing data source information means AI can't connect to data systems or verify data quality.
 *
 * **What it checks:**
 * - Metric decorators have a `dataSource` field
 * - Data source has a `system` field identifying the source system
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Data source specified
 * @Metric({
 *   name: 'Cart Abandonment Rate',
 *   dataSource: {
 *     system: 'Google Analytics',
 *     endpoint: '/api/cart-analytics',
 *     refreshFrequency: 'hourly'
 *   }
 * })
 * export class CartAbandonmentRate {}
 *
 * // ❌ Bad - Missing data source
 * @Metric({
 *   name: 'Cart Abandonment Rate'
 *   // Missing dataSource - where does data come from?
 * })
 * export class CartAbandonmentRate {}
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingDataSource' | 'missingDataSourceSystem';

export const metricDataSourceTracking = createRule<[], MessageIds>({
  name: 'metric-data-source-tracking',
  meta: {
    type: 'problem',
    docs: {
      description: 'Metrics should have data source tracking to enable data lineage and system integration',
    },
    messages: {
      missingDataSource: "Metric '{{name}}' is missing a 'dataSource' field. Data source tracking identifies where metric data comes from, enabling AI systems to connect to data systems, verify data freshness, and understand data dependencies. Add a dataSource object (e.g., 'dataSource: { system: \"Google Analytics\", endpoint: \"/api/cart-analytics\", refreshFrequency: \"hourly\" }').",
      missingDataSourceSystem: "Metric '{{name}}' has a dataSource but is missing the 'system' field. The system field identifies which system provides the metric data. Add a system field to the dataSource object (e.g., 'system: \"Google Analytics\"').",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const decorators = getAabhaDecorators(node);
        if (decorators.length === 0) return;

        for (const decorator of decorators) {
          // Only apply to Metric decorators
          if (decorator.type !== 'Metric') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const dataSource = decorator.metadata.dataSource as Record<string, unknown> | undefined;

          if (!dataSource) {
            context.report({
              node: decorator.node,
              messageId: 'missingDataSource',
              data: {
                name: name || 'Unnamed metric',
              },
            });
          } else if (!dataSource.system) {
            context.report({
              node: decorator.node,
              messageId: 'missingDataSourceSystem',
              data: {
                name: name || 'Unnamed metric',
              },
            });
          }
        }
      },
    };
  },
});
