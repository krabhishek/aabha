/**
 * Journey Metrics Relevant Rule
 *
 * **Why this rule exists:**
 * Journeys represent critical business flows that need measurement to track success, identify
 * bottlenecks, and drive improvements. Without metrics, teams cannot assess journey performance,
 * user experience, or business impact. Every journey should have relevant metrics to measure outcomes.
 *
 * Missing metrics cause:
 * - **Blind optimization** - Cannot measure what to improve
 * - **Success ambiguity** - Unclear if journey achieves business goals
 * - **No data-driven decisions** - Cannot validate improvements
 * - **Accountability gaps** - No way to track journey performance
 *
 * Proper metrics enable:
 * 1. **Performance tracking** - Measure completion rates, duration, success
 * 2. **Bottleneck identification** - Find where users drop off or struggle
 * 3. **Business impact** - Link journey to revenue, satisfaction, retention
 * 4. **Continuous improvement** - Data-driven optimization
 *
 * **What it checks:**
 * - Journey has metrics array with at least one Metric
 * - Metrics are defined to measure journey success and performance
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Journey with relevant metrics
 * @Journey({
 *   name: 'Account Opening',
 *   primaryStakeholder: CustomerStakeholder,
 *   actions: [EnterEmailPasswordAction, VerifyEmailAction],
 *   entryActions: [EnterEmailPasswordAction],
 *   metrics: [
 *     AccountOpeningCompletionRateMetric,
 *     AccountOpeningDurationMetric,
 *     VerificationSuccessRateMetric
 *   ]
 * })
 *
 * // ❌ Bad - Journey without metrics
 * @Journey({
 *   name: 'Account Opening',
 *   primaryStakeholder: CustomerStakeholder,
 *   actions: [EnterEmailPasswordAction, VerifyEmailAction],
 *   entryActions: [EnterEmailPasswordAction]
 *   // Missing metrics - how do we measure success?
 * })
 * ```
 *
 * @category journey
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingMetrics';

export const journeyMetricsRelevant = createRule<[], MessageIds>({
  name: 'journey-metrics-relevant',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Journeys should have metrics to measure success and performance. In context engineering, metrics enable data-driven optimization and track business impact.',
    },
    messages: {
      missingMetrics:
        "Journey '{{journeyName}}' has no metrics defined. In context engineering, every journey should have metrics to measure success, performance, and business impact. Add metrics array with relevant Metrics. Common journey metrics: completion rate, duration, drop-off points, user satisfaction, business conversion. Example: metrics: [AccountOpeningCompletionRateMetric, AccountOpeningDurationMetric]. Without metrics, teams cannot optimize journey or measure business value.",
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
          if (decorator.type !== 'Journey') continue;

          const journeyName = decorator.metadata.name as string | undefined;
          const metrics = decorator.metadata.metrics as unknown[] | undefined;

          // Check for missing or empty metrics
          if (!metrics || metrics.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'missingMetrics',
              data: {
                journeyName: journeyName || 'Unknown',
              },
            });
          }
        }
      },
    };
  },
});
