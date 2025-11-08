/**
 * Interaction Description Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **description** provides a detailed explanation of
 * what an interaction is, when it happens, and why it matters. Without a description,
 * interactions lack context and AI systems cannot fully understand the interaction's nature
 * or generate appropriate implementation code.
 *
 * Description enables AI to:
 * 1. **Understand context** - Know what the interaction is and when it happens
 * 2. **Generate summaries** - Create concise overviews of interactions
 * 3. **Improve communication** - Help teams communicate interaction details
 * 4. **Enable discovery** - Make interactions searchable and discoverable
 *
 * Missing description makes it harder to understand interaction context or generate proper
 * implementation code.
 *
 * **What it checks:**
 * - Interaction has `description` field defined (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has description
 * @Interaction({
 *   name: 'Account Opening API',
 *   description: 'REST API endpoint that creates a new bank account for a customer after validating their information and performing KYC checks'
 * })
 *
 * // ⚠️ Warning - Missing description
 * @Interaction({
 *   name: 'Account Opening API'
 *   // Missing description - unclear context
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingDescription';

export const interactionDescriptionRecommended = createRule<[], MessageIds>({
  name: 'interaction-description-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Interactions should have a description field. Description provides a detailed explanation of what the interaction is, when it happens, and why it matters.',
    },
    messages: {
      missingDescription:
        "Interaction '{{name}}' is missing a 'description' field. Description provides a detailed explanation of what the interaction is, when it happens, and why it matters. Consider adding a description that explains the interaction's nature, timing, and importance (e.g., 'description: \"REST API endpoint that creates a new bank account for a customer after validating their information\"').",
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
          if (decorator.type !== 'Interaction') continue;

          const name = decorator.metadata.name as string | undefined;
          const description = decorator.metadata.description;

          // Check if description is missing
          if (!description) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if description already exists in source to avoid duplicates
            if (source.includes('description:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingDescription',
              data: { name: name || 'Unnamed interaction' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if description already exists in source to avoid duplicates
                if (source.includes('description:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const descriptionTemplate = needsComma
                  ? `,\n  description: '',  // TODO: Detailed explanation of what this interaction is, when it happens, and why it matters`
                  : `\n  description: '',  // TODO: Detailed explanation of what this interaction is, when it happens, and why it matters`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  descriptionTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

