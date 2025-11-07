/**
 * Witness Fixture Method Exists Rule
 *
 * **Why this rule exists:**
 * In Aabha's behavioral framework, **witness fixtures** reference setup and teardown methods
 * that must exist in the @Behavior class. Fixture methods that don't exist will cause test
 * execution failures. AI systems need to verify fixture methods exist to generate valid test
 * execution code.
 *
 * Fixture method validation enables AI to:
 * 1. **Generate test code** - Create test runners that call existing fixture methods
 * 2. **Verify test setup** - Ensure test fixtures are properly defined
 * 3. **Prevent runtime errors** - Catch missing fixture methods at lint time
 * 4. **Understand test structure** - Know which methods are fixtures vs witnesses
 *
 * Missing fixture methods mean tests will fail at runtime when trying to call non-existent methods.
 *
 * **What it checks:**
 * - Witness fixtures reference methods that exist in the @Behavior class
 * - Setup and teardown methods are defined in the behavior class
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Fixture methods exist
 * @Behavior({ name: 'Validate Email' })
 * export class ValidateEmailBehavior {
 *   @Witness({
 *     name: 'Valid Email Test',
 *     fixtures: {
 *       setup: 'setupTestData',
 *       teardown: 'cleanupTestData'
 *     }
 *   })
 *   witnessValidEmail() {}
 *
 *   setupTestData() {}  // ✓ Exists
 *   cleanupTestData() {}  // ✓ Exists
 * }
 *
 * // ❌ Bad - Fixture method doesn't exist
 * @Behavior({ name: 'Validate Email' })
 * export class ValidateEmailBehavior {
 *   @Witness({
 *     name: 'Valid Email Test',
 *     fixtures: {
 *       setup: 'setupTestData'  // ✗ Method doesn't exist
 *     }
 *   })
 *   witnessValidEmail() {}
 * }
 * ```
 *
 * @category witness
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { parseAabhaDecorator } from '../../utils/decorator-parser.js';

type MessageIds = 'fixtureMethodNotFound';

export const witnessFixtureMethodExists = createRule<[], MessageIds>({
  name: 'witness-fixture-method-exists',
  meta: {
    type: 'problem',
    docs: {
      description: 'Witness fixture methods must exist in the @Behavior class to enable proper test execution',
    },
    messages: {
      fixtureMethodNotFound: "Witness '{{name}}' references fixture method '{{methodName}}' that doesn't exist in the @Behavior class. Fixture methods (setup, teardown) must be defined in the behavior class for tests to execute properly. Either add the method '{{methodName}}' to the behavior class, or update the fixture reference to point to an existing method.",
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
          const fixtures = parsed.metadata.fixtures as Record<string, unknown> | undefined;

          if (!fixtures) continue;

          // Find parent class
          let parentClass: TSESTree.ClassDeclaration | null = null;
          let currentNode: TSESTree.Node | undefined = node.parent;

          while (currentNode) {
            if (currentNode.type === 'ClassDeclaration') {
              parentClass = currentNode;
              break;
            }
            currentNode = currentNode.parent;
          }

          if (!parentClass) continue;

          // Get all method names in the class
          const methodNames = new Set<string>();
          for (const member of parentClass.body.body) {
            if (member.type === 'MethodDefinition' && member.key.type === 'Identifier') {
              methodNames.add(member.key.name);
            }
          }

          // Check setup method
          const setup = fixtures.setup as string | undefined;
          if (setup && !methodNames.has(setup)) {
            context.report({
              node: decorator,
              messageId: 'fixtureMethodNotFound',
              data: {
                name: name || 'Unnamed witness',
                methodName: setup,
              },
            });
          }

          // Check teardown method
          const teardown = fixtures.teardown as string | undefined;
          if (teardown && !methodNames.has(teardown)) {
            context.report({
              node: decorator,
              messageId: 'fixtureMethodNotFound',
              data: {
                name: name || 'Unnamed witness',
                methodName: teardown,
              },
            });
          }
        }
      },
    };
  },
});
