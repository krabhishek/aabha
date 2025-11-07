/**
 * Metric Baseline Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **baseline values** are essential for measuring progress and
 * understanding improvement. Metrics without baselines can't show improvement over time or
 * calculate progress toward targets. AI systems need baselines to generate progress reports,
 * calculate improvement percentages, and understand metric trends.
 *
 * Baselines enable AI to:
 * 1. **Calculate progress** - Measure improvement from baseline to current value
 * 2. **Generate reports** - Show progress over time with baseline as starting point
 * 3. **Understand trends** - Identify if metrics are improving, declining, or stable
 * 4. **Set realistic targets** - Understand the gap between baseline and target
 *
 * Missing baselines mean AI can't measure progress or generate meaningful metric insights.
 *
 * **What it checks:**
 * - Metric decorators have a `baseline` field (starting point value)
 * - Baseline is a number (not undefined or null)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Baseline specified
 * @Metric({
 *   name: 'Net Promoter Score',
 *   category: MetricCategory.Customer,
 *   baseline: 42,
 *   currentValue: 50,
 *   target: 65
 * })
 * export class NPSMetric {}
 *
 * // ❌ Bad - Missing baseline
 * @Metric({
 *   name: 'Net Promoter Score',
 *   category: MetricCategory.Customer,
 *   currentValue: 50,
 *   target: 65
 *   // Missing baseline - can't measure progress
 * })
 * export class NPSMetric {}
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingBaseline';

export const metricBaselineRequired = createRule<[], MessageIds>({
  name: 'metric-baseline-required',
  meta: {
    type: 'problem',
    docs: {
      description: 'Metrics should have baseline values to enable progress measurement and trend analysis',
    },
    messages: {
      missingBaseline: "Metric '{{name}}' is missing a 'baseline' field. Baselines are essential for measuring progress and understanding improvement over time. Without a baseline, AI systems can't calculate progress percentages, generate trend reports, or understand if metrics are improving. Add a baseline field with the starting point value (e.g., 'baseline: 42' for a metric starting at 42).",
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
          const baseline = decorator.metadata.baseline;

          // Check if baseline is missing
          if (baseline === undefined || baseline === null) {
            context.report({
              node: decorator.node,
              messageId: 'missingBaseline',
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
