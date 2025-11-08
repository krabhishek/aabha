/**
 * Stakeholder Team Collaboration Required Rule
 *
 * **Why this rule exists:**
 * Team stakeholders represent groups or teams within an organization. They have unique collaboration
 * patterns that differ from individual stakeholders. Team stakeholders need collaboration patterns
 * with other stakeholders, team-appropriate engagement, and often have dependencies on other teams
 * or systems. Without proper collaboration documentation, teams cannot understand how team stakeholders
 * work together.
 *
 * Team collaboration enables AI to:
 * 1. **Understand team dynamics** - Know how teams collaborate with other stakeholders
 * 2. **Plan cross-team work** - Understand team dependencies and collaboration patterns
 * 3. **Model team behavior** - Understand when and how teams engage
 * 4. **Optimize workflows** - Improve team collaboration efficiency
 *
 * **What it checks:**
 * - Team stakeholders should have `collaborationPatterns` array
 * - Team stakeholders should have `engagement` field (typically 'daily' or 'weekly')
 * - Team stakeholders should have `dependencies` or `relationships` when they collaborate with others
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has team collaboration patterns
 * @Stakeholder({
 *   type: StakeholderType.Team,
 *   role: 'Development Team',
 *   engagement: 'daily',
 *   collaborationPatterns: [
 *     {
 *       withStakeholder: ProductManagerStakeholder,
 *       collaborationType: 'sync',
 *       purpose: 'Daily standup and sprint planning',
 *       frequency: 'daily'
 *     }
 *   ],
 *   dependencies: [DesignTeamStakeholder, BackendTeamStakeholder]
 * })
 *
 * // ⚠️ Warning - Missing team collaboration
 * @Stakeholder({
 *   type: StakeholderType.Team,
 *   role: 'Development Team'
 *   // Missing collaborationPatterns, dependencies
 * })
 * ```
 *
 * @category stakeholder
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingTeamCollaboration' | 'missingTeamDependencies';

export const stakeholderTeamCollaborationRequired = createRule<[], MessageIds>({
  name: 'stakeholder-team-collaboration-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Team stakeholders should have collaboration patterns. Team stakeholders need collaborationPatterns and dependencies to document how teams work together.',
    },
    messages: {
      missingTeamCollaboration:
        "Team stakeholder '{{name}}' should have collaborationPatterns array. Team stakeholders collaborate with other stakeholders and need documented collaboration patterns (e.g., 'collaborationPatterns: [{{ withStakeholder: OtherTeamStakeholder, collaborationType: \"sync\", purpose: \"Daily standup\", frequency: \"daily\" }}]').",
      missingTeamDependencies:
        "Team stakeholder '{{name}}' should have dependencies or relationships array. Team stakeholders typically depend on other teams or systems and need documented dependencies (e.g., 'dependencies: [OtherTeamStakeholder, SystemStakeholder]' or 'relationships: [...]').",
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
          if (decorator.type !== 'Stakeholder') continue;

          const stakeholderType = decorator.metadata.type as string | undefined;
          // Normalize stakeholderType to handle both enum values and enum references
          const typeNormalized = stakeholderType?.toLowerCase().replace('stakeholdertype.', '') || '';
          if (typeNormalized !== 'team') continue;

          const name = (decorator.metadata.name as string | undefined) || (decorator.metadata.role as string | undefined) || 'Unnamed stakeholder';
          const collaborationPatterns = decorator.metadata.collaborationPatterns;
          const dependencies = decorator.metadata.dependencies;
          const relationships = decorator.metadata.relationships;

          // Check for missing collaboration patterns
          if (!collaborationPatterns || (Array.isArray(collaborationPatterns) && collaborationPatterns.length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'missingTeamCollaboration',
              data: { name },
            });
          }

          // Check for missing dependencies or relationships
          const hasDependencies = dependencies && Array.isArray(dependencies) && dependencies.length > 0;
          const hasRelationships = relationships && Array.isArray(relationships) && relationships.length > 0;
          if (!hasDependencies && !hasRelationships) {
            context.report({
              node: decorator.node,
              messageId: 'missingTeamDependencies',
              data: { name },
            });
          }
        }
      },
    };
  },
});

