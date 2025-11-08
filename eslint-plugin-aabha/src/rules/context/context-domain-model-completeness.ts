/**
 * Context Domain Model Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **domainModel** defines the core domain concepts
 * that a context owns and manages (DDD bounded context). When a domainModel is provided, it
 * should be complete with coreEntities (required) and optionally valueObjects and ubiquitousLanguage.
 * Incomplete domain models lack clarity about domain ownership and terminology.
 *
 * Domain model completeness enables AI to:
 * 1. **Understand domain ownership** - Know which entities belong to which context
 * 2. **Establish terminology** - Understand context-specific language and definitions
 * 3. **Prevent coupling** - Avoid cross-context entity dependencies
 * 4. **Generate code** - Create domain models with correct entity ownership
 *
 * **What it checks:**
 * - If domainModel exists, it must have coreEntities (required)
 * - coreEntities should not be empty
 * - Optionally validates valueObjects and ubiquitousLanguage if provided
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete domain model
 * @Context({
 *   name: 'Retail Banking',
 *   domainModel: {
 *     coreEntities: ['Account', 'Transaction', 'Customer'],
 *     valueObjects: ['Money', 'AccountNumber'],
 *     ubiquitousLanguage: { 'Customer': 'Individual with at least one active account' }
 *   }
 * })
 *
 * // ❌ Bad - Incomplete domain model
 * @Context({
 *   name: 'Retail Banking',
 *   domainModel: {
 *     // Missing coreEntities
 *   }
 * })
 * ```
 *
 * @category context
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingCoreEntities' | 'emptyCoreEntities';

export const contextDomainModelCompleteness = createRule<[], MessageIds>({
  name: 'context-domain-model-completeness',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Contexts with domainModel should have complete domain models. Domain models define core domain concepts owned by the context, requiring coreEntities.',
    },
    messages: {
      missingCoreEntities:
        "Context '{{name}}' has domainModel but missing 'coreEntities' field. Domain models require coreEntities to define primary domain objects with identity. Add coreEntities array (e.g., 'coreEntities: [\"Account\", \"Transaction\", \"Customer\"]').",
      emptyCoreEntities:
        "Context '{{name}}' has domainModel with coreEntities but it's empty. Core entities should be meaningful and define primary domain objects owned by this context. Add meaningful core entities.",
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
          if (decorator.type !== 'Context') continue;

          const name = decorator.metadata.name as string | undefined;
          const domainModel = decorator.metadata.domainModel as
            | {
                coreEntities?: string[];
                valueObjects?: string[];
                ubiquitousLanguage?: Record<string, string>;
                [key: string]: unknown;
              }
            | undefined;

          // Only check if domainModel exists
          if (!domainModel) continue;

          // Check if coreEntities is missing
          if (!domainModel.coreEntities) {
            context.report({
              node: decorator.node,
              messageId: 'missingCoreEntities',
              data: { name: name || 'Unnamed context' },
            });
            continue;
          }

          // Check if coreEntities is empty
          if (domainModel.coreEntities.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyCoreEntities',
              data: { name: name || 'Unnamed context' },
            });
          }
        }
      },
    };
  },
});

