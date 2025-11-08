/**
 * Strategy Strategic Choices Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's strategic framework, **strategic choices** explicitly define what the strategy will
 * and won't do. Defining what you won't do is as important as defining what you will do - it creates
 * focus and prevents scope creep. Without strategic choices, strategies lack clarity about priorities
 * and trade-offs.
 *
 * Strategic choices enable AI to:
 * 1. **Understand focus areas** - Know what the strategy commits to doing
 * 2. **Identify trade-offs** - Understand what the strategy explicitly excludes
 * 3. **Prevent scope creep** - Keep strategies focused and aligned
 * 4. **Make decisions** - Help teams decide if initiatives align with strategy
 *
 * **What it checks:**
 * - Strategy has `strategicChoices` field defined
 * - Strategic choices include both `focus` and `deliberateExclusions`
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has strategic choices
 * @Strategy({
 *   name: 'Digital Transformation',
 *   strategicChoices: {
 *     focus: ['Mobile-first experience', 'Gen-Z customers'],
 *     deliberateExclusions: ['Branch expansion', 'Enterprise banking']
 *   }
 * })
 *
 * // ❌ Bad - Missing strategic choices
 * @Strategy({
 *   name: 'Digital Transformation'
 *   // Missing strategicChoices
 * })
 * ```
 *
 * @category strategy
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingStrategicChoices' | 'incompleteStrategicChoices';

export const strategyStrategicChoicesRequired = createRule<[], MessageIds>({
  name: 'strategy-strategic-choices-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Strategies should have strategicChoices field. Strategic choices explicitly define what the strategy will and won\'t do, creating focus and preventing scope creep.',
    },
    messages: {
      missingStrategicChoices:
        "Strategy '{{name}}' is missing a 'strategicChoices' field. Strategic choices explicitly define what the strategy will and won't do. Defining what you won't do is as important as defining what you will do - it creates focus and prevents scope creep. Add a strategicChoices object with 'focus' (what we commit to doing) and 'deliberateExclusions' (what we explicitly will NOT do).",
      incompleteStrategicChoices:
        "Strategy '{{name}}' has strategicChoices but missing key fields. Strategic choices should include both 'focus' (what we commit to doing) and 'deliberateExclusions' (what we explicitly will NOT do). Add missing fields: {{missingFields}}.",
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
          const strategicChoices = decorator.metadata.strategicChoices as
            | {
                focus?: string[];
                deliberateExclusions?: string[];
                [key: string]: unknown;
              }
            | undefined;

          // Check if strategicChoices is missing
          if (!strategicChoices) {
            context.report({
              node: decorator.node,
              messageId: 'missingStrategicChoices',
              data: { name: name || 'Unnamed strategy' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if strategicChoices already exists in source to avoid duplicates
                if (source.includes('strategicChoices:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const strategicChoicesTemplate = `,\n  strategicChoices: {\n    focus: [''],  // TODO: What we commit to doing - our strategic focus areas\n    deliberateExclusions: ['']  // TODO: What we explicitly will NOT do - our strategic trade-offs\n  }`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  strategicChoicesTemplate,
                );
              },
            });
            continue;
          }

          // Check for missing fields
          const missingFields: string[] = [];
          if (!strategicChoices.focus || strategicChoices.focus.length === 0) {
            missingFields.push('focus');
          }
          if (!strategicChoices.deliberateExclusions || strategicChoices.deliberateExclusions.length === 0) {
            missingFields.push('deliberateExclusions');
          }

          if (missingFields.length > 0) {
            context.report({
              node: decorator.node,
              messageId: 'incompleteStrategicChoices',
              data: {
                name: name || 'Unnamed strategy',
                missingFields: missingFields.join(', '),
              },
            });
          }
        }
      },
    };
  },
});

