/**
 * Interaction Backend Resilience Timeouts Rule
 *
 * **Why this rule exists:**
 * Backend layer interactions must have timeout configurations to prevent cascading failures and
 * resource exhaustion. Without timeouts, hanging requests can monopolize connections, block threads,
 * and degrade overall system performance. This is critical for microservices and distributed systems.
 *
 * Missing timeout configuration causes:
 * - **Resource exhaustion** - Threads/connections stuck waiting indefinitely
 * - **Cascading failures** - One slow service brings down dependent services
 * - **Poor user experience** - Requests hang without feedback
 * - **Difficult debugging** - Cannot distinguish between slow vs. hanging requests
 *
 * Proper timeout configuration enables:
 * 1. **Fail-fast behavior** - Detect and handle timeouts quickly
 * 2. **Resource protection** - Release connections/threads after timeout
 * 3. **Circuit breaker compatibility** - Timeouts feed circuit breaker logic
 * 4. **SLA compliance** - Guarantee maximum response time
 *
 * **What it checks:**
 * - Backend layer interactions have backendConfig.resilience.timeout configured
 * - At least one timeout type is specified (connection, read, or write)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Backend with timeout configuration
 * @Interaction({
 *   name: 'Account API',
 *   layer: InteractionLayer.Backend,
 *   backendConfig: {
 *     resilience: {
 *       timeout: {
 *         connection: 3000,  // 3 seconds
 *         read: 5000,        // 5 seconds
 *         write: 2000        // 2 seconds
 *       }
 *     }
 *   }
 * })
 *
 * // ❌ Bad - Backend without timeout
 * @Interaction({
 *   name: 'Account API',
 *   layer: InteractionLayer.Backend,
 *   backendConfig: {}  // Missing resilience.timeout!
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingTimeout';

export const interactionBackendResilienceTimeouts = createRule<[], MessageIds>({
  name: 'interaction-backend-resilience-timeouts',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Backend layer interactions should have timeout configuration in backendConfig.resilience.timeout. In context engineering, timeouts prevent cascading failures, resource exhaustion, and enable fail-fast behavior.',
    },
    messages: {
      missingTimeout:
        "Interaction '{{interactionName}}' is Backend layer but lacks resilience timeout configuration. In context engineering, backend interactions must have timeouts to prevent cascading failures and resource exhaustion. Add backendConfig.resilience.timeout with connection, read, and write timeouts (in milliseconds). Example: timeout: {{ connection: 3000, read: 5000, write: 2000 }}. Typical values: connection=2-5s, read=5-30s, write=2-10s.",
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

          const interactionName = decorator.metadata.name as string | undefined;
          const layer = decorator.metadata.layer as string | undefined;

          // Only applies to Backend layer
          if (layer !== 'Backend') continue;

          const backendConfig = decorator.metadata.backendConfig as
            | {
                resilience?: {
                  timeout?: {
                    connection?: number;
                    read?: number;
                    write?: number;
                  };
                };
              }
            | undefined;

          const hasTimeout =
            backendConfig?.resilience?.timeout &&
            (backendConfig.resilience.timeout.connection !== undefined ||
              backendConfig.resilience.timeout.read !== undefined ||
              backendConfig.resilience.timeout.write !== undefined);

          if (!hasTimeout) {
            context.report({
              node: decorator.node,
              messageId: 'missingTimeout',
              data: {
                interactionName: interactionName || 'Unknown',
              },
              fix(fixer) {
                // Auto-fix: Add resilience.timeout skeleton with TODOs
                const source = context.sourceCode.getText(decorator.node);
                const backendConfigMatch = source.match(/backendConfig:\s*{/);

                if (!backendConfigMatch) {
                  // No backendConfig at all - skip auto-fix (too complex)
                  return null;
                }

                // Check if resilience exists
                const resilienceMatch = source.match(/resilience:\s*{/);
                if (!resilienceMatch) {
                  // Add resilience with timeout
                  const insertIndex = backendConfigMatch.index! + backendConfigMatch[0].length;
                  const insertion = `\n      resilience: {\n        timeout: {\n          connection: 3000, // TODO: Adjust connection timeout (ms)\n          read: 5000,       // TODO: Adjust read timeout (ms)\n          write: 2000       // TODO: Adjust write timeout (ms)\n        }\n      },`;
                  return fixer.insertTextAfterRange(
                    [decorator.node.range[0] + insertIndex, decorator.node.range[0] + insertIndex],
                    insertion,
                  );
                }

                // resilience exists but no timeout
                const insertIndex = resilienceMatch.index! + resilienceMatch[0].length;
                const insertion = `\n        timeout: {\n          connection: 3000, // TODO: Adjust connection timeout (ms)\n          read: 5000,       // TODO: Adjust read timeout (ms)\n          write: 2000       // TODO: Adjust write timeout (ms)\n        },`;
                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertIndex, decorator.node.range[0] + insertIndex],
                  insertion,
                );
              },
            });
          }
        }
      },
    };
  },
});
