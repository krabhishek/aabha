/**
 * Stakeholder Human Communication Patterns Rule
 *
 * **Why this rule exists:**
 * Human stakeholders represent individual people. They have unique communication patterns that differ
 * from system stakeholders. Human stakeholders need human-appropriate communication preferences,
 * satisfaction indicators, and engagement patterns. Without proper communication patterns, teams
 * cannot effectively engage with human stakeholders.
 *
 * Human communication patterns enable AI to:
 * 1. **Plan engagement** - Know how to communicate with human stakeholders
 * 2. **Set expectations** - Understand response times and availability
 * 3. **Measure satisfaction** - Track human stakeholder satisfaction indicators
 * 4. **Optimize communication** - Use preferred channels and patterns
 *
 * **What it checks:**
 * - Human stakeholders should have `communicationPreferences` with human-appropriate channels
 * - Human stakeholders should have `satisfactionIndicators` array
 * - Human stakeholders should have engagement patterns appropriate for humans (daily, weekly, monthly)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has human-appropriate communication patterns
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   engagement: 'daily',
 *   communicationPreferences: {
 *     preferredChannels: ['mobile-app', 'email', 'phone', 'video-call'],
 *     responseTime: 'Within 24 hours for non-urgent',
 *     availability: '9 AM - 9 PM EST weekdays'
 *   },
 *   satisfactionIndicators: ['Uses app daily', 'Refers friends', 'NPS score > 8']
 * })
 *
 * // ⚠️ Warning - Missing human communication patterns
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor'
 *   // Missing communicationPreferences, satisfactionIndicators
 * })
 * ```
 *
 * @category stakeholder
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingHumanCommunicationPreferences' | 'missingSatisfactionIndicators';

export const stakeholderHumanCommunicationPatterns = createRule<[], MessageIds>({
  name: 'stakeholder-human-communication-patterns',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Human stakeholders should have communication patterns appropriate for humans. Human stakeholders need human-appropriate communication preferences and satisfaction indicators.',
    },
    messages: {
      missingHumanCommunicationPreferences:
        "Human stakeholder '{{name}}' should have communicationPreferences with human-appropriate channels. Human stakeholders communicate through channels like email, phone, video-call, mobile-app, in-person (e.g., 'communicationPreferences: {{ preferredChannels: [\"email\", \"phone\", \"video-call\"], responseTime: \"Within 24 hours\" }}').",
      missingSatisfactionIndicators:
        "Human stakeholder '{{name}}' should have satisfactionIndicators array. Human stakeholders need satisfaction indicators to measure engagement and happiness (e.g., 'satisfactionIndicators: [\"Uses app daily\", \"Refers friends\", \"NPS score > 8\"]').",
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
          if (decorator.type !== 'Stakeholder') continue;

          const stakeholderType = decorator.metadata.type as string | undefined;
          // Normalize stakeholderType to handle both enum values and enum references
          const typeNormalized = stakeholderType?.toLowerCase().replace('stakeholdertype.', '') || '';
          if (typeNormalized !== 'human') continue;

          const name = (decorator.metadata.name as string | undefined) || (decorator.metadata.role as string | undefined) || 'Unnamed stakeholder';
          const communicationPreferences = decorator.metadata.communicationPreferences;
          const satisfactionIndicators = decorator.metadata.satisfactionIndicators as string[] | undefined;

          // Check for missing communication preferences
          if (!communicationPreferences) {
            context.report({
              node: decorator.node,
              messageId: 'missingHumanCommunicationPreferences',
              data: { name },
            });
          }

          // Check for missing satisfaction indicators
          if (!satisfactionIndicators || satisfactionIndicators.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'missingSatisfactionIndicators',
              data: { name },
            });
          }
        }
      },
    };
  },
});

