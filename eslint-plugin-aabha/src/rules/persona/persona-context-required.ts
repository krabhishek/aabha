/**
 * Persona Context Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, context captures the broader situation in which
 * personas operate - their life stage, current situation, challenges, and environmental factors.
 * For Human personas, context is essential for understanding why they behave the way they do
 * and what constraints they face. Without context, personas are disconnected from reality.
 *
 * Context enables AI to:
 * 1. **Understand motivations** - Life stage explains why certain goals matter
 * 2. **Design empathetically** - Current situation reveals constraints and priorities
 * 3. **Anticipate needs** - Environmental factors suggest future requirements
 * 4. **Create realistic scenarios** - Context grounds personas in real-world situations
 *
 * **What it checks:**
 * - Human personas should have context field with lifeStage or currentSituation
 * - Context should provide meaningful situational information
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has context
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee',
 *   context: {
 *     lifeStage: 'Early career - building foundation',
 *     currentSituation: 'Just started first job, new to managing money independently'
 *   }
 * })
 *
 * // ❌ Bad - Missing context
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee'
 *   // Missing context
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingContext' | 'emptyContext';

export const personaContextRequired = createRule<[], MessageIds>({
  name: 'persona-context-required',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Human personas should have context field with life stage and current situation. Context captures the broader situation in which personas operate and enables empathetic design.',
    },
    messages: {
      missingContext:
        "Human persona '{{personaName}}' is missing context field. In context engineering, context captures the broader situation in which personas operate - their life stage, current situation, challenges, and environmental factors. For Human personas, context is essential for understanding why they behave the way they do and what constraints they face. Add a 'context' object with at least lifeStage or currentSituation.",
      emptyContext:
        "Human persona '{{personaName}}' has context field but it's empty. Context should include lifeStage (where they are in life journey) and/or currentSituation (immediate circumstances) to provide meaningful situational information. Add meaningful context information.",
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
          const contextField = decorator.metadata.context as
            | {
                lifeStage?: string;
                currentSituation?: string;
                [key: string]: unknown;
              }
            | undefined;

          // Check if context is missing
          if (!contextField) {
            context.report({
              node: decorator.node,
              messageId: 'missingContext',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const contextTemplate = `,\n  context: {\n    lifeStage: '',  // TODO: Where they are in life journey\n    currentSituation: ''  // TODO: Immediate circumstances\n  }`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  contextTemplate,
                );
              },
            });
            continue;
          }

          // Check if context exists but is empty
          if (!contextField.lifeStage && !contextField.currentSituation) {
            context.report({
              node: decorator.node,
              messageId: 'emptyContext',
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

