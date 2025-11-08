/**
 * Initiative Objectives Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **objectives** define the specific goals that a business
 * initiative aims to achieve. Without objectives, initiatives lack clear direction and AI systems
 * cannot understand what success looks like or generate appropriate tracking and monitoring code.
 *
 * Objectives enable AI to:
 * 1. **Understand goals** - Know what the initiative is trying to achieve
 * 2. **Generate tracking code** - Create monitoring for objective progress
 * 3. **Measure success** - Understand how to evaluate initiative outcomes
 * 4. **Prioritize work** - Help AI understand which features matter most
 *
 * Missing objectives mean AI systems can't understand initiative goals or generate proper success
 * measurement code.
 *
 * **What it checks:**
 * - Initiative has `objectives` field defined
 * - Objectives array is not empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has objectives
 * @BusinessInitiative({
 *   name: 'Instant Account Opening',
 *   objectives: [
 *     'Reduce account opening time from 5 days to < 5 minutes',
 *     'Enable 100% digital account opening process'
 *   ]
 * })
 *
 * // ❌ Bad - Missing objectives
 * @BusinessInitiative({
 *   name: 'Instant Account Opening'
 *   // Missing objectives - AI can't understand goals
 * })
 * ```
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingObjectives' | 'emptyObjectives';

export const initiativeObjectivesRequired = createRule<[], MessageIds>({
  name: 'initiative-objectives-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Business initiatives should have an objectives field. Objectives define the specific goals that the initiative aims to achieve, providing clear direction for implementation and success measurement.',
    },
    messages: {
      missingObjectives:
        "Initiative '{{name}}' is missing an 'objectives' field. Objectives define the specific goals that the initiative aims to achieve, providing clear direction for implementation and success measurement. Add an objectives array with specific, measurable goals (e.g., 'objectives: [\"Reduce account opening time by 50%\", \"Improve customer satisfaction to 4.5/5\"]').",
      emptyObjectives:
        "Initiative '{{name}}' has an objectives field but it's empty. Objectives should contain specific, measurable goals that define what the initiative aims to achieve. Add at least one objective to the array.",
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
          const objectives = decorator.metadata.objectives;

          // Check if objectives is missing
          if (!objectives) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if objectives already exists in source to avoid duplicates
            if (source.includes('objectives:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingObjectives',
              data: { name: name || 'Unnamed initiative' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if objectives already exists in source to avoid duplicates
                if (source.includes('objectives:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const objectivesTemplate = needsComma
                  ? `,\n  objectives: [\n    // TODO: Add specific, measurable goals\n  ]`
                  : `\n  objectives: [\n    // TODO: Add specific, measurable goals\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  objectivesTemplate
                );
              },
            });
            continue;
          }

          // Check if objectives is empty array
          if (Array.isArray(objectives) && objectives.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyObjectives',
              data: { name: name || 'Unnamed initiative' },
            });
          }
        }
      },
    };
  },
});

