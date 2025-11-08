/**
 * Interaction Data Config Recommended Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, **dataConfig** provides data-specific configuration
 * for database and storage interactions. For Data layer interactions, dataConfig is essential
 * for understanding database type, transaction management, schema, and consistency requirements.
 *
 * Data config enables AI to:
 * 1. **Understand database type** - Know SQL, NoSQL, graph, timeseries, etc.
 * 2. **Generate data access code** - Create appropriate queries and transactions
 * 3. **Plan transactions** - Understand isolation levels and locking strategies
 * 4. **Enable consistency** - Know replication and consistency requirements
 *
 * Missing dataConfig makes it harder to understand data requirements or generate
 * proper data access code for Data interactions.
 *
 * **What it checks:**
 * - Data layer interactions should have `dataConfig` field (recommended)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has data config
 * @Interaction({
 *   name: 'Account Query',
 *   layer: InteractionLayer.Data,
 *   dataConfig: {
 *     databaseType: 'sql',
 *     schema: {
 *       tableName: 'accounts',
 *       primaryKey: 'account_id'
 *     }
 *   }
 * })
 *
 * // ⚠️ Warning - Missing data config for data interaction
 * @Interaction({
 *   name: 'Account Query',
 *   layer: InteractionLayer.Data
 *   // Missing dataConfig - unclear data requirements
 * })
 * ```
 *
 * @category interaction
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';
import { needsCommaBeforeField, findFieldInsertionPosition } from '../../utils/formatting-helpers.js';

type MessageIds = 'missingDataConfig';

export const interactionDataConfigRecommended = createRule<[], MessageIds>({
  name: 'interaction-data-config-recommended',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Data layer interactions should have dataConfig field. Data config provides data-specific configuration for database and storage interactions.',
    },
    messages: {
      missingDataConfig:
        "Interaction '{{name}}' with layer 'Data' is missing a 'dataConfig' field. Data config is recommended for Data layer interactions to define database type, transaction management, schema, and consistency requirements. Consider adding data config (e.g., 'dataConfig: { databaseType: \"sql\", schema: { tableName: \"accounts\" } }').",
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
          const dataConfig = decorator.metadata.dataConfig;

          // Only check for Data layer
          if (layer !== 'Data') continue;

          // Check if dataConfig is missing
          if (!dataConfig) {
            const source = context.sourceCode.getText(decorator.node);
            
            // Check if dataConfig already exists in source to avoid duplicates
            if (source.includes('dataConfig:')) {
              continue;
            }

            context.report({
              node: decorator.node,
              messageId: 'missingDataConfig',
              data: { name: name || 'Unnamed interaction' },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if dataConfig already exists in source to avoid duplicates
                if (source.includes('dataConfig:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                // Find the text before the closing brace to check if we need a comma
                const textBeforeBrace = source.substring(0, closingBraceIndex);
                const needsComma = needsCommaBeforeField(textBeforeBrace);
                
                // Find the insertion position (after last property/comment, before closing brace)
                const insertOffset = findFieldInsertionPosition(textBeforeBrace, closingBraceIndex);
                
                const dataConfigTemplate = needsComma
                  ? `,\n  dataConfig: {\n    databaseType: 'sql',  // TODO: Choose database type (sql, nosql, graph, timeseries, cache, search-engine)\n    schema: {\n      tableName: '',  // TODO: Define table/collection name\n      primaryKey: ''  // TODO: Define primary key\n    }\n  },  // TODO: Define data configuration`
                  : `\n  dataConfig: {\n    databaseType: 'sql',  // TODO: Choose database type (sql, nosql, graph, timeseries, cache, search-engine)\n    schema: {\n      tableName: '',  // TODO: Define table/collection name\n      primaryKey: ''  // TODO: Define primary key\n    }\n  },  // TODO: Define data configuration`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + insertOffset, decorator.node.range[0] + insertOffset],
                  dataConfigTemplate
                );
              },
            });
          }
        }
      },
    };
  },
});

