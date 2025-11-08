/**
 * Interaction Frontend Config Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **frontendConfig** provides frontend-specific configuration
 * for UI/UX interactions. For Frontend layer interactions, frontendConfig is essential for understanding
 * framework, gestures, accessibility, and other frontend-specific details.
 *
 * Frontend config enables AI to:
 * 1. **Understand UI framework** - Know which framework/library is used
 * 2. **Generate UI code** - Create appropriate component implementations
 * 3. **Plan accessibility** - Understand accessibility requirements
 * 4. **Enable responsive design** - Know responsive design requirements
 *
 * Missing frontendConfig makes it harder to understand frontend requirements or generate
 * proper UI code for Frontend interactions.
 *
 * **What it checks:**
 * - Frontend layer interactions should have `frontendConfig` field (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has frontend config
 * @Interaction({
 *   name: 'Account Opening Form',
 *   layer: InteractionLayer.Frontend,
 *   frontendConfig: {
 *     framework: 'react-native',
 *     formValidation: {
 *       validationRules: ['email', 'required'],
 *       validationTiming: 'on-blur'
 *     }
 *   }
 * })
 *
 * // ⚠️ Warning - Missing frontend config for frontend interaction
 * @Interaction({
 *   name: 'Account Opening Form',
 *   layer: InteractionLayer.Frontend
 *   // Missing frontendConfig - unclear UI requirements
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingFrontendConfig';

export const interactionFrontendConfigRecommended = createRule<[], MessageIds>({
  name: 'interaction-frontend-config-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Frontend layer interactions should have frontendConfig field. Frontend config provides frontend-specific configuration for UI/UX interactions.',
    },
    messages: {
      missingFrontendConfig:
        "Interaction '{{name}}' with layer 'Frontend' is missing a 'frontendConfig' field. Frontend config is recommended for Frontend layer interactions to define framework, gestures, accessibility, and other frontend-specific details. Consider adding frontend config (e.g., 'frontendConfig: { framework: \"react-native\", formValidation: { validationRules: [\"email\", \"required\"] } }').",
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
          const layer = decorator.metadata.layer as string | undefined;
          const frontendConfig = decorator.metadata.frontendConfig;

          // Only check for Frontend layer
          if (layer !== 'Frontend') continue;

          // Check if frontendConfig is missing
          if (!frontendConfig) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if frontendConfig already exists in source to avoid duplicates
            if (source.includes('frontendConfig:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingFrontendConfig',
              data: { name: name || 'Unnamed interaction' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if frontendConfig already exists in source to avoid duplicates
                if (source.includes('frontendConfig:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const frontendConfigTemplate = needsComma
                  ? `,\n  frontendConfig: {\n    framework: 'react',  // TODO: Choose framework (react, react-native, flutter, vue, angular, svelte)\n    formValidation: {\n      validationRules: [],  // TODO: Add validation rules\n      validationTiming: 'on-blur'  // TODO: Choose timing (on-blur, on-change, on-submit, real-time)\n    }\n  },  // TODO: Define frontend configuration`
                  : `\n  frontendConfig: {\n    framework: 'react',  // TODO: Choose framework (react, react-native, flutter, vue, angular, svelte)\n    formValidation: {\n      validationRules: [],  // TODO: Add validation rules\n      validationTiming: 'on-blur'  // TODO: Choose timing (on-blur, on-change, on-submit, real-time)\n    }\n  },  // TODO: Define frontend configuration`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  frontendConfigTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

