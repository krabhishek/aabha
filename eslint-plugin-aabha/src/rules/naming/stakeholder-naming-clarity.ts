/**
 * Stakeholder Naming Clarity Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, stakeholder and persona names are **critical semantic
 * anchors** that AI systems use to understand your business domain. Generic names like "user" or
 * "admin" are ambiguous placeholders that lose valuable context - they tell AI assistants nothing
 * about the specific role, responsibilities, or business context.
 *
 * Specific names like "Retail Banking Customer" or "Compliance Officer" create dense, high-quality
 * context tokens that enable AI to:
 * 1. **Understand domain semantics** - "Retail Banking Customer" immediately signals financial
 *    services domain, retail segment, and customer relationship
 * 2. **Generate accurate code** - Specific roles help AI infer appropriate permissions,
 *    workflows, and business logic
 * 3. **Preserve tribal knowledge** - Names capture organizational structure and role distinctions
 *    that would otherwise require lengthy explanations
 *
 * Generic names force developers to add verbose descriptions to compensate for lost context.
 * Specific names engineer context directly into the name itself, maximizing token efficiency.
 *
 * **What it checks:**
 * - Stakeholder and Persona names aren't single generic words ("user", "admin", "customer")
 * - Names include role-specific or domain-specific context
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Specific context for AI comprehension
 * @Stakeholder({ name: 'Retail Banking Customer' })
 * @Stakeholder({ name: 'Compliance Officer' })
 * @Persona({ name: 'Enterprise Account Manager' })
 * @Persona({ name: 'System Administrator' })
 *
 * // ❌ Bad - Generic, loses valuable context
 * @Stakeholder({ name: 'user' })  // Which user? What role? What domain?
 * @Stakeholder({ name: 'admin' })  // What kind of admin? What authority?
 * @Persona({ name: 'customer' })  // What type of customer? What segment?
 * ```
 *
 * @category naming
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

/**
 * Generic/vague stakeholder names that should be avoided
 */
const GENERIC_NAMES = new Set([
  'user',
  'admin',
  'customer',
  'employee',
  'manager',
  'person',
  'stakeholder',
  'agent',
  'operator',
]);

/**
 * Generate more specific name suggestions for generic stakeholder names
 */
function generateNameSuggestions(genericName: string): string[] {
  const nameMap: Record<string, string[]> = {
    user: ['Customer User', 'Admin User', 'System User'],
    admin: ['System Administrator', 'Tenant Administrator', 'Security Administrator'],
    customer: ['Retail Customer', 'Enterprise Customer', 'Premium Customer'],
    employee: ['Sales Employee', 'Support Employee', 'Operations Employee'],
    manager: ['Account Manager', 'Project Manager', 'Operations Manager'],
    person: ['Customer', 'Employee', 'Partner'],
    stakeholder: ['Business Stakeholder', 'Technical Stakeholder', 'Executive Stakeholder'],
    agent: ['Support Agent', 'Sales Agent', 'Customer Service Agent'],
    operator: ['System Operator', 'Call Center Operator', 'Machine Operator'],
  };

  const normalized = genericName.toLowerCase();
  return nameMap[normalized] || [`Specific ${genericName}`];
}

type MessageIds = 'genericName';

export const stakeholderNamingClarity = createRule<[], MessageIds>({
  name: 'stakeholder-naming-clarity',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensure stakeholder and persona names are specific and context-rich, not generic placeholders that lose valuable AI-comprehensible context',
    },
    messages: {
      genericName: "Stakeholder name '{{name}}' is too generic - you're losing valuable context! Generic names like 'user' or 'admin' are ambiguous placeholders that tell AI systems nothing about the specific role, domain, or business context. Use a specific name that captures role clarity and domain semantics (e.g., 'Retail Banking Customer' instead of 'customer', 'Compliance Officer' instead of 'admin'). Suggestions: {{suggestions}}. Specific names create dense context tokens that help AI assistants comprehend your business domain and generate accurate implementations.",
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
          // Only apply to Stakeholder and Persona decorators
          if (decorator.type !== 'Stakeholder' && decorator.type !== 'Persona') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          if (!name) continue;

          // Check if name is a single generic word
          const nameWords = name.trim().split(/\s+/);
          const isGeneric = nameWords.length === 1 && GENERIC_NAMES.has(nameWords[0].toLowerCase());

          if (isGeneric) {
            const suggestions = generateNameSuggestions(name);

            context.report({
              node: decorator.node,
              messageId: 'genericName',
              data: {
                name,
                suggestions: suggestions.join(', '),
              },
            });
          }
        }
      },
    };
  },
});
