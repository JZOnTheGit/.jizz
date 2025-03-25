#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for interactive prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Path to the VSCode extension package.json
const packageJsonPath = path.join(__dirname, '..', 'vscode-jizz', 'package.json');

// Function to read the package.json
function readPackageJson() {
  try {
    if (!fs.existsSync(packageJsonPath)) {
      console.error('Error: package.json not found in vscode-jizz directory.');
      process.exit(1);
    }
    
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  } catch (error) {
    console.error(`Error reading package.json: ${error.message}`);
    process.exit(1);
  }
}

// Function to update the publisher ID in package.json
function updatePublisherId(publisherId) {
  try {
    const packageJson = readPackageJson();
    
    // Save the original publisher ID
    const originalPublisherId = packageJson.publisher;
    
    // Update the publisher ID
    packageJson.publisher = publisherId;
    
    // Write the updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
    
    console.log(`\n✅ Success! Publisher ID updated from "${originalPublisherId}" to "${publisherId}"`);
    console.log('\nYou can now publish your extension with:');
    console.log('  npm run publish-vscode\n');
    
  } catch (error) {
    console.error(`Error updating publisher ID: ${error.message}`);
    process.exit(1);
  }
}

// Main function
function main() {
  console.log('\n📝 VSCode Extension Publisher ID Setup');
  console.log('====================================');
  console.log('\nThis script will update the publisher ID in your VSCode extension.');
  console.log('You need a publisher ID from the Visual Studio Marketplace to publish your extension.');
  console.log('\nTo get a publisher ID:');
  console.log('1. Go to https://marketplace.visualstudio.com/manage');
  console.log('2. Sign in with your Microsoft account');
  console.log('3. Create a new publisher if you don\'t have one');
  console.log('4. Use the publisher ID shown in your dashboard\n');
  
  const packageJson = readPackageJson();
  console.log(`Current publisher ID: ${packageJson.publisher}`);
  
  rl.question('\nEnter your publisher ID: ', (publisherId) => {
    if (!publisherId.trim()) {
      console.error('Error: Publisher ID cannot be empty.');
      rl.close();
      process.exit(1);
    }
    
    updatePublisherId(publisherId.trim());
    rl.close();
  });
}

// Run the main function
main(); 