#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Directory paths
const projectRoot = path.resolve(__dirname, '..');
const vscodeDirPath = path.join(projectRoot, 'vscode-jizz');
const vsixOutputPath = path.join(projectRoot, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(vsixOutputPath)) {
  fs.mkdirSync(vsixOutputPath, { recursive: true });
}

// Function to check if vsce is installed
function isVsceInstalled() {
  try {
    execSync('vsce --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Main function to package the VSCode extension
function packageExtension() {
  console.log(chalk.cyan('=== Packaging JIZZ VSCode Extension ==='));
  
  // First check if vsce is installed
  if (!isVsceInstalled()) {
    console.log(chalk.yellow('\nThe Visual Studio Code Extension Manager (vsce) is not installed.'));
    
    try {
      console.log(chalk.white('Attempting to install vsce globally...'));
      execSync('npm install -g vsce', { stdio: 'inherit' });
    } catch (error) {
      console.log(chalk.red('\nFailed to install vsce globally. This might be due to permission issues.'));
      console.log(chalk.yellow('\nYou have two options:'));
      console.log(chalk.white('\n1. Try installing vsce with sudo (requires admin password):'));
      console.log(chalk.white('   sudo npm install -g vsce'));
      
      console.log(chalk.white('\n2. Or package the extension manually with these steps:'));
      console.log(chalk.white('   a. Install vsce locally: npm install -D vsce'));
      console.log(chalk.white('   b. Navigate to vscode-jizz directory: cd vscode-jizz'));
      console.log(chalk.white('   c. Run: npx vsce package'));
      console.log(chalk.white('   d. Move the created .vsix file to the dist directory'));
      
      console.log(chalk.yellow('\nSkipping packaging for now.'));
      return;
    }
  }
  
  // Package the extension
  try {
    console.log(chalk.white('\nPackaging extension...'));
    process.chdir(vscodeDirPath);
    execSync('vsce package -o jizz-language.vsix', { stdio: 'inherit' });
    
    // Move the .vsix file to the dist directory
    if (fs.existsSync(path.join(vscodeDirPath, 'jizz-language.vsix'))) {
      fs.copyFileSync(
        path.join(vscodeDirPath, 'jizz-language.vsix'),
        path.join(vsixOutputPath, 'jizz-language.vsix')
      );
      console.log(chalk.green(`\n✅ VSCode extension packaged successfully to ${path.join(vsixOutputPath, 'jizz-language.vsix')}`));
      
      // Return to the original directory
      process.chdir(projectRoot);
      
      // Provide next steps
      console.log(chalk.white('\nNext steps:'));
      console.log(chalk.white('1. Install the extension: npm run vscode-install'));
      console.log(chalk.white('2. Or run: jizz vscode (if you have the CLI installed globally)'));
    } else {
      console.error(chalk.red('\nFailed to find the packaged .vsix file'));
    }
  } catch (error) {
    console.error(chalk.red('\nError packaging extension:'), error.message);
    
    // Return to the original directory
    try {
      process.chdir(projectRoot);
    } catch (e) {
      // Ignore directory change errors
    }
  }
}

// Run the main function
packageExtension(); 