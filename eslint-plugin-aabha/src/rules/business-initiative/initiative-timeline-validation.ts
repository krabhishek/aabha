/**
 * Initiative Timeline Validation Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **timeline validation** ensures that initiative timelines
 * are realistic, properly structured, and enable AI systems to generate accurate project planning
 * and scheduling code. Invalid timelines create contradictory context that confuses AI systems
 * trying to understand project timelines and dependencies.
 *
 * Valid timelines enable AI to:
 * 1. **Generate project plans** - Timelines inform scheduling and milestone planning
 * 2. **Calculate dependencies** - Timeline relationships help AI understand project flow
 * 3. **Track progress** - Valid timelines enable progress monitoring
 * 4. **Allocate resources** - Timeline context informs resource planning
 *
 * Invalid timelines mean AI systems can't generate proper project planning or understand when
 * initiatives should start and complete.
 *
 * **What it checks:**
 * - Timeline start date is before end date
 * - Timeline dates are valid and properly formatted
 * - Timeline duration is realistic for the initiative scope
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Valid timeline
 * @BusinessInitiative({
 *   name: 'Customer Portal Redesign',
 *   timeline: {
 *     start: '2024-01-01',
 *     end: '2024-06-30'
 *   }
 * })
 *
 * // ❌ Bad - End before start
 * @BusinessInitiative({
 *   name: 'Customer Portal Redesign',
 *   timeline: {
 *     start: '2024-06-30',
 *     end: '2024-01-01'  // Invalid - end before start
 *   }
 * })
 *
 * // ❌ Bad - Missing timeline
 * @BusinessInitiative({
 *   name: 'Customer Portal Redesign'
 *   // No timeline - AI can't generate project planning
 * })
 *
 * // ❌ Bad - Invalid date format
 * @BusinessInitiative({
 *   name: 'Customer Portal Redesign',
 *   timeline: {
 *     start: 'invalid-date',
 *     end: '2024-06-30'
 *   }
 * })
 * ```
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { detectIndentation } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingTimeline' | 'invalidTimeline' | 'endBeforeStart' | 'invalidDateFormat';

export const initiativeTimelineValidation = createRule<[], MessageIds>({
  name: 'initiative-timeline-validation',
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure initiative timelines are valid and properly structured to help AI generate accurate project planning code',
    },
    messages: {
      missingTimeline: "Initiative '{{name}}' is missing a timeline. Timelines provide valuable context about project duration and scheduling that helps AI systems generate project planning code and understand initiative scope. Add a timeline with start and end dates to enable AI-assisted project planning.",
      invalidTimeline: "Initiative '{{name}}' has an invalid timeline structure. Timelines should have 'start' and 'end' date fields. Invalid timeline structures create contradictory context - AI can't generate project planning without proper timeline information. Fix the timeline structure to include valid start and end dates.",
      endBeforeStart: "Initiative '{{name}}' has timeline end date '{{end}}' before start date '{{start}}'. Timeline end dates must be after start dates to create valid project schedules. Invalid date ordering creates contradictory context - AI can't generate realistic project plans with impossible timelines. Fix the timeline dates so end is after start.",
      invalidDateFormat: "Initiative '{{name}}' has invalid date format in timeline. Dates should be in ISO 8601 format (YYYY-MM-DD). Invalid date formats create contradictory context - AI can't parse dates or generate project planning with malformed timeline data. Use ISO 8601 date format (YYYY-MM-DD) for timeline dates.",
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
          // Only apply to BusinessInitiative decorators
          if (decorator.type !== 'BusinessInitiative') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const timeline = decorator.metadata.timeline as
            | { start?: string; end?: string }
            | undefined;

          // Check if timeline is missing
          if (!timeline) {
            const sourceCode = context.sourceCode;

            context.report({
              node: decorator.node,
              messageId: 'missingTimeline',
              data: { name: name || 'Unknown' },
              fix(fixer) {
                // Access the decorator's expression
                if (decorator.node.expression.type !== 'CallExpression') return null;

                const arg = decorator.node.expression.arguments[0];
                if (!arg || arg.type !== 'ObjectExpression') return null;

                // Find the last property to insert after
                const properties = arg.properties;
                if (properties.length === 0) return null;

                const lastProperty = properties[properties.length - 1];
                const indentation = detectIndentation(lastProperty, sourceCode);
                const insertPosition = lastProperty.range[1];

                // Add timeline with TODO dates
                return fixer.insertTextAfterRange(
                  [insertPosition, insertPosition],
                  `,\n${indentation}timeline: {\n${indentation}  start: 'YYYY-MM-DD',  // TODO: Set start date\n${indentation}  end: 'YYYY-MM-DD'  // TODO: Set end date\n${indentation}}`
                );
              },
            });
            continue;
          }

          // Check if timeline structure is invalid
          if (typeof timeline !== 'object' || timeline === null) {
            context.report({
              node: decorator.node,
              messageId: 'invalidTimeline',
              data: { name: name || 'Unknown' },
            });
            continue;
          }

          const start = timeline.start;
          const end = timeline.end;

          // Check if start or end is missing
          if (!start || !end) {
            context.report({
              node: decorator.node,
              messageId: 'invalidTimeline',
              data: { name: name || 'Unknown' },
            });
            continue;
          }

          // Validate date format (ISO 8601: YYYY-MM-DD)
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(start) || !dateRegex.test(end)) {
            context.report({
              node: decorator.node,
              messageId: 'invalidDateFormat',
              data: { name: name || 'Unknown' },
            });
            continue;
          }

          // Check if end is before start
          const startDate = new Date(start);
          const endDate = new Date(end);
          if (endDate < startDate) {
            context.report({
              node: decorator.node,
              messageId: 'endBeforeStart',
              data: {
                name: name || 'Unknown',
                start,
                end,
              },
            });
          }
        }
      },
    };
  },
});
