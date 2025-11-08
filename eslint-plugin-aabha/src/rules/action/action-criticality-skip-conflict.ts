/**
 * Action Criticality-Skip Conflict Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **criticality** and **skipOnError** define failure
 * handling semantics. When these conflict (e.g., critical action that can be skipped on error),
 * you're creating contradictory business logic that confuses AI systems and creates runtime
 * ambiguity.
 *
 * Clear failure semantics help AI understand:
 * 1. **Business constraints** - Critical means "must succeed", skip means "can fail safely"
 * 2. **Error handling flows** - Critical actions need fallbacks/retries, skippable don't
 * 3. **Journey invariants** - What guarantees can AI assume about system state?
 * 4. **Implementation requirements** - Critical needs monitoring/alerts, skippable doesn't
 *
 * When AI sees "critical + skipOnError=true", it receives contradictory signals:
 * - "Critical" suggests: add retry logic, monitoring, alerts, fallback actions
 * - "skipOnError" suggests: ignore failures, continue journey, no big deal
 *
 * This conflict prevents AI from generating correct error handling code and breaks business
 * invariants. If an action can be skipped on error, it's not critical by definition.
 *
 * **What it checks:**
 * - Critical actions MUST NOT have skipOnError=true (error severity)
 * - Required actions SHOULD NOT have skipOnError=true (warning severity)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Critical action that must succeed
 * @Action({
 *   name: 'Verify Identity',
 *   criticality: 'critical',
 *   skipOnError: false,  // Must succeed, has fallback
 *   fallbackActions: [ManualVerificationAction]
 * })
 *
 * // ✅ Good - Optional action that can be skipped
 * @Action({
 *   name: 'Send Marketing Email',
 *   criticality: 'optional',
 *   skipOnError: true  // Can fail safely
 * })
 *
 * // ❌ Error - Logical conflict!
 * @Action({
 *   name: 'Verify Identity',
 *   criticality: 'critical',  // Says: "MUST succeed"
 *   skipOnError: true  // Says: "Can fail, no problem"
 *   // Contradiction! Is identity verification critical or not?
 * })
 *
 * // ⚠️ Warning - Questionable semantics
 * @Action({
 *   name: 'Collect Tax ID',
 *   criticality: 'required',  // Should succeed for journey success
 *   skipOnError: true  // But can be skipped?
 * })
 * ```
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'criticalActionSkippable' | 'requiredActionSkippable';

export const actionCriticalitySkipConflict = createRule<[], MessageIds>({
  name: 'action-criticality-skip-conflict',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Critical or required actions cannot have skipOnError enabled - this creates contradictory business logic that confuses AI systems',
    },
    messages: {
      criticalActionSkippable:
        "Action '{{name}}' is marked StepCriticality.Critical but has skipOnError=true. This is a logical conflict! Critical actions represent business-essential operations that MUST succeed - they form core business invariants. If an action can be skipped on error, it's not critical by definition. AI systems can't generate correct error handling with contradictory signals: StepCriticality.Critical suggests retry logic and fallbacks, but 'skipOnError' suggests ignoring failures. Fix this by either removing skipOnError or changing criticality to StepCriticality.Optional or StepCriticality.Recommended.",
      requiredActionSkippable:
        "Action '{{name}}' is marked StepCriticality.Required but has skipOnError=true. Required actions should complete successfully for journey success - allowing skip on error undermines this contract. This creates ambiguous business semantics: is this action required or optional? AI assistants can't determine if they should generate retry logic, fallbacks, or simply continue on failure. Consider removing skipOnError (make it truly required) or changing criticality to StepCriticality.Recommended or StepCriticality.Optional (acknowledge it can fail).",
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
          // Only apply to Action decorators
          if (decorator.type !== 'Action') {
            continue;
          }

          const name = decorator.metadata.name as string | undefined;
          const criticality = decorator.metadata.criticality as string | undefined;
          const skipOnError = decorator.metadata.skipOnError as boolean | undefined;

          // Skip if skipOnError is not set or is false
          if (!skipOnError) continue;

          // Check for both the enum value 'critical' and the enum reference 'StepCriticality.Critical'
          const isCritical = criticality === 'critical' || 
                            criticality === 'StepCriticality.Critical' ||
                            (typeof criticality === 'string' && criticality.includes('Critical'));
          
          // Check for both the enum value 'required' and the enum reference 'StepCriticality.Required'
          const isRequired = criticality === 'required' || 
                            criticality === 'StepCriticality.Required' ||
                            (typeof criticality === 'string' && criticality.includes('Required'));

          // Critical actions cannot be skipped (error severity)
          if (isCritical) {
            context.report({
              node: decorator.node,
              messageId: 'criticalActionSkippable',
              data: {
                name: name || 'Unknown',
              },
            });
          }

          // Required actions should not be skipped (warning severity)
          if (isRequired) {
            context.report({
              node: decorator.node,
              messageId: 'requiredActionSkippable',
              data: {
                name: name || 'Unknown',
              },
            });
          }
        }
      },
    };
  },
});
