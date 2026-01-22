# Contributing to @grunnverk/audio-tools

Thank you for considering contributing to audio-tools! This document provides guidelines and instructions for contributing.

## 🎯 Project Goals

This library aims to:
- Provide a simple, intuitive API for audio recording in Node.js
- Support voice-driven development workflows
- Maintain cross-platform compatibility
- Offer excellent TypeScript support
- Keep dependencies minimal and well-maintained

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Git
- A microphone or audio input device (for testing)

### Setup Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/audio-tools.git
   cd audio-tools
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

## 📝 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/my-new-feature
```

Use descriptive branch names:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation only
- `refactor/` - Code refactoring
- `test/` - Test improvements

### 2. Make Your Changes

- Write clear, self-documenting code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Build to check for TypeScript errors
npm run build
```

### 4. Commit Your Changes

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add support for MP3 format"
git commit -m "fix: resolve device selection on Windows"
git commit -m "docs: update API reference for recordAudio"
```

Commit message types:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Build process or auxiliary tool changes

### 5. Push and Create Pull Request

```bash
git push origin feature/my-new-feature
```

Then open a Pull Request on GitHub with:
- Clear description of changes
- Reference to any related issues
- Screenshots/examples if applicable

## 🧪 Testing Guidelines

### Writing Tests

- Place tests in the `tests/` directory
- Mirror the structure of `src/`
- Name test files with `.test.ts` suffix
- Use descriptive test names

Example test structure:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { recordAudio } from '../src/recording';

describe('recordAudio', () => {
  it('should record audio with default settings', async () => {
    // Arrange
    const options = { duration: 10 };

    // Act
    const result = await recordAudio(options);

    // Assert
    expect(result.filePath).toBeDefined();
    expect(result.duration).toBeGreaterThan(0);
  });

  it('should handle recording errors gracefully', async () => {
    // Test error handling
  });
});
```

### Test Coverage

- Aim for >80% code coverage
- Focus on critical paths and edge cases
- Include both happy path and error scenarios
- Mock external dependencies appropriately

## 📚 Documentation Guidelines

### Code Documentation

Use JSDoc comments for all public APIs:

```typescript
/**
 * Record audio from an input device
 *
 * @param options - Recording configuration options
 * @returns Promise resolving to recording result with file path, duration, and size
 * @throws {Error} If recording fails or device is unavailable
 *
 * @example
 * ```typescript
 * const result = await recordAudio({
 *   duration: 60,
 *   sampleRate: 48000
 * });
 * console.log('Recorded:', result.filePath);
 * ```
 */
export async function recordAudio(
  options: RecordingOptions = {}
): Promise<RecordingResult> {
  // Implementation
}
```

### README Updates

When adding features:
- Update the Features section
- Add to API Reference
- Include usage examples
- Update the Quick Start if applicable

### Example Code

- Add runnable examples to `examples/` directory
- Include comments explaining key concepts
- Show error handling
- Demonstrate best practices

## 🎨 Code Style

### TypeScript

- Use TypeScript strict mode
- Provide explicit types for function parameters and returns
- Avoid `any` types when possible
- Use interfaces for object shapes

### Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multiline objects/arrays
- Max line length: 100 characters
- Run `npm run lint:fix` before committing

### Naming Conventions

- **Files**: kebab-case (`audio-device.ts`)
- **Functions**: camelCase (`recordAudio`)
- **Classes**: PascalCase (`CountdownTimer`)
- **Interfaces**: PascalCase (`RecordingOptions`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_DURATION`)

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the issue already exists
2. Verify it's reproducible in the latest version
3. Test on multiple platforms if possible

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Call function X with options Y
2. Observe error Z

**Expected behavior**
What you expected to happen.

**Actual behavior**
What actually happened.

**Environment**
- OS: [e.g., macOS 13.0]
- Node.js version: [e.g., 18.17.0]
- Package version: [e.g., 0.1.8]

**Additional context**
- Error messages
- Stack traces
- Relevant logs
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Feature description**
Clear description of the feature.

**Use case**
Why is this feature needed? What problem does it solve?

**Proposed API**
How would users interact with this feature?

```typescript
// Example usage
const result = await newFeature({
  option: 'value'
});
```

**Alternatives considered**
Other approaches you've thought about.
```

## 🔍 Code Review Process

### What We Look For

- ✅ Code quality and readability
- ✅ Test coverage and quality
- ✅ Documentation completeness
- ✅ TypeScript type safety
- ✅ Error handling
- ✅ Performance considerations
- ✅ Breaking change impact

### Review Timeline

- Most PRs reviewed within 2-3 days
- Simple fixes may be merged faster
- Complex features may require multiple rounds

## 📦 Release Process

Releases are managed by maintainers:

1. Version bump in `package.json`
2. Update `RELEASE_NOTES.md`
3. Create git tag
4. Publish to npm
5. Create GitHub release

## 🤝 Community Guidelines

- Be respectful and constructive
- Help others in discussions
- Share knowledge and experiences
- Report issues clearly and completely
- Acknowledge contributions of others

## 📞 Getting Help

- 💬 GitHub Discussions for questions
- 🐛 GitHub Issues for bugs
- 📧 Email maintainers for security issues

## 🎖️ Recognition

Contributors are recognized in:
- GitHub contributors page
- Release notes
- Project README

Thank you for contributing to @grunnverk/audio-tools! 🎉

