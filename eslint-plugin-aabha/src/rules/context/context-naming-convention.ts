/**
 * Context Naming Convention Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **context names** become part of your organization's
 * ubiquitous language - they appear in architecture diagrams, team conversations, documentation,
 * and code. Generic technical names like "ContextManager" or "ServiceHandler" create cognitive
 * overhead and prevent AI from understanding the business domain.
 *
 * Business-meaningful names enable:
 * 1. **AI comprehension of domain structure** - Names like "Retail Banking" or "Risk & Compliance"
 *    immediately convey business meaning, helping AI understand organizational structure
 * 2. **Natural language alignment** - When stakeholders say "retail banking," AI can map that
 *    to the corresponding context and generate accurate responses
 * 3. **Documentation clarity** - AI-generated documentation uses context names extensively;
 *    business-meaningful names create self-documenting systems
 * 4. **Search and discovery** - Developers and AI can find relevant contexts using business
 *    terminology rather than technical jargon
 *
 * **What it checks:**
 * - Name is not too short (at least 3 characters)
 * - Name avoids generic technical terms (context, manager, service, handler, processor, controller)
 * - Name is not all uppercase (suggests using title case)
 * - Name is not all lowercase (suggests using title case)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Business-meaningful names
 * @Context({ name: 'Retail Banking' })
 * @Context({ name: 'Risk & Compliance' })
 * @Context({ name: 'Wealth Management' })
 * @Context({ name: 'Customer Support' })
 *
 * // ❌ Bad - Too short
 * @Context({ name: 'HR' })  // Use 'Human Resources' instead
 *
 * // ❌ Bad - Generic technical terms
 * @Context({ name: 'Payment Context' })  // Use 'Payment Processing' instead
 * @Context({ name: 'User Manager' })  // Use 'User Management' or domain name
 * @Context({ name: 'Order Service' })  // Use 'Order Fulfillment' or 'Sales'
 *
 * // ❌ Bad - Poor casing
 * @Context({ name: 'RETAIL BANKING' })  // Use 'Retail Banking'
 * @Context({ name: 'customer support' })  // Use 'Customer Support'
 * ```
 *
 * @category context
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

const AVOID_TERMS = [
  'context',
  'manager',
  'service',
  'handler',
  'processor',
  'controller',
];

type MessageIds = 'nameTooShort' | 'genericName' | 'allCapsName' | 'allLowercaseName';

export const contextNamingConvention = createRule<[], MessageIds>({
  name: 'context-naming-convention',
  meta: {
    type: 'problem',
    docs: {
      description: 'Context names should be business-meaningful and reflect organizational areas, avoiding generic terms. Well-named contexts create self-documenting systems that AI can comprehend.',
    },
    messages: {
      nameTooShort: "Context name '{{name}}' is too short. Use a descriptive business-meaningful name that conveys the context's domain and purpose (e.g., 'Retail Banking', 'Customer Support', 'Risk & Compliance'). Short names lack the semantic richness AI needs to understand organizational structure and generate accurate recommendations.",
      genericName: "Context name '{{name}}' contains generic technical term '{{term}}'. In context engineering, names should reflect business domains, not technical patterns. Use business-meaningful names that stakeholders recognize (e.g., 'Retail Banking' instead of 'Banking Service', 'Risk & Compliance' instead of 'Compliance Manager'). Generic names create cognitive overhead and prevent AI from understanding your domain model.",
      allCapsName: "Context name '{{name}}' is all uppercase. Consider using title case for better readability (e.g., 'Retail Banking'). Proper casing improves human readability and helps AI parse multi-word context names when generating natural language documentation.",
      allLowercaseName: "Context name '{{name}}' is all lowercase. Consider using title case for better readability (e.g., 'Retail Banking'). Proper casing improves human readability and helps AI parse multi-word context names when generating natural language documentation.",
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
          // Only apply to Context decorators
          if (decorator.type !== 'Context') {
            continue;
          }

          const name = (decorator.metadata.name as string | undefined) || '';
          const nameLower = name.toLowerCase();

          // Check 1: Name should not be too short
          if (name.length < 3) {
            context.report({
              node: decorator.node,
              messageId: 'nameTooShort',
              data: {
                name,
              },
            });
          }

          // Check 2: Avoid generic technical terms
          for (const term of AVOID_TERMS) {
            if (nameLower.includes(term)) {
              context.report({
                node: decorator.node,
                messageId: 'genericName',
                data: {
                  name,
                  term,
                },
              });
            }
          }

          // Check 3: Should not be all uppercase or all lowercase
          if (name === name.toUpperCase() && name.length > 5) {
            context.report({
              node: decorator.node,
              messageId: 'allCapsName',
              data: {
                name,
              },
            });
          }

          if (name === name.toLowerCase() && name.length > 5) {
            context.report({
              node: decorator.node,
              messageId: 'allLowercaseName',
              data: {
                name,
              },
            });
          }
        }
      },
    };
  },
});
