/**
 * Witness Fixtures Validation Rule
 *
 * **Why this rule exists:**
 * In Aabha's behavioral framework, **witness fixtures** define test setup, teardown, and mocks.
 * Fixtures must be properly structured - setup and teardown should be strings (method names),
 * and mocks should be arrays. Invalid fixture structures prevent AI from generating correct
 * test execution code.
 *
 * Fixture validation enables AI to:
 * 1. **Generate test code** - Create test runners with proper fixture calls
 * 2. **Understand test structure** - Know which methods are fixtures
 * 3. **Validate test configuration** - Ensure fixtures are properly defined
 * 4. **Prevent runtime errors** - Catch invalid fixture configurations at lint time
 *
 * Invalid fixtures mean AI can't generate correct test execution code.
 *
 * **What it checks:**
 * - Fixtures object has valid structure
 * - Setup and teardown are strings (method names)
 * - Mocks is an array (if provided)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Valid fixtures
 * @Witness({
 *   name: 'Valid Email Test',
 *   fixtures: {
 *     setup: 'setupTestData',
 *     teardown: 'cleanupTestData',
 *     mocks: ['EmailService', 'PaymentGateway']
 *   }
 * })
 * witnessValidEmail() {}
 *
 * // ❌ Bad - Invalid fixtures
 * @Witness({
 *   name: 'Valid Email Test',
 *   fixtures: {
 *     setup: 123  // Should be a string method name
 *   }
 * })
 * witnessValidEmail() {}
 * ```
 *
 * @category witness
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { parseAabhaDecorator } from '../../utils/decorator-parser.js';

type MessageIds = 'invalidFixtureStructure' | 'invalidSetupType' | 'invalidTeardownType' | 'invalidMocksType';

export const witnessFixturesValidation = createRule<[], MessageIds>({
  name: 'witness-fixtures-validation',
  meta: {
    type: 'problem',
    docs: {
      description: 'Witness fixtures should have valid structure with proper types for setup, teardown, and mocks',
    },
    messages: {
      invalidFixtureStructure: "Witness '{{name}}' has an invalid fixtures structure. Fixtures should be an object with setup, teardown (strings), and mocks (array) properties.",
      invalidSetupType: "Witness '{{name}}' has fixtures.setup that is not a string. Setup should be a method name (string) that exists in the @Behavior class.",
      invalidTeardownType: "Witness '{{name}}' has fixtures.teardown that is not a string. Teardown should be a method name (string) that exists in the @Behavior class.",
      invalidMocksType: "Witness '{{name}}' has fixtures.mocks that is not an array. Mocks should be an array of mock names (e.g., 'mocks: [\"EmailService\", \"PaymentGateway\"]').",
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
          const fixtures = parsed.metadata.fixtures;

          if (!fixtures) continue;

          if (typeof fixtures !== 'object' || fixtures === null || Array.isArray(fixtures)) {
            context.report({
              node: decorator,
              messageId: 'invalidFixtureStructure',
              data: { name: name || 'Unnamed witness' },
            });
            continue;
          }

          const fixturesObj = fixtures as Record<string, unknown>;

          // Check setup type
          if (fixturesObj.setup !== undefined && typeof fixturesObj.setup !== 'string') {
            context.report({
              node: decorator,
              messageId: 'invalidSetupType',
              data: { name: name || 'Unnamed witness' },
            });
          }

          // Check teardown type
          if (fixturesObj.teardown !== undefined && typeof fixturesObj.teardown !== 'string') {
            context.report({
              node: decorator,
              messageId: 'invalidTeardownType',
              data: { name: name || 'Unnamed witness' },
            });
          }

          // Check mocks type
          if (fixturesObj.mocks !== undefined && !Array.isArray(fixturesObj.mocks)) {
            context.report({
              node: decorator,
              messageId: 'invalidMocksType',
              data: { name: name || 'Unnamed witness' },
            });
          }
        }
      },
    };
  },
});
