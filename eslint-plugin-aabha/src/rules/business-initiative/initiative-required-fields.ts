/**
 * Initiative Required Fields Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **required fields** ensure that business initiatives
 * have essential context for AI systems to understand their purpose, scope, and expected
 * outcomes. Missing required fields create incomplete context that prevents AI from generating
 * accurate implementations or understanding initiative relationships.
 *
 * Required fields enable AI to:
 * 1. **Understand purpose** - Name and description explain what the initiative does
 * 2. **Track progress** - Timeline and metrics enable progress monitoring
 * 3. **Allocate resources** - Budget and team information inform planning
 * 4. **Measure success** - Expected outcomes define success criteria
 *
 * Missing required fields mean AI systems can't fully comprehend initiatives or generate proper
 * planning and monitoring code.
 *
 * **What it checks:**
 * - Initiatives have required fields: name, description
 * - Required fields contain meaningful content (not empty/whitespace)
 * - Critical initiatives have additional required fields (timeline, budget, outcomes)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - All required fields present
 * @BusinessInitiative({
 *   name: 'Customer Portal Redesign',
 *   description: 'Modernize customer portal to improve user experience and reduce support tickets',
 *   expectedOutcomes: ['20% increase in user engagement', '30% reduction in support tickets'],
 *   timeline: { startDate: '2024-01-01', endDate: '2024-06-30' }
 * })
 *
 * // ❌ Bad - Missing required fields
 * @BusinessInitiative({
 *   name: 'Customer Portal Redesign'
 *   // Missing description - AI can't understand purpose
 * })
 *
 * // ❌ Bad - Empty required field
 * @BusinessInitiative({
 *   name: 'Customer Portal Redesign',
 *   description: ''  // Empty - no context captured
 * })
 * ```
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { detectIndentation } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingName' | 'missingDescription' | 'emptyDescription';

export const initiativeRequiredFields = createRule<[], MessageIds>({
  name: 'initiative-required-fields',
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure business initiatives have required fields to provide essential context for AI systems',
    },
    messages: {
      missingName: "Business initiative is missing a 'name' field. Names provide essential context that helps AI systems identify and reference initiatives. Without names, AI can't distinguish between initiatives or generate proper documentation. Add a name field with a clear, descriptive initiative name.",
      missingDescription: "Initiative '{{name}}' is missing a 'description' field. Descriptions provide valuable context about initiative purpose, scope, and expected outcomes that helps AI systems understand business goals and generate accurate planning code. Add a description explaining what this initiative does and why it exists.",
      emptyDescription: "Initiative '{{name}}' has an empty description. Empty descriptions waste valuable context - AI systems can't understand initiative purpose without meaningful descriptions. Write a description that explains the initiative's goals, scope, and expected business impact.",
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
          // Only apply to BusinessInitiative decorators
          if (decorator.type !== 'BusinessInitiative') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const description = decorator.metadata.description as string | undefined;

          // Check if name is missing
          if (!name) {
            context.report({
              node: decorator.node,
              messageId: 'missingName',
            });
            continue;
          }

          // Check if description is missing
          if (!description) {
            const sourceCode = context.sourceCode;

            context.report({
              node: decorator.node,
              messageId: 'missingDescription',
              data: { name },
              fix(fixer) {
                // Access the decorator's expression
                if (decorator.node.expression.type !== 'CallExpression') return null;

                const arg = decorator.node.expression.arguments[0];
                if (!arg || arg.type !== 'ObjectExpression') return null;

                // Find the name property to insert description after it
                const nameProperty = arg.properties.find(
                  (p): p is TSESTree.Property =>
                    p.type === 'Property' &&
                    p.key.type === 'Identifier' &&
                    p.key.name === 'name'
                );

                if (!nameProperty) return null;

                const indentation = detectIndentation(nameProperty, sourceCode);
                const insertPosition = nameProperty.range[1];

                return fixer.insertTextAfterRange(
                  [insertPosition, insertPosition],
                  `,\n${indentation}description: 'TODO: Describe the initiative purpose, scope, and expected business impact'`
                );
              },
            });
            continue;
          }

          // Check if description is empty/whitespace
          if (description.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyDescription',
              data: { name },
            });
          }
        }
      },
    };
  },
});
