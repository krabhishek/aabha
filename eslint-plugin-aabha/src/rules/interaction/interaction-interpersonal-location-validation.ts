/**
 * Interaction Interpersonal Location Validation Rule
 *
 * **Why this rule exists:**
 * The location type must align with the communication channel. Physical channels (in-person meetings)
 * require physical or hybrid locations, while virtual channels (video calls, phone, email) use
 * virtual locations. Mismatched location/channel combinations create logistical confusion.
 *
 * Mismatched location/channel causes:
 * - **Logistical confusion** - Participants unsure where to show up
 * - **Resource waste** - Book physical rooms for virtual meetings
 * - **Accessibility issues** - Remote participants excluded from physical-only events
 * - **Technology mismatch** - Wrong equipment or platforms prepared
 *
 * Correct matching enables:
 * 1. **Clear logistics** - Participants know if physical attendance required
 * 2. **Resource efficiency** - Book rooms only when needed
 * 3. **Accessibility** - Support remote participation appropriately
 * 4. **Proper preparation** - Ensure right technology and facilities
 *
 * **Location-Channel Guidelines:**
 * - **Physical location**: in-person-meeting (may have hybrid option)
 * - **Virtual location**: video-call, phone, instant-message, email, letter
 * - **Hybrid location**: in-person-meeting with virtual option
 *
 * **What it checks:**
 * - location.type aligns with communicationChannel
 * - Physical locations for in-person meetings
 * - Virtual locations for remote communication channels
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - In-person meeting with physical location
 * @Interaction({
 *   name: 'Board Meeting',
 *   layer: InteractionLayer.Interpersonal,
 *   interpersonalConfig: {
 *     communicationChannel: 'in-person-meeting',
 *     location: {
 *       type: 'physical',
 *       address: 'Conference Room A'
 *     }
 *   }
 * })
 *
 * // ✅ Good - Video call with virtual location
 * @Interaction({
 *   name: 'Client Review',
 *   interpersonalConfig: {
 *     communicationChannel: 'video-call',
 *     location: {
 *       type: 'virtual',
 *       virtualPlatform: 'Zoom'
 *     }
 *   }
 * })
 *
 * // ❌ Bad - Video call with physical location
 * @Interaction({
 *   interpersonalConfig: {
 *     communicationChannel: 'video-call',
 *     location: {
 *       type: 'physical',  // Wrong! Video call should be virtual
 *       address: 'Room 101'
 *     }
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

const PHYSICAL_CHANNELS = ['in-person-meeting'];
const VIRTUAL_CHANNELS = ['video-call', 'phone', 'instant-message', 'email', 'letter'];

export const interactionInterpersonalLocationValidation = createRule<[], MessageIds>({
  name: 'interaction-interpersonal-location-validation',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Location type must align with communication channel. In context engineering, physical channels (in-person-meeting) require physical/hybrid locations, while virtual channels (video-call, phone, email) use virtual locations.',
    },
    messages: {
      mismatch:
        "Interaction '{{interactionName}}' uses channel '{{channel}}' with location type '{{locationType}}'. This is a mismatch. In context engineering, {{channel}} typically uses {{expectedLocation}} location. Physical channels (in-person-meeting) need physical or hybrid locations with addresses. Virtual channels (video-call, phone, email, instant-message) need virtual locations with platform details. Update location.type to '{{expectedLocation}}' or reconsider the communication channel.",
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
                location?: {
                  type?: 'physical' | 'virtual' | 'hybrid';
                };
              }
            | undefined;

          const channel = interpersonalConfig?.communicationChannel;
          const locationType = interpersonalConfig?.location?.type;

          if (!channel || !locationType) continue;

          // Check for mismatch
          let expectedLocation: string | null = null;
          if (PHYSICAL_CHANNELS.includes(channel) && locationType === 'virtual') {
            expectedLocation = 'physical or hybrid';
          } else if (VIRTUAL_CHANNELS.includes(channel) && locationType === 'physical') {
            expectedLocation = 'virtual';
          }

          if (expectedLocation) {
            context.report({
              node: decorator.node,
              messageId: 'mismatch',
              data: {
                interactionName: interactionName || 'Unknown',
                channel,
                locationType,
                expectedLocation,
              },
            });
          }
        }
      },
    };
  },
});
