/**
 * Strategy Metrics Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's strategic framework, **metrics** are essential for measuring strategy success.
 * Strategies without metrics are incomplete - they define goals but provide no way to measure
 * progress or success. Metrics enable AI systems to track strategy execution, generate progress
 * reports, and understand what success looks like.
 *
 * Metrics enable AI to:
 * 1. **Track progress** - Monitor strategy execution against defined metrics
 * 2. **Generate reports** - Create dashboards showing strategy performance
 * 3. **Understand success criteria** - Know what "winning" means for this strategy
 * 4. **Make recommendations** - Suggest adjustments based on metric trends
 *
 * Missing metrics mean AI can't measure strategy success or generate meaningful insights.
 *
 * **What it checks:**
 * - Strategy decorators have a `metrics` field with at least one metric
 * - Metrics array is not empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Metrics specified
 * @Strategy({
 *   name: 'Digital Transformation',
 *   winningAspiration: 'Be the #1 digital bank',
 *   metrics: [NetPromoterScore, CustomerSatisfactionMetric]
 * })
 * export class DigitalTransformationStrategy {}
 *
 * // ❌ Bad - Missing metrics
 * @Strategy({
 *   name: 'Digital Transformation',
 *   winningAspiration: 'Be the #1 digital bank'
 *   // Missing metrics - how will we measure success?
 * })
 * export class DigitalTransformationStrategy {}
 * ```
 *
 * @category strategy
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingMetrics' | 'emptyMetrics';

export const strategyMetricsRequired = createRule<[], MessageIds>({
  name: 'strategy-metrics-required',
  meta: {
    type: 'problem',
    docs: {
      description: 'Strategies must define metrics to measure success and enable progress tracking',
    },
    messages: {
      missingMetrics: "Strategy '{{name}}' is missing a 'metrics' field. Strategies without metrics can't be measured or tracked. Metrics define what success looks like and enable AI systems to generate progress reports and recommendations. Add a metrics array with at least one @Metric reference (e.g., 'metrics: [NetPromoterScore, CustomerSatisfactionMetric]').",
      emptyMetrics: "Strategy '{{name}}' has an empty metrics array. Strategies need at least one metric to measure success. Add at least one @Metric reference to enable progress tracking and success measurement.",
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
          // Only apply to Strategy decorators
          if (decorator.type !== 'Strategy') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const metrics = decorator.metadata.metrics;

          // Check if metrics is missing
          if (!metrics) {
            context.report({
              node: decorator.node,
              messageId: 'missingMetrics',
              data: {
                name: name || 'Unnamed strategy',
              },
            });
            continue;
          }

          // Check if metrics is an empty array
          if (Array.isArray(metrics) && metrics.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyMetrics',
              data: {
                name: name || 'Unnamed strategy',
              },
            });
          }
        }
      },
    };
  },
});
