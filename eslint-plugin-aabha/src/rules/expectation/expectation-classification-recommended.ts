/**
 * Expectation Classification Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **classification fields** (complexity, category,
 * stakeholderRelationType, verificationLevel) provide essential metadata for understanding and
 * organizing expectations. These fields enable proper categorization, effort estimation, and
 * relationship understanding. Without classification, expectations lack important metadata that
 * helps AI systems understand their nature and requirements.
 *
 * Classification enables AI to:
 * 1. **Understand complexity** - Complexity guides effort estimation and resource allocation
 * 2. **Categorize by concern** - Category organizes expectations by functional area
 * 3. **Understand relationships** - StakeholderRelationType clarifies provider-consumer dynamics
 * 4. **Set enforcement level** - VerificationLevel determines testing rigor
 *
 * Missing classification makes it harder to organize, prioritize, or understand expectations.
 *
 * **What it checks:**
 * - Expectation has classification fields (complexity, category, stakeholderRelationType, verificationLevel)
 * - These fields are recommended for better organization and understanding
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has classification fields
 * @Expectation({
 *   name: 'Fast Email Validation',
 *   complexity: ExpectationComplexity.Simple,
 *   category: ExpectationCategory.Functional,
 *   stakeholderRelationType: ExpectationStakeholderRelationType.B2C,
 *   verificationLevel: ExpectationVerificationLevel.Enforced
 * })
 *
 * // ⚠️ Warning - Missing classification fields
 * @Expectation({
 *   name: 'Fast Email Validation'
 *   // Missing classification - harder to organize and understand
 * })
 * ```
 *
 * @category expectation
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds =
  | 'missingComplexity'
  | 'missingCategory'
  | 'missingStakeholderRelationType'
  | 'missingVerificationLevel';

export const expectationClassificationRecommended = createRule<[], MessageIds>({
  name: 'expectation-classification-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Expectations should have classification fields (complexity, category, stakeholderRelationType, verificationLevel) for better organization and understanding.',
    },
    messages: {
      missingComplexity:
        "Expectation '{{name}}' is missing a 'complexity' field. Complexity assesses implementation effort and coordination requirements. Consider adding complexity (e.g., 'complexity: ExpectationComplexity.Simple').",
      missingCategory:
        "Expectation '{{name}}' is missing a 'category' field. Category classifies expectations by primary concern area (functional, performance, security, etc.). Consider adding category (e.g., 'category: ExpectationCategory.Functional').",
      missingStakeholderRelationType:
        "Expectation '{{name}}' is missing a 'stakeholderRelationType' field. StakeholderRelationType defines the nature of the relationship between provider and consumer. Consider adding stakeholderRelationType (e.g., 'stakeholderRelationType: ExpectationStakeholderRelationType.B2C').",
      missingVerificationLevel:
        "Expectation '{{name}}' is missing a 'verificationLevel' field. VerificationLevel determines enforcement strictness and testing requirements. Consider adding verificationLevel (e.g., 'verificationLevel: ExpectationVerificationLevel.Enforced').",
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

          const name = decorator.metadata.name as string | undefined;
          const complexity = decorator.metadata.complexity;
          const category = decorator.metadata.category;
          const stakeholderRelationType = decorator.metadata.stakeholderRelationType;
          const verificationLevel = decorator.metadata.verificationLevel;

          // Check for missing complexity
          if (!complexity) {
            context.report({
              node: decorator.node,
              messageId: 'missingComplexity',
              data: { name: name || 'Unnamed expectation' },
            });
          }

          // Check for missing category
          if (!category) {
            context.report({
              node: decorator.node,
              messageId: 'missingCategory',
              data: { name: name || 'Unnamed expectation' },
            });
          }

          // Check for missing stakeholderRelationType
          if (!stakeholderRelationType) {
            context.report({
              node: decorator.node,
              messageId: 'missingStakeholderRelationType',
              data: { name: name || 'Unnamed expectation' },
            });
          }

          // Check for missing verificationLevel
          if (!verificationLevel) {
            context.report({
              node: decorator.node,
              messageId: 'missingVerificationLevel',
              data: { name: name || 'Unnamed expectation' },
            });
          }
        }
      },
    };
  },
});

