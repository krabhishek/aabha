/**
 * Interaction Organizational Compliance Rule
 *
 * **Why this rule exists:**
 * Organizational layer interactions require compliance requirements documentation for audits,
 * regulatory adherence, and risk management. Without compliance specs, organizations face
 * audit failures and regulatory penalties.
 *
 * **What it checks:**
 * - Organizational layer interactions should have complianceRequirements specified
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingCompliance';

export const interactionOrganizationalCompliance = createRule<[], MessageIds>({
  name: 'interaction-organizational-compliance',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Organizational layer interactions should have complianceRequirements. In context engineering, compliance documentation ensures regulatory adherence and audit readiness.',
    },
    messages: {
      missingCompliance:
        "Interaction '{{interactionName}}' is Organizational layer but lacks complianceRequirements. Add organizationalConfig.complianceRequirements array. Examples: ['SOC 2 Type II', 'PCI DSS Level 1', 'Annual audit'].",
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
          if (decorator.type !== 'Interaction') continue;

          const interactionName = decorator.metadata.name as string | undefined;
          const layer = decorator.metadata.layer as string | undefined;

          if (layer !== 'Organizational') continue;

          const orgConfig = decorator.metadata.organizationalConfig as
            | { complianceRequirements?: string[] }
            | undefined;

          if (!orgConfig?.complianceRequirements || orgConfig.complianceRequirements.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'missingCompliance',
              data: { interactionName: interactionName || 'Unknown' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const orgConfigMatch = source.match(/organizationalConfig:\s*{/);
                if (!orgConfigMatch) return null;

                const insertIndex = orgConfigMatch.index! + orgConfigMatch[0].length;
                const insertion = `\n      complianceRequirements: [''], // TODO: Add compliance requirements`;
                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertIndex, decorator.node.range[0] + insertIndex],
                  insertion,
                );
              },
            });
          }
        }
      },
    };
  },
});
