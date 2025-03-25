#!/bin/bash

set -e # Exit on error

# Function to increment extension version
increment_extension_version() {
    # Read current version from vscode extension package.json
    current_version=$(node -p "require('./vscode-jizz/package.json').version")
    echo "Current VSCode extension version: $current_version"
    
    read -p "Enter new version (press enter to increment patch): " new_version
    
    if [ -z "$new_version" ]; then
        # Auto-increment patch version
        major=$(echo $current_version | cut -d. -f1)
        minor=$(echo $current_version | cut -d. -f2)
        patch=$(echo $current_version | cut -d. -f3)
        new_version="$major.$minor.$((patch + 1))"
    fi
    
    echo "Updating VSCode extension to version $new_version"
    
    # Update version in extension package.json
    sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" vscode-jizz/package.json
    
    echo "VSCode extension version updated to $new_version"
}

# Package the extension
package_extension() {
    echo "Packaging VSCode extension..."
    npm run package-vscode
    echo "Extension packaged successfully"
}

# Publish the extension using the script
publish_extension() {
    echo "Publishing VSCode extension to marketplace..."
    npm run publish-vscode
}

# Main flow
echo "🧩 VSCode Extension Publisher"
echo "============================"

# Update version
increment_extension_version

# Package
package_extension

# Publish
read -p "Do you want to publish the extension to the marketplace? (y/n): " publish_choice
if [[ $publish_choice == "y" || $publish_choice == "Y" ]]; then
    publish_extension
    echo "✨ VSCode extension published successfully! ✨"
else
    echo "Extension packaged but not published. You can find the .vsix file in the dist directory."
fi

echo ""
echo "Don't forget to commit the version changes:"
echo "git add vscode-jizz/package.json"
echo "git commit -m \"Update VSCode extension to v$(node -p \"require('./vscode-jizz/package.json').version\")\"" 