/**
 * Collaboration Location Type Validation Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **location details must match location type** to enable
 * effective collaboration execution. Physical locations need addresses, virtual ones need platform
 * details, and hybrid locations need both. Mismatched location information confuses participants
 * and prevents AI from providing appropriate support.
 *
 * Incomplete location information causes:
 * - **Participant confusion** - "Where do I go?" when physical location lacks address
 * - **Access issues** - "What's the meeting link?" when virtual location lacks platform
 * - **Failed automation** - AI can't generate calendar invites without platform/address
 * - **Hybrid chaos** - Some join remotely, some in-person, but details missing
 *
 * Complete location information enables:
 * 1. **Clear instructions** - AI can provide exact directions or meeting links
 * 2. **Calendar integration** - AI can populate calendar events with location details
 * 3. **Reminder customization** - AI reminds in-person attendees earlier for travel time
 * 4. **Resource booking** - AI can reserve conference rooms or virtual meeting rooms
 * 5. **Accessibility support** - AI can suggest accessible routes or virtual participation
 *
 * **What it checks:**
 * - Physical locations specify address
 * - Virtual locations specify platform (Zoom, Teams, etc.)
 * - Hybrid locations specify both address and platform
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete location details
 * @Collaboration({
 *   name: 'In-Person Review',
 *   location: {
 *     type: 'physical',
 *     address: 'Conference Room A, Building 3'
 *   }
 * })
 *
 * @Collaboration({
 *   name: 'Remote Planning',
 *   location: {
 *     type: 'virtual',
 *     virtualPlatform: 'Zoom'
 *   }
 * })
 *
 * @Collaboration({
 *   name: 'Hybrid Townhall',
 *   location: {
 *     type: 'hybrid',
 *     address: 'Auditorium, HQ',
 *     virtualPlatform: 'Microsoft Teams'
 *   }
 * })
 *
 * // ❌ Bad - Physical without address
 * @Collaboration({
 *   location: { type: 'physical' }  // Where?
 * })
 *
 * // ❌ Bad - Virtual without platform
 * @Collaboration({
 *   location: { type: 'virtual' }  // What link?
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingPhysicalAddress' | 'missingVirtualPlatform' | 'incompleteHybridLocation';

export const collaborationLocationTypeValidation = createRule<[], MessageIds>({
  name: 'collaboration-location-type-validation',
  meta: {
    type: 'problem',
    docs: {
      description: 'Collaboration location details should match the type. In context engineering, complete location information enables AI to generate calendar invites, provide directions, and ensure all participants can access the collaboration.',
    },
    messages: {
      missingPhysicalAddress: "Collaboration '{{collaborationName}}' has physical location but no address specified. In context engineering, physical locations require explicit addresses so AI systems can provide directions, estimate travel time, and include location details in calendar invites. Specify the full address or room identifier (e.g., 'Conference Room A, Building 3, 123 Main St' or 'Auditorium, HQ Campus').",
      missingVirtualPlatform: "Collaboration '{{collaborationName}}' has virtual location but no virtualPlatform specified. In context engineering, virtual locations require platform details so AI systems can generate meeting links, send appropriate reminders, and help participants access the collaboration. Specify the platform (e.g., 'Zoom', 'Microsoft Teams', 'Google Meet', 'Slack Huddle').",
      incompleteHybridLocation: "Collaboration '{{collaborationName}}' has hybrid location but is missing {{missing}}. In context engineering, hybrid locations require both physical address (for in-person attendees) and virtual platform (for remote attendees) to ensure all participants can access the collaboration. AI systems need complete information to generate appropriate calendar invites and reminders for both attendance modes.",
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
          const location = decorator.metadata.location as {
            type?: string;
            address?: string;
            virtualPlatform?: string;
          } | undefined;

          if (!location || !location.type) continue;

          if (location.type === 'physical' && !location.address) {
            context.report({
              node: decorator.node,
              messageId: 'missingPhysicalAddress',
              data: {
                collaborationName: collaborationName || 'Unknown',
              },
            });
          }

          if (location.type === 'virtual' && !location.virtualPlatform) {
            context.report({
              node: decorator.node,
              messageId: 'missingVirtualPlatform',
              data: {
                collaborationName: collaborationName || 'Unknown',
              },
            });
          }

          if (location.type === 'hybrid') {
            if (!location.address || !location.virtualPlatform) {
              const missing = !location.address
                ? !location.virtualPlatform
                  ? 'address and virtualPlatform'
                  : 'address'
                : 'virtualPlatform';

              context.report({
                node: decorator.node,
                messageId: 'incompleteHybridLocation',
                data: {
                  collaborationName: collaborationName || 'Unknown',
                  missing,
                },
              });
            }
          }
        }
      },
    };
  },
});
