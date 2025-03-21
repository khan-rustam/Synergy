#!/bin/bash

# Exit on error
set -e

# Clean previous build
echo "Cleaning previous build..."
rm -rf dist

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Copy htaccess to dist
echo "Copying htaccess file..."
cp htaccess dist/.htaccess

# Create zip file
echo "Creating zip file..."
cd dist
zip -r ../dist.zip ./*
cd ..

echo "Build completed successfully!"
echo "You can find the dist.zip file in the root directory." 