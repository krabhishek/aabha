/**
 * Collaboration Communication Channel Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **communicationChannel** defines how participants
 * interact in a collaboration. Without a communication channel, collaborations lack clarity on
 * interaction methods and AI systems cannot generate appropriate coordination or facilitation
 * code.
 *
 * Communication channel enables AI to:
 * 1. **Generate coordination** - Create appropriate coordination logic for the channel
 * 2. **Enable facilitation** - Apply channel-specific facilitation approaches
 * 3. **Plan resources** - Allocate resources based on channel requirements
 * 4. **Track patterns** - Understand collaboration interaction methods
 *
 * Missing communication channel makes it harder to coordinate or facilitate collaborations
 * effectively.
 *
 * **What it checks:**
 * - Collaboration has `communicationChannel` field defined (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has communication channel
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting',
 *   communicationChannel: 'in-person-meeting'
 * })
 *
 * // ⚠️ Warning - Missing communication channel
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting'
 *   // Missing communicationChannel - unclear interaction method
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingCommunicationChannel';

export const collaborationCommunicationChannelRecommended = createRule<[], MessageIds>({
  name: 'collaboration-communication-channel-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Collaborations should have a communicationChannel field. Communication channel defines how participants interact, enabling appropriate coordination and facilitation.',
    },
    messages: {
      missingCommunicationChannel:
        "Collaboration '{{name}}' is missing a 'communicationChannel' field. Communication channel defines how participants interact (in-person-meeting, video-call, phone, etc.), enabling appropriate coordination and facilitation. Consider adding a communicationChannel (e.g., 'communicationChannel: \"in-person-meeting\"', 'communicationChannel: \"video-call\"').",
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
          const communicationChannel = decorator.metadata.communicationChannel;

          // Check if communicationChannel is missing
          if (!communicationChannel) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if communicationChannel already exists in source to avoid duplicates
            if (source.includes('communicationChannel:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingCommunicationChannel',
              data: { name: name || 'Unnamed collaboration' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if communicationChannel already exists in source to avoid duplicates
                if (source.includes('communicationChannel:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const communicationChannelTemplate = needsComma
                  ? `,\n  communicationChannel: 'in-person-meeting',  // TODO: Choose appropriate channel (in-person-meeting, video-call, phone, email-thread, document-review, instant-message, hybrid)`
                  : `\n  communicationChannel: 'in-person-meeting',  // TODO: Choose appropriate channel (in-person-meeting, video-call, phone, email-thread, document-review, instant-message, hybrid)`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  communicationChannelTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

