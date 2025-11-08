/**
 * Interaction Inputs Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **inputs** define what data the consumer provides to the provider.
 * When inputs are provided, they should include meaningful configuration to enable proper data contract validation.
 * Incomplete input objects lack the information needed to understand data requirements.
 *
 * Input completeness enables AI to:
 * 1. **Understand data requirements** - Know what data must be provided
 * 2. **Generate implementations** - Create appropriate code with input validation
 * 3. **Enforce contracts** - Understand data requirements for contract enforcement
 * 4. **Plan testing** - Identify input requirements for test scenarios
 *
 * **What it checks:**
 * - Each input has `name` field (string)
 * - Each input has `type` field (string or Constructor)
 * - Inputs with `required: true` should have validation or sensitivity classification
 * - Inputs with sensitivity 'restricted' or 'confidential' should have validation
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete inputs
 * @Interaction({
 *   name: 'Account Opening API',
 *   inputs: [
 *     {
 *       name: 'customerData',
 *       type: CustomerData,
 *       required: true,
 *       sensitivity: 'confidential',
 *       validation: { format: 'json' }
 *     }
 *   ]
 * })
 *
 * // ❌ Bad - Incomplete input (missing name)
 * @Interaction({
 *   inputs: [
 *     { type: CustomerData, required: true }  // Missing name!
 *   ]
 * })
 *
 * // ❌ Bad - Required input without validation
 * @Interaction({
 *   inputs: [
 *     {
 *       name: 'customerData',
 *       type: CustomerData,
 *       required: true,
 *       sensitivity: 'restricted'
 *       // Missing validation for sensitive required field!
 *     }
 *   ]
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingInputName' | 'missingInputType' | 'requiredInputNeedsValidation' | 'sensitiveInputNeedsValidation';

export const interactionInputsCompleteness = createRule<[], MessageIds>({
  name: 'interaction-inputs-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Interaction inputs should have complete configuration. Each input must have name and type, and required or sensitive inputs should have validation.',
    },
    messages: {
      missingInputName:
        "Interaction '{{name}}' has input at index {{index}} missing 'name' field. Each input must have a name to identify the data field. Add a name field (e.g., 'name: \"customerData\"').",
      missingInputType:
        "Interaction '{{name}}' has input '{{inputName}}' missing 'type' field. Each input must have a type (string description or Constructor reference) to define the data structure. Add a type field (e.g., 'type: CustomerData' or 'type: \"string\"').",
      requiredInputNeedsValidation:
        "Interaction '{{name}}' has required input '{{inputName}}' without validation. Required inputs should have validation rules to ensure data quality. Consider adding validation (e.g., 'validation: { format: \"email\", constraints: [\"Valid email format\"] }').",
      sensitiveInputNeedsValidation:
        "Interaction '{{name}}' has sensitive input '{{inputName}}' (sensitivity: {{sensitivity}}) without validation. Sensitive inputs (confidential, restricted) should have validation rules to ensure data security and compliance. Consider adding validation (e.g., 'validation: { format: \"email\", constraints: [\"Valid email format\"] }').",
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
          if (decorator.type !== 'Interaction') continue;

          const name = decorator.metadata.name as string | undefined;
          const inputs = decorator.metadata.inputs as
            | Array<{
                name?: string;
                type?: string | unknown;
                required?: boolean;
                sensitivity?: 'public' | 'internal' | 'confidential' | 'restricted';
                validation?: unknown;
                [key: string]: unknown;
              }>
            | undefined;

          if (!inputs || !Array.isArray(inputs)) continue;

          for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            const inputName = (input.name as string | undefined) || `input[${i}]`;

            // Check for missing name
            if (!input.name) {
              context.report({
                node: decorator.node,
                messageId: 'missingInputName',
                data: {
                  name: name || 'Unnamed interaction',
                  index: i.toString(),
                },
              });
            }

            // Check for missing type
            if (!input.type) {
              context.report({
                node: decorator.node,
                messageId: 'missingInputType',
                data: {
                  name: name || 'Unnamed interaction',
                  inputName,
                },
              });
            }

            // Check for required input without validation
            if (input.required === true && !input.validation) {
              context.report({
                node: decorator.node,
                messageId: 'requiredInputNeedsValidation',
                data: {
                  name: name || 'Unnamed interaction',
                  inputName,
                },
              });
            }

            // Check for sensitive input without validation
            if (
              (input.sensitivity === 'confidential' || input.sensitivity === 'restricted') &&
              !input.validation
            ) {
              context.report({
                node: decorator.node,
                messageId: 'sensitiveInputNeedsValidation',
                data: {
                  name: name || 'Unnamed interaction',
                  inputName,
                  sensitivity: input.sensitivity,
                },
              });
            }
          }
        }
      },
    };
  },
});

