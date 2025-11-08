/**
 * Action Automation-Actor Alignment Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, the combination of **automationLevel** and **actor**
 * tells AI systems who executes an action and how. When these properties conflict (e.g., fully-
 * automated action with human actor), you're creating contradictory context that confuses AI
 * assistants trying to generate implementation code.
 *
 * Proper alignment creates clear, unambiguous context:
 * - **Fully-automated + System actor** = Clear: "System executes this automatically"
 * - **Manual + Human actor** = Clear: "Human performs this manually"
 * - **Fully-automated + Human actor** = Confusing: "Does human trigger it? Or does system?"
 *
 * AI systems use automation-actor alignment to:
 * 1. **Generate correct implementations** - System actors need API calls, human actors need UI
 * 2. **Infer security models** - System actions need service auth, human actions need user auth
 * 3. **Understand timing** - Automated actions are instant, manual actions depend on humans
 * 4. **Design workflows** - AI can't schedule manual actions or assume humans are always ready
 *
 * **What it checks:**
 * - Fully-automated actions should have System-type actors
 * - Manual actions should have human actors (stakeholders/personas)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Automated action with system actor
 * @Action({
 *   name: 'Generate Account Number',
 *   automationLevel: 'fully-automated',
 *   actor: SystemStakeholder  // System performs this
 * })
 *
 * // ✅ Good - Manual action with human actor
 * @Action({
 *   name: 'Review Application',
 *   automationLevel: 'manual',
 *   actor: ComplianceOfficer  // Human performs this
 * })
 *
 * // ❌ Bad - Conflicting context
 * @Action({
 *   name: 'Generate Account Number',
 *   automationLevel: 'fully-automated',
 *   actor: BankTeller  // Contradiction! Automated but has human actor?
 * })
 *
 * // ❌ Bad - System can't do manual work
 * @Action({
 *   name: 'Review Application',
 *   automationLevel: 'manual',
 *   actor: SystemStakeholder  // Contradiction! Manual but system actor?
 * })
 * ```
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

/**
 * Check if an actor name indicates a system/automated actor
 */
function isSystemActor(actorName: string): boolean {
  const lowerName = actorName.toLowerCase();
  return (
    lowerName.includes('system') ||
    lowerName.includes('service') ||
    lowerName.includes('bot') ||
    lowerName.includes('automation') ||
    lowerName.includes('api')
  );
}

type MessageIds = 'automatedActionHumanActor' | 'manualActionSystemActor';

export const actionAutomationActorAlignment = createRule<[], MessageIds>({
  name: 'action-automation-actor-alignment',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Automation level should align with actor type to create clear, unambiguous context for AI code generation',
    },
    messages: {
      automatedActionHumanActor:
        "Action '{{name}}' is fully-automated but actor is '{{actorName}}' (appears to be human). Fully automated actions run without human intervention - they should have System-type actors. This conflicting context confuses AI: automated suggests API/service implementation, but human actor suggests UI/manual triggering. AI can't generate correct code with contradictory signals. Use a System actor (e.g., 'System', 'Payment Service', 'Email Bot') for automated actions.",
      manualActionSystemActor:
        "Action '{{name}}' is manual but actor is '{{actorName}}' (appears to be system). Manual actions require human decision-making and interaction - they need human actors (stakeholders/personas). System actors can't perform manual work! This conflicts AI's understanding: manual suggests UI forms and human workflows, but system actor suggests automated APIs. Use a human actor (e.g., 'Compliance Officer', 'Customer', 'Admin User') for manual actions.",
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
          const automationLevel = decorator.metadata.automationLevel as string | undefined;
          const actor = decorator.metadata.actor as { name?: string } | string | undefined;

          if (!automationLevel || !actor) continue;

          // Extract actor name (handle both object and string formats)
          let actorName: string | undefined;
          if (typeof actor === 'string') {
            actorName = actor;
          } else if (typeof actor === 'object' && actor.name) {
            actorName = actor.name;
          }

          if (!actorName) continue;

          const isSystem = isSystemActor(actorName);

          // Check for both the enum value 'fully-automated' and the enum reference 'StepAutomationLevel.FullyAutomated'
          const isFullyAutomated = automationLevel === 'fully-automated' || 
                                  automationLevel === 'StepAutomationLevel.FullyAutomated' ||
                                  (typeof automationLevel === 'string' && automationLevel.includes('FullyAutomated'));
          
          // Check for both the enum value 'manual' and the enum reference 'StepAutomationLevel.Manual'
          const isManual = automationLevel === 'manual' || 
                          automationLevel === 'StepAutomationLevel.Manual' ||
                          (typeof automationLevel === 'string' && automationLevel.includes('Manual'));

          // Fully automated actions should have system actors
          if (isFullyAutomated && !isSystem) {
            context.report({
              node: decorator.node,
              messageId: 'automatedActionHumanActor',
              data: {
                name: name || 'Unknown',
                actorName,
              },
            });
          }

          // Manual actions should have human actors
          if (isManual && isSystem) {
            context.report({
              node: decorator.node,
              messageId: 'manualActionSystemActor',
              data: {
                name: name || 'Unknown',
                actorName,
              },
            });
          }
        }
      },
    };
  },
});
