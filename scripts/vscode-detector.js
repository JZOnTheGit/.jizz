const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

// Don't run this in CI environments 
if (process.env.CI || process.env.CONTINUOUS_INTEGRATION) {
  return;
}

// Check if VSCode is installed
function isVSCodeInstalled() {
  try {
    // Check common installation paths
    if (os.platform() === 'win32') {
      return fs.existsSync('C:\\Program Files\\Microsoft VS Code\\code.exe') || 
             fs.existsSync('C:\\Program Files (x86)\\Microsoft VS Code\\code.exe');
    } else if (os.platform() === 'darwin') {
      return fs.existsSync('/Applications/Visual Studio Code.app');
    } else {
      // On Linux, try a simple command
      try {
        // We're using sync version for simplicity in this check
        require('child_process').execSync('code --version', {stdio: 'ignore'});
        return true;
      } catch (e) {
        return false;
      }
    }
  } catch (e) {
    return false;
  }
  return false;
}

// Main function
function main() {
  if (isVSCodeInstalled()) {
    console.log(chalk.cyan('\n┌─────────────────────────────────────────────────┐'));
    console.log(chalk.cyan('│ 🚀 VSCode detected!                             │'));
    console.log(chalk.cyan('│                                                 │'));
    console.log(chalk.cyan('│ For syntax highlighting of .jizz files, install │'));
    console.log(chalk.cyan('│ the JIZZ Language Support extension:            │'));
    console.log(chalk.cyan('│                                                 │'));
    console.log(chalk.cyan('│ 1. Open VSCode                                  │'));
    console.log(chalk.cyan('│ 2. Press Ctrl+P (or Cmd+P on macOS)             │'));
    console.log(chalk.cyan('│ 3. Type: ext install jizz-language              │'));
    console.log(chalk.cyan('│ 4. Press Enter                                  │'));
    console.log(chalk.cyan('│                                                 │'));
    console.log(chalk.cyan('│ Alternatively visit:                            │'));
    console.log(chalk.cyan('│ https://marketplace.visualstudio.com/items?     │'));
    console.log(chalk.cyan('│ itemName=jizz-lang.jizz-language                │'));
    console.log(chalk.cyan('└─────────────────────────────────────────────────┘\n'));
  }
}

// Run the main function
main(); 