const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

function installIcons() {
    // Only proceed on macOS
    if (process.platform !== 'darwin') {
        console.log('Icon installation is currently only supported on macOS');
        return;
    }

    try {
        // Create directories if they don't exist
        const homeDir = os.homedir();
        const utiDir = path.join(homeDir, 'Library/UTIs');
        const iconDir = path.join(homeDir, 'Library/Icons');
        
        fs.mkdirSync(utiDir, { recursive: true });
        fs.mkdirSync(iconDir, { recursive: true });

        // Copy the UTI and icon files
        const packageDir = path.join(__dirname, '..');
        fs.copyFileSync(
            path.join(packageDir, 'assets/icons/jizz.uti'),
            path.join(utiDir, 'jizz.uti')
        );
        fs.copyFileSync(
            path.join(packageDir, 'assets/icons/jizz-file.icns'),
            path.join(iconDir, 'jizz-file.icns')
        );

        // Register the UTI with the system
        execSync('/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -v ~/Library/UTIs/jizz.uti');
        
        // Force Finder to restart to apply changes
        execSync('killall Finder');

        console.log('✨ JIZZ file icons have been installed successfully!');
    } catch (error) {
        console.error('Error installing icons:', error.message);
        // Don't exit with error as this is not critical for package functionality
    }
}

installIcons(); 