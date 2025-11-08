/**
 * Persona Needs Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, needs capture multi-dimensional requirements
 * (functional, emotional, social, informational) that go beyond surface-level goals.
 * Needs reveal what personas truly require to be successful, not just what they say they want.
 * Without needs, personas lack depth and teams cannot design for deeper human requirements.
 *
 * Needs enable AI to:
 * 1. **Understand deeper requirements** - Know what personas truly need beyond stated goals
 * 2. **Design empathetically** - Address functional, emotional, social, and informational needs
 * 3. **Create value** - Design solutions that meet unstated but critical needs
 * 4. **Differentiate** - Address needs competitors might miss
 *
 * **What it checks:**
 * - Personas should have needs field defined
 * - Needs should include at least one dimension (functional, emotional, social, informational)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has needs
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee',
 *   needs: {
 *     functional: ['Track expenses automatically', 'Transfer money instantly'],
 *     emotional: ['Feel in control', 'Feel secure'],
 *     social: ['Be seen as financially responsible'],
 *     informational: ['Understand where money goes']
 *   }
 * })
 *
 * // ❌ Bad - Missing needs
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee'
 *   // Missing needs
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingNeeds' | 'emptyNeeds';

export const personaNeedsRequired = createRule<[], MessageIds>({
  name: 'persona-needs-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Personas should have needs field. Needs capture multi-dimensional requirements (functional, emotional, social, informational) that go beyond surface-level goals.',
    },
    messages: {
      missingNeeds:
        "Persona '{{personaName}}' is missing needs field. In context engineering, needs capture multi-dimensional requirements (functional, emotional, social, informational) that go beyond surface-level goals. Needs reveal what personas truly require to be successful. Add a 'needs' object with at least one dimension (e.g., 'needs: {{ functional: [\"Track expenses automatically\"], emotional: [\"Feel in control\"] }}').",
      emptyNeeds:
        "Persona '{{personaName}}' has needs field but it's empty. Needs should include at least one dimension: functional (practical needs), emotional (feelings sought), social (social needs), or informational (information needs). Add meaningful needs that describe what this persona truly requires.",
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
          const needs = decorator.metadata.needs as
            | {
                functional?: string[];
                emotional?: string[];
                social?: string[];
                informational?: string[];
                [key: string]: unknown;
              }
            | undefined;

          // Check if needs is missing
          if (!needs) {
            context.report({
              node: decorator.node,
              messageId: 'missingNeeds',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if needs already exists in source to avoid duplicates
                if (source.includes('needs:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const needsTemplate = `,\n  needs: {\n    functional: [''],  // TODO: Practical, task-oriented needs\n    emotional: [''],  // TODO: Feelings and emotional states sought\n    social: [''],  // TODO: Social connections and status needs\n    informational: ['']  // TODO: Information and knowledge needs\n  }`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  needsTemplate,
                );
              },
            });
            continue;
          }

          // Check if needs is empty (no dimensions have values)
          const hasFunctional = needs.functional && needs.functional.length > 0;
          const hasEmotional = needs.emotional && needs.emotional.length > 0;
          const hasSocial = needs.social && needs.social.length > 0;
          const hasInformational = needs.informational && needs.informational.length > 0;

          if (!hasFunctional && !hasEmotional && !hasSocial && !hasInformational) {
            context.report({
              node: decorator.node,
              messageId: 'emptyNeeds',
              data: {
                personaName: personaName || 'Unknown',
              },
            });
          }
        }
      },
    };
  },
});

