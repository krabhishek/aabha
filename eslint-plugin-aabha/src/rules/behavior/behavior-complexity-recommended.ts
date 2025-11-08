/**
 * Behavior Complexity Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **complexity** categorizes behaviors by their
 * implementation complexity to guide development effort, testing requirements, and risk assessment.
 * Behaviors model expected behavior that would be implemented in a product or business process, and
 * complexity helps teams understand implementation effort, enables AI systems to generate appropriate
 * implementations with proper complexity awareness, and supports behavior modeling. While not always
 * required, complexity is important for understanding behavior characteristics.
 *
 * Complexity enables AI to:
 * 1. **Understand implementation effort** - Know how complex the expected behavior is to implement
 * 2. **Generate implementations** - Create appropriate code with complexity awareness
 * 3. **Plan testing** - Understand testing requirements based on complexity
 * 4. **Assess risk** - Identify behaviors that need careful management
 *
 * **What it checks:**
 * - Behavior should have `complexity` field (recommended, not required)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has complexity
 * @Behavior({
 *   name: 'Validate Email Format',
 *   complexity: BehaviorComplexity.Simple
 * })
 *
 * // ⚠️ Warning - Missing complexity (recommended)
 * @Behavior({
 *   name: 'Validate Email Format'
 *   // Missing complexity - consider categorizing implementation complexity
 * })
 * ```
 *
 * @category behavior
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { addImportsIfMissing } from '../../utils/import-helpers.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingComplexity';

export const behaviorComplexityRecommended = createRule<[], MessageIds>({
  name: 'behavior-complexity-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Behaviors should have complexity field. Complexity categorizes behaviors by implementation complexity, helping teams understand implementation effort and enabling AI to generate appropriate implementations.',
    },
    messages: {
      missingComplexity:
        "Behavior '{{name}}' is missing a 'complexity' field. Complexity categorizes behaviors by their implementation complexity to guide development effort, testing requirements, and risk assessment. Behaviors model expected behavior that would be implemented in a product or business process, and complexity helps teams understand implementation effort, enables AI systems to generate appropriate implementations with proper complexity awareness, and supports behavior modeling. Add a complexity field (e.g., 'complexity: BehaviorComplexity.Simple' for straightforward behaviors, 'complexity: BehaviorComplexity.Moderate' for standard behaviors, 'complexity: BehaviorComplexity.Complex' for intricate behaviors).",
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
          if (decorator.type !== 'Behavior') continue;

          const name = decorator.metadata.name as string | undefined;
          const complexity = decorator.metadata.complexity;

          // Check if complexity is missing (recommended, not required)
          if (!complexity) {
            context.report({
              node: decorator.node,
              messageId: 'missingComplexity',
              data: { name: name || 'Unnamed behavior' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if complexity already exists in source to avoid duplicates
                if (source.includes('complexity:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                // Build the template - if comma is needed, add it at the start
                const complexityTemplate = needsComma
                  ? `,\n  complexity: BehaviorComplexity.Moderate,  // TODO: Choose appropriate complexity (Simple, Moderate, Complex)`
                  : `\n  complexity: BehaviorComplexity.Moderate,  // TODO: Choose appropriate complexity (Simple, Moderate, Complex)`;

                // Add import for BehaviorComplexity if missing
                const importFixes = addImportsIfMissing(
                  fixer,
                  context.sourceCode,
                  node,
                  ['BehaviorComplexity'],
                  'aabha'
                );

                // Insert at the calculated position (before the closing brace)
                const fieldFix = fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  complexityTemplate,
                );

                return [...importFixes, fieldFix];
              },
            });
          }
        }
      },
    };
  },
});

