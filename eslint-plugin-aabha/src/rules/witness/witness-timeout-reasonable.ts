/**
 * Witness Timeout Reasonable Rule
 *
 * **Why this rule exists:**
 * In Aabha's behavioral framework, **witness timeouts** must be reasonable relative to the witness
 * type. Different test types have different execution characteristics - unit tests should be fast
 * (<100ms), while E2E tests may take seconds. Unreasonable timeouts waste resources, create flaky
 * tests, or fail to catch real performance issues.
 *
 * Reasonable timeouts enable AI to:
 * 1. **Configure test runners** - Set appropriate timeout values for different test types
 * 2. **Detect performance regressions** - Identify when tests take longer than expected
 * 3. **Optimize test execution** - Understand which tests need optimization
 * 4. **Generate test reports** - Report on test execution times and timeout violations
 *
 * Unreasonable timeouts mean AI can't properly configure test environments or detect performance issues.
 *
 * **What it checks:**
 * - Unit tests have timeouts <= 5000ms (5 seconds)
 * - Integration tests have timeouts <= 30000ms (30 seconds)
 * - E2E tests have timeouts <= 120000ms (2 minutes)
 * - Timeouts are appropriate for the witness type
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Reasonable timeout for unit test
 * @Witness({
 *   name: 'Valid Email Test',
 *   type: WitnessType.Unit,
 *   timeout: 1000  // 1 second is reasonable for unit test
 * })
 * witnessValidEmail() {}
 *
 * // ❌ Bad - Unreasonable timeout for unit test
 * @Witness({
 *   name: 'Valid Email Test',
 *   type: WitnessType.Unit,
 *   timeout: 60000  // 60 seconds is too long for unit test
 * })
 * witnessValidEmail() {}
 * ```
 *
 * @category witness
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { parseAabhaDecorator } from '../../utils/decorator-parser.js';

type MessageIds = 'timeoutTooLongForUnit' | 'timeoutTooLongForIntegration' | 'timeoutTooLongForE2E';

const MAX_TIMEOUTS = {
  unit: 5000,        // 5 seconds for unit tests
  integration: 30000, // 30 seconds for integration tests
  e2e: 120000,       // 2 minutes for E2E tests
  acceptance: 120000, // 2 minutes for acceptance tests
  performance: 300000, // 5 minutes for performance tests
  security: 60000,    // 1 minute for security tests
};

export const witnessTimeoutReasonable = createRule<[], MessageIds>({
  name: 'witness-timeout-reasonable',
  meta: {
    type: 'problem',
    docs: {
      description: 'Witness timeouts should be reasonable relative to the witness type to enable proper test configuration',
    },
    messages: {
      timeoutTooLongForUnit: "Witness '{{name}}' has timeout {{timeout}}ms which is too long for a unit test (max {{max}}ms). Unit tests should be fast and isolated, typically completing in <100ms. Long timeouts suggest the test may be doing integration work or needs optimization. Reduce the timeout to {{max}}ms or less, or change the witness type if this is actually an integration test.",
      timeoutTooLongForIntegration: "Witness '{{name}}' has timeout {{timeout}}ms which is too long for an integration test (max {{max}}ms). Integration tests may involve databases or services but should complete within reasonable bounds. Reduce the timeout to {{max}}ms or less, or change the witness type if this is actually an E2E test.",
      timeoutTooLongForE2E: "Witness '{{name}}' has timeout {{timeout}}ms which is too long for an E2E test (max {{max}}ms). E2E tests involve the full stack but should complete within reasonable bounds. Reduce the timeout to {{max}}ms or less, or reconsider if the test is doing too much work.",
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
          const type = parsed.metadata.type as string | undefined;
          const timeout = parsed.metadata.timeout as number | undefined;

          if (!timeout || !type) continue;

          const typeKey = type.toLowerCase().replace('witnesstype.', '');
          const maxTimeout = MAX_TIMEOUTS[typeKey as keyof typeof MAX_TIMEOUTS];

          if (!maxTimeout) continue;

          if (timeout > maxTimeout) {
            let messageId: MessageIds;
            if (typeKey === 'unit') {
              messageId = 'timeoutTooLongForUnit';
            } else if (typeKey === 'integration') {
              messageId = 'timeoutTooLongForIntegration';
            } else {
              messageId = 'timeoutTooLongForE2E';
            }

            context.report({
              node: decorator,
              messageId,
              data: {
                name: name || 'Unnamed witness',
                timeout,
                max: maxTimeout,
              },
            });
          }
        }
      },
    };
  },
});
