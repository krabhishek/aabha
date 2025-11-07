/**
 * Required Description Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, descriptions are **valuable engineered context**, not
 * just documentation. Each description adds rich semantic information that:
 *
 * 1. **Enables AI comprehension** - AI assistants use descriptions to understand your business
 *    domain and generate accurate implementations. Without descriptions, AI must guess intent,
 *    leading to incorrect code.
 *
 * 2. **Creates dense context tokens** - A good description provides maximum business context in
 *    minimum tokens. Instead of verbose explanations in prompts, you engineer context once in
 *    your Aabha model and AI systems reuse it forever.
 *
 * 3. **Captures tribal knowledge** - Business logic, timing constraints, edge cases, and domain
 *    expertise become executable knowledge, not lost tribal wisdom.
 *
 * 4. **Enables traceability** - Descriptions connect strategy → initiatives → journeys → code,
 *    showing why each component exists and what business value it delivers.
 *
 * Missing descriptions mean lost context. Lost context means AI systems can't help effectively,
 * developers waste time reverse-engineering intent, and valuable business knowledge evaporates.
 *
 * **What it checks:**
 * - All Aabha components have a `description` field
 * - Descriptions contain actual content (not empty/whitespace)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Rich context for AI and humans
 * @Action({
 *   name: 'Send Welcome Email',
 *   description: 'Sends personalized welcome email to newly registered users within 5 minutes of signup, containing account activation link and quick-start guide'
 * })
 *
 * // ✅ Good - Captures business logic and constraints
 * @Collaboration({
 *   name: 'Manual Compliance Review',
 *   description: 'Multi-stakeholder review for high-risk applications >$100k. Compliance officer verifies documents, senior officer approves. Must complete within 4 hours for regulatory compliance.'
 * })
 *
 * // ❌ Bad - Lost context, AI can't understand business logic
 * @Action({
 *   name: 'Send Welcome Email'  // What's in the email? When is it sent? Why?
 * })
 *
 * // ❌ Bad - Empty description wastes context opportunity
 * @Action({
 *   name: 'Send Welcome Email',
 *   description: ''  // No context captured!
 * })
 * ```
 *
 * @category naming
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { detectIndentation } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingDescription' | 'emptyDescription';

export const requiredDescription = createRule<[], MessageIds>({
  name: 'required-description',
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure all components have descriptions to engineer valuable, AI-comprehensible business context',
    },
    messages: {
      missingDescription: "Component '{{name}}' is missing a description - you're losing valuable context! In Aabha's context engineering framework, descriptions capture business logic, constraints, and domain knowledge that AI systems need to generate accurate code. Add a description explaining WHAT this does, WHY it exists, and WHEN it's used. This engineered context helps AI assistants comprehend your business domain and assists you better.",
      emptyDescription: "Component '{{name}}' has an empty description - valuable context is being wasted! Context engineering means capturing business knowledge as structured, AI-readable information. An empty description means lost domain expertise, lost tribal knowledge, and reduced AI comprehension. Write a meaningful description that explains the business purpose, constraints, and outcomes. Good context = better AI assistance.",
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

        const sourceCode = context.sourceCode;

        for (const decorator of decorators) {
          const name = decorator.metadata.name as string | undefined;
          const description = decorator.metadata.description as string | undefined;

          // Check if description is missing
          if (!description) {
            context.report({
              node: decorator.node,
              messageId: 'missingDescription',
              data: { name: name || 'Unknown' },
              fix(fixer) {
                // Access the decorator's expression through the node
                if (decorator.node.expression.type !== 'CallExpression') return null;

                const arg = decorator.node.expression.arguments[0];
                if (!arg || arg.type !== 'ObjectExpression') return null;

                // Find the name property to insert description after it
                const nameProperty = arg.properties.find(
                  (p): p is TSESTree.Property => p.type === 'Property' &&
                         p.key.type === 'Identifier' &&
                         p.key.name === 'name'
                );

                if (!nameProperty) return null;

                // Detect indentation from the name property
                const indentation = detectIndentation(nameProperty, sourceCode);
                const insertPosition = nameProperty.range[1];

                return fixer.insertTextAfterRange(
                  [insertPosition, insertPosition],
                  `,\n${indentation}description: 'TODO: Add proper description'`
                );
              },
            });
          }
          // Check if description exists but is empty/whitespace
          else if (description.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyDescription',
              data: { name: name || 'Unknown' },
            });
          }
        }
      },
    };
  },
});
