/**
 * Persona Identity Completeness Rule
 *
 * **Why this rule exists:**
 * Personas must have complete identity information to be actionable and memorable. In context
 * engineering, personas represent WHO people/systems are - their defining characteristics that
 * transcend specific contexts. Without complete identity (name, type, description), personas
 * become abstract and teams cannot empathize with or design for them effectively.
 *
 * Incomplete identity causes:
 * - **Lack of empathy** - Team cannot relate to abstract personas
 * - **Unclear target** - Cannot design for undefined users
 * - **Poor communication** - Cannot articulate persona to stakeholders
 * - **Weak alignment** - Team doesn't share mental model of users
 *
 * Complete identity enables:
 * 1. **Shared understanding** - Everyone knows who we're building for
 * 2. **Empathetic design** - Team can imagine persona's experience
 * 3. **Clear communication** - Persona is memorable and relatable
 * 4. **Focused decisions** - "Would Marcus use this?" becomes answerable
 *
 * **What it checks:**
 * - Persona has required identity fields: name, type
 * - Description provides meaningful overview of persona
 * - Name is clear and memorable (not empty/generic)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete identity
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee - Young Professional',
 *   description: 'Digital-native young professional seeking simple, fast banking that fits mobile-first lifestyle'
 * })
 *
 * // ❌ Bad - Missing description
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee'
 *   // Missing description - who is this person?
 * })
 *
 * // ❌ Bad - Generic name
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'User',  // Too generic!
 *   description: 'A user of the system'
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingDescription' | 'genericName';

export const personaIdentityCompleteness = createRule<[], MessageIds>({
  name: 'persona-identity-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Personas should have complete identity information. In context engineering, complete identity (name, type, description) enables empathy, clear communication, and focused design decisions.',
    },
    messages: {
      missingDescription:
        "Persona '{{personaName}}' lacks description. In context engineering, personas represent WHO people/systems are - their defining characteristics. Add description field with meaningful overview. Good descriptions capture essence of persona: demographics, psychology, key behaviors, and primary needs. Example for Human persona: 'Digital-native young professional seeking simple, fast banking that fits mobile-first lifestyle'. Example for System persona: 'Cloud-based email validation API providing RFC 5322 compliance checking and deliverability verification'. Without description, teams cannot empathize with or design for this persona.",
      genericName:
        "Persona '{{personaName}}' has generic name. In context engineering, personas need memorable, specific names for team alignment. Avoid generic names like 'User', 'Customer', 'System'. Use specific, relatable names. Examples: 'Marcus Lee - Young Professional', 'Budget-Conscious Parent', 'Email Validation Service', 'Mobile Dev Team'. Specific names make personas memorable and enable clear communication ('Would Marcus use this?' vs 'Would a user use this?').",
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

          const personaName = decorator.metadata.name as string | undefined;
          const description = decorator.metadata.description as string | undefined;

          // Check for missing description
          if (!description || description.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'missingDescription',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const personaType = decorator.metadata.type as string | undefined;

                // Find where to insert description (after name or type)
                const nameMatch = source.match(/name:\s*['"][^'"]*['"]/);
                if (!nameMatch) return null;

                const insertIndex = nameMatch.index! + nameMatch[0].length;
                let descriptionTemplate = '';

                // Normalize personaType to handle both enum values and enum references
                const typeNormalized = personaType?.toLowerCase().replace('personatype.', '') || '';

                // Provide type-specific description templates
                switch (typeNormalized) {
                  case 'human':
                    descriptionTemplate = `\n  description: '', // TODO: Describe this persona - demographics, psychology, key behaviors, needs`;
                    break;
                  case 'team':
                    descriptionTemplate = `\n  description: '', // TODO: Describe this team - composition, culture, goals, tools used`;
                    break;
                  case 'system':
                    descriptionTemplate = `\n  description: '', // TODO: Describe this system - capabilities, integration pattern, SLA`;
                    break;
                  case 'organization':
                    descriptionTemplate = `\n  description: '', // TODO: Describe this organization - type, relationship, services offered`;
                    break;
                  default:
                    descriptionTemplate = `\n  description: '', // TODO: Add meaningful description`;
                }

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertIndex, decorator.node.range[0] + insertIndex],
                  descriptionTemplate,
                );
              },
            });
          }

          // Check for generic names
          if (personaName) {
            const genericNames = ['user', 'customer', 'admin', 'system', 'service', 'team', 'organization'];
            const nameLower = personaName.toLowerCase().trim();
            if (genericNames.includes(nameLower) || nameLower.length === 0) {
              context.report({
                node: decorator.node,
                messageId: 'genericName',
                data: {
                  personaName,
                },
              });
            }
          }
        }
      },
    };
  },
});
