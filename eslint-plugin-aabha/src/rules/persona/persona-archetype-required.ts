/**
 * Persona Archetype Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, archetypes provide higher-level classification
 * that helps teams understand persona categories and patterns. Archetypes make personas
 * more memorable and help identify common patterns across different personas.
 *
 * Archetypes enable AI to:
 * 1. **Categorize personas** - Group similar personas together
 * 2. **Identify patterns** - Recognize common archetypes across models
 * 3. **Improve communication** - "The Optimizer" is more memorable than just a name
 * 4. **Guide design** - Archetypes suggest typical needs and behaviors
 *
 * **What it checks:**
 * - Personas should have an archetype field defined
 * - Archetype should be meaningful (not empty or generic)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has archetype
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee',
 *   archetype: 'The Optimizer - Always seeking efficiency and optimization'
 * })
 *
 * // ❌ Bad - Missing archetype
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee'
 *   // Missing archetype
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingArchetype' | 'emptyArchetype';

export const personaArchetypeRequired = createRule<[], MessageIds>({
  name: 'persona-archetype-required',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Personas should have an archetype field to provide higher-level classification. Archetypes make personas more memorable and help identify common patterns.',
    },
    messages: {
      missingArchetype:
        "Persona '{{personaName}}' is missing archetype field. In context engineering, archetypes provide higher-level classification that helps teams understand persona categories and patterns. Archetypes make personas more memorable (e.g., 'The Optimizer', 'The Cautious Saver', 'The Early Adopter') and help identify common patterns across different personas. Add an 'archetype' field with a meaningful classification.",
      emptyArchetype:
        "Persona '{{personaName}}' has empty archetype. Archetype should be meaningful and descriptive. Examples: 'The Optimizer - Always seeking efficiency and optimization', 'The Cautious Saver - Risk-averse, security-focused', 'The Early Adopter - First to try new features'. Provide a meaningful archetype value.",
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
          const archetype = decorator.metadata.archetype as string | undefined;

          // Check if archetype is missing
          if (archetype === undefined) {
            context.report({
              node: decorator.node,
              messageId: 'missingArchetype',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const archetypeTemplate = `,\n  archetype: ''  // TODO: Higher-level classification (e.g., 'The Optimizer', 'The Cautious Saver')`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  archetypeTemplate,
                );
              },
            });
            continue;
          }

          // Check if archetype is empty
          if (typeof archetype === 'string' && archetype.trim().length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyArchetype',
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

