# Installation

Get started with Aabha in your TypeScript project.

## Prerequisites

- **TypeScript 5.0 or higher** - Aabha uses Stage 3 decorators
- **Node.js 16+** - For running TypeScript compiler
- **npm, yarn, or pnpm** - Package manager

## Install Aabha

Choose your preferred package manager:

### npm

```bash
npm install aabha
```

### yarn

```bash
yarn add aabha
```

### pnpm

```bash
pnpm add aabha
```

## Verify Installation

Create a simple file to test your installation:

```typescript
// test.ts
import { Strategy } from 'aabha';

@Strategy({
  name: 'Test Strategy',
  whereToPlay: ['Market A'],
  howToWin: 'Best product'
})
class TestStrategy {}

console.log('Aabha is installed correctly!');
```

Compile and run:

```bash
tsc test.ts
node test.js
```

You should see: `Aabha is installed correctly!`

## TypeScript Configuration

**Important**: Aabha requires specific TypeScript settings. See [TypeScript Configuration](./typescript-configuration.md) for details.

## Package Contents

When you install Aabha, you get:

- **Decorators**: All product management decorators
- **Types**: TypeScript type definitions
- **Enums**: Utility enums for options
- **Examples**: Real-world examples (in `node_modules/aabha/examples/`)
- **Documentation**: This documentation

## Zero Dependencies

Aabha has **zero runtime dependencies**. It's completely standalone, which means:

- Smaller bundle size
- No dependency conflicts
- Faster installation
- Better security

## Next Steps

- [Quick Start](./quick-start.md) - Build your first product model
- [TypeScript Configuration](./typescript-configuration.md) - Configure your project
- [Core Concepts](./core-concepts.md) - Understand Aabha's philosophy

---

[← Back to Documentation](../README.md) | [Next: Quick Start →](./quick-start.md)
