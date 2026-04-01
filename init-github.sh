#!/bin/bash

# LLM Chat APK - GitHub Repository Initialization Script
# This script sets up your GitHub repository and enables automatic APK builds

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   LLM Chat APK - GitHub Repository Setup                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first:"
    echo "   sudo apt-get install git"
    exit 1
fi

# Check if GitHub CLI is installed (optional but recommended)
if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI (gh) not found. Installing..."
    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
    sudo apt update
    sudo apt install gh -y
fi

echo ""
echo "📋 GitHub Repository Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if already initialized
if [ -d .git ]; then
    echo "✅ Git repository already initialized"
    REPO_URL=$(git config --get remote.origin.url)
    if [ ! -z "$REPO_URL" ]; then
        echo "✅ Remote already configured: $REPO_URL"
        echo ""
        read -p "Do you want to reinitialize? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Skipping reinitialization..."
            SKIP_INIT=true
        fi
    fi
fi

if [ "$SKIP_INIT" != "true" ]; then
    # Check GitHub authentication
    echo "🔐 Checking GitHub authentication..."
    if ! gh auth status &> /dev/null; then
        echo "❌ Not authenticated with GitHub"
        echo ""
        echo "Please authenticate with GitHub:"
        gh auth login
    else
        echo "✅ GitHub authentication verified"
    fi
    
    echo ""
    echo "📝 Repository Information"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Get repository name
    read -p "Repository name (default: llm-chat-app): " REPO_NAME
    REPO_NAME=${REPO_NAME:-llm-chat-app}
    
    # Get owner
    read -p "Repository owner/username: " REPO_OWNER
    
    if [ -z "$REPO_OWNER" ]; then
        echo "❌ Owner/username is required"
        exit 1
    fi
    
    # Get description
    read -p "Repository description (optional): " REPO_DESC
    REPO_DESC=${REPO_DESC:-"Local Llama 2 7B Chat Application for Android 14"}
    
    # Get visibility
    echo ""
    echo "Repository visibility:"
    echo "1) Public (anyone can see)"
    echo "2) Private (only you and collaborators)"
    read -p "Choose (1 or 2, default: 1): " VISIBILITY
    VISIBILITY=${VISIBILITY:-1}
    
    if [ "$VISIBILITY" == "2" ]; then
        VISIBILITY_FLAG="--private"
        VISIBILITY_TEXT="Private"
    else
        VISIBILITY_FLAG="--public"
        VISIBILITY_TEXT="Public"
    fi
    
    echo ""
    echo "📦 Creating GitHub Repository"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Repository: $REPO_OWNER/$REPO_NAME"
    echo "Description: $REPO_DESC"
    echo "Visibility: $VISIBILITY_TEXT"
    echo ""
    
    read -p "Proceed with creation? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled"
        exit 1
    fi
    
    # Create repository on GitHub
    echo "🚀 Creating repository on GitHub..."
    gh repo create "$REPO_NAME" \
        --owner "$REPO_OWNER" \
        --description "$REPO_DESC" \
        $VISIBILITY_FLAG \
        --source=. \
        --remote=origin \
        --push
    
    REPO_URL="https://github.com/$REPO_OWNER/$REPO_NAME"
    echo "✅ Repository created: $REPO_URL"
fi

echo ""
echo "🔧 Initializing Local Git Repository"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Initialize git if not already done
if [ ! -d .git ]; then
    git init
    echo "✅ Git repository initialized"
fi

# Configure git user if not set
if [ -z "$(git config user.name)" ]; then
    read -p "Git user name: " GIT_NAME
    git config user.name "$GIT_NAME"
fi

if [ -z "$(git config user.email)" ]; then
    read -p "Git user email: " GIT_EMAIL
    git config user.email "$GIT_EMAIL"
fi

echo "✅ Git configured"
echo "   Name: $(git config user.name)"
echo "   Email: $(git config user.email)"

echo ""
echo "📤 Staging Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Add all files
git add .
echo "✅ Files staged"

# Create initial commit
git commit -m "Initial commit: LLM Chat APK with Llama 2 7B

- React Native frontend with TypeScript
- Llama 2 7B Q3_K_M quantized model (2GB allocation)
- Interactive chat interface with dark theme
- Real-time memory monitoring
- Android 14 target (API 34)
- GitHub Actions CI/CD for automatic APK builds
- Full documentation and setup guides" || true

echo "✅ Initial commit created"

echo ""
echo "🔗 Remote Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if remote exists
if ! git remote get-url origin &> /dev/null; then
    if [ ! -z "$REPO_URL" ]; then
        git remote add origin "$REPO_URL"
        echo "✅ Remote added: $REPO_URL"
    else
        read -p "GitHub repository URL: " REPO_URL
        git remote add origin "$REPO_URL"
        echo "✅ Remote added: $REPO_URL"
    fi
else
    REPO_URL=$(git remote get-url origin)
    echo "✅ Remote already configured: $REPO_URL"
fi

echo ""
echo "📤 Pushing to GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Set default branch
git branch -M main

# Push to GitHub
git push -u origin main
echo "✅ Code pushed to GitHub"

echo ""
echo "✅ GitHub Actions Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "GitHub Actions workflow is configured at:"
echo "  .github/workflows/build-apk.yml"
echo ""
echo "The workflow will automatically:"
echo "  ✓ Build APK on every push"
echo "  ✓ Upload artifacts for download"
echo "  ✓ Create releases (if tagged)"
echo ""

echo "🎉 Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Repository Status:"
echo "  URL: $REPO_URL"
echo "  Branch: $(git rev-parse --abbrev-ref HEAD)"
echo "  Commits: $(git rev-list --count HEAD)"
echo ""
echo "🚀 Next Steps:"
echo ""
echo "1. Visit: $REPO_URL"
echo "2. Go to Actions tab to see builds"
echo "3. Download APK from latest workflow run"
echo "4. Install on Android 14 device:"
echo "   adb install app-debug.apk"
echo ""
echo "📚 Documentation:"
echo "  - README.md - User guide"
echo "  - SETUP.md - Build instructions"
echo "  - PROJECT_OVERVIEW.md - Technical details"
echo ""
echo "💡 Tips:"
echo "  - Push changes to trigger new builds"
echo "  - Tag releases: git tag v1.0.0 && git push --tags"
echo "  - Check Actions for build status"
echo ""
echo "Need help? Check the documentation files or visit:"
echo "  https://help.manus.im"
echo ""
