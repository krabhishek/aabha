/**
 * Action Retry-Timeout Pairing Rule
 *
 * **Why this rule exists:**
 * In distributed systems and Aabha's context engineering framework, **retry logic without timeouts
 * creates infinite wait scenarios**. When an action hangs (network partition, deadlock, resource
 * exhaustion), retries without timeouts will wait forever on each attempt, compounding the problem
 * exponentially.
 *
 * Proper timeout-retry pairing tells AI systems:
 * 1. **Maximum wait time per attempt** - Timeout defines when to give up on a single try
 * 2. **Total resilience budget** - Retries * Timeout = maximum total time investment
 * 3. **Failure detection** - Timeouts detect hangs, retries handle transient failures
 * 4. **Resource management** - Prevents thread/connection pool exhaustion from hanging operations
 *
 * When AI sees retries without timeouts, it can't generate bounded retry logic. Unbounded retries
 * create resource leaks and cascade failures. Conversely, timeouts without retries miss
 * opportunities for resilience against transient failures.
 *
 * **What it checks:**
 * - Actions with maxRetries SHOULD have timeoutDuration (prevents infinite waits)
 * - Actions with timeoutDuration COULD benefit from maxRetries (info-level suggestion)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Retries with timeout (bounded resilience)
 * @Action({
 *   name: 'Call Payment Gateway',
 *   maxRetries: 3,
 *   timeoutDuration: 'PT30S',  // Max 30s per attempt, 90s total
 *   retryBackoff: 'exponential'
 * })
 *
 * // ✅ Good - Timeout with retries for transient failures
 * @Action({
 *   name: 'Fetch User Data',
 *   timeoutDuration: 'PT10S',
 *   maxRetries: 2  // Quick retries for network blips
 * })
 *
 * // ⚠️ Warning - Retries without timeout (unbounded!)
 * @Action({
 *   name: 'Call External API',
 *   maxRetries: 3
 *   // Missing timeoutDuration - if API hangs, we wait forever × 3!
 * })
 *
 * // ℹ️ Info - Timeout without retries (missed resilience opportunity)
 * @Action({
 *   name: 'Database Query',
 *   timeoutDuration: 'PT5S'
 *   // Could add maxRetries for transient connection issues
 * })
 * ```
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'retryWithoutTimeout' | 'timeoutWithoutRetry';

export const actionRetryTimeoutPairing = createRule<[], MessageIds>({
  name: 'action-retry-timeout-pairing',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Actions with retries should have timeouts to prevent infinite waits. Pairing these creates bounded, resilient error handling.',
    },
    messages: {
      retryWithoutTimeout:
        "Action '{{name}}' has maxRetries={{maxRetries}} but no timeoutDuration. Retries without timeouts create unbounded waiting - if the action hangs (network partition, deadlock, resource exhaustion), each retry attempt waits indefinitely. This compounds exponentially: {{maxRetries}} retries with no timeout = infinite maximum wait time! AI systems can't generate bounded retry logic without timeout context. Add 'timeoutDuration' (e.g., 'PT30S') to cap wait time per attempt and prevent resource exhaustion.",
      timeoutWithoutRetry:
        "Action '{{name}}' has timeoutDuration='{{timeoutDuration}}' but no maxRetries. While timeout prevents infinite waits, you're missing resilience opportunities. Many failures are transient (network blips, temporary overload, rate limits) - a quick retry often succeeds. AI assistants could generate retry logic with exponential backoff to improve reliability. Consider adding 'maxRetries' (e.g., 2-3) to handle transient failures gracefully and improve system resilience.",
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
          const maxRetries = decorator.metadata.maxRetries as number | undefined;
          const timeoutDuration = decorator.metadata.timeoutDuration as string | undefined;

          // If retries are configured but timeout is not
          if (maxRetries && maxRetries > 0 && !timeoutDuration) {
            context.report({
              node: decorator.node,
              messageId: 'retryWithoutTimeout',
              data: {
                name: name || 'Unknown',
                maxRetries: maxRetries.toString(),
              },
            });
          }

          // If timeout is configured but retries are not (informational)
          if (timeoutDuration && !maxRetries) {
            context.report({
              node: decorator.node,
              messageId: 'timeoutWithoutRetry',
              data: {
                name: name || 'Unknown',
                timeoutDuration,
              },
            });
          }
        }
      },
    };
  },
});
