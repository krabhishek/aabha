/**
 * Interaction Outputs Completeness Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **outputs** define what data the provider returns to the consumer.
 * When outputs are provided, they should include meaningful configuration to enable proper data contract validation.
 * Incomplete output objects lack the information needed to understand data requirements.
 *
 * Output completeness enables AI to:
 * 1. **Understand data requirements** - Know what data will be returned
 * 2. **Generate implementations** - Create appropriate code with output validation
 * 3. **Enforce contracts** - Understand data requirements for contract enforcement
 * 4. **Plan testing** - Identify output requirements for test scenarios
 *
 * **What it checks:**
 * - Each output has `name` field (string)
 * - Each output has `type` field (string or Constructor)
 * - Outputs with `required: true` should have validation or sensitivity classification
 * - Outputs with sensitivity 'restricted' or 'confidential' should have validation
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Complete outputs
 * @Interaction({
 *   name: 'Account Opening API',
 *   outputs: [
 *     {
 *       name: 'accountNumber',
 *       type: 'string',
 *       required: true,
 *       sensitivity: 'confidential',
 *       validation: { format: 'alphanumeric', constraints: ['8-12 characters'] }
 *     }
 *   ]
 * })
 *
 * // ❌ Bad - Incomplete output (missing name)
 * @Interaction({
 *   outputs: [
 *     { type: 'string', required: true }  // Missing name!
 *   ]
 * })
 *
 * // ❌ Bad - Required output without validation
 * @Interaction({
 *   outputs: [
 *     {
 *       name: 'accountNumber',
 *       type: 'string',
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

type MessageIds = 'missingOutputName' | 'missingOutputType' | 'requiredOutputNeedsValidation' | 'sensitiveOutputNeedsValidation';

export const interactionOutputsCompleteness = createRule<[], MessageIds>({
  name: 'interaction-outputs-completeness',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Interaction outputs should have complete configuration. Each output must have name and type, and required or sensitive outputs should have validation.',
    },
    messages: {
      missingOutputName:
        "Interaction '{{name}}' has output at index {{index}} missing 'name' field. Each output must have a name to identify the data field. Add a name field (e.g., 'name: \"accountNumber\"').",
      missingOutputType:
        "Interaction '{{name}}' has output '{{outputName}}' missing 'type' field. Each output must have a type (string description or Constructor reference) to define the data structure. Add a type field (e.g., 'type: AccountData' or 'type: \"string\"').",
      requiredOutputNeedsValidation:
        "Interaction '{{name}}' has required output '{{outputName}}' without validation. Required outputs should have validation rules to ensure data quality. Consider adding validation (e.g., 'validation: { format: \"alphanumeric\", constraints: [\"8-12 characters\"] }').",
      sensitiveOutputNeedsValidation:
        "Interaction '{{name}}' has sensitive output '{{outputName}}' (sensitivity: {{sensitivity}}) without validation. Sensitive outputs (confidential, restricted) should have validation rules to ensure data security and compliance. Consider adding validation (e.g., 'validation: { format: \"alphanumeric\", constraints: [\"8-12 characters\"] }').",
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
          const outputs = decorator.metadata.outputs as
            | Array<{
                name?: string;
                type?: string | unknown;
                required?: boolean;
                sensitivity?: 'public' | 'internal' | 'confidential' | 'restricted';
                validation?: unknown;
                [key: string]: unknown;
              }>
            | undefined;

          if (!outputs || !Array.isArray(outputs)) continue;

          for (let i = 0; i < outputs.length; i++) {
            const output = outputs[i];
            const outputName = (output.name as string | undefined) || `output[${i}]`;

            // Check for missing name
            if (!output.name) {
              context.report({
                node: decorator.node,
                messageId: 'missingOutputName',
                data: {
                  name: name || 'Unnamed interaction',
                  index: i.toString(),
                },
              });
            }

            // Check for missing type
            if (!output.type) {
              context.report({
                node: decorator.node,
                messageId: 'missingOutputType',
                data: {
                  name: name || 'Unnamed interaction',
                  outputName,
                },
              });
            }

            // Check for required output without validation
            if (output.required === true && !output.validation) {
              context.report({
                node: decorator.node,
                messageId: 'requiredOutputNeedsValidation',
                data: {
                  name: name || 'Unnamed interaction',
                  outputName,
                },
              });
            }

            // Check for sensitive output without validation
            if (
              (output.sensitivity === 'confidential' || output.sensitivity === 'restricted') &&
              !output.validation
            ) {
              context.report({
                node: decorator.node,
                messageId: 'sensitiveOutputNeedsValidation',
                data: {
                  name: name || 'Unnamed interaction',
                  outputName,
                  sensitivity: output.sensitivity,
                },
              });
            }
          }
        }
      },
    };
  },
});

