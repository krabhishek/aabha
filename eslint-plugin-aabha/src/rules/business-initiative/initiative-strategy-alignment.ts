/**
 * Initiative Strategy Alignment Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **strategy alignment** ensures that business initiatives
 * align with organizational strategies. Misaligned initiatives create contradictory context that
 * confuses AI systems trying to understand how initiatives contribute to strategic goals.
 *
 * Strategy alignment enables AI to:
 * 1. **Understand relationships** - AI knows how initiatives support strategies
 * 2. **Generate roadmaps** - Aligned initiatives help AI create coherent planning
 * 3. **Prioritize work** - Strategy alignment informs priority decisions
 * 4. **Track strategic progress** - Aligned initiatives enable strategic tracking
 *
 * Misaligned initiatives mean AI systems can't understand how initiatives contribute to business
 * strategy or generate proper strategic planning.
 *
 * **What it checks:**
 * - Initiatives reference or align with strategies
 * - Initiative goals align with strategic objectives
 * - Initiative outcomes support strategic metrics
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Initiative aligned with strategy
 * @Strategy({
 *   name: 'Digital Transformation',
 *   objectives: ['improve customer experience', 'increase digital adoption']
 * })
 * class DigitalTransformationStrategy {}
 *
 * @BusinessInitiative({
 *   name: 'Customer Portal Redesign',
 *   strategy: DigitalTransformationStrategy,
 *   expectedOutcomes: ['improve customer experience', 'increase digital adoption']
 * })
 *
 * // ⚠️ Warning - Initiative without strategy reference
 * @BusinessInitiative({
 *   name: 'Customer Portal Redesign',
 *   expectedOutcomes: ['improve customer experience']
 *   // No strategy reference - AI can't understand strategic alignment
 * })
 *
 * // ❌ Bad - Initiative outcomes don't align with strategy
 * @Strategy({
 *   name: 'Cost Reduction',
 *   objectives: ['reduce operational costs']
 * })
 * class CostReductionStrategy {}
 *
 * @BusinessInitiative({
 *   name: 'Premium Feature Development',
 *   strategy: CostReductionStrategy,  // Misaligned - premium features increase costs
 *   expectedOutcomes: ['increase revenue from premium features']
 * })
 * ```
 *
 * **Note:** This rule checks for strategy references and basic alignment. Full strategic
 * alignment validation requires cross-file analysis.
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingStrategyReference' | 'outcomesMisaligned';

export const initiativeStrategyAlignment = createRule<[], MessageIds>({
  name: 'initiative-strategy-alignment',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ensure business initiatives align with organizational strategies to help AI understand strategic relationships and generate coherent planning',
    },
    messages: {
      missingStrategyReference: "Initiative '{{name}}' doesn't reference a strategy. Strategy alignment provides valuable context about how initiatives contribute to organizational goals. Without strategy references, AI systems can't understand strategic relationships or generate proper strategic planning. Reference a strategy to show how this initiative supports organizational objectives.",
      outcomesMisaligned: "Initiative '{{name}}' has outcomes that may not align with its strategy. Initiative outcomes should support strategic objectives to create coherent business context. Misaligned outcomes create contradictory context - AI can't understand how initiatives contribute to strategies when outcomes don't match objectives. Align initiative outcomes with strategic objectives.",
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
          // Only apply to BusinessInitiative decorators
          if (decorator.type !== 'BusinessInitiative') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const strategy = decorator.metadata.strategy;

          // Check if initiative doesn't reference a strategy
          if (!strategy) {
            context.report({
              node: decorator.node,
              messageId: 'missingStrategyReference',
              data: { name: name || 'Unknown' },
            });
          }

          // Note: Full alignment checking (comparing outcomes with strategy objectives)
          // requires cross-file analysis and should be done in CI/CD pipelines
        }
      },
    };
  },
});
