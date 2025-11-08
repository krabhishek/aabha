/**
 * Persona Demographics Required Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, demographics provide essential context about
 * who the persona is. For Human personas, demographics (income, education, location, family
 * status) are critical for understanding their needs, constraints, and behaviors. Without
 * demographics, personas become abstract and teams cannot make informed design decisions.
 *
 * Demographics enable AI to:
 * 1. **Understand context** - Income level affects financial needs and constraints
 * 2. **Design appropriately** - Education level affects UI complexity and terminology
 * 3. **Consider constraints** - Family status affects time availability and priorities
 * 4. **Target accurately** - Location affects regulations, services, and cultural factors
 *
 * **What it checks:**
 * - Human personas should have demographics field defined
 * - Demographics should include key fields (incomeLevel/incomeRange, location, familyStatus)
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - Has demographics
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee',
 *   demographics: {
 *     incomeRange: 'GD$48K/year',
 *     location: 'Genai',
 *     familyStatus: 'Single'
 *   }
 * })
 *
 * // ❌ Bad - Missing demographics
 * @Persona({
 *   type: PersonaType.Human,
 *   name: 'Marcus Lee'
 *   // Missing demographics
 * })
 * ```
 *
 * @category persona
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type MessageIds = 'missingDemographics' | 'incompleteDemographics';

export const personaDemographicsRequired = createRule<[], MessageIds>({
  name: 'persona-demographics-required',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Human personas should have demographics field with key information. Demographics provide essential context about who the persona is and enable informed design decisions.',
    },
    messages: {
      missingDemographics:
        "Human persona '{{personaName}}' is missing demographics field. In context engineering, demographics (income, education, location, family status) are critical for understanding persona needs, constraints, and behaviors. Add a 'demographics' object with at least incomeLevel/incomeRange, location, and familyStatus.",
      incompleteDemographics:
        "Human persona '{{personaName}}' has demographics but missing key fields. Demographics should include incomeLevel/incomeRange, location, and familyStatus to provide essential context. Add missing fields: {{missingFields}}.",
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
          if (!personaType || personaType.toLowerCase().replace('personatype.', '') !== 'human') continue;

          const personaName = decorator.metadata.name as string | undefined;
          const demographics = decorator.metadata.demographics as
            | {
                incomeLevel?: string;
                incomeRange?: string;
                location?: string;
                familyStatus?: string;
                [key: string]: unknown;
              }
            | undefined;

          // Check if demographics is missing
          if (!demographics) {
            context.report({
              node: decorator.node,
              messageId: 'missingDemographics',
              data: {
                personaName: personaName || 'Unknown',
              },
              fix(fixer) {
                const source = context.sourceCode.getText(decorator.node);
                const closingBraceIndex = source.lastIndexOf('}');
                if (closingBraceIndex === -1) return null;

                const demographicsTemplate = `,\n  demographics: {\n    incomeRange: '',  // TODO: Income level or range\n    location: '',  // TODO: Geographic location\n    familyStatus: ''  // TODO: Family/household status\n  }`;

                return fixer.insertTextAfterRange(
                  [decorator.node.range[0] + closingBraceIndex - 1, decorator.node.range[0] + closingBraceIndex - 1],
                  demographicsTemplate,
                );
              },
            });
            continue;
          }

          // Check for key missing fields
          const missingFields: string[] = [];
          if (!demographics.incomeLevel && !demographics.incomeRange) {
            missingFields.push('incomeLevel or incomeRange');
          }
          if (!demographics.location) {
            missingFields.push('location');
          }
          if (!demographics.familyStatus) {
            missingFields.push('familyStatus');
          }

          if (missingFields.length > 0) {
            context.report({
              node: decorator.node,
              messageId: 'incompleteDemographics',
              data: {
                personaName: personaName || 'Unknown',
                missingFields: missingFields.join(', '),
              },
            });
          }
        }
      },
    };
  },
});

