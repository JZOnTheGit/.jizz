# JIZZ Brainrot Syntax Highlighter

This extension provides syntax highlighting and custom file icons for the JIZZ programming language in Visual Studio Code.

## Features

- Syntax highlighting for JIZZ code files (.jizz)
- Custom file icons for .jizz files in the file explorer
- Support for JIZZ-specific keywords like `frfr`, `cap`, `typeshii`, `skibidi`, `too`, and `buss`
- Proper highlighting for strings, numbers, and comments
- Bracket matching for easier code navigation

## Installation Methods

### Option 1: Install via Marketplace (recommended)
1. Open VS Code
2. Click the Extensions icon in the sidebar (or press Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "JIZZ Brainrot"
4. Click "Install"

Or use the command palette (Ctrl+P / Cmd+P) and type:
```
ext install JasstejSingh.jizz-language
```

### Option 2: Install via Command Line
If you've installed the JIZZ language package globally:
```bash
jizz vscode
```

## Using File Icons

After installation, your .jizz files will have a custom icon in the file explorer. To enable the custom icon theme:

1. Go to File → Preferences → File Icon Theme (or Code → Preferences → File Icon Theme on macOS)
2. Select "JIZZ Icons" from the list

## About JIZZ Language

JIZZ is a modern programming language with unique "brainrot" syntax inspired by internet culture and memes:

- Use `frfr` instead of `true` (for real for real)
- Use `cap` instead of `false` (that's cap/no cap)
- Use `skibidi` instead of `while` for loops
- Use `too` instead of `for` in loop constructs
- Use `buss` for printing to console (bussin')
- Use `typeshii` for function declarations

## Installing the JIZZ Language

To write and run JIZZ code, install the JIZZ language package:

```bash
# Install globally via npm
npm install -g jizz-lang

# Run a JIZZ file
jizz run your-file.jizz

# Start the JIZZ REPL
jizz repl
```

For more information, visit [the JIZZ GitHub Repository](https://github.com/JZOnTheGit/.jizz) 