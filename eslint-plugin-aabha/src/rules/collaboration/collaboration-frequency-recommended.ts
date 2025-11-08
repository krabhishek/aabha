/**
 * Collaboration Frequency Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **frequency** defines how often a collaboration
 * occurs. Without frequency, collaborations lack scheduling information and AI systems cannot
 * generate appropriate scheduling logic or coordinate recurring collaborations.
 *
 * Frequency enables AI to:
 * 1. **Generate scheduling** - Create recurring schedules based on frequency
 * 2. **Coordinate participants** - Plan participant availability for recurring collaborations
 * 3. **Enable automation** - Automate scheduling for recurring collaborations
 * 4. **Track patterns** - Understand collaboration cadence
 *
 * Missing frequency makes it harder to schedule or coordinate recurring collaborations.
 *
 * **What it checks:**
 * - Collaboration has `frequency` field defined (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has frequency
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting',
 *   frequency: 'monthly'
 * })
 *
 * // ⚠️ Warning - Missing frequency
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting'
 *   // Missing frequency - unclear scheduling
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingFrequency';

export const collaborationFrequencyRecommended = createRule<[], MessageIds>({
  name: 'collaboration-frequency-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Collaborations should have a frequency field. Frequency defines how often the collaboration occurs, enabling appropriate scheduling and coordination.',
    },
    messages: {
      missingFrequency:
        "Collaboration '{{name}}' is missing a 'frequency' field. Frequency defines how often the collaboration occurs, enabling appropriate scheduling and coordination. Consider adding a frequency (e.g., 'frequency: \"monthly\"', 'frequency: \"ad-hoc\"', 'frequency: \"quarterly\"').",
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
          const frequency = decorator.metadata.frequency;

          // Check if frequency is missing
          if (!frequency) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if frequency already exists in source to avoid duplicates
            if (source.includes('frequency:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingFrequency',
              data: { name: name || 'Unnamed collaboration' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if frequency already exists in source to avoid duplicates
                if (source.includes('frequency:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const frequencyTemplate = needsComma
                  ? `,\n  frequency: 'ad-hoc',  // TODO: Choose appropriate frequency (daily, weekly, bi-weekly, monthly, quarterly, annually, ad-hoc, one-time)`
                  : `\n  frequency: 'ad-hoc',  // TODO: Choose appropriate frequency (daily, weekly, bi-weekly, monthly, quarterly, annually, ad-hoc, one-time)`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  frequencyTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

