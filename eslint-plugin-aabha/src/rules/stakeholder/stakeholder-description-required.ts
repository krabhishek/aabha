/**
 * Stakeholder Description Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's stakeholder framework, descriptions provide essential context about who the stakeholder is,
 * their role, importance, and context-specific characteristics. Without descriptions, stakeholders become
 * abstract and teams cannot understand their purpose or significance. Descriptions enable AI systems to
 * understand stakeholder context and generate accurate recommendations.
 *
 * Descriptions enable AI to:
 * 1. **Understand stakeholder purpose** - Know why this stakeholder exists in this context
 * 2. **Generate context-aware recommendations** - Understand stakeholder characteristics
 * 3. **Improve communication** - Descriptions help teams articulate stakeholder importance
 * 4. **Enable empathy** - Rich descriptions help teams understand stakeholder needs
 *
 * Missing descriptions mean AI systems and teams cannot properly understand stakeholder significance.
 *
 * **What it checks:**
 * - Stakeholders should have `description` field
 * - Description should be meaningful (not empty or generic)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has description
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   description: 'High-net-worth individual seeking diversified investment opportunities with focus on ESG criteria and steady long-term growth',
 *   persona: TechSavvyMillennial,
 *   context: InvestmentManagementContext
 * })
 *
 * // ❌ Bad - Missing description
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   persona: TechSavvyMillennial,
 *   context: InvestmentManagementContext
 *   // Missing description
 * })
 * ```
 *
 * @category stakeholder
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingDescription' | 'emptyDescription';

export const stakeholderDescriptionRequired = createRule<[], MessageIds>({
  name: 'stakeholder-description-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Stakeholders should have description field to provide essential context about their role, importance, and characteristics.',
    },
    messages: {
      missingDescription:
        "Stakeholder '{{name}}' is missing description field. In context engineering, descriptions provide essential context about who the stakeholder is, their role, importance, and context-specific characteristics. Add a description field explaining the stakeholder's role, importance, and characteristics. Example: 'High-net-worth individual seeking diversified investment opportunities with focus on ESG criteria'.",
      emptyDescription:
        "Stakeholder '{{name}}' has empty description. Description should be meaningful and provide context about the stakeholder's role, importance, and characteristics. Provide a meaningful description.",
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
          if (decorator.type !== 'Stakeholder') continue;

          const name = (decorator.metadata.name as string | undefined) || (decorator.metadata.role as string | undefined) || 'Unnamed stakeholder';
          const description = decorator.metadata.description as string | undefined;

          // Check if description is missing
          if (description === undefined) {
            context.report({
              node: decorator.node,
              messageId: 'missingDescription',
              data: { name },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const descriptionTemplate = `,\n  description: ''  // TODO: Explain stakeholder's role, importance, and context-specific characteristics`;

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
              data: { name },
            });
          }
        }
      },
    };
  },
});

