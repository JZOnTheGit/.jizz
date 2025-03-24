#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import Parser from './frontend/parser';
import { createGlobalEnv } from './runtime/environment';
import { evaluate } from './runtime/interpreter';

const program = new Command();

// ASCII art logo
const logo = `
     ██╗██╗███████╗███████╗
     ██║██║╚══███╔╝╚══███╔╝
     ██║██║  ███╔╝   ███╔╝ 
██   ██║██║ ███╔╝   ███╔╝  
╚█████╔╝██║███████╗███████╗
 ╚════╝ ╚═╝╚══════╝╚══════╝
`;

program
  .name('jizz')
  .description(chalk.cyan('JIZZ Programming Language frfr CLI'))
  .version('1.0.0');

program
  .command('run <file>')
  .description('Run a .jizz file')
  .action((file) => {
    try {
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
  .action(() => {
    console.log(chalk.cyan(logo));
    console.log(chalk.yellow("JIZZ Programming Language REPL v1.0.0"));
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
  .action(() => {
    console.log(chalk.cyan('\nJIZZ Code Examples:\n'));
    console.log(chalk.white(`// Variables
let x = 10;
let name = "John";

// If statements
if (x > 5) {
    buss("Greater than 5");
}

// Functions
fn greet(name) {
    buss("Hello, " + name + "!");
}

// Function calls
greet("World");
`));
  });

program.parse(); 