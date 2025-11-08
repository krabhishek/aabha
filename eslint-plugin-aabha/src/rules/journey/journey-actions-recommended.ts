/**
 * Journey Actions Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **actions** list all Actions that are part of the journey.
 * While flow topology is defined by Actions via their triggers property, explicitly listing actions
 * in the journey provides clarity, enables validation, and helps AI systems understand the complete
 * journey structure.
 *
 * Actions enable AI to:
 * 1. **Understand journey structure** - Know all actions that participate in the journey
 * 2. **Validate flow completeness** - Ensure all referenced actions are included
 * 3. **Generate documentation** - Create comprehensive journey documentation
 * 4. **Enable static analysis** - Analyze journey flow and dependencies
 *
 * Missing actions array makes it harder to understand journey structure or validate that
 * entryActions are part of the journey.
 *
 * **What it checks:**
 * - Journey has `actions` field defined (recommended)
 * - If entryActions exist, actions should also be defined
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has actions
 * @Journey({
 *   name: 'Instant Account Opening',
 *   primaryStakeholder: DigitalCustomerStakeholder,
 *   actions: [
 *     StartAccountApplicationAction,
 *     SubmitApplicationAction,
 *     ActivateAccountAction
 *   ],
 *   entryActions: [StartAccountApplicationAction]
 * })
 *
 * // ⚠️ Warning - Missing actions
 * @Journey({
 *   name: 'Instant Account Opening',
 *   primaryStakeholder: DigitalCustomerStakeholder,
 *   entryActions: [StartAccountApplicationAction]
 *   // Missing actions - unclear which actions are part of this journey
 * })
 * ```
 *
 * @category journey
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingActions' | 'entryActionsWithoutActions';

export const journeyActionsRecommended = createRule<[], MessageIds>({
  name: 'journey-actions-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Journeys should have actions field. Actions list all Actions that are part of the journey, enabling validation and comprehensive journey understanding.',
    },
    messages: {
      missingActions:
        "Journey '{{name}}' is missing an 'actions' field. Actions list all Actions that are part of the journey, enabling validation and comprehensive journey understanding. Consider adding an actions array (e.g., 'actions: [StartAccountApplicationAction, SubmitApplicationAction, ActivateAccountAction]').",
      entryActionsWithoutActions:
        "Journey '{{name}}' has entryActions but no actions field. When entryActions are defined, actions should also be defined to list all actions in the journey. This enables validation that entryActions are part of the journey.",
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
          if (decorator.type !== 'Journey') continue;

          const name = decorator.metadata.name as string | undefined;
          const actions = decorator.metadata.actions as unknown[] | undefined;
          const entryActions = decorator.metadata.entryActions as unknown[] | undefined;

          // Check if actions is missing
          if (!actions || (Array.isArray(actions) && actions.length === 0)) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if actions already exists in source to avoid duplicates
            if (source.includes('actions:')) {
              continue;
            }

            // If entryActions exist but actions don't, this is a stronger warning
            const hasEntryActions = entryActions && Array.isArray(entryActions) && entryActions.length > 0;

            context.report({
              node: decorator.node,
              messageId: hasEntryActions ? 'entryActionsWithoutActions' : 'missingActions',
              data: { name: name || 'Unnamed journey' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if actions already exists in source to avoid duplicates
                if (source.includes('actions:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const actionsTemplate = needsComma
                  ? `,\n  actions: [],  // TODO: Add all @Action decorated classes that are part of this journey`
                  : `\n  actions: [],  // TODO: Add all @Action decorated classes that are part of this journey`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  actionsTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

