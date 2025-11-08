/**
 * Behavior Implementation Quality Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, behaviors need **implementation details** to help AI
 * systems generate accurate code. Without implementation context (algorithm, data structures,
 * error handling patterns), AI must guess how to implement the behavior, leading to incorrect or
 * suboptimal code.
 *
 * Well-defined implementation context enables AI to:
 * 1. **Generate accurate code** - Algorithm descriptions help AI choose the right approach
 * 2. **Select appropriate data structures** - Implementation details guide data modeling
 * 3. **Handle errors correctly** - Error handling patterns ensure robust implementations
 * 4. **Optimize performance** - Implementation context helps AI make performance-aware choices
 *
 * Missing implementation details mean AI systems can't help effectively. They'll generate generic,
 * potentially incorrect code instead of domain-specific, optimized implementations.
 *
 * **What it checks:**
 * - Behaviors have implementation details (algorithm, approach, or implementation notes)
 * - Implementation details are meaningful (not empty/whitespace)
 * - Complex behaviors have more detailed implementation context
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Clear implementation context
 * @Behavior({
 *   name: 'Validate Email Format',
 *   implementation: 'Use regex pattern matching: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/ to validate email format'
 * })
 *
 * // ✅ Good - Algorithm description for complex behavior
 * @Behavior({
 *   name: 'Calculate Discount',
 *   implementation: 'Apply tiered discount: 10% for orders >$100, 15% for orders >$500, 20% for orders >$1000. Use highest applicable tier only.'
 * })
 *
 * // ❌ Bad - Missing implementation context
 * @Behavior({
 *   name: 'Validate Email Format'
 *   // How should AI implement this? Regex? Library? Custom logic?
 * })
 *
 * // ❌ Bad - Empty implementation
 * @Behavior({
 *   name: 'Calculate Discount',
 *   implementation: ''  // No context for AI
 * })
 * ```
 *
 * @category behavior
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingImplementation' | 'emptyImplementation' | 'complexBehaviorNeedsDetails';

export const behaviorImplementationQuality = createRule<[], MessageIds>({
  name: 'behavior-implementation-quality',
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure behaviors have quality implementation details to help AI generate accurate, domain-specific code',
    },
    messages: {
      missingImplementation: "Behavior '{{name}}' is missing implementation details - AI systems can't generate accurate code without implementation context! In context engineering, implementation details (algorithm, approach, data structures) help AI understand HOW to implement the behavior, not just WHAT it should do. Add implementation details explaining the approach, algorithm, or key implementation considerations.",
      emptyImplementation: "Behavior '{{name}}' has empty implementation details - valuable context is being wasted! Implementation context helps AI generate domain-specific, optimized code instead of generic implementations. Write meaningful implementation details that explain the algorithm, approach, or key implementation considerations.",
      complexBehaviorNeedsDetails: "Behavior '{{name}}' is marked as 'complex' but has minimal implementation details. Complex behaviors need detailed implementation context (algorithm, error handling patterns, performance considerations) to help AI generate robust, production-ready code. Add comprehensive implementation details explaining the approach and key implementation considerations.",
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
          const implementation = decorator.metadata.implementation;
          const complexity = decorator.metadata.complexity as string | undefined;

          // Check if implementation is missing
          if (!implementation) {
            context.report({
              node: decorator.node,
              messageId: 'missingImplementation',
              data: { name: name || 'Unknown' },
            });
            continue;
          }

          // Handle string implementation
          if (typeof implementation === 'string') {
            // Check if implementation exists but is empty/whitespace
            if (implementation.trim().length === 0) {
              context.report({
                node: decorator.node,
                messageId: 'emptyImplementation',
                data: { name: name || 'Unknown' },
              });
            }
            // Check if complex behavior has minimal details
            else if (complexity === 'complex' && implementation.trim().length < 50) {
              context.report({
                node: decorator.node,
                messageId: 'complexBehaviorNeedsDetails',
                data: { name: name || 'Unknown' },
              });
            }
          }
          // If implementation is an object, it's considered valid (has structured implementation details)
          // No validation needed for object implementations
        }
      },
    };
  },
});
