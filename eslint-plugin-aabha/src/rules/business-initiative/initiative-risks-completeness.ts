/**
 * Initiative Risks Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **risks** identify potential issues and mitigation
 * strategies for business initiatives. When risks are provided, they should be complete with both
 * risk description and mitigation strategy to enable proper risk management.
 *
 * Complete risks enable AI to:
 * 1. **Understand threats** - Know what risks exist and how to address them
 * 2. **Plan mitigation** - Understand mitigation strategies
 * 3. **Generate alerts** - Create monitoring for risk indicators
 * 4. **Enable decision-making** - Help prioritize risk mitigation
 *
 * Incomplete risks make it harder to manage or mitigate potential problems.
 *
 * **What it checks:**
 * - Risks have `risk` field when provided
 * - Risks have `mitigation` field when provided
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete risks
 * @BusinessInitiative({
 *   name: 'Instant Account Opening',
 *   risks: [
 *     {
 *       risk: 'KYC/AML compliance requirements may slow process',
 *       likelihood: 'medium',
 *       impact: 'high',
 *       mitigation: 'Early engagement with compliance team'
 *     }
 *   ]
 * })
 *
 * // ❌ Bad - Incomplete risk
 * @BusinessInitiative({
 *   name: 'Instant Account Opening',
 *   risks: [
 *     {
 *       risk: 'KYC/AML compliance requirements may slow process'
 *       // Missing mitigation
 *     }
 *   ]
 * })
 * ```
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'incompleteRisk';

export const initiativeRisksCompleteness = createRule<[], MessageIds>({
  name: 'initiative-risks-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Business initiative risks should be complete with both risk description and mitigation strategy when provided. Complete risks enable proper risk management.',
    },
    messages: {
      incompleteRisk:
        "Initiative '{{name}}' has risks but risk at index {{index}} is missing '{{field}}'. Complete risks should include both risk description and mitigation strategy to enable proper risk management. Add the missing field to the risk.",
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
          if (decorator.type !== 'BusinessInitiative') continue;

          const name = decorator.metadata.name as string | undefined;
          const risks = decorator.metadata.risks;

          // Only check if risks exist
          if (!risks) continue;

          if (!Array.isArray(risks)) continue;

          // Check each risk
          risks.forEach((risk, index) => {
            if (typeof risk !== 'object' || risk === null) return;

            const riskObj = risk as {
              risk?: string;
              mitigation?: string;
              impact?: string;
              likelihood?: string;
            };

            // Check if risk description is missing
            if (!riskObj.risk) {
              context.report({
                node: decorator.node,
                messageId: 'incompleteRisk',
                data: {
                  name: name || 'Unnamed initiative',
                  index,
                  field: 'risk',
                },
              });
            }

            // Check if mitigation is missing
            if (!riskObj.mitigation) {
              context.report({
                node: decorator.node,
                messageId: 'incompleteRisk',
                data: {
                  name: name || 'Unnamed initiative',
                  index,
                  field: 'mitigation',
                },
              });
            }
          });
        }
      },
    };
  },
});

