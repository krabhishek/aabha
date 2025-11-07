---
name: Bug Report
about: Report a bug or unexpected behavior
title: '[BUG] '
labels: 'bug'
assignees: ''
---

## Component

<!-- Select the component this bug report is for -->

- [ ] **aabha** - Core Aabha framework (decorators, types, core functionality)
- [ ] **eslint-plugin-aabha** - ESLint plugin and validation rules

## Bug Description

<!-- A clear and concise description of what the bug is -->

## To Reproduce

Steps to reproduce the behavior:

1.
2.
3.
4.

## Expected Behavior

<!-- What you expected to happen -->

## Actual Behavior

<!-- What actually happened -->

## Code Example

<!-- Provide a minimal code example that reproduces the issue -->

```typescript
import { Strategy, BusinessInitiative } from 'aabha';

@Strategy({
  name: 'Example Strategy',
  whereToPlay: ['Market A'],
  howToWin: 'Best product'
})
class ExampleStrategy {}

// Code that causes the bug...
```

## Error Message

<!-- If applicable, paste the full error message -->

```
Paste error message here
```

## Environment

- **Aabha Version**: [e.g., 1.0.0]
- **TypeScript Version**: [e.g., 5.0.2]
- **Node Version**: [e.g., 18.16.0]
- **Package Manager**: [e.g., pnpm 8.6.0]
- **Operating System**: [e.g., macOS 13.4, Windows 11, Ubuntu 22.04]
- **IDE**: [e.g., VS Code 1.80.0]

## TypeScript Configuration

<!-- Paste relevant parts of your tsconfig.json -->

```json
{
  "compilerOptions": {
    "target": "ES2022",
    // ... other options
  }
}
```

## Additional Context

<!-- Add any other context about the problem here -->

## Possible Solution

<!-- If you have suggestions on how to fix the bug, describe them here -->

## Workaround

<!-- If you found a temporary workaround, share it here to help others -->
