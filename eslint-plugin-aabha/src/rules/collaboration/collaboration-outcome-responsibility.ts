/**
 * Collaboration Outcome Responsibility Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **outcome accountability** ensures collaborations produce
 * tangible results with clear ownership. Expected outcomes without responsible parties lead to diffusion
 * of responsibility - everyone assumes someone else will handle it, and nothing happens.
 *
 * Outcomes without responsibility cause:
 * - **Unmet expectations** - Outcomes defined but nobody owns delivery
 * - **Finger pointing** - When outcomes aren't achieved, nobody was accountable
 * - **AI tracking gaps** - AI can't monitor progress without knowing who owns what
 * - **Follow-up failures** - No clear person to remind or check in with
 *
 * Clear outcome responsibility enables:
 * 1. **Accountability tracking** - AI knows who to remind about pending outcomes
 * 2. **Progress monitoring** - AI can check in with responsible parties
 * 3. **Dependency management** - AI understands who must deliver before next steps
 * 4. **Performance tracking** - Organizations can measure outcome delivery rates
 * 5. **Automated follow-up** - AI can send targeted reminders to outcome owners
 *
 * **What it checks:**
 * - Expected outcomes have assigned responsible parties
 * - Each outcome specifies who ensures its achievement
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Clear outcome ownership
 * @Collaboration({
 *   name: 'Architecture Review',
 *   expectedOutcomes: [
 *     {
 *       outcome: 'Approved design document',
 *       responsibleParty: 'Tech Lead'
 *     },
 *     {
 *       outcome: 'Updated technical roadmap',
 *       responsibleParty: 'Engineering Manager'
 *     }
 *   ]
 * })
 *
 * // ❌ Bad - Outcome without responsibility
 * @Collaboration({
 *   expectedOutcomes: [
 *     { outcome: 'Decision on vendor selection' }  // Who ensures this happens?
 *   ]
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { detectIndentation } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingOutcomeResponsibility';

export const collaborationOutcomeResponsibility = createRule<[], MessageIds>({
  name: 'collaboration-outcome-responsibility',
  meta: {
    type: 'problem',
    docs: {
      description: 'Expected collaboration outcomes should have clearly assigned responsible parties. In context engineering, outcome accountability enables AI systems to track progress, send reminders, and ensure collaboration results are achieved.',
    },
    messages: {
      missingOutcomeResponsibility: "Collaboration '{{collaborationName}}' expected outcome '{{outcome}}' has no responsible party assigned. In context engineering, outcome accountability is critical for delivery - without a responsible party, the 'diffusion of responsibility' effect means nobody ensures the outcome is achieved. Specify which stakeholder or role is accountable for this outcome (e.g., 'Tech Lead', 'Product Owner', 'Team Lead'). AI systems use this to track progress and send targeted reminders.",
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
          if (decorator.type !== 'Collaboration') continue;

          const collaborationName = decorator.metadata.name as string | undefined;
          const expectedOutcomes = decorator.metadata.expectedOutcomes as Array<{
            outcome: string;
            responsibleParty?: string;
          }> | undefined;

          if (!expectedOutcomes) continue;

          expectedOutcomes.forEach((outcome, index) => {
            if (!outcome.responsibleParty) {
              const sourceCode = context.sourceCode;

              context.report({
                node: decorator.node,
                messageId: 'missingOutcomeResponsibility',
                data: {
                  collaborationName: collaborationName || 'Unknown',
                  outcome: outcome.outcome,
                },
                fix(fixer) {
                  if (decorator.node.expression.type !== 'CallExpression') return null;

                  const arg = decorator.node.expression.arguments[0];
                  if (!arg || arg.type !== 'ObjectExpression') return null;

                  // Find expectedOutcomes array
                  const expectedOutcomesProp = arg.properties.find(
                    (prop): prop is TSESTree.Property =>
                      prop.type === 'Property' &&
                      prop.key.type === 'Identifier' &&
                      prop.key.name === 'expectedOutcomes'
                  );

                  if (!expectedOutcomesProp || expectedOutcomesProp.value.type !== 'ArrayExpression') return null;

                  // Find the specific outcome object
                  const outcomeNode = expectedOutcomesProp.value.elements[index];
                  if (!outcomeNode || outcomeNode.type !== 'ObjectExpression') return null;

                  // Find the last property in the outcome object
                  const outcomeProps = outcomeNode.properties;
                  if (outcomeProps.length === 0) return null;

                  const lastProp = outcomeProps[outcomeProps.length - 1];
                  if (lastProp.type !== 'Property') return null;

                  const indentation = detectIndentation(lastProp, sourceCode);
                  const insertPosition = lastProp.range[1];

                  return fixer.insertTextAfterRange(
                    [insertPosition, insertPosition],
                    `,\n${indentation}responsibleParty: 'TODO: Specify responsible stakeholder (e.g., Tech Lead, Product Owner, Team Lead)'`
                  );
                },
              });
            }
          });
        }
      },
    };
  },
});
