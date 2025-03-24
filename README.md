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
- Logical operators (AND, OR, NOT) with short-circuit evaluation
- Comparison operators for complex conditions
- Array support with numeric indices

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
fn functionShouldNotRun() {
    buss("This function should not run!");
    return "Function ran";
}
```

### Loops (BrainRot Edition)

```