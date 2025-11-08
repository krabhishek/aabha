/**
 * Strategy Objectives Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's strategic framework, **objectives** are strategic objectives to achieve within the time horizon.
 * Objectives translate the strategy into concrete, measurable goals. Without objectives, strategies remain
 * abstract and teams cannot track progress or measure success.
 *
 * Objectives enable AI to:
 * 1. **Track progress** - Monitor progress toward strategic objectives
 * 2. **Measure success** - Know if strategy is achieving its objectives
 * 3. **Plan execution** - Break down strategy into actionable objectives
 * 4. **Generate reports** - Create progress reports on objective achievement
 *
 * **What it checks:**
 * - Strategy has `objectives` field defined
 * - Objectives array is not empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has objectives
 * @Strategy({
 *   name: 'Digital Transformation',
 *   objectives: [
 *     'Achieve 1M active users by Q4 2025',
 *     'Launch in 5 major cities',
 *     'Break even by end of 2026'
 *   ]
 * })
 *
 * // ❌ Bad - Missing objectives
 * @Strategy({
 *   name: 'Digital Transformation'
 *   // Missing objectives
 * })
 * ```
 *
 * @category strategy
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingObjectives' | 'emptyObjectives';

export const strategyObjectivesRequired = createRule<[], MessageIds>({
  name: 'strategy-objectives-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Strategies should have objectives field. Objectives are strategic goals to achieve within the time horizon, translating strategy into concrete, measurable goals.',
    },
    messages: {
      missingObjectives:
        "Strategy '{{name}}' is missing an 'objectives' field. Objectives are strategic objectives to achieve within the time horizon. Objectives translate the strategy into concrete, measurable goals. Without objectives, strategies remain abstract and teams cannot track progress. Add an objectives array with strategic goals (e.g., 'objectives: [\"Achieve 1M active users by Q4 2025\", \"Launch in 5 major cities\"]').",
      emptyObjectives:
        "Strategy '{{name}}' has an objectives field but it's empty. Objectives should be meaningful and translate the strategy into concrete, measurable goals. Add meaningful objectives that can be tracked and measured.",
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
          const objectives = decorator.metadata.objectives as string[] | undefined;

          // Check if objectives is missing
          if (!objectives) {
            context.report({
              node: decorator.node,
              messageId: 'missingObjectives',
              data: { name: name || 'Unnamed strategy' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if objectives already exists in source to avoid duplicates
                if (source.includes('objectives:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const objectivesTemplate = `,\n  objectives: [\n    '', // TODO: Strategic objectives to achieve within the time horizon\n    '' // TODO: Add more objectives (e.g., 'Achieve 1M active users by Q4 2025')\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  objectivesTemplate,
                );
              },
            });
            continue;
          }

          // Check if objectives is empty
          if (objectives.length === 0 || objectives.every((o) => typeof o === 'string' && o.trim().length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'emptyObjectives',
              data: { name: name || 'Unnamed strategy' },
            });
          }
        }
      },
    };
  },
});

