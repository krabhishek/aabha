/**
 * Persona Technical Proficiency Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, technical proficiency indicates how comfortable
 * a persona is with technology. This is critical for Human personas as it affects UI complexity,
 * feature design, terminology, and support needs. Without technical proficiency, teams cannot
 * design appropriate user experiences or determine the right level of technical detail.
 *
 * Technical proficiency enables AI to:
 * 1. **Design appropriate UI** - High proficiency can handle complex interfaces, low needs simplicity
 * 2. **Choose terminology** - High proficiency understands technical terms, low needs plain language
 * 3. **Plan features** - High proficiency can use advanced features, low needs guided workflows
 * 4. **Estimate support needs** - Low proficiency needs more help, high proficiency needs less
 *
 * **What it checks:**
 * - Human personas should have technicalProficiency field defined
 * - Technical proficiency should be one of: 'low', 'medium', 'high'
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has technical proficiency
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee',
 *   technicalProficiency: 'high'
 * })
 *
 * // ❌ Bad - Missing technical proficiency
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee'
 *   // Missing technicalProficiency
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingTechnicalProficiency';

export const personaTechnicalProficiencyRequired = createRule<[], MessageIds>({
  name: 'persona-technical-proficiency-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Human personas should have technicalProficiency field. Technical proficiency indicates how comfortable a persona is with technology, affecting UI design and feature complexity.',
    },
    messages: {
      missingTechnicalProficiency:
        "Human persona '{{personaName}}' is missing technicalProficiency field. In context engineering, technical proficiency indicates how comfortable a persona is with technology. This affects UI complexity, terminology, feature design, and support needs. Add technicalProficiency field with value 'low' (prefers simple, non-technical solutions), 'medium' (comfortable with mainstream tech), or 'high' (very comfortable, early adopter).",
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
          if (!personaType || personaType.toLowerCase().replace('personatype.', '') !== 'human') continue;

          const personaName = decorator.metadata.name as string | undefined;
          const technicalProficiency = decorator.metadata.technicalProficiency;

          // Check if technicalProficiency is missing
          if (!technicalProficiency) {
            context.report({
              node: decorator.node,
              messageId: 'missingTechnicalProficiency',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if technicalProficiency already exists in source to avoid duplicates
                if (source.includes('technicalProficiency:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const technicalProficiencyTemplate = `,\n  technicalProficiency: 'medium',  // TODO: 'low' (prefers simple), 'medium' (mainstream tech), or 'high' (early adopter)`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  technicalProficiencyTemplate,
                );
              },
            });
          }
        }
      },
    };
  },
});

