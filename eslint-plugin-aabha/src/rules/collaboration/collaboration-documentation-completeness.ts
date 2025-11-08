/**
 * Collaboration Documentation Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **documentation** defines recording and documentation
 * requirements for a collaboration. When documentation is provided, it should be complete with
 * required flag and documentsRequired to enable proper documentation tracking and compliance.
 *
 * Complete documentation enables AI to:
 * 1. **Track requirements** - Know what documentation is required
 * 2. **Generate compliance code** - Create code to ensure documentation requirements are met
 * 3. **Enable auditing** - Support audit and compliance processes
 * 4. **Manage retention** - Track documentation retention periods
 *
 * Incomplete documentation makes it harder to ensure compliance or track documentation
 * requirements.
 *
 * **What it checks:**
 * - Documentation has `required` field when provided
 * - Documentation has `documentsRequired` when required is true
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete documentation
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting',
 *   documentation: {
 *     required: true,
 *     documentsRequired: ['Meeting minutes', 'Investment decisions'],
 *     retentionPeriod: '7 years',
 *     documentOwner: FinancialAdvisorStakeholder
 *   }
 * })
 *
 * // ❌ Bad - Incomplete documentation
 * @Collaboration({
 *   name: 'Monthly Investment Committee Meeting',
 *   documentation: {
 *     required: true
 *     // Missing documentsRequired when required is true
 *   }
 * })
 * ```
 *
 * @category collaboration
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingDocumentsRequired';

export const collaborationDocumentationCompleteness = createRule<[], MessageIds>({
  name: 'collaboration-documentation-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Collaboration documentation should be complete with documentsRequired when required is true. Complete documentation enables proper compliance tracking.',
    },
    messages: {
      missingDocumentsRequired:
        "Collaboration '{{name}}' has documentation with required: true but is missing 'documentsRequired'. When documentation is required, documentsRequired should specify what must be documented. Add a documentsRequired array listing the required documents.",
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
          if (decorator.type !== 'Collaboration') continue;

          const name = decorator.metadata.name as string | undefined;
          const documentation = decorator.metadata.documentation as
            | {
                required?: boolean;
                documentsRequired?: string[];
                retentionPeriod?: string;
                documentOwner?: unknown;
              }
            | undefined;

          // Only check if documentation exists and is required
          if (!documentation) continue;

          if (documentation.required === true && !documentation.documentsRequired) {
            context.report({
              node: decorator.node,
              messageId: 'missingDocumentsRequired',
              data: {
                name: name || 'Unnamed collaboration',
              },
            });
          }
        }
      },
    };
  },
});

