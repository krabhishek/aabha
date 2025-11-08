/**
 * Interaction Interpersonal Config Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **interpersonalConfig** provides interpersonal-specific
 * configuration for human-to-human interactions. For Interpersonal layer interactions, interpersonalConfig
 * is essential for understanding communication channels, synchronicity, location, attendees, and other
 * interpersonal-specific details.
 *
 * Interpersonal config enables AI to:
 * 1. **Understand communication channels** - Know in-person, video, phone, email, etc.
 * 2. **Plan scheduling** - Understand synchronicity and duration
 * 3. **Manage attendees** - Know required and optional participants
 * 4. **Enable coordination** - Understand location and facilitation needs
 *
 * Missing interpersonalConfig makes it harder to understand interpersonal requirements or generate
 * proper coordination code for Interpersonal interactions.
 *
 * **What it checks:**
 * - Interpersonal layer interactions should have `interpersonalConfig` field (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has interpersonal config
 * @Interaction({
 *   name: 'Investment Committee Meeting',
 *   layer: InteractionLayer.Interpersonal,
 *   interpersonalConfig: {
 *     communicationChannel: 'in-person-meeting',
 *     synchronicity: 'synchronous',
 *     duration: 'PT2H',
 *     attendees: {
 *       required: [InvestorStakeholder, AdvisorStakeholder]
 *     }
 *   }
 * })
 *
 * // ⚠️ Warning - Missing interpersonal config for interpersonal interaction
 * @Interaction({
 *   name: 'Investment Committee Meeting',
 *   layer: InteractionLayer.Interpersonal
 *   // Missing interpersonalConfig - unclear coordination requirements
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingInterpersonalConfig';

export const interactionInterpersonalConfigRecommended = createRule<[], MessageIds>({
  name: 'interaction-interpersonal-config-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Interpersonal layer interactions should have interpersonalConfig field. Interpersonal config provides interpersonal-specific configuration for human-to-human interactions.',
    },
    messages: {
      missingInterpersonalConfig:
        "Interaction '{{name}}' with layer 'Interpersonal' is missing an 'interpersonalConfig' field. Interpersonal config is recommended for Interpersonal layer interactions to define communication channels, synchronicity, location, attendees, and other interpersonal-specific details. Consider adding interpersonal config (e.g., 'interpersonalConfig: { communicationChannel: \"in-person-meeting\", synchronicity: \"synchronous\", duration: \"PT2H\" }').",
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
          const layer = decorator.metadata.layer as string | undefined;
          const interpersonalConfig = decorator.metadata.interpersonalConfig;

          // Only check for Interpersonal layer
          if (layer !== 'Interpersonal') continue;

          // Check if interpersonalConfig is missing
          if (!interpersonalConfig) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if interpersonalConfig already exists in source to avoid duplicates
            if (source.includes('interpersonalConfig:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingInterpersonalConfig',
              data: { name: name || 'Unnamed interaction' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if interpersonalConfig already exists in source to avoid duplicates
                if (source.includes('interpersonalConfig:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const interpersonalConfigTemplate = needsComma
                  ? `,\n  interpersonalConfig: {\n    communicationChannel: 'in-person-meeting',  // TODO: Choose channel (in-person-meeting, video-call, phone, email, instant-message)\n    synchronicity: 'synchronous',  // TODO: Choose synchronicity (synchronous, asynchronous)\n    duration: 'PT1H',  // TODO: Define duration (ISO 8601 format)\n    attendees: {\n      required: []  // TODO: Add required @Stakeholder decorated classes\n    }\n  },  // TODO: Define interpersonal configuration`
                  : `\n  interpersonalConfig: {\n    communicationChannel: 'in-person-meeting',  // TODO: Choose channel (in-person-meeting, video-call, phone, email, instant-message)\n    synchronicity: 'synchronous',  // TODO: Choose synchronicity (synchronous, asynchronous)\n    duration: 'PT1H',  // TODO: Define duration (ISO 8601 format)\n    attendees: {\n      required: []  // TODO: Add required @Stakeholder decorated classes\n    }\n  },  // TODO: Define interpersonal configuration`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  interpersonalConfigTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

