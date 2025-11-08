/**
 * Expectation Business Context Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **businessContext** captures strategic importance,
 * impact assessment, effort estimation, and success measurement criteria for expectations.
 * Business context links technical expectations to business value, enabling prioritization,
 * resource allocation, and ROI measurement. Without business context, expectations lack business
 * justification and cannot be properly prioritized or measured for success.
 *
 * Business context enables AI to:
 * 1. **Enable prioritization** - Strategic importance guides what to build first
 * 2. **Estimate effort** - Effort estimation enables resource planning
 * 3. **Measure success** - Success measurement criteria define how to validate business value
 * 4. **Assess impact** - Impact assessment links expectations to business outcomes
 *
 * Missing business context makes it difficult to prioritize expectations or measure their
 * business value.
 *
 * **What it checks:**
 * - Expectation has `businessContext` field defined (recommended)
 * - Business context should include strategic importance
 * - Business context should include success measurement for important expectations
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has business context
 * @Expectation({
 *   name: 'Fast Email Validation',
 *   businessContext: {
 *     strategicImportance: 'high',
 *     impactAssessment: {
 *       revenueImpact: 'Prevents bounced emails, reduces support costs',
 *       customerSatisfaction: 'Improves signup experience'
 *     },
 *     successMeasurement: {
 *       baseline: { value: '85%', date: '2025-01-01' },
 *       target: { value: '98%', date: '2025-06-01' }
 *     }
 *   }
 * })
 *
 * // ⚠️ Warning - Missing business context
 * @Expectation({
 *   name: 'Fast Email Validation'
 *   // Missing businessContext - unclear business value or priority
 * })
 * ```
 *
 * @category expectation
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingBusinessContext';

export const expectationBusinessContextRecommended = createRule<[], MessageIds>({
  name: 'expectation-business-context-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Expectations should have businessContext field. Business context links technical expectations to business value, enabling prioritization and success measurement.',
    },
    messages: {
      missingBusinessContext:
        "Expectation '{{name}}' is missing a 'businessContext' field. Business context links technical expectations to business value, including strategic importance, impact assessment, effort estimation, and success measurement criteria. Consider adding businessContext (e.g., 'businessContext: { strategicImportance: \"high\", impactAssessment: { revenueImpact: \"...\" }, successMeasurement: { baseline: { value: \"...\" }, target: { value: \"...\" } } }').",
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
          if (decorator.type !== 'Expectation') continue;

          const name = decorator.metadata.name as string | undefined;
          const businessContext = decorator.metadata.businessContext;

          // Check if businessContext is missing
          if (!businessContext) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if businessContext already exists in source to avoid duplicates
            if (source.includes('businessContext:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingBusinessContext',
              data: { name: name || 'Unnamed expectation' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if businessContext already exists in source to avoid duplicates
                if (source.includes('businessContext:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const businessContextTemplate = needsComma
                  ? `,\n  businessContext: {\n    strategicImportance: 'medium',  // TODO: Set strategic importance (low, medium, high, critical)\n    impactAssessment: {\n      revenueImpact: '',  // TODO: Describe revenue impact\n      customerSatisfaction: '',  // TODO: Describe customer satisfaction impact\n      operationalEfficiency: ''  // TODO: Describe operational efficiency impact\n    },\n    successMeasurement: {\n      baseline: { value: '', date: '' },  // TODO: Set baseline measurement\n      target: { value: '', date: '' },  // TODO: Set target measurement\n      approachToMeasurement: ''  // TODO: Describe how success will be measured\n    }\n  },  // TODO: Define strategic importance, impact, and success criteria`
                  : `\n  businessContext: {\n    strategicImportance: 'medium',  // TODO: Set strategic importance (low, medium, high, critical)\n    impactAssessment: {\n      revenueImpact: '',  // TODO: Describe revenue impact\n      customerSatisfaction: '',  // TODO: Describe customer satisfaction impact\n      operationalEfficiency: ''  // TODO: Describe operational efficiency impact\n    },\n    successMeasurement: {\n      baseline: { value: '', date: '' },  // TODO: Set baseline measurement\n      target: { value: '', date: '' },  // TODO: Set target measurement\n      approachToMeasurement: ''  // TODO: Describe how success will be measured\n    }\n  },  // TODO: Define strategic importance, impact, and success criteria`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  businessContextTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

