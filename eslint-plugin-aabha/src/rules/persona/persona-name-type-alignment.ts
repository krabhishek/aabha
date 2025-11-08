/**
 * Persona Name-Type Alignment Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, persona names should align with their types to ensure
 * clear modeling and avoid confusion. A Human persona named "Email Service" or a System persona
 * named "John Smith" creates contradictory context that confuses AI systems and developers.
 *
 * Name-type alignment enables AI to:
 * 1. **Generate coherent models** - Names that match types create clear mental models
 * 2. **Avoid confusion** - Misaligned names create contradictory context
 * 3. **Improve discoverability** - Names that match types are easier to find and understand
 * 4. **Enforce consistency** - Consistent naming patterns improve model quality
 *
 * **What it checks:**
 * - Human personas should have human-like names (person names, descriptive human archetypes)
 * - System personas should have system-like names (Service, System, API, Engine, etc.)
 * - Team personas should have team-like names (Team, Squad, Group, Department, etc.)
 * - Organization personas should have organization-like names (Company, Authority, Agency, etc.)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Human persona with person name
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee',
 * })
 *
 * // ✅ Good - System persona with system name
 * @Persona({
 *   type: PersonaType.System,
 *   name: 'Email Validation Service',
 * })
 *
 * // ❌ Bad - Human persona with system name
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Account Management System',  // Sounds like a system!
 * })
 *
 * // ❌ Bad - System persona with person name
 * @Persona({
 *   type: PersonaType.System,
 *   name: 'John Smith',  // Sounds like a person!
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'nameMismatchType';

export const personaNameTypeAlignment = createRule<[], MessageIds>({
  name: 'persona-name-type-alignment',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Persona names should align with their types. Human personas should have person names, System personas should have system names, etc. Misaligned names create contradictory context.',
    },
    messages: {
      nameMismatchType:
        "Persona '{{personaName}}' has type '{{personaType}}' but the name suggests a {{suggestedType}} persona. In context engineering, names should align with types: Human personas should have person names (e.g., 'Marcus Lee', 'Tech-Savvy Millennial'), System personas should have system names (e.g., 'Email Service', 'Account Management System'), Team personas should have team names (e.g., 'Mobile Dev Team'), Organization personas should have organization names (e.g., 'Financial Regulatory Authority'). Rename to align with the {{personaType}} type.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // Patterns that suggest different persona types
    const systemPatterns = [
      /\b(system|service|api|engine|platform|gateway|microservice|component|module|application|software|tool|utility|infrastructure|server|client|database|repository|store|cache|queue|stream|pipeline|processor|handler|controller|manager|factory|builder|validator|authenticator|authorizer|logger|monitor|analytics|tracker|scheduler|executor|worker|agent|bot|daemon|process|task|job|workflow|orchestrator|coordinator|dispatcher|router|proxy|middleware|adapter|connector|bridge|interface|sdk|library|framework|runtime)\b/i,
    ];

    const teamPatterns = [
      /\b(team|squad|group|department|division|unit|crew|staff|workforce|personnel|employees|workers|members|participants|contributors|collaborators|partners|alliance|coalition|consortium|collective|assembly|committee|board|panel|council|forum|network|community|guild)\b/i,
    ];

    const organizationPatterns = [
      /\b(company|corporation|corp|firm|business|enterprise|establishment|institution|agency|bureau|office|authority|administration|government|ministry|organization|org|association|society|foundation|institute|academy|university|college|school|hospital|clinic|laboratory|research|center|centre|facility|plant|factory|warehouse|store|shop|market|exchange|bank|financial|investment|insurance|regulatory|compliance|audit|accounting)\b/i,
    ];

    // Patterns that suggest human names (first name + last name only)
    // Note: Archetypes should be in the 'archetype' field, not the name
    const humanPatterns = [
      // First name + Last name pattern (e.g., "Marcus Lee", "John Smith")
      /^[A-Z][a-z]+ [A-Z][a-z]+$/,
    ];

    function checkNameMatchesType(name: string, type: string): { matches: boolean; suggestedType?: string } {
      // Check for system patterns
      const hasSystemPattern = systemPatterns.some((pattern) => pattern.test(name));
      // Check for team patterns
      const hasTeamPattern = teamPatterns.some((pattern) => pattern.test(name));
      // Check for organization patterns
      const hasOrgPattern = organizationPatterns.some((pattern) => pattern.test(name));
      // Check for human patterns
      const hasHumanPattern = humanPatterns.some((pattern) => pattern.test(name));

      // Determine suggested type based on patterns
      let suggestedType: string | undefined;
      if (hasSystemPattern && !hasTeamPattern && !hasOrgPattern && !hasHumanPattern) {
        suggestedType = 'system';
      } else if (hasTeamPattern && !hasSystemPattern && !hasOrgPattern && !hasHumanPattern) {
        suggestedType = 'team';
      } else if (hasOrgPattern && !hasSystemPattern && !hasTeamPattern && !hasHumanPattern) {
        suggestedType = 'organization';
      } else if (hasHumanPattern && !hasSystemPattern && !hasTeamPattern && !hasOrgPattern) {
        suggestedType = 'human';
      }

      // Check if type matches
      const typeLower = type.toLowerCase().replace('personatype.', '');
      if (suggestedType && suggestedType !== typeLower) {
        return { matches: false, suggestedType };
      }

      // If no clear pattern matches, be lenient for human personas (they can have various names)
      if (typeLower === 'human' && !hasSystemPattern && !hasTeamPattern && !hasOrgPattern) {
        return { matches: true };
      }

      // For non-human types, require clear pattern match
      if (typeLower === 'system' && !hasSystemPattern) {
        return { matches: false, suggestedType: 'human' };
      }
      if (typeLower === 'team' && !hasTeamPattern) {
        return { matches: false, suggestedType: 'human' };
      }
      if (typeLower === 'organization' && !hasOrgPattern) {
        return { matches: false, suggestedType: 'human' };
      }

      return { matches: true };
    }

    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const decorators = getAabhaDecorators(node);
        if (decorators.length === 0) return;

        for (const decorator of decorators) {
          if (decorator.type !== 'Persona') continue;

          const personaName = decorator.metadata.name as string | undefined;
          const personaType = decorator.metadata.type as string | undefined;

          if (!personaName || !personaType) continue;

          const { matches, suggestedType } = checkNameMatchesType(personaName, personaType);

          if (!matches && suggestedType) {
            context.report({
              node: decorator.node,
              messageId: 'nameMismatchType',
              data: {
                personaName,
                personaType: personaType.replace('PersonaType.', ''),
                suggestedType,
              },
            });
          }
        }
      },
    };
  },
});

