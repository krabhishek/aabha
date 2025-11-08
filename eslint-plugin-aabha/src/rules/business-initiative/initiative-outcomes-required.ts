/**
 * Initiative Outcomes Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **outcomes** define the expected results and benefits
 * that a business initiative will deliver. Without outcomes, initiatives lack clear success
 * criteria and AI systems cannot understand what value the initiative provides or how to measure
 * its impact.
 *
 * Outcomes enable AI to:
 * 1. **Understand value** - Know what benefits the initiative delivers
 * 2. **Measure impact** - Understand how to evaluate initiative success
 * 3. **Generate reports** - Create summaries of initiative outcomes
 * 4. **Prioritize initiatives** - Help AI understand business value
 *
 * Missing outcomes mean AI systems can't understand initiative value or generate proper success
 * measurement code.
 *
 * **What it checks:**
 * - Initiative has `outcomes` field defined
 * - Outcomes array is not empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has outcomes
 * @BusinessInitiative({
 *   name: 'Instant Account Opening',
 *   outcomes: [
 *     'Customers can open accounts instantly via mobile app',
 *     'No branch visit required for account opening'
 *   ]
 * })
 *
 * // ❌ Bad - Missing outcomes
 * @BusinessInitiative({
 *   name: 'Instant Account Opening'
 *   // Missing outcomes - AI can't understand value
 * })
 * ```
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingOutcomes' | 'emptyOutcomes';

export const initiativeOutcomesRequired = createRule<[], MessageIds>({
  name: 'initiative-outcomes-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Business initiatives should have an outcomes field. Outcomes define the expected results and benefits that the initiative will deliver, providing clear success criteria.',
    },
    messages: {
      missingOutcomes:
        "Initiative '{{name}}' is missing an 'outcomes' field. Outcomes define the expected results and benefits that the initiative will deliver, providing clear success criteria. Add an outcomes array with specific expected results (e.g., 'outcomes: [\"Customers can open accounts instantly\", \"No branch visit required\"]').",
      emptyOutcomes:
        "Initiative '{{name}}' has an outcomes field but it's empty. Outcomes should contain specific expected results and benefits that define what value the initiative delivers. Add at least one outcome to the array.",
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
          if (decorator.type !== 'BusinessInitiative') continue;

          const name = decorator.metadata.name as string | undefined;
          const outcomes = decorator.metadata.outcomes;

          // Check if outcomes is missing
          if (!outcomes) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if outcomes already exists in source to avoid duplicates
            if (source.includes('outcomes:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingOutcomes',
              data: { name: name || 'Unnamed initiative' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if outcomes already exists in source to avoid duplicates
                if (source.includes('outcomes:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const outcomesTemplate = needsComma
                  ? `,\n  outcomes: [\n    // TODO: Add expected results and benefits\n  ]`
                  : `\n  outcomes: [\n    // TODO: Add expected results and benefits\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  outcomesTemplate
                );
              },
            });
            continue;
          }

          // Check if outcomes is empty array
          if (Array.isArray(outcomes) && outcomes.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyOutcomes',
              data: { name: name || 'Unnamed initiative' },
            });
          }
        }
      },
    };
  },
});

