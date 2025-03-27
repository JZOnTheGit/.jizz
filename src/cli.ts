#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import Parser from './frontend/parser';
import { createGlobalEnv } from './runtime/environment';
import { evaluate } from './runtime/interpreter';
import { execSync } from 'child_process';
import https from 'https';

const program = new Command();

// Read package.json for version info
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

// ASCII art logo
const logo = `
     ██╗██╗███████╗███████╗
     ██║██║╚══███╔╝╚══███╔╝
     ██║██║  ███╔╝   ███╔╝ 
██   ██║██║ ███╔╝   ███╔╝  
╚█████╔╝██║███████╗███████╗
 ╚════╝ ╚═╝╚══════╝╚══════╝
`;

// Check for updates
function checkForUpdates(): Promise<void> {
    return new Promise<void>((resolve) => {
        https.get('https://registry.npmjs.org/jizz-lang', (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const registryData = JSON.parse(data);
                    const latestVersion = registryData['dist-tags'].latest;
                    const currentVersion = packageJson.version;
                    
                    if (latestVersion !== currentVersion) {
                        console.log(chalk.yellow('\n📦 Update available!'));
                        console.log(chalk.gray(`Current version: ${currentVersion}`));
                        console.log(chalk.green(`Latest version: ${latestVersion}`));
                        console.log(chalk.cyan('\nTo update, run:'));
                        console.log(chalk.white('npm update -g jizz-lang\n'));
                    }
                } catch (error) {
                    // Silently fail version check - don't interrupt user's command
                }
                resolve();
            });
        }).on('error', () => resolve()); // Silently fail on network errors
    });
}

program
  .name('jizz')
  .description(chalk.cyan('JIZZ Programming Language frfr CLI'))
  .version(packageJson.version);

program
  .command('run <file>')
  .description('Run a .jizz file')
  .action(async (file) => {
    try {
      // Check for updates before running
      await checkForUpdates();

      // Resolve absolute path
      const filePath = resolve(file);

      // Check file extension
      if (!file.endsWith('.jizz')) {
        console.error(chalk.red('Error: Only .jizz files are supported'));
        process.exit(1);
      }

      // Check if file exists
      if (!existsSync(filePath)) {
        console.error(chalk.red(`Error: File '${file}' not found`));
        process.exit(1);
      }

      // Read and execute the file
      const input = readFileSync(filePath, 'utf8');
      const parser = new Parser();
      const env = createGlobalEnv();

      try {
        const program = parser.produceAST(input);
        evaluate(program, env);
      } catch (error) {
        if (typeof error === "string" && error.startsWith("Error at line")) {
          console.error(chalk.red(error));
        } else {
          console.error(chalk.red("Error: " + error));
        }
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red("Error: " + error));
      process.exit(1);
    }
  });

program
  .command('repl')
  .description('Start JIZZ REPL (Interactive Shell)')
  .action(async () => {
    // Check for updates before starting REPL
    await checkForUpdates();

    console.log(chalk.cyan(logo));
    console.log(chalk.yellow("JIZZ Programming Language REPL v" + packageJson.version));
    console.log(chalk.gray("Developed by Jainesh Singh | j-singh.net"));
    console.log(chalk.gray("Type 'exit' to quit\n"));

    const parser = new Parser();
    const env = createGlobalEnv();
    
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.green('jizz> ')
    });

    readline.prompt();

    readline.on('line', (line: string) => {
      if (line.toLowerCase() === 'exit') {
        console.log(chalk.yellow('\nGoodbye!'));
        process.exit(0);
      }

      try {
        const program = parser.produceAST(line);
        const result = evaluate(program, env);
        if (result.type !== 'null') {
          console.log(chalk.cyan('=>'), result);
        }
      } catch (error) {
        if (typeof error === "string" && error.startsWith("Error at line")) {
          console.error(chalk.red(error));
        } else {
          console.error(chalk.red("Error: " + error));
        }
      }

      readline.prompt();
    });
  });

