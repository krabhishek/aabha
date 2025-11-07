/**
 * Metric Target Alignment Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **target values** must align with the metric's direction of
 * improvement. For "higher-is-better" metrics, targets should be greater than baseline/current.
 * For "lower-is-better" metrics, targets should be less than baseline/current. Misaligned targets
 * create confusion and prevent AI systems from correctly interpreting metric health.
 *
 * Target alignment enables AI to:
 * 1. **Interpret metric health** - Know if current value is good or bad relative to target
 * 2. **Calculate progress** - Understand if progress is toward or away from target
 * 3. **Generate alerts** - Identify when metrics are moving in wrong direction
 * 4. **Set realistic goals** - Ensure targets are achievable based on direction
 *
 * Misaligned targets mean AI can't correctly interpret metric status or generate accurate reports.
 *
 * **What it checks:**
 * - For "higher-is-better" metrics: target > baseline (if baseline exists)
 * - For "lower-is-better" metrics: target < baseline (if baseline exists)
 * - Target direction aligns with metric direction
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Target aligned with direction
 * @Metric({
 *   name: 'Net Promoter Score',
 *   direction: 'higher-is-better',
 *   baseline: 42,
 *   target: 65  // Target > baseline ✓
 * })
 * export class NPSMetric {}
 *
 * @Metric({
 *   name: 'Customer Effort Score',
 *   direction: 'lower-is-better',
 *   baseline: 3.2,
 *   target: 1.8  // Target < baseline ✓
 * })
 * export class CESMetric {}
 *
 * // ❌ Bad - Target misaligned with direction
 * @Metric({
 *   name: 'Net Promoter Score',
 *   direction: 'higher-is-better',
 *   baseline: 42,
 *   target: 30  // Target < baseline but direction is higher-is-better ✗
 * })
 * export class NPSMetric {}
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'targetMisalignedHigher' | 'targetMisalignedLower';

export const metricTargetAlignment = createRule<[], MessageIds>({
  name: 'metric-target-alignment',
  meta: {
    type: 'problem',
    docs: {
      description: 'Metric targets should align with the direction of improvement (higher-is-better vs lower-is-better)',
    },
    messages: {
      targetMisalignedHigher: "Metric '{{name}}' has direction 'higher-is-better' but target ({{target}}) is less than or equal to baseline ({{baseline}}). For higher-is-better metrics, targets should be greater than baseline to represent improvement. Update the target to be greater than {{baseline}}, or change the direction if this metric should decrease.",
      targetMisalignedLower: "Metric '{{name}}' has direction 'lower-is-better' but target ({{target}}) is greater than or equal to baseline ({{baseline}}). For lower-is-better metrics, targets should be less than baseline to represent improvement. Update the target to be less than {{baseline}}, or change the direction if this metric should increase.",
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
          const baseline = decorator.metadata.baseline as number | undefined;
          const target = decorator.metadata.target as number | undefined;

          // Need direction, baseline, and target to check alignment
          if (!direction || baseline === undefined || target === undefined) {
            continue;
          }

          const directionLower = direction.toLowerCase();
          const isHigherIsBetter = directionLower.includes('higher') || directionLower === 'higher-is-better';
          const isLowerIsBetter = directionLower.includes('lower') || directionLower === 'lower-is-better';

          if (isHigherIsBetter && target <= baseline) {
            context.report({
              node: decorator.node,
              messageId: 'targetMisalignedHigher',
              data: {
                name: name || 'Unnamed metric',
                target,
                baseline,
              },
            });
          } else if (isLowerIsBetter && target >= baseline) {
            context.report({
              node: decorator.node,
              messageId: 'targetMisalignedLower',
              data: {
                name: name || 'Unnamed metric',
                target,
                baseline,
              },
            });
          }
        }
      },
    };
  },
});
