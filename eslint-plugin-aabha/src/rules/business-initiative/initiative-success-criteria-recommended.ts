/**
 * Initiative Success Criteria Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **successCriteria** define measurable conditions that
 * indicate when a business initiative has achieved its goals. Without success criteria, initiatives
 * lack clear success definitions and AI systems cannot determine when an initiative is complete or
 * generate proper success measurement code.
 *
 * Success criteria enable AI to:
 * 1. **Measure success** - Know when initiative goals are achieved
 * 2. **Generate monitoring** - Create code to track success criteria
 * 3. **Report status** - Determine initiative completion status
 * 4. **Enable validation** - Verify initiative outcomes
 *
 * Missing success criteria make it harder to determine initiative success or completion.
 *
 * **What it checks:**
 * - Initiative has `successCriteria` field defined (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has success criteria
 * @BusinessInitiative({
 *   name: 'Instant Account Opening',
 *   successCriteria: [
 *     'Account opening time < 5 minutes',
 *     'Conversion rate > 60%'
 *   ]
 * })
 *
 * // ⚠️ Warning - Missing success criteria
 * @BusinessInitiative({
 *   name: 'Instant Account Opening'
 *   // Missing success criteria - unclear when initiative is successful
 * })
 * ```
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingSuccessCriteria';

export const initiativeSuccessCriteriaRecommended = createRule<[], MessageIds>({
  name: 'initiative-success-criteria-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Business initiatives should have a successCriteria field. Success criteria define measurable conditions that indicate when the initiative has achieved its goals.',
    },
    messages: {
      missingSuccessCriteria:
        "Initiative '{{name}}' is missing a 'successCriteria' field. Success criteria define measurable conditions that indicate when the initiative has achieved its goals. Consider adding success criteria that define clear, measurable success conditions (e.g., 'successCriteria: [\"Account opening time < 5 minutes\", \"Conversion rate > 60%\"]').",
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
          const successCriteria = decorator.metadata.successCriteria;

          // Check if successCriteria is missing
          if (!successCriteria) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if successCriteria already exists in source to avoid duplicates
            if (source.includes('successCriteria:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingSuccessCriteria',
              data: { name: name || 'Unnamed initiative' },
                            fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if successCriteria already exists in source to avoid duplicates
                if (source.includes('successCriteria:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const successCriteriaTemplate = needsComma
                  ? `,\n  successCriteria: [],  // TODO: Add measurable success conditions`
                  : `\n  successCriteria: [],  // TODO: Add measurable success conditions`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  successCriteriaTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

