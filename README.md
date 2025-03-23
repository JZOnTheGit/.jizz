# JIZZ Programming Language

```
     ██╗██╗███████╗███████╗
     ██║██║╚══███╔╝╚══███╔╝
     ██║██║  ███╔╝   ███╔╝ 
██   ██║██║ ███╔╝   ███╔╝  
╚█████╔╝██║███████╗███████╗
 ╚════╝ ╚═╝╚══════╝╚══════╝
```

JIZZ is a modern programming language designed for simplicity and expressiveness. It features a clean syntax, powerful string manipulation, and intuitive error messages.

[![npm version](https://badge.fury.io/js/jizz-lang.svg)](https://badge.fury.io/js/jizz-lang)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- Clean and intuitive syntax
- Strong type inference
- Built-in string manipulation functions
- Interactive REPL environment
- Detailed error messages with line numbers
- Function declarations and calls
- If-else statements with elif support
- Variables and constants
- Object literals with property access
- Rich standard library

## Installation

```bash
npm install -g jizz-lang
```

## Usage

### Running a JIZZ file

Create a file with the `.jizz` extension and run it:

```bash
jizz run your-file.jizz
```

### Interactive REPL

Start the interactive shell:

```bash
jizz repl
```

### View Examples

See example JIZZ code:

```bash
jizz examples
```

## Language Features

### Variables and Constants

```javascript
let x = 10;
const PI = 3.14159;
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
    city: "New York"
};
buss(person);  // Output: { name: "John", age: 30, city: "New York" }
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
if (age >= 21) {
    if (age < 30) {
        buss("Young adult");
    } else {
        buss("Adult");
    }
} else {
    buss("Minor");
}
```

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