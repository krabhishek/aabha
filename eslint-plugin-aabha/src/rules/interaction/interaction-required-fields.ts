/**
 * Interaction Required Fields Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, interactions must have core required fields (name, pattern, layer, inputs, outputs)
 * to be valid and actionable. These fields define the fundamental contract of an interaction: WHAT it's called (name),
 * HOW it happens (pattern), WHERE it occurs (layer), WHAT data flows in (inputs), and WHAT data flows out (outputs).
 * Without these fields, interactions are incomplete and AI systems cannot properly model or understand them.
 *
 * Required fields enable AI to:
 * 1. **Understand interaction identity** - Name and pattern define what the interaction is
 * 2. **Know the layer** - Layer determines which layer-specific config applies
 * 3. **Define data contract** - Inputs and outputs define the data exchange
 * 4. **Model relationships** - Core fields enable relationship and dependency modeling
 *
 * Missing required fields means interactions cannot be properly integrated into the context engineering model.
 *
 * **What it checks:**
 * - Interactions have `name` field (string)
 * - Interactions have `pattern` field (InteractionPattern)
 * - Interactions have `layer` field (InteractionLayer)
 * - Interactions have `inputs` field (array of InteractionData)
 * - Interactions have `outputs` field (array of InteractionData)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - All required fields present
 * @Interaction({
 *   name: 'Account Opening API',
 *   pattern: InteractionPattern.RequestResponse,
 *   layer: InteractionLayer.Backend,
 *   inputs: [
 *     { name: 'customerData', type: CustomerData, required: true }
 *   ],
 *   outputs: [
 *     { name: 'accountNumber', type: 'string', required: true }
 *   ]
 * })
 * export class AccountOpeningAPIInteraction {}
 *
 * // ❌ Bad - Missing required fields
 * @Interaction({
 *   name: 'Account Opening API'
 *   // Missing pattern, layer, inputs, outputs
 * })
 * export class AccountOpeningAPIInteraction {}
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds =
  | 'missingName'
  | 'missingPattern'
  | 'missingLayer'
  | 'missingInputs'
  | 'missingOutputs';

export const interactionRequiredFields = createRule<[], MessageIds>({
  name: 'interaction-required-fields',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Interactions must have all required fields: name, pattern, layer, inputs, and outputs. These fields define the fundamental contract of an interaction.',
    },
    messages: {
      missingName:
        "Interaction is missing required 'name' field. Name defines what this interaction is called. Add a name field with a clear, descriptive name (e.g., 'name: \"Account Opening API\"').",
      missingPattern:
        "Interaction '{{name}}' is missing required 'pattern' field. Pattern (InteractionPattern) defines HOW the interaction happens (RequestResponse, Event, FormInteraction, etc.). Add a pattern field referencing InteractionPattern enum (e.g., 'pattern: InteractionPattern.RequestResponse').",
      missingLayer:
        "Interaction '{{name}}' is missing required 'layer' field. Layer (InteractionLayer) defines WHERE the interaction happens (Frontend, Backend, Data, Device, etc.). Add a layer field referencing InteractionLayer enum (e.g., 'layer: InteractionLayer.Backend').",
      missingInputs:
        "Interaction '{{name}}' is missing required 'inputs' field. Inputs define what data the consumer provides to the provider. Add an inputs array with InteractionData items (e.g., 'inputs: [{ name: \"customerData\", type: CustomerData, required: true }]').",
      missingOutputs:
        "Interaction '{{name}}' is missing required 'outputs' field. Outputs define what data the provider returns to the consumer. Add an outputs array with InteractionData items (e.g., 'outputs: [{ name: \"accountNumber\", type: \"string\", required: true }]').",
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
          if (decorator.type !== 'Interaction') continue;

          const name = decorator.metadata.name as string | undefined;
          const pattern = decorator.metadata.pattern;
          const layer = decorator.metadata.layer;
          const inputs = decorator.metadata.inputs;
          const outputs = decorator.metadata.outputs;

          // Check for missing name
          if (!name) {
            context.report({
              node: decorator.node,
              messageId: 'missingName',
            });
          }

          // Check for missing pattern
          if (!pattern) {
            context.report({
              node: decorator.node,
              messageId: 'missingPattern',
              data: { name: name || 'Unnamed interaction' },
            });
          }

          // Check for missing layer
          if (!layer) {
            context.report({
              node: decorator.node,
              messageId: 'missingLayer',
              data: { name: name || 'Unnamed interaction' },
            });
          }

          // Check for missing inputs
          if (!inputs || (Array.isArray(inputs) && inputs.length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'missingInputs',
              data: { name: name || 'Unnamed interaction' },
            });
          }

          // Check for missing outputs
          if (!outputs || (Array.isArray(outputs) && outputs.length === 0)) {
            context.report({
              node: decorator.node,
              messageId: 'missingOutputs',
              data: { name: name || 'Unnamed interaction' },
            });
          }
        }
      },
    };
  },
});

