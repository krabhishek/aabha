/**
 * Initiative Risks Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **risks** identify potential issues and mitigation
 * strategies for business initiatives. Without risk documentation, initiatives lack risk awareness
 * and AI systems cannot help identify, track, or mitigate potential problems.
 *
 * Risks enable AI to:
 * 1. **Identify threats** - Know potential issues that could impact initiative
 * 2. **Plan mitigation** - Understand how to address risks
 * 3. **Generate alerts** - Create monitoring for risk indicators
 * 4. **Enable decision-making** - Help prioritize risk mitigation
 *
 * Missing risk documentation makes it harder to identify and address potential problems.
 *
 * **What it checks:**
 * - Initiative has `risks` field defined (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has risks
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
 * // ⚠️ Warning - Missing risks
 * @BusinessInitiative({
 *   name: 'Instant Account Opening'
 *   // Missing risks - potential issues not documented
 * })
 * ```
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingRisks';

export const initiativeRisksRecommended = createRule<[], MessageIds>({
  name: 'initiative-risks-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Business initiatives should have a risks field. Risks identify potential issues and mitigation strategies, enabling better risk management and planning.',
    },
    messages: {
      missingRisks:
        "Initiative '{{name}}' is missing a 'risks' field. Risks identify potential issues and mitigation strategies, enabling better risk management and planning. Consider adding risks with their likelihood, impact, and mitigation strategies (e.g., 'risks: [{ risk: \"...\", likelihood: \"medium\", impact: \"high\", mitigation: \"...\" }]').",
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
          if (decorator.type !== 'BusinessInitiative') continue;

          const name = decorator.metadata.name as string | undefined;
          const risks = decorator.metadata.risks;

          // Check if risks is missing
          if (!risks) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if risks already exists in source to avoid duplicates
            if (source.includes('risks:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingRisks',
              data: { name: name || 'Unnamed initiative' },
                            fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if risks already exists in source to avoid duplicates
                if (source.includes('risks:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const risksTemplate = needsComma
                  ? `,\n  risks: [],  // TODO: Add risks with likelihood, impact, and mitigation`
                  : `\n  risks: [],  // TODO: Add risks with likelihood, impact, and mitigation`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  risksTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

