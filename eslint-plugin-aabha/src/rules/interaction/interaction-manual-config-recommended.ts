/**
 * Interaction Manual Config Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **manualConfig** provides manual-specific configuration
 * for offline processes and human-driven workflows. For Manual layer interactions, manualConfig is
 * essential for understanding process type, physical location, reviewers, approval workflows, and
 * other manual-specific details.
 *
 * Manual config enables AI to:
 * 1. **Understand process type** - Know manual review, physical document, signature, etc.
 * 2. **Plan physical location** - Understand where the process happens
 * 3. **Manage reviewers** - Know who reviews and approves
 * 4. **Enable compliance** - Understand document storage and retention
 *
 * Missing manualConfig makes it harder to understand manual requirements or generate
 * proper workflow code for Manual interactions.
 *
 * **What it checks:**
 * - Manual layer interactions should have `manualConfig` field (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has manual config
 * @Interaction({
 *   name: 'Compliance Review',
 *   layer: InteractionLayer.Manual,
 *   manualConfig: {
 *     processType: 'manual-review',
 *     physicalLocation: 'Compliance Department',
 *     reviewers: [ComplianceOfficerStakeholder],
 *     estimatedDuration: 'PT48H'
 *   }
 * })
 *
 * // ⚠️ Warning - Missing manual config for manual interaction
 * @Interaction({
 *   name: 'Compliance Review',
 *   layer: InteractionLayer.Manual
 *   // Missing manualConfig - unclear manual process requirements
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingManualConfig';

export const interactionManualConfigRecommended = createRule<[], MessageIds>({
  name: 'interaction-manual-config-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Manual layer interactions should have manualConfig field. Manual config provides manual-specific configuration for offline processes and human-driven workflows.',
    },
    messages: {
      missingManualConfig:
        "Interaction '{{name}}' with layer 'Manual' is missing a 'manualConfig' field. Manual config is recommended for Manual layer interactions to define process type, physical location, reviewers, approval workflows, and other manual-specific details. Consider adding manual config (e.g., 'manualConfig: { processType: \"manual-review\", physicalLocation: \"Compliance Department\", reviewers: [...] }').",
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
          const manualConfig = decorator.metadata.manualConfig;

          // Only check for Manual layer
          if (layer !== 'Manual') continue;

          // Check if manualConfig is missing
          if (!manualConfig) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if manualConfig already exists in source to avoid duplicates
            if (source.includes('manualConfig:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingManualConfig',
              data: { name: name || 'Unnamed interaction' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if manualConfig already exists in source to avoid duplicates
                if (source.includes('manualConfig:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const manualConfigTemplate = needsComma
                  ? `,\n  manualConfig: {\n    processType: 'manual-review',  // TODO: Choose process type (manual-review, physical-document, physical-signature, in-person-verification)\n    physicalLocation: '',  // TODO: Define physical location\n    reviewers: [],  // TODO: Add reviewer @Stakeholder decorated classes\n    estimatedDuration: 'PT24H'  // TODO: Define estimated duration (ISO 8601 format)\n  },  // TODO: Define manual configuration`
                  : `\n  manualConfig: {\n    processType: 'manual-review',  // TODO: Choose process type (manual-review, physical-document, physical-signature, in-person-verification)\n    physicalLocation: '',  // TODO: Define physical location\n    reviewers: [],  // TODO: Add reviewer @Stakeholder decorated classes\n    estimatedDuration: 'PT24H'  // TODO: Define estimated duration (ISO 8601 format)\n  },  // TODO: Define manual configuration`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  manualConfigTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

