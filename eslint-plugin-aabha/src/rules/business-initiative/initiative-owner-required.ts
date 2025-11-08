/**
 * Initiative Owner Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **owner** identifies the person or team responsible
 * for the business initiative. Without an owner, initiatives lack accountability and AI systems
 * cannot determine who to contact for questions, decisions, or status updates.
 *
 * Owner enables AI to:
 * 1. **Assign accountability** - Know who is responsible for the initiative
 * 2. **Route questions** - Direct inquiries to the right person
 * 3. **Generate reports** - Include owner information in status reports
 * 4. **Enable collaboration** - Help AI understand organizational structure
 *
 * Missing owner means AI systems can't determine accountability or route questions appropriately.
 *
 * **What it checks:**
 * - Initiative has `owner` field defined
 * - Owner is not empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has owner
 * @BusinessInitiative({
 *   name: 'Instant Account Opening',
 *   owner: 'Lisa Wong - Chief Digital Officer'
 * })
 *
 * // ❌ Bad - Missing owner
 * @BusinessInitiative({
 *   name: 'Instant Account Opening'
 *   // Missing owner - no accountability
 * })
 * ```
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingOwner' | 'emptyOwner';

export const initiativeOwnerRequired = createRule<[], MessageIds>({
  name: 'initiative-owner-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Business initiatives should have an owner field. Owner identifies the person or team responsible for the initiative, ensuring accountability and enabling proper communication.',
    },
    messages: {
      missingOwner:
        "Initiative '{{name}}' is missing an 'owner' field. Owner identifies the person or team responsible for the initiative, ensuring accountability and enabling proper communication. Add an owner field with the responsible person or team name (e.g., 'owner: \"John Doe - Product Manager\"').",
      emptyOwner:
        "Initiative '{{name}}' has an owner field but it's empty. Owner should identify the person or team responsible for the initiative. Add a meaningful owner value.",
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
          const owner = decorator.metadata.owner as string | undefined;

          // Check if owner is missing
          if (!owner) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if owner already exists in source to avoid duplicates
            if (source.includes('owner:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingOwner',
              data: { name: name || 'Unnamed initiative' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if owner already exists in source to avoid duplicates
                if (source.includes('owner:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const ownerTemplate = needsComma
                  ? `,\n  owner: '',  // TODO: Add owner name or team`
                  : `\n  owner: '',  // TODO: Add owner name or team`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  ownerTemplate
                );
              },
            });
            continue;
          }

          // Check if owner is empty
          if (typeof owner === 'string' && owner.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyOwner',
              data: { name: name || 'Unnamed initiative' },
            });
          }
        }
      },
    };
  },
});

