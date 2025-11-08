/**
 * Strategy Description Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's strategic framework, **description** provides a human-readable overview of the strategy,
 * helping teams understand the strategy's purpose and scope. Without a description, strategies lack
 * context and teams cannot quickly understand what the strategy is about.
 *
 * Description enables AI to:
 * 1. **Understand strategy purpose** - Know what the strategy aims to achieve
 * 2. **Generate summaries** - Create concise overviews of strategies
 * 3. **Improve communication** - Help teams communicate strategy to stakeholders
 * 4. **Enable discovery** - Make strategies searchable and discoverable
 *
 * **What it checks:**
 * - Strategy has `description` field defined
 * - Description is meaningful (not empty)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has description
 * @Strategy({
 *   name: 'Digital Transformation',
 *   description: 'Transform into a mobile-first digital bank serving Gen-Z customers'
 * })
 *
 * // ❌ Bad - Missing description
 * @Strategy({
 *   name: 'Digital Transformation'
 *   // Missing description
 * })
 * ```
 *
 * @category strategy
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingDescription' | 'emptyDescription';

export const strategyDescriptionRequired = createRule<[], MessageIds>({
  name: 'strategy-description-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Strategies should have a description field. Description provides a human-readable overview of the strategy, helping teams understand its purpose and scope.',
    },
    messages: {
      missingDescription:
        "Strategy '{{name}}' is missing a 'description' field. Description provides a human-readable overview of the strategy, helping teams understand its purpose and scope. Add a description field that clearly explains what this strategy aims to achieve (e.g., 'description: \"Transform into a mobile-first digital bank serving Gen-Z customers\"').",
      emptyDescription:
        "Strategy '{{name}}' has a description field but it's empty. Description should be meaningful and provide context about the strategy's purpose and scope. Add a meaningful description.",
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
          if (decorator.type !== 'Strategy') continue;

          const name = decorator.metadata.name as string | undefined;
          const description = decorator.metadata.description as string | undefined;

          // Check if description is missing
          if (!description) {
            context.report({
              node: decorator.node,
              messageId: 'missingDescription',
              data: { name: name || 'Unnamed strategy' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if description already exists in source to avoid duplicates
                if (source.includes('description:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const descriptionTemplate = `,\n  description: '',  // TODO: Human-readable overview of this strategy`;

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
              data: { name: name || 'Unnamed strategy' },
            });
          }
        }
      },
    };
  },
});

