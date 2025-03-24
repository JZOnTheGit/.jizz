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