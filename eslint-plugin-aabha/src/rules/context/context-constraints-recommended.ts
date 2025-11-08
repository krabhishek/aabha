/**
 * Context Constraints Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **constraints** document known limitations, restrictions,
 * or boundaries that constrain what a context can do. Explicit constraints help teams understand
 * limitations and plan accordingly. While not always required, documenting constraints is a best
 * practice for comprehensive context planning.
 *
 * Constraints enable AI to:
 * 1. **Understand limitations** - Know what constraints limit context capabilities
 * 2. **Plan within boundaries** - Design solutions that respect constraints
 * 3. **Identify opportunities** - Recognize when constraints change and new possibilities emerge
 * 4. **Make informed decisions** - Understand what the context cannot do
 *
 * **What it checks:**
 * - Context should have `constraints` field (recommended, not required)
 * - When constraints are provided, they should not be empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has constraints
 * @Context({
 *   name: 'Retail Banking',
 *   constraints: [
 *     'Legacy core banking system limits real-time capabilities',
 *     'Regulatory requirements mandate 7-year data retention',
 *     'Budget frozen until Q3 2025'
 *   ]
 * })
 *
 * // ⚠️ Warning - Missing constraints (recommended)
 * @Context({
 *   name: 'Retail Banking'
 *   // Missing constraints - consider documenting known limitations
 * })
 * ```
 *
 * @category context
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingConstraints' | 'emptyConstraints';

export const contextConstraintsRecommended = createRule<[], MessageIds>({
  name: 'context-constraints-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Contexts should have constraints field. Constraints document known limitations, restrictions, or boundaries that constrain what a context can do.',
    },
    messages: {
      missingConstraints:
        "Context '{{name}}' is missing a 'constraints' field. Constraints document known limitations, restrictions, or boundaries that constrain what this context can do. Explicit constraints help teams understand limitations and plan accordingly. While not always required, documenting constraints is a best practice. Add a constraints array (e.g., 'constraints: [\"Legacy system limits real-time capabilities\", \"Regulatory requirements mandate data retention\"]').",
      emptyConstraints:
        "Context '{{name}}' has a constraints field but it's empty. Constraints should be meaningful and document known limitations or restrictions. Add meaningful constraints.",
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
          if (decorator.type !== 'Context') continue;

          const name = decorator.metadata.name as string | undefined;
          const constraints = decorator.metadata.constraints as string[] | undefined;

          // Check if constraints is missing (recommended, not required)
          if (!constraints) {
            context.report({
              node: decorator.node,
              messageId: 'missingConstraints',
              data: { name: name || 'Unnamed context' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if constraints already exists in source to avoid duplicates
                if (source.includes('constraints:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const constraintsTemplate = `,\n  constraints: [\n    '', // TODO: Known limitations, restrictions, or boundaries that constrain this context\n    '' // TODO: Add more constraints (e.g., 'Legacy system limits', 'Regulatory requirements')\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  constraintsTemplate,
                );
              },
            });
            continue;
          }

          // Check if constraints is empty
          if (constraints.length === 0 || constraints.every((c) => typeof c === 'string' && c.trim().length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'emptyConstraints',
              data: { name: name || 'Unnamed context' },
            });
          }
        }
      },
    };
  },
});

