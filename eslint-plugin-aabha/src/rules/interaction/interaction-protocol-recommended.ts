/**
 * Interaction Protocol Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **protocol** defines technical protocol details for
 * backend interactions. For backend and external layer interactions, protocol configuration is
 * essential for understanding how the interaction is implemented (HTTP, gRPC, message queues, etc.).
 *
 * Protocol configuration enables AI to:
 * 1. **Understand implementation details** - Know HTTP methods, paths, message queue configs
 * 2. **Generate client code** - Create appropriate API clients and SDKs
 * 3. **Plan integration** - Understand how to integrate with the interaction
 * 4. **Document APIs** - Generate API documentation from protocol details
 *
 * Missing protocol configuration makes it harder to understand implementation details or generate
 * proper client code for backend/external interactions.
 *
 * **What it checks:**
 * - Backend or External layer interactions should have `protocol` field (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has protocol configuration
 * @Interaction({
 *   name: 'Account Opening API',
 *   layer: InteractionLayer.Backend,
 *   protocol: {
 *     name: 'HTTP',
 *     version: '1.1',
 *     http: {
 *       method: 'POST',
 *       path: '/api/v1/accounts'
 *     }
 *   }
 * })
 *
 * // ⚠️ Warning - Missing protocol for backend interaction
 * @Interaction({
 *   name: 'Account Opening API',
 *   layer: InteractionLayer.Backend
 *   // Missing protocol - unclear implementation details
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingProtocol';

const PROTOCOL_REQUIRED_LAYERS = ['Backend', 'External'];

export const interactionProtocolRecommended = createRule<[], MessageIds>({
  name: 'interaction-protocol-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Backend and External layer interactions should have protocol field. Protocol defines technical protocol details for backend interactions.',
    },
    messages: {
      missingProtocol:
        "Interaction '{{name}}' with layer '{{layer}}' is missing a 'protocol' field. Protocol configuration is recommended for backend and external layer interactions to define technical implementation details (HTTP, gRPC, message queues, etc.). Consider adding protocol configuration (e.g., 'protocol: { name: \"HTTP\", http: { method: \"POST\", path: \"/api/v1/accounts\" } }').",
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

          const name = decorator.metadata.name as string | undefined;
          const layer = decorator.metadata.layer as string | undefined;
          const protocol = decorator.metadata.protocol;

          // Only check for Backend or External layers
          if (!layer || !PROTOCOL_REQUIRED_LAYERS.includes(layer)) continue;

          // Check if protocol is missing
          if (!protocol) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if protocol already exists in source to avoid duplicates
            if (source.includes('protocol:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingProtocol',
              data: {
                name: name || 'Unnamed interaction',
                layer,
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if protocol already exists in source to avoid duplicates
                if (source.includes('protocol:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const protocolTemplate = needsComma
                  ? `,\n  protocol: {\n    name: 'HTTP',  // TODO: Choose protocol (HTTP, gRPC, AMQP, MQTT, WebSocket, GraphQL)\n    http: {\n      method: 'POST',  // TODO: Choose HTTP method\n      path: '/api/v1/endpoint'  // TODO: Define API path\n    }\n  },  // TODO: Define protocol details`
                  : `\n  protocol: {\n    name: 'HTTP',  // TODO: Choose protocol (HTTP, gRPC, AMQP, MQTT, WebSocket, GraphQL)\n    http: {\n      method: 'POST',  // TODO: Choose HTTP method\n      path: '/api/v1/endpoint'  // TODO: Define API path\n    }\n  },  // TODO: Define protocol details`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  protocolTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

