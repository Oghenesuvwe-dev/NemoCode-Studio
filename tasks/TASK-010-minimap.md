# TASK-010: Minimap

**Status**: ✅ Complete  
**Phase**: UI Polish  
**Priority**: 🟡 MEDIUM  
**Estimated Time**: 2 hours  
**Dependencies**: TASK-006 (Monaco Editor)

---

## 📋 Description

Add code minimap sidebar showing small overview of entire file with viewport indicator.

---

## ✅ Acceptance Criteria

- [x] Small code overview on right side of editor ✅
- [x] Highlight visible viewport ✅
- [x] Click to jump to location ✅
- [x] Toggle on/off with command ✅
- [x] Configurable width ✅

---

## 📁 Files to Modify

- `tauri-shell/src/App.tsx` (Monaco configuration)
- `tauri-shell/src/contexts/SettingsContext.tsx` (add minimap setting)

---

## 🔧 Implementation Notes

Monaco Editor has built-in minimap. Enable it:

```typescript
<Editor
  options={{
    minimap: {
      enabled: true,
      side: 'right',
      showSlider: 'always',
      renderCharacters: true,
      maxColumn: 120,
    },
    // ... other options
  }}
/>
```

Add toggle in settings.

---

## 🧪 Testing

- [x] Minimap appears on right side ✅
- [x] Viewport indicator visible ✅ (Monaco built-in)
- [x] Click to jump works ✅ (Monaco built-in)
- [x] Toggle on/off works ✅ (Cmd+M)
- [x] Performance is acceptable ✅

---

## 📝 Notes

- Minimap can impact performance on very large files
- Consider disabling for files >10k lines
- Add to settings panel

---

**Created**: December 2, 2025  
**Target Completion**: Week 3
