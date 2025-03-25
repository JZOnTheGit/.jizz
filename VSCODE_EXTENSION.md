# VSCode Extension for JIZZ Language

This document explains the VSCode extension for the JIZZ programming language and how to install it.

## Overview

The JIZZ VSCode extension provides syntax highlighting for `.jizz` files, making code more readable and easier to work with. It highlights JIZZ-specific keywords like `frfr`, `cap`, `typeshii`, `skibidi`, `too`, and `buss`, as well as standard programming constructs.

## Extension Files

The extension is located in the `vscode-jizz/` directory and consists of:

- `package.json` - Metadata and configuration
- `language-configuration.json` - Language features like comment markers and bracket matching
- `syntaxes/jizz.tmLanguage.json` - TextMate grammar for syntax highlighting
- `README.md` - Documentation for the extension

## Installation Methods

There are several ways to install the JIZZ VSCode extension:

### Method 1: Using the CLI (recommended)

The easiest way to install the extension is through the JIZZ CLI:

```bash
# Install JIZZ globally
npm install -g jizz-lang

# Install the extension
jizz vscode
```

### Method 2: Manual installation

1. Download the `.vsix` file from the repository's releases
2. Open VSCode
3. Press Ctrl+Shift+X (or Cmd+Shift+X on macOS) to open Extensions
4. Click "..." in the top-right and select "Install from VSIX..."
5. Navigate to the downloaded `.vsix` file

## Troubleshooting

### Extension Not Working

If syntax highlighting doesn't appear:

1. Ensure the file has a `.jizz` extension
2. Reload VSCode (Ctrl+Shift+P, then "Developer: Reload Window")
3. Check that the extension is installed (Ctrl+Shift+X, then search for "JIZZ")
4. Try reinstalling the extension: `jizz vscode` 