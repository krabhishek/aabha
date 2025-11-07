/**
 * Collaboration Decision-Making Approach Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **decision-making approach** defines how groups reach
 * consensus during collaborations. When collaborations involve decisions (approvals, negotiations,
 * reviews), the decision-making process must be explicit to avoid confusion, delays, and conflict.
 *
 * Without explicit decision-making approaches:
 * - **Meetings stall** - Participants don't know if they're voting, building consensus, or one person decides
 * - **Decisions get overturned** - Unclear authority leads to revisiting settled decisions
 * - **AI can't facilitate** - AI assistants can't guide decision processes without knowing the approach
 * - **Accountability blurs** - Nobody knows who had authority to make the final call
 *
 * Explicit decision-making approaches enable:
 * 1. **Clear process** - AI can guide participants through the correct decision protocol
 * 2. **Efficient meetings** - Participants know how decisions will be made before arriving
 * 3. **Automated tracking** - AI can track vote counts, consensus levels, or approver status
 * 4. **Conflict prevention** - Pre-defined approach prevents mid-meeting process arguments
 * 5. **Audit trails** - AI can document how each decision was reached for compliance
 *
 * **What it checks:**
 * - Review-approval collaborations specify decision approach (consensus, majority-vote, single-approver, etc.)
 * - Negotiation collaborations specify decision approach
 * - Decision-heavy collaboration types have explicit approaches
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Clear decision approach
 * @Collaboration({
 *   name: 'Architecture Review Board',
 *   collaborationType: 'review-approval',
 *   decisionMaking: {
 *     approach: 'majority-vote',
 *     quorum: '2/3 of voting members'
 *   }
 * })
 *
 * @Collaboration({
 *   name: 'Budget Negotiation',
 *   collaborationType: 'negotiation',
 *   decisionMaking: {
 *     approach: 'consensus',
 *     quorum: 'all required participants'
 *   }
 * })
 *
 * // ❌ Bad - Review without decision approach
 * @Collaboration({
 *   collaborationType: 'review-approval'  // How are approvals decided?
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { detectIndentation } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingDecisionApproach';

const TYPES_REQUIRING_APPROACH = ['review-approval', 'negotiation'];

export const collaborationDecisionMakingApproach = createRule<[], MessageIds>({
  name: 'collaboration-decision-making-approach',
  meta: {
    type: 'problem',
    docs: {
      description: 'Collaborations involving decisions should specify the decision-making approach. In context engineering, explicit decision processes help AI systems facilitate meetings, track decisions, and ensure accountability.',
    },
    messages: {
      missingDecisionApproach: "Collaboration '{{collaborationName}}' is type '{{collaborationType}}' but no decision-making approach is specified. In context engineering, explicit decision processes prevent confusion and enable AI-assisted facilitation. Specify how decisions will be made: 'consensus' (full agreement), 'majority-vote' (>50% approval), 'unanimous' (100% approval), 'single-approver' (one person decides), or 'weighted-vote' (votes have different weights). This clarity helps participants understand the process before the collaboration begins.",
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
          // Only apply to Collaboration decorators
          if (decorator.type !== 'Collaboration') {
            continue;
          }

          const collaborationName = decorator.metadata.name as string | undefined;
          const collaborationType = decorator.metadata.collaborationType as string | undefined;
          const decisionMaking = decorator.metadata.decisionMaking as { approach?: string } | undefined;

          if (collaborationType && TYPES_REQUIRING_APPROACH.includes(collaborationType)) {
            if (!decisionMaking?.approach) {
              const sourceCode = context.sourceCode;

              context.report({
                node: decorator.node,
                messageId: 'missingDecisionApproach',
                data: {
                  collaborationName: collaborationName || 'Unknown',
                  collaborationType,
                },
                fix(fixer) {
                  if (decorator.node.expression.type !== 'CallExpression') return null;

                  const arg = decorator.node.expression.arguments[0];
                  if (!arg || arg.type !== 'ObjectExpression') return null;

                  const properties = arg.properties;
                  if (properties.length === 0) return null;

                  // Check if decisionMaking property already exists
                  const decisionMakingProp = properties.find(
                    (prop): prop is TSESTree.Property =>
                      prop.type === 'Property' &&
                      prop.key.type === 'Identifier' &&
                      prop.key.name === 'decisionMaking'
                  );

                  if (decisionMakingProp && decisionMakingProp.value.type === 'ObjectExpression') {
                    // decisionMaking exists but approach is missing - add approach
                    const dmProps = decisionMakingProp.value.properties;
                    if (dmProps.length === 0) return null;

                    const lastDmProp = dmProps[dmProps.length - 1];
                    if (lastDmProp.type !== 'Property') return null;

                    const indentation = detectIndentation(lastDmProp, sourceCode);
                    const insertPosition = lastDmProp.range[1];

                    return fixer.insertTextAfterRange(
                      [insertPosition, insertPosition],
                      `,\n${indentation}approach: 'TODO: Specify approach (consensus/majority-vote/unanimous/single-approver/weighted-vote)'`
                    );
                  } else {
                    // decisionMaking doesn't exist - add whole object
                    const lastProp = properties[properties.length - 1];
                    if (lastProp.type !== 'Property') return null;

                    const indentation = detectIndentation(lastProp, sourceCode);
                    const insertPosition = lastProp.range[1];

                    return fixer.insertTextAfterRange(
                      [insertPosition, insertPosition],
                      `,\n${indentation}decisionMaking: {\n${indentation}  approach: 'TODO: Specify approach (consensus/majority-vote/unanimous/single-approver/weighted-vote)'\n${indentation}}`
                    );
                  }
                },
              });
            }
          }
        }
      },
    };
  },
});
