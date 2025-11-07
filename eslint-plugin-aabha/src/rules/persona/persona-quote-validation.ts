/**
 * Persona Quote Validation Rule
 *
 * **Why this rule exists:**
 * Quotes bring personas to life by capturing their voice, perspective, and pain points in their own
 * words. In context engineering, well-crafted quotes make personas memorable and help teams empathize
 * with user experiences. Empty or poorly structured quotes fail to humanize personas.
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'emptyQuote';

export const personaQuoteValidation = createRule<[], MessageIds>({
  name: 'persona-quote-validation',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Persona quotes should have meaningful content. In context engineering, quotes capture persona voice and make archetypes memorable.',
    },
    messages: {
      emptyQuote:
        "Persona '{{personaName}}' has quote with empty text at index {{index}}. In context engineering, quotes bring personas to life by capturing their voice and perspective. Each quote should express genuine persona sentiment. Good quotes: \"If my banking app is slower than my code compiler, I'm switching banks\", \"I don't have time to visit branches - I need banking that fits my life\". Remove empty quotes or fill with actual persona voice.",
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
          const quotes = decorator.metadata.quotes as Array<{ quote?: string }> | undefined;

          if (!quotes || quotes.length === 0) continue;

          // Check each quote for empty text
          quotes.forEach((quoteObj, index) => {
            if (!quoteObj.quote || quoteObj.quote.trim().length === 0) {
              context.report({
                node: decorator.node,
                messageId: 'emptyQuote',
                data: {
                  personaName: personaName || 'Unknown',
                  index: index.toString(),
                },
              });
            }
          });
        }
      },
    };
  },
});
