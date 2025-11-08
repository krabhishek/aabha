/**
 * Strategy Risks Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's strategic framework, **risks** document key risks and mitigation strategies. Documenting
 * risks helps teams proactively identify threats, plan mitigation, and monitor risk factors. While not
 * always required, documenting risks is a best practice for comprehensive strategy planning.
 *
 * Risks enable AI to:
 * 1. **Identify threats** - Know what could derail the strategy
 * 2. **Plan mitigation** - Understand how risks are being addressed
 * 3. **Monitor risk factors** - Track changes in risk likelihood or impact
 * 4. **Make informed decisions** - Understand risk-adjusted strategy viability
 *
 * **What it checks:**
 * - Strategy should have `risks` field (recommended, not required)
 * - When risks are provided, they should have required fields (risk, mitigation)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has risks
 * @Strategy({
 *   name: 'Digital Transformation',
 *   risks: [
 *     {
 *       risk: 'Regulatory changes could restrict digital banking',
 *       mitigation: 'Maintain close relationship with regulators, monitor policy changes',
 *       impact: 'high',
 *       likelihood: 'medium'
 *     }
 *   ]
 * })
 *
 * // ⚠️ Warning - Missing risks (recommended)
 * @Strategy({
 *   name: 'Digital Transformation'
 *   // Missing risks - consider documenting key risks
 * })
 * ```
 *
 * @category strategy
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingRisks' | 'incompleteRisk';

export const strategyRisksRecommended = createRule<[], MessageIds>({
  name: 'strategy-risks-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Strategies should have risks field. Risks document key risks and mitigation strategies, helping teams proactively identify threats and plan mitigation.',
    },
    messages: {
      missingRisks:
        "Strategy '{{name}}' is missing a 'risks' field. Documenting risks helps teams proactively identify threats, plan mitigation, and monitor risk factors. While not always required, documenting risks is a best practice for comprehensive strategy planning. Add a risks array with risk objects (e.g., 'risks: [{ risk: \"Regulatory changes\", mitigation: \"Monitor policy changes\", impact: \"high\", likelihood: \"medium\" }]').",
      incompleteRisk:
        "Strategy '{{name}}' has risks but one or more risk entries are incomplete. Risk entries should include 'risk' (description of the risk) and 'mitigation' (how the risk is being addressed). Optionally include 'impact' and 'likelihood' ('high', 'medium', 'low'). Fix incomplete risk entries.",
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
          const risks = decorator.metadata.risks as
            | Array<{
                risk?: string;
                mitigation?: string;
                impact?: 'high' | 'medium' | 'low';
                likelihood?: 'high' | 'medium' | 'low';
                [key: string]: unknown;
              }>
            | undefined;

          // Check if risks is missing (recommended, not required)
          if (!risks) {
            context.report({
              node: decorator.node,
              messageId: 'missingRisks',
              data: { name: name || 'Unnamed strategy' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if risks already exists in source to avoid duplicates
                if (source.includes('risks:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const risksTemplate = `,\n  risks: [\n    {\n      risk: '',  // TODO: Description of the risk\n      mitigation: '',  // TODO: How the risk is being addressed\n      impact: 'medium',  // TODO: 'high', 'medium', or 'low'\n      likelihood: 'medium'  // TODO: 'high', 'medium', or 'low'\n    }\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  risksTemplate,
                );
              },
            });
            continue;
          }

          // Check if risks array has incomplete entries
          if (Array.isArray(risks)) {
            for (let i = 0; i < risks.length; i++) {
              const risk = risks[i];
              if (!risk.risk || !risk.mitigation) {
                context.report({
                  node: decorator.node,
                  messageId: 'incompleteRisk',
                  data: { name: name || 'Unnamed strategy' },
                });
                break; // Report once for all incomplete risks
              }
            }
          }
        }
      },
    };
  },
});

