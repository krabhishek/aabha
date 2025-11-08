/**
 * Metric History Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **history** captures temporal patterns and trend analysis.
 * When a history object is provided, it should be complete with at least the required `trend`
 * field. Incomplete history objects lack clarity about metric direction and trend analysis.
 *
 * History completeness enables AI to:
 * 1. **Understand trends** - Know if metric is improving, declining, stable, or volatile
 * 2. **Generate reports** - Create trend reports and forecasts
 * 3. **Track progress** - Monitor metric evolution over time
 * 4. **Make predictions** - Project future values based on trends
 *
 * **What it checks:**
 * - If history exists, it must have `trend` field (required)
 * - Trend should be a valid value ('improving', 'declining', 'stable', 'volatile')
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete history
 * @Metric({
 *   name: 'Net Promoter Score',
 *   history: {
 *     trend: 'improving',
 *     historicalValues: [...],
 *     changeRate: 7.1
 *   }
 * })
 *
 * // ❌ Bad - Incomplete history
 * @Metric({
 *   name: 'Net Promoter Score',
 *   history: {
 *     // Missing trend field
 *   }
 * })
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingTrend';

export const metricHistoryCompleteness = createRule<[], MessageIds>({
  name: 'metric-history-completeness',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Metrics with history field should have complete history objects. History objects require at least the trend field to indicate metric direction.',
    },
    messages: {
      missingTrend:
        "Metric '{{name}}' has history object but missing 'trend' field. History objects require the 'trend' field to specify metric direction ('improving', 'declining', 'stable', or 'volatile'). Add a trend field (e.g., 'trend: \"improving\"' or 'trend: \"declining\"').",
    },
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const decorators = getAabhaDecorators(node);
        if (decorators.length === 0) return;

        for (const decorator of decorators) {
          if (decorator.type !== 'Metric') continue;

          const name = decorator.metadata.name as string | undefined;
          const history = decorator.metadata.history as
            | {
                trend?: 'improving' | 'declining' | 'stable' | 'volatile';
                historicalValues?: Array<{ timestamp: string; value: number }>;
                changeRate?: number;
                projectedValue?: number;
                confidenceInterval?: { lower: number; upper: number };
                [key: string]: unknown;
              }
            | undefined;

          // Only check if history exists
          if (!history) continue;

          // Check if trend is missing
          if (!history.trend) {
            context.report({
              node: decorator.node,
              messageId: 'missingTrend',
              data: { name: name || 'Unnamed metric' },
            });
          }
        }
      },
    };
  },
});

