/**
 * Collaboration Frequency-Duration Alignment Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **frequency and duration must be proportional** to avoid
 * participant fatigue and ensure sustainable collaboration patterns. Daily 3-hour meetings or weekly
 * 15-minute check-ins signal misalignment between how often and how long teams collaborate.
 *
 * Misaligned frequency-duration causes:
 * - **Meeting fatigue** - Daily 2-hour standups burn out teams
 * - **Inefficient patterns** - Weekly 10-minute meetings waste context-switching time
 * - **Scheduling conflicts** - Long frequent meetings monopolize calendars
 * - **AI scheduling failures** - AI can't pack calendars with unrealistic patterns
 *
 * Proper alignment enables:
 * 1. **Sustainable patterns** - Frequent meetings stay short, infrequent ones can be longer
 * 2. **Effective scheduling** - AI can suggest appropriate durations for given frequencies
 * 3. **Energy management** - Teams maintain engagement without burnout
 * 4. **Pattern recognition** - AI detects unhealthy collaboration patterns
 *
 * **What it checks:**
 * - Daily collaborations should be ≤1 hour
 * - Weekly collaborations should be ≤2 hours
 * - Frequent collaborations shouldn't be excessively long
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Aligned frequency and duration
 * @Collaboration({
 *   name: 'Daily Standup',
 *   frequency: 'daily',
 *   duration: 'PT15M'  // 15 min - appropriate for daily
 * })
 *
 * @Collaboration({
 *   name: 'Weekly Planning',
 *   frequency: 'weekly',
 *   duration: 'PT1H30M'  // 1.5 hours - fine for weekly
 * })
 *
 * // ❌ Bad - Daily meeting too long
 * @Collaboration({
 *   name: 'Daily Review',
 *   frequency: 'daily',
 *   duration: 'PT2H'  // 2 hours daily = burnout
 * })
 *
 * // ❌ Bad - Weekly meeting too long
 * @Collaboration({
 *   name: 'Weekly Sync',
 *   frequency: 'weekly',
 *   duration: 'PT3H'  // 3 hours weekly is excessive
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'dailyTooLong' | 'weeklyTooLong';

function parseDuration(duration: string): number | null {
  const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?$/);
  if (!match) return null;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  return hours * 60 + minutes;
}

export const collaborationFrequencyDurationAlignment = createRule<[], MessageIds>({
  name: 'collaboration-frequency-duration-alignment',
  meta: {
    type: 'problem',
    docs: {
      description: 'Collaboration frequency should align with duration. In context engineering, proper alignment prevents meeting fatigue and creates sustainable collaboration patterns.',
    },
    messages: {
      dailyTooLong: "Collaboration '{{collaborationName}}' is daily but lasts {{hours}}hr {{minutes}}min. In context engineering, daily meetings should typically be ≤1 hour to avoid participant fatigue and calendar monopolization. Frequent meetings require tight focus to remain sustainable. Consider shortening the duration or reducing the frequency to 2-3 times per week. AI systems use frequency-duration alignment to detect unhealthy collaboration patterns that lead to burnout.",
      weeklyTooLong: "Collaboration '{{collaborationName}}' is weekly but lasts {{hours}} hours. In context engineering, weekly meetings should typically be ≤2 hours to maintain engagement and efficiency. Longer durations suggest this might be better split into multiple focused sessions or scheduled less frequently. AI systems use these heuristics to identify collaboration patterns that may reduce team productivity and suggest improvements.",
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
          const frequency = decorator.metadata.frequency as string | undefined;
          const duration = decorator.metadata.duration as string | undefined;

          if (!frequency || !duration) continue;

          const durationMinutes = parseDuration(duration);
          if (durationMinutes === null) continue;

          if (frequency === 'daily' && durationMinutes > 60) {
            const hours = Math.floor(durationMinutes / 60);
            const minutes = durationMinutes % 60;
            context.report({
              node: decorator.node,
              messageId: 'dailyTooLong',
              data: {
                collaborationName: collaborationName || 'Unknown',
                hours: hours.toString(),
                minutes: minutes.toString(),
              },
            });
          }

          if (frequency === 'weekly' && durationMinutes > 120) {
            context.report({
              node: decorator.node,
              messageId: 'weeklyTooLong',
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
