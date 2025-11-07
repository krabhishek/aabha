/**
 * Initiative Budget Breakdown Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **budget breakdowns** provide financial context that
 * helps AI systems understand resource allocation and cost implications of business initiatives.
 * Well-structured budget breakdowns enable AI to generate accurate financial projections, resource
 * planning, and cost-benefit analyses.
 *
 * Budget breakdowns enable AI to:
 * 1. **Generate financial projections** - Detailed budgets help AI understand cost structure
 * 2. **Plan resource allocation** - Budget breakdowns inform staffing and infrastructure decisions
 * 3. **Calculate ROI** - AI can analyze costs vs. expected outcomes
 * 4. **Track spending** - Detailed breakdowns enable accurate budget tracking
 *
 * Missing or incomplete budget breakdowns mean AI systems can't generate accurate financial planning
 * or understand the financial implications of initiatives.
 *
 * **What it checks:**
 * - Initiatives with budgets have detailed breakdowns
 * - Budget breakdowns sum to total budget (when both are present)
 * - Budget categories are meaningful and specific
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Detailed budget breakdown
 * @BusinessInitiative({
 *   name: 'Customer Portal Redesign',
 *   budget: 500000,
 *   budgetBreakdown: {
 *     development: 300000,
 *     design: 100000,
 *     testing: 50000,
 *     infrastructure: 50000
 *   }
 * })
 *
 * // ❌ Bad - Budget without breakdown
 * @BusinessInitiative({
 *   name: 'Customer Portal Redesign',
 *   budget: 500000
 *   // No breakdown - AI can't understand cost allocation
 * })
 *
 * // ❌ Bad - Breakdown doesn't sum to total
 * @BusinessInitiative({
 *   name: 'Customer Portal Redesign',
 *   budget: 500000,
 *   budgetBreakdown: {
 *     development: 300000,
 *     design: 100000
 *     // Sums to 400000, but budget is 500000
 *   }
 * })
 * ```
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { detectIndentation } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingBreakdown' | 'breakdownMismatch' | 'emptyBreakdown';

export const initiativeBudgetBreakdown = createRule<[], MessageIds>({
  name: 'initiative-budget-breakdown',
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure business initiatives have detailed budget breakdowns to help AI understand cost allocation and generate financial projections',
    },
    messages: {
      missingBreakdown: "Initiative '{{name}}' has a budget of {{budget}} but no budget breakdown. Budget breakdowns provide valuable context about cost allocation (development, infrastructure, staffing) that helps AI systems understand resource needs and generate accurate financial projections. Add a budgetBreakdown object with detailed cost categories.",
      breakdownMismatch: "Initiative '{{name}}' has budget {{budget}} but breakdown sums to {{breakdownSum}}. Budget breakdowns should align with total budget to create consistent financial context. Mismatched budgets create contradictory context that confuses AI systems trying to understand cost allocation. Adjust breakdown categories to sum to the total budget.",
      emptyBreakdown: "Initiative '{{name}}' has an empty budget breakdown. Empty breakdowns waste valuable financial context - AI systems can't understand cost allocation without detailed categories. Add meaningful budget categories (development, infrastructure, staffing, etc.) to provide cost structure context.",
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
          // Only apply to BusinessInitiative decorators
          if (decorator.type !== 'BusinessInitiative') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const budget = decorator.metadata.budget as number | undefined;
          const budgetBreakdown = decorator.metadata.budgetBreakdown as
            | Record<string, number>
            | undefined;

          // Check if budget exists but no breakdown
          if (budget !== undefined && budget !== null && !budgetBreakdown) {
            const sourceCode = context.sourceCode;

            context.report({
              node: decorator.node,
              messageId: 'missingBreakdown',
              data: {
                name: name || 'Unknown',
                budget: budget.toString(),
              },
              fix(fixer) {
                // Access the decorator's expression
                if (decorator.node.expression.type !== 'CallExpression') return null;

                const arg = decorator.node.expression.arguments[0];
                if (!arg || arg.type !== 'ObjectExpression') return null;

                // Find the budget property to insert breakdown after it
                const budgetProperty = arg.properties.find(
                  (p): p is TSESTree.Property =>
                    p.type === 'Property' &&
                    p.key.type === 'Identifier' &&
                    p.key.name === 'budget'
                );

                if (!budgetProperty) return null;

                const indentation = detectIndentation(budgetProperty, sourceCode);
                const insertPosition = budgetProperty.range[1];

                return fixer.insertTextAfterRange(
                  [insertPosition, insertPosition],
                  `,\n${indentation}budgetBreakdown: {\n${indentation}  development: 0,  // TODO: Allocate budget\n${indentation}  infrastructure: 0,  // TODO: Allocate budget\n${indentation}  staffing: 0  // TODO: Allocate budget\n${indentation}}`
                );
              },
            });
            continue;
          }

          // Check if breakdown is empty
          if (budgetBreakdown && Object.keys(budgetBreakdown).length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'emptyBreakdown',
              data: { name: name || 'Unknown' },
            });
            continue;
          }

          // Check if breakdown sums match budget
          if (budget !== undefined && budget !== null && budgetBreakdown) {
            const breakdownSum = Object.values(budgetBreakdown).reduce(
              (sum, value) => sum + (typeof value === 'number' ? value : 0),
              0
            );

            // Allow small rounding differences (1% tolerance)
            const tolerance = budget * 0.01;
            if (Math.abs(breakdownSum - budget) > tolerance) {
              context.report({
                node: decorator.node,
                messageId: 'breakdownMismatch',
                data: {
                  name: name || 'Unknown',
                  budget: budget.toString(),
                  breakdownSum: breakdownSum.toString(),
                },
              });
            }
          }
        }
      },
    };
  },
});
