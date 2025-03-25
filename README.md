# JIZZ Programming Language

[![npm version](https://img.shields.io/npm/v/jizz-lang.svg)](https://www.npmjs.com/package/jizz-lang)
[![npm downloads](https://img.shields.io/npm/dm/jizz-lang.svg)](https://www.npmjs.com/package/jizz-lang)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

```
     ██╗██╗███████╗███████╗
     ██║██║╚══███╔╝╚══███╔╝
     ██║██║  ███╔╝   ███╔╝ 
██   ██║██║ ███╔╝   ███╔╝  
╚█████╔╝██║███████╗███████╗
 ╚════╝ ╚═╝╚══════╝╚══════╝
```

JIZZ is a modern programming language designed for developers with a sense of humor and a flair for the unconventional. With its unique "brainrot" syntax inspired by internet culture and memes, JIZZ offers a refreshing and entertaining approach to coding while maintaining powerful functionality.

## BrainRot Philosophy

JIZZ embraces the "brainrot" philosophy, replacing traditional programming terms with internet slang and meme-inspired keywords:

- Use `frfr` instead of `true` (for real for real)
- Use `cap` instead of `false` (that's cap/no cap)
- Use `skibidi` instead of `while` for loops
- Use `too` instead of `for` in loop constructs
- Use `buss` for printing to console (bussin')

These unconventional keywords make JIZZ code instantly recognizable and add a layer of humor to your programming experience.

## Quick Start

```bash
# Install globally
npm install -g jizz-lang

# Run a file
jizz run your-file.jizz

# Start REPL
jizz repl

# View examples
jizz examples

# Install VSCode syntax highlighting
jizz vscode

# Update to latest version
npm update -g jizz-lang
```

## VSCode Syntax Highlighting

Make your JIZZ code pop with our official "JIZZ Brainrot Syntax Highlighter" extension for Visual Studio Code.

### Option 1: Install via Marketplace (recommended)
1. Open VS Code
2. Click the Extensions icon in the sidebar (or press Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "JIZZ Brainrot"
4. Click "Install" on the "JIZZ Brainrot Syntax Highlighter" by JasstejSingh

Or just run this command in VS Code:
```
ext install JasstejSingh.jizz-language
```

### Option 2: Install via Command Line
If you've installed JIZZ globally:
```bash
jizz vscode
```

The extension provides:
- Syntax highlighting for all JIZZ keywords (`frfr`, `cap`, `typeshii`, etc.)
- Custom file icons for .jizz files in the file explorer
- Proper color-coding for strings, numbers, and comments
- Bracket matching and code folding

To enable the custom file icons:
1. Go to File → Preferences → File Icon Theme (or Code → Preferences → File Icon Theme on macOS)
2. Select "JIZZ Icons" from the list

![JIZZ Syntax Highlighting](https://raw.githubusercontent.com/JZOnTheGit/.jizz/main/assets/vscode-syntax.png)

## Features

- Meme-inspired syntax for maximum entertainment
- Strong type inference
- Built-in string manipulation functions
- Interactive REPL environment
- Detailed error messages with line numbers
- Function declarations and calls
- If-else statements with elif support
- Variables and constants
- Object literals with property access
- Rich standard library
- Custom boolean keywords (`frfr` for true, `cap` for false)
- Custom loop constructs (`skibidi` and `too` loops)
- User input with ask() function
- Type conversion functions (int, str)
- Logical operators (AND, OR, NOT) with short-circuit evaluation
- Comparison operators for complex conditions
- Array support with numeric indices

## Development

If you want to contribute to JIZZ or build it from source, follow these steps:

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Setting Up the Development Environment

```bash
# Clone the repository
git clone https://github.com/JZOnTheGit/.jizz.git
cd .jizz

# Install dependencies
npm install

# Build the project (TypeScript compilation)
npm run build

# Build everything (TypeScript, VSCode extension, run tests)
npm run build-all
```

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run clean` - Remove build artifacts
- `npm test` - Run test suite
- `npm run build-all` - Complete build process including VSCode extension
- `npm run package-vscode` - Package the VSCode extension
- `npm run vscode-install` - Install the VSCode extension locally

### Testing Your Changes

After making changes, you can run the tests to ensure everything works:

```bash
npm test
```

Or test a specific JIZZ file:

```bash
npm run build && node dist/src/cli.js run your-test-file.jizz
```


## Language Features

### Variables and Constants

```javascript
let x = 10;
const PI = 3.14159;

// Booleans use frfr and cap
let isValid = frfr;  // true
let isFake = cap;    // false

if (isValid == frfr) {
    buss("This is frfr!");
}
```

### String Operations

```javascript
let name = "John";
let greeting = "Hello, " + name + "!";
buss(greeting);  // Output: Hello, John!

// String methods
buss(String_length(greeting));      // Output: 12
buss(String_toUpperCase(greeting)); // Output: HELLO, JOHN!
buss(String_substring(greeting, 0, 5)); // Output: Hello
```

### Objects

```javascript
let person = {
    name: "John",
    age: 30,
    isStudent: cap,
    city: "New York"
};
buss(person);  // Output: { name: "John", age: 30, isStudent: false, city: "New York" }
```

### Functions

```javascript
typeshii add(a, b) {
    let result = a + b;
    buss("Sum is:", result);
    return result;
}

add(5, 3);  // Output: Sum is: 8
```

### Control Flow

```javascript
let age = 25;

if (age >= 21) {
    if (age < 30) {
        buss("Young adult");
    } else {
        buss("Adult");
    }
} else {
    buss("Minor");
}

// Using boolean keywords
let canDrive = age >= 16 ? frfr : cap;
if (canDrive == frfr) {
    buss("Can drive!");
}
```

### User Input and Type Conversion

```javascript
// Basic input
let name = ask("What's your name? ");
buss("Hello, " + name + "!");

// Input with type conversion
let age = int(ask("How old are you? "));
if (age >= 18) {
    buss("You're an adult!");
} else {
    buss("You're still young!");
}

// Type conversion examples
let numStr = "42";
let num = int(numStr);      // Convert string to integer
let strNum = str(num);      // Convert number to string
let boolStr = str(frfr);    // Converts to "frfr"
let capStr = str(cap);      // Converts to "cap"
```

### Logical Operators

```javascript
// NOT operator (!)
let isActive = frfr;
let isInactive = !isActive;  // false
buss("!true =", !isActive);  // Output: !true = false

// AND operator (&&)
let isAdult = frfr;
let hasID = frfr;
let canBuyAlcohol = isAdult && hasID;  // true
buss("Adult AND has ID:", canBuyAlcohol);

// OR operator (||)
let hasTicket = cap;
let isVIP = frfr;
let canEnter = hasTicket || isVIP;  // true
buss("Has ticket OR is VIP:", canEnter);

// Comparison with logical operators
let age = 25;
let height = 180;
if (age > 18 && height > 160) {
    buss("Can ride all attractions!");
}

// Short-circuit evaluation
let result = cap && functionShouldNotRun();  // Function is not called
buss("Short-circuit AND:", result);  // false

result = frfr || functionShouldNotRun();  // Function is not called
buss("Short-circuit OR:", result);  // true
```

// Define the function referenced above
typeshii functionShouldNotRun() {
    buss("This function should not run!");
    return "Function ran";
}
```
