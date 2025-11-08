/**
 * Context Team Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **team** identifies the team or department managing
 * a context. While not always required, documenting the team helps with organizational structure,
 * resource allocation, and understanding who executes context work. This is particularly useful
 * for larger organizations with multiple teams.
 *
 * Team enables AI to:
 * 1. **Understand organizational structure** - Know which team manages the context
 * 2. **Route work** - Direct work items to the appropriate team
 * 3. **Plan resources** - Understand team capacity and allocation
 * 4. **Generate org charts** - Create organizational structure diagrams
 *
 * **What it checks:**
 * - Context should have `team` field (recommended, not required)
 * - Team is meaningful (not empty)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has team
 * @Context({
 *   name: 'Retail Banking',
 *   team: 'Retail Banking Division'
 * })
 *
 * // ⚠️ Warning - Missing team (recommended)
 * @Context({
 *   name: 'Retail Banking'
 *   // Missing team - consider documenting team/department
 * })
 * ```
 *
 * @category context
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingTeam' | 'emptyTeam';

export const contextTeamRecommended = createRule<[], MessageIds>({
  name: 'context-team-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Contexts should have team field. Team identifies the team or department managing the context, helping with organizational structure and resource allocation.',
    },
    messages: {
      missingTeam:
        "Context '{{name}}' is missing a 'team' field. Team identifies the team or department managing this context. While not always required, documenting the team helps with organizational structure, resource allocation, and understanding who executes context work. Add a team field (e.g., 'team: \"Retail Banking Division\"' or 'team: \"Customer Operations Team\"').",
      emptyTeam:
        "Context '{{name}}' has a team field but it's empty. Team should be meaningful and identify the team or department managing the context. Add a meaningful team name.",
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
          if (decorator.type !== 'Context') continue;

          const name = decorator.metadata.name as string | undefined;
          const team = decorator.metadata.team as string | undefined;

          // Check if team is missing (recommended, not required)
          if (!team) {
            context.report({
              node: decorator.node,
              messageId: 'missingTeam',
              data: { name: name || 'Unnamed context' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if team already exists in source to avoid duplicates
                if (source.includes('team:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const teamTemplate = `,\n  team: '',  // TODO: Team or department managing this context`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  teamTemplate,
                );
              },
            });
            continue;
          }

          // Check if team is empty
          if (typeof team === 'string' && team.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyTeam',
              data: { name: name || 'Unnamed context' },
            });
          }
        }
      },
    };
  },
});

