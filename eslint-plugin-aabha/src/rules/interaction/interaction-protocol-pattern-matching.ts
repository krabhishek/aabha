/**
 * Interaction Protocol Pattern Matching Rule
 *
 * **Why this rule exists:**
 * Different interaction patterns require specific protocol configurations. For example, REST APIs
 * need protocol='HTTP/HTTPS', GraphQL needs protocol='HTTP/HTTPS' with GraphQL-specific config,
 * gRPC needs protocol='gRPC', WebSocket needs protocol='WebSocket', etc. Mism atched
 * protocol/pattern combinations create implementation confusion.
 *
 * Mismatched protocol/pattern causes:
 * - **Implementation errors** - Code generated for wrong protocol
 * - **Runtime failures** - Protocol doesn't support the pattern
 * - **Configuration confusion** - Developers unsure which protocol to use
 * - **AI scaffolding errors** - Systems generate incompatible code
 *
 * Correct matching enables:
 * 1. **Clear implementation** - Pattern dictates protocol requirements
 * 2. **Type safety** - Protocol config matches pattern needs
 * 3. **AI assistance** - Systems generate correct protocol handling
 * 4. **Validation** - Catch misconfigurations early
 *
 * **Pattern-Protocol Guidelines:**
 * - REST → HTTP/HTTPS
 * - GraphQL → HTTP/HTTPS (with GraphQL layer)
 * - gRPC → gRPC protocol
 * - WebSocket → WebSocket protocol
 * - EventDriven → Message queue protocols (Kafka, RabbitMQ, etc.)
 * - BatchProcessing → File-based or database protocols
 *
 * **What it checks:**
 * - protocol field is present when required by the pattern
 * - protocol value makes sense for the declared pattern
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - REST pattern with HTTP
 * @Interaction({
 *   name: 'User API',
 *   pattern: InteractionPattern.REST,
 *   protocol: 'HTTP/HTTPS'
 * })
 *
 * // ✅ Good - gRPC pattern with gRPC protocol
 * @Interaction({
 *   name: 'Internal Service',
 *   pattern: InteractionPattern.gRPC,
 *   protocol: 'gRPC'
 * })
 *
 * // ⚠️ Warning - REST but no protocol specified
 * @Interaction({
 *   name: 'User API',
 *   pattern: InteractionPattern.REST
 *   // Missing protocol - should specify HTTP/HTTPS
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingProtocol' | 'protocolMismatch';

// Patterns that typically require explicit protocol
const PATTERNS_REQUIRING_PROTOCOL = [
  'REST',
  'GraphQL',
  'gRPC',
  'WebSocket',
  'SOAP',
  'EventDriven',
  'StreamProcessing',
];

// Common protocol-pattern associations (for helpful suggestions)
const PATTERN_PROTOCOL_SUGGESTIONS: Record<string, string[]> = {
  REST: ['HTTP/HTTPS', 'HTTP', 'HTTPS'],
  GraphQL: ['HTTP/HTTPS', 'HTTP', 'HTTPS'],
  gRPC: ['gRPC', 'HTTP/2'],
  WebSocket: ['WebSocket', 'WS', 'WSS'],
  SOAP: ['HTTP/HTTPS', 'HTTP', 'HTTPS'],
  EventDriven: ['Kafka', 'RabbitMQ', 'AMQP', 'MQTT', 'Redis Streams'],
  StreamProcessing: ['Kafka', 'Kinesis', 'Redis Streams'],
};

export const interactionProtocolPatternMatching = createRule<[], MessageIds>({
  name: 'interaction-protocol-pattern-matching',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Protocol should match the interaction pattern. In context engineering, REST uses HTTP/HTTPS, gRPC uses gRPC protocol, WebSocket uses WebSocket protocol, etc. Mismatches prevent correct implementation.',
    },
    messages: {
      missingProtocol:
        "Interaction '{{interactionName}}' uses pattern '{{pattern}}' but has no protocol specified. In context engineering, interaction patterns require explicit protocols for correct implementation: REST→HTTP/HTTPS, gRPC→gRPC, WebSocket→WebSocket, EventDriven→message queue protocols. Consider adding protocol: '{{suggestions}}'.",
      protocolMismatch:
        "Interaction '{{interactionName}}' uses pattern '{{pattern}}' with protocol '{{protocol}}'. This may be incompatible. In context engineering, patterns typically use specific protocols. For pattern '{{pattern}}', consider: {{suggestions}}. Verify this combination is intentional.",
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
          const pattern = decorator.metadata.pattern as string | undefined;
          const protocol = decorator.metadata.protocol as string | undefined;

          if (!pattern) continue;

          // Check if this pattern typically requires a protocol
          if (PATTERNS_REQUIRING_PROTOCOL.includes(pattern)) {
            if (!protocol) {
              const suggestions = PATTERN_PROTOCOL_SUGGESTIONS[pattern]?.join(', ') || 'appropriate protocol';
              context.report({
                node: decorator.node,
                messageId: 'missingProtocol',
                data: {
                  interactionName: interactionName || 'Unknown',
                  pattern,
                  suggestions,
                },
              });
            } else {
              // Check if protocol seems reasonable for this pattern
              const validProtocols = PATTERN_PROTOCOL_SUGGESTIONS[pattern] || [];
              if (validProtocols.length > 0 && !validProtocols.some((p) => protocol.includes(p))) {
                context.report({
                  node: decorator.node,
                  messageId: 'protocolMismatch',
                  data: {
                    interactionName: interactionName || 'Unknown',
                    pattern,
                    protocol,
                    suggestions: validProtocols.join(', '),
                  },
                });
              }
            }
          }
        }
      },
    };
  },
});
