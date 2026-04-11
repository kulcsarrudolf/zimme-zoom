#!/bin/bash
set -e

BUMP=${1:-patch}

# Ensure clean working tree
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: Working tree is not clean. Commit or stash changes first."
  exit 1
fi

# Run tests
yarn test

git fetch origin
git rebase origin/main

# Bump version
yarn version --"$BUMP" --no-git-tag-version

# Commit, tag, and push
VERSION=$(node -p "require('./package.json').version")
git add package.json
git commit -m "chore: bump version $VERSION"
git tag "v$VERSION"

# Release
git push origin main --tags
git checkout release
git rebase main
git push origin release --force-with-lease
git checkout main
