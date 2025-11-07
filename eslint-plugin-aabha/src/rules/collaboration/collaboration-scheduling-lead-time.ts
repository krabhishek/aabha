/**
 * Collaboration Scheduling Lead Time Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **lead time defines how far in advance to schedule**
 * collaborations. Without explicit lead time, participants can't prepare adequately, required
 * artifacts may not be ready, and stakeholders may have conflicting commitments.
 *
 * Missing lead time causes:
 * - **Poor preparation** - Not enough time to review materials or prepare presentations
 * - **Scheduling conflicts** - Last-minute invites clash with other commitments
 * - **Low attendance** - Important stakeholders unavailable due to short notice
 * - **Incomplete artifacts** - Required documents not ready because no advance notice
 *
 * Explicit lead time enables:
 * 1. **Adequate preparation** - Stakeholders have time to review materials and prepare
 * 2. **Smart scheduling** - AI can schedule meetings respecting lead time requirements
 * 3. **Artifact readiness** - Owners know deadlines for delivering required materials
 * 4. **Attendance optimization** - Better availability when scheduled with sufficient notice
 * 5. **Automated reminders** - AI can send preparation reminders based on lead time
 *
 * **What it checks:**
 * - Collaborations with scheduling details specify lead time
 * - Lead time provides reasonable advance notice
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Clear lead time
 * @Collaboration({
 *   name: 'Quarterly Business Review',
 *   scheduling: {
 *     leadTime: '2 weeks',
 *     recurrence: 'quarterly'
 *   }
 * })
 *
 * @Collaboration({
 *   name: 'Daily Standup',
 *   scheduling: {
 *     leadTime: '1 day',
 *     recurrence: 'daily'
 *   }
 * })
 *
 * // ❌ Bad - Scheduling without lead time
 * @Collaboration({
 *   name: 'Architecture Review',
 *   scheduling: {
 *     recurrence: 'monthly'  // How much advance notice?
 *   }
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingLeadTime';

export const collaborationSchedulingLeadTime = createRule<[], MessageIds>({
  name: 'collaboration-scheduling-lead-time',
  meta: {
    type: 'problem',
    docs: {
      description: 'Collaborations with scheduling details should specify lead time. In context engineering, lead time enables AI systems to schedule meetings appropriately, ensure adequate preparation time, and optimize stakeholder availability.',
    },
    messages: {
      missingLeadTime: "Collaboration '{{collaborationName}}' has scheduling details but no lead time specified. In context engineering, lead time defines how far in advance to schedule the collaboration - this is critical for stakeholder preparation and artifact readiness. Specify how much advance notice is needed (e.g., '1 week', '3 days', '2 weeks'). AI systems use lead time to schedule meetings, send preparation reminders, and ensure required artifacts are delivered on time.",
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
          const scheduling = decorator.metadata.scheduling as {
            leadTime?: string;
          } | undefined;

          if (scheduling && !scheduling.leadTime) {
            context.report({
              node: decorator.node,
              messageId: 'missingLeadTime',
              data: {
                collaborationName: collaborationName || 'Unknown',
              },
            });
          }
        }
      },
    };
  },
});
