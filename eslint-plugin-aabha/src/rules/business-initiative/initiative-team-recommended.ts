/**
 * Initiative Team Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **team** identifies the people and teams involved in
 * executing a business initiative. Without team information, initiatives lack clarity on who is
 * responsible for implementation and AI systems cannot route work, assign tasks, or generate
 * collaboration reports.
 *
 * Team enables AI to:
 * 1. **Assign work** - Know who to assign tasks to
 * 2. **Enable collaboration** - Understand team composition
 * 3. **Generate reports** - Include team information in status reports
 * 4. **Route questions** - Direct inquiries to appropriate team members
 *
 * Missing team information makes it harder to coordinate work and understand initiative staffing.
 *
 * **What it checks:**
 * - Initiative has `team` field defined (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has team
 * @BusinessInitiative({
 *   name: 'Instant Account Opening',
 *   team: ['Digital Product Team', 'Engineering Team', 'Compliance Team']
 * })
 *
 * // ⚠️ Warning - Missing team
 * @BusinessInitiative({
 *   name: 'Instant Account Opening'
 *   // Missing team - unclear who is involved
 * })
 * ```
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingTeam';

export const initiativeTeamRecommended = createRule<[], MessageIds>({
  name: 'initiative-team-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Business initiatives should have a team field. Team identifies the people and teams involved in executing the initiative, enabling better coordination and collaboration.',
    },
    messages: {
      missingTeam:
        "Initiative '{{name}}' is missing a 'team' field. Team identifies the people and teams involved in executing the initiative, enabling better coordination and collaboration. Consider adding a team array with involved teams or individuals (e.g., 'team: [\"Product Team\", \"Engineering Team\"]').",
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
          const team = decorator.metadata.team;

          // Check if team is missing
          if (!team) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if team already exists in source to avoid duplicates
            if (source.includes('team:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingTeam',
              data: { name: name || 'Unnamed initiative' },
                            fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if team already exists in source to avoid duplicates
                if (source.includes('team:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const teamTemplate = needsComma
                  ? `,\n  team: [],  // TODO: Add involved teams or individuals`
                  : `\n  team: [],  // TODO: Add involved teams or individuals`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  teamTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

