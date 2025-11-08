/**
 * Action Parallel Group Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **parallelGroup** identifies actions that can execute
 * simultaneously when executionMode is Parallel. When executionMode is set to Parallel, parallelGroup
 * must be specified to identify which actions can run concurrently. Without parallelGroup, parallel
 * execution cannot be properly coordinated.
 *
 * Parallel group enables AI to:
 * 1. **Coordinate parallel execution** - Know which actions can run simultaneously
 * 2. **Optimize workflows** - Identify opportunities for parallelization
 * 3. **Generate implementations** - Create appropriate parallel execution code
 * 4. **Plan resource allocation** - Understand concurrent resource requirements
 *
 * **What it checks:**
 * - Actions with executionMode Parallel MUST have `parallelGroup` field
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Parallel execution with group
 * @Action({
 *   name: 'Issue Virtual Card',
 *   executionMode: StepExecutionMode.Parallel,
 *   parallelGroup: 'card-issuance'
 * })
 *
 * // ❌ Bad - Parallel execution without group
 * @Action({
 *   name: 'Issue Virtual Card',
 *   executionMode: StepExecutionMode.Parallel
 *   // Missing parallelGroup - required for parallel execution
 * })
 * ```
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingParallelGroup';

export const actionParallelGroupRequired = createRule<[], MessageIds>({
  name: 'action-parallel-group-required',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Actions with executionMode Parallel must have parallelGroup field. Parallel group identifies actions that can execute simultaneously.',
    },
    messages: {
      missingParallelGroup:
        "Action '{{name}}' has executionMode 'Parallel' but is missing 'parallelGroup' field. When executionMode is set to Parallel, parallelGroup must be specified to identify which actions can run concurrently. Without parallelGroup, parallel execution cannot be properly coordinated. Add a parallelGroup field (e.g., 'parallelGroup: \"card-issuance\"' or 'parallelGroup: \"verification-checks\"').",
    },
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const decorators = getAabhaDecorators(node);
        if (decorators.length === 0) return;

        for (const decorator of decorators) {
          if (decorator.type !== 'Action') continue;

          const name = decorator.metadata.name as string | undefined;
          const executionMode = decorator.metadata.executionMode as string | undefined;
          const parallelGroup = decorator.metadata.parallelGroup as string | undefined;

          // Only check actions with Parallel execution mode
          if (executionMode !== 'Parallel') continue;

          // Check if parallelGroup is missing (required)
          if (!parallelGroup) {
            context.report({
              node: decorator.node,
              messageId: 'missingParallelGroup',
              data: { name: name || 'Unnamed action' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if parallelGroup already exists in source to avoid duplicates
                if (source.includes('parallelGroup:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex).trimEnd();
                const needsComma = !textBeforeBrace.endsWith(',') && !textBeforeBrace.endsWith('{');
                
                const parallelGroupTemplate = needsComma
                  ? `,\n  parallelGroup: '',  // TODO: Group identifier for parallel execution (e.g., 'card-issuance', 'verification-checks')`
                  : `\n  parallelGroup: '',  // TODO: Group identifier for parallel execution (e.g., 'card-issuance', 'verification-checks')`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  parallelGroupTemplate,
                );
              },
            });
          }
        }
      },
    };
  },
});

