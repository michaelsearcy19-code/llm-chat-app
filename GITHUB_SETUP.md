# GitHub Setup Guide - LLM Chat APK

## Overview

This guide walks you through setting up your LLM Chat APK project on GitHub with automatic APK builds via GitHub Actions.

---

## Prerequisites

### 1. GitHub Account
- Create account at https://github.com
- Verify email

### 2. GitHub CLI (Recommended)
```bash
# macOS
brew install gh

# Linux (Ubuntu/Debian)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh -y

# Windows
choco install gh
```

### 3. Git
```bash
# Already installed on most systems
git --version

# If not:
sudo apt-get install git  # Linux
brew install git          # macOS
```

---

## Quick Setup (Automated)

### Run the Setup Script

```bash
cd llm-chat-app
chmod +x init-github.sh
./init-github.sh
```

The script will:
1. ✅ Verify GitHub authentication
2. ✅ Create GitHub repository
3. ✅ Initialize local git
4. ✅ Configure git user
5. ✅ Stage all files
6. ✅ Create initial commit
7. ✅ Push to GitHub
8. ✅ Verify GitHub Actions

**That's it!** Your repository is ready.

---

## Manual Setup (Step-by-Step)

### Step 1: Authenticate with GitHub

```bash
gh auth login
```

Follow the prompts:
- Choose "GitHub.com"
- Choose "HTTPS"
- Authenticate in browser

### Step 2: Create Repository

```bash
gh repo create llm-chat-app \
  --public \
  --description "Local Llama 2 7B Chat Application for Android 14" \
  --source=. \
  --remote=origin \
  --push
```

Or create manually:
1. Go to https://github.com/new
2. Fill in repository details
3. Click "Create repository"

### Step 3: Initialize Local Git

```bash
cd llm-chat-app

# Initialize git
git init

# Configure user
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: LLM Chat APK with Llama 2 7B"

# Set default branch
git branch -M main

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/llm-chat-app.git

# Push to GitHub
git push -u origin main
```

### Step 4: Verify GitHub Actions

1. Go to your repository on GitHub
2. Click **Actions** tab
3. You should see the workflow running
4. Wait for completion (~10-15 minutes)

---

## GitHub Actions Workflow

### Workflow File
Location: `.github/workflows/build-apk.yml`

### What It Does

**Triggers:**
- ✅ On every push to `main` or `develop`
- ✅ On pull requests
- ✅ Manual dispatch (Actions tab)

**Steps:**
1. Checkout code
2. Setup Node.js (v20)
3. Setup Java (17)
4. Setup Android SDK
5. Install Android components
6. Install npm dependencies
7. Create debug keystore
8. Build debug APK
9. Upload artifacts
10. Build release APK (optional)

**Outputs:**
- `llm-chat-app-debug` - Debug APK artifact
- `llm-chat-app-release` - Release APK (if successful)

### Accessing Builds

1. Go to repository → **Actions** tab
2. Click latest workflow run
3. Scroll to **Artifacts** section
4. Download desired APK

---

## Configuration

### Repository Settings

#### Branch Protection
1. Go to **Settings** → **Branches**
2. Click **Add rule**
3. Set branch name pattern: `main`
4. Enable "Require status checks to pass"
5. Select "build" workflow
6. Save

#### Secrets (Optional)
For release builds, add secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add secrets:
   - `KEYSTORE_PASSWORD` - Release keystore password
   - `KEY_ALIAS` - Release key alias
   - `KEY_PASSWORD` - Release key password

### Workflow Customization

Edit `.github/workflows/build-apk.yml`:

```yaml
# Change Node version
node-version: '20'  # or '18', '22'

# Change Java version
java-version: '17'  # or '11', '21'

# Change Android API
"platforms;android-34"  # or "android-33", "android-35"

# Change artifact retention
retention-days: 30  # or 7, 60, 90
```

---

## Workflow Status

### Check Build Status

```bash
# View latest workflow status
gh run list --repo YOUR_USERNAME/llm-chat-app

# View specific run details
gh run view RUN_ID --repo YOUR_USERNAME/llm-chat-app

# View logs
gh run view RUN_ID --log --repo YOUR_USERNAME/llm-chat-app
```

### Common Issues

**Build Failed: "Could not find android.jar"**
- SDK components not installed
- Check workflow logs for details

