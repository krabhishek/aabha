/**
 * Metric Threshold Ordering Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **threshold ordering** must align with the metric's direction
 * of improvement. For "higher-is-better" metrics, thresholds should be ordered: critical < warning < healthy.
 * For "lower-is-better" metrics, thresholds should be ordered: critical > warning > healthy.
 * Incorrect ordering creates confusion about metric health and prevents AI from correctly interpreting status.
 *
 * Correct threshold ordering enables AI to:
 * 1. **Interpret metric health** - Know which threshold range indicates good/bad status
 * 2. **Generate alerts** - Trigger alerts when metrics cross thresholds
 * 3. **Create dashboards** - Color-code metrics based on threshold ranges
 * 4. **Track trends** - Understand if metrics are improving or declining
 *
 * Incorrect ordering means AI can't correctly interpret metric status or generate accurate alerts.
 *
 * **What it checks:**
 * - For "higher-is-better" metrics: critical < warning < healthy
 * - For "lower-is-better" metrics: critical > warning > healthy
 * - Threshold values are logically ordered
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Correct ordering for higher-is-better
 * @Metric({
 *   name: 'Net Promoter Score',
 *   direction: 'higher-is-better',
 *   thresholds: {
 *     critical: 30,   // < warning < healthy ✓
 *     warning: 50,
 *     healthy: 65
 *   }
 * })
 * export class NPSMetric {}
 *
 * // ✅ Good - Correct ordering for lower-is-better
 * @Metric({
 *   name: 'Customer Effort Score',
 *   direction: 'lower-is-better',
 *   thresholds: {
 *     critical: 3.0,  // > warning > healthy ✓
 *     warning: 2.5,
 *     healthy: 2.0
 *   }
 * })
 * export class CESMetric {}
 *
 * // ❌ Bad - Incorrect ordering
 * @Metric({
 *   name: 'Net Promoter Score',
 *   direction: 'higher-is-better',
 *   thresholds: {
 *     critical: 65,   // Should be < warning < healthy ✗
 *     warning: 50,
 *     healthy: 30
 *   }
 * })
 * export class NPSMetric {}
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'thresholdsMisorderedHigher' | 'thresholdsMisorderedLower';

export const metricThresholdOrdering = createRule<[], MessageIds>({
  name: 'metric-threshold-ordering',
  meta: {
    type: 'problem',
    docs: {
      description: 'Metric thresholds should be ordered correctly based on the direction of improvement',
    },
    messages: {
      thresholdsMisorderedHigher: "Metric '{{name}}' has direction 'higher-is-better' but thresholds are incorrectly ordered. For higher-is-better metrics, thresholds should be: critical < warning < healthy. Current values: critical={{critical}}, warning={{warning}}, healthy={{healthy}}. Reorder thresholds so critical is the lowest value and healthy is the highest.",
      thresholdsMisorderedLower: "Metric '{{name}}' has direction 'lower-is-better' but thresholds are incorrectly ordered. For lower-is-better metrics, thresholds should be: critical > warning > healthy. Current values: critical={{critical}}, warning={{warning}}, healthy={{healthy}}. Reorder thresholds so critical is the highest value and healthy is the lowest.",
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
          const direction = decorator.metadata.direction as string | undefined;
          const thresholds = decorator.metadata.thresholds as Record<string, number> | undefined;

          if (!direction || !thresholds) continue;

          const critical = thresholds.critical;
          const warning = thresholds.warning;
          const healthy = thresholds.healthy;

          // Need all three thresholds to check ordering
          if (critical === undefined || warning === undefined || healthy === undefined) {
            continue;
          }

          const directionLower = direction.toLowerCase();
          const isHigherIsBetter = directionLower.includes('higher') || directionLower === 'higher-is-better';
          const isLowerIsBetter = directionLower.includes('lower') || directionLower === 'lower-is-better';

          if (isHigherIsBetter) {
            // For higher-is-better: critical < warning < healthy
            if (!(critical < warning && warning < healthy)) {
              context.report({
                node: decorator.node,
                messageId: 'thresholdsMisorderedHigher',
                data: {
                  name: name || 'Unnamed metric',
                  critical,
                  warning,
                  healthy,
                },
              });
            }
          } else if (isLowerIsBetter) {
            // For lower-is-better: critical > warning > healthy
            if (!(critical > warning && warning > healthy)) {
              context.report({
                node: decorator.node,
                messageId: 'thresholdsMisorderedLower',
                data: {
                  name: name || 'Unnamed metric',
                  critical,
                  warning,
                  healthy,
                },
              });
            }
          }
        }
      },
    };
  },
});
