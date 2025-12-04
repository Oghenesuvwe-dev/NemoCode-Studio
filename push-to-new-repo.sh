#!/bin/bash

# NemoCode Studio - Push to New Repository Script
# This script helps migrate your code to the new repository

set -e  # Exit on error

echo "🚀 NemoCode Studio - Repository Migration"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NEW_REPO_URL="https://github.com/Oghenesuvwe-dev/NemoCode-Studio.git"
CURRENT_DIR=$(pwd)

echo -e "${BLUE}Current directory:${NC} $CURRENT_DIR"
echo -e "${BLUE}New repository:${NC} $NEW_REPO_URL"
echo ""

# Step 1: Check if we're in the right directory
if [ ! -d "tauri-shell" ]; then
    echo -e "${YELLOW}⚠️  Warning: tauri-shell directory not found!${NC}"
    echo "Please run this script from the NemoCode-IDE root directory."
    exit 1
fi

echo -e "${GREEN}✓${NC} Found tauri-shell directory"

# Step 2: Check git status
echo ""
echo "📋 Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes:${NC}"
    git status --short
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📝 Committing changes..."
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
        echo -e "${GREEN}✓${NC} Changes committed"
    else
        echo -e "${YELLOW}⚠️  Proceeding with uncommitted changes...${NC}"
    fi
else
    echo -e "${GREEN}✓${NC} Working directory is clean"
fi

# Step 3: Remove old remote (if exists)
echo ""
echo "🔗 Configuring git remote..."
if git remote | grep -q "origin"; then
    echo "Removing old origin remote..."
    git remote remove origin
    echo -e "${GREEN}✓${NC} Old remote removed"
fi

# Step 4: Add new remote
echo "Adding new remote: $NEW_REPO_URL"
git remote add origin "$NEW_REPO_URL"
echo -e "${GREEN}✓${NC} New remote added"

# Step 5: Verify remote
echo ""
echo "📡 Verifying remote configuration..."
git remote -v

# Step 6: Push to new repository
echo ""
echo "🚀 Ready to push to new repository!"
echo ""
read -p "Push to main branch? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Pushing to main branch..."
    
    # Push with upstream
    git push -u origin main
    
    echo ""
    echo -e "${GREEN}✅ Successfully pushed to new repository!${NC}"
    echo ""
    echo "🎉 Next steps:"
    echo "1. Visit: https://github.com/Oghenesuvwe-dev/NemoCode-Studio"
    echo "2. Verify your code is there"
    echo "3. Check that CI/CD workflows are running"
    echo "4. Update any local clones to use the new URL"
    echo ""
    echo "📚 To clone from new location:"
    echo "   git clone $NEW_REPO_URL"
else
    echo ""
    echo "ℹ️  Push cancelled. You can push manually with:"
    echo "   git push -u origin main"
fi

echo ""
echo "✨ Done!"
