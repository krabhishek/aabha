/**
 * Persona Motivations Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, motivations are core internal drivers that motivate
 * behavior and decisions. For Human personas, motivations explain why they act the way they do
 * and what drives their choices. Without motivations, personas lack depth and teams cannot
 * understand the underlying drivers of behavior.
 *
 * Motivations enable AI to:
 * 1. **Understand drivers** - Know what motivates persona behavior and decisions
 * 2. **Design for motivation** - Create features that align with what personas care about
 * 3. **Predict behavior** - Understand how motivations influence choices
 * 4. **Create empathy** - Motivations help teams understand persona priorities
 *
 * **What it checks:**
 * - Human personas should have motivations field defined
 * - Motivations should be meaningful (not empty)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has motivations
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee',
 *   motivations: ['Financial independence', 'Tech convenience', 'Efficiency']
 * })
 *
 * // ❌ Bad - Missing motivations
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee'
 *   // Missing motivations
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingMotivations' | 'emptyMotivations';

export const personaMotivationsRequired = createRule<[], MessageIds>({
  name: 'persona-motivations-required',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Human personas should have motivations field. Motivations are core internal drivers that motivate behavior and decisions, helping teams understand what drives persona choices.',
    },
    messages: {
      missingMotivations:
        "Human persona '{{personaName}}' is missing motivations field. In context engineering, motivations are core internal drivers that motivate behavior and decisions. For Human personas, motivations explain why they act the way they do and what drives their choices. Add a 'motivations' array with core drivers (e.g., 'motivations: [\"Financial independence\", \"Tech convenience\", \"Efficiency\"]').",
      emptyMotivations:
        "Human persona '{{personaName}}' has motivations field but it's empty. Motivations should be meaningful and describe core internal drivers (e.g., 'Financial independence', 'Career growth', 'Family security', 'Social status'). Add meaningful motivations that explain what drives this persona's behavior and decisions.",
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
          const motivations = decorator.metadata.motivations as string[] | undefined;

          // Check if motivations is missing
          if (!motivations) {
            context.report({
              node: decorator.node,
              messageId: 'missingMotivations',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if motivations already exists in source to avoid duplicates
                if (source.includes('motivations:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const motivationsTemplate = `,\n  motivations: [\n    '', // TODO: Core internal drivers that motivate behavior and decisions\n    '' // TODO: Add more motivations (e.g., 'Financial independence', 'Career growth', 'Family security')\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  motivationsTemplate,
                );
              },
            });
            continue;
          }

          // Check if motivations is empty
          if (motivations.length === 0 || motivations.every((m) => typeof m === 'string' && m.trim().length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'emptyMotivations',
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

