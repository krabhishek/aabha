/**
 * Expectation Additional Interactions Unique Roles Rule
 *
 * **Why this rule exists:**
 * In context engineering, when an expectation requires multiple interactions to fulfill
 * (orchestration pattern), each additional interaction must serve a **distinct, well-defined role**
 * in the overall fulfillment process. Duplicate roles create ambiguity that prevents AI systems
 * from understanding the orchestration logic.
 *
 * Duplicate interaction roles cause:
 * - **Orchestration confusion** - Which interaction executes when two share the same role?
 * - **AI comprehension failure** - AI cannot determine the intended sequence or purpose
 * - **Maintainability issues** - Developers struggle to understand which interaction does what
 * - **Testing complexity** - Unclear which interaction's behavior to assert in each test
 *
 * Unique roles enable:
 * 1. **Clear orchestration semantics** - Each interaction's purpose is unambiguous
 * 2. **AI-assisted generation** - AI can generate correct orchestration code from role names
 * 3. **Self-documenting systems** - Role names explain the interaction's purpose in context
 * 4. **Traceable execution** - Each role can be monitored and traced independently
 *
 * **What it checks:**
 * - All additionalInteractions have unique role names
 * - No duplicate role strings within the array
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Unique roles clearly define each interaction's purpose
 * @Expectation({
 *   name: 'Complete Account Opening',
 *   interaction: AccountOpeningAPI,
 *   additionalInteractions: [
 *     { interaction: KYCVerificationAPI, role: 'verification', description: 'Verify customer identity' },
 *     { interaction: CreditCheckAPI, role: 'credit-assessment', description: 'Check credit score' },
 *     { interaction: NotificationAPI, role: 'notification', description: 'Notify customer' }
 *   ]
 * })
 *
 * // ❌ Bad - Duplicate 'verification' role creates ambiguity
 * @Expectation({
 *   name: 'Complete Account Opening',
 *   interaction: AccountOpeningAPI,
 *   additionalInteractions: [
 *     { interaction: KYCVerificationAPI, role: 'verification' },
 *     { interaction: DocumentVerificationAPI, role: 'verification' }, // Duplicate!
 *     { interaction: NotificationAPI, role: 'notification' }
 *   ]
 * })
 * // AI can't determine: Which 'verification' executes first? Are both required?
 * // Better: Use 'identity-verification' and 'document-verification'
 * ```
 *
 * @category expectation
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'duplicateInteractionRoles';

export const expectationAdditionalInteractionsUniqueRoles = createRule<[], MessageIds>({
  name: 'expectation-additional-interactions-unique-roles',
  meta: {
    type: 'problem',
    docs: {
      description: 'Additional interactions in expectations must have unique roles to avoid orchestration ambiguity. In context engineering, duplicate roles prevent AI systems from understanding which interaction serves which purpose in the fulfillment process.',
    },
    messages: {
      duplicateInteractionRoles: "Expectation '{{expectationName}}' has duplicate roles in additionalInteractions: {{duplicateRoles}}. In context engineering, each additional interaction must have a unique role to create clear orchestration semantics. When multiple interactions share the same role, AI systems cannot determine execution order, dependencies, or purpose. This ambiguity makes it impossible to generate correct orchestration code or trace execution flows. Use descriptive, distinct role names (e.g., 'identity-verification' and 'document-verification' instead of 'verification' for both). Clear role names enable AI to understand the expectation's fulfillment strategy and generate accurate implementation code.",
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
          if (decorator.type !== 'Expectation') continue;

          const expectationName = decorator.metadata.name as string | undefined;
          const additionalInteractions = decorator.metadata.additionalInteractions as Array<{
            role: string;
          }> | undefined;

          if (!additionalInteractions || additionalInteractions.length === 0) {
            continue;
          }

          // Extract all roles
          const roles = additionalInteractions.map((ai) => ai.role);

          // Find duplicates
          const duplicates = roles.filter((role, index) => roles.indexOf(role) !== index);

          if (duplicates.length > 0) {
            // Get unique duplicates for reporting
            const uniqueDuplicates = [...new Set(duplicates)];

            context.report({
              node: decorator.node,
              messageId: 'duplicateInteractionRoles',
              data: {
                expectationName: expectationName || 'Unknown',
                duplicateRoles: uniqueDuplicates.join(', '),
              },
            });
          }
        }
      },
    };
  },
});
