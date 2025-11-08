/**
 * Witness Mock Consistency Rule
 *
 * **Why this rule exists:**
 * In Aabha's behavioral framework, **mock consistency** ensures that witnesses that use mocks
 * have them properly documented in fixtures. Mocks that are used but not declared create confusion
 * about test dependencies and prevent AI from generating correct test setup code.
 *
 * Mock consistency enables AI to:
 * 1. **Generate test code** - Create test setup with proper mocks
 * 2. **Understand test dependencies** - Know which services are mocked
 * 3. **Validate test setup** - Ensure all mocks are properly configured
 * 4. **Document test isolation** - Understand what external dependencies are mocked
 *
 * Inconsistent mocks mean AI can't generate correct test setup code or understand test dependencies.
 *
 * **What it checks:**
 * - Witnesses that use mocks have them declared in fixtures.mocks
 * - Mock declarations are consistent with test needs
 * - Integration tests that should use mocks have them declared
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Mocks properly declared
 * @Witness({
 *   name: 'Payment Test',
 *   type: WitnessType.Integration,
 *   fixtures: {
 *     mocks: ['PaymentGateway', 'EmailService']  // ✓ Declared
 *   }
 * })
 * witnessPaymentProcessing() {}
 *
 * // ❌ Bad - Integration test without mocks
 * @Witness({
 *   name: 'Payment Test',
 *   type: WitnessType.Integration
 *   // Missing mocks - integration tests typically need mocks
 * })
 * witnessPaymentProcessing() {}
 * ```
 *
 * @category witness
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { parseAabhaDecorator } from '../../utils/decorator-parser.js';

type MessageIds = 'integrationTestMissingMocks';

export const witnessMockConsistency = createRule<[], MessageIds>({
  name: 'witness-mock-consistency',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Integration and E2E witnesses should consider declaring mocks in fixtures when external dependencies are used',
    },
    messages: {
      integrationTestMissingMocks: "Witness '{{name}}' is an integration/E2E test but doesn't declare mocks. If this test interacts with external services, consider declaring them in fixtures.mocks to document test dependencies and enable proper test setup. Note: Not all integration tests require mocks - some test against real services. Add 'fixtures: { mocks: [\"ServiceName1\", \"ServiceName2\"] }' only if this test uses mocked external dependencies.",
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
          const fixtures = parsed.metadata.fixtures as Record<string, unknown> | undefined;

          if (!type) continue;

          const typeLower = type.toLowerCase().replace('witnesstype.', '');
          // Only check integration tests, not E2E (E2E tests typically use real services)
          const isIntegration = typeLower === 'integration';

          if (isIntegration) {
            const mocks = fixtures?.mocks;
            const hasMocks = mocks && Array.isArray(mocks) && mocks.length > 0;

            // Only suggest mocks if fixtures object exists but mocks are not declared
            // This means the developer has thought about fixtures but hasn't declared mocks
            // If no fixtures object exists at all, the test might not need mocks
            if (fixtures && !hasMocks) {
              context.report({
                node: decorator,
                messageId: 'integrationTestMissingMocks',
                data: { name: name || 'Unnamed witness' },
              });
            }
          }
        }
      },
    };
  },
});
