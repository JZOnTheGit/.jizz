#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

console.log(chalk.cyan('=== Building JIZZ Language ==='));

// Array of commands to run in sequence
const commands = [
  {
    name: 'Clean',
    cmd: 'npm run clean',
    required: true
  },
  {
    name: 'TypeScript Build',
    cmd: 'npm run build',
    required: true
  },
  {
    name: 'Package VSCode Extension',
    cmd: 'npm run package-vscode',
    required: false, // Not required to complete the build
    errorMessage: 'VSCode extension packaging failed, but continuing with the build process.'
  },
  {
    name: 'Run Tests',
    cmd: 'npm test',
    required: true
  }
];

// Create placeholder VSCode extension if packaging fails
function createPlaceholderVsixInfo() {
  const placeholderPath = path.join(__dirname, '..', 'dist', 'vscode-info.txt');
  const content = `
JIZZ Language VSCode Extension

The VSCode extension was not packaged automatically during build.

To package and install the extension manually:

1. Run one of the following commands:
   - npm run package-vscode
   - npm run vscode-install
   - jizz vscode (if installed globally)

2. Or install from VSCode marketplace:
   - Open VSCode
   - Press Ctrl+P (or Cmd+P on macOS)
   - Type: ext install jizz-language
   - Press Enter

For more information, see the README.md file.
`;

  try {
    fs.writeFileSync(placeholderPath, content);
    console.log(chalk.yellow(`\nCreated placeholder VSCode extension info at: ${placeholderPath}`));
  } catch (error) {
    console.error(chalk.red('Error creating placeholder file:', error.message));
  }
}

// Execute each command in sequence
(async function() {
  let vsCodeExtensionFailed = false;
  
  for (const command of commands) {
    try {
      console.log(chalk.yellow(`\n>> ${command.name}...`));
      execSync(command.cmd, { stdio: 'inherit' });
      console.log(chalk.green(`✓ ${command.name} completed successfully`));
    } catch (error) {
      if (command.required) {
        console.error(chalk.red(`✗ ${command.name} failed (Required)`));
        console.error(chalk.red(error.message));
        process.exit(1);
      } else {
        console.warn(chalk.yellow(`⚠ ${command.name} failed (Optional)`));
        console.warn(chalk.yellow(command.errorMessage || 'This step is optional, continuing with the build.'));
        
        if (command.name === 'Package VSCode Extension') {
          vsCodeExtensionFailed = true;
        }
      }
    }
  }
  
  // Create placeholder info if VSCode extension packaging failed
  if (vsCodeExtensionFailed) {
    createPlaceholderVsixInfo();
  }
  
  console.log(chalk.green('\n=== Build Completed Successfully ==='));
  console.log(chalk.cyan('\nJIZZ language is ready to use!'));
  console.log(chalk.white('Run `jizz run your-file.jizz` to execute a JIZZ program'));
  console.log(chalk.white('Run `jizz repl` to start the interactive REPL'));
  
  if (vsCodeExtensionFailed) {
    console.log(chalk.yellow('\nNOTE: The VSCode extension was not packaged automatically.'));
    console.log(chalk.white('Run `jizz vscode` or `npm run vscode-install` to install the extension.'));
  } else {
    console.log(chalk.white('Run `jizz vscode` to install VSCode syntax highlighting'));
  }
})(); 