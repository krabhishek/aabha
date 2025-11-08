/**
 * Strategy Time Horizon Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's strategic framework, **time horizon** defines the timeframe for the strategy (e.g., "2025-2027",
 * "3 years"). Time horizons help teams understand strategy duration, plan execution, and set expectations.
 * Without a time horizon, strategies lack temporal boundaries and teams cannot plan effectively.
 *
 * Time horizon enables AI to:
 * 1. **Plan execution** - Understand strategy duration and timeline
 * 2. **Set expectations** - Know when strategy should be achieved
 * 3. **Track progress** - Monitor progress against time horizon
 * 4. **Schedule reviews** - Plan strategy reviews within time horizon
 *
 * **What it checks:**
 * - Strategy has `timeHorizon` field defined
 * - Time horizon is meaningful (not empty)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has time horizon
 * @Strategy({
 *   name: 'Digital Transformation',
 *   timeHorizon: '2024-2027'
 * })
 *
 * // ❌ Bad - Missing time horizon
 * @Strategy({
 *   name: 'Digital Transformation'
 *   // Missing timeHorizon
 * })
 * ```
 *
 * @category strategy
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingTimeHorizon' | 'emptyTimeHorizon';

export const strategyTimeHorizonRequired = createRule<[], MessageIds>({
  name: 'strategy-time-horizon-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Strategies should have timeHorizon field. Time horizon defines the timeframe for the strategy, helping teams plan execution and set expectations.',
    },
    messages: {
      missingTimeHorizon:
        "Strategy '{{name}}' is missing a 'timeHorizon' field. Time horizon defines the timeframe for the strategy (e.g., '2025-2027', '3 years'). Time horizons help teams understand strategy duration, plan execution, and set expectations. Add a timeHorizon field (e.g., 'timeHorizon: \"2024-2027\"' or 'timeHorizon: \"3 years\"').",
      emptyTimeHorizon:
        "Strategy '{{name}}' has a timeHorizon field but it's empty. Time horizon should be meaningful and define the timeframe for the strategy. Add a meaningful time horizon.",
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
          if (decorator.type !== 'Strategy') continue;

          const name = decorator.metadata.name as string | undefined;
          const timeHorizon = decorator.metadata.timeHorizon as string | undefined;

          // Check if timeHorizon is missing
          if (!timeHorizon) {
            context.report({
              node: decorator.node,
              messageId: 'missingTimeHorizon',
              data: { name: name || 'Unnamed strategy' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if timeHorizon already exists in source to avoid duplicates
                if (source.includes('timeHorizon:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const timeHorizonTemplate = `,\n  timeHorizon: '',  // TODO: Timeframe for this strategy (e.g., '2024-2027', '3 years')`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  timeHorizonTemplate,
                );
              },
            });
            continue;
          }

          // Check if timeHorizon is empty
          if (typeof timeHorizon === 'string' && timeHorizon.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyTimeHorizon',
              data: { name: name || 'Unnamed strategy' },
            });
          }
        }
      },
    };
  },
});

