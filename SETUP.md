# LLM Chat APK - Setup & Build Instructions

## Quick Start

### Option 1: Automatic Build via GitHub Actions (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: LLM Chat APK"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/llm-chat-app.git
   git push -u origin main
   ```

2. **GitHub Actions will automatically:**
   - Build the APK
   - Upload as artifact
   - Create release (if tagged)

3. **Download APK:**
   - Go to Actions tab → Latest workflow run
   - Download `llm-chat-app-debug` artifact
   - Extract and install on Android device

### Option 2: Local Build

#### Prerequisites

- **Java 17+**
  ```bash
  sudo apt-get install openjdk-17-jdk
  ```

- **Android SDK**
  ```bash
  # Download from: https://developer.android.com/studio/command-line-tools
  export ANDROID_HOME=~/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
  
  sdkmanager "platforms;android-34"
  sdkmanager "build-tools;34.0.0"
  sdkmanager "ndk;26.1.10909125"
  ```

- **Node.js 18+**
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

#### Build Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build debug APK**
   ```bash
   cd android
   chmod +x gradlew
   ./gradlew assembleDebug
   ```

3. **APK location**
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

4. **Install on device**
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

## Installation on Android Device

### Prerequisites
- Android 14 (API 34) or higher
- 4GB RAM (2GB available for app)
- ~2GB storage for model

### Steps

1. **Enable Developer Mode**
   - Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect via USB**
   ```bash
   adb devices
   ```

3. **Install APK**
   ```bash
   adb install app-debug.apk
   ```

4. **Launch App**
   ```bash
   adb shell am start -n io.manus.llmchat/.MainActivity
   ```

## Model Integration

### Download Llama 2 7B Model

The app expects a quantized Llama 2 7B model. Download from:

**Option A: GGUF Format (Recommended)**
```bash
# Download Q3_K_M quantization (~2GB)
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q3_K_M.gguf
```

**Option B: ONNX Format**
```bash
# Download ONNX quantized model
wget https://huggingface.co/microsoft/Llama-2-7b-chat-onnx/resolve/main/model.onnx
```

### Place Model in App

1. **Create assets directory**
   ```bash
   mkdir -p android/app/src/main/assets/models
   ```

2. **Copy model file**
   ```bash
   cp llama-2-7b-chat.Q3_K_M.gguf android/app/src/main/assets/models/
   ```

3. **Rebuild APK**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

## Troubleshooting

### Build Errors

**Error: "Could not find android.jar"**
```bash
# Ensure SDK is installed
sdkmanager "platforms;android-34"
```

**Error: "Gradle daemon crashed"**
```bash
cd android
./gradlew clean
./gradlew assembleDebug --no-daemon
```

### Installation Issues

**Error: "app not installed"**
```bash
# Check device compatibility
adb shell getprop ro.build.version.release  # Should be 14+
adb shell getprop ro.product.cpu.abi        # Should be arm64-v8a

# Clear existing installation
adb shell pm clear io.manus.llmchat
adb install app-debug.apk
```

**Error: "Insufficient storage"**
```bash
# Check available space
adb shell df /data

# Free up space (remove old APK)
adb uninstall io.manus.llmchat
```

### Runtime Issues

**App crashes on startup**
```bash
# Check logcat
adb logcat | grep llm-chat-app
```

**Model not loading**
- Verify model file exists in assets
- Check model format matches inference engine
- Ensure device has 2GB free RAM

**Out of memory errors**
- Close background apps
- Reduce conversation history
- Use lower quantization model (Q2_K)

## Performance Optimization

### For 2GB RAM Devices

1. **Model Selection**
   - Use Q3_K_M quantization (fits in 2GB)
   - Avoid Q4_K_M or higher

2. **Memory Management**
   - Limit context window to 2048 tokens
   - Keep conversation history to ~50 exchanges
   - Clear history periodically

3. **Inference Speed**
   - Reduce max_tokens to 512
   - Use lower temperature (0.5)
   - Batch size = 1

## Development

### Project Structure
```
llm-chat-app/
├── src/                          # React Native source
│   ├── App.tsx                   # Main app component
│   ├── store/                    # State management
│   └── services/                 # LLM & memory services
├── android/                      # Android native code
│   ├── app/
│   │   ├── build.gradle          # App build config
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       ├── java/             # Java/Kotlin code
│   │       └── res/              # Resources
│   └── build.gradle              # Project build config
├── package.json                  # Dependencies
└── README.md                      # Documentation
```

### Hot Reload
```bash
npm start
# Press 'a' for Android
```

### Debug Mode
```bash
cd android
./gradlew assembleDebug
adb install android/app/build/outputs/apk/debug/app-debug.apk
adb logcat -s ReactNativeJS
```

## API Reference

### Chat Store
```typescript
import { useChatStore } from '@/store/chatStore';

const { 
  messages, 
  isLoading, 
  addMessage, 
  clearMessages 
} = useChatStore();
```

### LLM Service
```typescript
import { llmService } from '@/services/llmService';

// Initialize model
await llmService.initialize();

// Generate response
const response = await llmService.generateResponse(prompt);
console.log(response.text);      // Generated text
console.log(response.tokens);    // Token count
console.log(response.duration);  // Inference time
```

### Memory Service
```typescript
import { memoryService } from '@/services/memoryService';

// Start monitoring
memoryService.startMonitoring(5000);

// Subscribe to updates
const unsubscribe = memoryService.subscribe((info) => {
  console.log(`Memory: ${info.usedMemory}MB / ${info.totalMemory}MB`);
  console.log(`Usage: ${info.usagePercent}%`);
  console.log(`Low memory: ${info.isLowMemory}`);
});

// Optimize memory
await memoryService.optimizeMemory();

// Stop monitoring
memoryService.stopMonitoring();
```

## Support

For issues or questions:
- GitHub Issues: https://github.com/YOUR_USERNAME/llm-chat-app/issues
- Documentation: See README.md
- Help: https://help.manus.im

## License

MIT License - See LICENSE file for details
