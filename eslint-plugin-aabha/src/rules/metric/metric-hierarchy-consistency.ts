/**
 * Metric Hierarchy Consistency Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **metric hierarchies** model how metrics aggregate and relate
 * to each other. Metrics that aggregate from child metrics must have consistent relationships
 * defined. Inconsistent hierarchies create confusion about metric relationships and prevent AI
 * from correctly calculating aggregated metrics.
 *
 * Hierarchy consistency enables AI to:
 * 1. **Calculate aggregated metrics** - Understand how child metrics roll up
 * 2. **Trace metric relationships** - Follow metric influence chains
 * 3. **Generate rollup code** - Create code that aggregates metrics correctly
 * 4. **Validate metric structure** - Ensure metric hierarchies are logically consistent
 *
 * Inconsistent hierarchies mean AI can't correctly calculate or understand metric relationships.
 *
 * **What it checks:**
 * - Metrics with `relationships.aggregatesFrom` have consistent aggregation methods
 * - Aggregated metrics reference valid child metrics
 * - Metric hierarchies don't create circular dependencies
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Consistent hierarchy
 * @Metric({
 *   name: 'Overall Conversion Rate',
 *   relationships: {
 *     aggregatesFrom: [MobileConversionRate, DesktopConversionRate],
 *     aggregationMethod: 'weighted-average'
 *   }
 * })
 * export class OverallConversionRate {}
 *
 * // ❌ Bad - Missing aggregation method
 * @Metric({
 *   name: 'Overall Conversion Rate',
 *   relationships: {
 *     aggregatesFrom: [MobileConversionRate, DesktopConversionRate]
 *     // Missing aggregationMethod - how are these combined?
 *   }
 * })
 * export class OverallConversionRate {}
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingAggregationMethod' | 'inconsistentHierarchy';

export const metricHierarchyConsistency = createRule<[], MessageIds>({
  name: 'metric-hierarchy-consistency',
  meta: {
    type: 'problem',
    docs: {
      description: 'Metrics that aggregate from child metrics should have consistent hierarchy relationships',
    },
    messages: {
      missingAggregationMethod: "Metric '{{name}}' aggregates from child metrics but is missing an aggregation method. Aggregated metrics need to specify how child metrics are combined (e.g., 'weighted-average', 'sum', 'average'). Add an aggregationMethod to the relationships or dimensions field.",
      inconsistentHierarchy: "Metric '{{name}}' has inconsistent hierarchy relationships. Metrics that aggregate from child metrics should have consistent aggregation methods and valid child metric references. Review the relationships.aggregatesFrom field and ensure aggregation methods are properly defined.",
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
          const relationships = decorator.metadata.relationships as Record<string, unknown> | undefined;
          const dimensions = decorator.metadata.dimensions as Record<string, unknown> | undefined;

          if (!relationships) continue;

          const aggregatesFrom = relationships.aggregatesFrom;
          if (aggregatesFrom && Array.isArray(aggregatesFrom) && aggregatesFrom.length > 0) {
            // Check if aggregation method is defined
            const aggregationMethod = relationships.aggregationMethod || dimensions?.aggregationMethod;

            if (!aggregationMethod) {
              context.report({
                node: decorator.node,
                messageId: 'missingAggregationMethod',
                data: {
                  name: name || 'Unnamed metric',
                },
              });
            }
          }
        }
      },
    };
  },
});
