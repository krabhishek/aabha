/**
 * Metric Goal Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **goal** captures the strategic purpose and context of a metric.
 * When a goal object is provided, it should be complete with at least the required `goal` field
 * (strategic purpose). Incomplete goal objects lack clarity about why the metric matters and
 * what it aims to achieve.
 *
 * Goal completeness enables AI to:
 * 1. **Understand purpose** - Know why the metric matters strategically
 * 2. **Generate context** - Create strategic context for metric reports
 * 3. **Link to strategy** - Connect metrics to strategic initiatives
 * 4. **Communicate value** - Explain business value of metric improvements
 *
 * **What it checks:**
 * - If goal exists, it must have `goal` field (required)
 * - Goal.goal should not be empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete goal
 * @Metric({
 *   name: 'Net Promoter Score',
 *   goal: {
 *     goal: 'Increase from #2 to #1 in customer satisfaction',
 *     backstory: 'Current NPS is 42, target is 65',
 *     businessValue: '25% lower churn'
 *   }
 * })
 *
 * // ❌ Bad - Incomplete goal
 * @Metric({
 *   name: 'Net Promoter Score',
 *   goal: {
 *     // Missing goal field
 *   }
 * })
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingGoalPurpose' | 'emptyGoalPurpose';

export const metricGoalCompleteness = createRule<[], MessageIds>({
  name: 'metric-goal-completeness',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Metrics with goal field should have complete goal objects. Goal objects require at least the goal field (strategic purpose) to be meaningful.',
    },
    messages: {
      missingGoalPurpose:
        "Metric '{{name}}' has goal object but missing 'goal' field. Goal objects require the 'goal' field to specify the strategic purpose of the metric. Add a goal field (e.g., 'goal: \"Increase from #2 to #1 in customer satisfaction\"').",
      emptyGoalPurpose:
        "Metric '{{name}}' has goal object with goal field but it's empty. Goal should be meaningful and specify the strategic purpose of the metric. Add a meaningful goal.",
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
          const goal = decorator.metadata.goal as
            | {
                goal?: string;
                backstory?: string;
                businessValue?: string;
                strategicAlignment?: string[];
                [key: string]: unknown;
              }
            | undefined;

          // Only check if goal exists
          if (!goal) continue;

          // Check if goal.goal is missing
          if (!goal.goal) {
            context.report({
              node: decorator.node,
              messageId: 'missingGoalPurpose',
              data: { name: name || 'Unnamed metric' },
            });
            continue;
          }

          // Check if goal.goal is empty
          if (typeof goal.goal === 'string' && goal.goal.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyGoalPurpose',
              data: { name: name || 'Unnamed metric' },
            });
          }
        }
      },
    };
  },
});

