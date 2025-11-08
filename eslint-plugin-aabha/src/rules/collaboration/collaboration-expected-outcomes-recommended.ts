/**
 * Collaboration Expected Outcomes Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **expectedOutcomes** define what should be achieved
 * or produced by a collaboration. Without expected outcomes, collaborations lack clear success
 * definitions and AI systems cannot determine when a collaboration is complete or generate
 * proper success measurement code.
 *
 * Expected outcomes enable AI to:
 * 1. **Measure success** - Know when collaboration goals are achieved
 * 2. **Generate monitoring** - Create code to track expected outcomes
 * 3. **Report status** - Determine collaboration completion status
 * 4. **Enable validation** - Verify collaboration outcomes
 *
 * Missing expected outcomes make it harder to determine collaboration success or completion.
 *
 * **What it checks:**
 * - Collaboration has `expectedOutcomes` field defined (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has expected outcomes
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting',
 *   expectedOutcomes: [
 *     {
 *       outcome: 'Investment decisions made',
 *       type: 'decision',
 *       responsibleParty: InvestorStakeholder
 *     }
 *   ]
 * })
 *
 * // ⚠️ Warning - Missing expected outcomes
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting'
 *   // Missing expectedOutcomes - unclear what should be achieved
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingExpectedOutcomes';

export const collaborationExpectedOutcomesRecommended = createRule<[], MessageIds>({
  name: 'collaboration-expected-outcomes-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Collaborations should have an expectedOutcomes field. Expected outcomes define what should be achieved or produced by the collaboration, enabling proper success measurement.',
    },
    messages: {
      missingExpectedOutcomes:
        "Collaboration '{{name}}' is missing an 'expectedOutcomes' field. Expected outcomes define what should be achieved or produced by the collaboration, enabling proper success measurement. Consider adding expectedOutcomes that define clear, measurable outcomes (e.g., 'expectedOutcomes: [{ outcome: \"Investment decisions made\", type: \"decision\" }]').",
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
          if (decorator.type !== 'Collaboration') continue;

          const name = decorator.metadata.name as string | undefined;
          const expectedOutcomes = decorator.metadata.expectedOutcomes;

          // Check if expectedOutcomes is missing
          if (!expectedOutcomes) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if expectedOutcomes already exists in source to avoid duplicates
            if (source.includes('expectedOutcomes:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingExpectedOutcomes',
              data: { name: name || 'Unnamed collaboration' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if expectedOutcomes already exists in source to avoid duplicates
                if (source.includes('expectedOutcomes:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const expectedOutcomesTemplate = needsComma
                  ? `,\n  expectedOutcomes: [\n    // TODO: Add expected outcomes with outcome, type, and optional responsibleParty\n  ]`
                  : `\n  expectedOutcomes: [\n    // TODO: Add expected outcomes with outcome, type, and optional responsibleParty\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  expectedOutcomesTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

