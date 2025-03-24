# Contributing to JIZZ

Thank you for your interest in contributing to JIZZ! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/jizz-lang.git
   cd jizz-lang
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Run tests:
   ```bash
   npm test
   ```

## Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Add tests for any new functionality
4. Run tests to ensure everything works
5. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Create a Pull Request

## Code Style Guidelines

- Use 4 spaces for indentation
- Follow TypeScript best practices
- Add comments for complex logic
- Update documentation for API changes
- Include tests for new features

## Testing

- Write tests for new features
- Update existing tests when modifying features
- Ensure all tests pass before submitting PR
- Test in both REPL and file execution modes

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new functions
- Update example code if needed
- Document breaking changes

## Questions?

Feel free to open an issue for:
- Questions about contributing
- Feature discussions
- Bug reports
- Documentation improvements

Thank you for contributing to JIZZ! 