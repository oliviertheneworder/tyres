#!/bin/bash

# Tyres JS Deployment Script
# Usage: ./deploy.sh [patch|minor|major]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Tyres JS Deployment Script${NC}"

# Check if version type is provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}Usage: ./deploy.sh [patch|minor|major]${NC}"
    echo -e "${YELLOW}Defaulting to patch version...${NC}"
    VERSION_TYPE="patch"
else
    VERSION_TYPE="$1"
fi

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo -e "${RED}❌ Invalid version type. Use: patch, minor, or major${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Building project...${NC}"
npm run build

echo -e "${BLUE}🔍 Checking for uncommitted changes...${NC}"
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  Uncommitted changes detected. Please commit or stash them first.${NC}"
    git status --short
    exit 1
fi

echo -e "${BLUE}🏷️  Creating new $VERSION_TYPE version...${NC}"
npm version $VERSION_TYPE --no-git-tag-version

# Get the new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}✅ New version: $NEW_VERSION${NC}"

echo -e "${BLUE}📝 Committing changes...${NC}"
git add package.json
git commit -m "v$NEW_VERSION: Release new version"

echo -e "${BLUE}🏷️  Creating git tag...${NC}"
git tag -a "v$NEW_VERSION" -m "Version $NEW_VERSION"

echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
git push origin main
git push origin "v$NEW_VERSION"

echo -e "${BLUE}🔄 Updating latest tag...${NC}"
git tag -d latest 2>/dev/null || true
git tag latest
git push origin :refs/tags/latest 2>/dev/null || true
git push origin latest

echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo -e "${GREEN}📦 Version: $NEW_VERSION${NC}"
echo -e "${GREEN}🔗 Latest URL: https://github.com/oliviertheneworder/tyres/releases/latest/download/index.js${NC}"
echo -e "${GREEN}🏷️  Version URL: https://github.com/oliviertheneworder/tyres/releases/download/v$NEW_VERSION/index.js${NC}"

echo -e "${BLUE}⏳ GitHub Actions will automatically create the release...${NC}"
