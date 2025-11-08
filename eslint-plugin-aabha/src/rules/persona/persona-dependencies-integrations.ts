/**
 * Persona Dependencies and Integrations Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, dependencies and integrations document what
 * personas depend on and how they integrate with other systems, teams, or personas. This is
 * particularly important for System and Team personas, but can apply to all types. Without
 * dependencies and integrations, teams cannot understand integration points, dependencies,
 * or collaboration requirements.
 *
 * Dependencies and integrations enable AI to:
 * 1. **Understand dependencies** - Know what personas depend on to function
 * 2. **Plan integrations** - Understand integration points and requirements
 * 3. **Model relationships** - Map how personas connect to other systems/teams
 * 4. **Identify risks** - Understand dependency risks and integration complexity
 *
 * **What it checks:**
 * - System personas should have dependencies or integrations documented
 * - Team personas should have dependencies or integrations documented
 * - When specified, these arrays should not be empty
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has dependencies and integrations
 * @Persona({
 *   type: PersonaType.System,
 *   name: 'Email Validation Service',
 *   dependencies: ['Core Banking System', 'Customer Database'],
 *   integrations: ['Backend API (REST)', 'Event Streaming Service']
 * })
 *
 * // ⚠️ Warning - Missing dependencies/integrations
 * @Persona({
 *   type: PersonaType.System,
 *   name: 'Email Validation Service'
 *   // Missing dependencies and integrations
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingDependenciesAndIntegrations';

export const personaDependenciesIntegrations = createRule<[], MessageIds>({
  name: 'persona-dependencies-integrations',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'System and Team personas should have dependencies or integrations documented. Dependencies and integrations document what personas depend on and how they integrate with other systems or teams.',
    },
    messages: {
      missingDependenciesAndIntegrations:
        "{{personaType}} persona '{{personaName}}' should have dependencies or integrations documented. {{personaType}} personas typically depend on other systems, teams, or entities and need integration points. Add either a 'dependencies' array (what this persona depends on) or an 'integrations' array (integration points with other teams/systems), or both. Example: 'dependencies: [\"Core Banking System\", \"Customer Database\"]' or 'integrations: [\"Backend API (REST)\", \"Event Streaming Service\"]'.",
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
          if (decorator.type !== 'Persona') continue;

          const personaType = decorator.metadata.type as string | undefined;
          // Normalize personaType to handle both enum values and enum references
          const typeNormalized = personaType?.toLowerCase().replace('personatype.', '') || '';
          
          // Only check System and Team personas
          if (typeNormalized !== 'system' && typeNormalized !== 'team') continue;

          const personaName = decorator.metadata.name as string | undefined;
          const dependencies = decorator.metadata.dependencies as string[] | undefined;
          const integrations = decorator.metadata.integrations as string[] | undefined;

          // Check if both are missing or empty
          const hasDependencies = dependencies && dependencies.length > 0;
          const hasIntegrations = integrations && integrations.length > 0;

          if (!hasDependencies && !hasIntegrations) {
            const personaTypeCapitalized = typeNormalized.charAt(0).toUpperCase() + typeNormalized.slice(1);
            context.report({
              node: decorator.node,
              messageId: 'missingDependenciesAndIntegrations',
              data: {
                personaName: personaName || 'Unknown',
                personaType: personaTypeCapitalized,
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                
                // Check if dependencies or integrations already exist in source to avoid duplicates
                if (source.includes('dependencies:') || source.includes('integrations:')) {
                  return null; // Field already exists, don't insert
                }
                
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const dependenciesTemplate = `,\n  dependencies: [\n    '', // TODO: Other personas, systems, or entities this persona depends on\n    '' // TODO: Add more dependencies\n  ],\n  integrations: [\n    '', // TODO: Integration points with other teams, systems, or personas\n    '' // TODO: Add more integrations\n  ]`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  dependenciesTemplate,
                );
              },
            });
          }
        }
      },
    };
  },
});

