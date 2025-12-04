# Window Drag and Terminal Fixes - Dec 3, 2024

## Issues Fixed

### 1. Window Dragging on Mouse Down
**Problem**: Entire window was being dragged when trying to select text, resize panels, or click buttons.

**Root Cause**: The TitleBar component had `data-tauri-drag-region` and `WebkitAppRegion: 'drag'` applied to the entire container and multiple child elements, making everything draggable.

**Solution**: 
- Removed drag region from the main container
- Applied drag region ONLY to the branding area (left side)
- Explicitly set `WebkitAppRegion: 'no-drag'` on interactive elements (buttons, deploy button)
- Added explicit no-drag styling to the right-side view toggle buttons

**Files Modified**:
- `tauri-shell/src/components/TitleBar.tsx`

### 2. Severe Resize Flickering
**Problem**: Window resize caused severe visual flickering in Monaco editor and other components.

**Root Cause**: 
- Insufficient debounce time (150ms)
- CSS transitions and animations still running during resize
- Monaco editor animations not fully disabled

**Solution**:
- Increased debounce timeout from 150ms to 500ms
- Enhanced CSS to disable ALL transitions, animations, and transforms during resize
- Added `pointer-events: none` during resize to prevent interaction issues
- Disabled Monaco-specific animations (view-lines, minimap, decorationsOverviewRuler, scrollable-element)
- Added GPU acceleration with `transform: translateZ(0)` and `backface-visibility: hidden`
- Set `will-change: auto` to prevent browser optimization conflicts

**Files Modified**:
- `tauri-shell/src/App.tsx` - Increased debounce to 500ms
- `tauri-shell/src/App.css` - Comprehensive anti-flicker CSS

### 3. Terminal Initialization Failed
**Problem**: Terminal showed "Terminal initialization failed. Please check Tauri permissions."

**Root Cause**: Insufficient shell spawn permissions in Tauri capabilities configuration.

**Solution**:
- Added comprehensive shell permissions including `/bin/sh` fallback
- Added explicit `sidecar: false` flag to shell spawn permissions
- Added core window dragging permission
- Added comprehensive file system permissions
- Added dialog permissions

**Files Modified**:
- `tauri-shell/src-tauri/capabilities/default.json`

## Technical Details

### Drag Region Strategy
```typescript
// DRAGGABLE: Only the branding area
<div 
  data-tauri-drag-region
  style={{ WebkitAppRegion: 'drag' }}
>
  NemoCode Studio
</div>

// NOT DRAGGABLE: Buttons and interactive elements
<button style={{ WebkitAppRegion: 'no-drag' }}>
  Deploy
</button>
```

### Anti-Flicker CSS Strategy
```css
/* Disable everything during resize */
.resizing * {
  transition: none !important;
  animation: none !important;
  pointer-events: none !important;
}

/* GPU acceleration for smooth rendering */
.monaco-editor {
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

### Shell Permissions Strategy
```json
{
  "identifier": "shell:allow-spawn",
  "allow": [
    { "name": "/bin/zsh", "args": true, "sidecar": false },
    { "name": "/bin/bash", "args": true, "sidecar": false },
    { "name": "/bin/sh", "args": true, "sidecar": false }
  ]
}
```

## Testing Checklist

- [ ] Window can be dragged by clicking on "NemoCode Studio" branding
- [ ] Window CANNOT be dragged by clicking buttons or editor area
- [ ] Text selection in Monaco editor works without dragging window
- [ ] Panel resize handles work without dragging window
- [ ] Window resize shows minimal/no flickering
- [ ] Terminal initializes successfully with shell prompt
- [ ] Terminal commands execute properly
- [ ] All keyboard shortcuts still work

## Next Steps

1. Test on macOS to verify drag behavior
2. Test terminal with different shells (zsh, bash, sh)
3. Monitor for any remaining flicker during rapid resize
4. Consider adding resize throttling if needed
