/**
 * Collaboration Type Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **collaborationType** classifies the collaboration
 * pattern (meeting, review-approval, negotiation, etc.). Without a type, collaborations lack
 * clear classification and AI systems cannot apply appropriate patterns, scheduling logic, or
 * facilitation approaches.
 *
 * Collaboration type enables AI to:
 * 1. **Apply patterns** - Use appropriate collaboration patterns based on type
 * 2. **Generate scheduling** - Create appropriate scheduling logic for the type
 * 3. **Enable facilitation** - Apply type-specific facilitation approaches
 * 4. **Group collaborations** - Organize collaborations by type in reports
 *
 * Missing collaboration type makes it harder to apply appropriate patterns or generate proper
 * coordination code.
 *
 * **What it checks:**
 * - Collaboration has `collaborationType` field defined (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has collaboration type
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting',
 *   collaborationType: 'meeting'
 * })
 *
 * // ⚠️ Warning - Missing collaboration type
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting'
 *   // Missing collaborationType - unclear pattern
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingCollaborationType';

export const collaborationTypeRecommended = createRule<[], MessageIds>({
  name: 'collaboration-type-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Collaborations should have a collaborationType field. Collaboration type classifies the collaboration pattern, enabling appropriate patterns and scheduling logic.',
    },
    messages: {
      missingCollaborationType:
        "Collaboration '{{name}}' is missing a 'collaborationType' field. Collaboration type classifies the collaboration pattern (meeting, review-approval, negotiation, etc.), enabling appropriate patterns and scheduling logic. Consider adding a collaborationType (e.g., 'collaborationType: \"meeting\"', 'collaborationType: \"review-approval\"').",
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
          const collaborationType = decorator.metadata.collaborationType;

          // Check if collaborationType is missing
          if (!collaborationType) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if collaborationType already exists in source to avoid duplicates
            if (source.includes('collaborationType:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingCollaborationType',
              data: { name: name || 'Unnamed collaboration' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if collaborationType already exists in source to avoid duplicates
                if (source.includes('collaborationType:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const collaborationTypeTemplate = needsComma
                  ? `,\n  collaborationType: 'meeting',  // TODO: Choose appropriate type (meeting, review-approval, negotiation, audit, consultation, workshop, coordination)`
                  : `\n  collaborationType: 'meeting',  // TODO: Choose appropriate type (meeting, review-approval, negotiation, audit, consultation, workshop, coordination)`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  collaborationTypeTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

