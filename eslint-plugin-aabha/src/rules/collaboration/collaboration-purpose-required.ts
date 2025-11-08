/**
 * Collaboration Purpose Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **purpose** defines why a collaboration happens and
 * what it aims to achieve. Without a purpose, collaborations lack clear direction and AI systems
 * cannot understand the collaboration's goals or generate appropriate coordination code.
 *
 * Purpose enables AI to:
 * 1. **Understand goals** - Know why the collaboration exists and what it achieves
 * 2. **Generate coordination code** - Create scheduling and facilitation logic
 * 3. **Measure success** - Understand how to evaluate collaboration outcomes
 * 4. **Prioritize work** - Help AI understand which collaborations matter most
 *
 * Missing purpose means AI systems can't understand collaboration goals or generate proper
 * coordination and facilitation code.
 *
 * **What it checks:**
 * - Collaboration has `purpose` field defined
 * - Purpose is not empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has purpose
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting',
 *   purpose: 'Joint review of investment portfolio performance and approval of new investments'
 * })
 *
 * // ❌ Bad - Missing purpose
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting'
 *   // Missing purpose - AI can't understand goals
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingPurpose' | 'emptyPurpose';

export const collaborationPurposeRequired = createRule<[], MessageIds>({
  name: 'collaboration-purpose-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Collaborations should have a purpose field. Purpose defines why the collaboration happens and what it aims to achieve, providing clear direction for coordination and facilitation.',
    },
    messages: {
      missingPurpose:
        "Collaboration '{{name}}' is missing a 'purpose' field. Purpose defines why the collaboration happens and what it aims to achieve, providing clear direction for coordination and facilitation. Add a purpose field that clearly explains why this collaboration exists and what it aims to achieve (e.g., 'purpose: \"Joint review of investment portfolio performance and approval of new investments\"').",
      emptyPurpose:
        "Collaboration '{{name}}' has a purpose field but it's empty. Purpose should clearly explain why this collaboration exists and what it aims to achieve. Add a meaningful purpose.",
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
          const purpose = decorator.metadata.purpose as string | undefined;

          // Check if purpose is missing
          if (!purpose) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if purpose already exists in source to avoid duplicates
            if (source.includes('purpose:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingPurpose',
              data: { name: name || 'Unnamed collaboration' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if purpose already exists in source to avoid duplicates
                if (source.includes('purpose:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const purposeTemplate = needsComma
                  ? `,\n  purpose: '',  // TODO: Explain why this collaboration happens and what it aims to achieve`
                  : `\n  purpose: '',  // TODO: Explain why this collaboration happens and what it aims to achieve`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  purposeTemplate
                );
              },
            });
            continue;
          }

          // Check if purpose is empty
          if (typeof purpose === 'string' && purpose.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyPurpose',
              data: { name: name || 'Unnamed collaboration' },
            });
          }
        }
      },
    };
  },
});

