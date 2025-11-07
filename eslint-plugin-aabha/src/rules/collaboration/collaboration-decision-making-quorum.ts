/**
 * Collaboration Decision-Making Quorum Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **quorum requirements** define the minimum participation
 * needed for valid decisions. Decision-making approaches like majority-vote, unanimous, and consensus
 * are meaningless without knowing how many participants must be present or voting.
 *
 * Without explicit quorum requirements:
 * - **Invalid decisions** - 2 people vote while 10 others are absent
 * - **Legitimacy questions** - Decisions get challenged because "not enough people were there"
 * - **AI can't validate** - AI assistants can't determine if a decision is valid
 * - **Gamed processes** - Small groups make decisions when others are unavailable
 *
 * Explicit quorum requirements enable:
 * 1. **Decision validity** - AI can verify that enough participants were present/voting
 * 2. **Automated reminders** - AI can notify participants when quorum is at risk
 * 3. **Meeting scheduling** - AI can suggest times when quorum is achievable
 * 4. **Process integrity** - Pre-defined quorum prevents gaming the system
 * 5. **Compliance tracking** - AI can audit decisions for quorum compliance
 *
 * **What it checks:**
 * - Majority-vote approaches specify quorum (error level)
 * - Unanimous approaches specify quorum (error level)
 * - Consensus approaches specify quorum (warning level)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Clear quorum requirements
 * @Collaboration({
 *   name: 'Release Decision',
 *   decisionMaking: {
 *     approach: 'majority-vote',
 *     quorum: '2/3 of voting members'
 *   }
 * })
 *
 * @Collaboration({
 *   name: 'Board Vote',
 *   decisionMaking: {
 *     approach: 'unanimous',
 *     quorum: 'all voting members must participate'
 *   }
 * })
 *
 * // ❌ Bad - Vote without quorum
 * @Collaboration({
 *   decisionMaking: {
 *     approach: 'majority-vote'  // Majority of how many? What's minimum?
 *   }
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { detectIndentation } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingQuorum';

const APPROACHES_REQUIRING_QUORUM = ['majority-vote', 'unanimous', 'consensus'];

export const collaborationDecisionMakingQuorum = createRule<[], MessageIds>({
  name: 'collaboration-decision-making-quorum',
  meta: {
    type: 'problem',
    docs: {
      description: 'Decision-making approaches like majority-vote and unanimous should specify quorum requirements. In context engineering, quorum requirements enable AI systems to validate decision legitimacy and ensure process integrity.',
    },
    messages: {
      missingQuorum: "Collaboration '{{collaborationName}}' uses '{{approach}}' decision-making but no quorum is specified. In context engineering, quorum requirements are essential for decision validity - AI systems need to know the minimum participation threshold. Without quorum, decisions may be challenged or invalidated. Define quorum clearly: '50%' (percentage), '2/3 majority' (fraction), 'all required participants' (explicit), or specific count like '5 voting members'. This prevents gaming the system and ensures legitimate decisions.",
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
          const decisionMaking = decorator.metadata.decisionMaking as {
            approach?: string;
            quorum?: string;
          } | undefined;

          if (decisionMaking?.approach && APPROACHES_REQUIRING_QUORUM.includes(decisionMaking.approach)) {
            if (!decisionMaking.quorum) {
              const sourceCode = context.sourceCode;

              context.report({
                node: decorator.node,
                messageId: 'missingQuorum',
                data: {
                  collaborationName: collaborationName || 'Unknown',
                  approach: decisionMaking.approach,
                },
                fix(fixer) {
                  if (decorator.node.expression.type !== 'CallExpression') return null;

                  const arg = decorator.node.expression.arguments[0];
                  if (!arg || arg.type !== 'ObjectExpression') return null;

                  // Find decisionMaking property
                  const decisionMakingProp = arg.properties.find(
                    (prop): prop is TSESTree.Property =>
                      prop.type === 'Property' &&
                      prop.key.type === 'Identifier' &&
                      prop.key.name === 'decisionMaking'
                  );

                  if (!decisionMakingProp || decisionMakingProp.value.type !== 'ObjectExpression') return null;

                  // Find the last property in decisionMaking object
                  const dmProps = decisionMakingProp.value.properties;
                  if (dmProps.length === 0) return null;

                  const lastDmProp = dmProps[dmProps.length - 1];
                  if (lastDmProp.type !== 'Property') return null;

                  const indentation = detectIndentation(lastDmProp, sourceCode);
                  const insertPosition = lastDmProp.range[1];

                  return fixer.insertTextAfterRange(
                    [insertPosition, insertPosition],
                    `,\n${indentation}quorum: 'TODO: Specify quorum (e.g., 50%, 2/3 majority, all required participants, or 5 voting members)'`
                  );
                },
              });
            }
          }
        }
      },
    };
  },
});
