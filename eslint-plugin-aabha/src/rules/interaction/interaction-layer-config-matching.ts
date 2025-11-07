/**
 * Interaction Layer Config Matching Rule
 *
 * **Why this rule exists:**
 * Each InteractionLayer has a corresponding layer-specific configuration property. For example,
 * Frontend interactions use `frontendConfig`, Backend interactions use `backendConfig`, etc.
 * Using the wrong config for a layer creates logical inconsistencies and runtime errors.
 *
 * Mismatched layer/config causes:
 * - **Type confusion** - Config doesn't match actual implementation layer
 * - **Runtime errors** - Missing required configuration for the actual layer
 * - **Maintenance issues** - Developers confused about which config applies
 * - **AI generation failures** - AI systems cannot correctly scaffold implementations
 *
 * Correct matching enables:
 * 1. **Type safety** - Config structure matches layer requirements
 * 2. **Clear intent** - layer=Frontend → use frontendConfig
 * 3. **AI assistance** - Systems know which properties to generate
 * 4. **Validation** - Ensure all layer-specific requirements are met
 *
 * **Layer-Config Mapping:**
 * - Frontend → frontendConfig
 * - Backend → backendConfig
 * - Database → databaseConfig
 * - Device → deviceConfig
 * - Interpersonal → interpersonalConfig
 * - Manual → manualConfig
 * - Organizational → organizationalConfig
 *
 * **What it checks:**
 * - When layer is set, only the matching config property should be present
 * - Wrong config properties for the declared layer are flagged
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Frontend layer with frontendConfig
 * @Interaction({
 *   name: 'Login UI',
 *   layer: InteractionLayer.Frontend,
 *   frontendConfig: {
 *     framework: 'React',
 *     renderingStrategy: 'CSR'
 *   }
 * })
 *
 * // ❌ Bad - Frontend layer with backendConfig
 * @Interaction({
 *   name: 'Login UI',
 *   layer: InteractionLayer.Frontend,
 *   backendConfig: {  // Wrong! Should be frontendConfig
 *     runtime: 'Node.js'
 *   }
 * })
 *
 * // ❌ Bad - Multiple configs for single layer
 * @Interaction({
 *   layer: InteractionLayer.Backend,
 *   backendConfig: { runtime: 'Node.js' },
 *   frontendConfig: { framework: 'React' }  // Wrong! Can't have both
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'wrongConfigForLayer' | 'multipleConfigs';

const LAYER_CONFIG_MAP: Record<string, string> = {
  Frontend: 'frontendConfig',
  Backend: 'backendConfig',
  Database: 'databaseConfig',
  Device: 'deviceConfig',
  Interpersonal: 'interpersonalConfig',
  Manual: 'manualConfig',
  Organizational: 'organizationalConfig',
};

const ALL_CONFIG_PROPS = Object.values(LAYER_CONFIG_MAP);

export const interactionLayerConfigMatching = createRule<[], MessageIds>({
  name: 'interaction-layer-config-matching',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Layer-specific config must match the declared layer. In context engineering, Frontend uses frontendConfig, Backend uses backendConfig, etc. Mismatches create type confusion and runtime errors.',
    },
    messages: {
      wrongConfigForLayer:
        "Interaction '{{interactionName}}' has layer '{{layer}}' but uses config '{{wrongConfig}}'. Expected '{{expectedConfig}}'. In context engineering, each layer has a specific config: Frontend→frontendConfig, Backend→backendConfig, Database→databaseConfig, Device→deviceConfig, Interpersonal→interpersonalConfig, Manual→manualConfig, Organizational→organizationalConfig. Using wrong config creates type confusion and prevents AI code generation. Remove '{{wrongConfig}}' and use '{{expectedConfig}}' instead.",
      multipleConfigs:
        "Interaction '{{interactionName}}' has multiple layer configs: {{configs}}. Each interaction should have exactly ONE layer-specific config matching its layer. Multiple configs create ambiguity about which layer this interaction belongs to. Keep only '{{expectedConfig}}' for layer '{{layer}}'.",
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

          const interactionName = decorator.metadata.name as string | undefined;
          const layer = decorator.metadata.layer as string | undefined;

          if (!layer) continue;

          const expectedConfig = LAYER_CONFIG_MAP[layer];
          if (!expectedConfig) continue; // Unknown layer, skip

          // Find which configs are present
          const presentConfigs = ALL_CONFIG_PROPS.filter((configProp) => {
            return decorator.metadata[configProp] !== undefined;
          });

          // Check for multiple configs
          if (presentConfigs.length > 1) {
            context.report({
              node: decorator.node,
              messageId: 'multipleConfigs',
              data: {
                interactionName: interactionName || 'Unknown',
                configs: presentConfigs.join(', '),
                expectedConfig,
                layer,
              },
            });
            continue;
          }

          // Check for wrong config
          if (presentConfigs.length === 1 && presentConfigs[0] !== expectedConfig) {
            context.report({
              node: decorator.node,
              messageId: 'wrongConfigForLayer',
              data: {
                interactionName: interactionName || 'Unknown',
                layer,
                wrongConfig: presentConfigs[0],
                expectedConfig,
              },
            });
          }
        }
      },
    };
  },
});
