/**
 * Metric Goal Context Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **goal context** provides strategic context for metrics,
 * explaining why they matter and how they align with business strategy. Metrics without
 * goal context are just numbers - AI systems can't understand their strategic importance,
 * generate meaningful insights, or connect metrics to business outcomes.
 *
 * Goal context enables AI to:
 * 1. **Understand strategic importance** - Know why metrics matter to the business
 * 2. **Generate insights** - Create meaningful interpretations of metric values
 * 3. **Connect to strategy** - Link metrics to strategic goals and initiatives
 * 4. **Prioritize actions** - Understand which metrics need attention
 *
 * Missing goal context means AI can't understand metric strategic importance or generate meaningful insights.
 *
 * **What it checks:**
 * - Metric decorators have a `goal` field
 * - Goal has a `goal` property (the strategic purpose)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Goal context specified
 * @Metric({
 *   name: 'Net Promoter Score',
 *   goal: {
 *     goal: 'Increase from #2 to #1 in customer satisfaction in Genai',
 *     backstory: 'Current NPS is 48, up from 42 last quarter',
 *     businessValue: 'Higher NPS correlates with 25% lower churn',
 *     strategicAlignment: ['Customer Experience Excellence']
 *   }
 * })
 * export class NPSMetric {}
 *
 * // ❌ Bad - Missing goal context
 * @Metric({
 *   name: 'Net Promoter Score'
 *   // Missing goal - why does this metric matter?
 * })
 * export class NPSMetric {}
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingGoal' | 'missingGoalPurpose';

export const metricGoalContext = createRule<[], MessageIds>({
  name: 'metric-goal-context',
  meta: {
    type: 'problem',
    docs: {
      description: 'Metrics should have goal context to explain strategic importance and business value',
    },
    messages: {
      missingGoal: "Metric '{{name}}' is missing a 'goal' field. Goal context provides strategic context for metrics, explaining why they matter and how they align with business strategy. Add a goal object (e.g., 'goal: { goal: \"Increase customer satisfaction\", businessValue: \"Higher satisfaction correlates with lower churn\", strategicAlignment: [\"Customer Experience\"] }').",
      missingGoalPurpose: "Metric '{{name}}' has a goal but is missing the 'goal' property. The goal property describes the strategic purpose of the metric. Add a goal property to the goal object (e.g., 'goal: \"Increase customer satisfaction\"').",
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
          const goal = decorator.metadata.goal as Record<string, unknown> | undefined;

          if (!goal) {
            context.report({
              node: decorator.node,
              messageId: 'missingGoal',
              data: {
                name: name || 'Unnamed metric',
              },
            });
          } else if (!goal.goal) {
            context.report({
              node: decorator.node,
              messageId: 'missingGoalPurpose',
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
