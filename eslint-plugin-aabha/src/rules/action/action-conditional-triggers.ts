/**
 * Action Conditional Triggers Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **conditional triggers** define branching logic -
 * the "if-then" decision points in business workflows. When executionMode and trigger conditions
 * are misaligned, you're creating ambiguous branching semantics that confuse AI systems trying
 * to generate workflow orchestration code.
 *
 * Proper conditional trigger configuration helps AI understand:
 * 1. **Decision points** - Where does the journey branch based on runtime conditions?
 * 2. **Branch logic** - What conditions lead to which paths?
 * 3. **Coverage** - Are all cases handled, or is there a default path?
 * 4. **Business rules** - What business logic governs the branching?
 *
 * When AI sees executionMode='conditional' without conditions, or conditions without conditional
 * mode, it receives contradictory control flow signals that prevent generating correct if/else
 * logic, switch statements, or workflow routing code.
 *
 * **What it checks:**
 * - executionMode='conditional' actions SHOULD have triggers with conditions
 * - Actions with conditional triggers SHOULD set executionMode='conditional'
 * - Conditions SHOULD be descriptive (not vague like "true" or single words)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Clear conditional branching
 * @Action({
 *   name: 'Risk Assessment',
 *   executionMode: 'conditional',
 *   triggers: [
 *     {
 *       action: ManualReviewAction,
 *       condition: 'riskScore > 70 && customerAge < 18'
 *     },
 *     {
 *       action: AutoApproveAction,
 *       condition: 'riskScore <= 70'
 *     }
 *   ]
 * })
 *
 * // ✅ Good - Default case for uncovered conditions
 * @Action({
 *   name: 'Document Verification',
 *   executionMode: 'conditional',
 *   triggers: [
 *     { action: PassportVerification, condition: 'documentType === "passport"' },
 *     { action: LicenseVerification, condition: 'documentType === "license"' },
 *     { action: GenericVerification }  // Default case, no condition
 *   ]
 * })
 *
 * // ⚠️ Warning - Conditional mode without conditions
 * @Action({
 *   name: 'Process Application',
 *   executionMode: 'conditional',
 *   triggers: [
 *     { action: NextAction }  // No condition - how to branch?
 *   ]
 * })
 *
 * // ℹ️ Info - Conditions without conditional mode
 * @Action({
 *   name: 'Approval Flow',
 *   triggers: [
 *     { action: SeniorApproval, condition: 'amount > 10000' }
 *   ]
 *   // Missing executionMode='conditional' - unclear branching intent
 * })
 *
 * // ℹ️ Info - Vague condition
 * @Action({
 *   name: 'Route Request',
 *   executionMode: 'conditional',
 *   triggers: [
 *     { action: SpecialHandling, condition: 'true' }  // Meaningless!
 *   ]
 * })
 * ```
 *
 * @category action
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds =
  | 'conditionalWithoutTriggers'
  | 'conditionalTriggerNoCondition'
  | 'vagueCondition'
  | 'conditionsWithoutConditionalMode';

export const actionConditionalTriggers = createRule<[], MessageIds>({
  name: 'action-conditional-triggers',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Conditional execution modes and trigger conditions should align to create clear, AI-comprehensible branching logic',
    },
    messages: {
      conditionalWithoutTriggers:
        "Action '{{name}}' has executionMode='conditional' but no triggers defined. Conditional execution means 'branch based on runtime conditions' - without triggers, there's no branching logic! AI systems can't generate if/else code or workflow routing without triggers. Add triggers array with conditional branches, or change executionMode to StepExecutionMode.Sequential if no branching is needed.",
      conditionalTriggerNoCondition:
        "Action '{{name}}' has executionMode='conditional' but {{count}} of {{total}} trigger(s) lack conditions. Conditional execution requires conditions to determine which path to take. Triggers without conditions in conditional mode create ambiguous branching semantics - AI can't determine when to execute them. Add conditions (e.g., 'riskScore > 70') or mark one trigger as the default/else case by omitting its condition.",
      vagueCondition:
        "Trigger condition '{{condition}}' for action '{{triggeredAction}}' appears vague or trivial. Meaningful conditions help AI understand business rules and generate accurate branching logic. Instead of '{{condition}}', use descriptive boolean expressions like 'riskScore > 70', 'verificationStatus === \"approved\"', or 'customerAge >= 18 && hasConsent'. Clear conditions create self-documenting workflows that AI can comprehend and implement correctly.",
      conditionsWithoutConditionalMode:
        "Action '{{name}}' has triggers with conditions but executionMode is '{{executionMode}}'. This creates unclear branching semantics! Conditions suggest 'execute different actions based on runtime state', but missing conditional executionMode makes the branching intent implicit. AI systems can't determine if this is sequential-with-filtering or true conditional branching. Set executionMode: StepExecutionMode.Conditional to make branching logic explicit and enable AI to generate proper if/else or switch patterns.",
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
          const executionMode = decorator.metadata.executionMode as string | undefined;
          const triggers = decorator.metadata.triggers as Array<{
            action?: { name?: string } | string;
            condition?: string;
          }> | undefined;

          // If execution mode is conditional, check for triggers
          // Check for both the enum value 'conditional' and the enum reference 'StepExecutionMode.Conditional'
          const isConditional = executionMode === 'conditional' || 
                               executionMode === 'StepExecutionMode.Conditional' ||
                               (typeof executionMode === 'string' && executionMode.includes('Conditional'));
          
          if (isConditional) {
            if (!triggers || triggers.length === 0) {
              context.report({
                node: decorator.node,
                messageId: 'conditionalWithoutTriggers',
                data: {
                  name: name || 'Unknown',
                },
              });
            } else {
              // Check if triggers have conditions
              const triggersWithoutCondition = triggers.filter(t => !t.condition);
              if (triggersWithoutCondition.length === triggers.length) {
                // All triggers lack conditions
                context.report({
                  node: decorator.node,
                  messageId: 'conditionalTriggerNoCondition',
                  data: {
                    name: name || 'Unknown',
                    count: triggersWithoutCondition.length.toString(),
                    total: triggers.length.toString(),
                  },
                });
              }
            }
          }

          // Check for triggers with conditions
          if (triggers && triggers.length > 0) {
            const hasConditions = triggers.some(t => t.condition);

            if (hasConditions) {
              // Check condition quality
              triggers.forEach((trigger) => {
                if (trigger.condition) {
                  // Check for vague conditions
                  const vague =
                    trigger.condition.length < 5 ||
                    !trigger.condition.includes(' ') ||
                    trigger.condition === 'true' ||
                    trigger.condition === 'false';

                  if (vague) {
                    const actionName = typeof trigger.action === 'string'
                      ? trigger.action
                      : trigger.action?.name || 'Unknown';

                    context.report({
                      node: decorator.node,
                      messageId: 'vagueCondition',
                      data: {
                        condition: trigger.condition,
                        triggeredAction: actionName,
                      },
                    });
                  }
                }
              });

              // Suggest executionMode=StepExecutionMode.Conditional if not set or not the enum reference
              // Check for both the enum value 'conditional' and the enum reference 'StepExecutionMode.Conditional'
              const isConditional = executionMode === 'conditional' || 
                                   executionMode === 'StepExecutionMode.Conditional' ||
                                   (typeof executionMode === 'string' && executionMode.includes('Conditional'));
              
              if (!isConditional) {
                context.report({
                  node: decorator.node,
                  messageId: 'conditionsWithoutConditionalMode',
                  data: {
                    name: name || 'Unknown',
                    executionMode: executionMode || 'not set',
                  },
                });
              }
            }
          }
        }
      },
    };
  },
});
