/**
 * Stakeholder Communication Preferences Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's stakeholder framework, communication preferences define how stakeholders prefer to communicate
 * and be communicated with. When communicationPreferences is specified, it should include key fields
 * (preferredChannels, responseTime) to be useful for planning engagement and optimizing communication.
 * Incomplete communication preferences leave teams without critical information needed for effective
 * stakeholder engagement.
 *
 * Communication preferences completeness enables AI to:
 * 1. **Plan engagement** - Preferred channels inform communication strategy
 * 2. **Set expectations** - Response time helps manage expectations
 * 3. **Optimize communication** - Understanding preferences improves engagement effectiveness
 * 4. **Handle escalations** - Escalation paths ensure timely responses
 *
 * **What it checks:**
 * - Stakeholders with communicationPreferences should include key fields
 * - Required fields: preferredChannels, responseTime
 * - Recommended fields: escalationPath, availability
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has complete communication preferences
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   communicationPreferences: {
 *     preferredChannels: ['mobile-app', 'email', 'phone', 'video-call'],
 *     responseTime: 'Within 24 hours for non-urgent; within 2 hours for urgent',
 *     escalationPath: 'Call mobile phone after 48 hours of no response',
 *     availability: '9 AM - 9 PM EST weekdays; 10 AM - 6 PM weekends'
 *   }
 * })
 *
 * // ⚠️ Warning - Incomplete communication preferences
 * @Stakeholder({
 *   type: StakeholderType.Human,
 *   role: 'Primary Investor',
 *   communicationPreferences: {
 *     preferredChannels: ['email']
 *     // Missing responseTime, escalationPath, availability
 *   }
 * })
 * ```
 *
 * @category stakeholder
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'incompleteCommunicationPreferences';

export const stakeholderCommunicationPreferencesCompleteness = createRule<[], MessageIds>({
  name: 'stakeholder-communication-preferences-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Stakeholders with communicationPreferences should include key fields. Complete communication preferences enable effective stakeholder engagement.',
    },
    messages: {
      incompleteCommunicationPreferences:
        "Stakeholder '{{name}}' has communicationPreferences but missing key fields. Communication preferences should include preferredChannels and responseTime to provide essential context for engagement. Add missing fields: {{missingFields}}. Without these fields, teams lack critical information needed for effective stakeholder communication.",
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

          const name = (decorator.metadata.name as string | undefined) || (decorator.metadata.role as string | undefined) || 'Unnamed stakeholder';
          const communicationPreferences = decorator.metadata.communicationPreferences as
            | {
                preferredChannels?: string[];
                responseTime?: string;
                escalationPath?: string;
                availability?: string;
                [key: string]: unknown;
              }
            | undefined;

          // Only check if communicationPreferences exists
          if (!communicationPreferences || Object.keys(communicationPreferences).length === 0) {
            continue;
          }

          // Check for key missing fields
          const missingFields: string[] = [];

          // PreferredChannels is essential
          if (!communicationPreferences.preferredChannels || communicationPreferences.preferredChannels.length === 0) {
            missingFields.push('preferredChannels');
          }

          // ResponseTime helps set expectations
          if (!communicationPreferences.responseTime) {
            missingFields.push('responseTime');
          }

          if (missingFields.length > 0) {
            context.report({
              node: decorator.node,
              messageId: 'incompleteCommunicationPreferences',
              data: {
                name,
                missingFields: missingFields.join(', '),
              },
            });
          }
        }
      },
    };
  },
});

