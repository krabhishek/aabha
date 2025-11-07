# Creating ESLint Rules for Aabha

This guide explains how to create new ESLint rules for the `eslint-plugin-aabha` package.

## Table of Contents

- [Understanding the Context Engineering Philosophy](#understanding-the-context-engineering-philosophy)
- [Rule Anatomy](#rule-anatomy)
- [Documentation Standards](#documentation-standards)
- [Writing Error Messages](#writing-error-messages)
- [Implementation Patterns](#implementation-patterns)
- [Testing Rules](#testing-rules)
- [Examples](#examples)
- [Common Patterns](#common-patterns)

---

## Understanding the Context Engineering Philosophy

Before writing any rule, understand that **Aabha is a context engineering framework**, not just a documentation tool. This fundamentally shapes how we write rules and error messages.

### What is Context Engineering?

From the Aabha README:

> **Aabha** (Sanskrit: आभा, meaning "aura" or "radiance") - **Enterprise Context Management Framework for Context Engineering at Scale**

> Foundation for **systematic context engineering** across the enterprise. Define strategy, initiatives, digital products, offline operations, and organizational processes with TypeScript decorators—creating engineered, AI-comprehensible context.

### Key Principles

1. **Context is Valuable** - Aabha decorators capture business logic, tribal knowledge, and domain expertise as structured, executable code

2. **AI Comprehension** - Well-structured context enables AI assistants to understand business domains and generate accurate implementations

3. **Token Efficiency** - Good context provides maximum business meaning in minimum tokens (80-90% reduction in AI interaction costs)

4. **Traceability** - Descriptions connect strategy → initiatives → journeys → code, showing business value

5. **Living Documentation** - Context and code are unified; context evolves with the codebase

### Why This Matters for Rules

When writing rules, remember:

- **Don't say**: "Add documentation for readability"
- **Do say**: "You're losing valuable context! Descriptions capture business logic that AI systems need to generate accurate code"

- **Don't say**: "Follow naming conventions for consistency"
- **Do say**: "Consistent names create high-quality, AI-comprehensible context in your enterprise model"

**Every rule should emphasize the business value of context engineering.**

---

## Rule Anatomy

### File Structure

Each rule file follows this structure:

```typescript
/**
 * [Rule Name] Rule
 *
 * **Why this rule exists:**
 * [Explanation from context engineering perspective]
 *
 * **What it checks:**
 * - [Specific validation 1]
 * - [Specific validation 2]
 *
 * **Examples:**
 * ```typescript
 * // ✅ Good - [Why this is good]
 * @Decorator({ ... })
 *
 * // ❌ Bad - [Why this is bad]
 * @Decorator({ ... })
 * ```
 *
 * @category [category-name]
 */

import type { TSESTree } from '@typescript-eslint/utils';
import { createRule } from '../../utils/create-rule.js';
import { getAabhaDecorators } from '../../utils/decorator-parser.js';

type Options = [{ /* options schema */ }];
type MessageIds = 'messageId1' | 'messageId2';

export const ruleName = createRule<Options, MessageIds>({
  name: 'rule-name',
  meta: {
    type: 'problem', // or 'suggestion' or 'layout'
    docs: {
      description: '[One-line description emphasizing context engineering value]',
    },
    messages: {
      messageId1: '[Error message explaining context engineering impact]',
      messageId2: '[Another error message]',
    },
    schema: [/* JSON schema for options */],
    hasFix: true, // if rule provides auto-fixes
  },
  defaultOptions: [{}],
  create(context) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const decorators = getAabhaDecorators(node);
        if (decorators.length === 0) return;

        // Implementation logic
      },
    };
  },
});
```

### Categories

Rules are organized by category (matching `aabha-plugin-core-rules`):

- `action` - Action validation rules
- `behavior` - Behavior quality & tracing
- `business-initiative` - Initiative validation
- `collaboration` - Collaboration & meeting rules
- `complexity` - Journey complexity limits
- `context` - Context/bounded context validation
- `expectation` - Expectation & SLO rules
- `interaction` - Interaction validation
- `journey` - Journey structure rules
- `metric` - Metric quality & tracking
- `naming` - Naming conventions
- `persona` - Persona validation
- `stakeholder` - Stakeholder management
- `strategy` - Strategy completeness
- `validation` - Schema validation
- `witness` - Test/witness validation

---

## Documentation Standards

### Header Comment Structure

Every rule must have a comprehensive header comment with three sections:

#### 1. **Why this rule exists**

Explain the rule from the **context engineering perspective**. Focus on:

- **Business value** of following the rule
- **AI comprehension** benefits
- **Token efficiency** gains
- **Tribal knowledge** preservation
- **Traceability** improvements

**Template:**

```
**Why this rule exists:**
In Aabha's context engineering framework, [concept] is [value proposition].
[Explanation of how this helps AI systems, preserves knowledge, etc.]

Without [this aspect], [negative consequences for context quality, AI assistance, etc.]
```

**Example:**

```
**Why this rule exists:**
In Aabha's context engineering framework, descriptions are **valuable engineered context**, not
just documentation. Each description adds rich semantic information that:

1. **Enables AI comprehension** - AI assistants use descriptions to understand your business
   domain and generate accurate implementations. Without descriptions, AI must guess intent.

2. **Creates dense context tokens** - A good description provides maximum business context in
   minimum tokens. Instead of verbose explanations in prompts, you engineer context once.

3. **Captures tribal knowledge** - Business logic, timing constraints, edge cases, and domain
   expertise become executable knowledge, not lost tribal wisdom.

Missing descriptions mean lost context. Lost context means reduced AI effectiveness.
```

#### 2. **What it checks**

Bullet list of specific validations the rule performs:

```
**What it checks:**
- [Specific check 1]
- [Specific check 2]
- [Specific check 3]
```

#### 3. **Examples**

Provide clear good/bad examples with explanations:

```typescript
**Examples:**
```typescript
// ✅ Good - [Explain why this is good from context perspective]
@Decorator({
  field: 'value',
  // ...
})

// ❌ Bad - [Explain what context is lost and why]
@Decorator({
  field: 'bad-value'  // Missing X, loses Y context
})
\```
```

**Important**: Examples should show **why** something is good or bad from a context engineering perspective, not just that it violates a rule.

---

## Writing Error Messages

Error messages are critical - they educate developers about context engineering.

### Principles

1. **Explain the context loss** - Don't just state the violation, explain what valuable context is being lost

2. **Emphasize AI impact** - Show how this affects AI comprehension and assistance quality

3. **Provide actionable guidance** - Tell developers exactly what to fix and why it matters

4. **Use context engineering language** - Use terms like "engineered context", "tribal knowledge", "token efficiency"

### Templates

#### For Missing Required Fields

```
"Component '{{name}}' is missing [field] - you're losing valuable context! In Aabha's context
engineering framework, [field] captures [type of knowledge] that AI systems need to [benefit].
Add [field] explaining [what to include]. This engineered context helps AI assistants [outcome]."
```

#### For Empty/Invalid Values

```
"Component '{{name}}' has [issue] - valuable context is being wasted! Context engineering means
capturing [type of knowledge] as structured, AI-readable information. [Current state] means
[consequences]. [Fix guidance]. Good context = better AI assistance."
```

#### For Pattern Violations

```
"Component '{{name}}' doesn't follow [pattern] (must [requirement]). Consistent [aspect] creates
better context for AI systems to understand your business domain and generate accurate code.
Fix [specific issue] to improve context quality."
```

### Good vs Bad Examples

❌ **Bad** (Generic software development):
```
"Component is missing a description field. Add a description."
```

✅ **Good** (Context engineering):
```
"Component 'Send Email' is missing a description - you're losing valuable context! In Aabha's
context engineering framework, descriptions capture business logic, constraints, and domain
knowledge that AI systems need to generate accurate code. Add a description explaining WHAT
this does, WHY it exists, and WHEN it's used. This engineered context helps AI assistants
comprehend your business domain and assists you better."
```

---

## Implementation Patterns

### Pattern 1: Validating Required Fields

```typescript
export const requiredField = createRule<[], 'missingField'>({
  name: 'required-field',
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure fields capture valuable context for AI comprehension',
    },
    messages: {
      missingField: "Component '{{name}}' is missing {{field}} - you're losing valuable context! [Context engineering explanation]",
    },
    schema: [],
    hasFix: true,
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node: TSESTree.ClassDeclaration) {
        const decorators = getAabhaDecorators(node);
        if (decorators.length === 0) return;

        for (const decorator of decorators) {
          const name = decorator.metadata.name as string | undefined;
          const field = decorator.metadata.fieldName as string | undefined;

          if (!field) {
            context.report({
              node: decorator.node,
              messageId: 'missingField',
              data: {
                name: name || 'Unknown',
                field: 'fieldName'
              },
              fix(fixer) {
                // Auto-fix logic to add field
                const arg = decorator.expression.arguments[0];
                if (!arg || arg.type !== 'ObjectExpression') return null;

                // Find insertion point and add field
                // ...
              },
            });
          }
        }
      },
    };
  },
});
```

### Pattern 2: Validating Field Values

```typescript
export const validateFieldValue = createRule<[], 'invalidValue'>({
  name: 'validate-field-value',
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure field values provide meaningful context',
    },
    messages: {
      invalidValue: "Component '{{name}}' has invalid {{field}}: {{value}}. [Why this loses context]",
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
          const fieldValue = decorator.metadata.field as string | undefined;

          if (fieldValue && !isValid(fieldValue)) {
            context.report({
              node: decorator.node,
              messageId: 'invalidValue',
              data: {
                name: decorator.metadata.name as string || 'Unknown',
                field: 'field',
                value: fieldValue
              },
            });
          }
        }
      },
    };
  },
});

function isValid(value: string): boolean {
  // Validation logic
  return true;
}
```

### Pattern 3: Auto-Fix with Indentation Detection

When adding fields, respect existing code formatting:

```typescript
fix(fixer) {
  const arg = decorator.expression.arguments[0];
  if (!arg || arg.type !== 'ObjectExpression') return null;

  // Find a reference property for indentation
  const refProperty = arg.properties.find(
    (p) => p.type === 'Property' &&
           p.key.type === 'Identifier' &&
           p.key.name === 'name'
  );

  if (!refProperty || refProperty.type !== 'Property') return null;

  // Detect indentation from the reference property
  const indentation = detectObjectPropertyIndentation(context.sourceCode, refProperty);
  const insertPosition = refProperty.range[1];

  return fixer.insertTextAfterRange(
    [insertPosition, insertPosition],
    `,\n${indentation}newField: 'value'`
  );
}
```

### Pattern 4: Filtering by Decorator Type

Some rules only apply to specific decorator types:

```typescript
for (const decorator of decorators) {
  // Only validate @Action decorators
  if (decorator.type !== 'Action') continue;

  // Validation logic specific to Actions
  const action = decorator.metadata as ActionMetadata;
  // ...
}
```

---

## Testing Rules

### Test Structure

Each rule should have comprehensive tests in a `.test.ts` file:

```typescript
import { RuleTester } from '@typescript-eslint/rule-tester';
import { ruleName } from './rule-name';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('rule-name', ruleName, {
  valid: [
    {
      code: `
        @Decorator({
          name: 'Valid Example',
          field: 'valid-value'
        })
        class ValidComponent {}
      `,
    },
  ],
  invalid: [
    {
      code: `
        @Decorator({
          name: 'Invalid Example'
          // Missing field
        })
        class InvalidComponent {}
      `,
      errors: [
        {
          messageId: 'missingField',
          data: {
            name: 'Invalid Example',
            field: 'field'
          },
        },
      ],
      output: `
        @Decorator({
          name: 'Invalid Example',
          field: 'TODO: Add value'
        })
        class InvalidComponent {}
      `,
    },
  ],
});
```

### Test Cases to Include

1. **Valid cases** - Examples that pass the rule
2. **Invalid cases** - Examples that violate the rule
3. **Auto-fix cases** - If rule has fixes, test the output
4. **Edge cases** - Empty values, special characters, boundary conditions
5. **Multiple decorators** - Ensure rule handles multiple decorators on same class

---

## Examples

### Example 1: `required-description`

This rule ensures all components have descriptions to capture valuable context.

**Location**: `src/rules/naming/required-description.ts`

**Key Features**:
- Checks for missing or empty descriptions
- Provides auto-fix that inserts `description: 'TODO: Add proper description'`
- Uses indentation detection to match file formatting
- Error messages emphasize context engineering value

**Message Example**:
```
"Component 'Send Email' is missing a description - you're losing valuable context! In Aabha's
context engineering framework, descriptions capture business logic, constraints, and domain
knowledge that AI systems need to generate accurate code. Add a description explaining WHAT
this does, WHY it exists, and WHEN it's used."
```

### Example 2: `component-naming-convention`

This rule enforces naming patterns to create consistent, AI-comprehensible context.

**Location**: `src/rules/naming/component-naming-convention.ts`

**Key Features**:
- Validates name pattern (capital letter, letters/numbers/spaces/hyphens only)
- Checks optional min/max length
- Provides auto-fix for lowercase first letter
- Configurable via options

**Message Example**:
```
"Component name 'userJourney' doesn't follow Aabha naming conventions (must start with capital
letter). Consistent names create better context for AI systems to understand your business
domain and generate accurate code. Fix the name to improve context quality."
```

---

## Common Patterns

### Getting Decorator Metadata

```typescript
const decorators = getAabhaDecorators(node);
if (decorators.length === 0) return;

for (const decorator of decorators) {
  const name = decorator.metadata.name as string | undefined;
  const description = decorator.metadata.description as string | undefined;

  // Access other fields
  const field = decorator.metadata.fieldName as FieldType | undefined;
}
```

### Checking Decorator Type

```typescript
// Check if specific decorator type
if (decorator.type === 'Action') {
  // Action-specific logic
}

// Or filter decorators by type
const actionDecorators = decorators.filter(d => d.type === 'Action');
```

### Reporting Errors

```typescript
context.report({
  node: decorator.node,  // AST node for error location
  messageId: 'errorMessageId',  // Defined in meta.messages
  data: {  // Template variables for message
    name: 'Component Name',
    field: 'fieldName',
    value: 'actualValue'
  },
  fix(fixer) {  // Optional auto-fix
    return fixer.insertTextAfter(node, 'text to insert');
  },
});
```

### Auto-Fix Helpers

```typescript
// Insert text after a node
fixer.insertTextAfter(node, ', newField: "value"')

// Insert text at specific range
fixer.insertTextAfterRange([start, end], 'text')

// Replace text
fixer.replaceText(node, 'replacement')

// Replace text in range
fixer.replaceTextRange([start, end], 'replacement')
```

---

## Quick Reference Checklist

When creating a new rule, ensure you:

- [ ] Header comment explains "Why this exists" from context engineering perspective
- [ ] "What it checks" section lists specific validations
- [ ] Examples show good/bad with context engineering explanations
- [ ] Error messages emphasize business value and AI impact
- [ ] Error messages use context engineering language
- [ ] Rule uses `getAabhaDecorators()` helper
- [ ] Rule exports using `createRule()` helper
- [ ] Auto-fixes (if any) respect indentation
- [ ] Tests cover valid, invalid, and edge cases
- [ ] File follows naming convention: `kebab-case.ts`
- [ ] Export uses camelCase: `export const ruleName = ...`

---

## Resources

- **Aabha README**: `/packages/aabha/README.md` - Understand context engineering philosophy
- **Core Rules**: `/packages/aabha-plugin-core-rules/src/rules` - Reference implementations
- **Existing ESLint Rules**: `/packages/eslint-plugin-aabha/src/rules` - Working examples
- **Utilities**: `/packages/eslint-plugin-aabha/src/utils` - Helper functions

---

## Getting Help

If you're unsure about:

- **Context engineering philosophy**: Read the Aabha README and AI primer docs
- **Rule implementation**: Look at existing rules in this plugin
- **TypeScript ESLint APIs**: Check [@typescript-eslint/utils documentation](https://typescript-eslint.io/developers/custom-rules)
- **Testing**: See existing `.test.ts` files for patterns

Remember: **Context is valuable. Rules should help engineers create better context, not just enforce arbitrary standards.**
