# Make sure working directory is clean
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: Working directory is not clean."
  exit 1
fi

git checkout master
git pull
git merge dev

# Ensure the argument is provided
if [ -z "$1" ]; then
  echo "Error: No version type (patch, minor, major) provided."
  exit 1
fi

# Update the version using npm
npm version $1

# Get the new tag created by npm version
TAG=$(git describe --tags)

# Push the commit and the tag together
git push --follow-tags

git checkout dev

git merge master

PACKAGE_VERSION=$(node -p "require('./package.json').version")
echo "Version $TAG (package: $PACKAGE_VERSION) has been deployed to master and dev branches."