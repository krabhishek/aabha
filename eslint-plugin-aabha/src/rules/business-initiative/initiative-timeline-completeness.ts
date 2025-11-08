/**
 * Initiative Timeline Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **timeline** provides critical scheduling information
 * for business initiatives. When a timeline is provided, it should be complete with both start
 * and end dates to enable proper planning, tracking, and reporting.
 *
 * Complete timelines enable AI to:
 * 1. **Plan work** - Understand initiative duration and scheduling
 * 2. **Track progress** - Monitor progress against timeline
 * 3. **Generate reports** - Show timeline information in status reports
 * 4. **Enable coordination** - Help coordinate with other initiatives
 *
 * Incomplete timelines make it harder to plan, track, and coordinate initiatives.
 *
 * **What it checks:**
 * - Timeline has `startDate` when provided
 * - Timeline has `endDate` when provided
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete timeline
 * @BusinessInitiative({
 *   name: 'Instant Account Opening',
 *   timeline: {
 *     startDate: '2024-01-01',
 *     endDate: '2024-06-30'
 *   }
 * })
 *
 * // ❌ Bad - Incomplete timeline
 * @BusinessInitiative({
 *   name: 'Instant Account Opening',
 *   timeline: {
 *     startDate: '2024-01-01'
 *     // Missing endDate
 *   }
 * })
 * ```
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingStartDate' | 'missingEndDate';

export const initiativeTimelineCompleteness = createRule<[], MessageIds>({
  name: 'initiative-timeline-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Business initiative timelines should be complete with both startDate and endDate when provided. Complete timelines enable proper planning, tracking, and reporting.',
    },
    messages: {
      missingStartDate:
        "Initiative '{{name}}' has a timeline but is missing 'startDate'. Complete timelines should include both startDate and endDate to enable proper planning and tracking. Add a startDate field to the timeline object.",
      missingEndDate:
        "Initiative '{{name}}' has a timeline but is missing 'endDate'. Complete timelines should include both startDate and endDate to enable proper planning and tracking. Add an endDate field to the timeline object.",
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
          const timeline = decorator.metadata.timeline as
            | { startDate?: string; endDate?: string; milestones?: unknown[] }
            | undefined;

          // Only check if timeline exists
          if (!timeline) continue;

          // Check if startDate is missing
          if (!timeline.startDate) {
            context.report({
              node: decorator.node,
              messageId: 'missingStartDate',
              data: { name: name || 'Unnamed initiative' },
            });
          }

          // Check if endDate is missing
          if (!timeline.endDate) {
            context.report({
              node: decorator.node,
              messageId: 'missingEndDate',
              data: { name: name || 'Unnamed initiative' },
            });
          }
        }
      },
    };
  },
});

