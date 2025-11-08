/**
 * Metric Description Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's metrics framework, **description** provides a human-readable explanation of
 * what a metric measures and why it matters. Descriptions help teams understand metric
 * purpose, enable AI systems to generate documentation, and improve metric discoverability.
 * Without descriptions, metrics lack context and teams may misunderstand what is being
 * measured.
 *
 * Description enables AI to:
 * 1. **Understand purpose** - Know what the metric measures and why
 * 2. **Generate documentation** - Create metric documentation and guides
 * 3. **Improve discoverability** - Help teams find relevant metrics
 * 4. **Enable communication** - Help teams communicate metric purpose to stakeholders
 *
 * **What it checks:**
 * - Metric has `description` field defined
 * - Description is meaningful (not empty)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has description
 * @Metric({
 *   name: 'Net Promoter Score',
 *   description: 'Measures customer loyalty and likelihood to recommend our services'
 * })
 *
 * // ❌ Bad - Missing description
 * @Metric({
 *   name: 'Net Promoter Score'
 *   // Missing description
 * })
 * ```
 *
 * @category metric
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingDescription' | 'emptyDescription';

export const metricDescriptionRequired = createRule<[], MessageIds>({
  name: 'metric-description-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Metrics should have description field. Description provides a human-readable explanation of what a metric measures and why it matters.',
    },
    messages: {
      missingDescription:
        "Metric '{{name}}' is missing a 'description' field. Description provides a human-readable explanation of what a metric measures and why it matters. Descriptions help teams understand metric purpose, enable AI systems to generate documentation, and improve metric discoverability. Add a description field (e.g., 'description: \"Measures customer loyalty and likelihood to recommend our services\"').",
      emptyDescription:
        "Metric '{{name}}' has a description field but it's empty. Description should be meaningful and explain what the metric measures. Add a meaningful description.",
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
          if (decorator.type !== 'Metric') continue;

          const name = decorator.metadata.name as string | undefined;
          const description = decorator.metadata.description as string | undefined;

          // Check if description is missing
          if (!description) {
            context.report({
              node: decorator.node,
              messageId: 'missingDescription',
              data: { name: name || 'Unnamed metric' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if description already exists in source to avoid duplicates
                if (source.includes('description:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const descriptionTemplate = `,\n  description: '',  // TODO: Human-readable explanation of what this metric measures and why it matters`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  descriptionTemplate,
                );
              },
            });
            continue;
          }

          // Check if description is empty
          if (typeof description === 'string' && description.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyDescription',
              data: { name: name || 'Unnamed metric' },
            });
          }
        }
      },
    };
  },
});

