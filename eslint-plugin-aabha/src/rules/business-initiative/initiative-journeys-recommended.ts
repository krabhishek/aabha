/**
 * Initiative Journeys Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **journeys** link business initiatives to the user
 * journeys they enable. Without journey references, initiatives lack clarity on what user
 * experiences they deliver and AI systems cannot understand the relationship between strategic
 * initiatives and user-facing journeys.
 *
 * Journeys enable AI to:
 * 1. **Understand scope** - Know what user experiences the initiative enables
 * 2. **Link strategy to UX** - Connect strategic goals to user journeys
 * 3. **Generate reports** - Show which journeys are enabled by initiatives
 * 4. **Enable traceability** - Track from strategy to user experience
 *
 * Missing journey references make it harder to understand what user experiences initiatives deliver.
 *
 * **What it checks:**
 * - Initiative has `journeys` field defined (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has journeys
 * @BusinessInitiative({
 *   name: 'Instant Account Opening',
 *   journeys: [InstantAccountOpeningJourney]
 * })
 *
 * // ⚠️ Warning - Missing journeys
 * @BusinessInitiative({
 *   name: 'Instant Account Opening'
 *   // Missing journeys - unclear what user experiences are enabled
 * })
 * ```
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingJourneys';

export const initiativeJourneysRecommended = createRule<[], MessageIds>({
  name: 'initiative-journeys-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Business initiatives should have a journeys field. Journeys link initiatives to the user journeys they enable, providing clarity on what user experiences are delivered.',
    },
    messages: {
      missingJourneys:
        "Initiative '{{name}}' is missing a 'journeys' field. Journeys link initiatives to the user journeys they enable, providing clarity on what user experiences are delivered. Consider adding journeys that reference @Journey decorated classes (e.g., 'journeys: [InstantAccountOpeningJourney]').",
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
          const journeys = decorator.metadata.journeys;

          // Check if journeys is missing
          if (!journeys) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if journeys already exists in source to avoid duplicates
            if (source.includes('journeys:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingJourneys',
              data: { name: name || 'Unnamed initiative' },
                            fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if journeys already exists in source to avoid duplicates
                if (source.includes('journeys:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const journeysTemplate = needsComma
                  ? `,\n  journeys: [],  // TODO: Add @Journey decorated classes`
                  : `\n  journeys: [],  // TODO: Add @Journey decorated classes`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  journeysTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

