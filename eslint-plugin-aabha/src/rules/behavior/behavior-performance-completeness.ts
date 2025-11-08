/**
 * Behavior Performance Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **performance** defines performance expectations,
 * timeouts, retry behavior, and caching strategy. When a performance object is provided, it should
 * include key fields like `expectedDuration` or `timeout` to enable proper performance modeling.
 * Incomplete performance objects lack the information needed to understand execution characteristics
 * and optimize accordingly.
 *
 * Performance completeness enables AI to:
 * 1. **Understand execution characteristics** - Know performance expectations and timeouts
 * 2. **Generate implementations** - Create appropriate code with performance awareness
 * 3. **Optimize behavior** - Understand performance requirements for optimization
 * 4. **Plan resources** - Allocate resources based on performance expectations
 *
 * **What it checks:**
 * - If performance exists, it should have at least expectedDuration or timeout
 * - When timeout is provided, retries should be considered for resilience
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete performance
 * @Behavior({
 *   name: 'Validate Email Format',
 *   performance: {
 *     expectedDuration: '< 100ms',
 *     timeout: 5000,
 *     retries: 2
 *   }
 * })
 *
 * // ❌ Bad - Incomplete performance
 * @Behavior({
 *   name: 'Validate Email Format',
 *   performance: {
 *     // Missing expectedDuration and timeout
 *   }
 * })
 * ```
 *
 * @category behavior
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'incompletePerformance' | 'missingRetriesWithTimeout';

export const behaviorPerformanceCompleteness = createRule<[], MessageIds>({
  name: 'behavior-performance-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Behaviors with performance field should have complete performance objects. Performance objects should include expectedDuration or timeout to enable proper performance modeling.',
    },
    messages: {
      incompletePerformance:
        "Behavior '{{name}}' has performance object but missing key fields. Performance objects should include at least 'expectedDuration' (human-readable duration) or 'timeout' (maximum execution time in milliseconds) to enable proper performance modeling. Add expectedDuration or timeout (e.g., 'expectedDuration: \"< 100ms\"' or 'timeout: 5000').",
      missingRetriesWithTimeout:
        "Behavior '{{name}}' has performance with timeout but no retries. Behaviors with timeouts should consider retries for resilience, especially for transient failures. Add retries field (e.g., 'retries: 2' for idempotent operations).",
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
          if (decorator.type !== 'Behavior') continue;

          const name = decorator.metadata.name as string | undefined;
          const performance = decorator.metadata.performance as
            | {
                expectedDuration?: string;
                timeout?: number;
                retries?: number;
                cacheable?: boolean;
                [key: string]: unknown;
              }
            | undefined;

          // Only check if performance exists
          if (!performance) continue;

          // Check if performance has at least expectedDuration or timeout
          if (!performance.expectedDuration && !performance.timeout) {
            context.report({
              node: decorator.node,
              messageId: 'incompletePerformance',
              data: { name: name || 'Unnamed behavior' },
            });
          }

          // Check if timeout exists but retries is missing (recommendation)
          if (performance.timeout && performance.retries === undefined) {
            context.report({
              node: decorator.node,
              messageId: 'missingRetriesWithTimeout',
              data: { name: name || 'Unnamed behavior' },
            });
          }
        }
      },
    };
  },
});

