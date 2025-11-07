/**
 * Interaction Participants Validation Rule
 *
 * **Why this rule exists:**
 * Interactions require participants with clear roles for accountability and execution. Without
 * participants, interactions are abstract and cannot be implemented. Each participant must have
 * a stakeholder and role defined.
 *
 * Missing or invalid participants cause:
 * - **Execution ambiguity** - Unclear who performs the interaction
 * - **Accountability gaps** - Cannot assign responsibilities
 * - **Implementation failures** - Cannot generate code without stakeholders
 * - **Process breakdowns** - Interactions have no actors
 *
 * Proper participants enable:
 * 1. **Clear accountability** - Each role has an assigned stakeholder
 * 2. **Code generation** - AI can scaffold participant-specific logic
 * 3. **Process clarity** - Team understands who does what
 * 4. **Workflow automation** - Systems can route to correct participants
 *
 * **What it checks:**
 * - Interactions have at least one participant
 * - Each participant has stakeholder and role defined
 * - At least one participant is marked as required
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Clear participants with roles
 * @Interaction({
 *   name: 'Account Opening',
 *   participants: [
 *     { stakeholder: CustomerStakeholder, role: 'initiator', required: true },
 *     { stakeholder: BranchOfficerStakeholder, role: 'approver', required: true },
 *     { stakeholder: ComplianceOfficerStakeholder, role: 'reviewer', required: false }
 *   ]
 * })
 *
 * // ❌ Bad - No participants
 * @Interaction({
 *   name: 'Account Opening'
 *   // Missing participants!
 * })
 *
 * // ❌ Bad - Participant without role
 * @Interaction({
 *   participants: [
 *     { stakeholder: CustomerStakeholder }  // Missing role!
 *   ]
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingParticipants' | 'missingRole' | 'noRequiredParticipants';

export const interactionParticipantsValidation = createRule<[], MessageIds>({
  name: 'interaction-participants-validation',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Interactions should have participants with stakeholders and roles. In context engineering, participants define who performs the interaction, enabling accountability and code generation.',
    },
    messages: {
      missingParticipants:
        "Interaction '{{interactionName}}' has no participants. In context engineering, interactions need participants to define who performs the interaction. Add participants array with stakeholder, role, and required fields. Example: participants: [{{ stakeholder: CustomerStakeholder, role: 'initiator', required: true }}].",
      missingRole:
        "Interaction '{{interactionName}}' has participant without role at index {{index}}. In context engineering, each participant needs a role (initiator, participant, approver, observer, facilitator, presenter, decision-maker, reviewer). Add role to clarify this stakeholder's responsibility.",
      noRequiredParticipants:
        "Interaction '{{interactionName}}' has participants but none marked as required. In context engineering, at least one participant should be required for the interaction to occur. Set required: true for at least one participant.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const decorators = getAabhaDecorators(node);
        if (decorators.length === 0) return;

        for (const decorator of decorators) {
          if (decorator.type !== 'Interaction') continue;

          const interactionName = decorator.metadata.name as string | undefined;
          const participants = decorator.metadata.participants as
            | Array<{
                stakeholder?: unknown;
                role?: string;
                required?: boolean;
              }>
            | undefined;

          // Check for missing participants
          if (!participants || participants.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'missingParticipants',
              data: {
                interactionName: interactionName || 'Unknown',
              },
            });
            continue;
          }

          // Check each participant for role
          let hasRequiredParticipant = false;
          for (let i = 0; i < participants.length; i++) {
            const participant = participants[i];

            if (!participant.role) {
              context.report({
                node: decorator.node,
                messageId: 'missingRole',
                data: {
                  interactionName: interactionName || 'Unknown',
                  index: i.toString(),
                },
              });
            }

            if (participant.required !== false) {
              hasRequiredParticipant = true;
            }
          }

          // Check that at least one participant is required
          if (!hasRequiredParticipant) {
            context.report({
              node: decorator.node,
              messageId: 'noRequiredParticipants',
              data: {
                interactionName: interactionName || 'Unknown',
              },
            });
          }
        }
      },
    };
  },
});
