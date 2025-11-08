/**
 * Initiative Milestones Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **milestones** provide key checkpoints in a business
 * initiative's timeline. When milestones are provided, they should be complete with both name and
 * targetDate to enable proper tracking and reporting.
 *
 * Complete milestones enable AI to:
 * 1. **Track progress** - Monitor progress against milestone dates
 * 2. **Generate reports** - Show milestone status in reports
 * 3. **Enable planning** - Help plan work around milestone dates
 * 4. **Coordinate work** - Help coordinate with other initiatives
 *
 * Incomplete milestones make it harder to track progress or coordinate work.
 *
 * **What it checks:**
 * - Milestones have `name` when provided
 * - Milestones have `targetDate` when provided
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete milestones
 * @BusinessInitiative({
 *   name: 'Instant Account Opening',
 *   timeline: {
 *     milestones: [
 *       { name: 'MVP Launch', targetDate: '2024-03-31' },
 *       { name: 'Full Launch', targetDate: '2024-06-30' }
 *     ]
 *   }
 * })
 *
 * // ❌ Bad - Incomplete milestone
 * @BusinessInitiative({
 *   name: 'Instant Account Opening',
 *   timeline: {
 *     milestones: [
 *       { name: 'MVP Launch' }
 *       // Missing targetDate
 *     ]
 *   }
 * })
 * ```
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'incompleteMilestone';

export const initiativeMilestonesCompleteness = createRule<[], MessageIds>({
  name: 'initiative-milestones-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Business initiative milestones should be complete with both name and targetDate when provided. Complete milestones enable proper tracking and reporting.',
    },
    messages: {
      incompleteMilestone:
        "Initiative '{{name}}' has milestones but milestone at index {{index}} is missing '{{field}}'. Complete milestones should include both name and targetDate to enable proper tracking. Add the missing field to the milestone.",
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
          if (decorator.type !== 'BusinessInitiative') continue;

          const name = decorator.metadata.name as string | undefined;
          const timeline = decorator.metadata.timeline as
            | { startDate?: string; endDate?: string; milestones?: unknown[] }
            | undefined;

          // Only check if timeline and milestones exist
          if (!timeline || !timeline.milestones) continue;

          const milestones = timeline.milestones;
          if (!Array.isArray(milestones)) continue;

          // Check each milestone
          milestones.forEach((milestone, index) => {
            if (typeof milestone !== 'object' || milestone === null) return;

            const milestoneObj = milestone as { name?: string; targetDate?: string };

            // Check if name is missing
            if (!milestoneObj.name) {
              context.report({
                node: decorator.node,
                messageId: 'incompleteMilestone',
                data: {
                  name: name || 'Unnamed initiative',
                  index,
                  field: 'name',
                },
              });
            }

            // Check if targetDate is missing
            if (!milestoneObj.targetDate) {
              context.report({
                node: decorator.node,
                messageId: 'incompleteMilestone',
                data: {
                  name: name || 'Unnamed initiative',
                  index,
                  field: 'targetDate',
                },
              });
            }
          });
        }
      },
    };
  },
});

