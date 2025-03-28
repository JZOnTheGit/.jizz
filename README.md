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
- Comprehensive array operations with built-in methods
- **Ternary operator for concise conditional expressions**
- **JizzMath module with mathematical functions and constants**
- **Full support for negative numbers**
- **Error handling with try-catch and throw**

## Array Operations

JIZZ provides a comprehensive set of array operations that let you manipulate arrays with ease. These operations are designed to be familiar to developers coming from other languages, while maintaining the JIZZ philosophy.

### Creating and Accessing Arrays

```javascript
// Create an array
let numbers = [1, 2, 3, 4, 5];

// Access elements by index
let firstElement = numbers[0];  // 1
let lastElement = numbers[4];   // 5

// Modify elements
numbers[2] = 99;
buss(numbers);  // [1, 2, 99, 4, 5]

// Get array length
let length = arrayLength(numbers);  // 5
```

### Array Manipulation Methods

JIZZ provides the following methods for array manipulation:

#### `push(array, element1, element2, ...)`
Adds one or more elements to the end of an array and returns the new length.

```javascript
let arr = [1, 2, 3];
push(arr, 4);          // Adds a single element
buss(arr);             // [1, 2, 3, 4]

push(arr, 5, 6, 7);    // Add multiple elements
buss(arr);             // [1, 2, 3, 4, 5, 6, 7]
```

#### `pop(array)`
Removes the last element from an array and returns that element.

```javascript
let arr = [1, 2, 3, 4];
let last = pop(arr);   // Removes and returns 4
buss(arr);             // [1, 2, 3]
```

#### `shift(array)`
Removes the first element from an array and returns that element.

```javascript
let arr = [1, 2, 3];
let first = shift(arr);  // Removes and returns 1
buss(arr);               // [2, 3]
```

#### `unshift(array, element1, element2, ...)`
Adds one or more elements to the beginning of an array and returns the new length.

```javascript
let arr = [3, 4, 5];
unshift(arr, 1, 2);    // Adds elements to the beginning
buss(arr);             // [1, 2, 3, 4, 5]
```

#### `join(array, separator)`
Joins all elements of an array into a string using the specified separator.

```javascript
let arr = ["Hello", "JIZZ", "World"];
let str = join(arr, " ");     // Joins with space
buss(str);                    // "Hello JIZZ World"

let csv = join(arr, ",");     // Joins with comma
buss(csv);                    // "Hello,JIZZ,World"
```

#### `includes(array, element)`
Determines whether an array includes a certain element, returning a boolean value.

```javascript
let arr = [10, 20, 30, 40];
let hasValue = includes(arr, 30);   // frfr
let noValue = includes(arr, 50);    // cap
```

#### `reverse(array)`
Reverses an array in place and returns the array.

```javascript
let arr = [1, 2, 3, 4, 5];
reverse(arr);
buss(arr);   // [5, 4, 3, 2, 1]
```

### Complex Array Operations

JIZZ arrays can be used for more complex operations like:

#### Multidimensional Arrays
```javascript
// 2D array (matrix)
let matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

// Access nested elements
let element = matrix[1][2];   // 6

// Modify nested elements
matrix[0][2] = 30;
```

#### Arrays of Objects
```javascript
// Array of person objects
let people = [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 },
    { name: "Charlie", age: 35 }
];

// Access object properties in arrays
buss(people[1].name);   // "Bob"

// Modify object properties
people[0].age = 31;
```

#### Dynamic Arrays
```javascript
// Create an empty array and add elements dynamically
let dynamicArray = [];
push(dynamicArray, "first");
push(dynamicArray, "second");

// Create sparse arrays (with gaps)
let sparse = [];
sparse[0] = 10;
sparse[5] = 50;
buss(sparse);  // [10, undefined, undefined, undefined, undefined, 50]
```

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

// Escape sequences in strings
buss("Line 1\nLine 2");  // Outputs two lines
buss("Name:\tJohn");     // Outputs with tab spacing
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


// Define the function referenced above
typeshii functionShouldNotRun() {
    buss("This function should not run!");
    return "Function ran";
}
```

### Ternary Operator

JIZZ supports the conditional (ternary) operator for concise conditional expressions:

```javascript
// Basic ternary syntax
let max = a > b ? a : b;

// Nested ternary for multiple conditions
let message = age < 18 ? "Minor" : age < 65 ? "Adult" : "Senior";

// With function calls
let greeting = hasPermission ? getVIPMessage() : getRegularMessage();

// Custom absolute value function using ternary
typeshii abs(n) {
    return n < 0 ? -n : n;
}
```

### Negative Numbers

JIZZ fully supports negative numbers in all contexts:

```javascript
// Basic negative numbers
let a = -10;
buss("Negative value:", a);

// Expressions with negative numbers
let result = 5 + -3;  // 2
let product = -4 * 3;  // -12

// Nested negation
let doubleNegative = -(-5);  // 5

// Functions with negative numbers
typeshii negate(num) {
    return -num;
}
buss(negate(7));  // -7
```

### JizzMath Module

JIZZ provides a comprehensive math library through the JizzMath module:

```javascript
// Constants
buss(JizzMath.PI);  // 3.141592653589793
buss(JizzMath.E);   // 2.718281828459045

// Rounding functions
buss(JizzMath.floor(5.7));  // 5
buss(JizzMath.ceil(5.2));   // 6
buss(JizzMath.round(5.5));  // 6

// Absolute value
buss(JizzMath.abs(-10));  // 10

// Square root and powers
buss(JizzMath.sqrt(16));    // 4
buss(JizzMath.pow(2, 3));   // 8

// Min and max functions
buss(JizzMath.min(3, 7, 2, 9));  // 2
buss(JizzMath.max(3, 7, 2, 9));  // 9

// Random number generation
buss(JizzMath.random());  // Random number between 0 and 1

// Practical example: Pythagorean theorem
typeshii calculateHypotenuse(a, b) {
    return JizzMath.sqrt(JizzMath.pow(a, 2) + JizzMath.pow(b, 2));
}
buss(calculateHypotenuse(3, 4));  // 5
```

### Error Handling with Try-Catch

JIZZ provides robust error handling through try-catch blocks and the throw statement:

```javascript
// Basic try-catch
try {
    // Code that might cause an error
    let result = 10 / 0;
    buss("This won't execute if an error occurs");
} catch (error) {
    // Handle the error
    buss("An error occurred:", error);
}

// Throwing custom errors
try {
    let age = -5;
    if (age < 0) {
        throw "Age cannot be negative";
    }
    buss("Age is valid:", age);
} catch (e) {
    buss("Validation error:", e);
}

// Try-catch with functions
typeshii divideNumbers(a, b) {
    try {
        if (b === 0) {
            throw "Division by zero is not allowed";
        }
        return a / b;
    } catch (error) {
        return "Error: " + error;
    }
}

buss(divideNumbers(10, 2));  // 5
buss(divideNumbers(10, 0));  // "Error: Division by zero is not allowed"

// Nested try-catch blocks
try {
    buss("Outer try block");
    try {
        buss("Inner try block");
        throw "Inner error";
    } catch (innerError) {
        buss("Caught inner error:", innerError);
        // Rethrow or throw a new error
        throw "Rethrown from inner catch";
    }
} catch (outerError) {
    buss("Caught in outer catch:", outerError);
}

// Try-catch with objects
try {
    throw { code: 404, message: "Not found" };
} catch (objError) {
    buss("Error code:", objError.code);
    buss("Error message:", objError.message);
}
```

