/**
 * Initiative No Journeys Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **business initiatives** are strategic programs that
 * deliver business value through multiple user journeys. Initiatives should NOT directly contain
 * journeys - instead, journeys should be separate components that the initiative references or
 * orchestrates. This separation maintains proper abstraction layers and enables AI systems to
 * understand the relationship between strategy, initiatives, and user experiences.
 *
 * Proper separation enables AI to:
 * 1. **Understand architecture** - Clear separation between strategic initiatives and user journeys
 * 2. **Generate proper structure** - AI knows how to organize initiatives vs. journeys
 * 3. **Trace relationships** - AI can understand how initiatives relate to journeys
 * 4. **Maintain abstraction** - Strategic level (initiatives) vs. execution level (journeys)
 *
 * Mixing journeys into initiatives creates architectural confusion - AI systems can't distinguish
 * between strategic planning and user experience design.
 *
 * **What it checks:**
 * - Business initiatives should not directly contain journey definitions
 * - Initiatives should reference journeys, not define them inline
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Initiative references journeys
 * @BusinessInitiative({
 *   name: 'Digital Transformation',
 *   description: 'Modernize customer experience'
 * })
 * class DigitalTransformationInitiative {}
 *
 * @Journey({
 *   name: 'Customer Onboarding',
 *   initiative: DigitalTransformationInitiative
 * })
 * class CustomerOnboardingJourney {}
 *
 * // ❌ Bad - Journey defined within initiative
 * @BusinessInitiative({
 *   name: 'Digital Transformation',
 *   journeys: [
 *     { name: 'Customer Onboarding' }  // Should be separate
 *   ]
 * })
 * ```
 *
 * **Note:** This rule checks for journey-like structures within initiative metadata. Full
 * cross-file validation requires project-wide analysis.
 *
 * @category business-initiative
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'initiativeContainsJourneys';

export const initiativeNoJourneys = createRule<[], MessageIds>({
  name: 'initiative-no-journeys',
  meta: {
    type: 'problem',
    docs: {
      description: 'Business initiatives should not directly contain journeys - maintain proper abstraction between strategic initiatives and user journeys',
    },
    messages: {
      initiativeContainsJourneys: "Initiative '{{name}}' directly contains journey definitions. In Aabha's context engineering framework, business initiatives are strategic programs that should reference separate journey components, not define them inline. Mixing journeys into initiatives creates architectural confusion - AI systems can't distinguish between strategic planning (initiatives) and user experience design (journeys). Extract journeys into separate @Journey decorators and reference them from the initiative to maintain proper abstraction layers.",
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
          const journeys = decorator.metadata.journeys;

          // Check if initiative has journeys defined directly
          if (journeys !== undefined && journeys !== null) {
            const journeysArray = Array.isArray(journeys) ? journeys : [journeys];
            if (journeysArray.length > 0) {
              context.report({
                node: decorator.node,
                messageId: 'initiativeContainsJourneys',
                data: { name: name || 'Unknown' },
              });
            }
          }
        }
      },
    };
  },
});
