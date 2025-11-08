/**
 * Action Parallel Group Consistency Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **parallel execution** is an optimization that tells
 * AI systems and orchestrators that certain actions can run concurrently without conflicts. When
 * parallelGroup and executionMode are misaligned, you're creating contradictory execution context
 * that confuses workflow engines and AI code generators.
 *
 * Proper parallel group configuration helps AI understand:
 * 1. **Concurrency semantics** - Which actions are independent and can run simultaneously?
 * 2. **Resource optimization** - Parallel groups enable thread pooling, async execution patterns
 * 3. **Journey timing** - Parallel execution reduces total journey duration
 * 4. **Synchronization points** - Where do parallel branches reconverge?
 *
 * When AI sees parallelGroup without executionMode='parallel', it receives conflicting signals:
 * - "parallelGroup" suggests: generate concurrent execution, use Promise.all(), optimize timing
 * - Missing "executionMode='parallel'" suggests: execute sequentially, wait for completion
 *
 * This contradiction prevents AI from generating correct orchestration code. Similarly,
 * executionMode='parallel' without a parallelGroup makes it unclear which actions run together.
 *
 * **What it checks:**
 * - Actions with parallelGroup SHOULD have executionMode='parallel'
 * - Actions with executionMode='parallel' COULD benefit from parallelGroup (for clarity)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Proper parallel configuration
 * @Action({
 *   name: 'Issue Virtual Card',
 *   parallelGroup: 'card-issuance',
 *   executionMode: 'parallel'
 * })
 * class IssueVirtualCardAction {}
 *
 * @Action({
 *   name: 'Issue Physical Card',
 *   parallelGroup: 'card-issuance',  // Same group
 *   executionMode: 'parallel'
 * })
 * class IssuePhysicalCardAction {}
 *
 * // ✅ Good - Sequential execution (no parallel group)
 * @Action({
 *   name: 'Verify Identity',
 *   executionMode: 'sequential'  // Or omit, default is sequential
 * })
 *
 * // ⚠️ Warning - Conflicting parallelization context
 * @Action({
 *   name: 'Send Notifications',
 *   parallelGroup: 'notifications',  // Says: "I'm part of parallel group"
 *   executionMode: 'sequential'  // Says: "Execute me sequentially"
 *   // Contradiction! AI can't determine execution strategy
 * })
 *
 * // ℹ️ Info - Parallel without group (unclear which actions run together)
 * @Action({
 *   name: 'Process Background Task',
 *   executionMode: 'parallel'
 *   // Missing parallelGroup - parallel with what?
 * })
 * ```
 *
 * **Note:** Validating that parallel groups have at least 2 members requires cross-file
 * analysis and should be performed in CI/CD pipelines, not in single-file linting.
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'parallelGroupWithoutMode' | 'parallelModeWithoutGroup';

export const actionParallelGroupConsistency = createRule<[], MessageIds>({
  name: 'action-parallel-group-consistency',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Parallel groups and execution modes should align to create clear, unambiguous concurrency context for AI orchestration',
    },
    messages: {
      parallelGroupWithoutMode:
        "Action '{{name}}' has parallelGroup='{{parallelGroup}}' but executionMode is '{{executionMode}}'. This creates conflicting parallelization context! Actions in a parallel group should have executionMode: StepExecutionMode.Parallel to signal concurrent execution semantics. Without this alignment, AI systems and workflow orchestrators can't determine if this action should run concurrently or sequentially. The parallelGroup says 'I run with others', but missing parallel executionMode suggests sequential execution. Set executionMode: StepExecutionMode.Parallel to enable AI-generated concurrent workflows.",
      parallelModeWithoutGroup:
        "Action '{{name}}' has executionMode: StepExecutionMode.Parallel but no parallelGroup. While this signals parallel execution intent, it's unclear which actions run concurrently together. Parallel groups create explicit concurrency boundaries that help AI understand synchronization points and generate correct Promise.all(), async/await, or thread pool patterns. Consider adding 'parallelGroup' (e.g., 'notifications', 'data-fetch') to make parallelization strategy explicit and enable AI to group related concurrent operations.",
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
          // Only apply to Action decorators
          if (decorator.type !== 'Action') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const parallelGroup = decorator.metadata.parallelGroup as string | undefined;
          const executionMode = decorator.metadata.executionMode as string | undefined;

          // Check for both the enum value 'parallel' and the enum reference 'StepExecutionMode.Parallel'
          const isParallel = executionMode === 'parallel' || 
                            executionMode === 'StepExecutionMode.Parallel' ||
                            (typeof executionMode === 'string' && executionMode.includes('Parallel'));

          // Check if parallelGroup is set without parallel executionMode
          if (parallelGroup && !isParallel) {
            context.report({
              node: decorator.node,
              messageId: 'parallelGroupWithoutMode',
              data: {
                name: name || 'Unknown',
                parallelGroup,
                executionMode: executionMode || 'not set',
              },
            });
          }

          // Check if parallel executionMode is set without parallelGroup
          if (isParallel && !parallelGroup) {
            context.report({
              node: decorator.node,
              messageId: 'parallelModeWithoutGroup',
              data: {
                name: name || 'Unknown',
              },
            });
          }
        }
      },
    };
  },
});
