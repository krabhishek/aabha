/**
 * Collaboration Participant Role Validation Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **participant roles describe function, not just attendance**.
 * Generic roles like "participant" or "attendee" provide no context about what each stakeholder
 * contributes. Meaningful roles help AI understand collaboration dynamics and suggest appropriate
 * facilitation strategies.
 *
 * Generic participant roles cause:
 * - **Unclear expectations** - Stakeholders don't know what's expected of them
 * - **Poor facilitation** - AI can't tailor support when everyone is just "participant"
 * - **Meeting inefficiency** - No clarity on who presents, decides, approves, or advises
 * - **Accountability gaps** - Can't track who should contribute what
 *
 * Specific, meaningful roles enable:
 * 1. **Clear expectations** - Stakeholders know their function before arriving
 * 2. **AI facilitation** - AI can guide "decision-makers" differently than "advisors"
 * 3. **Meeting structure** - AI suggests agenda based on roles (presenters, reviewers, approvers)
 * 4. **Participation tracking** - AI monitors if key roles (decision-maker) contributed
 * 5. **Process automation** - AI routes artifacts to correct roles (approvers, reviewers)
 *
 * **What it checks:**
 * - Participant roles are not generic ("participant", "attendee", "member", "user")
 * - Roles are descriptive (at least 3 characters)
 * - Roles describe collaboration function
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Specific, functional roles
 * @Collaboration({
 *   name: 'Design Review',
 *   participants: [
 *     { stakeholder: 'Designer', role: 'presenter' },
 *     { stakeholder: 'Product Manager', role: 'decision-maker' },
 *     { stakeholder: 'Engineers', role: 'technical-reviewer' },
 *     { stakeholder: 'Marketing', role: 'advisor' }
 *   ]
 * })
 *
 * // ❌ Bad - Generic roles
 * @Collaboration({
 *   participants: [
 *     { stakeholder: 'Alice', role: 'participant' },  // What's her function?
 *     { stakeholder: 'Bob', role: 'attendee' }  // What does he do?
 *   ]
 * })
 *
 * // ❌ Bad - Too short
 * @Collaboration({
 *   participants: [
 *     { stakeholder: 'Charlie', role: 'PM' }  // Too abbreviated
 *   ]
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'genericParticipantRole' | 'tooShortRole';

const GENERIC_ROLES = ['participant', 'attendee', 'member', 'user'];

export const collaborationParticipantRoleValidation = createRule<[], MessageIds>({
  name: 'collaboration-participant-role-validation',
  meta: {
    type: 'problem',
    docs: {
      description: 'Participant roles should be meaningful and describe their function. In context engineering, specific roles help AI systems understand collaboration dynamics, provide appropriate facilitation, and track participation effectively.',
    },
    messages: {
      genericParticipantRole: "Collaboration '{{collaborationName}}' participant has generic role '{{role}}'. In context engineering, generic roles like 'participant' or 'attendee' provide no context about stakeholder function. Use specific roles that describe what they do in the collaboration: 'decision-maker', 'presenter', 'reviewer', 'approver', 'advisor', 'facilitator', 'note-taker', 'technical-expert', etc. Specific roles enable AI to provide appropriate facilitation and track meaningful participation.",
      tooShortRole: "Collaboration '{{collaborationName}}' participant has very short role '{{role}}'. In context engineering, role names should be descriptive enough for AI systems to understand stakeholder function. Avoid abbreviations - use full descriptive names like 'product-manager' instead of 'PM', or 'technical-lead' instead of 'TL'. Descriptive roles improve AI comprehension and collaboration facilitation.",
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
          if (decorator.type !== 'Collaboration') continue;

          const collaborationName = decorator.metadata.name as string | undefined;
          const participants = decorator.metadata.participants as Array<{
            role: string;
          }> | undefined;

          if (!participants) continue;

          participants.forEach((participant) => {
            const roleLower = participant.role.toLowerCase().trim();

            if (GENERIC_ROLES.includes(roleLower)) {
              context.report({
                node: decorator.node,
                messageId: 'genericParticipantRole',
                data: {
                  collaborationName: collaborationName || 'Unknown',
                  role: participant.role,
                },
              });
            }

            if (roleLower.length < 3) {
              context.report({
                node: decorator.node,
                messageId: 'tooShortRole',
                data: {
                  collaborationName: collaborationName || 'Unknown',
                  role: participant.role,
                },
              });
            }
          });
        }
      },
    };
  },
});
