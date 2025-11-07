/**
 * Interaction Layer Pattern Alignment Rule
 *
 * **Why this rule exists:**
 * Each InteractionLayer has typical patterns that make sense for that architectural layer.
 * For example, Frontend layers typically use UserGesture, FormInteraction, Navigation patterns,
 * while Backend layers use RequestResponse, Event, Streaming patterns. Using misaligned
 * patterns suggests architectural confusion or incorrect layer classification.
 *
 * Misaligned layer/pattern causes:
 * - **Architectural confusion** - Pattern doesn't fit the layer's purpose
 * - **Implementation challenges** - Technologies for the layer don't support the pattern
 * - **Code generation errors** - AI systems generate incompatible scaffolding
 * - **Team misunderstanding** - Developers unsure what layer represents
 *
 * Correct alignment enables:
 * 1. **Clear architecture** - Each layer has appropriate interaction patterns
 * 2. **Technology fit** - Pattern matches layer's technological capabilities
 * 3. **AI scaffolding** - Systems generate correct implementations
 * 4. **Team clarity** - Layer purpose is immediately clear
 *
 * **Layer-Pattern Guidelines:**
 * - **Frontend**: UserGesture, FormInteraction, Navigation, UIStateChange
 * - **Backend**: RequestResponse, Event, Streaming, Batch, ServerSentEvents, WebSocket, Polling
 * - **Data**: Query, Command, Transaction
 * - **Device**: SensorRead, DeviceNotification, LocalStorage
 * - **External**: RequestResponse, Event, Streaming (third-party services)
 * - **Orchestration**: Workflow, Choreography
 * - **Interpersonal**: Meeting, PhoneCall, EmailExchange, InstantMessage
 * - **Manual**: ManualReview, PhysicalDocument, PhysicalSignature, InPersonVerification
 * - **Organizational**: FormalAgreement, RegulatorySubmission, Audit
 *
 * **What it checks:**
 * - Interaction pattern is appropriate for the declared layer
 * - Warns if pattern seems misaligned with typical layer usage
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Frontend with UI pattern
 * @Interaction({
 *   name: 'Login Button',
 *   layer: InteractionLayer.Frontend,
 *   pattern: InteractionPattern.UserGesture
 * })
 *
 * // ✅ Good - Backend with service pattern
 * @Interaction({
 *   name: 'Account API',
 *   layer: InteractionLayer.Backend,
 *   pattern: InteractionPattern.RequestResponse
 * })
 *
 * // ❌ Bad - Frontend with database pattern
 * @Interaction({
 *   name: 'User Profile',
 *   layer: InteractionLayer.Frontend,
 *   pattern: InteractionPattern.Query  // Should be in Data layer!
 * })
 *
 * // ❌ Bad - Data layer with UI pattern
 * @Interaction({
 *   name: 'User Repository',
 *   layer: InteractionLayer.Data,
 *   pattern: InteractionPattern.UserGesture  // Should be Query/Command!
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'patternMismatch';

// Map layers to their typical patterns
const LAYER_PATTERN_MAP: Record<string, string[]> = {
  Frontend: ['user-gesture', 'form-interaction', 'navigation', 'ui-state-change'],
  Backend: ['request-response', 'event', 'streaming', 'batch', 'server-sent-events', 'websocket', 'polling'],
  Data: ['query', 'command', 'transaction'],
  Device: ['sensor-read', 'device-notification', 'local-storage'],
  External: ['request-response', 'event', 'streaming'],
  Orchestration: ['workflow', 'choreography'],
  Interpersonal: ['meeting', 'phone-call', 'email-exchange', 'instant-message'],
  Manual: ['manual-review', 'physical-document', 'physical-signature', 'in-person-verification'],
  Organizational: ['formal-agreement', 'regulatory-submission', 'audit'],
};

export const interactionLayerPatternAlignment = createRule<[], MessageIds>({
  name: 'interaction-layer-pattern-alignment',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Interaction pattern should align with the declared layer. In context engineering, Frontend uses UI patterns (UserGesture, FormInteraction), Backend uses service patterns (RequestResponse, Event), Data uses database patterns (Query, Command), etc. Misaligned patterns indicate architectural confusion.',
    },
    messages: {
      patternMismatch:
        "Interaction '{{interactionName}}' has layer '{{layer}}' but uses pattern '{{pattern}}'. This pattern is not typical for {{layer}} layer. In context engineering, {{layer}} layer typically uses: {{expectedPatterns}}. Using misaligned patterns creates architectural confusion and may indicate the layer is incorrectly classified. Consider changing the layer or using an appropriate pattern for {{layer}}.",
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
          const pattern = decorator.metadata.pattern as string | undefined;

          if (!layer || !pattern) continue;

          const expectedPatterns = LAYER_PATTERN_MAP[layer];
          if (!expectedPatterns) continue; // Unknown layer, skip

          // Check if pattern is in the expected list for this layer
          if (!expectedPatterns.includes(pattern)) {
            context.report({
              node: decorator.node,
              messageId: 'patternMismatch',
              data: {
                interactionName: interactionName || 'Unknown',
                layer,
                pattern,
                expectedPatterns: expectedPatterns.join(', '),
              },
            });
          }
        }
      },
    };
  },
});
