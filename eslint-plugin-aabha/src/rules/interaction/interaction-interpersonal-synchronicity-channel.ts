/**
 * Interaction Interpersonal Synchronicity Channel Rule
 *
 * **Why this rule exists:**
 * The communication channel must align with synchronicity. Synchronous channels (in-person meetings,
 * phone calls, video calls) require simultaneous participation, while asynchronous channels (email,
 * letter) allow time-delayed responses. Mismatched synchronicity creates confusion about participation
 * expectations.
 *
 * Mismatched synchronicity/channel causes:
 * - **Participation confusion** - Unclear if immediate response required
 * - **Scheduling conflicts** - Async channels treated as sync
 * - **Tool misuse** - Wrong collaboration tools selected
 * - **Expectation mismatch** - Response time expectations unclear
 *
 * Correct matching enables:
 * 1. **Clear expectations** - Participants know response time requirements
 * 2. **Proper tooling** - Select appropriate collaboration platforms
 * 3. **Efficient scheduling** - Only sync channels need calendar blocks
 * 4. **Workflow clarity** - Team understands interaction patterns
 *
 * **Synchronicity-Channel Guidelines:**
 * - **Synchronous**: in-person-meeting, video-call, phone, instant-message
 * - **Asynchronous**: email, letter
 *
 * **What it checks:**
 * - communicationChannel aligns with declared synchronicity
 * - Warns if channel/synchronicity combination seems mismatched
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Phone call is synchronous
 * @Interaction({
 *   name: 'Client Consultation',
 *   layer: InteractionLayer.Interpersonal,
 *   interpersonalConfig: {
 *     communicationChannel: 'phone',
 *     synchronicity: 'synchronous'
 *   }
 * })
 *
 * // ✅ Good - Email is asynchronous
 * @Interaction({
 *   name: 'Monthly Report',
 *   layer: InteractionLayer.Interpersonal,
 *   interpersonalConfig: {
 *     communicationChannel: 'email',
 *     synchronicity: 'asynchronous'
 *   }
 * })
 *
 * // ❌ Bad - Email marked as synchronous
 * @Interaction({
 *   name: 'Project Update',
 *   interpersonalConfig: {
 *     communicationChannel: 'email',
 *     synchronicity: 'synchronous'  // Wrong! Email is async
 *   }
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'mismatch';

// Map channels to their typical synchronicity
const SYNCHRONOUS_CHANNELS = ['in-person-meeting', 'video-call', 'phone', 'instant-message'];
const ASYNCHRONOUS_CHANNELS = ['email', 'letter'];

export const interactionInterpersonalSynchronicityChannel = createRule<[], MessageIds>({
  name: 'interaction-interpersonal-synchronicity-channel',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Communication channel must align with synchronicity. In context engineering, synchronous channels (in-person, video, phone) require simultaneous participation, while asynchronous channels (email, letter) allow time-delayed responses.',
    },
    messages: {
      mismatch:
        "Interaction '{{interactionName}}' uses channel '{{channel}}' with synchronicity '{{synchronicity}}'. This is a mismatch. In context engineering, {{channel}} is typically {{expectedSync}}. Synchronous channels (in-person-meeting, video-call, phone, instant-message) require simultaneous participation. Asynchronous channels (email, letter) allow time-delayed responses. Change synchronicity to '{{expectedSync}}' or reconsider the communication channel.",
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
          if (decorator.type !== 'Interaction') continue;

          const interactionName = decorator.metadata.name as string | undefined;
          const layer = decorator.metadata.layer as string | undefined;

          // Only applies to Interpersonal layer
          if (layer !== 'Interpersonal') continue;

          const interpersonalConfig = decorator.metadata.interpersonalConfig as
            | {
                communicationChannel?: string;
                synchronicity?: 'synchronous' | 'asynchronous';
              }
            | undefined;

          const channel = interpersonalConfig?.communicationChannel;
          const synchronicity = interpersonalConfig?.synchronicity;

          if (!channel || !synchronicity) continue;

          // Check for mismatch
          let expectedSync: string | null = null;
          if (SYNCHRONOUS_CHANNELS.includes(channel) && synchronicity === 'asynchronous') {
            expectedSync = 'synchronous';
          } else if (ASYNCHRONOUS_CHANNELS.includes(channel) && synchronicity === 'synchronous') {
            expectedSync = 'asynchronous';
          }

          if (expectedSync) {
            context.report({
              node: decorator.node,
              messageId: 'mismatch',
              data: {
                interactionName: interactionName || 'Unknown',
                channel,
                synchronicity,
                expectedSync,
              },
            });
          }
        }
      },
    };
  },
});
