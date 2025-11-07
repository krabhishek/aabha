/**
 * Witness Dependency Exists Rule
 *
 * **Why this rule exists:**
 * In Aabha's behavioral framework, **witness dependencies** define test execution order.
 * Witnesses can depend on other witnesses that must run first. Dependencies that don't exist
 * will cause test execution failures. AI systems need to verify dependencies exist to generate
 * valid test execution plans.
 *
 * Dependency validation enables AI to:
 * 1. **Generate test execution plans** - Create test runners with correct execution order
 * 2. **Verify test dependencies** - Ensure dependent witnesses exist
 * 3. **Prevent runtime errors** - Catch missing dependencies at lint time
 * 4. **Understand test structure** - Know which witnesses depend on others
 *
 * Missing dependencies mean tests will fail at runtime when trying to execute non-existent witnesses.
 *
 * **What it checks:**
 * - Witness execution.dependencies reference witnesses that exist in the @Behavior class
 * - Dependent witness methods are defined in the behavior class
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Dependencies exist
 * @Behavior({ name: 'Validate Email' })
 * export class ValidateEmailBehavior {
 *   @Witness({
 *     name: 'User Authentication Test',
 *     execution: {
 *       dependencies: ['witnessUserAuthentication']
 *     }
 *   })
 *   witnessPaymentProcessing() {}
 *
 *   @Witness({ name: 'User Authentication Test' })
 *   witnessUserAuthentication() {}  // ✓ Exists
 * }
 *
 * // ❌ Bad - Dependency doesn't exist
 * @Behavior({ name: 'Validate Email' })
 * export class ValidateEmailBehavior {
 *   @Witness({
 *     name: 'Payment Test',
 *     execution: {
 *       dependencies: ['witnessUserAuth']  // ✗ Method doesn't exist
 *     }
 *   })
 *   witnessPaymentProcessing() {}
 * }
 * ```
 *
 * @category witness
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { parseAabhaDecorator } from '../../utils/decorator-parser.js';

type MessageIds = 'dependencyNotFound';

export const witnessDependencyExists = createRule<[], MessageIds>({
  name: 'witness-dependency-exists',
  meta: {
    type: 'problem',
    docs: {
      description: 'Witness dependencies must reference witnesses that exist in the @Behavior class',
    },
    messages: {
      dependencyNotFound: "Witness '{{name}}' has dependency '{{dependency}}' that doesn't exist in the @Behavior class. Dependencies must reference existing witness methods. Either add the witness method '{{dependency}}' to the behavior class, or update the dependency reference to point to an existing witness.",
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

          const dependencies = execution.dependencies as string[] | undefined;
          if (!dependencies || !Array.isArray(dependencies)) continue;

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

          // Get all witness method names in the class
          const witnessMethodNames = new Set<string>();
          for (const member of parentClass.body.body) {
            if (member.type === 'MethodDefinition' && member.decorators) {
              for (const memberDecorator of member.decorators) {
                const memberParsed = parseAabhaDecorator(memberDecorator);
                if (memberParsed && memberParsed.type === 'Witness' && member.key.type === 'Identifier') {
                  witnessMethodNames.add(member.key.name);
                }
              }
            }
          }

          // Check each dependency
          for (const dependency of dependencies) {
            if (typeof dependency === 'string' && !witnessMethodNames.has(dependency)) {
              context.report({
                node: decorator,
                messageId: 'dependencyNotFound',
                data: {
                  name: name || 'Unnamed witness',
                  dependency,
                },
              });
            }
          }
        }
      },
    };
  },
});