// Add examples command
program
  .command('examples')
  .description('Show example JIZZ code')
  .action(async () => {
    // Check for updates before showing examples
    await checkForUpdates();

    console.log(chalk.cyan('\nJIZZ Code Examples:\n'));
    console.log(chalk.white(`// Variables
let x = 10;
let name = "John";
let isActive = frfr;  // Boolean true
let isEmpty = cap;   // Boolean false

// User Input
let userName = ask("Enter your name: ");
buss("Hello, " + userName + "!");

// Type Conversion
let userAge = int(ask("How old are you? "));
let ageAsString = str(userAge);

// If statements
if (userAge >= 18) {
    buss("You are an adult!");
} else {
    buss("You are a minor!");
}

// Skibidi loops (while loops)
let count = 1;
skibidi (count <= 5) {
    buss("Count: " + count);
    count = count + 1;
}

// Too loops (for loops)
too (let i = 0; i < 5; i = i + 1) {
    buss("Iteration: " + i);
}

// Functions
typeshii greet(name) {
    buss("Hello, " + name + "!");
    return "Greeting sent to " + name;
}

// Function calls
let result = greet("World");
buss(result);


//JizzMath Module

// Constants
buss("=== JizzMath Constants ===");
buss("JizzMath.PI:", JizzMath.PI);
buss("JizzMath.E:", JizzMath.E);

// Basic rounding functions
buss("\n=== Basic Rounding Functions ===");
let value = 5.7;
buss("Original value:", value);
buss("JizzMath.floor(5.7):", JizzMath.floor(value));
buss("JizzMath.ceil(5.7):", JizzMath.ceil(value));
buss("JizzMath.round(5.7):", JizzMath.round(value));

value = 5.2;
buss("\nOriginal value:", value);
buss("JizzMath.floor(5.2):", JizzMath.floor(value));
buss("JizzMath.ceil(5.2):", JizzMath.ceil(value));
buss("JizzMath.round(5.2):", JizzMath.round(value));

value = 5.5;
buss("\nOriginal value:", value);
buss("JizzMath.floor(5.5):", JizzMath.floor(value));
buss("JizzMath.ceil(5.5):", JizzMath.ceil(value));
buss("JizzMath.round(5.5):", JizzMath.round(value));

// Absolute value
buss("\n=== Absolute Value ===");
let posNum = 10;
buss("JizzMath.abs(10):", JizzMath.abs(posNum));

let negNum = 0 - 10;  // Instead of -10 directly
buss("JizzMath.abs(-10):", JizzMath.abs(negNum));

buss("JizzMath.abs(0):", JizzMath.abs(0));

// Square root
buss("\n=== Square Root ===");
let num16 = 16;
buss("JizzMath.sqrt(16):", JizzMath.sqrt(num16));
let num2 = 2;
buss("JizzMath.sqrt(2):", JizzMath.sqrt(num2));
buss("JizzMath.sqrt(0):", JizzMath.sqrt(0));

// Power
buss("\n=== Power Function ===");
buss("JizzMath.pow(2, 3):", JizzMath.pow(2, 3));
let base = 4;
let exp = 0.5;
buss("JizzMath.pow(4, 0.5):", JizzMath.pow(base, exp));
buss("JizzMath.pow(9, 0.5):", JizzMath.pow(9, exp));
buss("JizzMath.pow(5, 2):", JizzMath.pow(5, 2));

// Min and Max
buss("\n=== Min and Max Functions ===");
buss("JizzMath.min(3, 7, 2, 9):", JizzMath.min(3, 7, 2, 9));
buss("JizzMath.max(3, 7, 2, 9):", JizzMath.max(3, 7, 2, 9));

// Use variables for negative values
let negTen = 0 - 10;
buss("JizzMath.min(-10, 0, 10):", JizzMath.min(negTen, 0, 10));
buss("JizzMath.max(-10, 0, 10):", JizzMath.max(negTen, 0, 10));

// Random
buss("\n=== Random Function ===");
let rand1 = JizzMath.random();
buss("JizzMath.random():", rand1);
let rand2 = JizzMath.random();
buss("JizzMath.random():", rand2);
let rand3 = JizzMath.random();
buss("JizzMath.random():", rand3);

// Example: Random integer in range
typeshii randomInt(min, max) {
    return JizzMath.floor(JizzMath.random() * (max - min + 1) + min);
}

buss("\nRandom integers in range (1-10):");
buss("Random integer:", randomInt(1, 10));
buss("Random integer:", randomInt(1, 10));
buss("Random integer:", randomInt(1, 10));

// Practical example: Pythagorean theorem
buss("\n=== Practical Example: Pythagorean Theorem ===");
typeshii calculateHypotenuse(a, b) {
    return JizzMath.sqrt(JizzMath.pow(a, 2) + JizzMath.pow(b, 2));
}

buss("Hypotenuse of triangle with sides 3 and 4:", calculateHypotenuse(3, 4));
buss("Hypotenuse of triangle with sides 5 and 12:", calculateHypotenuse(5, 12));

// Demonstration of escape sequences
buss("\n=== Escape Sequences ===");
buss("Line 1\nLine 2\nLine 3");
buss("Item\tPrice\tQuantity");
buss("-----\t-----\t--------");
buss("Apple\t$1.00\t5");
buss("Orange\t$0.75\t10");
`));
  });

// Add VSCode extension installer command
program
  .command('vscode')
  .description('Install VSCode syntax highlighting for JIZZ')
  .action(() => {
    console.log(chalk.cyan('\nInstalling VSCode syntax highlighting for JIZZ...\n'));
    
    try {
      const scriptPath = join(__dirname, '..', 'scripts', 'install-vscode-extension.js');
      
      if (existsSync(scriptPath)) {
        // Execute the install script
        execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
      } else {
        console.error(chalk.red('Error: VSCode extension installer script not found.'));
        console.log(chalk.yellow('\nYou can install the extension manually:'));
        console.log(chalk.white('1. Open VSCode'));
        console.log(chalk.white('2. Press Ctrl+P (or Cmd+P on macOS)'));
        console.log(chalk.white('3. Type: ext install jizz-language'));
        console.log(chalk.white('4. Press Enter'));
      }
    } catch (error) {
      console.error(chalk.red('Error installing VSCode extension:'), error);
      process.exit(1);
    }
  });

program.parse();