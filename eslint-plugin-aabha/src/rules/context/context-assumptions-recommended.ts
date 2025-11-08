/**
 * Context Assumptions Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **assumptions** document key assumptions the context
 * operates under. Explicit assumptions about the environment, resources, or dependencies help
 * identify risks when assumptions change. While not always required, documenting assumptions
 * is a best practice for comprehensive context planning.
 *
 * Assumptions enable AI to:
 * 1. **Identify risks** - Know what assumptions could invalidate context operations
 * 2. **Validate context viability** - Check if assumptions are still valid
 * 3. **Monitor changes** - Alert when assumptions change or are invalidated
 * 4. **Make informed decisions** - Understand what the context depends on
 *
 * **What it checks:**
 * - Context should have `assumptions` field (recommended, not required)
 * - When assumptions are provided, they should not be empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has assumptions
 * @Context({
 *   name: 'Retail Banking',
 *   assumptions: [
 *     'Regulatory environment remains stable',
 *     'Core banking system maintains 99.99% uptime',
 *     'Customer demand for digital services continues growing'
 *   ]
 * })
 *
 * // ⚠️ Warning - Missing assumptions (recommended)
 * @Context({
 *   name: 'Retail Banking'
 *   // Missing assumptions - consider documenting key assumptions
 * })
 * ```
 *
 * @category context
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingAssumptions' | 'emptyAssumptions';

export const contextAssumptionsRecommended = createRule<[], MessageIds>({
  name: 'context-assumptions-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Contexts should have assumptions field. Assumptions document key premises the context operates under, helping identify risks and validate context viability.',
    },
    messages: {
      missingAssumptions:
        "Context '{{name}}' is missing an 'assumptions' field. Assumptions document key assumptions the context operates under about the environment, resources, or dependencies. Explicit assumptions help identify risks when assumptions change. While not always required, documenting assumptions is a best practice. Add an assumptions array (e.g., 'assumptions: [\"Regulatory environment remains stable\", \"Core banking system maintains high availability\"]').",
      emptyAssumptions:
        "Context '{{name}}' has an assumptions field but it's empty. Assumptions should be meaningful and document key premises the context depends on. Add meaningful assumptions.",
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
          const assumptions = decorator.metadata.assumptions as string[] | undefined;

          // Check if assumptions is missing (recommended, not required)
          if (!assumptions) {
            context.report({
              node: decorator.node,
              messageId: 'missingAssumptions',
              data: { name: name || 'Unnamed context' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if assumptions already exists in source to avoid duplicates
                if (source.includes('assumptions:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const assumptionsTemplate = `,\n  assumptions: [\n    '', // TODO: Key assumptions this context operates under\n    '' // TODO: Add more assumptions (e.g., 'Regulatory environment remains stable', 'System maintains high availability')\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  assumptionsTemplate,
                );
              },
            });
            continue;
          }

          // Check if assumptions is empty
          if (assumptions.length === 0 || assumptions.every((a) => typeof a === 'string' && a.trim().length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'emptyAssumptions',
              data: { name: name || 'Unnamed context' },
            });
          }
        }
      },
    };
  },
});

