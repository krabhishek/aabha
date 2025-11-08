/**
 * Context Goals Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **goals** define what a context aims to achieve
 * organizationally. Goals are operational/organizational objectives (not journey goals) that
 * help teams understand context priorities and success criteria. Without goals, contexts lack
 * clear direction and teams cannot measure context effectiveness.
 *
 * Goals enable AI to:
 * 1. **Understand context priorities** - Know what the context is trying to achieve
 * 2. **Measure effectiveness** - Track progress toward organizational objectives
 * 3. **Align initiatives** - Ensure initiatives support context goals
 * 4. **Generate reports** - Create progress reports on goal achievement
 *
 * **What it checks:**
 * - Context has `goals` field defined
 * - Goals array is not empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has goals
 * @Context({
 *   name: 'Retail Banking',
 *   goals: [
 *     'Maintain 99.9% account system uptime',
 *     'Process account openings within 24 hours',
 *     'Achieve NPS > 60 for retail customers'
 *   ]
 * })
 *
 * // ❌ Bad - Missing goals
 * @Context({
 *   name: 'Retail Banking'
 *   // Missing goals
 * })
 * ```
 *
 * @category context
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingGoals' | 'emptyGoals';

export const contextGoalsRequired = createRule<[], MessageIds>({
  name: 'context-goals-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Contexts should have goals field. Goals define what a context aims to achieve organizationally, helping teams understand context priorities and success criteria.',
    },
    messages: {
      missingGoals:
        "Context '{{name}}' is missing a 'goals' field. Goals define what a context aims to achieve organizationally (operational/organizational objectives, not journey goals). Without goals, contexts lack clear direction and teams cannot measure context effectiveness. Add a goals array with organizational objectives (e.g., 'goals: [\"Maintain 99.9% account system uptime\", \"Process account openings within 24 hours\"]').",
      emptyGoals:
        "Context '{{name}}' has a goals field but it's empty. Goals should be meaningful and describe organizational objectives the context aims to achieve. Add meaningful goals that can be tracked and measured.",
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
          if (decorator.type !== 'Context') continue;

          const name = decorator.metadata.name as string | undefined;
          const goals = decorator.metadata.goals as string[] | undefined;

          // Check if goals is missing
          if (!goals) {
            context.report({
              node: decorator.node,
              messageId: 'missingGoals',
              data: { name: name || 'Unnamed context' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if goals already exists in source to avoid duplicates
                if (source.includes('goals:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const goalsTemplate = `,\n  goals: [\n    '', // TODO: Organizational objectives this context aims to achieve\n    '' // TODO: Add more goals (e.g., 'Maintain 99.9% uptime', 'Process requests within SLA')\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  goalsTemplate,
                );
              },
            });
            continue;
          }

          // Check if goals is empty
          if (goals.length === 0 || goals.every((g) => typeof g === 'string' && g.trim().length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'emptyGoals',
              data: { name: name || 'Unnamed context' },
            });
          }
        }
      },
    };
  },
});

