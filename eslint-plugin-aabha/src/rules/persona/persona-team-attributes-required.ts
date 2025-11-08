/**
 * Persona Team Attributes Required Rule
 *
 * **Why this rule exists:**
 * Team personas represent cross-functional teams, departments, and project squads. In context
 * engineering, team personas need team-specific attributes (size, composition, structure, working
 * hours, location, tools) to document team characteristics, working patterns, and collaboration
 * requirements. Without team attributes, teams cannot understand team dynamics, availability,
 * or integration points.
 *
 * Team attributes enable AI to:
 * 1. **Understand team structure** - Size and composition reveal team capabilities
 * 2. **Plan interactions** - Working hours and location affect availability
 * 3. **Design workflows** - Tools and culture inform integration patterns
 * 4. **Coordinate work** - Structure and reporting clarify decision-making
 *
 * **What it checks:**
 * - Team personas should have teamAttributes field defined
 * - Team attributes should include key fields (size, composition, structure, workingHours)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has team attributes
 * @Persona({
 *   type: PersonaType.Team,
 *   name: 'Mobile Dev Team',
 *   teamAttributes: {
 *     size: 11,
 *     composition: '4 iOS developers, 4 Android developers, 2 QA engineers, 1 PM',
 *     structure: 'Agile Scrum team reporting to VP of Digital Product',
 *     workingHours: '9 AM - 6 PM with flexible work (remote-friendly)'
 *   }
 * })
 *
 * // ❌ Bad - Missing team attributes
 * @Persona({
 *   type: PersonaType.Team,
 *   name: 'Mobile Dev Team'
 *   // Missing teamAttributes
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingTeamAttributes' | 'incompleteTeamAttributes';

export const personaTeamAttributesRequired = createRule<[], MessageIds>({
  name: 'persona-team-attributes-required',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Team personas should have teamAttributes field with key information. Team attributes document team characteristics, working patterns, and collaboration requirements.',
    },
    messages: {
      missingTeamAttributes:
        "Team persona '{{personaName}}' is missing teamAttributes field. In context engineering, team personas represent cross-functional teams, departments, and project squads that need team documentation. Add teamAttributes with size, composition, structure, workingHours, and other relevant fields. Without teamAttributes, teams cannot understand team dynamics, availability, or integration points.",
      incompleteTeamAttributes:
        "Team persona '{{personaName}}' has teamAttributes but missing key fields. Team attributes should include size, composition, structure, and workingHours to provide essential context. Add missing fields: {{missingFields}}.",
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
                size?: number;
                composition?: string;
                structure?: string;
                workingHours?: string;
                [key: string]: unknown;
              }
            | undefined;

          // Check if teamAttributes is missing
          if (!teamAttributes) {
            context.report({
              node: decorator.node,
              messageId: 'missingTeamAttributes',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const teamAttributesTemplate = `,\n  teamAttributes: {\n    size: 0,  // TODO: Number of team members\n    composition: '',  // TODO: Breakdown of roles and specializations\n    structure: '',  // TODO: Organizational structure and reporting\n    workingHours: ''  // TODO: Normal operating hours and availability\n  }`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  teamAttributesTemplate,
                );
              },
            });
            continue;
          }

          // Check for key missing fields
          const missingFields: string[] = [];
          if (teamAttributes.size === undefined || teamAttributes.size === null) {
            missingFields.push('size');
          }
          if (!teamAttributes.composition) {
            missingFields.push('composition');
          }
          if (!teamAttributes.structure) {
            missingFields.push('structure');
          }
          if (!teamAttributes.workingHours) {
            missingFields.push('workingHours');
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

