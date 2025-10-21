# TypeScript Configuration

Aabha requires specific TypeScript compiler settings to work correctly.

## Required Configuration

Create or update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",  // or higher
    "module": "ES2022",  // ESM modules
    "moduleResolution": "bundler", // or "node16", "nodenext"
    "strict": true,      // Recommended for type safety

    // IMPORTANT: Do NOT enable these (they're for legacy decorators)
    // "experimentalDecorators": false,  // Must be false or omitted
    // "emitDecoratorMetadata": false,   // Must be false or omitted
  }
}
```

## Why These Settings?

### Stage 3 Decorators (TypeScript 5.0+)

Aabha uses **Stage 3 decorators**, which are the standardized decorators built into TypeScript 5.0+:

- ✅ **Native support** - No need for `experimentalDecorators`
- ✅ **Future-proof** - Following the JavaScript standard
- ✅ **Better performance** - Compile-time only
- ✅ **Type safety** - Full TypeScript type checking

### Common Mistakes

#### ❌ Don't Use Experimental Decorators

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,  // ❌ WRONG - Don't enable this!
    "emitDecoratorMetadata": true    // ❌ WRONG - Don't enable this!
  }
}
```

**Why?** Experimental decorators are a different, older implementation that's incompatible with Aabha.

#### ❌ Don't Use Old ES Targets

```json
{
  "compilerOptions": {
    "target": "ES5"  // ❌ Too old - decorators need ES2022+
  }
}
```

## Full Example Configuration

Here's a complete `tsconfig.json` for an Aabha project:

```json
{
  "compilerOptions": {
    // Language and Environment
    "target": "ES2022",
    "lib": ["ES2022"],

    // Modules
    "module": "ES2022",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,

    // Emit
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",

    // Interop Constraints
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,

    // Type Checking
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    // Completeness
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Compatibility with Existing Projects

### If You're Using Experimental Decorators

Aabha is **not compatible** with projects using `experimentalDecorators: true`.

**Options:**

1. **Separate tsconfig** - Create a separate config for Aabha models:
   ```json
   // tsconfig.aabha.json
   {
     "extends": "./tsconfig.json",
     "compilerOptions": {
       "experimentalDecorators": false
     },
     "include": ["src/product-model/**/*"]
   }
   ```

2. **Migrate** - Consider migrating to Stage 3 decorators (recommended)

3. **Separate package** - Keep Aabha models in a separate npm package

### Mixed Decorator Usage

You **cannot** use both experimental decorators and Stage 3 decorators in the same compilation context.

## Verifying Your Configuration

Run this command to check your TypeScript version:

```bash
tsc --version
```

You should see version 5.0.0 or higher.

### Test Your Setup

Create a test file:

```typescript
// test-config.ts
import { Strategy } from 'aabha';

@Strategy({
  name: 'Config Test',
  whereToPlay: ['Test Market'],
  howToWin: 'Proper configuration'
})
class ConfigTest {}

export { ConfigTest };
```

Compile it:

```bash
tsc test-config.ts
```

If there are **no errors**, your configuration is correct! ✅

## Common Errors and Fixes

### Error: "Decorators are not valid here"

**Cause**: Target is too old (ES5/ES3)

**Fix**: Set `"target": "ES2022"` or higher

### Error: "Experimental support for decorators..."

**Cause**: Using wrong decorator syntax

**Fix**: Remove `experimentalDecorators: true` from tsconfig.json

### Error: "Cannot find module 'aabha'"

**Cause**: Aabha not installed or wrong module resolution

**Fix**:
1. Run `npm install aabha`
2. Set `"moduleResolution": "bundler"` in tsconfig.json

## IDE Support

### VS Code

Aabha works best with:
- **VS Code 1.80+**
- **TypeScript extension** (built-in)
- Ensure workspace is using TypeScript 5.0+

Check your TypeScript version in VS Code:
1. Open a `.ts` file
2. Click TypeScript version in status bar (bottom-right)
3. Select "Select TypeScript Version..." → "Use Workspace Version"

### Other IDEs

- **WebStorm/IntelliJ** - Works with TypeScript 5.0+ plugin
- **Vim/Neovim** - Use CoC or LSP with TypeScript 5.0+
- **Sublime Text** - Use LSP-typescript

## Next Steps

- [Quick Start](./quick-start.md) - Build your first product model
- [Core Concepts](./core-concepts.md) - Understand the mental model
- [Troubleshooting](../reference/troubleshooting.md) - Solve common issues

---

[← Back: Installation](./installation.md) | [Documentation Home](../README.md) | [Next: Quick Start →](./quick-start.md)
