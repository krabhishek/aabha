# Contributing to Aabha

Thank you for your interest in contributing to Aabha! We welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Documentation Contributions](#documentation-contributions)
- [Code Contributions](#code-contributions)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

**Examples of behavior that contributes to a positive environment:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior:**
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

## How Can I Contribute?

### 🎯 High-Priority Contribution Areas

We especially welcome contributions in these areas:

#### 1. **Documentation** (Highest Priority!)

We have **50+ documentation files** marked "In Progress" waiting for community input:

**API Reference Documentation** (`docs/api/decorators/`):
- [ ] @Context - Define perspectives/domains
- [ ] @Persona - Define user archetypes
- [ ] @Stakeholder - Persona × Context combinations
- [ ] @Metric - Measurable outcomes
- [ ] @BusinessInitiative - Concrete initiatives
- [ ] @Journey - User experience flows
- [ ] @Milestone - Business achievements
- [ ] @Step - Granular actions
- [ ] @Expectation - Stakeholder expectations
- [ ] @Behavior - System behaviors
- [ ] @Test - Verification tests
- [ ] @Attribute - Reusable attributes
- [ ] @Witness - Observers and auditors

**Guides** (`docs/guides/`):
- [ ] Understanding Contexts - Master the context concept
- [ ] Product Completeness - Achieve full coverage
- [ ] Designing Product Strategy
- [ ] Mapping User Journeys
- [ ] Defining Stakeholders and Personas
- [ ] Working with Metrics
- [ ] Type Safety Patterns
- [ ] One-Way Hierarchy Principle

**OgPgy Bank Examples** (`docs/examples/ogpgy-bank/`):
- [ ] Digital Transformation Strategy
- [ ] Contexts and Stakeholders (show all Persona × Context combinations)
- [ ] Instant Account Opening Initiative
- [ ] Mobile Onboarding Journey
- [ ] Funds Transfer Journey
- [ ] Compliance Workflow
- [ ] Metrics and KPIs
- [ ] Completeness Analysis

**Best Practices** (`docs/best-practices/`):
- [ ] Naming Conventions
- [ ] Organizing Large Models
- [ ] File Structure
- [ ] Reusability Patterns
- [ ] Testing Strategies
- [ ] Version Control Workflows

**Reference Materials** (`docs/reference/`):
- [ ] Architecture deep dive
- [ ] Hierarchy diagrams (visual)
- [ ] Glossary completion
- [ ] FAQ expansion
- [ ] Troubleshooting guide

#### 2. **Examples & Case Studies**

- Real-world product models from your organization
- Industry-specific examples (healthcare, finance, e-commerce, SaaS)
- Complete stakeholder matrices
- Multi-context journey examples

#### 3. **Code Improvements**

- Bug fixes
- Performance improvements
- Additional decorator options
- Type safety enhancements
- Better error messages

#### 4. **Tooling & Integration**

- VS Code extension for Aabha
- ESLint plugin for Aabha patterns
- CLI tools for model validation
- Visualization tools (generate diagrams from models)
- AI assistant integrations

## Documentation Contributions

### Finding Documentation to Complete

All incomplete documentation files are marked with:

```markdown
> **📝 Documentation In Progress**
>
> This guide is currently being developed. We welcome contributions!
```

### Documentation Structure

Each API reference should include:

1. **Overview** - What it does, why it matters
2. **Import** - How to import
3. **Parameters** - Complete parameter reference with types
4. **Examples** - 2-3 real-world examples (use OgPgy Bank characters)
5. **Common Patterns** - Typical usage patterns
6. **Validation Rules** - What TypeScript enforces
7. **Best Practices** - Do's and don'ts
8. **See Also** - Links to related docs

### OgPgy Bank Examples

When creating examples, use characters from `examples/ogpgy-bank/BACKSTORY.md`:

**Characters to use:**
- **Zara Ahmed** - University student (customer persona)
- **Maria Santos** - Working mother (customer persona)
- **Dr. Kenji Yamamoto** - Chief Compliance Officer
- **Raj Patel** - CTO
- **Sarah Nakamura** - CEO
- **Amara Williams** - CISO

**Contexts to demonstrate:**
- Customer Onboarding
- KYC Compliance
- Risk Management
- Security
- Audit
- Operations
- Support

### Example: Good API Documentation

See `docs/api/decorators/strategy.md` for a complete example of well-documented API reference.

## Code Contributions

### Areas for Code Contributions

1. **New Decorators** - If you identify a gap in the hierarchy
2. **Decorator Options** - Additional configuration options
3. **Type Utilities** - Helper types for better DX
4. **Validation** - Improved compile-time checks
5. **Error Messages** - Clearer error messages

### Code Style

- Follow existing TypeScript conventions
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Include type annotations
- Write tests for new functionality

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- TypeScript 5.0+

### Setup Steps

1. **Fork the repository**

   Visit [github.com/krabhishek/aabha](https://github.com/krabhishek/aabha) and click "Fork"

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/aabha.git
   cd aabha
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Build the project**

   ```bash
   pnpm run build
   ```

5. **Run type checking**

   ```bash
   pnpm run typecheck
   ```

6. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b docs/api-context-decorator
   ```

### Project Structure

```
aabha/
├── src/                    # Source code
│   ├── decorators/         # All decorator implementations
│   ├── types/              # TypeScript types
│   ├── enums/              # Enum definitions
│   └── index.ts            # Main export
├── docs/                   # Documentation
│   ├── getting-started/    # Getting started guides
│   ├── api/                # API reference
│   ├── guides/             # How-to guides
│   ├── examples/           # Examples
│   ├── best-practices/     # Best practices
│   └── reference/          # Reference materials
├── examples/               # Example code
│   └── ogpgy-bank/         # OgPgy Bank case study
├── ARCHITECTURE.md         # Architecture documentation
├── CHANGELOG.md            # Version history
└── package.json
```

## Pull Request Process

### 1. Make Your Changes

- Write clear, concise code/documentation
- Follow existing patterns and style
- Test your changes (if code)
- Update relevant documentation (if code changes)

### 2. Commit Your Changes

Use clear commit messages:

```bash
# Good commit messages:
git commit -m "docs: complete @Context API reference with OgPgy examples"
git commit -m "docs: add Understanding Contexts guide"
git commit -m "feat: add optional priority parameter to @Expectation"
git commit -m "fix: correct type inference for nested stakeholders"

# Commit message format:
# <type>: <description>
#
# Types:
# - docs: Documentation changes
# - feat: New features
# - fix: Bug fixes
# - refactor: Code refactoring
# - test: Test additions/changes
# - chore: Build/tooling changes
```

### 3. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 4. Create Pull Request

1. Go to the [Aabha repository](https://github.com/krabhishek/aabha)
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill in the PR template:

```markdown
## Description

Brief description of your changes.

## Type of Change

- [ ] Documentation
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Example/case study

## Checklist

- [ ] I have read the CONTRIBUTING.md guide
- [ ] My code/docs follow the project style
- [ ] I have tested my changes (if applicable)
- [ ] I have updated relevant documentation (if code changes)
- [ ] My commits have clear messages
- [ ] I have added myself to contributors (optional)

## Related Issues

Closes #(issue number)
```

### 5. Code Review

- Maintainers will review your PR
- Address any feedback
- Once approved, it will be merged

## Style Guidelines

### Documentation Style

**Markdown:**
- Use proper heading hierarchy (# → ## → ###)
- Include code fences with language (```typescript)
- Use tables for structured data
- Add links to related documentation
- Include "See Also" sections

**Tone:**
- Professional but friendly
- Clear and concise
- Use examples liberally
- Avoid jargon (or explain it)

**Examples:**
- Use OgPgy Bank characters
- Show complete, runnable code
- Include comments explaining key points
- Demonstrate both ✅ good and ❌ bad patterns

### Code Style

**TypeScript:**
```typescript
// Use descriptive names
@Strategy({
  name: 'Digital-First Banking',  // Clear, descriptive
  whereToPlay: ['Young adults'],
  howToWin: 'Fastest onboarding'
})
class DigitalFirstStrategy {}  // Class name matches concept

// Add JSDoc for public APIs
/**
 * Defines a business strategy with WHERE to play and HOW to win.
 *
 * @example
 * ```typescript
 * @Strategy({
 *   name: 'Market Leadership',
 *   whereToPlay: ['Enterprise', 'SMB'],
 *   howToWin: 'Best developer experience'
 * })
 * class MarketLeadershipStrategy {}
 * ```
 */
export function Strategy(options: StrategyOptions) {
  // Implementation
}
```

**File Naming:**
- Use kebab-case for files: `context.decorator.ts`
- Use PascalCase for classes: `DigitalFirstStrategy`
- Match decorator names: `@Context` → `context.decorator.ts`

## Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributors page (coming soon)

## Questions?

- **Documentation questions**: Open an issue with label `documentation`
- **Code questions**: Open an issue with label `question`
- **General discussion**: Use [GitHub Discussions](https://github.com/krabhishek/aabha/discussions)

## License

By contributing to Aabha, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Aabha!** 🙏

Every contribution, no matter how small, helps make product management more systematic and AI-assisted development more efficient.

The aura of a great product comes from clarity, and your contributions help bring clarity to product management everywhere.
