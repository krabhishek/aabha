/**
 * Behavior Complexity Alignment Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, the **complexity** level of a behavior tells AI systems
 * how sophisticated the implementation should be. When complexity doesn't align with the behavior's
 * actual characteristics (preconditions, postconditions, dependencies), you create contradictory
 * context that confuses AI assistants trying to generate implementation code.
 *
 * Proper complexity alignment creates clear, actionable context:
 * - **Simple behaviors** = Few preconditions, straightforward postconditions, minimal dependencies
 * - **Complex behaviors** = Many preconditions, complex state changes, multiple dependencies
 * - **Misaligned complexity** = AI generates over-engineered simple behaviors or under-engineered
 *   complex behaviors
 *
 * AI systems use complexity alignment to:
 * 1. **Generate appropriate implementations** - Simple behaviors need simple code, complex ones need
 *    robust error handling
 * 2. **Estimate development effort** - Complexity helps AI understand scope and suggest realistic
 *    timelines
 * 3. **Design test strategies** - Complex behaviors need comprehensive test coverage
 * 4. **Allocate resources** - Complexity informs which behaviors need more attention
 *
 * **What it checks:**
 * - Complexity level aligns with number of preconditions
 * - Complexity level aligns with number of postconditions
 * - Complexity level aligns with number of dependencies
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Simple behavior with few requirements
 * @Behavior({
 *   name: 'Validate Email Format',
 *   complexity: 'simple',
 *   preconditions: ['email is provided'],
 *   postconditions: ['email format is valid']
 * })
 *
 * // ✅ Good - Complex behavior with many requirements
 * @Behavior({
 *   name: 'Process Multi-Step Payment',
 *   complexity: 'complex',
 *   preconditions: ['user authenticated', 'cart has items', 'payment method valid', 'inventory available'],
 *   postconditions: ['payment processed', 'inventory reserved', 'order created', 'confirmation sent'],
 *   dependencies: [PaymentGateway, InventoryService, OrderService, EmailService]
 * })
 *
 * // ❌ Bad - Simple marked as complex
 * @Behavior({
 *   name: 'Validate Email Format',
 *   complexity: 'complex',  // Overstated - only one precondition
 *   preconditions: ['email is provided']
 * })
 *
 * // ❌ Bad - Complex marked as simple
 * @Behavior({
 *   name: 'Process Multi-Step Payment',
 *   complexity: 'simple',  // Understated - many requirements
 *   preconditions: ['user authenticated', 'cart has items', 'payment method valid'],
 *   postconditions: ['payment processed', 'inventory reserved', 'order created']
 * })
 * ```
 *
 * @category behavior
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'complexityMismatch';

export const behaviorComplexityAlignment = createRule<[], MessageIds>({
  name: 'behavior-complexity-alignment',
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure behavior complexity level aligns with actual implementation requirements. Proper complexity context helps AI generate appropriate implementations and estimate effort accurately.',
    },
    messages: {
      complexityMismatch: "Behavior '{{name}}' has complexity '{{complexity}}' but {{reason}}. In context engineering, complexity levels help AI systems understand implementation scope and generate appropriate code. Misaligned complexity creates contradictory context - AI may over-engineer simple behaviors or under-engineer complex ones. Adjust the complexity level to match the actual requirements (preconditions: {{preconditionCount}}, postconditions: {{postconditionCount}}, dependencies: {{dependencyCount}}).",
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
          // Only apply to Behavior decorators
          if (decorator.type !== 'Behavior') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const complexity = decorator.metadata.complexity as string | undefined;
          if (!complexity) continue;

          const preconditions = decorator.metadata.preconditions as unknown[] | undefined;
          const postconditions = decorator.metadata.postconditions as unknown[] | undefined;
          const dependencies = decorator.metadata.dependencies as unknown[] | undefined;

          const preconditionCount = preconditions?.length || 0;
          const postconditionCount = postconditions?.length || 0;
          const dependencyCount = dependencies?.length || 0;

          const totalRequirements = preconditionCount + postconditionCount + dependencyCount;

          // Determine expected complexity based on requirements
          let expectedComplexity: string;
          let reason: string;

          if (totalRequirements <= 2) {
            expectedComplexity = 'simple';
            reason = 'has very few requirements (≤2 total)';
          } else if (totalRequirements <= 5) {
            expectedComplexity = 'moderate';
            reason = 'has moderate requirements (3-5 total)';
          } else {
            expectedComplexity = 'complex';
            reason = 'has many requirements (>5 total)';
          }

          // Normalize complexity value for comparison
          // Handle enum values like "BehaviorComplexity.Simple" or just "Simple"
          const normalizedComplexity = complexity.toLowerCase().includes('simple') 
            ? 'simple' 
            : complexity.toLowerCase().includes('moderate')
            ? 'moderate'
            : complexity.toLowerCase().includes('complex')
            ? 'complex'
            : complexity.toLowerCase();

          // Check if complexity aligns
          if (normalizedComplexity !== expectedComplexity) {
            context.report({
              node: decorator.node,
              messageId: 'complexityMismatch',
              data: {
                name: name || 'Unknown',
                complexity,
                reason,
                preconditionCount: preconditionCount.toString(),
                postconditionCount: postconditionCount.toString(),
                dependencyCount: dependencyCount.toString(),
              },
            });
          }
        }
      },
    };
  },
});
