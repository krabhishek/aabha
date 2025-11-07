/**
 * Action Duration Realism Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **estimatedDuration** provides critical timing context
 * that AI systems use to generate timeouts, optimize workflows, and set user expectations. When
 * duration estimates contradict other properties (e.g., fully-automated but 'long' duration), you
 * create unrealistic context that leads AI to generate incorrect timeout configurations and poor
 * UX implementations.
 *
 * Realistic duration context helps AI understand:
 * 1. **Performance expectations** - Should this be optimized? Is it a bottleneck?
 * 2. **Timeout configuration** - How long to wait before considering it hung?
 * 3. **UX patterns** - Show spinner? Progress bar? "This may take a while" message?
 * 4. **Workflow timing** - Can we parallelize? What's the critical path?
 *
 * When AI sees "fully-automated" with "long" duration, it gets contradictory signals:
 * - "fully-automated" suggests: instant/quick execution, no waiting
 * - "long" suggests: show progress indicators, might take minutes
 *
 * This contradiction prevents AI from generating appropriate UI/UX code, timeout logic, and
 * workflow optimizations. Similarly, "manual" with "instant" is physically impossible.
 *
 * **What it checks:**
 * - Fully-automated actions SHOULD be 'instant' or 'quick' (not 'medium' or 'long')
 * - Manual actions CANNOT be 'instant' (humans need time)
 * - Atomic scope actions SHOULD be quick (info-level suggestion)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Automated action with realistic duration
 * @Action({
 *   name: 'Generate Account Number',
 *   automationLevel: 'fully-automated',
 *   estimatedDuration: 'instant'  // < 1 second
 * })
 *
 * // ✅ Good - Manual action with realistic duration
 * @Action({
 *   name: 'Review Application',
 *   automationLevel: 'manual',
 *   estimatedDuration: 'medium'  // 1-5 minutes, realistic for human review
 * })
 *
 * // ✅ Good - Atomic scope with quick duration
 * @Action({
 *   name: 'Validate Email Format',
 *   scope: ActionScope.Atomic,
 *   estimatedDuration: 'instant'  // Quick validation
 * })
 *
 * // ⚠️ Warning - Contradictory timing context
 * @Action({
 *   name: 'Call External API',
 *   automationLevel: 'fully-automated',
 *   estimatedDuration: 'long'  // Contradiction! Automated but slow?
 *   // AI will generate wrong timeouts and show wrong UX
 * })
 *
 * // ⚠️ Warning - Physically impossible
 * @Action({
 *   name: 'Manual Document Review',
 *   automationLevel: 'manual',
 *   estimatedDuration: 'instant'  // Humans can't review instantly!
 * })
 * ```
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

/**
 * Duration ranking (1 = fastest, 5 = slowest)
 */
const DURATION_RANKING: Record<string, number> = {
  instant: 1, // < 1 second
  quick: 2, // < 1 minute
  short: 3, // 1-5 minutes
  medium: 4, // 5-30 minutes
  long: 5, // > 30 minutes
};

type MessageIds = 'automatedActionLongDuration' | 'manualActionInstant' | 'atomicActionLongDuration';

export const actionDurationRealism = createRule<[], MessageIds>({
  name: 'action-duration-realism',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Duration estimates should align with automation level and scope to create realistic timing context for AI systems',
    },
    messages: {
      automatedActionLongDuration:
        "Action '{{name}}' is fully-automated but has estimatedDuration='{{duration}}'. This creates contradictory timing context! Fully automated actions run without human intervention - they should be 'instant' (< 1s) or 'quick' (< 1min), not 'medium' or 'long'. AI systems use duration context to generate timeouts, UX patterns, and workflow optimizations. With contradictory signals, AI can't determine if it should show 'please wait' messages, implement aggressive timeouts, or optimize this as a bottleneck. If this action truly takes minutes, it suggests external API calls or heavy computation that might need optimization.",
      manualActionInstant:
        "Action '{{name}}' is manual but has estimatedDuration='instant'. This is physically impossible! Manual actions require human interaction - even the quickest button click takes at least 'quick' (< 1 minute). Instant duration is only realistic for automated computations. AI systems use this timing context to generate appropriate UX: 'instant' means no loading indicator, but manual actions need user interaction time. This creates impossible expectations. Use 'quick' at minimum for manual actions, or 'short'/'medium' for review/approval workflows.",
      atomicActionLongDuration:
        "Action '{{name}}' has scope='Atomic' but estimatedDuration='{{duration}}'. Atomic scope means 'smallest unit of work' - these are typically quick operations (< 5 minutes). Long-running atomic actions suggest the scope is wrong. Consider: (1) If this orchestrates multiple steps, use 'Composite' scope. (2) If this is a business milestone, use 'Journey' scope. (3) If duration is truly atomic but long, it might indicate a performance optimization opportunity. Correct scope helps AI understand workflow structure and generate appropriate orchestration patterns.",
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
          // Only apply to Action decorators
          if (decorator.type !== 'Action') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const estimatedDuration = decorator.metadata.estimatedDuration as string | undefined;
          const automationLevel = decorator.metadata.automationLevel as string | undefined;
          const scope = decorator.metadata.scope as string | undefined;

          // Skip if duration not specified
          if (!estimatedDuration) continue;

          const durationRank = DURATION_RANKING[estimatedDuration];
          if (!durationRank) continue; // Unknown duration value

          // Check automation level alignment
          if (automationLevel === 'fully-automated' && durationRank > 2) {
            // Automated but medium/long duration
            context.report({
              node: decorator.node,
              messageId: 'automatedActionLongDuration',
              data: {
                name: name || 'Unknown',
                duration: estimatedDuration,
              },
            });
          }

          if (automationLevel === 'manual' && durationRank === 1) {
            // Manual but instant duration (impossible)
            context.report({
              node: decorator.node,
              messageId: 'manualActionInstant',
              data: {
                name: name || 'Unknown',
              },
            });
          }

          // Check scope alignment (info-level)
          if (scope === 'Atomic' && durationRank > 3) {
            // Atomic but medium/long duration
            context.report({
              node: decorator.node,
              messageId: 'atomicActionLongDuration',
              data: {
                name: name || 'Unknown',
                duration: estimatedDuration,
              },
            });
          }
        }
      },
    };
  },
});
