/**
 * Context Description Quality Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, the **description** is the primary way humans
 * and AI systems understand a context's purpose, scope, and role. A poor description is
 * like having unclear organizational documentation - it leads to misalignment, duplicate
 * work, and confused stakeholders.
 *
 * Quality descriptions enable:
 * 1. **AI comprehension of business context** - AI can understand why the context exists,
 *    what problems it solves, and how it fits in the larger organization
 * 2. **Automated documentation generation** - AI can create onboarding materials, architecture
 *    diagrams, and stakeholder communications from well-written descriptions
 * 3. **Context discovery** - When AI helps users find the right context for a task, rich
 *    descriptions improve search and recommendation accuracy
 * 4. **Alignment validation** - AI can compare context descriptions with actual implementation
 *    to detect drift and suggest realignment
 *
 * **What it checks:**
 * - Description field exists and is non-empty
 * - Description is at least 20 characters (sufficiently detailed)
 * - Description is not placeholder text (TODO, FIXME, TBD, etc.)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Clear, detailed description
 * @Context({
 *   name: 'Retail Banking',
 *   description: 'Manages all retail banking operations including account management, transactions, and customer relationship services for individual consumers and small businesses.'
 * })
 *
 * // ✅ Good - Explains purpose and scope
 * @Context({
 *   name: 'Risk & Compliance',
 *   description: 'Ensures regulatory compliance and manages enterprise risk across all business units, providing audit trails and risk assessment frameworks.'
 * })
 *
 * // ❌ Bad - No description
 * @Context({
 *   name: 'Payment Processing'
 *   // Missing description
 * })
 *
 * // ❌ Bad - Too short
 * @Context({
 *   name: 'HR',
 *   description: 'HR stuff'  // Only 8 characters
 * })
 *
 * // ❌ Bad - Placeholder text
 * @Context({
 *   name: 'Analytics',
 *   description: 'TODO: Add description later'
 * })
 * ```
 *
 * @category context
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

const MIN_DESCRIPTION_LENGTH = 20;

const PLACEHOLDER_PATTERNS = [
  /^todo/i,
  /^fixme/i,
  /^description/i,
  /^tbd/i,
  /^placeholder/i,
];

type MessageIds = 'missingDescription' | 'descriptionTooShort' | 'placeholderDescription';

export const contextDescriptionQuality = createRule<[], MessageIds>({
  name: 'context-description-quality',
  meta: {
    type: 'problem',
    docs: {
      description: 'Contexts should have clear, detailed descriptions that explain their purpose and scope. Quality descriptions help AI understand business context and generate accurate documentation.',
    },
    messages: {
      missingDescription: "Context '{{name}}' has no description. In context engineering, descriptions are how AI understands a context's purpose, scope, and organizational role. Add a description explaining what this context does, what problems it solves, and how it fits in the larger organization. Rich descriptions enable AI to generate documentation, recommend integrations, and validate alignment.",
      descriptionTooShort: "Context '{{name}}' description is too short ({{length}} characters). Provide at least {{minLength}} characters explaining the context's purpose, scope, and role. Brief descriptions lack the detail AI needs to understand business context and make informed architectural decisions. Include what problems this context solves and how it creates value.",
      placeholderDescription: "Context '{{name}}' description appears to be placeholder text. Replace with a meaningful description of the context's purpose and scope. Placeholder descriptions prevent AI from understanding business context and generating accurate recommendations. Describe what this context does, why it exists, and how it serves the organization.",
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
          // Only apply to Context decorators
          if (decorator.type !== 'Context') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const description = (decorator.metadata.description as string | undefined)?.trim() || '';

          // Check 1: Description should exist
          if (!description) {
            context.report({
              node: decorator.node,
              messageId: 'missingDescription',
              data: {
                name: name || 'Unknown',
              },
            });
            continue;
          }

          // Check 2: Description should be sufficiently detailed
          if (description.length < MIN_DESCRIPTION_LENGTH) {
            context.report({
              node: decorator.node,
              messageId: 'descriptionTooShort',
              data: {
                name: name || 'Unknown',
                length: description.length.toString(),
                minLength: MIN_DESCRIPTION_LENGTH.toString(),
              },
            });
          }

          // Check 3: Description should not be placeholder text
          for (const pattern of PLACEHOLDER_PATTERNS) {
            if (pattern.test(description)) {
              context.report({
                node: decorator.node,
                messageId: 'placeholderDescription',
                data: {
                  name: name || 'Unknown',
                },
              });
              break;
            }
          }
        }
      },
    };
  },
});
