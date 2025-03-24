#!/bin/bash

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is required but not installed."
    echo "Please install it using: brew install imagemagick"
    exit 1
fi

# Create temporary directory for icon generation
ICON_SET="assets/icons/JizzIcon.iconset"
mkdir -p "$ICON_SET"

# Convert SVG to PNG at various sizes
convert -background none assets/icons/jizz-file.svg -resize 16x16 "$ICON_SET/icon_16x16.png"
convert -background none assets/icons/jizz-file.svg -resize 32x32 "$ICON_SET/icon_16x16@2x.png"
convert -background none assets/icons/jizz-file.svg -resize 32x32 "$ICON_SET/icon_32x32.png"
convert -background none assets/icons/jizz-file.svg -resize 64x64 "$ICON_SET/icon_32x32@2x.png"
convert -background none assets/icons/jizz-file.svg -resize 128x128 "$ICON_SET/icon_128x128.png"
convert -background none assets/icons/jizz-file.svg -resize 256x256 "$ICON_SET/icon_128x128@2x.png"
convert -background none assets/icons/jizz-file.svg -resize 256x256 "$ICON_SET/icon_256x256.png"
convert -background none assets/icons/jizz-file.svg -resize 512x512 "$ICON_SET/icon_256x256@2x.png"
convert -background none assets/icons/jizz-file.svg -resize 512x512 "$ICON_SET/icon_512x512.png"
convert -background none assets/icons/jizz-file.svg -resize 1024x1024 "$ICON_SET/icon_512x512@2x.png"

# Convert the iconset to icns
iconutil -c icns "$ICON_SET" -o "assets/icons/jizz-file.icns"

# Clean up temporary files
rm -rf "$ICON_SET"

echo "Icon generation complete! The .icns file is at assets/icons/jizz-file.icns" 