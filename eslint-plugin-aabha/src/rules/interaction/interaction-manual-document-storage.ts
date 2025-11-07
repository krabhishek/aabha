/**
 * Interaction Manual Document Storage Rule
 *
 * **Why this rule exists:**
 * Manual interactions involving physical documents need offline storage configuration for
 * compliance, audit trails, and record retention. Without storage specs, documents may be
 * lost, mishandled, or fail to meet regulatory requirements.
 *
 * **What it checks:**
 * - Manual layer interactions with physical-document pattern should have offlineStorage configured
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingStorage';

export const interactionManualDocumentStorage = createRule<[], MessageIds>({
  name: 'interaction-manual-document-storage',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Manual layer interactions with physical documents should have offlineStorage. In context engineering, storage configuration ensures compliance and record retention.',
    },
    messages: {
      missingStorage:
        "Interaction '{{interactionName}}' is Manual layer with physical documents but lacks offlineStorage. Add manualConfig.offlineStorage with location, retentionPeriod, and securityLevel.",
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

          const interactionName = decorator.metadata.name as string | undefined;
          const layer = decorator.metadata.layer as string | undefined;
          const pattern = decorator.metadata.pattern as string | undefined;

          if (layer !== 'Manual' || pattern !== 'physical-document') continue;

          const manualConfig = decorator.metadata.manualConfig as { offlineStorage?: object } | undefined;

          if (!manualConfig?.offlineStorage) {
            context.report({
              node: decorator.node,
              messageId: 'missingStorage',
              data: { interactionName: interactionName || 'Unknown' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const manualConfigMatch = source.match(/manualConfig:\s*{/);
                if (!manualConfigMatch) return null;

                const insertIndex = manualConfigMatch.index! + manualConfigMatch[0].length;
                const insertion = `\n      offlineStorage: {\n        location: '', // TODO: Storage location\n        retentionPeriod: '', // TODO: e.g., '7 years'\n        securityLevel: 'confidential' // TODO: Adjust security level\n      },`;
                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertIndex, decorator.node.range[0] + insertIndex],
                  insertion,
                );
              },
            });
          }
        }
      },
    };
  },
});
