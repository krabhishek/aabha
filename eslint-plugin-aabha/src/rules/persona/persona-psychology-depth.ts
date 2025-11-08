/**
 * Persona Psychology Depth Rule
 *
 * **Why this rule exists:**
 * Understanding persona psychology (values, fears, aspirations, decision-making style) is critical
 * for empathetic design. In context engineering, psychology reveals WHY personas behave as they do,
 * enabling teams to design solutions that address deeper motivations beyond surface-level features.
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingPsychology';

export const personaPsychologyDepth = createRule<[], MessageIds>({
  name: 'persona-psychology-depth',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Human personas should have psychology field for empathetic design. In context engineering, understanding values, fears, and aspirations enables deeper user empathy.',
    },
    messages: {
      missingPsychology:
        "Human persona '{{personaName}}' lacks psychology field. In context engineering, psychology reveals WHY personas behave as they do - their values, fears, aspirations, decision-making style, risk tolerance, and trust factors. Add psychology field with at least values, fears, or aspirations. Example: psychology: {{ values: ['Financial independence', 'Tech convenience'], fears: ['Identity theft', 'Losing savings'], aspirations: ['Own a home by 35', 'Build investment portfolio'] }}. Without psychology, teams cannot design empathetic solutions that address deeper motivations.",
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
          if (typeNormalized !== 'human') continue; // Only validate for human personas

          const personaName = decorator.metadata.name as string | undefined;
          const psychology = decorator.metadata.psychology as
            | {
                values?: string[];
                fears?: string[];
                aspirations?: string[];
              }
            | undefined;

          // Check if psychology is missing or empty
          if (!psychology || (!psychology.values && !psychology.fears && !psychology.aspirations)) {
            context.report({
              node: decorator.node,
              messageId: 'missingPsychology',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);

                // Find closing brace of decorator to insert before it
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const psychologyTemplate = `,\n  psychology: {\n    values: [''], // TODO: What does this persona value most?\n    fears: [''], // TODO: What keeps this persona up at night?\n    aspirations: [''] // TODO: What does this persona hope to achieve?\n  }`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  psychologyTemplate,
                );
              },
            });
          }
        }
      },
    };
  },
});
