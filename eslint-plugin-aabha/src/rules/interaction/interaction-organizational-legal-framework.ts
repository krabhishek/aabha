/**
 * Interaction Organizational Legal Framework Rule
 *
 * **Why this rule exists:**
 * Organizational interactions involving formal agreements need legal framework documentation
 * for enforceability, dispute resolution, and contractual clarity. Without legal specs,
 * agreements may be unenforceable or ambiguous.
 *
 * **What it checks:**
 * - Organizational layer interactions with formal-agreement pattern should have legalFramework
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingFramework';

export const interactionOrganizationalLegalFramework = createRule<[], MessageIds>({
  name: 'interaction-organizational-legal-framework',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Organizational layer formal agreements should have legalFramework. In context engineering, legal framework ensures enforceability and dispute resolution clarity.',
    },
    messages: {
      missingFramework:
        "Interaction '{{interactionName}}' is Organizational layer formal agreement but lacks legalFramework. Add organizationalConfig.legalFramework with jurisdiction, governingLaw, and disputeResolution.",
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
          const pattern = decorator.metadata.pattern as string | undefined;

          if (layer !== 'Organizational' || pattern !== 'formal-agreement') continue;

          const orgConfig = decorator.metadata.organizationalConfig as { legalFramework?: object } | undefined;

          if (!orgConfig?.legalFramework) {
            context.report({
              node: decorator.node,
              messageId: 'missingFramework',
              data: { interactionName: interactionName || 'Unknown' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const orgConfigMatch = source.match(/organizationalConfig:\s*{/);
                if (!orgConfigMatch) return null;

                const insertIndex = orgConfigMatch.index! + orgConfigMatch[0].length;
                const insertion = `\n      legalFramework: {\n        jurisdiction: '', // TODO: Legal jurisdiction\n        governingLaw: '', // TODO: Governing law\n        disputeResolution: 'arbitration' // TODO: Dispute resolution mechanism\n      },`;
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
