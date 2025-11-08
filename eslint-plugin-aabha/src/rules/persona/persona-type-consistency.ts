/**
 * Persona Type Consistency Rule
 *
 * **Why this rule exists:**
 * Each persona type (Human, Team, Organization, System) has specific attributes that make sense
 * for that type. Using wrong type-specific attributes creates confusion and breaks the persona
 * model. In context engineering, type consistency ensures teams use appropriate attributes for
 * each persona archetype.
 *
 * **What it checks:**
 * - Human personas should use humanAttributes (or none), not system/team/org attributes
 * - Team personas should use teamAttributes, not human/system/org attributes
 * - System personas should use systemAttributes, not human/team/org attributes
 * - Organization personas should use organizationAttributes, not human/team/system attributes
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - System persona with systemAttributes
 * @Persona({
 *   type: PersonaType.System,
 *   name: 'Email Service',
 *   systemAttributes: { vendor: 'SendGrid', capabilities: [...] }
 * })
 *
 * // ❌ Bad - System persona with teamAttributes
 * @Persona({
 *   type: PersonaType.System,
 *   teamAttributes: { size: 5 }  // Wrong! Systems don't have team size
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'wrongAttributes';

export const personaTypeConsistency = createRule<[], MessageIds>({
  name: 'persona-type-consistency',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Persona type-specific attributes must match the declared type. In context engineering, using appropriate attributes for each persona type ensures clear modeling.',
    },
    messages: {
      wrongAttributes:
        "Persona '{{personaName}}' has type '{{personaType}}' but uses {{wrongAttr}}. In context engineering, each persona type has specific attributes: Human uses humanAttributes, Team uses teamAttributes, System uses systemAttributes, Organization uses organizationAttributes. Using wrong attributes creates confusion. For {{personaType}} personas, use {{correctAttr}} instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const decorators = getAabhaDecorators(node);
        if (decorators.length === 0) return;

        for (const decorator of decorators) {
          if (decorator.type !== 'Persona') continue;

          const personaName = decorator.metadata.name as string | undefined;
          const personaType = decorator.metadata.type as string | undefined;

          if (!personaType) continue;

          // Normalize personaType to handle both enum values and enum references
          const typeNormalized = personaType.toLowerCase().replace('personatype.', '');

          const hasHumanAttr = decorator.metadata.humanAttributes !== undefined;
          const hasTeamAttr = decorator.metadata.teamAttributes !== undefined;
          const hasSystemAttr = decorator.metadata.systemAttributes !== undefined;
          const hasOrgAttr = decorator.metadata.organizationAttributes !== undefined;

          // Validate based on type
          let wrongAttr: string | null = null;
          let correctAttr: string | null = null;

          switch (typeNormalized) {
            case 'human':
              if (hasTeamAttr) wrongAttr = 'teamAttributes';
              else if (hasSystemAttr) wrongAttr = 'systemAttributes';
              else if (hasOrgAttr) wrongAttr = 'organizationAttributes';
              correctAttr = 'humanAttributes';
              break;
            case 'team':
              if (hasHumanAttr) wrongAttr = 'humanAttributes';
              else if (hasSystemAttr) wrongAttr = 'systemAttributes';
              else if (hasOrgAttr) wrongAttr = 'organizationAttributes';
              correctAttr = 'teamAttributes';
              break;
            case 'system':
              if (hasHumanAttr) wrongAttr = 'humanAttributes';
              else if (hasTeamAttr) wrongAttr = 'teamAttributes';
              else if (hasOrgAttr) wrongAttr = 'organizationAttributes';
              correctAttr = 'systemAttributes';
              break;
            case 'organization':
              if (hasHumanAttr) wrongAttr = 'humanAttributes';
              else if (hasTeamAttr) wrongAttr = 'teamAttributes';
              else if (hasSystemAttr) wrongAttr = 'systemAttributes';
              correctAttr = 'organizationAttributes';
              break;
          }

          if (wrongAttr && correctAttr) {
            context.report({
              node: decorator.node,
              messageId: 'wrongAttributes',
              data: {
                personaName: personaName || 'Unknown',
                personaType,
                wrongAttr,
                correctAttr,
              },
            });
          }
        }
      },
    };
  },
});
