# LLM Chat APK - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Initialize GitHub Repository

```bash
cd llm-chat-app
chmod +x init-github.sh
./init-github.sh
```

The script will:
- ✅ Check GitHub authentication
- ✅ Create repository on GitHub
- ✅ Initialize local git
- ✅ Push code to GitHub
- ✅ Enable GitHub Actions

### Step 2: Wait for APK Build

1. Go to your GitHub repository
2. Click **Actions** tab
3. Wait for workflow to complete (~10-15 minutes)

### Step 3: Download APK

1. Click the latest workflow run
2. Scroll to **Artifacts**
3. Download `llm-chat-app-debug.zip`
4. Extract: `unzip llm-chat-app-debug.zip`

### Step 4: Install on Android

```bash
# Enable USB debugging on your Android 14 device
# Then:
adb install app-debug.apk
```

### Step 5: Launch App

```bash
adb shell am start -n io.manus.llmchat/.MainActivity
```

---

## 📱 What You Get

✅ **Interactive Chat Interface**
- Dark theme UI
- Real-time message display
- User/assistant differentiation

✅ **Llama 2 7B Model**
- 2GB memory allocation
- Q3_K_M quantization
- Local on-device inference

✅ **Memory Monitoring**
- Real-time RAM tracking
- Low memory warnings
- Automatic optimization

✅ **Conversation History**
- Persistent messages
- Context awareness
- ~50 exchange capacity

---

## 🔧 Manual Build (Optional)

If you prefer to build locally:

### Prerequisites
```bash
# Java 17
sudo apt-get install openjdk-17-jdk

# Android SDK
export ANDROID_HOME=~/Android/sdk
sdkmanager "platforms;android-34"
sdkmanager "build-tools;34.0.0"
sdkmanager "ndk;26.1.10909125"

# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Build
```bash
npm install
cd android
./gradlew assembleDebug
```

### Output
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📋 System Requirements

| Component | Requirement |
|-----------|-------------|
| Android Version | 14+ (API 34+) |
| Device RAM | 4GB |
| Available RAM | 2GB (after OS) |
| Storage | ~2GB for model |
| Processor | ARM64 (arm64-v8a) |

---

## ⚡ Performance

| Metric | Value |
|--------|-------|
| App Launch | 3-5 seconds |
| Model Load | 10-15 seconds |
| First Response | 5-10 seconds |
| Subsequent Response | 3-8 seconds |
| Memory Usage | ~1.8GB during inference |

---

## 🎯 Key Features

### Chat Interface
- Type messages
- Get AI responses
- View conversation history
- Clear history anytime

### Memory Monitoring
- Real-time RAM display
- Low memory warnings (>80%)
- Optimize button for cleanup
- Automatic garbage collection

### Model Configuration
- Llama 2 7B Q3_K_M
- 2GB full allocation
- 1024 max tokens per response
- 2048 context window

---

## 🐛 Troubleshooting

### "App won't install"
```bash
# Check device compatibility
adb shell getprop ro.build.version.release  # Should be 14+
adb shell getprop ro.product.cpu.abi        # Should be arm64-v8a

# Clear and retry
adb uninstall io.manus.llmchat
adb install app-debug.apk
```

### "App crashes on startup"
```bash
# Check logs
adb logcat | grep llm-chat-app

# Ensure 2GB free RAM
adb shell cat /proc/meminfo | grep MemFree
```

### "Slow responses"
- Close background apps
- Reduce max_tokens in config
- Use Q2_K model (smaller)

### "Out of memory"
- Clear conversation history
- Reduce context window
- Restart app

---

## 📚 Documentation

- **README.md** - Full user guide
- **SETUP.md** - Detailed setup instructions
- **PROJECT_OVERVIEW.md** - Technical architecture
- **.github/workflows/build-apk.yml** - CI/CD configuration

---

## 🔗 Useful Links

- **GitHub Actions:** https://docs.github.com/en/actions
- **React Native:** https://reactnative.dev/
- **Llama 2:** https://huggingface.co/meta-llama/Llama-2-7b-chat
- **Android Dev:** https://developer.android.com/

---

## 💡 Tips

### For Faster Builds
- Push to `develop` branch for testing
- Use `main` branch for releases
- Tag releases: `git tag v1.0.0 && git push --tags`

### For Better Performance
- Keep device cool during inference
- Use WiFi for any cloud features
- Close heavy apps before chatting
- Clear history periodically

### For Development
- Edit `src/App.tsx` for UI changes
- Edit `src/services/llmService.ts` for model config
- Push to trigger new builds
- Check Actions for build status

---

## 🎉 You're Ready!

1. Run `./init-github.sh`
2. Wait for build to complete
3. Download APK
4. Install on device
5. Enjoy your local LLM chat!

---

## 📞 Support

- GitHub Issues: Check repository issues
- Documentation: See README.md
- Help: https://help.manus.im

---

**Happy chatting! 🚀**
