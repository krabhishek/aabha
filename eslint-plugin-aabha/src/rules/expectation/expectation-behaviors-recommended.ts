/**
 * Expectation Behaviors Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **behaviors** define what implements an expectation.
 * While expectations model the contract between stakeholders, behaviors model the actual implementation
 * that fulfills that contract. Without behaviors, expectations are abstract contracts without clear
 * implementation guidance, making it difficult for AI systems to understand how expectations are
 * fulfilled or generate implementation code.
 *
 * Behaviors enable AI to:
 * 1. **Understand implementation** - Know what behaviors fulfill the expectation
 * 2. **Generate code** - AI can generate behavior implementations from expectations
 * 3. **Trace fulfillment** - Link expectations to their implementing behaviors
 * 4. **Enable reusability** - Behaviors can be reused across multiple expectations
 *
 * Missing behaviors makes it unclear how expectations are fulfilled or what needs to be implemented.
 *
 * **What it checks:**
 * - Expectation has `behaviors` field defined (recommended)
 * - Behaviors array should not be empty if provided
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has behaviors that implement the expectation
 * @Expectation({
 *   name: 'Fast Email Validation',
 *   provider: EmailValidationServiceStakeholder,
 *   consumer: DigitalCustomerStakeholder,
 *   interaction: EmailValidationAPIInteraction,
 *   behaviors: [
 *     ValidateEmailFormatBehavior,
 *     CheckDNSRecordsBehavior
 *   ]
 * })
 *
 * // ⚠️ Warning - Missing behaviors
 * @Expectation({
 *   name: 'Fast Email Validation',
 *   provider: EmailValidationServiceStakeholder,
 *   consumer: DigitalCustomerStakeholder,
 *   interaction: EmailValidationAPIInteraction
 *   // Missing behaviors - unclear how this expectation is implemented
 * })
 * ```
 *
 * @category expectation
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingBehaviors' | 'emptyBehaviors';

export const expectationBehaviorsRecommended = createRule<[], MessageIds>({
  name: 'expectation-behaviors-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Expectations should have behaviors field. Behaviors define what implements the expectation, linking the contract to its implementation.',
    },
    messages: {
      missingBehaviors:
        "Expectation '{{name}}' is missing a 'behaviors' field. Behaviors define what implements this expectation, linking the stakeholder contract to its actual implementation. Consider adding behaviors array with @Behavior decorated classes (e.g., 'behaviors: [ValidateEmailFormatBehavior, CheckDNSRecordsBehavior]').",
      emptyBehaviors:
        "Expectation '{{name}}' has an empty 'behaviors' array. If behaviors are defined, they should list the @Behavior classes that implement this expectation. Add behavior classes or remove the empty array.",
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
          if (decorator.type !== 'Expectation') continue;

          const name = decorator.metadata.name as string | undefined;
          const behaviors = decorator.metadata.behaviors as unknown[] | undefined;

          // Check if behaviors is missing
          if (!behaviors) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if behaviors already exists in source to avoid duplicates
            if (source.includes('behaviors:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingBehaviors',
              data: { name: name || 'Unnamed expectation' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if behaviors already exists in source to avoid duplicates
                if (source.includes('behaviors:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const behaviorsTemplate = needsComma
                  ? `,\n  behaviors: [],  // TODO: Add @Behavior classes that implement this expectation`
                  : `\n  behaviors: [],  // TODO: Add @Behavior classes that implement this expectation`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  behaviorsTemplate
                );
              },
            });
          } else if (Array.isArray(behaviors) && behaviors.length === 0) {
            // Check for empty behaviors array
            context.report({
              node: decorator.node,
              messageId: 'emptyBehaviors',
              data: { name: name || 'Unnamed expectation' },
            });
          }
        }
      },
    };
  },
});

