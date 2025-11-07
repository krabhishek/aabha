/**
 * Context Boundary Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **Contexts** represent bounded contexts from
 * Domain-Driven Design (DDD). A context without clear boundaries is like a department without
 * defined responsibilities - it creates confusion about ownership, scope, and accountability.
 * AI systems need explicit boundaries to understand what a context owns and manages.
 *
 * Clear context boundaries enable:
 * 1. **AI comprehension of domain ownership** - AI can understand which entities and behaviors
 *    belong to which context, preventing cross-context coupling
 * 2. **Automated architecture validation** - AI can detect when code violates context boundaries
 *    and suggest proper integration patterns
 * 3. **Code generation accuracy** - When AI generates code, it knows which domain models are
 *    in scope and which require integration across contexts
 * 4. **Team coordination** - Clear boundaries help AI understand which teams own which capabilities
 *    and facilitate cross-team collaboration
 *
 * **What it checks:**
 * - Context has either `domainModel` (DDD approach with coreEntities/valueObjects) OR
 *   `inScope` (explicit list of what's included) defined
 * - At least one boundary definition method is present and non-empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - DDD approach with domain model
 * @Context({
 *   name: 'Retail Banking',
 *   domainModel: {
 *     coreEntities: ['Account', 'Transaction', 'Customer'],
 *     valueObjects: ['Money', 'AccountNumber', 'TransactionId']
 *   }
 * })
 *
 * // ✅ Good - Explicit scope approach
 * @Context({
 *   name: 'Customer Support',
 *   inScope: [
 *     'Ticket management',
 *     'Customer communications',
 *     'SLA tracking'
 *   ]
 * })
 *
 * // ❌ Bad - No boundaries defined
 * @Context({
 *   name: 'Risk Management'
 *   // Missing both domainModel and inScope
 * })
 * ```
 *
 * @category context
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { detectIndentation } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingBoundaries';

export const contextBoundaryRequired = createRule<[], MessageIds>({
  name: 'context-boundary-required',
  meta: {
    type: 'problem',
    docs: {
      description: 'Contexts should have clear boundaries defined either through domainModel or inScope to prevent confusion about scope and ownership. Well-defined boundaries help AI understand domain ownership and generate accurate code.',
    },
    messages: {
      missingBoundaries: "Context '{{name}}' has no clear boundaries defined. In context engineering, boundaries are essential for AI to understand what this context owns and manages. Add either 'domainModel' (DDD approach with coreEntities/valueObjects) to define domain entities, or 'inScope' (explicit scope list) to clarify what capabilities this context provides. Without boundaries, AI cannot distinguish between context responsibilities or validate cross-context integrations.",
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
          // Only apply to Context decorators
          if (decorator.type !== 'Context') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const domainModel = decorator.metadata.domainModel as { coreEntities?: unknown[] } | undefined;
          const inScope = decorator.metadata.inScope as unknown[] | undefined;

          // Check if at least one boundary definition method is used
          const hasDomainModel = domainModel?.coreEntities &&
            Array.isArray(domainModel.coreEntities) &&
            domainModel.coreEntities.length > 0;
          const hasInScope = inScope && Array.isArray(inScope) && inScope.length > 0;

          if (!hasDomainModel && !hasInScope) {
            const sourceCode = context.sourceCode;

            context.report({
              node: decorator.node,
              messageId: 'missingBoundaries',
              data: {
                name: name || 'Unknown',
              },
              fix(fixer) {
                // Access the decorator's expression
                if (decorator.node.expression.type !== 'CallExpression') return null;

                const arg = decorator.node.expression.arguments[0];
                if (!arg || arg.type !== 'ObjectExpression') return null;

                // Find the last property to insert after
                const properties = arg.properties;
                if (properties.length === 0) return null;

                const lastProperty = properties[properties.length - 1];
                const indentation = detectIndentation(lastProperty, sourceCode);
                const insertPosition = lastProperty.range[1];

                // Add inScope with TODO comment
                return fixer.insertTextAfterRange(
                  [insertPosition, insertPosition],
                  `,\n${indentation}inScope: [\n${indentation}  'TODO: Define what is in scope for this context'\n${indentation}]`
                );
              },
            });
          }
        }
      },
    };
  },
});
