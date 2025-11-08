/**
 * Stakeholder Type Persona Alignment Rule
 *
 * **Why this rule exists:**
 * In Aabha's stakeholder framework, stakeholders link to personas through the `persona` field.
 * The stakeholder type should align with the persona type to maintain consistency. For example,
 * a System stakeholder should link to a System persona, not a Human persona. Type misalignment
 * creates confusion and breaks the model's consistency.
 *
 * Type alignment enables AI to:
 * 1. **Maintain consistency** - Ensure stakeholder and persona types match
 * 2. **Validate relationships** - Catch type mismatches early
 * 3. **Generate accurate models** - Understand correct type relationships
 * 4. **Prevent errors** - Avoid confusion from type misalignment
 *
 * **What it checks:**
 * - Stakeholder type should match persona type
 * - System stakeholders should link to System personas
 * - Human stakeholders should link to Human personas
 * - Team stakeholders should link to Team personas
 * - Organization stakeholders should link to Organization personas
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Types align
 * @Stakeholder({
 *   type: StakeholderType.System,
 *   role: 'Email Validation Service',
 *   persona: EmailValidationSystemPersona  // System persona
 * })
 *
 * // ❌ Bad - Type misalignment
 * @Stakeholder({
 *   type: StakeholderType.System,
 *   role: 'Email Validation Service',
 *   persona: TechSavvyMillennial  // Human persona - wrong type!
 * })
 * ```
 *
 * @category stakeholder
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'typePersonaMismatch';

export const stakeholderTypePersonaAlignment = createRule<[], MessageIds>({
  name: 'stakeholder-type-persona-alignment',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Stakeholder type should align with persona type. System stakeholders should link to System personas, Human stakeholders to Human personas, etc.',
    },
    messages: {
      typePersonaMismatch:
        "Stakeholder '{{name}}' has type '{{stakeholderType}}' but links to a persona that appears to be '{{personaType}}'. Stakeholder type should match persona type. System stakeholders should link to System personas, Human stakeholders to Human personas, Team stakeholders to Team personas, and Organization stakeholders to Organization personas. Update either the stakeholder type or persona reference to align types.",
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
          if (decorator.type !== 'Stakeholder') continue;

          const name = (decorator.metadata.name as string | undefined) || (decorator.metadata.role as string | undefined) || 'Unnamed stakeholder';
          const stakeholderType = decorator.metadata.type as string | undefined;
          const persona = decorator.metadata.persona;

          // Skip if type or persona is missing (handled by other rules)
          if (!stakeholderType || !persona) {
            continue;
          }

          // Normalize stakeholderType
          const typeNormalized = stakeholderType.toLowerCase().replace('stakeholdertype.', '');

          // Try to infer persona type from the persona reference
          // This is a best-effort check - we look at the identifier name
          // In practice, this might need to check the actual persona decorator metadata
          // For now, we'll check common naming patterns
          let personaTypeInferred: string | null = null;

          if (typeof persona === 'string') {
            const personaNameLower = persona.toLowerCase();
            if (personaNameLower.includes('system') || personaNameLower.includes('service') || personaNameLower.includes('api')) {
              personaTypeInferred = 'system';
            } else if (personaNameLower.includes('team') || personaNameLower.includes('group')) {
              personaTypeInferred = 'team';
            } else if (personaNameLower.includes('organization') || personaNameLower.includes('org') || personaNameLower.includes('company')) {
              personaTypeInferred = 'organization';
            } else {
              // Default to human if no clear indicators
              personaTypeInferred = 'human';
            }
          }

          // If we can't infer, skip this check (would need deeper AST analysis)
          if (!personaTypeInferred) {
            continue;
          }

          // Check for type mismatch
          if (typeNormalized !== personaTypeInferred) {
            context.report({
              node: decorator.node,
              messageId: 'typePersonaMismatch',
              data: {
                name,
                stakeholderType: typeNormalized,
                personaType: personaTypeInferred,
              },
            });
          }
        }
      },
    };
  },
});

