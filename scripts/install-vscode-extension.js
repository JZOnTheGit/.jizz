#!/usr/bin/env node

const { exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

// Find the .vsix file
function findVsixFile() {
  const distPath = path.join(__dirname, '..', 'dist');
  const vscodePath = path.join(__dirname, '..', 'vscode-jizz');
  
  // Check in dist directory first
  if (fs.existsSync(path.join(distPath, 'jizz-language.vsix'))) {
    return path.join(distPath, 'jizz-language.vsix');
  }
  
  // Check in vscode-jizz directory
  if (fs.existsSync(path.join(vscodePath, 'jizz-language.vsix'))) {
    return path.join(vscodePath, 'jizz-language.vsix');
  }
  
  return null;
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
        execSync('code --version', {stdio: 'ignore'});
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
  console.log(chalk.cyan('=== JIZZ Language VSCode Extension Installer ==='));
  
  if (!isVSCodeInstalled()) {
    console.log(chalk.yellow('\nVSCode not detected on your system.'));
    console.log(chalk.white('Please install VSCode from https://code.visualstudio.com/download'));
    console.log(chalk.white('After installing VSCode, run this script again.'));
    return;
  }
  
  const vsixPath = findVsixFile();
  if (!vsixPath) {
    console.log(chalk.red('\nError: Could not find the JIZZ Language extension (.vsix file).'));
    console.log(chalk.white('The extension might not have been packaged yet.'));
    console.log(chalk.yellow('\nHere\'s how to package the extension:'));
    
    // Package options
    const packageCmd = 'npm run package-vscode';
    console.log(chalk.white(`\nOption 1: Run the package script: ${packageCmd}`));
    
    // Manual packaging instructions
    console.log(chalk.white('\nOption 2: Package manually:'));
    console.log(chalk.white('   a. Install vsce locally: npm install -D vsce'));
    console.log(chalk.white('   b. Navigate to vscode-jizz directory: cd vscode-jizz'));
    console.log(chalk.white('   c. Run: npx vsce package'));
    console.log(chalk.white('   d. Move the created .vsix file to the dist directory'));
    
    // Or option to install from marketplace
    console.log(chalk.white('\nOption 3: Install from VSCode marketplace:'));
    console.log(chalk.white('   a. Open VSCode'));
    console.log(chalk.white('   b. Press Ctrl+P (or Cmd+P on macOS)'));
    console.log(chalk.white('   c. Type: ext install jizz-language'));
    console.log(chalk.white('   d. Press Enter'));
    
    console.log(chalk.yellow('\nTry again after packaging the extension.'));
    return;
  }
  
  console.log(chalk.green('\nVSCode detected! Installing JIZZ Language extension...'));
  
  // Install the extension
  const command = `code --install-extension "${vsixPath}"`;
  console.log(chalk.white(`\nRunning: ${command}`));
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(chalk.red('\nError installing extension:'));
      console.log(chalk.red(stderr));
      console.log(chalk.yellow('\nYou can try installing manually:'));
      console.log(chalk.white(`1. Open VSCode`));
      console.log(chalk.white(`2. Go to Extensions (Ctrl+Shift+X)`));
      console.log(chalk.white(`3. Click "..." in the top right`));
      console.log(chalk.white(`4. Select "Install from VSIX..."`));
      console.log(chalk.white(`5. Navigate to: ${vsixPath}`));
      return;
    }
    
    console.log(chalk.green('\n✅ JIZZ Language extension successfully installed!'));
    console.log(chalk.white('\nNow when you open .jizz files in VSCode, you will have:'));
    console.log(chalk.white('- Syntax highlighting for JIZZ code'));
    console.log(chalk.white('- Proper coloring for keywords like frfr, cap, typeshii, etc.'));
    console.log(chalk.white('- Better readability and code navigation'));
    
    console.log(chalk.cyan('\nYou may need to restart VSCode for the changes to take effect.'));
  });
}

// Run the main function
main(); 