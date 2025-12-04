# Contributing to NemoCode Studio

Thank you for your interest in contributing to NemoCode Studio! This document provides guidelines and instructions for contributing.

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Rust 1.70+
- Git
- Ollama (for AI features)

### Setup Development Environment

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/NemoCode-Studio.git
   cd NemoCode-Studio
   ```

2. **Install dependencies:**
   ```bash
   cd tauri-shell
   npm install
   ```

3. **Run in development mode:**
   ```bash
   npm run tauri dev
   ```

## 📝 Development Workflow

### Branch Strategy

We use a simple main-branch workflow:

- `main` - Production-ready code
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes:**
   ```bash
   # Frontend
   npm run build
   npm run lint
   
   # Backend
   cd src-tauri
   cargo check
   cargo test
   cargo clippy
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   **Commit Message Format:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

5. **Push and create a Pull Request:**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🎨 Code Style Guidelines

### TypeScript/React

- Use functional components with hooks
- Use TypeScript for type safety
- Follow existing component structure
- Use Zustand for state management
- Keep components focused and reusable

**Example:**
```typescript
interface MyComponentProps {
    title: string;
    onAction: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
    return (
        <div className="p-4">
            <h2>{title}</h2>
            <button onClick={onAction}>Action</button>
        </div>
    );
};
```

### Rust

- Use `Result<T, AppError>` for error handling
- Add logging with `log::info!()`, `log::error!()`, etc.
- Write unit tests for new functionality
- Use `cargo fmt` and `cargo clippy`

**Example:**
```rust
pub fn my_function(input: String) -> Result<String, AppError> {
    log::info!("Processing input: {}", input);
    
    if input.is_empty() {
        return Err(AppError::new(
            ErrorCode::InvalidInput,
            "Input cannot be empty"
        ));
    }
    
    Ok(input.to_uppercase())
}
```

## 🧪 Testing

### Frontend Tests

```bash
npm run test  # Run Jest/Vitest tests
```

### Backend Tests

```bash
cd src-tauri
cargo test
```

## 📚 Documentation

- Update README.md if adding new features
- Add JSDoc comments for complex functions
- Update inline comments for clarity
- Add examples for new APIs

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description** - Clear description of the bug
2. **Steps to Reproduce** - How to reproduce the issue
3. **Expected Behavior** - What should happen
4. **Actual Behavior** - What actually happens
5. **Environment** - OS, Node version, Rust version
6. **Screenshots** - If applicable

## 💡 Feature Requests

We welcome feature requests! Please:

1. Check if the feature already exists or is planned
2. Describe the feature clearly
3. Explain the use case
4. Provide examples if possible

## 📋 Pull Request Process

1. **Ensure CI passes** - All tests and checks must pass
2. **Update documentation** - If needed
3. **Add tests** - For new functionality
4. **Keep PRs focused** - One feature/fix per PR
5. **Respond to feedback** - Address review comments

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] CI passes
- [ ] No merge conflicts
- [ ] Commits are clean and descriptive

## 🏗️ Project Structure

```
tauri-shell/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── hooks/              # Custom hooks
│   ├── stores/             # Zustand stores
│   ├── styles/             # CSS/themes
│   └── utils/              # Utilities
├── src-tauri/              # Rust backend
│   └── src/
│       ├── agent.rs        # AI agent
│       ├── llm.rs          # LLM client
│       ├── rag.rs          # RAG system
│       ├── terminal.rs     # Terminal
│       ├── error.rs        # Errors
│       └── logging.rs      # Logging
└── package.json
```

## 🎯 Areas for Contribution

We especially welcome contributions in:

- 🐛 Bug fixes
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage
- 🌐 Internationalization
- ♿ Accessibility improvements

## 💬 Questions?

Feel free to:
- Open an issue for discussion
- Ask in pull request comments
- Reach out to maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to NemoCode Studio!** 🎉
