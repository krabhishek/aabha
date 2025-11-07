/**
 * Witness Execution Consistency Rule
 *
 * **Why this rule exists:**
 * In Aabha's behavioral framework, **execution consistency** ensures that witness execution
 * settings are logically consistent. For example, witnesses with retries should have appropriate
 * timeouts, and parallel execution should be compatible with isolation levels. Inconsistent
 * execution settings create confusion and prevent AI from generating correct test execution code.
 *
 * Execution consistency enables AI to:
 * 1. **Generate test runners** - Create test execution code with consistent settings
 * 2. **Understand test behavior** - Know how tests will execute
 * 3. **Optimize test execution** - Configure parallel execution correctly
 * 4. **Prevent conflicts** - Avoid incompatible execution settings
 *
 * Inconsistent execution settings mean AI can't generate correct test execution code.
 *
 * **What it checks:**
 * - Witnesses with retries have appropriate timeout settings
 * - Parallel execution is compatible with isolation level
 * - Execution settings are logically consistent
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Consistent execution settings
 * @Witness({
 *   name: 'Payment Test',
 *   timeout: 30000,
 *   execution: {
 *     retries: 2,
 *     parallel: false,
 *     isolationLevel: WitnessIsolationLevel.Method
 *   }
 * })
 * witnessPaymentProcessing() {}
 *
 * // ❌ Bad - Inconsistent settings
 * @Witness({
 *   name: 'Payment Test',
 *   timeout: 1000,  // Too short for retries
 *   execution: {
 *     retries: 5,  // Will likely timeout
 *     parallel: true,
 *     isolationLevel: WitnessIsolationLevel.Method  // Can't parallelize with method isolation
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

type MessageIds = 'retriesWithoutTimeout' | 'parallelWithMethodIsolation';

export const witnessExecutionConsistency = createRule<[], MessageIds>({
  name: 'witness-execution-consistency',
  meta: {
    type: 'problem',
    docs: {
      description: 'Witness execution settings should be consistent - retries need timeouts, parallel execution needs compatible isolation',
    },
    messages: {
      retriesWithoutTimeout: "Witness '{{name}}' has retries ({{retries}}) but no timeout specified. Retries require appropriate timeout settings to prevent infinite retry loops. Add a timeout field that accounts for retry attempts (e.g., 'timeout: 30000' for 2 retries).",
      parallelWithMethodIsolation: "Witness '{{name}}' has parallel execution enabled but method-level isolation. Method-level isolation prevents parallel execution as each method needs its own isolated context. Either disable parallel execution (set 'parallel: false') or change isolation level to allow parallel execution.",
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
          const timeout = parsed.metadata.timeout as number | undefined;
          const execution = parsed.metadata.execution as Record<string, unknown> | undefined;

          if (!execution) continue;

          const retries = execution.retries as number | undefined;
          const parallel = execution.parallel as boolean | undefined;
          const isolationLevel = execution.isolationLevel as string | undefined;

          // Check retries without timeout
          if (retries !== undefined && retries > 0 && timeout === undefined) {
            context.report({
              node: decorator,
              messageId: 'retriesWithoutTimeout',
              data: {
                name: name || 'Unnamed witness',
                retries,
              },
            });
          }

          // Check parallel with method isolation
          if (parallel === true && isolationLevel) {
            const isolationLower = isolationLevel.toLowerCase();
            if (isolationLower.includes('method') || isolationLower === 'method') {
              context.report({
                node: decorator,
                messageId: 'parallelWithMethodIsolation',
                data: { name: name || 'Unnamed witness' },
              });
            }
          }
        }
      },
    };
  },
});
