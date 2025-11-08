/**
 * Behavior Participants Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **participants** identify stakeholders who participate
 * in the expected behavior. Behaviors model expected behavior that would be implemented in a product
 * or business process, and identifying participants helps teams understand who is involved, enables
 * AI systems to generate appropriate implementations with proper stakeholder context, and supports
 * behavior modeling. While not always required, participants are important for understanding behavior
 * context and stakeholder involvement.
 *
 * Participants enable AI to:
 * 1. **Understand stakeholder context** - Know who participates in the expected behavior
 * 2. **Generate implementations** - Create appropriate code with stakeholder context
 * 3. **Model behavior** - Understand behavior relationships and dependencies
 * 4. **Support testing** - Identify stakeholders for test scenarios
 *
 * **What it checks:**
 * - Behavior should have `participants` field (recommended, not required)
 * - When participants are provided, they should not be empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has participants
 * @Behavior({
 *   name: 'Validate Email Format',
 *   participants: [EmailValidationServiceStakeholder, AuditLogSystemStakeholder]
 * })
 *
 * // ⚠️ Warning - Missing participants (recommended)
 * @Behavior({
 *   name: 'Validate Email Format'
 *   // Missing participants - consider identifying stakeholders involved
 * })
 * ```
 *
 * @category behavior
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingParticipants' | 'emptyParticipants';

export const behaviorParticipantsRecommended = createRule<[], MessageIds>({
  name: 'behavior-participants-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Behaviors should have participants field. Participants identify stakeholders who participate in the expected behavior, helping teams understand behavior context and enabling AI to generate appropriate implementations.',
    },
    messages: {
      missingParticipants:
        "Behavior '{{name}}' is missing a 'participants' field. Participants identify stakeholders who participate in the expected behavior. Behaviors model expected behavior that would be implemented in a product or business process, and identifying participants helps teams understand who is involved, enables AI systems to generate appropriate implementations with proper stakeholder context, and supports behavior modeling. Add a participants array (e.g., 'participants: [EmailValidationServiceStakeholder, AuditLogSystemStakeholder]').",
      emptyParticipants:
        "Behavior '{{name}}' has a participants field but it's empty. Participants should identify stakeholders involved in the expected behavior. Add meaningful participant stakeholders.",
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
          if (decorator.type !== 'Behavior') continue;

          const name = decorator.metadata.name as string | undefined;
          const participants = decorator.metadata.participants as unknown[] | undefined;

          // Check if participants is missing (recommended, not required)
          if (!participants) {
            context.report({
              node: decorator.node,
              messageId: 'missingParticipants',
              data: { name: name || 'Unnamed behavior' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if participants already exists in source to avoid duplicates
                if (source.includes('participants:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                const participantsTemplate = needsComma
                  ? `,\n  participants: [\n    // TODO: Stakeholders who participate in this expected behavior (e.g., EmailValidationServiceStakeholder, AuditLogSystemStakeholder)\n  ]`
                  : `\n  participants: [\n    // TODO: Stakeholders who participate in this expected behavior (e.g., EmailValidationServiceStakeholder, AuditLogSystemStakeholder)\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  participantsTemplate,
                );
              },
            });
            continue;
          }

          // Check if participants is empty
          if (Array.isArray(participants) && participants.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyParticipants',
              data: { name: name || 'Unnamed behavior' },
            });
          }
        }
      },
    };
  },
});

