#!/bin/bash

set -e # Exit on error

# Function to increment version
increment_version() {
    # Read current version from package.json
    current_version=$(node -p "require('./package.json').version")
    echo "Current version: $current_version"
    
    read -p "Enter new version (press enter to increment patch): " new_version
    
    if [ -z "$new_version" ]; then
        # Auto-increment patch version
        major=$(echo $current_version | cut -d. -f1)
        minor=$(echo $current_version | cut -d. -f2)
        patch=$(echo $current_version | cut -d. -f3)
        new_version="$major.$minor.$((patch + 1))"
    fi
    
    echo "Updating to version $new_version"
    
    # Update version in both package files
    sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" package.json
    sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" package.github.json
}

# Function to cleanup on error
cleanup() {
    if [ -f "package.npm.json" ]; then
        echo "Cleaning up package files..."
        mv package.npm.json package.json
    fi
}

# Set up error handling
trap cleanup ERR EXIT

# Increment version
increment_version

# Publish to npm
echo "Publishing to npm..."
npm publish --registry https://registry.npmjs.org/

# Publish to GitHub Packages
echo "Publishing to GitHub Packages..."
cp package.json package.npm.json
cp package.github.json package.json
npm publish --registry https://npm.pkg.github.com/
mv package.npm.json package.json

echo "✨ Published successfully to both registries! ✨"
echo ""
echo "Don't forget to commit the version changes:"
echo "git add package.json package.github.json"
echo "git commit -m \"Release v$(node -p \"require('./package.json').version\")\""
echo "git tag v$(node -p \"require('./package.json').version\")"
echo "git push && git push --tags" 