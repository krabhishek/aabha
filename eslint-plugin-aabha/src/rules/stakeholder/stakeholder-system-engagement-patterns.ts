/**
 * Stakeholder System Engagement Patterns Rule
 *
 * **Why this rule exists:**
 * System stakeholders represent APIs, services, and automated systems. They have unique engagement
 * patterns that differ from human stakeholders. System stakeholders typically engage in real-time
 * or daily patterns, have technical permissions, and use system-appropriate communication channels.
 * Without proper engagement patterns, teams cannot understand how to interact with system stakeholders.
 *
 * System engagement patterns enable AI to:
 * 1. **Understand system behavior** - Know how systems engage (real-time, daily, etc.)
 * 2. **Plan integrations** - Understand system interaction patterns
 * 3. **Design APIs** - Know what permissions and touchpoints systems need
 * 4. **Monitor systems** - Understand how to track system stakeholder engagement
 *
 * **What it checks:**
 * - System stakeholders should have `engagement` field (typically 'real-time' or 'daily')
 * - System stakeholders should have `permissions` array with technical permissions
 * - System stakeholders should have `touchpoints` appropriate for systems (APIs, dashboards, etc.)
 * - System stakeholders should have system-appropriate communication preferences
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has system-appropriate engagement patterns
 * @Stakeholder({
 *   type: StakeholderType.System,
 *   role: 'Email Validation Service',
 *   engagement: 'real-time',
 *   permissions: ['read_email_input', 'write_validation_result', 'access_dns_records'],
 *   touchpoints: ['API health dashboard', 'Incident notifications', 'SLA reports'],
 *   communicationPreferences: {
 *     preferredChannels: ['api', 'webhooks', 'monitoring-alerts']
 *   }
 * })
 *
 * // ⚠️ Warning - Missing system engagement patterns
 * @Stakeholder({
 *   type: StakeholderType.System,
 *   role: 'Email Validation Service'
 *   // Missing engagement, permissions, touchpoints
 * })
 * ```
 *
 * @category stakeholder
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingSystemEngagement' | 'missingSystemPermissions' | 'missingSystemTouchpoints';

export const stakeholderSystemEngagementPatterns = createRule<[], MessageIds>({
  name: 'stakeholder-system-engagement-patterns',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'System stakeholders should have engagement patterns appropriate for systems. System stakeholders need technical permissions, system touchpoints, and system-appropriate engagement frequency.',
    },
    messages: {
      missingSystemEngagement:
        "System stakeholder '{{name}}' should have engagement field. System stakeholders typically engage in 'real-time' or 'daily' patterns. Add an engagement field (e.g., 'engagement: \"real-time\"' for continuous systems, 'engagement: \"daily\"' for batch systems).",
      missingSystemPermissions:
        "System stakeholder '{{name}}' should have permissions array with technical permissions. System stakeholders need technical permissions defining what actions/resources they can access (e.g., 'permissions: [\"read_email_input\", \"write_validation_result\", \"access_dns_records\"]').",
      missingSystemTouchpoints:
        "System stakeholder '{{name}}' should have touchpoints array with system-appropriate interaction points. System stakeholders interact through technical touchpoints like APIs, dashboards, monitoring systems (e.g., 'touchpoints: [\"API health dashboard\", \"Incident notifications\", \"SLA reports\"]').",
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
          if (typeNormalized !== 'system') continue;

          const name = (decorator.metadata.name as string | undefined) || (decorator.metadata.role as string | undefined) || 'Unnamed stakeholder';
          const engagement = decorator.metadata.engagement;
          const permissions = decorator.metadata.permissions as string[] | undefined;
          const touchpoints = decorator.metadata.touchpoints as string[] | undefined;

          // Check for missing engagement
          if (!engagement) {
            context.report({
              node: decorator.node,
              messageId: 'missingSystemEngagement',
              data: { name },
            });
          }

          // Check for missing permissions
          if (!permissions || permissions.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'missingSystemPermissions',
              data: { name },
            });
          }

          // Check for missing touchpoints
          if (!touchpoints || touchpoints.length === 0) {
            context.report({
              node: decorator.node,
              messageId: 'missingSystemTouchpoints',
              data: { name },
            });
          }
        }
      },
    };
  },
});

