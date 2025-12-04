# 🛠️ Fix Instructions for VS Code Build

The launch failed because of missing C++ build tools required to compile native modules (specifically `@vscode/policy-watcher`).

## 1. Reinstall Build Tools (Critical Step)
Your current build tools appear to be corrupted or incompatible (C++ standard library errors). You must **force reinstall** them:

1.  **Delete existing tools:**
    ```bash
    sudo rm -rf /Library/Developer/CommandLineTools
    ```
    *(Enter your password if prompted)*

2.  **Install fresh tools:**
    ```bash
    xcode-select --install
    ```
    *(A dialog will pop up. Click "Install" and wait for it to finish)*

3.  **Verify path:**
    ```bash
    xcode-select -p
    ```
    *(Should output: `/Library/Developer/CommandLineTools`)*

## 2. Verify Node Version
Ensure your Node.js version matches the project requirements (approx v20-v22).
```bash
node -v
```

## 3. Rebuild Native Modules
Once the tools are installed, run the following to fix the broken module:

```bash
cd vscode
npm rebuild @vscode/policy-watcher
```

## 4. Retry Launch
After the rebuild succeeds, you can try the start script again:
```bash
./start.sh
```
