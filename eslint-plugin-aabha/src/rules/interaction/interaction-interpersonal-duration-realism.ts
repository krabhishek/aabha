/**
 * Interaction Interpersonal Duration Realism Rule
 *
 * **Why this rule exists:**
 * Interpersonal interactions (meetings, phone calls, consultations) require realistic duration
 * estimates for proper scheduling and resource planning. Missing or unrealistic durations lead
 * to calendar conflicts, participant frustration, and poor time management.
 *
 * Missing duration estimates cause:
 * - **Scheduling conflicts** - Cannot allocate appropriate time blocks
 * - **Participant frustration** - Meetings run over or end too early
 * - **Resource waste** - Room bookings or video licenses not optimized
 * - **Planning failures** - Cannot estimate project timelines accurately
 *
 * Proper duration estimates enable:
 * 1. **Efficient scheduling** - Calendar blocks match actual meeting times
 * 2. **Resource optimization** - Appropriate room sizes and technology
 * 3. **Participant preparedness** - Know how much time to allocate
 * 4. **Timeline planning** - Accurate project scheduling
 *
 * **What it checks:**
 * - Interpersonal layer interactions have duration specified
 * - Duration is in ISO 8601 format (e.g., 'PT30M', 'PT2H')
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Meeting with duration
 * @Interaction({
 *   name: 'Portfolio Review Meeting',
 *   layer: InteractionLayer.Interpersonal,
 *   pattern: InteractionPattern.Meeting,
 *   interpersonalConfig: {
 *     communicationChannel: 'in-person-meeting',
 *     duration: 'PT1H'  // 1 hour
 *   }
 * })
 *
 * // ❌ Bad - Meeting without duration
 * @Interaction({
 *   name: 'Portfolio Review Meeting',
 *   layer: InteractionLayer.Interpersonal,
 *   interpersonalConfig: {
 *     communicationChannel: 'in-person-meeting'
 *     // Missing duration!
 *   }
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingDuration';

export const interactionInterpersonalDurationRealism = createRule<[], MessageIds>({
  name: 'interaction-interpersonal-duration-realism',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Interpersonal layer interactions should have duration specified in interpersonalConfig.duration. In context engineering, realistic duration estimates enable efficient scheduling, resource optimization, and timeline planning.',
    },
    messages: {
      missingDuration:
        "Interaction '{{interactionName}}' is Interpersonal layer but lacks duration estimate. In context engineering, interpersonal interactions (meetings, calls, consultations) need realistic duration estimates for proper scheduling and resource planning. Add interpersonalConfig.duration in ISO 8601 format. Examples: 'PT15M' (15 min), 'PT30M' (30 min), 'PT1H' (1 hour), 'PT2H' (2 hours).",
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
          if (decorator.type !== 'Interaction') continue;

          const interactionName = decorator.metadata.name as string | undefined;
          const layer = decorator.metadata.layer as string | undefined;

          // Only applies to Interpersonal layer
          if (layer !== 'Interpersonal') continue;

          const interpersonalConfig = decorator.metadata.interpersonalConfig as
            | {
                duration?: string;
              }
            | undefined;

          if (!interpersonalConfig?.duration) {
            context.report({
              node: decorator.node,
              messageId: 'missingDuration',
              data: {
                interactionName: interactionName || 'Unknown',
              },
              fix(fixer) {
                // Auto-fix: Add duration with TODO
                const source = context.sourceCode.getText(decorator.node);
                const interpersonalConfigMatch = source.match(/interpersonalConfig:\s*{/);

                if (!interpersonalConfigMatch) {
                  // No interpersonalConfig - skip auto-fix
                  return null;
                }

                const insertIndex = interpersonalConfigMatch.index! + interpersonalConfigMatch[0].length;
                const insertion = `\n      duration: 'PT30M', // TODO: Adjust duration (ISO 8601: PT15M=15min, PT1H=1hr, PT2H=2hr)`;
                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertIndex, decorator.node.range[0] + insertIndex],
                  insertion,
                );
              },
            });
          }
        }
      },
    };
  },
});
