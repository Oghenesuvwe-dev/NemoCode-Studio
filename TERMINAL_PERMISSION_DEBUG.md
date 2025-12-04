# Terminal Permission Debugging - Dec 3, 2024

## Issue
Terminal shows: "Terminal initialization failed. Please check Tauri permissions."

## Root Cause Analysis

The terminal is failing to spawn shell processes due to Tauri v2 permission configuration.

## Configuration Applied

### File: `tauri-shell/src-tauri/capabilities/default.json`

```json
{
  "identifier": "shell:allow-spawn",
  "allow": [
    {
      "name": "/bin/zsh",
      "args": true
    },
    {
      "name": "/bin/bash",
      "args": true
    },
    {
      "name": "/bin/sh",
      "args": true
    },
    {
      "name": "powershell.exe",
      "args": true
    },
    {
      "name": "cmd.exe",
      "args": true
    }
  ]
}
```

## Key Points

1. **Tauri v2 Permissions**: Shell spawn requires explicit permission with allowed commands
2. **Rebuild Required**: Changes to capabilities require a full Rust rebuild
3. **Fallback Shells**: The terminal tries zsh → bash → sh in order
4. **Args Permission**: `"args": true` allows passing arguments like `-l` for login shell

## Terminal Component Logic

```typescript
// Primary shell
const shell = isWindows ? 'powershell.exe' : '/bin/zsh';
const shellArgs = isWindows ? ['-NoLogo', '-NoExit'] : ['-l'];

// Fallback shells if primary fails
const fallbackShells = ['/bin/bash', '/bin/sh'];
```

## Testing Steps

1. ✅ Updated capabilities/default.json with shell:allow-spawn
2. ⏳ Rebuilding Tauri app (cargo rebuild in progress)
3. ⏳ Test terminal initialization
4. ⏳ Verify shell commands execute properly

## Expected Behavior After Fix

- Terminal should show: "NemoCode Terminal" header
- Shell prompt should appear (zsh/bash/sh)
- Commands should execute normally
- No permission errors

## Alternative Approaches if This Fails

1. **Use shell:default with broader permissions**
2. **Add shell:allow-execute for command execution**
3. **Check CSP (Content Security Policy) in tauri.conf.json**
4. **Enable shell plugin explicitly in plugins section**
5. **Check for macOS security/privacy settings blocking shell access**

## Build Status

Currently rebuilding with new permissions...
- Compilation progress: ~25% (114/418 crates)
- Estimated time: 2-3 minutes for full rebuild
