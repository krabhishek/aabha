# ESLint Rule Quick Reference

Fast reference for implementing Aabha ESLint rules. Read [creating-rules.md](./creating-rules.md) for detailed guidance.

## Rule Template

```typescript
/**
 * [Rule Name] Rule
 *
 * **Why this rule exists:**
 * In Aabha's context engineering framework, [aspect] is [value].
 * [AI comprehension / token efficiency / tribal knowledge benefit]
 *
 * **What it checks:**
 * - [Check 1]
 * - [Check 2]
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - [Why from context perspective]
 * @Decorator({ ... })
 *
 * // ❌ Bad - [What context is lost]
 * @Decorator({ ... })
 * ```
 *
 * @category [category]
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type Options = [{ /* schema */ }];
type MessageIds = 'messageId';

export const ruleName = createRule<Options, MessageIds>({
  name: 'rule-name',
  meta: {
    type: 'problem',
    docs: {
      description: '[Context engineering value]',
    },
    messages: {
      messageId: "Component '{{name}}' [issue] - you're losing valuable context! [Explanation]. [Fix guidance]. Good context = better AI assistance.",
    },
    schema: [/* options */],
    hasFix: true,
  },
  defaultOptions: [{}],
  create(context) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const decorators = getAabhaDecorators(node);
        if (decorators.length === 0) return;

        for (const decorator of decorators) {
          // Validation logic
        }
      },
    };
  },
});
```

## Error Message Templates

### Missing Field
```
"Component '{{name}}' is missing {{field}} - you're losing valuable context! In Aabha's context
engineering framework, {{field}} captures [knowledge type] that AI systems need to [benefit].
Add {{field}} explaining [guidance]. This engineered context helps AI assistants [outcome]."
```

### Empty/Invalid Value
```
"Component '{{name}}' has [issue] - valuable context is being wasted! Context engineering means
capturing [knowledge] as structured, AI-readable information. [Current state] means [consequence].
[Fix]. Good context = better AI assistance."
```

### Pattern Violation
```
"Component '{{name}}' doesn't follow [pattern] (must [requirement]). Consistent [aspect] creates
better context for AI systems to understand your business domain and generate accurate code.
Fix [issue] to improve context quality."
```

## Common Code Patterns

### Get Decorators
```typescript
const decorators = getAabhaDecorators(node);
if (decorators.length === 0) return;

for (const decorator of decorators) {
  const name = decorator.metadata.name as string | undefined;
  const field = decorator.metadata.field as Type | undefined;
}
```

### Filter by Decorator Type
```typescript
if (decorator.type !== 'Action') continue;
// or
const actions = decorators.filter(d => d.type === 'Action');
```

### Report Error
```typescript
context.report({
  node: decorator.node,
  messageId: 'errorId',
  data: { name, field, value },
  fix(fixer) { /* optional */ },
});
```

### Auto-Fix with Indentation
```typescript
import { detectObjectPropertyIndentation } from '../../utils/formatting-helpers.js';

fix(fixer) {
  const arg = decorator.expression.arguments[0];
  if (!arg || arg.type !== 'ObjectExpression') return null;

  const refProp = arg.properties.find(
    (p) => p.type === 'Property' && p.key.name === 'name'
  );
  if (!refProp || refProp.type !== 'Property') return null;

  const indent = detectObjectPropertyIndentation(context.sourceCode, refProp);
  return fixer.insertTextAfterRange(
    [refProp.range[1], refProp.range[1]],
    `,\n${indent}newField: 'value'`
  );
}
```

## Context Engineering Language

Use these phrases in documentation and error messages:

✅ **Use**:
- "engineered context"
- "valuable context"
- "context engineering framework"
- "AI comprehension"
- "token efficiency"
- "tribal knowledge"
- "dense context tokens"
- "semantic meaning"
- "business domain understanding"
- "context quality"

❌ **Avoid**:
- "documentation"
- "comments"
- "readability" (use "context clarity")
- "consistency" (use "context consistency")
- "best practices" (use "context engineering principles")

## Validation Checklist

- [ ] Header explains "Why" from context engineering perspective
- [ ] Error messages emphasize business value and AI impact
- [ ] Examples show context gained/lost
- [ ] Auto-fixes respect indentation
- [ ] Tests cover valid/invalid/edge cases
- [ ] File naming: `kebab-case.ts`
- [ ] Export naming: `camelCase`

## File Locations

- **Rules**: `src/rules/[category]/[rule-name].ts`
- **Tests**: `src/rules/[category]/[rule-name].test.ts`
- **Utils**: `src/utils/`
- **Reference**: `packages/aabha-plugin-core-rules/src/rules/[category]/`

## Context Engineering Philosophy

**Key Principle**: Aabha decorators are not documentation—they're **engineered, AI-comprehensible business context**.

- **Names** = Dense context tokens for AI parsing
- **Descriptions** = Captured tribal knowledge + domain logic
- **Structure** = Traceability from strategy to code
- **Validation** = Context quality assurance

**Good context** → Better AI assistance → Faster development → Preserved knowledge
