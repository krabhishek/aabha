/**
 * Witness Isolation Parallel Consistency Rule
 *
 * **Why this rule exists:**
 * In Aabha's behavioral framework, **isolation and parallel consistency** ensures that witness
 * isolation levels are compatible with parallel execution. Method-level isolation prevents parallel
 * execution, while class-level or suite-level isolation allows it. Inconsistent settings create
 * test execution conflicts and prevent AI from generating correct test runners.
 *
 * Isolation-parallel consistency enables AI to:
 * 1. **Generate test runners** - Create parallel test execution code correctly
 * 2. **Understand test isolation** - Know which tests can run in parallel
 * 3. **Optimize test execution** - Configure parallel execution safely
 * 4. **Prevent test conflicts** - Avoid isolation violations in parallel execution
 *
 * Inconsistent isolation and parallel settings mean AI can't generate correct parallel test execution code.
 *
 * **What it checks:**
 * - Witnesses with `execution.parallel: true` have compatible isolation levels
 * - Method-level isolation is not used with parallel execution
 * - Isolation level allows parallel execution
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Compatible isolation and parallel
 * @Witness({
 *   name: 'Payment Test',
 *   execution: {
 *     parallel: true,
 *     isolationLevel: WitnessIsolationLevel.Class  // ✓ Compatible
 *   }
 * })
 * witnessPaymentProcessing() {}
 *
 * // ❌ Bad - Incompatible isolation and parallel
 * @Witness({
 *   name: 'Payment Test',
 *   execution: {
 *     parallel: true,
 *     isolationLevel: WitnessIsolationLevel.Method  // ✗ Incompatible
 *   }
 * })
 * witnessPaymentProcessing() {}
 * ```
 *
 * @category witness
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { parseAabhaDecorator } from '../../utils/decorator-parser.js';

type MessageIds = 'incompatibleIsolationParallel';

export const witnessIsolationParallelConsistency = createRule<[], MessageIds>({
  name: 'witness-isolation-parallel-consistency',
  meta: {
    type: 'problem',
    docs: {
      description: 'Witness isolation level should be compatible with parallel execution settings',
    },
    messages: {
      incompatibleIsolationParallel: "Witness '{{name}}' has parallel execution enabled but isolation level '{{isolationLevel}}' is incompatible with parallel execution. Method-level isolation requires sequential execution. Either disable parallel execution (set 'parallel: false') or change isolation level to Class or Suite to allow parallel execution.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      MethodDefinition(node: TSESTree.MethodDefinition) {
        // Check if this method has decorators
        if (!node.decorators || node.decorators.length === 0) return;

        // Find @Witness decorator
        for (const decorator of node.decorators) {
          const parsed = parseAabhaDecorator(decorator);
          if (!parsed || parsed.type !== 'Witness') continue;

          const name = parsed.metadata.name as string | undefined;
          const execution = parsed.metadata.execution as Record<string, unknown> | undefined;

          if (!execution) continue;

          const parallel = execution.parallel as boolean | undefined;
          const isolationLevel = execution.isolationLevel as string | undefined;

          if (parallel !== true || !isolationLevel) continue;

          const isolationLower = isolationLevel.toLowerCase();
          const isMethodIsolation = isolationLower.includes('method') || isolationLower === 'method';

          if (isMethodIsolation) {
            context.report({
              node: decorator,
              messageId: 'incompatibleIsolationParallel',
              data: {
                name: name || 'Unnamed witness',
                isolationLevel,
              },
            });
          }
        }
      },
    };
  },
});
