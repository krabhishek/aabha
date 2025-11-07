/**
 * Collaboration Duration Realism Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **realistic duration estimates** are critical for
 * effective scheduling, resource allocation, and participant energy management. Unrealistic
 * durations (5-minute strategy sessions, 12-hour daily standups) signal modeling problems.
 *
 * Unrealistic durations cause:
 * - **Meeting overruns** - 30-minute slot for 2-hour discussion leads to rushed decisions
 * - **Participant fatigue** - 6-hour meetings without breaks reduce engagement and quality
 * - **AI scheduling failures** - AI can't pack calendars properly with wrong estimates
 * - **Resource conflicts** - Conference rooms booked too short or too long
 *
 * Realistic duration estimates enable:
 * 1. **Effective scheduling** - AI can find appropriate time slots and avoid conflicts
 * 2. **Energy management** - Participants know what to expect and can prepare mentally
 * 3. **Break planning** - Long collaborations can include planned breaks
 * 4. **Accurate planning** - Teams can estimate total collaboration time per sprint/quarter
 * 5. **Red flag detection** - Very short/long durations may indicate mismodeled collaborations
 *
 * **What it checks:**
 * - Durations are at least 15 minutes (minimum realistic collaboration)
 * - Durations don't exceed 8 hours (maximum single-session duration)
 * - Warns about very short durations (<30min) that may be too brief
 * - Warns about very long durations (>4hr) that may need breaks
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Realistic durations
 * @Collaboration({
 *   name: 'Daily Standup',
 *   duration: 'PT15M'  // 15 minutes
 * })
 *
 * @Collaboration({
 *   name: 'Sprint Planning',
 *   duration: 'PT2H'  // 2 hours
 * })
 *
 * @Collaboration({
 *   name: 'Strategy Workshop',
 *   duration: 'PT6H'  // 6 hours (with breaks)
 * })
 *
 * // ❌ Bad - Too short
 * @Collaboration({
 *   name: 'Architecture Review',
 *   duration: 'PT5M'  // 5 minutes?! Too short for meaningful review
 * })
 *
 * // ❌ Bad - Too long
 * @Collaboration({
 *   name: 'Team Meeting',
 *   duration: 'PT10H'  // 10 hours?! Exceeds realistic single-session limit
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'invalidDurationFormat' | 'durationTooShort' | 'durationTooLong' | 'unusuallyShortDuration' | 'unusuallyLongDuration';

/**
 * Parse ISO 8601 duration format (PT2H30M) to minutes
 */
function parseDuration(duration: string): number | null {
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?$/);
  if (!match) return null;

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  return hours * 60 + minutes;
}

export const collaborationDurationRealism = createRule<[], MessageIds>({
  name: 'collaboration-duration-realism',
  meta: {
    type: 'problem',
    docs: {
      description: 'Collaboration durations should be realistic (15min-8hr). In context engineering, realistic duration estimates enable effective scheduling, energy management, and resource allocation.',
    },
    messages: {
      invalidDurationFormat: "Collaboration '{{collaborationName}}' has invalid duration format '{{duration}}'. In context engineering, AI systems need machine-readable duration formats. Use ISO 8601 format: 'PT2H' (2 hours), 'PT30M' (30 minutes), 'PT1H30M' (1.5 hours). This enables AI to schedule meetings, estimate total collaboration time, and detect conflicts.",
      durationTooShort: "Collaboration '{{collaborationName}}' duration is {{durationMinutes}} minutes. In context engineering, durations under 15 minutes are unrealistic for meaningful collaboration involving multiple stakeholders. Collaborations require time for context-setting, discussion, and wrap-up. Consider if this should be a quick async check instead of a formal collaboration, or increase the duration to at least 15 minutes.",
      durationTooLong: "Collaboration '{{collaborationName}}' duration is {{durationMinutes}} minutes ({{hours}} hours). In context engineering, durations over 8 hours exceed realistic single-session limits and risk participant fatigue and reduced decision quality. Consider breaking this into multiple sessions, adding explicit break times, or reassessing if this is actually multiple collaborations.",
      unusuallyShortDuration: "Collaboration '{{collaborationName}}' duration is only {{durationMinutes}} minutes. In context engineering, very short collaborations (15-30min) may indicate a quick sync or status update. Verify this duration allows sufficient time for all participants to contribute meaningfully, especially if decisions are involved. Short durations work for simple information sharing but not for complex discussions or decision-making.",
      unusuallyLongDuration: "Collaboration '{{collaborationName}}' duration is {{hours}} hours. In context engineering, collaborations over 4 hours typically indicate workshops or full-day sessions requiring explicit break planning. Long durations reduce engagement and decision quality without breaks. Consider adding break times to the collaboration definition or splitting into multiple focused sessions for better outcomes.",
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
          // Only apply to Collaboration decorators
          if (decorator.type !== 'Collaboration') {
            continue;
          }

          const collaborationName = decorator.metadata.name as string | undefined;
          const duration = decorator.metadata.duration as string | undefined;

          if (!duration) continue; // Duration is optional

          const durationMinutes = parseDuration(duration);

          if (durationMinutes === null) {
            context.report({
              node: decorator.node,
              messageId: 'invalidDurationFormat',
              data: {
                collaborationName: collaborationName || 'Unknown',
                duration,
              },
            });
            continue;
          }

          // Hard limits: 15min - 8hr (480min)
          if (durationMinutes < 15) {
            context.report({
              node: decorator.node,
              messageId: 'durationTooShort',
              data: {
                collaborationName: collaborationName || 'Unknown',
                durationMinutes: durationMinutes.toString(),
              },
            });
          } else if (durationMinutes > 480) {
            context.report({
              node: decorator.node,
              messageId: 'durationTooLong',
              data: {
                collaborationName: collaborationName || 'Unknown',
                durationMinutes: durationMinutes.toString(),
                hours: Math.floor(durationMinutes / 60).toString(),
              },
            });
          }

          // Soft warnings
          if (durationMinutes >= 15 && durationMinutes < 30) {
            context.report({
              node: decorator.node,
              messageId: 'unusuallyShortDuration',
              data: {
                collaborationName: collaborationName || 'Unknown',
                durationMinutes: durationMinutes.toString(),
              },
            });
          } else if (durationMinutes > 240 && durationMinutes <= 480) {
            context.report({
              node: decorator.node,
              messageId: 'unusuallyLongDuration',
              data: {
                collaborationName: collaborationName || 'Unknown',
                hours: Math.floor(durationMinutes / 60).toString(),
              },
            });
          }
        }
      },
    };
  },
});
