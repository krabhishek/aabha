/**
 * Collaboration Synchronicity-Channel Matching Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **synchronicity must match communication channel**.
 * Marking a Zoom meeting as "asynchronous" or an email thread as "synchronous" creates contradictory
 * context that confuses AI systems and participants about collaboration expectations.
 *
 * Mismatched synchronicity-channel causes:
 * - **Confused expectations** - Participants unsure if real-time participation is required
 * - **Wrong preparation** - Preparing for live discussion when it's actually async review
 * - **AI scheduling errors** - AI tries to find meeting slots for async document reviews
 * - **Tool mismatches** - Wrong collaboration tools suggested for the interaction type
 *
 * Proper alignment enables:
 * 1. **Clear expectations** - Participants know if they need to attend live or can respond async
 * 2. **Appropriate tools** - AI suggests correct tools for the interaction type
 * 3. **Smart scheduling** - AI only schedules meetings for truly synchronous collaborations
 * 4. **Participation guidance** - AI knows whether to gather responses over time or in real-time
 * 5. **Communication norms** - Team develops consistent patterns for different channel types
 *
 * **What it checks:**
 * - Synchronous collaborations use synchronous channels (in-person, video-call, phone)
 * - Asynchronous collaborations use asynchronous channels (email-thread, document-review)
 * - Mixed synchronicity allows flexible channels (instant-message, hybrid)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Aligned synchronicity and channel
 * @Collaboration({
 *   name: 'Architecture Review',
 *   synchronicity: 'synchronous',
 *   communicationChannel: 'video-call'
 * })
 *
 * @Collaboration({
 *   name: 'RFC Review',
 *   synchronicity: 'asynchronous',
 *   communicationChannel: 'document-review'
 * })
 *
 * @Collaboration({
 *   name: 'Quick Questions',
 *   synchronicity: 'mixed',
 *   communicationChannel: 'instant-message'
 * })
 *
 * // ❌ Bad - Synchronous but async channel
 * @Collaboration({
 *   synchronicity: 'synchronous',
 *   communicationChannel: 'email-thread'  // Email is async!
 * })
 *
 * // ❌ Bad - Asynchronous but sync channel
 * @Collaboration({
 *   synchronicity: 'asynchronous',
 *   communicationChannel: 'video-call'  // Video calls are sync!
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'synchronicityChannelMismatch';

const SYNCHRONOUS_CHANNELS = ['in-person-meeting', 'video-call', 'phone'];
const ASYNCHRONOUS_CHANNELS = ['email-thread', 'document-review'];

export const collaborationSynchronicityChannelMatching = createRule<[], MessageIds>({
  name: 'collaboration-synchronicity-channel-matching',
  meta: {
    type: 'problem',
    docs: {
      description: 'Collaboration synchronicity should match the communication channel. In context engineering, aligned synchronicity-channel creates clear expectations and enables AI to suggest appropriate tools and scheduling strategies.',
    },
    messages: {
      synchronicityChannelMismatch: "Collaboration '{{collaborationName}}' is marked {{synchronicity}} but uses {{channelType}} channel '{{channel}}'. In context engineering, mismatched synchronicity and channel creates contradictory context. {{suggestion}} This alignment helps AI systems suggest appropriate tools, determine if scheduling is needed, and set correct participant expectations about real-time vs asynchronous participation.",
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
          const synchronicity = decorator.metadata.synchronicity as string | undefined;
          const communicationChannel = decorator.metadata.communicationChannel as string | undefined;

          if (!synchronicity || !communicationChannel) continue;

          const isSynchronous = synchronicity === 'synchronous';
          const isAsynchronous = synchronicity === 'asynchronous';

          if (isSynchronous && ASYNCHRONOUS_CHANNELS.includes(communicationChannel)) {
            context.report({
              node: decorator.node,
              messageId: 'synchronicityChannelMismatch',
              data: {
                collaborationName: collaborationName || 'Unknown',
                synchronicity,
                channelType: 'asynchronous',
                channel: communicationChannel,
                suggestion: "Consider marking as 'asynchronous' or 'mixed', or switch to a synchronous channel like 'video-call' or 'in-person-meeting'.",
              },
            });
          }

          if (isAsynchronous && SYNCHRONOUS_CHANNELS.includes(communicationChannel)) {
            context.report({
              node: decorator.node,
              messageId: 'synchronicityChannelMismatch',
              data: {
                collaborationName: collaborationName || 'Unknown',
                synchronicity,
                channelType: 'synchronous',
                channel: communicationChannel,
                suggestion: "Consider marking as 'synchronous' or 'mixed', or switch to an asynchronous channel like 'email-thread' or 'document-review'.",
              },
            });
          }
        }
      },
    };
  },
});
