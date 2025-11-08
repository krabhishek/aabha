/**
 * Interaction Device Config Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **deviceConfig** provides device-specific configuration
 * for hardware and sensor interactions. For Device layer interactions, deviceConfig is essential
 * for understanding required capabilities, sensors, notifications, storage, and platform requirements.
 *
 * Device config enables AI to:
 * 1. **Understand device capabilities** - Know camera, GPS, biometric, etc. requirements
 * 2. **Generate device code** - Create appropriate device access implementations
 * 3. **Plan permissions** - Understand required permissions
 * 4. **Enable offline support** - Know offline capabilities and sync strategies
 *
 * Missing deviceConfig makes it harder to understand device requirements or generate
 * proper device access code for Device interactions.
 *
 * **What it checks:**
 * - Device layer interactions should have `deviceConfig` field (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has device config
 * @Interaction({
 *   name: 'Biometric Authentication',
 *   layer: InteractionLayer.Device,
 *   deviceConfig: {
 *     requiredCapabilities: ['biometric'],
 *     sensorDetails: {
 *       sensorType: 'fingerprint',
 *       accuracy: 'high'
 *     }
 *   }
 * })
 *
 * // ⚠️ Warning - Missing device config for device interaction
 * @Interaction({
 *   name: 'Biometric Authentication',
 *   layer: InteractionLayer.Device
 *   // Missing deviceConfig - unclear device requirements
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingDeviceConfig';

export const interactionDeviceConfigRecommended = createRule<[], MessageIds>({
  name: 'interaction-device-config-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Device layer interactions should have deviceConfig field. Device config provides device-specific configuration for hardware and sensor interactions.',
    },
    messages: {
      missingDeviceConfig:
        "Interaction '{{name}}' with layer 'Device' is missing a 'deviceConfig' field. Device config is recommended for Device layer interactions to define required capabilities, sensors, notifications, storage, and platform requirements. Consider adding device config (e.g., 'deviceConfig: { requiredCapabilities: [\"biometric\"], sensorDetails: { sensorType: \"fingerprint\" } }').",
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
          const deviceConfig = decorator.metadata.deviceConfig;

          // Only check for Device layer
          if (layer !== 'Device') continue;

          // Check if deviceConfig is missing
          if (!deviceConfig) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if deviceConfig already exists in source to avoid duplicates
            if (source.includes('deviceConfig:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingDeviceConfig',
              data: { name: name || 'Unnamed interaction' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if deviceConfig already exists in source to avoid duplicates
                if (source.includes('deviceConfig:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const deviceConfigTemplate = needsComma
                  ? `,\n  deviceConfig: {\n    requiredCapabilities: [],  // TODO: Add required capabilities (camera, microphone, gps, biometric, nfc, bluetooth)\n    platformRequirements: {\n      minimumOS: '',  // TODO: Define minimum OS version\n      permissions: []  // TODO: Add required permissions\n    }\n  },  // TODO: Define device configuration`
                  : `\n  deviceConfig: {\n    requiredCapabilities: [],  // TODO: Add required capabilities (camera, microphone, gps, biometric, nfc, bluetooth)\n    platformRequirements: {\n      minimumOS: '',  // TODO: Define minimum OS version\n      permissions: []  // TODO: Add required permissions\n    }\n  },  // TODO: Define device configuration`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  deviceConfigTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

