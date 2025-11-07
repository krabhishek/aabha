/**
 * Component Naming Convention Rule
 *
 * **Why this rule exists:**
 * In Aabha, component names are **engineered context** - they're the first thing AI systems and
 * humans read to understand your business domain. Consistent naming creates high-quality,
 * machine-readable context that enables AI assistants to comprehend your enterprise model and
 * generate accurate implementations.
 *
 * Well-named components serve as **dense context tokens** for AI systems, helping them understand
 * your business domain without consuming excessive token budgets. A clear name like "Customer
 * Onboarding Journey" immediately conveys purpose, while "coj" or "process1" loses valuable context.
 *
 * **What it checks:**
 * - Component names start with a capital letter (consistency for parsing)
 * - Names contain only letters, numbers, spaces, and hyphens (readability)
 * - Names meet minimum/maximum length requirements (balance between clarity and brevity)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Clear context for AI and humans
 * @Journey({ name: 'Customer Onboarding Journey' })
 * @Action({ name: 'Send Welcome Email' })
 * @Stakeholder({ name: 'Compliance Officer' })
 *
 * // ❌ Bad - Lost context, harder for AI to understand
 * @Journey({ name: 'coj' })  // Abbreviation loses semantic meaning
 * @Action({ name: 'send_email' })  // Underscore breaks convention
 * @Stakeholder({ name: 'user' })  // Too generic, context lost
 * ```
 *
 * @category naming
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type Options = [{
  pattern?: string;
  minLength?: number;
  maxLength?: number;
}];

export const componentNamingConvention = createRule<Options, 'invalidPattern' | 'tooShort' | 'tooLong'>({
  name: 'component-naming-convention',
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce consistent naming to create high-quality, AI-comprehensible context in your enterprise model',
    },
    messages: {
      invalidPattern: "Component name '{{name}}' doesn't follow Aabha naming conventions (must start with capital letter, use only letters/numbers/spaces/hyphens). Consistent names create better context for AI systems to understand your business domain and generate accurate code. Fix the name to improve context quality.",
      tooShort: "Component name '{{name}}' is too short (minimum {{minLength}} characters). In context engineering, descriptive names carry semantic meaning that helps AI assistants comprehend your business domain. Short names lose valuable context and reduce AI comprehension quality.",
      tooLong: "Component name '{{name}}' is too long (maximum {{maxLength}} characters). While context is valuable, overly long names reduce readability and consume unnecessary tokens in AI interactions. Use a concise name and put detailed context in the description field instead.",
    },
    schema: [
      {
        type: 'object',
        properties: {
          pattern: {
            type: 'string',
            description: 'Regex pattern for valid names',
          },
          minLength: {
            type: 'number',
            description: 'Minimum length for component names',
          },
          maxLength: {
            type: 'number',
            description: 'Maximum length for component names',
          },
        },
        additionalProperties: false,
      },
    ],
    fixable: 'code',
  },
  defaultOptions: [{}],
  create(context) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const decorators = getAabhaDecorators(node);
        if (decorators.length === 0) return;

        const options = context.options[0] || {};
        const pattern = options.pattern || '^[A-Z][a-zA-Z0-9\\s-]*$';
        const minLength = options.minLength;
        const maxLength = options.maxLength;

        for (const decorator of decorators) {
          const name = decorator.metadata.name as string | undefined;
          if (!name) continue;

          const regex = new RegExp(pattern);

          // Check pattern
          if (!regex.test(name)) {
            // Check if the issue is simply a lowercase first letter
            if (name && name[0] === name[0].toLowerCase() && name[0] !== name[0].toUpperCase()) {
              const capitalizedName = name[0].toUpperCase() + name.slice(1);

              context.report({
                node: decorator.node,
                messageId: 'invalidPattern',
                data: {
                  name,
                  pattern,
                },
                fix(fixer) {
                  // Access the decorator's expression through the node
                  if (decorator.node.expression.type !== 'CallExpression') return null;

                  const nameProperty = decorator.node.expression.arguments[0];
                  if (nameProperty?.type === 'ObjectExpression') {
                    const nameProp = nameProperty.properties.find(
                      (p): p is TSESTree.Property => p.type === 'Property' &&
                             p.key.type === 'Identifier' &&
                             p.key.name === 'name'
                    );
                    if (nameProp) {
                      return fixer.replaceText(nameProp.value, `'${capitalizedName}'`);
                    }
                  }
                  return null;
                },
              });
            } else {
              context.report({
                node: decorator.node,
                messageId: 'invalidPattern',
                data: {
                  name,
                  pattern,
                },
              });
            }
          }

          // Check min length
          if (minLength && name.length < minLength) {
            context.report({
              node: decorator.node,
              messageId: 'tooShort',
              data: {
                name,
                minLength: minLength.toString(),
              },
            });
          }

          // Check max length
          if (maxLength && name.length > maxLength) {
            context.report({
              node: decorator.node,
              messageId: 'tooLong',
              data: {
                name,
                maxLength: maxLength.toString(),
              },
            });
          }
        }
      },
    };
  },
});
