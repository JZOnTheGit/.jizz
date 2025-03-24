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

# Update to latest version
npm update -g jizz-lang
```

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
fn add(a, b) {
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

### Loops (BrainRot Edition)

```javascript
// Skibidi loop (instead of while loop)
let count = 1;
skibidi (count <= 5) {
    buss("Count:", count);
    count = count + 1;
}

// Too loop (instead of for loop)
too (let i = 0; i < 5; i = i + 1) {
    buss("Iteration:", i);
}

// Nested loops
too (let i = 1; i <= 3; i = i + 1) {
    too (let j = 1; j <= 3; j = j + 1) {
        buss(i, "x", j, "=", i * j);
    }
}

// Loop with user input
let total = 0;
let num = int(ask("Enter a number (0 to stop): "));
skibidi (num != 0) {
    total = total + num;
    num = int(ask("Enter a number (0 to stop): "));
}
buss("Sum:", total);
```

## Why JIZZ with BrainRot Syntax?

- **Entertaining:** Makes programming sessions more fun and engaging
- **Memorable:** Unusual syntax makes code patterns more memorable
- **Educational:** Great for teaching programming concepts with humor
- **Conversation Starter:** Share your JIZZ code and get reactions
- **Stress Relief:** Coding with meme language reduces stress

## Error Handling

JIZZ provides clear error messages with line numbers:

```
Error at line 5: Unterminated string literal
Error at line 8: Missing semicolon after variable declaration
Error at line 12: Cannot resolve variable as it's not defined
```

## Development

To build from source:

```bash
git clone https://github.com/yourusername/jizz-lang.git
cd jizz-lang
npm install
npm run build
```

Run tests:

```bash
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.