**Build Failed: "Gradle daemon crashed"**
- Memory issue
- Try increasing heap size in `gradle.properties`

**Build Timeout**
- Workflow took >6 hours
- Check for network issues
- Retry manually

---

## Managing Releases

### Create Release

```bash
# Tag version
git tag v1.0.0

# Push tag (triggers release workflow)
git push origin v1.0.0
```

### Release Notes

Add to your repository:

```markdown
# LLM Chat APK v1.0.0

## Features
- Interactive chat interface
- Llama 2 7B model (2GB allocation)
- Real-time memory monitoring
- Android 14 support

## Installation
1. Download `app-debug.apk`
2. Enable USB debugging
3. Run: `adb install app-debug.apk`

## Requirements
- Android 14+
- 4GB RAM
- 2GB storage
```

---

## Continuous Integration

### Branching Strategy

```
main (stable releases)
  ↑
develop (testing)
  ↑
feature/* (development)
```

### Workflow

1. Create feature branch
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make changes and commit
   ```bash
   git add .
   git commit -m "Add my feature"
   ```

3. Push to GitHub
   ```bash
   git push origin feature/my-feature
   ```

4. Create Pull Request on GitHub

5. GitHub Actions automatically builds

6. Review and merge to `develop`

7. Test on `develop`

8. Merge to `main` for release

---

## Troubleshooting

### Authentication Issues

**Error: "Permission denied (publickey)"**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to GitHub
gh ssh-key add ~/.ssh/id_ed25519.pub

# Test connection
ssh -T git@github.com
```

### Repository Issues

**Error: "fatal: not a git repository"**
```bash
cd /path/to/llm-chat-app
git init
```

**Error: "remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/llm-chat-app.git
```

### Workflow Issues

**Workflow not running**
- Check `.github/workflows/build-apk.yml` exists
- Verify YAML syntax (use YAML validator)
- Check branch name matches trigger

**Artifacts not uploading**
- Check workflow logs for errors
- Verify artifact path is correct
- Check storage quota

---

## Best Practices

### Commit Messages
```bash
# Good
git commit -m "Add voice input feature"
git commit -m "Fix memory leak in chat service"
git commit -m "Update Llama model to Q4"

# Avoid
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

### Pull Requests
- One feature per PR
- Clear description
- Link related issues
- Wait for CI to pass

### Releases
- Use semantic versioning (v1.0.0)
- Tag releases on `main`
- Add release notes
- Update README

---

## Advanced Configuration

### Custom Build Steps

Edit `.github/workflows/build-apk.yml`:

```yaml
- name: Custom Step
  run: |
    echo "Running custom build step"
    # Your commands here
```

### Environment Variables

```yaml
env:
  GRADLE_OPTS: "-Xmx2048m"
  JAVA_TOOL_OPTIONS: "-Dfile.encoding=UTF-8"
```

### Conditional Steps

```yaml
- name: Upload Release APK
  if: startsWith(github.ref, 'refs/tags/')
  run: |
    # Only runs on tagged releases
```

---

## Monitoring

### View Workflow Runs

```bash
# List all runs
gh run list --repo YOUR_USERNAME/llm-chat-app

# List runs for specific branch
gh run list --repo YOUR_USERNAME/llm-chat-app --branch main

# List failed runs
gh run list --repo YOUR_USERNAME/llm-chat-app --status failure
```

### Set Up Notifications

1. Go to GitHub **Settings** → **Notifications**
2. Configure email notifications
3. Choose when to be notified

---

## Support

### GitHub Resources
- GitHub Actions Docs: https://docs.github.com/en/actions
- Workflow Syntax: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- Troubleshooting: https://docs.github.com/en/actions/troubleshooting

### Project Resources
- README.md - User guide
- SETUP.md - Setup instructions
- PROJECT_OVERVIEW.md - Technical details

---

## Next Steps

1. ✅ Run `./init-github.sh`
2. ✅ Wait for first build to complete
3. ✅ Download APK from artifacts
4. ✅ Test on Android device
5. ✅ Make improvements and push
6. ✅ Create releases as needed

---

**You're all set! 🚀**

Your LLM Chat APK project is now on GitHub with automatic builds enabled.

Every push will trigger a new build, and you can download the APK from the Actions tab.

Happy coding!
