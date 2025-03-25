#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const readline = require('readline');

// Constants
const PROJECT_ROOT = path.resolve(__dirname, '..');
const VSCODE_DIR = path.join(PROJECT_ROOT, 'vscode-jizz');
const VSIX_PATH = path.join(PROJECT_ROOT, 'dist/jizz-language.vsix');

// Check for token in environment variables
const TOKEN_ENV_VAR = 'VSCODE_MARKETPLACE_TOKEN';
const PUBLISHER_TOKEN = process.env[TOKEN_ENV_VAR];

// Create readline interface for interactive prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Read package.json to get extension details
function readPackageJson() {
  const packageJsonPath = path.join(VSCODE_DIR, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error(chalk.red('Error: package.json not found in vscode-jizz directory'));
    process.exit(1);
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check if the publisher field exists and is not the placeholder
    if (!packageJson.publisher || packageJson.publisher === 'your-publisher-id') {
      console.error(chalk.yellow('Warning: You need to set a valid publisher ID in vscode-jizz/package.json'));
      console.error(chalk.yellow('Please update the "publisher" field with your marketplace publisher ID'));
      process.exit(1);
    }
    
    return packageJson;
  } catch (error) {
    console.error(chalk.red(`Error reading package.json: ${error.message}`));
    process.exit(1);
  }
}

// Check if vsce is installed globally or locally
function checkVsceInstalled() {
  try {
    execSync('which vsce || npm list -g vsce || npm list vsce', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Install vsce if not installed
function installVsce() {
  console.log(chalk.blue('Installing vsce locally...'));
  try {
    execSync('npm install -D vsce', { cwd: PROJECT_ROOT, stdio: 'inherit' });
    console.log(chalk.green('✓ vsce installed successfully'));
    return true;
  } catch (error) {
    console.error(chalk.red(`Failed to install vsce: ${error.message}`));
    return false;
  }
}

// Package the extension
function packageExtension() {
  console.log(chalk.blue('Packaging the VSCode extension...'));
  
  try {
    execSync('npm run package-vscode', { cwd: PROJECT_ROOT, stdio: 'inherit' });
    
    if (!fs.existsSync(VSIX_PATH)) {
      console.error(chalk.red('Error: .vsix file not found after packaging'));
      return false;
    }
    
    console.log(chalk.green(`✓ Extension packaged successfully: ${path.basename(VSIX_PATH)}`));
    return true;
  } catch (error) {
    console.error(chalk.red(`Failed to package extension: ${error.message}`));
    return false;
  }
}

// Prompt for token interactively if not provided in environment
function promptForToken() {
  return new Promise((resolve) => {
    rl.question(chalk.yellow('Enter your Visual Studio Marketplace Personal Access Token: '), (token) => {
      if (!token.trim()) {
        console.error(chalk.red('Error: Token is required for publishing'));
        rl.close();
        process.exit(1);
      }
      resolve(token.trim());
    });
  });
}

// Publish the extension to the marketplace
async function publishExtension(token) {
  console.log(chalk.blue('Publishing extension to VS Code Marketplace...'));
  
  // Create temporary .vsce file with token
  const vsceConfigPath = path.join(VSCODE_DIR, '.vsce');
  
  try {
    fs.writeFileSync(vsceConfigPath, JSON.stringify({ personal: token }));
    
    // Execute the publish command
    console.log(chalk.blue('Running vsce publish...'));
    
    try {
      execSync('npx vsce publish', { 
        cwd: VSCODE_DIR, 
        stdio: 'inherit' 
      });
      
      console.log(chalk.green('✓ Extension published successfully to VS Code Marketplace!'));
      console.log(chalk.blue('Your extension should now be available in the marketplace.'));
      return true;
    } catch (error) {
      console.error(chalk.red(`Failed to publish extension: ${error.message}`));
      console.log(chalk.yellow('Troubleshooting:'));
      console.log(chalk.yellow('1. Ensure your publisher ID in package.json matches your marketplace account'));
      console.log(chalk.yellow('2. Check that your token has the correct permissions (Marketplace > Manage)'));
      console.log(chalk.yellow('3. Verify that the extension name is unique in the marketplace'));
      return false;
    } finally {
      // Clean up the .vsce file to avoid leaking the token
      if (fs.existsSync(vsceConfigPath)) {
        fs.unlinkSync(vsceConfigPath);
      }
    }
  } catch (error) {
    console.error(chalk.red(`Error during publishing setup: ${error.message}`));
    return false;
  }
}

// Main function
async function main() {
  console.log(chalk.blue('==== JIZZ VSCode Extension Publisher ===='));
  
  // Read package.json to validate publisher
  readPackageJson();
  
  // Check for vsce and install if needed
  if (!checkVsceInstalled()) {
    if (!installVsce()) {
      console.error(chalk.red('Failed to set up the publishing environment.'));
      process.exit(1);
    }
  }
  
  // Package the extension
  if (!packageExtension()) {
    console.error(chalk.red('Failed to package the extension. Cannot continue with publishing.'));
    process.exit(1);
  }
  
  // Get token from environment or prompt
  let token = PUBLISHER_TOKEN;
  if (!token) {
    console.log(chalk.yellow(`No token found in ${TOKEN_ENV_VAR} environment variable.`));
    token = await promptForToken();
  }
  
  // Publish the extension
  const success = await publishExtension(token);
  
  // Close readline interface
  rl.close();
  
  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

// Run the main function
main().catch(error => {
  console.error(chalk.red(`Unexpected error: ${error.message}`));
  process.exit(1);
}); 