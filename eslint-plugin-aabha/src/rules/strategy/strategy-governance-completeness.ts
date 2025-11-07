/**
 * Strategy Governance Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's strategic framework, **governance fields** ensure strategies are actively managed,
 * reviewed, and owned. Strategies without governance become stale, unmaintained, and lose relevance
 * over time. Governance fields enable AI systems to track strategy health, identify outdated
 * strategies, and ensure accountability.
 *
 * Governance fields enable AI to:
 * 1. **Track strategy ownership** - Know who is responsible for strategy execution
 * 2. **Monitor review cycles** - Identify strategies that need review or are overdue
 * 3. **Generate maintenance reminders** - Alert when strategies haven't been reviewed
 * 4. **Understand strategy currency** - Know if strategies are current or outdated
 *
 * Missing governance fields mean AI can't track strategy health or ensure accountability.
 *
 * **What it checks:**
 * - Strategy has `owner` (person or team responsible)
 * - Strategy has `reviewCycle` (how often strategy is reviewed)
 * - Strategy has `lastReviewed` (date of last review)
 * - Strategy has `nextReview` (date of next planned review)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete governance
 * @Strategy({
 *   name: 'Digital Transformation',
 *   winningAspiration: 'Be the #1 digital bank',
 *   owner: 'CEO',
 *   reviewCycle: 'Quarterly',
 *   lastReviewed: '2025-01-15',
 *   nextReview: '2025-04-15'
 * })
 * export class DigitalTransformationStrategy {}
 *
 * // ❌ Bad - Missing governance
 * @Strategy({
 *   name: 'Digital Transformation',
 *   winningAspiration: 'Be the #1 digital bank'
 *   // Missing owner, reviewCycle, lastReviewed, nextReview
 * })
 * export class DigitalTransformationStrategy {}
 * ```
 *
 * @category strategy
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds =
  | 'missingOwner'
  | 'missingReviewCycle'
  | 'missingLastReviewed'
  | 'missingNextReview';

export const strategyGovernanceCompleteness = createRule<[], MessageIds>({
  name: 'strategy-governance-completeness',
  meta: {
    type: 'problem',
    docs: {
      description: 'Strategies should have complete governance fields (owner, reviewCycle, lastReviewed, nextReview) to ensure accountability and maintenance',
    },
    messages: {
      missingOwner: "Strategy '{{name}}' is missing an 'owner' field. Strategies need clear ownership to ensure accountability and execution. The owner is the person or team responsible for strategy execution and success. Add an owner field (e.g., 'owner: \"CEO\"' or 'owner: \"Product Leadership Team\"').",
      missingReviewCycle: "Strategy '{{name}}' is missing a 'reviewCycle' field. Strategies need regular review cycles to stay current and relevant. Review cycles define how often the strategy should be reviewed and updated. Add a reviewCycle field (e.g., 'reviewCycle: \"Quarterly\"' or 'reviewCycle: \"Annually\"').",
      missingLastReviewed: "Strategy '{{name}}' is missing a 'lastReviewed' field. Tracking when strategies were last reviewed helps identify stale or outdated strategies. Add a lastReviewed field with the date of the last review (e.g., 'lastReviewed: \"2025-01-15\"').",
      missingNextReview: "Strategy '{{name}}' is missing a 'nextReview' field. Next review dates enable proactive strategy maintenance and help AI systems generate review reminders. Add a nextReview field with the date of the next planned review (e.g., 'nextReview: \"2025-04-15\"').",
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
          // Only apply to Strategy decorators
          if (decorator.type !== 'Strategy') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const owner = decorator.metadata.owner;
          const reviewCycle = decorator.metadata.reviewCycle;
          const lastReviewed = decorator.metadata.lastReviewed;
          const nextReview = decorator.metadata.nextReview;

          if (!owner) {
            context.report({
              node: decorator.node,
              messageId: 'missingOwner',
              data: { name: name || 'Unnamed strategy' },
            });
          }

          if (!reviewCycle) {
            context.report({
              node: decorator.node,
              messageId: 'missingReviewCycle',
              data: { name: name || 'Unnamed strategy' },
            });
          }

          if (!lastReviewed) {
            context.report({
              node: decorator.node,
              messageId: 'missingLastReviewed',
              data: { name: name || 'Unnamed strategy' },
            });
          }

          if (!nextReview) {
            context.report({
              node: decorator.node,
              messageId: 'missingNextReview',
              data: { name: name || 'Unnamed strategy' },
            });
          }
        }
      },
    };
  },
});
