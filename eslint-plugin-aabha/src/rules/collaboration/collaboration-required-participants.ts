/**
 * Collaboration Required Participants Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **at least one participant must be required** for a
 * collaboration to have meaning. If all participants are optional, the collaboration may never
 * happen - everyone assumes someone else will attend, and nobody shows up.
 *
 * All-optional participants cause:
 * - **Canceled meetings** - Nobody commits, so collaboration doesn't happen
 * - **Weak decisions** - Decisions made without key stakeholders
 * - **Scheduling chaos** - AI can't schedule if nobody is required
 * - **Accountability vacuum** - Nobody must ensure the collaboration occurs
 *
 * Required participant designation enables:
 * 1. **Meeting certainty** - At least one person must attend
 * 2. **Smart scheduling** - AI prioritizes required participants' calendars
 * 3. **Meaningful attendance** - Optional participants know collaboration will happen
 * 4. **Cancellation logic** - AI can auto-cancel if no required participants available
 * 5. **Quorum validation** - Decision processes know minimum attendance
 *
 * **What it checks:**
 * - At least one participant is marked as required
 * - Collaborations have committed attendees
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has required participants
 * @Collaboration({
 *   name: 'Sprint Planning',
 *   participants: [
 *     { stakeholder: 'Product Owner', role: 'decision-maker', required: true },
 *     { stakeholder: 'Dev Team', role: 'estimator', required: true },
 *     { stakeholder: 'Designers', role: 'advisor', required: false }
 *   ]
 * })
 *
 * // ❌ Bad - All optional
 * @Collaboration({
 *   name: 'Design Review',
 *   participants: [
 *     { stakeholder: 'Designer', role: 'presenter', required: false },
 *     { stakeholder: 'PM', role: 'reviewer', required: false }
 *   ]
 * })
 *
 * // ⚠️ Warning - No required flag (assumes optional)
 * @Collaboration({
 *   participants: [
 *     { stakeholder: 'Alice', role: 'facilitator' }  // Should explicitly mark required: true
 *   ]
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'noRequiredParticipants';

export const collaborationRequiredParticipants = createRule<[], MessageIds>({
  name: 'collaboration-required-participants',
  meta: {
    type: 'problem',
    docs: {
      description: 'Collaborations should have at least one required participant. In context engineering, required participants ensure the collaboration will occur and enable AI to make smart scheduling decisions.',
    },
    messages: {
      noRequiredParticipants: "Collaboration '{{collaborationName}}' has no required participants ({{totalParticipants}} total). In context engineering, when all participants are optional, the collaboration may never happen - everyone assumes others will attend and nobody commits. Mark at least one key participant as required (e.g., the decision-maker, facilitator, or presenter) to ensure the collaboration occurs. AI systems use required participants for scheduling priority, cancellation logic, and quorum validation.",
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
            required?: boolean;
          }> | undefined;

          if (!participants || participants.length === 0) continue;

          const hasRequiredParticipant = participants.some((p) => p.required === true);

          if (!hasRequiredParticipant) {
            context.report({
              node: decorator.node,
              messageId: 'noRequiredParticipants',
              data: {
                collaborationName: collaborationName || 'Unknown',
                totalParticipants: participants.length.toString(),
              },
            });
          }
        }
      },
    };
  },
});
