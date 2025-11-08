/**
 * Persona Team Attributes Completeness Rule
 *
 * **Why this rule exists:**
 * Team personas represent cross-functional teams, departments, and project squads. While
 * teamAttributes may exist with basic required fields, they should include additional
 * recommended fields (location, toolsUsed, culture) to provide complete team context. Incomplete
 * team attributes leave teams without critical information needed for collaboration planning,
 * tool integration, and understanding team dynamics.
 *
 * Team attributes completeness enables AI to:
 * 1. **Plan collaboration** - Location and workingHours inform availability and timezone coordination
 * 2. **Integrate tools** - ToolsUsed reveals integration points and dependencies
 * 3. **Understand culture** - Culture affects communication style and working patterns
 * 4. **Coordinate work** - Complete attributes enable effective cross-team collaboration
 *
 * **What it checks:**
 * - Team personas with teamAttributes should include recommended fields
 * - Recommended fields: location, toolsUsed, culture
 * - These fields provide essential context beyond the minimum required fields
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has complete team attributes
 * @Persona({
 *   type: PersonaType.Team,
 *   name: 'Mobile Dev Team',
 *   teamAttributes: {
 *     size: 11,
 *     composition: '4 iOS developers, 4 Android developers, 2 QA engineers, 1 PM',
 *     structure: 'Agile Scrum team reporting to VP of Digital Product',
 *     workingHours: '9 AM - 6 PM with flexible work (remote-friendly)',
 *     location: 'Distributed: 6 in HQ office, 5 fully remote',
 *     toolsUsed: ['Xcode', 'Android Studio', 'GitHub', 'Jira', 'Slack', 'TestFlight', 'Firebase'],
 *     culture: 'Agile, innovative, and data-driven; strong focus on UX'
 *   }
 * })
 *
 * // ⚠️ Warning - Incomplete team attributes
 * @Persona({
 *   type: PersonaType.Team,
 *   name: 'Mobile Dev Team',
 *   teamAttributes: {
 *     size: 11,
 *     composition: '4 iOS, 4 Android, 2 QA, 1 PM',
 *     structure: 'Agile Scrum team',
 *     workingHours: '9 AM - 6 PM'
 *     // Missing location, toolsUsed, culture
 *   }
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'incompleteTeamAttributes';

export const personaTeamAttributesCompleteness = createRule<[], MessageIds>({
  name: 'persona-team-attributes-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Team personas with teamAttributes should include recommended fields. Complete team attributes provide essential context for collaboration planning, tool integration, and understanding team dynamics.',
    },
    messages: {
      incompleteTeamAttributes:
        "Team persona '{{personaName}}' has teamAttributes but missing recommended fields. Team attributes should include location, toolsUsed, and culture to provide complete team context. Add missing fields: {{missingFields}}. Without these fields, teams lack critical information needed for collaboration planning, tool integration, and understanding team dynamics.",
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
          if (decorator.type !== 'Persona') continue;

          const personaType = decorator.metadata.type as string | undefined;
          // Normalize personaType to handle both enum values and enum references
          const typeNormalized = personaType?.toLowerCase().replace('personatype.', '') || '';
          if (typeNormalized !== 'team') continue;

          const personaName = decorator.metadata.name as string | undefined;
          const teamAttributes = decorator.metadata.teamAttributes as
            | {
                location?: string;
                toolsUsed?: string[];
                culture?: string;
                [key: string]: unknown;
              }
            | undefined;

          // Only check if teamAttributes exists (missing is handled by persona-team-attributes-required rule)
          if (!teamAttributes || Object.keys(teamAttributes).length === 0) {
            continue;
          }

          // Check for recommended missing fields
          const missingFields: string[] = [];

          // Location helps understand geographic distribution and remote work
          if (!teamAttributes.location) {
            missingFields.push('location');
          }

          // ToolsUsed reveals integration points and dependencies
          if (!teamAttributes.toolsUsed || teamAttributes.toolsUsed.length === 0) {
            missingFields.push('toolsUsed');
          }

          // Culture affects communication style and working patterns
          if (!teamAttributes.culture) {
            missingFields.push('culture');
          }

          if (missingFields.length > 0) {
            context.report({
              node: decorator.node,
              messageId: 'incompleteTeamAttributes',
              data: {
                personaName: personaName || 'Unknown',
                missingFields: missingFields.join(', '),
              },
            });
          }
        }
      },
    };
  },
});

